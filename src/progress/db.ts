import { Dexie, type Table } from "dexie";
import { DEFAULT_GRADE, LOCAL_FAMILY_ID } from "@/lib/config";
import type { LessonCardState } from "@/srs/select";
import type { AttemptContext, SectionPhase } from "./enums";

export type { AttemptContext, SectionPhase };

// Local-first progress store. Every record carries the family and child it
// belongs to, so one device can hold several children (and later families)
// and records can be merged with the synced copy without rewriting keys.
// Timestamps are ISO strings so records export and sync as plain JSON.

export const DB_NAME = "tutor";

export type ChildScope = { familyId: string; childId: string };

// A profile is the child itself: its `id` is the `childId` of every other record.
export type ProfileRecord = {
  id: string;
  familyId: string;
  name: string;
  avatar: string;
  // The school year the child studies (1 to 12); home shows that grade's
  // subjects.
  grade: number;
  // Subject id -> series id the child studies for that subject (used where
  // that series is of the child's grade).
  series: Record<string, string>;
  createdAt: string;
  // Last time the name, avatar or grade changed; the later copy of a profile
  // wins when devices sync.
  updatedAt: string;
};

export type CardStateRecord = ChildScope & LessonCardState;

export type AttemptRecord = ChildScope & {
  id: string;
  exerciseId: string;
  lessonId: string;
  cardIds: string[];
  firstTryCorrect: boolean;
  wrongCount: number;
  at: string;
  context: AttemptContext;
};

// Ordered from lowest to highest so the later merge can keep the furthest state.
export const SECTION_STATES = ["not_started", "in_progress", "done"] as const;
export type SectionState = (typeof SECTION_STATES)[number];

// The item the child is on: `index` counts blocks in "blocks", exercises in
// "check" / "practice", and is 0 in "recap".
export type SectionPosition = { phase: SectionPhase; index: number };

export const SECTION_START: SectionPosition = { phase: "blocks", index: 0 };

export type SectionProgressRecord = ChildScope & {
  sectionId: string;
  lessonId: string;
  state: SectionState;
  // Where the child left off, so the section resumes on the same item.
  position: SectionPosition;
  updatedAt: string;
  // When the section was last completed; null while it is only in progress.
  // `state` is "done" exactly when this is set (the upgrade of older records
  // and every writer keep the two in step); sync merges by this time.
  doneAt: string | null;
};

// `day` is a Vietnam-time day key (yyyy-mm-dd) from `vnDayKey`.
export type ActivityDayRecord = ChildScope & { day: string };

export type StickerRecord = ChildScope & { lessonId: string; at: string };

export type WritingCheck = { criterion: string; met: boolean };

export type WritingRecord = ChildScope & {
  id: string;
  exerciseId: string;
  text: string;
  checks: WritingCheck[];
  at: string;
};

export type SettingValue = string | number | boolean | null;

export type SettingRecord = ChildScope & { key: string; value: SettingValue };

// Marks that a child started a lesson over at `at`. It is the tombstone sync
// uses to drop the lesson's older records on every device, and it stays after
// the erase.
export type LessonResetRecord = ChildScope & { lessonId: string; at: string };

// What sync last did for one child: the hash of the main doc as last sent
// (`syncedHash`), its etag, and per month of history the same plus whether the
// cloud copy of that month has been applied to this device. A doc whose hash
// now differs has unsent changes. Bookkeeping of this device only; never
// synced.
export type SyncMonthState = {
  // Hash of the whole month doc as last sent or applied.
  hash: string | null;
  // Hash of each lesson's records of that doc as last sent or applied, so a
  // lesson erased by a reset does not look like unsent changes.
  parts: Record<string, string>;
  etag: string | null;
  applied: boolean;
};

export type SyncStateRecord = ChildScope & {
  syncedHash: string | null;
  etag: string | null;
  lastSyncAt: string | null;
  lastError: string | null;
  docBytes: number | null;
  months: Record<string, SyncMonthState>;
};

// Settings that describe the device rather than a child (e.g. which child is
// using it) live in the same table under this reserved child id. Generated
// child ids are hex strings, so the underscore can never collide with one.
export const DEVICE_SCOPE: ChildScope = {
  familyId: LOCAL_FAMILY_ID,
  childId: "_device",
};
// The sync state of the family's profile doc is kept in `syncState` under
// this reserved child id (generated child ids are hex, so it cannot collide).
export const FAMILY_DOC_STATE_SCOPE: ChildScope = {
  familyId: LOCAL_FAMILY_ID,
  childId: "_family",
};
export const ACTIVE_PROFILE_KEY = "activeProfileId";
// Per-child setting: false once the child turns the "ting" off; unset = on.
export const SOUND_ENABLED_KEY = "soundEnabled";

// The scope of a child's records on this device: they all live under the
// local family id (`LOCAL_FAMILY_ID`), whichever family syncs them.
export function localScope(childId: string): ChildScope {
  return { familyId: LOCAL_FAMILY_ID, childId };
}

type ScopedKey = [string, string, string];

export class TutorDb extends Dexie {
  declare profiles: Table<ProfileRecord, string>;
  declare cardStates: Table<CardStateRecord, ScopedKey>;
  declare attempts: Table<AttemptRecord, string>;
  declare sectionProgress: Table<SectionProgressRecord, ScopedKey>;
  declare activityDays: Table<ActivityDayRecord, ScopedKey>;
  declare stickers: Table<StickerRecord, ScopedKey>;
  declare writings: Table<WritingRecord, string>;
  declare settings: Table<SettingRecord, ScopedKey>;
  declare lessonResets: Table<LessonResetRecord, ScopedKey>;
  declare syncState: Table<SyncStateRecord, [string, string]>;

  constructor(name: string = DB_NAME) {
    super(name);
    this.version(1).stores({
      profiles: "id, familyId",
      cardStates: "[familyId+childId+cardId], [familyId+childId+lessonId]",
      attempts: "id, [familyId+childId], [familyId+childId+lessonId]",
      sectionProgress:
        "[familyId+childId+sectionId], [familyId+childId+lessonId]",
      activityDays: "[familyId+childId+day], [familyId+childId]",
      stickers: "[familyId+childId+lessonId], [familyId+childId]",
      writings: "id, [familyId+childId]",
      settings: "[familyId+childId+key]",
    });
    // Profiles saved before grades existed move to the default grade; their
    // progress records are not touched.
    this.version(2).upgrade((tx) =>
      tx
        .table<Partial<ProfileRecord>>("profiles")
        .toCollection()
        .modify((profile) => {
          profile.grade ??= DEFAULT_GRADE;
        }),
    );
    // Sync adds a reset marker table, the per-child sync bookkeeping, month
    // range indexes on the two history tables and three fields. The upgrade
    // touches only those fields and every step can run again.
    this.version(3)
      .stores({
        attempts:
          "id, [familyId+childId], [familyId+childId+lessonId], [familyId+childId+at]",
        writings: "id, [familyId+childId], [familyId+childId+at]",
        lessonResets: "[familyId+childId+lessonId]",
        syncState: "[familyId+childId]",
      })
      .upgrade(async (tx) => {
        await tx
          .table<Partial<ProfileRecord> & Pick<ProfileRecord, "createdAt">>(
            "profiles",
          )
          .toCollection()
          .modify((profile) => {
            profile.updatedAt ??= profile.createdAt;
          });
        await tx
          .table<Partial<SectionProgressRecord> & SectionProgressRecord>(
            "sectionProgress",
          )
          .toCollection()
          .modify((record) => {
            if (record.doneAt === undefined) {
              record.doneAt = record.state === "done" ? record.updatedAt : null;
            }
          });
        await tx
          .table<SettingRecord>("settings")
          .toCollection()
          .modify((setting) => {
            if (
              setting.key.startsWith(OVERVIEW_SEEN_PREFIX) &&
              setting.value === true
            ) {
              setting.value = OVERVIEW_SEEN_LEGACY_AT;
            }
          });
      });
  }
}

function scopeKey({ familyId, childId }: ChildScope): [string, string] {
  return [familyId, childId];
}

export function listProfiles(
  db: TutorDb,
  familyId: string,
): Promise<ProfileRecord[]> {
  return db.profiles.where("familyId").equals(familyId).sortBy("createdAt");
}

export async function putProfile(
  db: TutorDb,
  profile: ProfileRecord,
): Promise<void> {
  await db.profiles.put(profile);
}

export function getCardStates(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
): Promise<CardStateRecord[]> {
  return db.cardStates
    .where("[familyId+childId+lessonId]")
    .equals([...scopeKey(scope), lessonId])
    .toArray();
}

export function listCardStates(
  db: TutorDb,
  { familyId, childId }: ChildScope,
): Promise<CardStateRecord[]> {
  return db.cardStates
    .where("[familyId+childId+lessonId]")
    .between(
      [familyId, childId, Dexie.minKey],
      [familyId, childId, Dexie.maxKey],
    )
    .toArray();
}

export function listAttempts(
  db: TutorDb,
  scope: ChildScope,
): Promise<AttemptRecord[]> {
  return db.attempts
    .where("[familyId+childId]")
    .equals(scopeKey(scope))
    .sortBy("at");
}

export function getSectionProgress(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
): Promise<SectionProgressRecord[]> {
  return db.sectionProgress
    .where("[familyId+childId+lessonId]")
    .equals([...scopeKey(scope), lessonId])
    .toArray();
}

export function listSectionProgress(
  db: TutorDb,
  scope: ChildScope,
): Promise<SectionProgressRecord[]> {
  return db.sectionProgress
    .where("[familyId+childId+lessonId]")
    .between(
      [...scopeKey(scope), Dexie.minKey],
      [...scopeKey(scope), Dexie.maxKey],
    )
    .toArray();
}

export async function putSectionProgress(
  db: TutorDb,
  record: SectionProgressRecord,
): Promise<void> {
  await db.sectionProgress.put(record);
}

export async function markActivityDay(
  db: TutorDb,
  scope: ChildScope,
  day: string,
): Promise<void> {
  await db.activityDays.put({ ...scope, day });
}

export async function listActivityDays(
  db: TutorDb,
  scope: ChildScope,
): Promise<string[]> {
  const records = await db.activityDays
    .where("[familyId+childId]")
    .equals(scopeKey(scope))
    .toArray();
  return records.map((r) => r.day).sort();
}

// Earning a sticker twice keeps the first date it was earned.
export async function awardSticker(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
  at: Date,
): Promise<void> {
  await db.transaction("rw", db.stickers, async () => {
    const existing = await db.stickers.get([...scopeKey(scope), lessonId]);
    if (!existing) {
      await db.stickers.add({ ...scope, lessonId, at: at.toISOString() });
    }
  });
}

export function listStickers(
  db: TutorDb,
  scope: ChildScope,
): Promise<StickerRecord[]> {
  return db.stickers
    .where("[familyId+childId]")
    .equals(scopeKey(scope))
    .sortBy("at");
}

export async function saveWriting(
  db: TutorDb,
  writing: WritingRecord,
): Promise<void> {
  await db.writings.put(writing);
}

export function listWritings(
  db: TutorDb,
  scope: ChildScope,
): Promise<WritingRecord[]> {
  return db.writings
    .where("[familyId+childId]")
    .equals(scopeKey(scope))
    .sortBy("at");
}

export async function getSetting(
  db: TutorDb,
  scope: ChildScope,
  key: string,
): Promise<SettingValue | undefined> {
  const record = await db.settings.get([...scopeKey(scope), key]);
  return record?.value;
}

// Per-child settings that record the lesson overviews a child has already
// been through: `overviewSeen:<lessonId>` = the time it was last seen. Older
// records hold `true`, which the upgrade turns into the epoch below (a reset
// made anywhere still drops such a mark, so the overview may show once more).
// Readers accept both forms.
export const OVERVIEW_SEEN_PREFIX = "overviewSeen:";
export const OVERVIEW_SEEN_LEGACY_AT = "1970-01-01T00:00:00.000Z";

export async function markOverviewSeen(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
  at: Date,
): Promise<void> {
  await setSetting(
    db,
    scope,
    `${OVERVIEW_SEEN_PREFIX}${lessonId}`,
    at.toISOString(),
  );
}

// Lesson id -> when this child last saw its overview. A mark stored as `true`
// (older records) counts as seen at the epoch.
export async function listOverviewSeenAt(
  db: TutorDb,
  scope: ChildScope,
): Promise<Record<string, string>> {
  const records = await db.settings
    .where("[familyId+childId+key]")
    .between(
      [...scopeKey(scope), OVERVIEW_SEEN_PREFIX],
      [...scopeKey(scope), `${OVERVIEW_SEEN_PREFIX}\uffff`],
    )
    .toArray();
  const seen: Record<string, string> = {};
  for (const { key, value } of records) {
    if (value === true)
      seen[key.slice(OVERVIEW_SEEN_PREFIX.length)] = OVERVIEW_SEEN_LEGACY_AT;
    else if (typeof value === "string") {
      seen[key.slice(OVERVIEW_SEEN_PREFIX.length)] = value;
    }
  }
  return seen;
}

// Ids of the lessons whose overview this child has seen.
export async function listOverviewsSeen(
  db: TutorDb,
  scope: ChildScope,
): Promise<string[]> {
  return Object.keys(await listOverviewSeenAt(db, scope));
}

export async function setSetting(
  db: TutorDb,
  scope: ChildScope,
  key: string,
  value: SettingValue,
): Promise<void> {
  await db.settings.put({ ...scope, key, value });
}
