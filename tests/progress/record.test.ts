import "fake-indexeddb/auto";
import { State } from "ts-fsrs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  type ChildScope,
  getCardStates,
  listActivityDays,
  listAttempts,
  listStickers,
  TutorDb,
} from "@/progress/db";
import {
  type AttemptInput,
  completeSection,
  recordAttempt,
  saveSectionPosition,
} from "@/progress/record";
import { retrievability } from "@/srs/schedule";

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const LESSON = "powers";
const CARD_A = "powers.card.a";
const CARD_B = "powers.card.b";
const START = new Date("2026-03-02T01:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

function attempt(overrides: Partial<AttemptInput> = {}): AttemptInput {
  return {
    ...scope,
    exerciseId: "powers.ex.one",
    lessonId: LESSON,
    cardIds: [CARD_A, CARD_B],
    firstTryCorrect: true,
    wrongCount: 0,
    context: "practice",
    ...overrides,
  };
}

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
});

afterEach(async () => {
  await db.delete();
});

describe("recordAttempt", () => {
  it("logs the attempt and returns it", async () => {
    const saved = await recordAttempt(db, attempt({ wrongCount: 2 }), START);
    expect(saved).toMatchObject({
      ...scope,
      exerciseId: "powers.ex.one",
      lessonId: LESSON,
      cardIds: [CARD_A, CARD_B],
      wrongCount: 2,
      context: "practice",
      at: START.toISOString(),
    });
    expect(saved.id).toMatch(/^[0-9a-f]{32}$/);
    expect(await listAttempts(db, scope)).toEqual([saved]);
  });

  it("opens every card of the exercise on the first practice answer", async () => {
    await recordAttempt(db, attempt(), START);
    const states = await getCardStates(db, scope, LESSON);
    expect(states.map((s) => s.cardId).sort()).toEqual([CARD_A, CARD_B]);
    for (const state of states) {
      expect(state).toMatchObject({ ...scope, lessonId: LESSON, reps: 1 });
      expect(state.state).not.toBe(State.New);
      expect(state.lastReviewAt).toBe(START.toISOString());
    }
  });

  it("rates a wrong first try lower than a right one", async () => {
    await recordAttempt(db, attempt({ cardIds: [CARD_A] }), START);
    await recordAttempt(
      db,
      attempt({ cardIds: [CARD_B], firstTryCorrect: false, wrongCount: 1 }),
      START,
    );
    const states = await getCardStates(db, scope, LESSON);
    const byCard = new Map(states.map((s) => [s.cardId, s]));
    const later = new Date(START.getTime() + DAY);
    const a = byCard.get(CARD_A);
    const b = byCard.get(CARD_B);
    if (!a || !b) throw new Error("card states missing");
    expect(retrievability(b, later)).toBeLessThan(retrievability(a, later));
  });

  it("builds on the existing state during review", async () => {
    await recordAttempt(db, attempt({ cardIds: [CARD_A] }), START);
    const later = new Date(START.getTime() + 3 * DAY);
    await recordAttempt(
      db,
      attempt({ cardIds: [CARD_A], context: "review", firstTryCorrect: false }),
      later,
    );
    const [state] = await getCardStates(db, scope, LESSON);
    expect(state).toMatchObject({ reps: 2, lapses: 1 });
    expect(state?.lastReviewAt).toBe(later.toISOString());
  });

  it("never rates comprehension checks", async () => {
    await recordAttempt(db, attempt({ context: "check" }), START);
    expect(await getCardStates(db, scope, LESSON)).toEqual([]);
    expect(await listAttempts(db, scope)).toHaveLength(1);

    await recordAttempt(db, attempt({ cardIds: [CARD_A] }), START);
    await recordAttempt(
      db,
      attempt({ cardIds: [CARD_A], context: "check", firstTryCorrect: false }),
      new Date(START.getTime() + DAY),
    );
    const [state] = await getCardStates(db, scope, LESSON);
    expect(state).toMatchObject({ reps: 1, lastReviewAt: START.toISOString() });
  });

  it("keeps each child's cards apart", async () => {
    const sibling: ChildScope = { ...scope, childId: "kid-2" };
    await recordAttempt(db, attempt(), START);
    expect(await getCardStates(db, sibling, LESSON)).toEqual([]);
  });

  it("marks the study day by Vietnam time, including for checks", async () => {
    // 17:30 UTC on 1 March is already 2 March in Vietnam.
    await recordAttempt(
      db,
      attempt({ context: "check" }),
      new Date("2026-03-01T17:30:00Z"),
    );
    await recordAttempt(db, attempt(), new Date("2026-03-02T16:00:00Z"));
    await recordAttempt(db, attempt(), new Date("2026-03-02T17:00:00Z"));
    expect(await listActivityDays(db, scope)).toEqual([
      "2026-03-02",
      "2026-03-03",
    ]);
  });
});

describe("section progress", () => {
  const one = { lessonId: LESSON, sectionId: "powers.section.one" };
  const two = { lessonId: LESSON, sectionId: "powers.section.two" };
  const three = { lessonId: LESSON, sectionId: "powers.section.three" };
  const sections = [one, two, three].map((s) => s.sectionId);
  const read = (sectionId: string) =>
    db.sectionProgress.get([scope.familyId, scope.childId, sectionId]);

  it("saves the place in a section and marks it started", async () => {
    await saveSectionPosition(
      db,
      scope,
      one,
      { phase: "check", index: 1 },
      START,
    );
    expect(await read(one.sectionId)).toEqual({
      ...scope,
      ...one,
      state: "in_progress",
      position: { phase: "check", index: 1 },
      updatedAt: START.toISOString(),
    });
  });

  it("keeps a finished section finished when it is gone through again", async () => {
    await completeSection(db, scope, one, sections, START);
    await saveSectionPosition(
      db,
      scope,
      one,
      { phase: "blocks", index: 2 },
      START,
    );
    expect(await read(one.sectionId)).toMatchObject({
      state: "done",
      position: { phase: "blocks", index: 2 },
    });
  });

  it("rewinds a completed section and points at the next one to do", async () => {
    await saveSectionPosition(
      db,
      scope,
      two,
      { phase: "practice", index: 3 },
      START,
    );
    expect(await completeSection(db, scope, two, sections, START)).toEqual({
      lessonDone: false,
      nextSectionId: three.sectionId,
    });
    expect(await read(two.sectionId)).toMatchObject({
      state: "done",
      position: { phase: "blocks", index: 0 },
    });
    // After the last section, the first unfinished one is next.
    expect(await completeSection(db, scope, three, sections, START)).toEqual({
      lessonDone: false,
      nextSectionId: one.sectionId,
    });
    expect(await listStickers(db, scope)).toEqual([]);
  });

  it("awards the sticker once every section is done", async () => {
    await completeSection(db, scope, one, sections, START);
    await completeSection(db, scope, two, sections, START);
    expect(await completeSection(db, scope, three, sections, START)).toEqual({
      lessonDone: true,
      nextSectionId: null,
    });
    expect(await listStickers(db, scope)).toEqual([
      { ...scope, lessonId: LESSON, at: START.toISOString() },
    ]);
  });
});
