import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setNowForTesting } from "@/lib/time";
import {
  awardSticker,
  FAMILY_DOC_STATE_SCOPE,
  localScope,
  markActivityDay,
  markOverviewSeen,
  type SyncStateRecord,
  setSetting,
  type TutorDb,
} from "@/progress/db";
import {
  appDb,
  createProfile,
  resetAppDbForTesting,
  setActiveProfile,
  setOverviewSeen,
  setProfileGrade,
  setSoundEnabled,
  updateProfile,
} from "@/progress/hooks";
import {
  completeSection,
  recordAttempt,
  saveSectionPosition,
} from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { saveOpenEndedWriting } from "@/progress/writing";
import { dirtyDocs, dirtyProfileDoc, monthParts } from "@/sync/dirty";
import { CHILD, FAMILY } from "./generators";

const PREVIOUS = "2026-09";
const CURRENT = "2026-10";
const MONTHS = [PREVIOUS, CURRENT];
const IN_SEPTEMBER = new Date("2026-09-15T03:00:00Z");
const NOW = new Date("2026-10-15T03:00:00Z");
const scope = localScope(CHILD);

const LESSON_A = "l-one";
const LESSON_B = "l-two";

function db(): TutorDb {
  return appDb();
}

type Answer = { lessonId: string; context?: "practice" | "check" | "skipped" };

function answer(at: Date, { lessonId, context = "practice" }: Answer) {
  return recordAttempt(
    db(),
    {
      ...scope,
      lessonId,
      exerciseId: `${lessonId}.ex.q`,
      cardIds: context === "practice" ? [`${lessonId}.card.a`] : [],
      firstTryCorrect: true,
      wrongCount: 0,
      context,
    },
    at,
  );
}

const ref = (lessonId: string) => ({
  lessonId,
  sectionId: `${lessonId}.section.a`,
});

const syncedRow = (hash: string): SyncStateRecord => ({
  ...scope,
  syncedHash: hash,
  etag: "e",
  lastSyncAt: null,
  lastError: null,
  docBytes: null,
  months: {},
});

// Pretends everything built from Dexie right now was just sent.
async function markAllSynced() {
  const report = await dirtyDocs(db(), FAMILY, CHILD, MONTHS);
  await db().syncState.put({
    ...syncedRow(report.main.hash),
    months: Object.fromEntries(
      report.months.map((m) => [
        m.month,
        { hash: m.hash, parts: m.parts, etag: "e", applied: true },
      ]),
    ),
  });
  const profiles = await dirtyProfileDoc(db(), FAMILY);
  await db().syncState.put({
    ...syncedRow(profiles.hash),
    ...FAMILY_DOC_STATE_SCOPE,
  });
}

// Which docs hold unsent changes.
async function dirty() {
  const report = await dirtyDocs(db(), FAMILY, CHILD, MONTHS);
  const dirtyMonths = report.months.filter((m) => m.dirty).map((m) => m.month);
  return {
    main: report.main.dirty,
    months: dirtyMonths,
    profile: (await dirtyProfileDoc(db(), FAMILY)).dirty,
  };
}

const NOTHING = { main: false, months: [], profile: false };

beforeEach(async () => {
  setNowForTesting(() => NOW);
  await createProfile({ name: "Na", avatar: "fox", grade: 6 }, []);
  await answer(IN_SEPTEMBER, { lessonId: LESSON_A });
  await answer(NOW, { lessonId: LESSON_A });
  await answer(NOW, { lessonId: LESSON_B });
  await saveSectionPosition(
    db(),
    scope,
    ref(LESSON_A),
    { phase: "check", index: 1 },
    NOW,
  );
  await saveOpenEndedWriting(
    db(),
    scope,
    `${LESSON_A}.ex.viet`,
    { writing: { text: "Bạn em", checks: [] } },
    IN_SEPTEMBER,
  );
  await markAllSynced();
});

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  setNowForTesting(null);
});

describe("dirtyDocs", () => {
  it("finds nothing dirty once everything was sent, however often it is asked", async () => {
    expect(await dirty()).toEqual(NOTHING);
    expect(await dirty()).toEqual(NOTHING);
  });

  it("finds everything dirty on a device that never synced", async () => {
    await db().syncState.clear();
    expect(await dirty()).toEqual({
      main: true,
      months: [PREVIOUS, CURRENT],
      profile: true,
    });
  });

  it("builds the main doc and the months asked for, oldest first", async () => {
    const report = await dirtyDocs(db(), FAMILY, CHILD, [
      CURRENT,
      PREVIOUS,
      CURRENT,
    ]);
    expect(report.months.map((m) => m.month)).toEqual([PREVIOUS, CURRENT]);
    expect(report.months[0]?.doc.attempts).toHaveLength(1);
    expect(report.months[1]?.doc.attempts).toHaveLength(2);
    expect(report.main.doc.historyMonths).toEqual([PREVIOUS, CURRENT]);
  });

  it("gives the same hash for the same data on every read", async () => {
    const first = await dirtyDocs(db(), FAMILY, CHILD, MONTHS);
    const second = await dirtyDocs(db(), FAMILY, CHILD, [...MONTHS].reverse());
    expect(second.main.hash).toBe(first.main.hash);
    expect(second.months.map((m) => m.hash)).toEqual(
      first.months.map((m) => m.hash),
    );
  });
});

describe("which doc each write makes dirty", () => {
  it("an answer to a practice question: the main doc and its month", async () => {
    await answer(new Date(NOW.getTime() + 60_000), { lessonId: LESSON_A });
    expect(await dirty()).toEqual({
      ...NOTHING,
      main: true,
      months: [CURRENT],
    });
  });

  it("an answer in an older month marks that month, not the current one", async () => {
    await answer(new Date("2026-09-15T04:00:00Z"), {
      lessonId: LESSON_A,
      context: "check",
    });
    expect(await dirty()).toEqual({ ...NOTHING, months: [PREVIOUS] });
  });

  it("a comprehension check or skipped question on a day already studied: its month only", async () => {
    await answer(new Date(NOW.getTime() + 60_000), {
      lessonId: LESSON_A,
      context: "check",
    });
    await answer(new Date(NOW.getTime() + 120_000), {
      lessonId: LESSON_A,
      context: "skipped",
    });
    expect(await dirty()).toEqual({ ...NOTHING, months: [CURRENT] });
  });

  it("the first answer of a new study day also marks the main doc (the day)", async () => {
    await answer(new Date("2026-10-16T03:00:00Z"), {
      lessonId: LESSON_A,
      context: "check",
    });
    expect(await dirty()).toEqual({
      ...NOTHING,
      main: true,
      months: [CURRENT],
    });
  });

  it("saving the place in a section: the main doc only", async () => {
    await saveSectionPosition(
      db(),
      scope,
      ref(LESSON_A),
      { phase: "practice", index: 2 },
      new Date(NOW.getTime() + 60_000),
    );
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
  });

  it("completing a section: the main doc only", async () => {
    await completeSection(
      db(),
      scope,
      ref(LESSON_A),
      [ref(LESSON_A).sectionId],
      new Date(NOW.getTime() + 60_000),
    );
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
  });

  it("saving an open-ended writing: its month only", async () => {
    await saveOpenEndedWriting(
      db(),
      scope,
      `${LESSON_B}.ex.viet`,
      {
        writing: {
          text: "Viết lại",
          checks: [{ criterion: "mở bài", met: true }],
        },
      },
      new Date(NOW.getTime() + 60_000),
    );
    expect(await dirty()).toEqual({ ...NOTHING, months: [CURRENT] });
  });

  it("a sticker, a study day and an overview mark: the main doc only", async () => {
    await awardSticker(db(), scope, LESSON_A, NOW);
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
    await markAllSynced();
    await markActivityDay(db(), scope, "2026-10-20");
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
    await markAllSynced();
    await markOverviewSeen(db(), scope, LESSON_A, NOW);
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
    await markAllSynced();
    await setOverviewSeen(CHILD, LESSON_B);
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
  });

  it("a reset: the main doc only, no month, old or recent", async () => {
    await resetLessonProgress(
      db(),
      scope,
      LESSON_A,
      new Date(NOW.getTime() + 60_000),
    );
    expect(await dirty()).toEqual({ ...NOTHING, main: true });
    // The erased answers are really gone locally.
    const report = await dirtyDocs(db(), FAMILY, CHILD, MONTHS);
    expect(report.months[0]?.doc.attempts).toEqual([]);
    expect(report.months[1]?.doc.attempts.map((a) => a.lessonId)).toEqual([
      LESSON_B,
    ]);
  });

  it("answers given after a reset mark that lesson's month again", async () => {
    const reset = new Date(NOW.getTime() + 60_000);
    await resetLessonProgress(db(), scope, LESSON_A, reset);
    await markAllSynced();
    await answer(new Date(reset.getTime() + 60_000), { lessonId: LESSON_A });
    expect((await dirty()).months).toEqual([CURRENT]);
  });

  it("a new profile, a rename and a grade change: the profile doc only", async () => {
    const created = await createProfile(
      { name: "Bin", avatar: "cat", grade: 6 },
      [],
    );
    expect(await dirty()).toEqual({ ...NOTHING, profile: true });
    await markAllSynced();
    setNowForTesting(() => new Date(NOW.getTime() + 60_000));
    await updateProfile(created.id, {
      name: "Bin Bin",
      avatar: "cat",
      grade: 6,
    });
    expect(await dirty()).toEqual({ ...NOTHING, profile: true });
    await markAllSynced();
    setNowForTesting(() => new Date(NOW.getTime() + 120_000));
    await setProfileGrade(created.id, 7);
    expect(await dirty()).toEqual({ ...NOTHING, profile: true });
  });

  it("the sound switch, the active child and other device settings change nothing", async () => {
    await setSoundEnabled(CHILD, false);
    await setActiveProfile(null);
    await setSetting(db(), localScope("_device"), "clockOffsetMs", 1234);
    await setSetting(db(), scope, "anythingElse", "x");
    expect(await dirty()).toEqual(NOTHING);
  });
});

describe("monthParts", () => {
  it("hashes the records of each lesson apart, attempts and writings together", async () => {
    const report = await dirtyDocs(db(), FAMILY, CHILD, MONTHS);
    expect(Object.keys(report.months[1]?.parts ?? {}).sort()).toEqual(
      [LESSON_B, LESSON_A].sort(),
    );
    // The September writing belongs to lesson A, like the September answer.
    expect(Object.keys(report.months[0]?.parts ?? {})).toEqual([LESSON_A]);
    expect(monthParts(report.months[1]?.doc as never)).toEqual(
      report.months[1]?.parts,
    );
  });

  it("changes a lesson's part when one of its records is added, and no other", async () => {
    const before = (await dirtyDocs(db(), FAMILY, CHILD, [CURRENT])).months[0]
      ?.parts;
    await answer(new Date(NOW.getTime() + 60_000), { lessonId: LESSON_B });
    const after = (await dirtyDocs(db(), FAMILY, CHILD, [CURRENT])).months[0]
      ?.parts;
    expect(after?.[LESSON_A]).toBe(before?.[LESSON_A]);
    expect(after?.[LESSON_B]).not.toBe(before?.[LESSON_B]);
  });
});
