import "fake-indexeddb/auto";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChildReport } from "@/components/parent/child-report";
import { lessonContentUrl, summarizeLesson } from "@/content";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import {
  awardSticker,
  listAttempts,
  listStickers,
  type ProfileRecord,
  putProfile,
} from "@/progress/db";
import {
  appDb,
  CONTENT_INDEX_URL,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  resetLessonsForTesting,
} from "@/progress/hooks";
import { recordAttempt } from "@/progress/record";
import * as reset from "@/progress/reset";
import type { ContentIndex } from "@/schema/content";
import { LESSON_ID, learnLesson } from "../../learn/helpers";

vi.mock("@/progress/reset", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/progress/reset")>();
  return { ...actual, resetLessonProgress: vi.fn(actual.resetLessonProgress) };
});

const NOW = new Date("2026-09-30T02:00:00Z");
const NA: ProfileRecord = {
  id: "na",
  familyId: LOCAL_FAMILY_ID,
  name: "Bé Na",
  avatar: "fox",
  grade: 6,
  series: { math: "kntt" },
  createdAt: NOW.toISOString(),
  updatedAt: NOW.toISOString(),
};
const NA_SCOPE = { familyId: LOCAL_FAMILY_ID, childId: NA.id };

function stubContent() {
  const lesson = learnLesson();
  const index: ContentIndex = {
    subjects: [
      {
        id: "math",
        name: "Toán",
        color: "blue",
        icon: "calculator",
        language: "vi",
        rules: {
          checkExpr: false,
          verbatimPassage: false,
          requiresOpenEnded: false,
        },
        series: [{ id: "kntt", name: "Kết nối", grade: 6 }],
        defaultSeries: "kntt",
      },
    ],
    lessons: [summarizeLesson(lesson)],
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const body =
        url === CONTENT_INDEX_URL
          ? index
          : url === lessonContentUrl(lesson.id)
            ? lesson
            : null;
      return new Response(JSON.stringify(body), { status: body ? 200 : 404 });
    }),
  );
}

async function answerOnce() {
  await recordAttempt(
    appDb(),
    {
      ...NA_SCOPE,
      exerciseId: `${LESSON_ID}.ex.luyen-a`,
      lessonId: LESSON_ID,
      cardIds: [`${LESSON_ID}.card.a`],
      firstTryCorrect: true,
      wrongCount: 0,
      context: "practice",
    },
    NOW,
  );
}

const resetLesson = vi.mocked(reset.resetLessonProgress);

beforeEach(async () => {
  setNowForTesting(() => NOW);
  stubContent();
  await putProfile(appDb(), NA);
});

afterEach(async () => {
  cleanup();
  await appDb().delete();
  resetAppDbForTesting();
  resetContentIndexForTesting();
  resetLessonsForTesting();
  setNowForTesting(null);
  vi.unstubAllGlobals();
  resetLesson.mockClear();
});

async function openLessons() {
  render(<ChildReport profile={NA} />);
  return screen.findByRole("region", { name: "Tiến độ bài học" });
}

describe("Học lại bài này on the parent page", () => {
  it("is hidden for a lesson with nothing recorded, even with its sticker", async () => {
    await awardSticker(appDb(), NA_SCOPE, LESSON_ID, NOW);
    const lessons = await openLessons();
    await waitFor(() =>
      expect(lessons).toHaveTextContent("Xong 0/1 phần · có sticker"),
    );
    expect(
      within(lessons).queryByRole("button", { name: "Học lại bài này" }),
    ).toBeNull();
  });

  it("explains what is erased, and cancelling at either step erases nothing", async () => {
    await answerOnce();
    const lessons = await openLessons();
    fireEvent.click(
      await within(lessons).findByRole("button", { name: "Học lại bài này" }),
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Học lại bài này",
    });
    for (const text of [
      "Tiến độ các phần và vị trí con đang học",
      "Dữ liệu ôn tập",
      "kể cả câu con bỏ qua",
      "Bài viết con đã nộp",
      "Sticker con đã nhận vẫn được giữ",
    ]) {
      expect(dialog).toHaveTextContent(text);
    }
    fireEvent.click(within(dialog).getByRole("button", { name: "Hủy" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(
      within(lessons).getByRole("button", { name: "Học lại bài này" }),
    );
    const again = await screen.findByRole("dialog");
    fireEvent.click(within(again).getByRole("button", { name: "Tiếp tục" }));
    expect(again).toHaveTextContent("Việc này không hoàn tác được");
    fireEvent.click(within(again).getByRole("button", { name: "Hủy" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    expect(resetLesson).not.toHaveBeenCalled();
    expect(await listAttempts(appDb(), NA_SCOPE)).toHaveLength(1);
  });

  it("closes on Escape without erasing", async () => {
    await answerOnce();
    const lessons = await openLessons();
    fireEvent.click(
      await within(lessons).findByRole("button", { name: "Học lại bài này" }),
    );
    await screen.findByRole("dialog");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(resetLesson).not.toHaveBeenCalled();
  });

  it("confirming resets that child's lesson once, keeps the sticker and refreshes the page", async () => {
    await answerOnce();
    await awardSticker(appDb(), NA_SCOPE, LESSON_ID, NOW);
    const lessons = await openLessons();
    fireEvent.click(
      await within(lessons).findByRole("button", { name: "Học lại bài này" }),
    );
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Tiếp tục" }));
    expect(resetLesson).not.toHaveBeenCalled();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Xoá và học lại" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Đã cho Bé Na học lại bài “Bài học thử”. Sticker vẫn được giữ.",
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(resetLesson).toHaveBeenCalledTimes(1);
    expect(resetLesson).toHaveBeenCalledWith(
      expect.anything(),
      NA_SCOPE,
      LESSON_ID,
      NOW,
    );
    expect(await listAttempts(appDb(), NA_SCOPE)).toEqual([]);
    expect(await listStickers(appDb(), NA_SCOPE)).toHaveLength(1);
    // The row now has nothing to erase, and its sticker is still in colour.
    await waitFor(() =>
      expect(
        within(lessons).queryByRole("button", { name: "Học lại bài này" }),
      ).toBeNull(),
    );
    expect(lessons.querySelector("[data-sticker-earned=true]")).not.toBeNull();
  });
});
