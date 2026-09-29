import { describe, expect, it } from "vitest";
import {
  answerCurrent,
  closeRecap,
  currentItem,
  isFinished,
  isRated,
  lastReviewExerciseIds,
  answeredCount,
  recentExerciseIds,
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
    expect(answeredCount(session)).toBe(2);
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
    // The re-ask counts: the child answered three questions.
    expect(answeredCount(session)).toBe(3);
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
    expect(done).toEqual({ items: [], current: 0, recap: null });
  });

  it("shows the card recap only after a missed question", () => {
    let session = startSession(picks);
    session = answerCurrent(session, true, exercisesByCard, first);
    expect(session.recap).toBeNull();

    session = answerCurrent(session, false, exercisesByCard, first);
    expect(session.recap).toEqual({ at: 1, cardId: "card.b" });
    // The recap stays until the child closes it; the queue already moved on.
    expect(currentItem(session)?.reask).toBe(true);
    session = closeRecap(session);
    expect(session.recap).toBeNull();

    // A missed re-ask teaches with the recap too, without queueing more.
    session = answerCurrent(session, false, exercisesByCard, first);
    expect(session.recap).toEqual({ at: 2, cardId: "card.b" });
    expect(isFinished(session)).toBe(true);
  });
});

describe("lastReviewExerciseIds", () => {
  it("keeps the exercises of the latest review answers", () => {
    const attempts = ["e1", "e2", "e3"].map((exerciseId) => ({ exerciseId }));
    expect(lastReviewExerciseIds(attempts, 2)).toEqual(["e2", "e3"]);
    expect(lastReviewExerciseIds(attempts)).toEqual(["e1", "e2", "e3"]);
  });
});

describe("recentExerciseIds", () => {
  const now = new Date("2026-03-02T01:00:00Z");
  const minutesAgo = (m: number) =>
    new Date(now.getTime() - m * 60 * 1000).toISOString();

  it("keeps exercises answered within the window", () => {
    const attempts = [
      { exerciseId: "old", at: minutesAgo(45) },
      { exerciseId: "edge", at: minutesAgo(30) },
      { exerciseId: "just-now", at: minutesAgo(1) },
    ];
    expect(recentExerciseIds(attempts, now)).toEqual(["edge", "just-now"]);
    expect(recentExerciseIds(attempts, now, 5)).toEqual(["just-now"]);
  });
});
