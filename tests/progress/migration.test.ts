import "fake-indexeddb/auto";
import { Dexie } from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_GRADE, LOCAL_FAMILY_ID } from "@/lib/config";
import {
  listOverviewsSeen,
  OVERVIEW_SEEN_LEGACY_AT,
  TutorDb,
} from "@/progress/db";

// The database exactly as shipped before sync (versions 1 and 2): a device
// that studied with this schema must open at the current one and keep every
// record.
class ShippedDb extends Dexie {
  constructor(name: string) {
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
    this.version(2).upgrade((tx) =>
      tx
        .table("profiles")
        .toCollection()
        .modify((profile) => {
          profile.grade ??= 6;
        }),
    );
  }
}

const NAME = "tutor-migration-test";
const kid = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const device = { familyId: LOCAL_FAMILY_ID, childId: "_device" };

const profile = {
  id: "kid-1",
  familyId: LOCAL_FAMILY_ID,
  name: "An",
  avatar: "fox",
  grade: 6,
  series: { math: "kntt" },
  createdAt: "2026-03-01T00:00:00.000Z",
};
const doneSection = {
  ...kid,
  sectionId: "powers.section.one",
  lessonId: "powers",
  state: "done",
  position: { phase: "blocks", index: 0 },
  updatedAt: "2026-03-02T01:00:00.000Z",
};
const openSection = {
  ...kid,
  sectionId: "powers.section.two",
  lessonId: "powers",
  state: "in_progress",
  position: { phase: "practice", index: 2 },
  updatedAt: "2026-03-03T01:00:00.000Z",
};
const card = {
  ...kid,
  cardId: "powers.card.a",
  lessonId: "powers",
  due: "2026-03-05T00:00:00.000Z",
  stability: 3.2,
  difficulty: 5,
  scheduledDays: 2,
  learningSteps: 0,
  reps: 2,
  lapses: 0,
  state: 2,
  lastReviewAt: "2026-03-03T00:00:00.000Z",
};
const attempts = [
  {
    ...kid,
    id: "at-1",
    exerciseId: "powers.ex.a",
    lessonId: "powers",
    cardIds: ["powers.card.a"],
    firstTryCorrect: true,
    wrongCount: 0,
    at: "2026-03-02T01:10:00.000Z",
    context: "practice",
  },
  {
    ...kid,
    id: "at-2",
    exerciseId: "powers.ex.b",
    lessonId: "powers",
    cardIds: [],
    firstTryCorrect: false,
    wrongCount: 2,
    at: "2026-04-02T01:10:00.000Z",
    context: "check",
  },
];
const writing = {
  ...kid,
  id: "w-1",
  exerciseId: "powers.ex.viet",
  text: "Mình thích toán.",
  checks: [{ criterion: "Có mở bài", met: true }],
  at: "2026-03-04T01:00:00.000Z",
};
const sticker = { ...kid, lessonId: "powers", at: "2026-03-03T02:00:00.000Z" };
const activityDay = { ...kid, day: "2026-03-02" };
const settings = [
  { ...kid, key: "overviewSeen:powers", value: true },
  { ...kid, key: "overviewSeen:roots", value: true },
  { ...kid, key: "soundEnabled", value: false },
  { ...device, key: "activeProfileId", value: "kid-1" },
];

async function seedShippedDb(): Promise<void> {
  const shipped = new ShippedDb(NAME);
  await shipped.table("profiles").put(profile);
  await shipped.table("sectionProgress").bulkPut([doneSection, openSection]);
  await shipped.table("cardStates").put(card);
  await shipped.table("attempts").bulkPut(attempts);
  await shipped.table("writings").put(writing);
  await shipped.table("stickers").put(sticker);
  await shipped.table("activityDays").put(activityDay);
  await shipped.table("settings").bulkPut(settings);
  shipped.close();
}

let db: TutorDb | undefined;

afterEach(async () => {
  await db?.delete();
  db = undefined;
});

describe("upgrade from the schema shipped before sync", () => {
  it("keeps every profile, section, card, attempt, writing, sticker, day and setting", async () => {
    await seedShippedDb();
    db = new TutorDb(NAME);
    await db.open();

    expect(await db.profiles.toArray()).toEqual([
      { ...profile, updatedAt: profile.createdAt },
    ]);
    expect(await db.sectionProgress.toArray()).toEqual(
      expect.arrayContaining([
        { ...doneSection, doneAt: doneSection.updatedAt },
        { ...openSection, doneAt: null },
      ]),
    );
    expect(await db.sectionProgress.count()).toBe(2);
    expect(await db.cardStates.toArray()).toEqual([card]);
    expect(await db.attempts.toArray()).toEqual(
      expect.arrayContaining(attempts),
    );
    expect(await db.attempts.count()).toBe(attempts.length);
    expect(await db.writings.toArray()).toEqual([writing]);
    expect(await db.stickers.toArray()).toEqual([sticker]);
    expect(await db.activityDays.toArray()).toEqual([activityDay]);
    expect(await db.lessonResets.count()).toBe(0);
    expect(await db.syncState.count()).toBe(0);
  });

  it("turns each overviewSeen true into the epoch time and leaves other settings alone", async () => {
    await seedShippedDb();
    db = new TutorDb(NAME);
    await db.open();

    const stored = await db.settings.toArray();
    const byKey = Object.fromEntries(stored.map((s) => [s.key, s.value]));
    expect(byKey).toEqual({
      "overviewSeen:powers": OVERVIEW_SEEN_LEGACY_AT,
      "overviewSeen:roots": OVERVIEW_SEEN_LEGACY_AT,
      soundEnabled: false,
      activeProfileId: "kid-1",
    });
  });

  it("lists the same seen overviews before and after the upgrade", async () => {
    await seedShippedDb();
    // Read through the current code with the old records still holding `true`:
    // the reader accepts both forms.
    const before = new Dexie(NAME);
    before.version(2).stores({ settings: "[familyId+childId+key]" });
    const legacyValues = (await before.table("settings").toArray()).filter(
      (s) => s.key.startsWith("overviewSeen:"),
    );
    expect(legacyValues.map((s) => s.value)).toEqual([true, true]);
    before.close();
    const beforeIds = legacyValues
      .filter((s) => s.value === true)
      .map((s) => s.key.slice("overviewSeen:".length))
      .sort();

    db = new TutorDb(NAME);
    await db.open();
    expect((await listOverviewsSeen(db, kid)).sort()).toEqual(beforeIds);
  });

  it("gives an older profile with no grade the default grade and an updatedAt", async () => {
    const shipped = new Dexie(NAME);
    shipped.version(1).stores({ profiles: "id, familyId" });
    const { grade: _grade, ...noGrade } = profile;
    await shipped.table("profiles").put(noGrade);
    shipped.close();

    db = new TutorDb(NAME);
    expect(await db.profiles.toArray()).toEqual([
      { ...noGrade, grade: DEFAULT_GRADE, updatedAt: profile.createdAt },
    ]);
  });

  it("adds the month range indexes to attempts and writings", async () => {
    await seedShippedDb();
    db = new TutorDb(NAME);
    await db.open();

    const march = await db.attempts
      .where("[familyId+childId+at]")
      .between(
        [kid.familyId, kid.childId, "2026-03"],
        [kid.familyId, kid.childId, "2026-04"],
        true,
        false,
      )
      .toArray();
    expect(march.map((a) => a.id)).toEqual(["at-1"]);
    const writings = await db.writings
      .where("[familyId+childId+at]")
      .between(
        [kid.familyId, kid.childId, "2026-03"],
        [kid.familyId, kid.childId, "2026-04"],
        true,
        false,
      )
      .toArray();
    expect(writings.map((w) => w.id)).toEqual(["w-1"]);
  });

  it("opens a database that is already current without changing anything", async () => {
    await seedShippedDb();
    db = new TutorDb(NAME);
    await db.open();
    const first = await db.sectionProgress.toArray();
    db.close();
    db = new TutorDb(NAME);
    await db.open();
    expect(await db.sectionProgress.toArray()).toEqual(first);
  });
});
