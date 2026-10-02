import { Dexie } from "dexie";
import type {
  AttemptRecord,
  CardStateRecord,
  ChildScope,
  ProfileRecord,
  SectionProgressRecord,
  SettingRecord,
  StickerRecord,
  TutorDb,
  WritingRecord,
} from "@/progress/db";
import {
  listActivityDays,
  listAttempts,
  listCardStates,
  listSectionProgress,
  listStickers,
  listWritings,
} from "@/progress/db";

// Everything this device holds about one child, read in one go for the
// parent page and for the progress backup file.

export type ParentData = {
  attempts: AttemptRecord[];
  cardStates: CardStateRecord[];
  sections: SectionProgressRecord[];
  stickers: StickerRecord[];
  // Vietnam day keys the child studied on, oldest first.
  activityDays: string[];
  // Oldest first.
  writings: WritingRecord[];
};

export async function readParentData(
  db: TutorDb,
  scope: ChildScope,
): Promise<ParentData> {
  const [attempts, cardStates, sections, stickers, activityDays, writings] =
    await Promise.all([
      listAttempts(db, scope),
      listCardStates(db, scope),
      listSectionProgress(db, scope),
      listStickers(db, scope),
      listActivityDays(db, scope),
      listWritings(db, scope),
    ]);
  return { attempts, cardStates, sections, stickers, activityDays, writings };
}

// Bumped whenever the shape of the backup changes, so a later import can
// tell old files apart. Version 2 adds `resets` (when each lesson was started
// over); its `overviewSeen:*` settings hold times and its sections carry
// `doneAt`. Version 1 files still import: the missing parts are derived.
export const PROGRESS_EXPORT_FORMAT = "tutor-progress";
export const PROGRESS_EXPORT_VERSION = 2;

export type ProgressExport = ParentData & {
  format: typeof PROGRESS_EXPORT_FORMAT;
  version: typeof PROGRESS_EXPORT_VERSION;
  exportedAt: string;
  profile: ProfileRecord;
  settings: SettingRecord[];
  // Lesson id -> when the child started it over.
  resets: Record<string, string>;
};

// The child's whole local record as plain JSON: a backup to keep until
// progress syncs to the family's storage.
export async function buildProgressExport(
  db: TutorDb,
  profile: ProfileRecord,
  now: Date,
): Promise<ProgressExport> {
  const scope = { familyId: profile.familyId, childId: profile.id };
  const [data, settings, resets] = await Promise.all([
    readParentData(db, scope),
    db.settings
      .where("[familyId+childId+key]")
      .between(
        [scope.familyId, scope.childId, Dexie.minKey],
        [scope.familyId, scope.childId, Dexie.maxKey],
      )
      .toArray(),
    db.lessonResets
      .where("[familyId+childId+lessonId]")
      .between(
        [scope.familyId, scope.childId, Dexie.minKey],
        [scope.familyId, scope.childId, Dexie.maxKey],
      )
      .toArray(),
  ]);
  return {
    format: PROGRESS_EXPORT_FORMAT,
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: now.toISOString(),
    profile,
    settings,
    resets: Object.fromEntries(resets.map((r) => [r.lessonId, r.at])),
    ...data,
  };
}

// e.g. "tien-do-be-na-2026-09-30.json": ASCII only, so every file system and
// share sheet keeps the name intact.
export function progressExportFileName(name: string, day: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `tien-do-${slug || "con"}-${day}.json`;
}
