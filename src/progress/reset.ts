import type { Table } from "dexie";
import {
  type ChildScope,
  OVERVIEW_SEEN_PREFIX,
  type TutorDb,
} from "@/progress/db";
import { lessonIdOfContentId } from "@/progress/parent-report";

// Starting a lesson over: erases what one child has recorded for one lesson,
// and nothing else. No history is kept, so the store does not grow.

// The names of the tables declared on `TutorDb`.
export type TableName = {
  // biome-ignore lint/suspicious/noExplicitAny: matches a table of any record type
  [K in keyof TutorDb]: TutorDb[K] extends Table<any, any> ? K : never;
}[keyof TutorDb];

type EraseContext = { db: TutorDb; scope: ChildScope; lessonId: string };

// What a reset does with each table of the schema. A table missing from
// `LESSON_RESET_POLICY` fails the type check, and `tests/progress/reset.test.ts`
// fails for a table that is classified "unrelated" while it has a `lessonId`
// index, so a new table cannot be forgotten.
export type LessonResetPolicy =
  // Deletes the child's records of the lesson and returns how many.
  | { kind: "erase"; erase: (context: EraseContext) => Promise<number> }
  // Holds lesson records the child keeps through a reset.
  | { kind: "keep"; reason: string }
  // Not progress of a lesson at all.
  | { kind: "unrelated"; reason: string };

// For a table indexed by `[familyId+childId+lessonId]`.
function eraseByLessonIndex(table: (db: TutorDb) => Table): LessonResetPolicy {
  return {
    kind: "erase",
    erase: ({ db, scope, lessonId }) =>
      table(db)
        .where("[familyId+childId+lessonId]")
        .equals([scope.familyId, scope.childId, lessonId])
        .delete(),
  };
}

export const LESSON_RESET_POLICY: Record<TableName, LessonResetPolicy> = {
  sectionProgress: eraseByLessonIndex((db) => db.sectionProgress),
  cardStates: eraseByLessonIndex((db) => db.cardStates),
  attempts: eraseByLessonIndex((db) => db.attempts),
  // A writing has no lesson column: its exercise id starts with the lesson id.
  writings: {
    kind: "erase",
    erase: async ({ db, scope, lessonId }) => {
      const writings = await db.writings
        .where("[familyId+childId]")
        .equals([scope.familyId, scope.childId])
        .toArray();
      const ids = writings
        .filter((w) => lessonIdOfContentId(w.exerciseId) === lessonId)
        .map((w) => w.id);
      await db.writings.bulkDelete(ids);
      return ids.length;
    },
  },
  // The one per-lesson setting is the overview-seen flag, keyed by lesson id.
  settings: {
    kind: "erase",
    erase: async ({ db, scope, lessonId }) => {
      const key = [
        scope.familyId,
        scope.childId,
        `${OVERVIEW_SEEN_PREFIX}${lessonId}`,
      ] as [string, string, string];
      const seen = (await db.settings.get(key)) !== undefined;
      await db.settings.delete(key);
      return seen ? 1 : 0;
    },
  },
  stickers: {
    kind: "keep",
    reason: "A title the child earned stays after the lesson is relearned.",
  },
  activityDays: {
    kind: "unrelated",
    reason: "Study days of the child, not tied to a lesson.",
  },
  profiles: {
    kind: "unrelated",
    reason: "The child's own profile.",
  },
};

export type LessonResetResult = {
  scope: ChildScope;
  lessonId: string;
  // ISO time of the reset.
  at: string;
  // Records removed, per table that was erased.
  erased: Partial<Record<TableName, number>>;
};

// Deletes one child's progress of one lesson in a single transaction over
// every table the policy erases, found from the schema (`db.tables`). Other
// lessons, other children and the lesson's sticker are untouched.
//
// Sync hook: the returned result (child, lesson, time) is what the planned R2
// sync must turn into a per-lesson reset marker, written in this same
// transaction. Without it the merge rules (attempts united by id, the higher
// section state wins) would bring the erased progress back from another
// device. There is no sync code yet.
export async function resetLessonProgress(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
  now: Date,
): Promise<LessonResetResult> {
  const names = db.tables.map((t) => t.name);
  const missing = names.filter((name) => !(name in LESSON_RESET_POLICY));
  if (missing.length > 0) {
    throw new Error(`No lesson reset policy for table: ${missing.join(", ")}`);
  }
  const erasing = db.tables.filter(
    (t) => LESSON_RESET_POLICY[t.name as TableName].kind === "erase",
  );
  const erased: LessonResetResult["erased"] = {};
  await db.transaction("rw", erasing, async () => {
    for (const table of erasing) {
      const policy = LESSON_RESET_POLICY[table.name as TableName];
      if (policy.kind !== "erase") continue;
      erased[table.name as TableName] = await policy.erase({
        db,
        scope,
        lessonId,
      });
    }
  });
  return { scope, lessonId, at: now.toISOString(), erased };
}
