import {
  BACKUP_IMPORT_MAX_BYTES,
  LOCAL_FAMILY_ID,
  SYNC_FUTURE_SKEW_MINUTES,
} from "@/lib/config";
import { now } from "@/lib/time";
import {
  listProfiles,
  OVERVIEW_SEEN_LEGACY_AT,
  OVERVIEW_SEEN_PREFIX,
  type ProfileRecord,
  putProfile,
  type TutorDb,
} from "@/progress/db";
import {
  PROGRESS_EXPORT_FORMAT,
  PROGRESS_EXPORT_VERSION,
} from "@/progress/parent-data";
import { clampFutureTimes } from "@/sync/clamp";
import { visibleHistory } from "@/sync/history";
import { applyChildDoc, readChildDoc } from "@/sync/local";
import { applyHistoryDoc } from "@/sync/local-history";
import { mergeChildDocs } from "@/sync/merge";
import {
  type ChildDoc,
  DOC_VERSION,
  emptyChildDoc,
  emptyHistoryDoc,
  type HistoryDoc,
  migrateDoc,
  monthOfTime,
  type SyncAttempt,
  type SyncWriting,
} from "@/sync/schema";

// Reading a backup file and merging it into this device. Two kinds of file
// are accepted: the export of the parent page (`tutor-progress`, versions 1
// and 2) and a main child doc (a restored daily snapshot). A backup is only
// ever merged: nothing the device holds is overwritten, a record a later
// reset hides is skipped, and a second import of the same file changes
// nothing. The docs it changes differ from what was last sent, so the next
// full sync sends them.

export type BackupError =
  | "too-large"
  // Not JSON at all.
  | "not-json"
  // JSON, but not a backup of this app.
  | "wrong-format"
  // Written by a newer app.
  | "too-new"
  // A backup whose content breaks the rules of the docs.
  | "invalid"
  // A snapshot of a child this device does not have.
  | "no-profile";

export type RecordCounts = {
  cards: number;
  sections: number;
  stickers: number;
  activityDays: number;
  attempts: number;
  writings: number;
};

// What a file holds and what importing it would do, shown before merging.
export type BackupPlan = {
  source: "export" | "snapshot";
  // The child the file belongs to; its records join the child's of this id.
  childId: string;
  childName: string;
  // When the export was made; null for a snapshot.
  exportedAt: string | null;
  // The profile is not on this device yet and will be created.
  createsProfile: boolean;
  profile: ProfileRecord;
  counts: RecordCounts;
  // The state part, as a main doc, and the answers and writings by month.
  doc: ChildDoc;
  months: HistoryDoc[];
};

export type ReadBackup =
  | { ok: true; plan: BackupPlan }
  | { ok: false; error: BackupError };

const fail = (error: BackupError): ReadBackup => ({ ok: false, error });

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const array = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

// Drops the keys a record of Dexie carries that a doc does not.
function pick<T extends string>(
  value: unknown,
  keys: readonly T[],
): Record<T, unknown> {
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(keys.map((key) => [key, source[key]])) as Record<
    T,
    unknown
  >;
}

// The state part of an export as a main doc (not validated yet). Version 1
// files lack `doneAt`, `resets` and times in `overviewSeen`: they are derived
// the way the database upgrade derives them.
function exportToChildDoc(
  file: Record<string, unknown>,
  childId: string,
  overviewSeen: Record<string, string>,
): unknown {
  const sections = array(file.sections).map((raw) => {
    const s = isRecord(raw) ? raw : {};
    const doneAt =
      typeof s.doneAt === "string" || s.doneAt === null
        ? s.doneAt
        : s.state === "done"
          ? s.updatedAt
          : null;
    return {
      ...pick(s, ["sectionId", "lessonId", "updatedAt"]),
      doneAt,
      position: pick(s.position, ["phase", "index"]),
    };
  });
  return {
    schema: emptyChildDoc(LOCAL_FAMILY_ID, childId).schema,
    version: DOC_VERSION,
    familyId: LOCAL_FAMILY_ID,
    childId,
    cards: array(file.cardStates).map((c) =>
      pick(c, [
        "cardId",
        "lessonId",
        "due",
        "stability",
        "difficulty",
        "scheduledDays",
        "learningSteps",
        "reps",
        "lapses",
        "state",
        "lastReviewAt",
      ]),
    ),
    sections,
    stickers: array(file.stickers).map((s) => pick(s, ["lessonId", "at"])),
    activityDays: array(file.activityDays),
    historyMonths: [],
    overviewSeen,
    resets: isRecord(file.resets) ? file.resets : {},
  };
}

// Times of the overview marks in an export's settings: `true` (older files)
// counts as seen at the epoch, as in the database.
function overviewSeenOf(
  file: Record<string, unknown>,
  childId: string,
): Record<string, string> {
  const seen: Record<string, string> = {};
  for (const setting of array(file.settings)) {
    if (!isRecord(setting) || setting.childId !== childId) continue;
    const { key, value } = setting;
    if (typeof key !== "string" || !key.startsWith(OVERVIEW_SEEN_PREFIX)) {
      continue;
    }
    const lessonId = key.slice(OVERVIEW_SEEN_PREFIX.length);
    if (value === true) seen[lessonId] = OVERVIEW_SEEN_LEGACY_AT;
    else if (typeof value === "string") seen[lessonId] = value;
  }
  return seen;
}

// Groups answers and writings by the Vietnam-time month of their time into
// history docs (not validated yet).
function monthDocs(
  childId: string,
  attempts: readonly unknown[],
  writings: readonly unknown[],
): unknown[] {
  const docs = new Map<string, HistoryDoc>();
  const doc = (month: string) => {
    let entry = docs.get(month);
    if (!entry) {
      entry = emptyHistoryDoc(LOCAL_FAMILY_ID, childId, month);
      docs.set(month, entry);
    }
    return entry;
  };
  const monthOf = (record: unknown): string | null => {
    const at = isRecord(record) ? record.at : undefined;
    return typeof at === "string" && !Number.isNaN(Date.parse(at))
      ? monthOfTime(new Date(at).toISOString())
      : null;
  };
  for (const raw of attempts) {
    const month = monthOf(raw);
    // A record with no usable time stays in a doc of month "" so validation
    // rejects the whole file.
    (month === null ? doc("invalid") : doc(month)).attempts.push(
      pick(raw, [
        "id",
        "exerciseId",
        "lessonId",
        "cardIds",
        "firstTryCorrect",
        "wrongCount",
        "at",
        "context",
      ]) as unknown as SyncAttempt,
    );
  }
  for (const raw of writings) {
    const month = monthOf(raw);
    (month === null ? doc("invalid") : doc(month)).writings.push({
      ...pick(raw, ["id", "exerciseId", "text", "at"]),
      checks: array(isRecord(raw) ? raw.checks : []).map((c) =>
        pick(c, ["criterion", "met"]),
      ),
    } as unknown as SyncWriting);
  }
  return [...docs.values()];
}

function countsOf(doc: ChildDoc, months: readonly HistoryDoc[]): RecordCounts {
  return {
    cards: doc.cards.length,
    sections: doc.sections.length,
    stickers: doc.stickers.length,
    activityDays: doc.activityDays.length,
    attempts: months.reduce((n, m) => n + m.attempts.length, 0),
    writings: months.reduce((n, m) => n + m.writings.length, 0),
  };
}

function validateMonths(raw: readonly unknown[]): HistoryDoc[] | null {
  const months: HistoryDoc[] = [];
  for (const doc of raw) {
    const result = migrateDoc("history", doc);
    if (!result.ok) return null;
    months.push(result.doc);
  }
  return months;
}

// A file's times in this device's future become now, as the server does with
// every write (`clampFutureTimes`). The merge runs on the device before any
// server sees the file, so without this a reset dated years ahead in a crafted
// or corrupt file would erase the device's answers of that lesson at once and
// hide every later one, and a record dated ahead would win every later merge.
function futureLimit(): { limit: string; at: string } {
  const at = now();
  return {
    limit: new Date(
      at.getTime() + SYNC_FUTURE_SKEW_MINUTES * 60_000,
    ).toISOString(),
    at: at.toISOString(),
  };
}

function clampChildDoc(doc: ChildDoc): ChildDoc | null {
  const { limit, at } = futureLimit();
  const clamped = clampFutureTimes("child", doc, limit, at);
  if (!clamped.changed) return doc;
  const again = migrateDoc("child", clamped.doc);
  return again.ok ? again.doc : null;
}

// Months whose records were clamped are regrouped: a record moved to now
// belongs to the current month's doc.
function clampMonths(
  childId: string,
  months: HistoryDoc[],
): HistoryDoc[] | null {
  const { limit, at } = futureLimit();
  const clamped = months.map((m) => clampFutureTimes("history", m, limit, at));
  if (!clamped.some((m) => m.changed)) return months;
  return validateMonths(
    monthDocs(
      childId,
      clamped.flatMap((m) => m.doc.attempts),
      clamped.flatMap((m) => m.doc.writings),
    ),
  );
}

// Reads a backup file's text. `size` is the file's size in bytes. Nothing is
// written.
export async function readBackup(
  db: TutorDb,
  text: string,
  size: number,
): Promise<ReadBackup> {
  if (size > BACKUP_IMPORT_MAX_BYTES) return fail("too-large");
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return fail("not-json");
  }
  if (!isRecord(file)) return fail("wrong-format");
  const local = await listProfiles(db, LOCAL_FAMILY_ID);

  // A restored daily snapshot: only the state of a child that exists here.
  if (file.schema === emptyChildDoc(LOCAL_FAMILY_ID, "x").schema) {
    const migrated = migrateDoc("child", file);
    if (!migrated.ok) {
      return fail(migrated.reason === "too-new" ? "too-new" : "invalid");
    }
    // Only its state counts, and it joins this device's records, whichever
    // family wrote it.
    const doc = clampChildDoc({
      ...migrated.doc,
      familyId: LOCAL_FAMILY_ID,
      historyMonths: [],
    });
    if (doc === null) return fail("invalid");
    const profile = local.find((p) => p.id === doc.childId);
    if (!profile) return fail("no-profile");
    return {
      ok: true,
      plan: {
        source: "snapshot",
        childId: doc.childId,
        childName: profile.name,
        exportedAt: null,
        createsProfile: false,
        profile,
        counts: countsOf(doc, []),
        doc,
        months: [],
      },
    };
  }

  if (file.format !== PROGRESS_EXPORT_FORMAT) return fail("wrong-format");
  const version = file.version;
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 1
  ) {
    return fail("invalid");
  }
  if (version > PROGRESS_EXPORT_VERSION) return fail("too-new");

  const raw = isRecord(file.profile) ? file.profile : {};
  const candidate = {
    ...pick(raw, ["id", "name", "avatar", "grade", "series", "createdAt"]),
    updatedAt: raw.updatedAt ?? raw.createdAt,
  };
  const profileDoc = migrateDoc("profile", {
    schema: "tutor-family-profiles",
    version: DOC_VERSION,
    familyId: LOCAL_FAMILY_ID,
    profiles: [candidate],
  });
  const exportedAt = file.exportedAt;
  if (
    !profileDoc.ok ||
    typeof exportedAt !== "string" ||
    Number.isNaN(Date.parse(exportedAt))
  ) {
    return fail("invalid");
  }
  const fromFile = profileDoc.doc.profiles[0];
  if (!fromFile) return fail("invalid");
  const childId = fromFile.id;

  const migrated = migrateDoc(
    "child",
    exportToChildDoc(file, childId, overviewSeenOf(file, childId)),
  );
  const read = validateMonths(
    monthDocs(childId, array(file.attempts), array(file.writings)),
  );
  if (!migrated.ok || read === null) return fail("invalid");
  const doc = clampChildDoc(migrated.doc);
  const months = clampMonths(childId, read);
  if (doc === null || months === null) return fail("invalid");

  const existing = local.find((p) => p.id === childId);
  const profile: ProfileRecord = existing ?? {
    ...fromFile,
    familyId: LOCAL_FAMILY_ID,
  };
  return {
    ok: true,
    plan: {
      source: "export",
      childId,
      childName: profile.name,
      exportedAt: new Date(exportedAt).toISOString(),
      createsProfile: existing === undefined,
      profile,
      counts: countsOf(doc, months),
      doc,
      months,
    },
  };
}

export type ImportSummary = {
  // Records that were not on this device and now are.
  added: number;
  // Records of the file that a later reset of their lesson hides.
  skipped: number;
};

const sizeOf = (doc: ChildDoc) =>
  doc.cards.length +
  doc.sections.length +
  doc.stickers.length +
  doc.activityDays.length;

// How many state records `after` has that `before` has not.
function newStateRecords(before: ChildDoc, after: ChildDoc): number {
  const count = <T>(
    had: readonly T[],
    now: readonly T[],
    key: (item: T) => string,
  ) => {
    const known = new Set(had.map(key));
    return now.filter((item) => !known.has(key(item))).length;
  };
  return (
    count(before.cards, after.cards, (c) => c.cardId) +
    count(before.sections, after.sections, (s) => s.sectionId) +
    count(before.stickers, after.stickers, (s) => s.lessonId) +
    count(before.activityDays, after.activityDays, (d) => d)
  );
}

// Merges a backup into the device: the profile (when missing), the state
// through the main doc's merge, and each month's answers and writings through
// the same apply the sync uses (a record is added when absent, never
// replaced, never deleted).
export async function importBackup(
  db: TutorDb,
  plan: BackupPlan,
): Promise<ImportSummary> {
  const { childId } = plan;
  if (plan.createsProfile) await putProfile(db, plan.profile);

  const before = await readChildDoc(db, childId, LOCAL_FAMILY_ID);
  const merged = mergeChildDocs(before, plan.doc);
  await applyChildDoc(db, merged);

  // How much of the file's state survives the device's own resets.
  const resetsOnly: ChildDoc = {
    ...emptyChildDoc(LOCAL_FAMILY_ID, childId),
    resets: merged.resets,
  };
  const kept = mergeChildDocs(resetsOnly, plan.doc);
  let skipped = sizeOf(plan.doc) - sizeOf(kept);

  const after = await readChildDoc(db, childId, LOCAL_FAMILY_ID);
  let added = newStateRecords(before, after);

  for (const month of plan.months) {
    const visible = visibleHistory(month, merged.resets);
    skipped +=
      month.attempts.length -
      visible.attempts.length +
      (month.writings.length - visible.writings.length);
    const result = await applyHistoryDoc(db, month, merged.resets);
    added += result.attempts + result.writings;
  }
  return { added, skipped };
}
