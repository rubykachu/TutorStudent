import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  awardSticker,
  type ChildScope,
  getCardStates,
  getSectionProgress,
  getSetting,
  listActivityDays,
  listAttempts,
  listOverviewsSeen,
  listStickers,
  listWritings,
  markOverviewSeen,
  SECTION_START,
  saveWriting,
  setSetting,
  TutorDb,
} from "@/progress/db";
import { readParentData } from "@/progress/parent-data";
import {
  lessonHasProgress,
  recentStudyDays,
  skippedExercises,
  topForgettingCards,
  topWrongExercises,
} from "@/progress/parent-report";
import { recordAttempt, saveSectionPosition } from "@/progress/record";
import { LESSON_RESET_POLICY, resetLessonProgress } from "@/progress/reset";
import { selectReview } from "@/srs/select";
import { LESSON_ID, learnIndex } from "../learn/helpers";

const OTHER = "other";
const kid: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const sibling: ChildScope = { ...kid, childId: "kid-2" };
const NOW = new Date("2026-09-30T02:00:00Z");
const LATER = new Date("2026-10-30T02:00:00Z");

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
});

afterEach(async () => {
  await db.delete();
});

// Everything one child can have recorded for one lesson.
async function seedLesson(scope: ChildScope, lessonId: string) {
  const exerciseId = `${lessonId}.ex.luyen-a`;
  const answer = (context: "practice" | "skipped" | "check", wrong: number) =>
    recordAttempt(
      db,
      {
        ...scope,
        lessonId,
        exerciseId,
        cardIds: context === "practice" ? [`${lessonId}.card.a`] : [],
        firstTryCorrect: wrong === 0,
        wrongCount: wrong,
        context,
      },
      NOW,
    );
  await answer("practice", 1);
  await answer("practice", 0);
  await answer("skipped", 0);
  await answer("check", 0);
  await saveSectionPosition(
    db,
    scope,
    { lessonId, sectionId: `${lessonId}.section.one` },
    { phase: "practice", index: 1 },
    NOW,
  );
  await saveWriting(db, {
    ...scope,
    id: `${scope.childId}-${lessonId}-w`,
    exerciseId: `${lessonId}.ex.viet`,
    text: "Bạn em",
    checks: [],
    at: NOW.toISOString(),
  });
  await markOverviewSeen(db, scope, lessonId);
  await awardSticker(db, scope, lessonId, NOW);
}

async function recordsOf(scope: ChildScope, lessonId: string) {
  return {
    sections: await getSectionProgress(db, scope, lessonId),
    cards: await getCardStates(db, scope, lessonId),
    attempts: (await listAttempts(db, scope)).filter(
      (a) => a.lessonId === lessonId,
    ),
    writings: (await listWritings(db, scope)).filter((w) =>
      w.exerciseId.startsWith(`${lessonId}.`),
    ),
    seen: (await listOverviewsSeen(db, scope)).includes(lessonId),
  };
}

describe("resetLessonProgress", () => {
  beforeEach(async () => {
    for (const scope of [kid, sibling]) {
      await seedLesson(scope, LESSON_ID);
      await seedLesson(scope, OTHER);
    }
    await setSetting(db, kid, "soundEnabled", false);
  });

  it("erases every record of that lesson for that child and reports the counts", async () => {
    const result = await resetLessonProgress(db, kid, LESSON_ID, LATER);

    const after = await recordsOf(kid, LESSON_ID);
    expect(after.sections).toEqual([]);
    expect(after.cards).toEqual([]);
    expect(after.attempts).toEqual([]);
    expect(after.writings).toEqual([]);
    expect(after.seen).toBe(false);
    expect(result).toEqual({
      scope: kid,
      lessonId: LESSON_ID,
      at: LATER.toISOString(),
      erased: {
        sectionProgress: 1,
        cardStates: 1,
        attempts: 4,
        writings: 1,
        settings: 1,
      },
    });
  });

  it("leaves other lessons and other children untouched", async () => {
    const otherBefore = await recordsOf(kid, OTHER);
    const siblingBefore = await recordsOf(sibling, LESSON_ID);
    expect(otherBefore.attempts).toHaveLength(4);

    await resetLessonProgress(db, kid, LESSON_ID, LATER);

    expect(await recordsOf(kid, OTHER)).toEqual(otherBefore);
    expect(await recordsOf(sibling, LESSON_ID)).toEqual(siblingBefore);
  });

  it("keeps the sticker, the study days and the child's other settings", async () => {
    const days = await listActivityDays(db, kid);
    await resetLessonProgress(db, kid, LESSON_ID, LATER);

    expect((await listStickers(db, kid)).map((s) => s.lessonId).sort()).toEqual(
      [OTHER, LESSON_ID].sort(),
    );
    expect(await listActivityDays(db, kid)).toEqual(days);
    expect(days.length).toBeGreaterThan(0);
    expect(await getSetting(db, kid, "soundEnabled")).toBe(false);
  });

  it("empties the review queue of the lesson and stops listing its cards for the parent", async () => {
    const index = learnIndex();
    const queue = async () =>
      selectReview({
        now: LATER,
        lessonId: LESSON_ID,
        states: await getCardStates(db, kid, LESSON_ID),
        index,
      });
    expect((await queue()).length).toBeGreaterThan(0);

    await resetLessonProgress(db, kid, LESSON_ID, LATER);

    expect(await queue()).toEqual([]);
  });

  it("drops the old attempts from the parent report counts", async () => {
    const lessons = new Map([[LESSON_ID, learnIndex()]]);
    const report = async () => {
      const data = await readParentData(db, kid);
      return {
        data,
        wrong: topWrongExercises(data.attempts, NOW).filter(
          (w) => w.lessonId === LESSON_ID,
        ),
        skipped: skippedExercises(data.attempts, NOW).filter(
          (s) => s.lessonId === LESSON_ID,
        ),
        forgetting: topForgettingCards(data.cardStates, lessons, LATER, 50),
        minutes: recentStudyDays(data.attempts, "2026-09-30")
          .map((d) => d.minutes)
          .reduce((a, b) => a + b, 0),
      };
    };
    const before = await report();
    expect(before.wrong.length).toBeGreaterThan(0);
    expect(before.skipped.length).toBeGreaterThan(0);
    expect(before.forgetting.length).toBeGreaterThan(0);
    expect(lessonHasProgress(LESSON_ID, before.data)).toBe(true);

    await resetLessonProgress(db, kid, LESSON_ID, LATER);

    const after = await report();
    expect(after.wrong).toEqual([]);
    expect(after.skipped).toEqual([]);
    expect(after.forgetting.some((c) => c.lessonId === LESSON_ID)).toBe(false);
    expect(after.minutes).toBeLessThan(before.minutes);
    expect(lessonHasProgress(LESSON_ID, after.data)).toBe(false);
    expect(lessonHasProgress(OTHER, after.data)).toBe(true);
  });

  it("starts the section over: no record, so it opens at the first block", async () => {
    await resetLessonProgress(db, kid, LESSON_ID, LATER);
    expect(await getSectionProgress(db, kid, LESSON_ID)).toEqual([]);
    expect(SECTION_START).toEqual({ phase: "blocks", index: 0 });
  });

  it("does nothing, and does not fail, for a lesson with no progress", async () => {
    const result = await resetLessonProgress(db, kid, "never-opened", LATER);
    expect(Object.values(result.erased).every((n) => n === 0)).toBe(true);
    expect(await recordsOf(kid, LESSON_ID)).toMatchObject({ seen: true });
  });
});

describe("lesson reset policy", () => {
  it("classifies every table of the schema, and nothing else", async () => {
    await db.open();
    expect(Object.keys(LESSON_RESET_POLICY).sort()).toEqual(
      db.tables.map((t) => t.name).sort(),
    );
  });

  it("never treats a table with a lessonId index as unrelated to lessons", async () => {
    await db.open();
    for (const table of db.tables) {
      const hasLessonKey = [table.schema.primKey, ...table.schema.indexes].some(
        (index) => [index.keyPath].flat().some((path) => path === "lessonId"),
      );
      if (hasLessonKey) {
        expect(
          LESSON_RESET_POLICY[table.name as keyof typeof LESSON_RESET_POLICY]
            .kind,
        ).not.toBe("unrelated");
      }
    }
  });

  it("only keeps the sticker table", () => {
    const kept = Object.entries(LESSON_RESET_POLICY)
      .filter(([, policy]) => policy.kind === "keep")
      .map(([name]) => name);
    expect(kept).toEqual(["stickers"]);
  });

  it("refuses to run when a table has no policy", async () => {
    class WithNewTable extends TutorDb {
      constructor() {
        super("tutor-with-new-table");
        this.version(2).stores({ drafts: "id, [familyId+childId+lessonId]" });
      }
    }
    const extended = new WithNewTable();
    try {
      await expect(
        resetLessonProgress(extended, kid, LESSON_ID, LATER),
      ).rejects.toThrow("No lesson reset policy for table: drafts");
    } finally {
      await extended.delete();
    }
  });
});
