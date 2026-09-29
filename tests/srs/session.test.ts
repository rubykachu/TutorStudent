import { describe, expect, it } from "vitest";
import {
  answerCurrent,
  currentItem,
  isFinished,
  isRated,
  lastReviewExerciseIds,
  ratedCount,
  startSession,
} from "@/srs/session";

const exercisesByCard = new Map([
  ["card.a", ["ex.a1", "ex.a2", "ex.a3"]],
  ["card.b", ["ex.b1"]],
]);
const first = () => 0;

describe("review session", () => {
  const picks = [
    { cardId: "card.a", exerciseId: "ex.a1" },
    { cardId: "card.b", exerciseId: "ex.b1" },
  ];

  it("asks every pick once when all are recalled", () => {
    let session = startSession(picks);
    expect(currentItem(session)).toEqual({ ...picks[0], reask: false });
    session = answerCurrent(session, true, exercisesByCard, first);
    session = answerCurrent(session, true, exercisesByCard, first);
    expect(isFinished(session)).toBe(true);
    expect(currentItem(session)).toBeUndefined();
    expect(session.items).toHaveLength(2);
    expect(ratedCount(session)).toBe(2);
  });

  it("re-asks a missed card once at the end with another exercise", () => {
    let session = startSession(picks);
    session = answerCurrent(session, false, exercisesByCard, first);
    expect(session.items.at(-1)).toEqual({
      cardId: "card.a",
      exerciseId: "ex.a2",
      reask: true,
    });
    session = answerCurrent(session, true, exercisesByCard, first);
    const reask = currentItem(session);
    expect(reask?.cardId).toBe("card.a");
    expect(reask && isRated(reask)).toBe(false);

    // Missing the re-ask teaches again but queues nothing more.
    session = answerCurrent(session, false, exercisesByCard, first);
    expect(isFinished(session)).toBe(true);
    expect(session.items).toHaveLength(3);
    expect(ratedCount(session)).toBe(2);
  });

  it("picks the alternative exercise at random among the others", () => {
    const session = answerCurrent(
      startSession(picks),
      false,
      exercisesByCard,
      () => 0.99,
    );
    expect(session.items.at(-1)?.exerciseId).toBe("ex.a3");
  });

  it("reuses the same exercise when the card has no other", () => {
    let session = startSession([picks[1]]);
    session = answerCurrent(session, false, exercisesByCard, first);
    expect(session.items.at(-1)).toEqual({
      cardId: "card.b",
      exerciseId: "ex.b1",
      reask: true,
    });
  });

  it("reuses the exercise for a card missing from the lookup", () => {
    const session = answerCurrent(
      startSession([{ cardId: "card.gone", exerciseId: "ex.x" }]),
      false,
      exercisesByCard,
    );
    expect(session.items.at(-1)?.exerciseId).toBe("ex.x");
  });

  it("ignores answers after the end", () => {
    const done = answerCurrent(startSession([]), false, exercisesByCard);
    expect(done).toEqual({ items: [], current: 0 });
  });
});

describe("lastReviewExerciseIds", () => {
  it("keeps the exercises of the latest review answers", () => {
    const attempts = ["e1", "e2", "e3"].map((exerciseId) => ({ exerciseId }));
    expect(lastReviewExerciseIds(attempts, 2)).toEqual(["e2", "e3"]);
    expect(lastReviewExerciseIds(attempts)).toEqual(["e1", "e2", "e3"]);
  });
});
