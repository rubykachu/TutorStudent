import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SectionPlayer } from "@/learn/section-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import {
  type ChildScope,
  getCardStates,
  listAttempts,
  listStickers,
  listWritings,
  SECTION_START,
  type SectionPosition,
  TutorDb,
} from "@/progress/db";
import type { Lesson } from "@/schema/content";
import {
  CARD_A,
  CARD_B,
  LESSON_ID,
  learnIndex,
  learnLesson,
  SECTION_ID,
} from "./helpers";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const AT = new Date("2026-03-02T01:00:00Z");

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
  // Each read moves the clock on, so answers keep their order by time.
  let tick = 0;
  setNowForTesting(() => new Date(AT.getTime() + 1000 * tick++));
});

afterEach(async () => {
  await db.delete();
  setNowForTesting(null);
});

function renderPlayer(
  initialPosition: SectionPosition = SECTION_START,
  overrides: Partial<Lesson> = {},
) {
  const index = learnIndex(overrides);
  const section = index.sectionById.get(SECTION_ID);
  if (!section) throw new Error("section missing");
  return render(
    <SectionPlayer
      db={db}
      index={index}
      section={section}
      scope={scope}
      initialPosition={initialPosition}
    />,
  );
}

function tap(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

// Picks an option of the choice on screen, checks it and, once accepted,
// waits for the next step to replace the question.
async function answer(question: string, options: string[]) {
  expect(screen.getByText(question)).toBeInTheDocument();
  for (const option of options) {
    tap(option);
    tap("Kiểm tra");
  }
  tap("Tiếp");
  await waitFor(() => expect(screen.queryByText(question)).toBeNull());
}

function sectionRecord() {
  return db.sectionProgress.get([scope.familyId, scope.childId, SECTION_ID]);
}

describe("SectionPlayer", () => {
  it("plays blocks, checks, practice and recap, then saves the results", async () => {
    renderPlayer();
    expect(screen.getByText("Khối thứ nhất")).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 6")).toBeInTheDocument();
    await waitFor(async () =>
      expect(await sectionRecord()).toMatchObject({
        state: "in_progress",
        position: SECTION_START,
      }),
    );

    tap("Tiếp");
    expect(screen.getByText("Khối thứ hai")).toBeInTheDocument();
    tap("Tiếp");

    expect(screen.getByText("Bài tập · Kiểm tra nhanh")).toBeInTheDocument();
    await answer("Câu kiểm tra", ["Sai", "Đúng"]);
    expect(screen.getByText("Bài tập · Luyện tập")).toBeInTheDocument();
    await answer("Câu luyện A", ["Sai", "Đúng"]);
    await answer("Câu luyện B", ["Đúng"]);

    expect(screen.getByText("Nhớ nhé!")).toBeInTheDocument();
    tap("Xong phần");
    expect(await screen.findByText("Giỏi quá!")).toBeInTheDocument();
    // Earning the sticker is celebrated with confetti.
    expect(document.querySelector("[data-confetti]")).not.toBeNull();

    const attempts = await listAttempts(db, scope);
    expect(
      attempts.map((a) => [a.exerciseId, a.context, a.firstTryCorrect]),
    ).toEqual([
      [`${LESSON_ID}.ex.kiem-tra`, "check", false],
      [`${LESSON_ID}.ex.luyen-a`, "practice", false],
      [`${LESSON_ID}.ex.luyen-b`, "practice", true],
    ]);
    // Only practice opens cards: A was missed first (Again), B was not.
    const states = await getCardStates(db, scope, LESSON_ID);
    expect(states.map((s) => [s.cardId, s.lapses, s.reps]).sort()).toEqual([
      [CARD_A, 0, 1],
      [CARD_B, 0, 1],
    ]);
    expect(await sectionRecord()).toMatchObject({
      state: "done",
      position: SECTION_START,
    });
    expect(await listStickers(db, scope)).toHaveLength(1);
  });

  it("shows a group of blocks on one screen and counts it as one step", async () => {
    const [first] = learnLesson().sections;
    if (!first) throw new Error("section missing");
    renderPlayer(SECTION_START, {
      sections: [
        {
          ...first,
          blocks: [
            {
              type: "group",
              children: [
                { type: "note", text: "Câu quy tắc" },
                { type: "note", text: "Câu ví dụ" },
              ],
            },
          ],
        },
      ],
    });
    expect(screen.getByText("Câu quy tắc")).toBeInTheDocument();
    expect(screen.getByText("Câu ví dụ")).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 5")).toBeInTheDocument();
    tap("Tiếp");
    expect(screen.getByText("Bài tập · Kiểm tra nhanh")).toBeInTheDocument();
    // Let the saved position land before the database is dropped.
    await waitFor(async () =>
      expect(await sectionRecord()).toMatchObject({
        position: { phase: "check", index: 0 },
      }),
    );
  });

  it("resumes on the saved item and saves each move", async () => {
    renderPlayer({ phase: "practice", index: 1 });
    expect(screen.getByText("Câu luyện B")).toBeInTheDocument();
    expect(screen.getByText("Bước 5 trên 6")).toBeInTheDocument();
    await answer("Câu luyện B", ["Đúng"]);
    await waitFor(async () =>
      expect(await sectionRecord()).toMatchObject({
        state: "in_progress",
        position: { phase: "recap", index: 0 },
      }),
    );
  });

  it("records open-ended steps with cards as practice and saves the writing", async () => {
    const base = learnLesson();
    const [first] = base.sections;
    renderPlayer(
      { phase: "practice", index: 0 },
      {
        sections: [
          {
            ...first,
            practiceIds: [`${LESSON_ID}.ex.viet`],
          },
          { ...first, id: `${LESSON_ID}.section.two` },
        ],
      },
    );
    await answer("Bước một", ["Đúng"]);
    fireEvent.change(screen.getByLabelText("Bài viết của em"), {
      target: { value: "Bạn em tên là Lan." },
    });
    tap("Xong");
    tap("Hoàn thành");

    expect(await screen.findByText("Nhớ nhé!")).toBeInTheDocument();
    const attempts = await listAttempts(db, scope);
    expect(attempts.map((a) => [a.exerciseId, a.context, a.cardIds])).toEqual([
      [`${LESSON_ID}.ex.buoc`, "practice", [CARD_B]],
    ]);
    const writings = await listWritings(db, scope);
    expect(writings).toMatchObject([
      { exerciseId: `${LESSON_ID}.ex.viet`, text: "Bạn em tên là Lan." },
    ]);

    tap("Xong phần");
    // Another section is still open: no sticker, and it is offered next.
    expect(await screen.findByText("Xong phần này!")).toBeInTheDocument();
    // The finished section is celebrated too, with confetti around the owl.
    expect(document.querySelector("[data-confetti]")).not.toBeNull();
    // Praise names the section; progress says how far the sticker is.
    expect(
      screen.getByText("Bạn vừa học xong “Phần một”. Giỏi lắm!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Xong 1/2 phần")).toBeInTheDocument();
    expect(
      screen.getByText("Còn 1 phần nữa là có sticker"),
    ).toBeInTheDocument();
    // The sticker is half coloured: one of two sections done.
    expect(
      screen.getByRole("img", { name: "Sticker Ngôi sao, đã tô 1/2 phần" }),
    ).toHaveAttribute("data-sticker-fill", "1/2");
    expect(screen.getByRole("link", { name: /Học phần tiếp/ })).toHaveAttribute(
      "href",
      `/lessons/${LESSON_ID}/sections/${LESSON_ID}.section.two`,
    );
    expect(await listStickers(db, scope)).toEqual([]);
  });

  describe("going back", () => {
    function backButton() {
      return screen.queryByRole("button", { name: "Quay lại" });
    }

    function shownExercise() {
      return document.querySelector(
        "[data-section-step=exercise]:not([hidden] *)",
      );
    }

    it("is not offered on the first screen", async () => {
      renderPlayer();
      expect(backButton()).toBeNull();
      tap("Tiếp");
      expect(backButton()).toBeInTheDocument();
      tap("Quay lại");
      expect(screen.getByText("Khối thứ nhất")).toBeInTheDocument();
      expect(screen.getByText("Bước 1 trên 6")).toBeInTheDocument();
      expect(backButton()).toBeNull();
      tap("Tiếp");
      expect(screen.getByText("Khối thứ hai")).toBeInTheDocument();
      await waitFor(async () =>
        expect(await sectionRecord()).toMatchObject({
          position: { phase: "blocks", index: 1 },
        }),
      );
    });

    it("shows a finished exercise finished and keeps the one in progress", async () => {
      renderPlayer();
      tap("Tiếp");
      tap("Tiếp");
      await answer("Câu kiểm tra", ["Đúng"]);

      // A wrong check on the practice question, then a look back.
      tap("Sai");
      tap("Kiểm tra");
      tap("Quay lại");
      expect(screen.getByText("Bước 3 trên 6")).toBeInTheDocument();
      const finished = shownExercise();
      expect(finished).toHaveAttribute(
        "data-exercise",
        `${LESSON_ID}.ex.kiem-tra`,
      );
      expect(finished?.querySelector("[data-finished]")).toHaveAttribute(
        "data-phase",
        "done",
      );
      // Nothing to check again: only "Tiếp" leads on.
      expect(screen.queryByRole("button", { name: "Kiểm tra" })).toBeNull();
      expect(screen.getByRole("button", { name: /Đúng/ })).toBeDisabled();
      // The position saved stays on the question the child reached.
      await waitFor(async () =>
        expect(await sectionRecord()).toMatchObject({
          position: { phase: "practice", index: 0 },
        }),
      );

      tap("Quay lại");
      expect(screen.getByText("Khối thứ hai")).toBeInTheDocument();
      tap("Tiếp");
      tap("Tiếp");

      // Back on the question in progress, with its wrong check.
      expect(shownExercise()).toHaveAttribute(
        "data-exercise",
        `${LESSON_ID}.ex.luyen-a`,
      );
      expect(shownExercise()?.querySelector("section")).toHaveAttribute(
        "data-phase",
        "wrong1",
      );
      expect(screen.getByText("Bước 4 trên 6")).toBeInTheDocument();
      tap("Đúng");
      tap("Kiểm tra");
      tap("Tiếp");
      await waitFor(() =>
        expect(screen.getByText("Câu luyện B")).toBeVisible(),
      );

      // Each exercise was recorded once, and the miss still counts.
      const attempts = await listAttempts(db, scope);
      expect(
        attempts.map((a) => [a.exerciseId, a.firstTryCorrect, a.wrongCount]),
      ).toEqual([
        [`${LESSON_ID}.ex.kiem-tra`, true, 0],
        [`${LESSON_ID}.ex.luyen-a`, false, 1],
      ]);
    });

    it("shows exercises finished before the child resumed as finished", async () => {
      renderPlayer({ phase: "practice", index: 1 });
      tap("Quay lại");
      expect(shownExercise()).toHaveAttribute(
        "data-exercise",
        `${LESSON_ID}.ex.luyen-a`,
      );
      expect(screen.queryByRole("button", { name: "Kiểm tra" })).toBeNull();
      tap("Tiếp");
      expect(screen.getByRole("button", { name: "Kiểm tra" })).toBeDisabled();
      expect(screen.getByText("Bước 5 trên 6")).toBeInTheDocument();
      await waitFor(async () =>
        expect(await sectionRecord()).toMatchObject({
          position: { phase: "practice", index: 1 },
        }),
      );
    });
  });
});

describe("SectionPlayer screens", () => {
  it("labels an explanation screen as theory, not as an exercise", async () => {
    renderPlayer();
    expect(screen.getByText("Lý thuyết")).toBeInTheDocument();
    expect(screen.queryByText(/Bài tập/)).toBeNull();
    await waitFor(async () => expect(await sectionRecord()).toBeDefined());
  });

  it("skips an exercise: moves on, logs it as skipped and rates nothing", async () => {
    renderPlayer({ phase: "practice", index: 0 });
    expect(screen.getByText("Câu luyện A")).toBeInTheDocument();
    tap("Bỏ qua");
    expect(await screen.findByText("Câu luyện B")).toBeInTheDocument();
    const attempts = await listAttempts(db, scope);
    expect(
      attempts.map((a) => [a.exerciseId, a.context, a.firstTryCorrect]),
    ).toEqual([[`${LESSON_ID}.ex.luyen-a`, "skipped", false]]);
    expect(await getCardStates(db, scope, LESSON_ID)).toEqual([]);
  });

  it("jumps back with a dot of a screen already visited, and forward again with the current dot", async () => {
    renderPlayer();
    // Nothing visited yet besides the first screen.
    expect(
      screen.getByRole("button", { name: "Lý thuyết 1" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Lý thuyết 2" })).toBeNull();
    tap("Tiếp");
    tap("Tiếp");
    expect(screen.getByText("Câu kiểm tra")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Câu 2" })).toBeNull();

    tap("Lý thuyết 1");
    expect(screen.getByText("Khối thứ nhất")).toBeInTheDocument();
    tap("Câu 1");
    expect(await screen.findByText("Câu kiểm tra")).toBeVisible();
    await waitFor(async () =>
      expect(await sectionRecord()).toMatchObject({
        position: { phase: "check", index: 0 },
      }),
    );
  });

  it("goes back to the lesson introduction from the first screen", async () => {
    const [first] = learnLesson().sections;
    if (!first) throw new Error("section missing");
    push.mockClear();
    renderPlayer(SECTION_START, {
      overview: {
        hook: { text: "Mở đầu" },
        summary: "Tóm tắt",
        goals: ["Mục tiêu một", "Mục tiêu hai"],
        whyItMatters: "Vì sao",
      },
    });
    tap("Quay lại");
    expect(push).toHaveBeenCalledWith(`/lessons/${LESSON_ID}?intro=1`);
    await waitFor(async () => expect(await sectionRecord()).toBeDefined());
  });
});
