import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  awardSticker,
  type ChildScope,
  DEVICE_SCOPE,
  type ProfileRecord,
  putSectionProgress,
  setSetting,
  TutorDb,
} from "@/progress/db";
import {
  buildProgressExport,
  PROGRESS_EXPORT_FORMAT,
  PROGRESS_EXPORT_VERSION,
  progressExportFileName,
  readParentData,
} from "@/progress/parent-data";
import { recordAttempt } from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { saveOpenEndedWriting } from "@/progress/writing";

const NOW = new Date("2026-09-30T02:00:00Z");
const na: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "na" };
const bin: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "bin" };

const profile: ProfileRecord = {
  id: na.childId,
  familyId: LOCAL_FAMILY_ID,
  name: "Bé Na",
  avatar: "fox",
  grade: 6,
  series: { math: "kntt" },
  createdAt: NOW.toISOString(),
  updatedAt: NOW.toISOString(),
};

async function study(db: TutorDb, scope: ChildScope) {
  await recordAttempt(
    db,
    {
      ...scope,
      exerciseId: "l.ex.a",
      lessonId: "l",
      cardIds: ["l.card.a"],
      firstTryCorrect: false,
      wrongCount: 2,
      context: "practice",
    },
    NOW,
  );
  await putSectionProgress(db, {
    ...scope,
    sectionId: "l.section.1",
    lessonId: "l",
    state: "done",
    position: { phase: "blocks", index: 0 },
    updatedAt: NOW.toISOString(),
    doneAt: NOW.toISOString(),
  });
  await awardSticker(db, scope, "l", NOW);
  await saveOpenEndedWriting(
    db,
    scope,
    "l.ex.viet",
    {
      writing: {
        text: "Em giúp bạn.",
        checks: [{ criterion: "Kể việc", met: true }],
      },
    },
    NOW,
  );
}

describe("parent data", () => {
  let db: TutorDb;

  beforeEach(() => {
    db = new TutorDb(`parent-data-${Math.random()}`);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("reads everything of one child and nothing of another", async () => {
    await study(db, na);
    await study(db, bin);
    const data = await readParentData(db, na);
    expect(data.attempts).toHaveLength(1);
    expect(data.attempts[0]?.childId).toBe("na");
    expect(data.cardStates.map((s) => s.cardId)).toEqual(["l.card.a"]);
    expect(data.sections).toHaveLength(1);
    expect(data.stickers).toHaveLength(1);
    expect(data.activityDays).toEqual(["2026-09-30"]);
    expect(data.writings.map((w) => w.text)).toEqual(["Em giúp bạn."]);
  });

  it("exports the child's records and settings, but not the device's", async () => {
    await study(db, na);
    await study(db, bin);
    await setSetting(db, na, "soundEnabled", false);
    await setSetting(db, DEVICE_SCOPE, "parentPin", "secret");
    const backup = await buildProgressExport(db, profile, NOW);
    expect(backup).toMatchObject({
      format: PROGRESS_EXPORT_FORMAT,
      version: PROGRESS_EXPORT_VERSION,
      exportedAt: NOW.toISOString(),
      profile,
      activityDays: ["2026-09-30"],
    });
    expect(backup.settings).toEqual([
      { ...na, key: "soundEnabled", value: false },
    ]);
    expect(backup.attempts.every((a) => a.childId === "na")).toBe(true);
    // Plain JSON: survives a round trip unchanged.
    expect(JSON.parse(JSON.stringify(backup))).toEqual(backup);
  });

  it("writes version 2 with the lesson resets and the time each section was done", async () => {
    await study(db, na);
    await resetLessonProgress(db, na, "other", NOW);
    const backup = await buildProgressExport(db, profile, NOW);
    expect(backup.version).toBe(2);
    expect(backup.resets).toEqual({ other: NOW.toISOString() });
    expect(backup.sections[0]?.doneAt).toBe(NOW.toISOString());
  });

  it("names the backup file in plain ASCII", () => {
    expect(progressExportFileName("Bé Na", "2026-09-30")).toBe(
      "tien-do-be-na-2026-09-30.json",
    );
    expect(progressExportFileName("Đức Anh!", "2026-09-30")).toBe(
      "tien-do-duc-anh-2026-09-30.json",
    );
    expect(progressExportFileName("★", "2026-09-30")).toBe(
      "tien-do-con-2026-09-30.json",
    );
  });
});
