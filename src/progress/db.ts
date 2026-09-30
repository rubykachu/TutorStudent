import { Dexie, type Table } from "dexie";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import type { LessonCardState } from "@/srs/select";

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
  // Subject id -> series id the child studies for that subject.
  series: Record<string, string>;
  createdAt: string;
};

export type CardStateRecord = ChildScope & LessonCardState;

export const ATTEMPT_CONTEXTS = ["practice", "check", "review"] as const;
export type AttemptContext = (typeof ATTEMPT_CONTEXTS)[number];

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

// A section is worked through in this order: explanation blocks, comprehension
// checks, practice exercises, then the closing recap.
export const SECTION_PHASES = ["blocks", "check", "practice", "recap"] as const;
export type SectionPhase = (typeof SECTION_PHASES)[number];

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

// Settings that describe the device rather than a child (e.g. which child is
// using it) live in the same table under this reserved child id. Generated
// child ids are hex strings, so the underscore can never collide with one.
export const DEVICE_SCOPE: ChildScope = {
  familyId: LOCAL_FAMILY_ID,
  childId: "_device",
};
export const ACTIVE_PROFILE_KEY = "activeProfileId";
// Per-child setting: false once the child turns the "ting" off; unset = on.
export const SOUND_ENABLED_KEY = "soundEnabled";

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
// been through: `overviewSeen:<lessonId>` = true.
const OVERVIEW_SEEN_PREFIX = "overviewSeen:";

export async function markOverviewSeen(
  db: TutorDb,
  scope: ChildScope,
  lessonId: string,
): Promise<void> {
  await setSetting(db, scope, `${OVERVIEW_SEEN_PREFIX}${lessonId}`, true);
}

// Ids of the lessons whose overview this child has seen.
export async function listOverviewsSeen(
  db: TutorDb,
  scope: ChildScope,
): Promise<string[]> {
  const records = await db.settings
    .where("[familyId+childId+key]")
    .between(
      [...scopeKey(scope), OVERVIEW_SEEN_PREFIX],
      [...scopeKey(scope), `${OVERVIEW_SEEN_PREFIX}\uffff`],
    )
    .toArray();
  return records
    .filter((r) => r.value === true)
    .map((r) => r.key.slice(OVERVIEW_SEEN_PREFIX.length));
}

export async function setSetting(
  db: TutorDb,
  scope: ChildScope,
  key: string,
  value: SettingValue,
): Promise<void> {
  await db.settings.put({ ...scope, key, value });
}
