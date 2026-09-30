import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewPlayer } from "@/learn/review-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { type ChildScope, listAttempts, TutorDb } from "@/progress/db";
import { completeSection, recordAttempt } from "@/progress/record";
import {
  CARD_A,
  CARD_B,
  choice,
  LESSON_ID,
  learnIndex,
  learnLesson,
  SECTION_ID,
} from "./helpers";

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const AT = new Date("2026-03-02T01:00:00Z");

let db: TutorDb;

beforeEach(async () => {
  db = new TutorDb();
  let tick = 0;
  setNowForTesting(() => new Date(AT.getTime() + 1000 * tick++));
  // Section practice opened both cards: A was missed, B was recalled.
  const practice = {
    ...scope,
    lessonId: LESSON_ID,
    context: "practice" as const,
  };
  await recordAttempt(
    db,
    {
      ...practice,
      exerciseId: `${LESSON_ID}.ex.luyen-a`,
      cardIds: [CARD_A],
      firstTryCorrect: false,
      wrongCount: 1,
    },
    AT,
  );
  await recordAttempt(
    db,
    {
      ...practice,
      exerciseId: `${LESSON_ID}.ex.luyen-b`,
      cardIds: [CARD_B],
      firstTryCorrect: true,
      wrongCount: 0,
    },
    AT,
  );
});

afterEach(async () => {
  await db.delete();
  setNowForTesting(null);
  vi.useRealTimers();
});

function tap(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function item() {
  return document.querySelector("[data-review-step=exercise]");
}

describe("ReviewPlayer", () => {
  it("asks the weakest card first, re-asks a miss at the end without rating it", async () => {
    const onAgain = vi.fn();
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={onAgain}
        random={() => 0}
      />,
    );
    expect(await screen.findByText("Câu luyện A")).toBeInTheDocument();
    expect(item()).toHaveAttribute("data-card", CARD_A);

    tap("Sai");
    tap("Kiểm tra");
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    expect(await screen.findByText("Nhớ nhé!")).toBeInTheDocument();
    tap("Tiếp");

    expect(item()).toHaveAttribute("data-card", CARD_B);
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");

    // Right the first time: no recap, straight to the re-ask.
    await waitFor(() => expect(item()).toHaveAttribute("data-reask", "true"));
    expect(screen.queryByText("Nhớ nhé!")).toBeNull();
    expect(item()).toHaveAttribute("data-card", CARD_A);
    expect(screen.getByText("Hỏi lại")).toBeInTheDocument();
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");

    expect(await screen.findByText("Ôn xong rồi!")).toBeInTheDocument();
    // Two cards, three questions: the re-ask counts too.
    expect(screen.getByText("Bạn vừa ôn 3 câu. Giỏi lắm!")).toBeInTheDocument();
    const review = (await listAttempts(db, scope)).filter(
      (a) => a.context === "review",
    );
    expect(review.map((a) => [a.cardIds, a.firstTryCorrect])).toEqual([
      [[CARD_A], false],
      [[CARD_B], true],
    ]);
    tap("Ôn tiếp");
    expect(onAgain).toHaveBeenCalledOnce();
  });

  it("keeps the recap of a missed card until the child taps Tiếp", async () => {
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={vi.fn()}
        random={() => 0}
      />,
    );
    await screen.findByText("Câu luyện A");
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    tap("Sai");
    tap("Kiểm tra");
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    const recap = await vi.waitFor(() => screen.getByText("Nhớ nhé!"));
    await vi.advanceTimersByTimeAsync(60_000);
    // Neither time nor a tap outside the button closes it.
    fireEvent.click(recap);
    expect(screen.getByText("Nhớ nhé!")).toBeInTheDocument();
    expect(item()).toBeNull();

    tap("Tiếp");
    expect(screen.queryByText("Nhớ nhé!")).toBeNull();
    expect(item()).toHaveAttribute("data-card", CARD_B);
  });

  it("prefers a bank exercise over the practice the child just did", async () => {
    // Card A gets a second exercise outside any section practice.
    const base = learnIndex().lesson;
    const index = learnIndex({
      exercises: [...base.exercises, choice("kho-a", [CARD_A], "Câu kho A")],
    });
    render(
      <ReviewPlayer
        db={db}
        index={index}
        scope={scope}
        onAgain={vi.fn()}
        random={() => 0}
      />,
    );
    expect(await screen.findByText("Câu kho A")).toBeInTheDocument();
    expect(item()).toHaveAttribute("data-exercise", `${LESSON_ID}.ex.kho-a`);
  });

  it("ends with the lesson progress and its sticker coloured by sections done", async () => {
    const [first] = learnLesson().sections;
    const index = learnIndex({
      sections: [first, { ...first, id: `${LESSON_ID}.section.two` }],
    });
    await completeSection(
      db,
      scope,
      { lessonId: LESSON_ID, sectionId: SECTION_ID },
      index.lesson.sections.map((s) => s.id),
      AT,
    );
    render(
      <ReviewPlayer
        db={db}
        index={index}
        scope={scope}
        onAgain={vi.fn()}
        random={() => 0}
      />,
    );
    await screen.findByText("Câu luyện A");
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    await waitFor(() => expect(item()).toHaveAttribute("data-card", CARD_B));
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    expect(await screen.findByText("Ôn xong rồi!")).toBeInTheDocument();
    expect(screen.getByText("Bạn vừa ôn 2 câu. Giỏi lắm!")).toBeInTheDocument();
    expect(screen.getByText("Xong 1/2 phần")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Sticker Ngôi sao, đã tô 1/2 phần" }),
    ).toHaveAttribute("data-sticker-fill", "1/2");
  });

  it("says there is nothing to review before any card is opened", async () => {
    await db.cardStates.clear();
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={vi.fn()}
      />,
    );
    expect(
      await screen.findByText("Chưa có thẻ nào để ôn"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ôn tiếp" })).toBeNull();
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Về bài" })).toBeInTheDocument(),
    );
  });

  it("goes back to answered questions without asking or rating them again", async () => {
    render(
      <ReviewPlayer
        db={db}
        index={learnIndex()}
        scope={scope}
        onAgain={vi.fn()}
        random={() => 0}
      />,
    );
    await screen.findByText("Câu luyện A");
    expect(screen.queryByRole("button", { name: "Quay lại" })).toBeNull();
    tap("Sai");
    tap("Kiểm tra");
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    await screen.findByText("Nhớ nhé!");

    // From the recap back to the question it belongs to, finished.
    tap("Quay lại");
    const answered = document.querySelector("[data-review-step=answered]");
    expect(answered).toHaveAttribute(
      "data-exercise",
      `${LESSON_ID}.ex.luyen-a`,
    );
    expect(answered?.querySelector("[data-finished]")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Kiểm tra" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Quay lại" })).toBeNull();
    tap("Tiếp");
    expect(screen.getByText("Nhớ nhé!")).toBeInTheDocument();
    tap("Tiếp");

    // A wrong check on B survives a look back at A.
    expect(item()).toHaveAttribute("data-card", CARD_B);
    tap("Sai");
    tap("Kiểm tra");
    tap("Quay lại");
    expect(
      document.querySelector("[data-review-step=answered]"),
    ).toHaveAttribute("data-exercise", `${LESSON_ID}.ex.luyen-a`);
    tap("Tiếp");
    expect(document.querySelector("[data-review-step=answered]")).toBeNull();
    expect(item()?.querySelector("section")).toHaveAttribute(
      "data-phase",
      "wrong1",
    );
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    await screen.findByText("Nhớ nhé!");

    const review = (await listAttempts(db, scope)).filter(
      (a) => a.context === "review",
    );
    expect(
      review.map((a) => [a.cardIds, a.firstTryCorrect, a.wrongCount]),
    ).toEqual([
      [[CARD_A], false, 1],
      [[CARD_B], false, 1],
    ]);
  });
});
