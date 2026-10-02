import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { getClockOffset, now, setClockOffset } from "@/lib/time";
import { localScope, TutorDb } from "@/progress/db";
import {
  appDb,
  createProfile,
  resetAppDbForTesting,
  setOverviewSeen,
  setProfileGrade,
  updateProfile,
} from "@/progress/hooks";
import {
  completeSection,
  recordAttempt,
  saveSectionPosition,
} from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { saveOpenEndedWriting } from "@/progress/writing";
import {
  CLOCK_OFFSET_KEY,
  offsetFromServerTime,
  restoreClockOffset,
  storeClockOffset,
} from "@/sync/clock";

const HOUR = 3_600_000;
let db: TutorDb | undefined;

afterEach(async () => {
  setClockOffset(0);
  await db?.delete();
  db = undefined;
  await appDb().delete();
  resetAppDbForTesting();
});

// How far a stored time is from the device clock plus the offset in force.
function skew(stored: string | undefined, offsetMs: number): number {
  return Math.abs(Date.parse(stored ?? "") - (Date.now() + offsetMs));
}

describe("offsetFromServerTime", () => {
  it("is the server time minus the device time", () => {
    expect(
      offsetFromServerTime(
        "2026-10-01T10:00:00.000Z",
        new Date("2026-10-01T09:00:00.000Z"),
      ),
    ).toBe(HOUR);
    expect(
      offsetFromServerTime(
        "2026-10-01T10:00:00.000Z",
        new Date("2026-10-01T10:30:00.000Z"),
      ),
    ).toBe(-HOUR / 2);
  });
});

describe("stored clock offset", () => {
  it("starts at 0 on a device that never synced", async () => {
    db = new TutorDb("tutor-clock-test");
    setClockOffset(5 * HOUR);
    await restoreClockOffset(db);
    expect(getClockOffset()).toBe(0);
  });

  it("is applied at once, kept for the next start and used by now()", async () => {
    db = new TutorDb("tutor-clock-test");
    await storeClockOffset(db, 2 * HOUR);
    const corrected = now().getTime() - Date.now();
    expect(Math.abs(corrected - 2 * HOUR)).toBeLessThan(2_000);

    setClockOffset(0);
    await restoreClockOffset(db);
    expect(getClockOffset()).toBe(2 * HOUR);
    expect(
      (await db.settings.toArray()).filter((s) => s.key === CLOCK_OFFSET_KEY),
    ).toEqual([
      expect.objectContaining({
        childId: "_device",
        key: CLOCK_OFFSET_KEY,
        value: 2 * HOUR,
      }),
    ]);
  });

  it("ignores a stored value that is not a number", async () => {
    db = new TutorDb("tutor-clock-test");
    await db.settings.put({
      familyId: "local",
      childId: "_device",
      key: CLOCK_OFFSET_KEY,
      value: "soon",
    });
    await restoreClockOffset(db);
    expect(getClockOffset()).toBe(0);
  });
});

describe("every stored time uses the corrected clock", () => {
  const OFFSET = 3 * HOUR;
  const scope = localScope("3f9c2a7be1d04c58a6b7f0e2c4d91a35");
  const ref = { lessonId: "l-one", sectionId: "l-one.section.a" };
  const TOLERANCE = 5_000;

  it("answers, section progress, writings and resets store now() with the offset", async () => {
    db = new TutorDb("tutor-clock-test");
    setClockOffset(OFFSET);

    const attempt = await recordAttempt(
      db,
      {
        ...scope,
        lessonId: "l-one",
        exerciseId: "l-one.ex.q",
        cardIds: ["l-one.card.a"],
        firstTryCorrect: true,
        wrongCount: 0,
        context: "practice",
      },
      now(),
    );
    await saveSectionPosition(
      db,
      scope,
      ref,
      { phase: "check", index: 1 },
      now(),
    );
    const position = await db.sectionProgress.toArray();
    await completeSection(db, scope, ref, [ref.sectionId], now());
    const done = await db.sectionProgress.toArray();
    const writing = await saveOpenEndedWriting(
      db,
      scope,
      "l-one.ex.viet",
      { writing: { text: "x", checks: [] } },
      now(),
    );
    const card = (await db.cardStates.toArray())[0];
    const reset = await resetLessonProgress(db, scope, "l-one", now());

    expect(skew(attempt.at, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(card?.lastReviewAt, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(position[0]?.updatedAt, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(done[0]?.updatedAt, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(done[0]?.doneAt ?? undefined, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(writing.at, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(reset.at, OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew((await db.lessonResets.toArray())[0]?.at, OFFSET)).toBeLessThan(
      TOLERANCE,
    );
  });

  it("profile changes and overview marks made through the hooks use it too", async () => {
    setClockOffset(-OFFSET);
    const profile = await createProfile(
      { name: "Na", avatar: "fox", grade: 6 },
      [],
    );
    expect(skew(profile.createdAt, -OFFSET)).toBeLessThan(TOLERANCE);
    expect(skew(profile.updatedAt, -OFFSET)).toBeLessThan(TOLERANCE);

    setClockOffset(OFFSET);
    const renamed = await updateProfile(profile.id, {
      name: "Na Na",
      avatar: "fox",
      grade: 6,
    });
    expect(skew(renamed?.updatedAt, OFFSET)).toBeLessThan(TOLERANCE);
    const regraded = await setProfileGrade(profile.id, 7);
    expect(skew(regraded?.updatedAt, OFFSET)).toBeLessThan(TOLERANCE);

    await setOverviewSeen(profile.id, "l-one");
    const mark = (await appDb().settings.toArray()).find((s) =>
      s.key.startsWith("overviewSeen:"),
    );
    expect(skew(String(mark?.value), OFFSET)).toBeLessThan(TOLERANCE);
  });
});
