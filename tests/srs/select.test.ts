import { Rating } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import { FORGETTING_THRESHOLD, REVIEW_SESSION_SIZE } from "@/lib/config";
import type { ReviewRating } from "@/srs/rate";
import { applyRating, retrievability } from "@/srs/schedule";
import {
  countForgetting,
  type LessonCardState,
  selectReview,
} from "@/srs/select";
import { cardId, exId, LESSON_ID, lessonIndex } from "./helpers";

const START = new Date("2026-03-02T01:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

function shifted(ms: number): Date {
  return new Date(START.getTime() + ms);
}

function opened(
  name: string,
  rating: ReviewRating,
  at: Date = START,
  lessonId: string = LESSON_ID,
): LessonCardState {
  return {
    ...applyRating(undefined, rating, at),
    cardId: cardId(name),
    lessonId,
  };
}

// Always picks the first candidate, so exercise choice is predictable.
const first = () => 0;

describe("selectReview", () => {
  const index = lessonIndex({ a: ["a1", "a2"], b: ["b1", "b2"], c: ["c1"] });

  it("asks a card answered wrong before one answered right", () => {
    const states = [opened("a", Rating.Good), opened("b", Rating.Again)];
    const items = selectReview({
      now: shifted(10 * 60 * 1000),
      lessonId: LESSON_ID,
      states,
      index,
      random: first,
    });
    expect(items.map((i) => i.cardId)).toEqual([cardId("b"), cardId("a")]);
  });

  it("puts the card closest to being forgotten first as time passes", () => {
    const states = [
      opened("a", Rating.Good, START),
      opened("b", Rating.Good, shifted(20 * DAY)),
    ];
    const items = selectReview({
      now: shifted(30 * DAY),
      lessonId: LESSON_ID,
      states,
      index,
      random: first,
    });
    expect(items.map((i) => i.cardId)).toEqual([cardId("a"), cardId("b")]);
  });

  it("keeps the input order for equally remembered cards", () => {
    const states = [opened("c", Rating.Good), opened("a", Rating.Good)];
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states,
      index,
      random: first,
    });
    expect(items.map((i) => i.cardId)).toEqual([cardId("c"), cardId("a")]);
  });

  it("leaves out cards that were never opened", () => {
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("a", Rating.Good)],
      index,
      random: first,
    });
    expect(items).toEqual([{ cardId: cardId("a"), exerciseId: exId("a1") }]);
  });

  it("returns nothing when no card is opened", () => {
    expect(
      selectReview({ now: START, lessonId: LESSON_ID, states: [], index }),
    ).toEqual([]);
  });

  it("skips states of cards removed from the content and of other lessons", () => {
    const states = [
      opened("gone", Rating.Again),
      opened("a", Rating.Good),
      { ...opened("b", Rating.Again), lessonId: "other-lesson" },
    ];
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states,
      index,
      random: first,
    });
    expect(items.map((i) => i.cardId)).toEqual([cardId("a")]);
  });

  it("skips a card no exercise trains any more", () => {
    const bare = lessonIndex({ a: ["a1"], lonely: [] });
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("lonely", Rating.Again), opened("a", Rating.Good)],
      index: bare,
    });
    expect(items.map((i) => i.cardId)).toEqual([cardId("a")]);
  });

  it("rejects an index built for another lesson", () => {
    expect(() =>
      selectReview({ now: START, lessonId: "other-lesson", states: [], index }),
    ).toThrow(/other-lesson/);
  });

  it(`caps the session at ${REVIEW_SESSION_SIZE} cards, lowest recall first`, () => {
    const names = Array.from({ length: REVIEW_SESSION_SIZE + 3 }, (_, i) =>
      String.fromCharCode(97 + i),
    );
    const big = lessonIndex(
      Object.fromEntries(names.map((n) => [n, [`${n}1`]])),
    );
    // Card i was last reviewed i days after START, so earlier cards recall worse.
    const states = names.map((n, i) =>
      opened(n, Rating.Good, shifted(i * DAY)),
    );
    const items = selectReview({
      now: shifted(60 * DAY),
      lessonId: LESSON_ID,
      states: [...states].reverse(),
      index: big,
    });
    expect(items.map((i) => i.cardId)).toEqual(
      names.slice(0, REVIEW_SESSION_SIZE).map(cardId),
    );
  });

  it("honours a custom session size", () => {
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("a", Rating.Good), opened("b", Rating.Good)],
      index,
      size: 1,
    });
    expect(items).toHaveLength(1);
  });

  it("picks the exercise with the injected random source", () => {
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("a", Rating.Good)],
      index,
      random: () => 0.99,
    });
    expect(items[0]?.exerciseId).toBe(exId("a2"));
  });

  it("avoids the exercise used in the previous review when another exists", () => {
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("a", Rating.Good)],
      index,
      lastUsedExerciseIds: [exId("a1")],
      random: first,
    });
    expect(items[0]?.exerciseId).toBe(exId("a2"));
  });

  it("reuses the previous exercise when it is the only one", () => {
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("c", Rating.Good)],
      index,
      lastUsedExerciseIds: [exId("c1")],
      random: first,
    });
    expect(items[0]?.exerciseId).toBe(exId("c1"));
  });

  it("does not ask one shared exercise twice when an alternative exists", () => {
    const shared = lessonIndex({ a: ["both"], b: ["both", "b1"] });
    const items = selectReview({
      now: shifted(DAY),
      lessonId: LESSON_ID,
      states: [opened("a", Rating.Again), opened("b", Rating.Good)],
      index: shared,
      random: first,
    });
    expect(items).toEqual([
      { cardId: cardId("a"), exerciseId: exId("both") },
      { cardId: cardId("b"), exerciseId: exId("b1") },
    ]);
  });
});

describe("countForgetting", () => {
  const index = lessonIndex({ a: ["a1"], b: ["b1"], c: ["c1"] });

  it("counts opened cards whose recall fell below the threshold", () => {
    const states = [
      opened("a", Rating.Again, START),
      opened("b", Rating.Good, START),
      opened("gone", Rating.Again, START),
    ];
    const now = shifted(2 * DAY);
    // The fixture relies on these two cards sitting on opposite sides.
    expect(retrievability(states[0] as LessonCardState, now)).toBeLessThan(
      FORGETTING_THRESHOLD,
    );
    expect(
      retrievability(states[1] as LessonCardState, now),
    ).toBeGreaterThanOrEqual(FORGETTING_THRESHOLD);
    expect(countForgetting({ now, lessonId: LESSON_ID, states, index })).toBe(
      1,
    );
  });

  it("counts nothing right after studying", () => {
    const states = [opened("a", Rating.Again), opened("b", Rating.Good)];
    expect(
      countForgetting({ now: START, lessonId: LESSON_ID, states, index }),
    ).toBe(0);
  });

  it("grows as more cards fade over time", () => {
    const states = [opened("a", Rating.Good), opened("b", Rating.Good)];
    expect(
      countForgetting({
        now: shifted(365 * DAY),
        lessonId: LESSON_ID,
        states,
        index,
      }),
    ).toBe(2);
  });
});
