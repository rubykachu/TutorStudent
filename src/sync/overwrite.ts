import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  localScope,
  OVERVIEW_SEEN_PREFIX,
  type ProfileRecord,
  type TutorDb,
} from "@/progress/db";
import {
  type ChildDoc,
  type DocKind,
  type DocOf,
  type HistoryDoc,
  type ProfileDoc,
  stableStringify,
} from "@/sync/schema";

// The server replaces a time that lies in its future with its own time and
// answers with the doc it stored. Merging that doc into Dexie cannot bring the
// clamped times back ("the later time wins" keeps the local, later one), so
// this writes the stored version over each local record the server changed.
// A record is overwritten only while it still holds the time that was sent:
// one the child touched since stays as it is.

const differs = (a: unknown, b: unknown) =>
  stableStringify(a) !== stableStringify(b);

// The records of `stored` that are not the same as the record of `sent` with
// the same key.
function changed<T>(
  sent: readonly T[],
  stored: readonly T[],
  key: (record: T) => string,
): { stored: T; sent: T }[] {
  const before = new Map(sent.map((record) => [key(record), record]));
  return stored.flatMap((record) => {
    const was = before.get(key(record));
    return was !== undefined && differs(was, record)
      ? [{ stored: record, sent: was }]
      : [];
  });
}

async function overwriteChild(
  db: TutorDb,
  sent: ChildDoc,
  stored: ChildDoc,
): Promise<void> {
  const scope = localScope(stored.childId);
  const key = (last: string): [string, string, string] => [
    scope.familyId,
    scope.childId,
    last,
  ];
  await db.transaction(
    "rw",
    [
      db.cardStates,
      db.sectionProgress,
      db.stickers,
      db.activityDays,
      db.settings,
      db.lessonResets,
    ],
    async () => {
      for (const c of changed(sent.cards, stored.cards, (x) => x.cardId)) {
        const local = await db.cardStates.get(key(c.stored.cardId));
        if (local?.lastReviewAt === c.sent.lastReviewAt) {
          await db.cardStates.put({ ...local, ...c.stored });
        }
      }
      for (const s of changed(
        sent.sections,
        stored.sections,
        (x) => x.sectionId,
      )) {
        const local = await db.sectionProgress.get(key(s.stored.sectionId));
        if (
          local?.updatedAt === s.sent.updatedAt &&
          local.doneAt === s.sent.doneAt
        ) {
          await db.sectionProgress.put({
            ...local,
            ...s.stored,
            state: s.stored.doneAt === null ? "in_progress" : "done",
          });
        }
      }
      for (const s of changed(
        sent.stickers,
        stored.stickers,
        (x) => x.lessonId,
      )) {
        const local = await db.stickers.get(key(s.stored.lessonId));
        if (local?.at === s.sent.at) {
          await db.stickers.put({ ...local, at: s.stored.at });
        }
      }
      const keptDays = new Set(stored.activityDays);
      await db.activityDays.bulkDelete(
        sent.activityDays.filter((day) => !keptDays.has(day)).map(key),
      );
      await db.activityDays.bulkPut(
        stored.activityDays.map((day) => ({ ...scope, day })),
      );
      for (const [lessonId, at] of Object.entries(stored.overviewSeen)) {
        const settingKey = key(`${OVERVIEW_SEEN_PREFIX}${lessonId}`);
        const local = await db.settings.get(settingKey);
        if (
          local?.value === sent.overviewSeen[lessonId] &&
          local.value !== at
        ) {
          await db.settings.put({ ...local, value: at });
        }
      }
      for (const [lessonId, at] of Object.entries(stored.resets)) {
        const local = await db.lessonResets.get(key(lessonId));
        if (local?.at === sent.resets[lessonId] && local.at !== at) {
          await db.lessonResets.put({ ...local, at });
        }
      }
    },
  );
}

async function overwriteHistory(
  db: TutorDb,
  sent: HistoryDoc,
  stored: HistoryDoc,
): Promise<void> {
  await db.transaction("rw", [db.attempts, db.writings], async () => {
    for (const a of changed(sent.attempts, stored.attempts, (x) => x.id)) {
      const local = await db.attempts.get(a.stored.id);
      if (local?.at === a.sent.at) {
        await db.attempts.put({ ...local, at: a.stored.at });
      }
    }
    for (const w of changed(sent.writings, stored.writings, (x) => x.id)) {
      const local = await db.writings.get(w.stored.id);
      if (local?.at === w.sent.at) {
        await db.writings.put({ ...local, at: w.stored.at });
      }
    }
  });
}

async function overwriteProfiles(
  db: TutorDb,
  sent: ProfileDoc,
  stored: ProfileDoc,
): Promise<void> {
  await db.transaction("rw", db.profiles, async () => {
    for (const p of changed(sent.profiles, stored.profiles, (x) => x.id)) {
      const local = await db.profiles.get(p.stored.id);
      if (
        local?.updatedAt === p.sent.updatedAt &&
        local.createdAt === p.sent.createdAt
      ) {
        await db.profiles.put({
          ...p.stored,
          familyId: LOCAL_FAMILY_ID,
        } satisfies ProfileRecord);
      }
    }
  });
}

export async function overwriteClamped<K extends DocKind>(
  db: TutorDb,
  kind: K,
  sent: DocOf[K],
  stored: DocOf[K],
): Promise<void> {
  switch (kind) {
    case "child":
      return overwriteChild(db, sent as ChildDoc, stored as ChildDoc);
    case "history":
      return overwriteHistory(db, sent as HistoryDoc, stored as HistoryDoc);
    case "profile":
      return overwriteProfiles(db, sent as ProfileDoc, stored as ProfileDoc);
    default:
      throw new Error(`Unknown doc kind: ${String(kind)}`);
  }
}
