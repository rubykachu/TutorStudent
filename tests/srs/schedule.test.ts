import { Rating, State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import { rate } from "@/srs/rate";
import { applyRating, retrievability } from "@/srs/schedule";

const START = new Date("2026-03-02T01:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

function shifted(ms: number): Date {
  return new Date(START.getTime() + ms);
}

describe("rate", () => {
  it("maps a first-try success to Good and anything else to Again", () => {
    expect(rate(true)).toBe(Rating.Good);
    expect(rate(false)).toBe(Rating.Again);
  });
});

describe("applyRating", () => {
  it("creates a reviewed state on the first rating", () => {
    const state = applyRating(undefined, Rating.Good, START);
    expect(state.reps).toBe(1);
    expect(state.state).not.toBe(State.New);
    expect(state.stability).toBeGreaterThan(0);
    expect(state.lastReviewAt).toBe(START.toISOString());
    expect(Date.parse(state.due)).toBeGreaterThan(START.getTime());
  });

  it("builds on the previous state and counts lapses", () => {
    const first = applyRating(undefined, Rating.Good, START);
    const second = applyRating(first, Rating.Again, shifted(3 * DAY));
    expect(second.reps).toBe(2);
    expect(second.lapses).toBe(1);
    expect(second.stability).toBeLessThan(first.stability);
    expect(second.lastReviewAt).toBe(shifted(3 * DAY).toISOString());
  });

  it("produces JSON-safe state", () => {
    const state = applyRating(undefined, Rating.Again, START);
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });
});

describe("retrievability", () => {
  it("is full right after a review", () => {
    expect(
      retrievability(applyRating(undefined, Rating.Good, START), START),
    ).toBe(1);
  });

  it("decays as time passes", () => {
    const state = applyRating(undefined, Rating.Good, START);
    const day1 = retrievability(state, shifted(DAY));
    const day30 = retrievability(state, shifted(30 * DAY));
    expect(day1).toBeLessThan(1);
    expect(day30).toBeLessThan(day1);
  });

  it("ranks a missed card below a recalled one within the same day", () => {
    const good = applyRating(undefined, Rating.Good, START);
    const again = applyRating(undefined, Rating.Again, START);
    const soon = shifted(10 * 60 * 1000);
    expect(retrievability(again, soon)).toBeLessThan(
      retrievability(good, soon),
    );
  });

  it("treats a review time in the future as just reviewed", () => {
    const state = applyRating(undefined, Rating.Good, START);
    expect(retrievability(state, shifted(-DAY))).toBe(1);
  });
});
