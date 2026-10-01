import "fake-indexeddb/auto";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ParentScreen } from "@/components/parent/parent-screen";
import { lessonContentUrl, summarizeLesson } from "@/content";
import {
  LOCAL_FAMILY_ID,
  PARENT_PIN_LOCK_MINUTES,
  PARENT_PIN_MAX_FAILS,
  PARENT_SESSION_MINUTES,
} from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { putProfile } from "@/progress/db";
import {
  appDb,
  CONTENT_INDEX_URL,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  resetLessonsForTesting,
} from "@/progress/hooks";
import { savePin } from "@/progress/parent-pin";
import {
  closeParentSession,
  openParentSession,
} from "@/progress/parent-session";
import { recordAttempt } from "@/progress/record";
import type { ContentIndex } from "@/schema/content";
import { learnLesson } from "../../learn/helpers";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const START = new Date("2026-09-30T02:00:00Z");
let clock = START;

function advance(minutes: number) {
  clock = new Date(clock.getTime() + minutes * 60_000);
}

afterEach(async () => {
  closeParentSession();
  await appDb().delete();
  resetAppDbForTesting();
  resetContentIndexForTesting();
  resetLessonsForTesting();
  setNowForTesting(null);
  vi.unstubAllGlobals();
  clock = START;
});

function useClock() {
  setNowForTesting(() => clock);
}

async function typePin(label: string | RegExp, pin: string) {
  fireEvent.change(await screen.findByLabelText(label), {
    target: { value: pin },
  });
}

describe("ParentScreen PIN gate", () => {
  it("sets a PIN typed twice, opens the page and locks it again", async () => {
    useClock();
    render(<ParentScreen />);

    await typePin("PIN mới", "2468");
    fireEvent.click(screen.getByRole("button", { name: "Tiếp tục" }));
    await typePin("Nhập lại PIN để xác nhận", "2468");
    fireEvent.click(screen.getByRole("button", { name: "Lưu PIN" }));

    expect(
      await screen.findByText("Máy này chưa có hồ sơ con nào."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Khoá lại" }));
    expect(await screen.findByLabelText("Nhập PIN")).toBeInTheDocument();

    await typePin("Nhập PIN", "2468");
    fireEvent.click(screen.getByRole("button", { name: "Mở trang phụ huynh" }));
    expect(
      await screen.findByText("Máy này chưa có hồ sơ con nào."),
    ).toBeInTheDocument();
  });

  it("starts over when the two PINs differ, and only accepts digits", async () => {
    render(<ParentScreen />);
    const save = await screen.findByRole("button", { name: "Tiếp tục" });
    await typePin("PIN mới", "12ab");
    expect(screen.getByLabelText("PIN mới")).toHaveValue("12");
    expect(save).toBeDisabled();

    await typePin("PIN mới", "1234");
    fireEvent.click(save);
    await typePin("Nhập lại PIN để xác nhận", "4321");
    fireEvent.click(screen.getByRole("button", { name: "Lưu PIN" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Hai lần nhập chưa giống nhau",
    );
    expect(screen.getByLabelText("PIN mới")).toHaveValue("");
  });

  it("counts wrong PINs, locks after the last one and lifts the lock later", async () => {
    useClock();
    await savePin(appDb(), "1357");
    render(<ParentScreen />);

    for (let left = PARENT_PIN_MAX_FAILS - 1; left > 0; left--) {
      await typePin("Nhập PIN", "0000");
      fireEvent.click(
        screen.getByRole("button", { name: "Mở trang phụ huynh" }),
      );
      await waitFor(() =>
        expect(screen.getByRole("alert")).toHaveTextContent(
          `Còn ${left} lần thử`,
        ),
      );
    }
    await typePin("Nhập PIN", "0000");
    fireEvent.click(screen.getByRole("button", { name: "Mở trang phụ huynh" }));
    expect(await screen.findByText(/trang tạm khoá/)).toHaveTextContent(
      `${PARENT_PIN_LOCK_MINUTES} phút`,
    );
    expect(screen.queryByLabelText("Nhập PIN")).toBeNull();
    expect(screen.getByText("Quên PIN?")).toBeInTheDocument();

    // A fresh page load still shows the lock.
    cleanup();
    render(<ParentScreen />);
    expect(await screen.findByText(/trang tạm khoá/)).toBeInTheDocument();
    cleanup();

    advance(PARENT_PIN_LOCK_MINUTES + 1);
    render(<ParentScreen />);
    expect(await screen.findByLabelText("Nhập PIN")).toBeInTheDocument();
    expect(screen.queryByText(/trang tạm khoá/)).toBeNull();
  });

  it("closes the session after the configured minutes", async () => {
    useClock();
    await savePin(appDb(), "1357");
    // Opened almost a whole session ago, so it runs out moments from now.
    openParentSession(
      new Date(START.getTime() - PARENT_SESSION_MINUTES * 60_000 + 200),
    );
    render(<ParentScreen />);
    expect(
      screen.getByRole("button", { name: "Khoá lại" }),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Nhập PIN")).toBeInTheDocument();
  });
});

describe("ParentScreen dashboard", () => {
  it("shows the child's study time, lessons, missed questions and writing", async () => {
    useClock();
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
        return new Response(JSON.stringify(body), {
          status: body ? 200 : 404,
        });
      }),
    );
    const db = appDb();
    await putProfile(db, {
      id: "na",
      familyId: LOCAL_FAMILY_ID,
      name: "Bé Na",
      avatar: "fox",
      grade: 6,
      series: { math: "kntt" },
      createdAt: START.toISOString(),
    });
    const scope = { familyId: LOCAL_FAMILY_ID, childId: "na" };
    await recordAttempt(
      db,
      {
        ...scope,
        exerciseId: `${lesson.id}.ex.luyen-a`,
        lessonId: lesson.id,
        cardIds: [`${lesson.id}.card.a`],
        firstTryCorrect: false,
        wrongCount: 2,
        context: "practice",
      },
      START,
    );
    await db.writings.add({
      ...scope,
      id: "w1",
      exerciseId: `${lesson.id}.ex.viet`,
      text: "Bạn em tên là Minh.",
      checks: [{ criterion: "Có tên bạn", met: true }],
      at: START.toISOString(),
    });
    await savePin(db, "1357");

    render(<ParentScreen />);
    await typePin("Nhập PIN", "1357");
    fireEvent.click(screen.getByRole("button", { name: "Mở trang phụ huynh" }));

    const time = await screen.findByRole("region", { name: "Thời gian học" });
    expect(within(time).getByText("Hôm nay").nextSibling).toHaveTextContent(
      "1 phút",
    );
    expect(
      within(time).getByText("Chuỗi ngày học").nextSibling,
    ).toHaveTextContent("1 ngày");
    const lessons = screen.getByRole("region", { name: "Tiến độ bài học" });
    expect(lessons).toHaveTextContent("Bài học thử");
    expect(lessons).toHaveTextContent("Xong 0/1 phần");

    const wrong = screen.getByRole("region", { name: "Câu hay sai" });
    await waitFor(() => expect(wrong).toHaveTextContent("Câu luyện A"));
    expect(wrong).toHaveTextContent("Sai 2 lần trong 1 lượt làm · Bài học thử");

    const cards = screen.getByRole("region", { name: "Thẻ hay quên" });
    // Everything was just practised, so nothing is below the forgetting threshold yet.
    expect(cards.querySelectorAll("[data-parent-card]")).toHaveLength(0);
    expect(cards).toHaveTextContent("chưa có thẻ nào con sắp quên");

    const writings = screen.getByRole("region", { name: "Bài viết của con" });
    await waitFor(() => expect(writings).toHaveTextContent("Viết về bạn"));
    expect(writings).toHaveTextContent("Bạn em tên là Minh.");
    expect(writings).toHaveTextContent("Đã tích: Có tên bạn");
  });
});
