import { describe, expect, it } from "vitest";
import {
  answerCurrent,
  answeredCount,
  closeRecap,
  currentItem,
  isFinished,
  isRated,
  lastReviewExerciseIds,
  recentExerciseIds,
  sectionExerciseIds,
  skipCurrent,
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
    expect(done).toEqual({
      items: [],
      current: 0,
      recap: null,
      avoid: new Set(),
    });
  });

  it("re-asks with an exercise not met in the session or while learning", () => {
    const byCard = new Map([
      ["card.a", ["ex.a1", "ex.a2", "ex.a3", "ex.a4"]],
      ["card.b", ["ex.a2"]],
    ]);
    // ex.a2 is asked for card.b in this session; ex.a3 was section practice.
    let session = startSession(
      [
        { cardId: "card.a", exerciseId: "ex.a1" },
        { cardId: "card.b", exerciseId: "ex.a2" },
      ],
      ["ex.a3"],
    );
    session = answerCurrent(session, false, byCard, first);
    expect(session.items.at(-1)?.exerciseId).toBe("ex.a4");
  });

  it("falls back to a met exercise rather than the missed one", () => {
    let session = startSession([picks[0]], ["ex.a2", "ex.a3"]);
    session = answerCurrent(session, false, exercisesByCard, first);
    expect(session.items.at(-1)?.exerciseId).toBe("ex.a2");
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

describe("sectionExerciseIds", () => {
  it("lists the checks and practice of every section", () => {
    expect(
      sectionExerciseIds([
        { checkIds: ["c1"], practiceIds: ["p1", "p2"] },
        { checkIds: [], practiceIds: ["p3"] },
      ]),
    ).toEqual(["c1", "p1", "p2", "p3"]);
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

describe("skipCurrent", () => {
  it("moves on with no recap and queues no re-ask", () => {
    const session = startSession([
      { cardId: "card.a", exerciseId: "ex.a1" },
      { cardId: "card.b", exerciseId: "ex.b1" },
    ]);
    const next = skipCurrent(session);
    expect(next.current).toBe(1);
    expect(next.recap).toBeNull();
    expect(next.items).toHaveLength(2);
    expect(currentItem(skipCurrent(skipCurrent(session)))).toBeUndefined();
  });
});
