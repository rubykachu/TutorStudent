import { z } from "zod";
import {
  SYNC_MAX_DOC_RECORDS,
  SYNC_MAX_PROFILES,
  SYNC_PROFILE_NAME_MAX_CHARS,
  SYNC_WRITING_MAX_CHARS,
} from "@/lib/config";
import { vnDayKey } from "@/lib/time";
import { ATTEMPT_CONTEXTS, SECTION_PHASES } from "@/progress/enums";

// Shapes of the three documents a family's progress syncs through, shared by
// the client and the server:
//   - the family profile doc (the children of one family),
//   - the main doc of one child (state only: cards, sections, stickers, ...),
//   - the history doc of one child for one month (answers and writings).
// Every doc carries `schema` (its kind) and `version`. All schemas are strict:
// an unknown key is refused, so a doc written by a newer app is never mistaken
// for a current one. Times are ISO strings in one fixed format (UTC,
// milliseconds), so comparing two of them as text orders them in time.

export const DOC_VERSION = 1;

export const DOC_KINDS = ["profile", "child", "history"] as const;
export type DocKind = (typeof DOC_KINDS)[number];

const DOC_SCHEMA_NAME: Record<DocKind, string> = {
  profile: "tutor-family-profiles",
  child: "tutor-child-progress",
  history: "tutor-child-history",
};

// ---------------------------------------------------------------------------
// Building blocks

export const FAMILY_ID_PATTERN = /^[a-z0-9-]{3,32}$/;
export const CHILD_ID_PATTERN = /^[0-9a-f]{32}$/;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const FamilyIdSchema = z.string().regex(FAMILY_ID_PATTERN);
const ChildIdSchema = z.string().regex(CHILD_ID_PATTERN);
const MonthSchema = z.string().regex(MONTH_PATTERN);
const DaySchema = z.string().regex(DAY_PATTERN);
// Content ids (`<lesson>.card.<name>`) and record ids (32 hex characters).
const IdSchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/);
const TimeSchema = z.iso.datetime({ precision: 3 });
const CountSchema = z.number().int().min(0).max(1_000_000);
const SmallNumberSchema = z.number().finite();

function list<T extends z.ZodType>(item: T, max = SYNC_MAX_DOC_RECORDS) {
  return z.array(item).max(max);
}

function timeMap(max = SYNC_MAX_DOC_RECORDS) {
  return z
    .record(IdSchema, TimeSchema)
    .refine((map) => Object.keys(map).length <= max, `At most ${max} entries`);
}

// ---------------------------------------------------------------------------
// Family profile doc

const ProfileSchema = z.strictObject({
  id: ChildIdSchema,
  name: z.string().min(1).max(SYNC_PROFILE_NAME_MAX_CHARS),
  avatar: IdSchema,
  grade: z.number().int().min(1).max(12),
  series: z
    .record(IdSchema, IdSchema)
    .refine((map) => Object.keys(map).length <= 100, "At most 100 entries"),
  createdAt: TimeSchema,
  updatedAt: TimeSchema,
});
export type SyncProfile = z.infer<typeof ProfileSchema>;

// No profile is ever deleted today, so the doc has no profile tombstone;
// adding deletion needs one (a merge that unions by id would bring a deleted
// profile back).
export const ProfileDocSchema = z.strictObject({
  schema: z.literal(DOC_SCHEMA_NAME.profile),
  version: z.literal(DOC_VERSION),
  familyId: FamilyIdSchema,
  profiles: list(ProfileSchema, SYNC_MAX_PROFILES),
});
export type ProfileDoc = z.infer<typeof ProfileDocSchema>;

// ---------------------------------------------------------------------------
// Main child doc

const CardSchema = z.strictObject({
  cardId: IdSchema,
  lessonId: IdSchema,
  due: TimeSchema,
  stability: SmallNumberSchema,
  difficulty: SmallNumberSchema,
  scheduledDays: SmallNumberSchema,
  learningSteps: CountSchema,
  reps: CountSchema,
  lapses: CountSchema,
  // ts-fsrs `State`: New, Learning, Review, Relearning.
  state: z.number().int().min(0).max(3),
  lastReviewAt: TimeSchema,
});
export type SyncCard = z.infer<typeof CardSchema>;

const SectionSchema = z.strictObject({
  sectionId: IdSchema,
  lessonId: IdSchema,
  // When the section was last completed; null while it is only in progress.
  doneAt: TimeSchema.nullable(),
  position: z.strictObject({
    phase: z.enum(SECTION_PHASES),
    index: CountSchema,
  }),
  updatedAt: TimeSchema,
});
export type SyncSection = z.infer<typeof SectionSchema>;

const StickerSchema = z.strictObject({ lessonId: IdSchema, at: TimeSchema });
export type SyncSticker = z.infer<typeof StickerSchema>;

export const ChildDocSchema = z.strictObject({
  schema: z.literal(DOC_SCHEMA_NAME.child),
  version: z.literal(DOC_VERSION),
  familyId: FamilyIdSchema,
  childId: ChildIdSchema,
  cards: list(CardSchema),
  sections: list(SectionSchema),
  stickers: list(StickerSchema),
  // Vietnam-time day keys the child studied on.
  activityDays: list(DaySchema),
  // Months that have a history doc.
  historyMonths: list(MonthSchema, 1_200),
  // Lesson id -> when its overview was last seen.
  overviewSeen: timeMap(),
  // Lesson id -> when it was last reset.
  resets: timeMap(),
});
export type ChildDoc = z.infer<typeof ChildDocSchema>;

// ---------------------------------------------------------------------------
// History doc of one month

const AttemptSchema = z.strictObject({
  id: IdSchema,
  exerciseId: IdSchema,
  lessonId: IdSchema,
  cardIds: z.array(IdSchema).max(50),
  firstTryCorrect: z.boolean(),
  wrongCount: CountSchema,
  at: TimeSchema,
  context: z.enum(ATTEMPT_CONTEXTS),
});
export type SyncAttempt = z.infer<typeof AttemptSchema>;

const WritingSchema = z.strictObject({
  id: IdSchema,
  exerciseId: IdSchema,
  text: z.string().max(SYNC_WRITING_MAX_CHARS),
  checks: z
    .array(
      z.strictObject({ criterion: z.string().max(1_000), met: z.boolean() }),
    )
    .max(50),
  at: TimeSchema,
});
export type SyncWriting = z.infer<typeof WritingSchema>;

// The Vietnam-time month (`yyyy-mm`) a time belongs to. A record lives in the
// history doc of its own month for good.
export function monthOfTime(time: string): string {
  return vnDayKey(new Date(time)).slice(0, 7);
}

export const HistoryDocSchema = z
  .strictObject({
    schema: z.literal(DOC_SCHEMA_NAME.history),
    version: z.literal(DOC_VERSION),
    familyId: FamilyIdSchema,
    childId: ChildIdSchema,
    month: MonthSchema,
    attempts: list(AttemptSchema),
    writings: list(WritingSchema),
  })
  .superRefine((doc, ctx) => {
    for (const key of ["attempts", "writings"] as const) {
      doc[key].forEach((record, index) => {
        if (monthOfTime(record.at) !== doc.month) {
          ctx.addIssue({
            code: "custom",
            path: [key, index, "at"],
            message: `Record is not in month ${doc.month}`,
          });
        }
      });
    }
  });
export type HistoryDoc = z.infer<typeof HistoryDocSchema>;

export type DocOf = {
  profile: ProfileDoc;
  child: ChildDoc;
  history: HistoryDoc;
};

const DOC_SCHEMAS = {
  profile: ProfileDocSchema,
  child: ChildDocSchema,
  history: HistoryDocSchema,
} as const;

// ---------------------------------------------------------------------------
// Versions and migration

// A step lifts a raw doc of version n to version n + 1; `steps[n - 1]` is the
// step from version n. There is none yet: version 1 is the only one.
export type MigrationStep = (raw: Record<string, unknown>) => unknown;
export const MIGRATION_STEPS: Record<DocKind, readonly MigrationStep[]> = {
  profile: [],
  child: [],
  history: [],
};

export type MigrateResult<T> =
  | { ok: true; doc: T }
  // The doc was written by a newer app: it must be neither merged nor
  // written, because that would drop the fields this code does not know.
  | { ok: false; reason: "too-new"; version: number }
  | { ok: false; reason: "invalid"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Lifts raw to `current` through `steps`, or reports why it cannot.
export function liftToVersion(
  raw: unknown,
  steps: readonly MigrationStep[],
  current: number,
): MigrateResult<unknown> {
  if (!isRecord(raw)) {
    return { ok: false, reason: "invalid", message: "Doc is not an object" };
  }
  let version = raw.version;
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 1
  ) {
    return {
      ok: false,
      reason: "invalid",
      message: "Doc has no valid version",
    };
  }
  if (version > current) return { ok: false, reason: "too-new", version };
  let doc: unknown = raw;
  while (version < current) {
    const step = steps[version - 1];
    if (!step || !isRecord(doc)) {
      return {
        ok: false,
        reason: "invalid",
        message: `No migration from version ${version}`,
      };
    }
    doc = { ...(step(doc) as Record<string, unknown>), version: version + 1 };
    version += 1;
  }
  return { ok: true, doc };
}

// Lifts a stored doc of any known version to the current one and validates
// it. Pure; used on every doc read from the cloud or from a backup.
export function migrateDoc<K extends DocKind>(
  kind: K,
  raw: unknown,
): MigrateResult<DocOf[K]> {
  const lifted = liftToVersion(raw, MIGRATION_STEPS[kind], DOC_VERSION);
  if (!lifted.ok) return lifted;
  const parsed = DOC_SCHEMAS[kind].safeParse(lifted.doc);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "invalid",
      message: parsed.error.issues
        .slice(0, 3)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  }
  return { ok: true, doc: parsed.data as DocOf[K] };
}

export function emptyChildDoc(familyId: string, childId: string): ChildDoc {
  return {
    schema: DOC_SCHEMA_NAME.child,
    version: DOC_VERSION,
    familyId,
    childId,
    cards: [],
    sections: [],
    stickers: [],
    activityDays: [],
    historyMonths: [],
    overviewSeen: {},
    resets: {},
  };
}

export function emptyHistoryDoc(
  familyId: string,
  childId: string,
  month: string,
): HistoryDoc {
  return {
    schema: DOC_SCHEMA_NAME.history,
    version: DOC_VERSION,
    familyId,
    childId,
    month,
    attempts: [],
    writings: [],
  };
}

export function emptyProfileDoc(familyId: string): ProfileDoc {
  return {
    schema: DOC_SCHEMA_NAME.profile,
    version: DOC_VERSION,
    familyId,
    profiles: [],
  };
}

// ---------------------------------------------------------------------------
// Canonical form

function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortedBy<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareText(key(a), key(b)));
}

// JSON with object keys in alphabetical order at every depth: the same value
// always gives the same text, whatever order its keys were built in. Arrays
// keep their order.
export function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, inner) => {
    if (isRecord(inner)) {
      return Object.fromEntries(
        Object.keys(inner)
          .sort(compareText)
          .map((k) => [k, inner[k]]),
      );
    }
    return inner;
  });
}

// A doc with every array sorted by its key. Two docs holding the same data
// have the same canonical text however their arrays were ordered; this is the
// form compared for equality and hashed to find out whether a doc changed.
export function canonicalDoc<K extends DocKind>(
  kind: K,
  doc: DocOf[K],
): DocOf[K] {
  switch (kind) {
    case "profile": {
      const d = doc as ProfileDoc;
      return { ...d, profiles: sortedBy(d.profiles, (p) => p.id) } as DocOf[K];
    }
    case "child": {
      const d = doc as ChildDoc;
      return {
        ...d,
        cards: sortedBy(d.cards, (c) => c.cardId),
        sections: sortedBy(d.sections, (s) => s.sectionId),
        stickers: sortedBy(d.stickers, (s) => s.lessonId),
        activityDays: [...d.activityDays].sort(compareText),
        historyMonths: [...d.historyMonths].sort(compareText),
      } as DocOf[K];
    }
    case "history": {
      const d = doc as HistoryDoc;
      return {
        ...d,
        attempts: sortedBy(d.attempts, (a) => a.id),
        writings: sortedBy(d.writings, (w) => w.id),
      } as DocOf[K];
    }
    default:
      throw new Error(`Unknown doc kind: ${String(kind)}`);
  }
}

export function canonicalText<K extends DocKind>(
  kind: K,
  doc: DocOf[K],
): string {
  return stableStringify(canonicalDoc(kind, doc));
}
