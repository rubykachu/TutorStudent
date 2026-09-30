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

function listCardStates(
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
// tell old files apart.
export const PROGRESS_EXPORT_FORMAT = "tutor-progress";
export const PROGRESS_EXPORT_VERSION = 1;

export type ProgressExport = ParentData & {
  format: typeof PROGRESS_EXPORT_FORMAT;
  version: typeof PROGRESS_EXPORT_VERSION;
  exportedAt: string;
  profile: ProfileRecord;
  settings: SettingRecord[];
};

// The child's whole local record as plain JSON: a backup to keep until
// progress syncs to the family's storage.
export async function buildProgressExport(
  db: TutorDb,
  profile: ProfileRecord,
  now: Date,
): Promise<ProgressExport> {
  const scope = { familyId: profile.familyId, childId: profile.id };
  const [data, settings] = await Promise.all([
    readParentData(db, scope),
    db.settings
      .where("[familyId+childId+key]")
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
