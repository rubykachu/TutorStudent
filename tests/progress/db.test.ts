import "fake-indexeddb/auto";
import { Dexie } from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_GRADE, LOCAL_FAMILY_ID } from "@/lib/config";
import {
  awardSticker,
  type ChildScope,
  DB_NAME,
  getSectionProgress,
  getSetting,
  listActivityDays,
  listProfiles,
  listSectionProgress,
  listStickers,
  listWritings,
  markActivityDay,
  putProfile,
  putSectionProgress,
  saveWriting,
  setSetting,
  TutorDb,
} from "@/progress/db";

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const sibling: ChildScope = { ...scope, childId: "kid-2" };

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
});

afterEach(async () => {
  await db.delete();
});

describe("TutorDb", () => {
  it("opens the tutor database with every progress table", async () => {
    await db.open();
    expect(db.name).toBe(DB_NAME);
    expect(db.tables.map((t) => t.name).sort()).toEqual([
      "activityDays",
      "attempts",
      "cardStates",
      "profiles",
      "sectionProgress",
      "settings",
      "stickers",
      "writings",
    ]);
  });
});

describe("activity days", () => {
  it("records each day once per child, sorted", async () => {
    await markActivityDay(db, scope, "2026-03-03");
    await markActivityDay(db, scope, "2026-03-02");
    await markActivityDay(db, scope, "2026-03-03");
    await markActivityDay(db, sibling, "2026-03-04");
    expect(await listActivityDays(db, scope)).toEqual([
      "2026-03-02",
      "2026-03-03",
    ]);
  });
});

describe("profiles", () => {
  it("lists a family's children oldest first", async () => {
    const base = {
      familyId: LOCAL_FAMILY_ID,
      avatar: "fox",
      grade: 6,
      series: {},
    };
    await putProfile(db, {
      ...base,
      id: "kid-2",
      name: "Bin",
      createdAt: "2026-03-02T00:00:00.000Z",
    });
    await putProfile(db, {
      ...base,
      id: "kid-1",
      name: "An",
      series: { math: "kntt" },
      createdAt: "2026-03-01T00:00:00.000Z",
    });
    await putProfile(db, {
      ...base,
      familyId: "other",
      id: "kid-3",
      name: "Cam",
      createdAt: "2026-03-01T00:00:00.000Z",
    });
    const profiles = await listProfiles(db, LOCAL_FAMILY_ID);
    expect(profiles.map((p) => p.name)).toEqual(["An", "Bin"]);
    expect(profiles[0]?.series).toEqual({ math: "kntt" });
  });
});

describe("section progress", () => {
  it("stores one record per section and reads a lesson's sections", async () => {
    const record = {
      ...scope,
      sectionId: "powers.section.one",
      lessonId: "powers",
      state: "in_progress" as const,
      position: { phase: "blocks" as const, index: 2 },
      updatedAt: "2026-03-02T01:00:00.000Z",
    };
    await putSectionProgress(db, record);
    await putSectionProgress(db, {
      ...record,
      state: "done",
      position: { phase: "recap", index: 0 },
    });
    await putSectionProgress(db, {
      ...record,
      sectionId: "roots.section.one",
      lessonId: "roots",
    });
    await putSectionProgress(db, { ...record, ...sibling });
    expect(await getSectionProgress(db, scope, "powers")).toEqual([
      { ...record, state: "done", position: { phase: "recap", index: 0 } },
    ]);
  });

  it("lists every section a child touched across lessons", async () => {
    const record = {
      ...scope,
      sectionId: "powers.section.one",
      lessonId: "powers",
      state: "in_progress" as const,
      position: { phase: "blocks" as const, index: 0 },
      updatedAt: "2026-03-02T01:00:00.000Z",
    };
    const other = {
      ...record,
      sectionId: "roots.section.one",
      lessonId: "roots",
    };
    await putSectionProgress(db, record);
    await putSectionProgress(db, other);
    await putSectionProgress(db, { ...record, ...sibling });
    expect(await listSectionProgress(db, scope)).toEqual([record, other]);
  });
});

describe("stickers", () => {
  it("keeps the date a sticker was first earned", async () => {
    await awardSticker(db, scope, "powers", new Date("2026-03-02T01:00:00Z"));
    await awardSticker(db, scope, "powers", new Date("2026-03-05T01:00:00Z"));
    await awardSticker(db, scope, "roots", new Date("2026-03-03T01:00:00Z"));
    await awardSticker(db, sibling, "powers", new Date("2026-03-04T01:00:00Z"));
    expect(await listStickers(db, scope)).toEqual([
      { ...scope, lessonId: "powers", at: "2026-03-02T01:00:00.000Z" },
      { ...scope, lessonId: "roots", at: "2026-03-03T01:00:00.000Z" },
    ]);
  });
});

describe("writings", () => {
  it("saves and lists a child's writings oldest first", async () => {
    const writing = {
      ...scope,
      id: "w2",
      exerciseId: "friend.ex.write",
      text: "Bạn tốt là người biết lắng nghe.",
      checks: [{ criterion: "Nêu ý chính", met: true }],
      at: "2026-03-03T01:00:00.000Z",
    };
    await saveWriting(db, writing);
    await saveWriting(db, {
      ...writing,
      id: "w1",
      at: "2026-03-02T01:00:00.000Z",
    });
    await saveWriting(db, { ...writing, ...sibling, id: "w3" });
    expect((await listWritings(db, scope)).map((w) => w.id)).toEqual([
      "w1",
      "w2",
    ]);
  });
});

describe("settings", () => {
  it("stores values per child and reports missing keys as undefined", async () => {
    expect(await getSetting(db, scope, "sound")).toBeUndefined();
    await setSetting(db, scope, "sound", false);
    await setSetting(db, sibling, "sound", true);
    expect(await getSetting(db, scope, "sound")).toBe(false);
    expect(await getSetting(db, sibling, "sound")).toBe(true);
  });
});

describe("grade migration", () => {
  it("moves a profile saved before grades existed to the default grade and leaves its progress alone", async () => {
    // The first schema, written the way an old install left it.
    const old = new Dexie(DB_NAME);
    old.version(1).stores({
      profiles: "id, familyId",
      stickers: "[familyId+childId+lessonId], [familyId+childId]",
    });
    await old.table("profiles").bulkPut([
      {
        id: "kid-1",
        familyId: LOCAL_FAMILY_ID,
        name: "An",
        avatar: "fox",
        series: { math: "kntt" },
        createdAt: "2026-03-01T00:00:00.000Z",
      },
      {
        id: "kid-2",
        familyId: LOCAL_FAMILY_ID,
        name: "Bin",
        avatar: "cat",
        grade: 7,
        series: {},
        createdAt: "2026-03-02T00:00:00.000Z",
      },
    ]);
    await old.table("stickers").put({ ...scope, lessonId: "l1", at: "t" });
    old.close();

    const profiles = await listProfiles(db, LOCAL_FAMILY_ID);
    expect(profiles.map((p) => [p.name, p.grade])).toEqual([
      ["An", DEFAULT_GRADE],
      ["Bin", 7],
    ]);
    expect(profiles[0]?.series).toEqual({ math: "kntt" });
    expect((await listStickers(db, scope)).map((r) => r.lessonId)).toEqual([
      "l1",
    ]);
  });
});
