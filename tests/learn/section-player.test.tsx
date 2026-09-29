import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

    expect(screen.getByText("Kiểm tra nhanh")).toBeInTheDocument();
    await answer("Câu kiểm tra", ["Sai", "Đúng"]);
    expect(screen.getByText("Luyện tập")).toBeInTheDocument();
    await answer("Câu luyện A", ["Sai", "Đúng"]);
    await answer("Câu luyện B", ["Đúng"]);

    expect(screen.getByText("Nhớ nhé!")).toBeInTheDocument();
    tap("Xong phần");
    expect(await screen.findByText("Giỏi quá!")).toBeInTheDocument();

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
    expect(screen.getByRole("link", { name: /Học phần tiếp/ })).toHaveAttribute(
      "href",
      `/lessons/${LESSON_ID}/sections/${LESSON_ID}.section.two`,
    );
    expect(await listStickers(db, scope)).toEqual([]);
  });
});
