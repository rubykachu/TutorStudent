import "fake-indexeddb/auto";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewPlayer } from "@/learn/review-player";
import { CARD_RECAP_MS, LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import { type ChildScope, listAttempts, TutorDb } from "@/progress/db";
import { recordAttempt } from "@/progress/record";
import { CARD_A, CARD_B, LESSON_ID, learnIndex } from "./helpers";

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
    // A tap anywhere on the recap also moves on.
    fireEvent.click(await screen.findByText("Nhớ nhé!"));

    expect(item()).toHaveAttribute("data-card", CARD_A);
    expect(item()).toHaveAttribute("data-reask", "true");
    expect(screen.getByText("Hỏi lại")).toBeInTheDocument();
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    tap("Tiếp");

    expect(await screen.findByText("Ôn xong 2 thẻ!")).toBeInTheDocument();
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

  it("hides the recap on its own after a few seconds", async () => {
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
    tap("Đúng");
    tap("Kiểm tra");
    tap("Tiếp");
    await vi.waitFor(() =>
      expect(screen.getByText("Nhớ nhé!")).toBeInTheDocument(),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CARD_RECAP_MS);
    });
    expect(screen.queryByText("Nhớ nhé!")).toBeNull();
    expect(item()).toHaveAttribute("data-card", CARD_B);
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
});
