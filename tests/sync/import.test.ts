// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BACKUP_IMPORT_MAX_BYTES, LOCAL_FAMILY_ID } from "@/lib/config";
import { setClockOffset, setNowForTesting } from "@/lib/time";
import {
  awardSticker,
  listAttempts,
  listProfiles,
  listWritings,
  type TutorDb,
} from "@/progress/db";
import { buildProgressExport } from "@/progress/parent-data";
import { completeSection } from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { saveOpenEndedWriting } from "@/progress/writing";
import { createSyncApi } from "@/sync/client";
import { dirtyDocs } from "@/sync/dirty";
import { createSyncEngine } from "@/sync/engine";
import { type BackupPlan, importBackup, readBackup } from "@/sync/import";
import { readChildDoc } from "@/sync/local";
import { localMonths } from "@/sync/local-history";
import { canonicalText } from "@/sync/schema";
import {
  CHILD,
  CODE,
  cookieFor,
  type Harness,
  harness,
} from "../api/sync-helpers";
import {
  addProfile,
  answer,
  at,
  closeDevices,
  openDevice,
  scope,
} from "./devices";
import { network } from "./network";

const NOW = new Date("2026-10-02T03:00:00.000Z");
let h: Harness;
const opened: TutorDb[] = [];

beforeEach(() => {
  h = harness();
  setNowForTesting(() => NOW);
});

afterEach(async () => {
  setNowForTesting(null);
  setClockOffset(0);
  await closeDevices(opened.splice(0));
});

function device(): TutorDb {
  const db = openDevice();
  opened.push(db);
  return db;
}

// A child with study in three months, a writing, a sticker and a section.
async function studied(): Promise<TutorDb> {
  const db = device();
  await addProfile(db);
  await completeSection(
    db,
    scope,
    { lessonId: "l-one", sectionId: "l-one.s1" },
    ["l-one.s1", "l-one.s2"],
    at(1),
  );
  await answer(db, at(2));
  await answer(db, at(3, "2026-09"), { card: "l-one.card.b" });
  await answer(db, at(4, "2026-08"), { card: "l-one.card.c" });
  await awardSticker(db, scope, "l-one", at(5));
  await saveOpenEndedWriting(
    db,
    scope,
    "l-one.ex.viet",
    {
      writing: {
        text: "Em giúp bạn.",
        checks: [{ criterion: "Kể việc", met: true }],
      },
    },
    at(6, "2026-09"),
  );
  return db;
}

async function exportOf(db: TutorDb): Promise<string> {
  const [profile] = await listProfiles(db, LOCAL_FAMILY_ID);
  if (!profile) throw new Error("no profile");
  return JSON.stringify(await buildProgressExport(db, profile, NOW));
}

async function plan(db: TutorDb, text: string): Promise<BackupPlan> {
  const result = await readBackup(db, text, text.length);
  if (!result.ok) throw new Error(`unexpected error ${result.error}`);
  return result.plan;
}

const childDoc = async (db: TutorDb) =>
  canonicalText("child", await readChildDoc(db, CHILD, "local-doc"));
const ids = async (db: TutorDb) => ({
  attempts: (await listAttempts(db, scope)).map((a) => a.id).sort(),
  writings: (await listWritings(db, scope)).map((w) => w.id).sort(),
});

describe("import of an export", () => {
  it("brings a child's whole record to an empty device, creating the profile", async () => {
    const source = await studied();
    const text = await exportOf(source);
    const target = device();
    const p = await plan(target, text);
    expect(p).toMatchObject({
      source: "export",
      childId: CHILD,
      childName: "Na",
      exportedAt: NOW.toISOString(),
      createsProfile: true,
      counts: {
        attempts: 3,
        writings: 1,
        cards: 3,
        sections: 1,
        stickers: 1,
      },
    });
    // Reading writes nothing.
    expect(await target.profiles.count()).toBe(0);

    const summary = await importBackup(target, p);
    expect(summary.skipped).toBe(0);
    expect(summary.added).toBeGreaterThan(0);
    expect(await childDoc(target)).toBe(await childDoc(source));
    expect(await ids(target)).toEqual(await ids(source));
    expect(
      (await listProfiles(target, LOCAL_FAMILY_ID)).map((x) => x.id),
    ).toEqual([CHILD]);
  });

  it("changes nothing the second time", async () => {
    const source = await studied();
    const text = await exportOf(source);
    const target = device();
    await importBackup(target, await plan(target, text));
    const state = await childDoc(target);
    const records = await ids(target);

    const second = await plan(target, text);
    expect(second.createsProfile).toBe(false);
    expect(await importBackup(target, second)).toEqual({
      added: 0,
      skipped: 0,
    });
    expect(await childDoc(target)).toBe(state);
    expect(await ids(target)).toEqual(records);
  });

  it("merges into what the device has and overwrites nothing", async () => {
    const source = await studied();
    const text = await exportOf(source);
    const target = device();
    await addProfile(target);
    // The device reviewed the same card later than the file did, and has an
    // answer the file lacks.
    await answer(target, at(30), { card: "l-one.card.a" });
    await answer(target, at(31, "2026-07"), { card: "l-one.card.z" });
    const before = await readChildDoc(target, CHILD, "local-doc");
    const laterCard = before.cards.find((c) => c.cardId === "l-one.card.a");

    await importBackup(target, await plan(target, text));

    const after = await readChildDoc(target, CHILD, "local-doc");
    expect(after.cards.find((c) => c.cardId === "l-one.card.a")).toEqual(
      laterCard,
    );
    expect(after.cards.map((c) => c.cardId).sort()).toEqual([
      "l-one.card.a",
      "l-one.card.b",
      "l-one.card.c",
      "l-one.card.z",
    ]);
    expect((await listAttempts(target, scope)).length).toBe(5);
  });

  it("skips what a later reset on the device hides, and keeps what came after it", async () => {
    const source = await studied();
    await answer(source, at(40), { lessonId: "l-two", card: "l-two.card.a" });
    await answer(source, at(41, "2026-09"), {
      lessonId: "l-two",
      card: "l-two.card.b",
    });
    const text = await exportOf(source);

    const target = device();
    await addProfile(target);
    await answer(target, at(1), { lessonId: "l-two", card: "l-two.card.q" });
    setNowForTesting(() => at(45));
    await resetLessonProgress(target, scope, "l-two", at(45));
    setNowForTesting(() => NOW);

    const summary = await importBackup(target, await plan(target, text));
    // Two answers and two cards of the reset lesson are before the reset.
    expect(summary.skipped).toBe(4);
    const attempts = await listAttempts(target, scope);
    expect(attempts.some((a) => a.lessonId === "l-two")).toBe(false);
    expect(attempts.filter((a) => a.lessonId === "l-one")).toHaveLength(3);
  });

  it("imports a version 1 file, deriving what it lacks", async () => {
    const source = await studied();
    const file = JSON.parse(await exportOf(source));
    file.version = 1;
    delete file.resets;
    file.sections = file.sections.map((s: Record<string, unknown>) => {
      const { doneAt: _doneAt, ...rest } = s;
      return rest;
    });
    file.settings = [
      { ...scope, key: "overviewSeen:l-one", value: true },
      { ...scope, key: "soundEnabled", value: false },
    ];
    const target = device();
    const p = await plan(target, JSON.stringify(file));
    await importBackup(target, p);
    const doc = await readChildDoc(target, CHILD, "local-doc");
    const section = doc.sections[0];
    expect(section?.doneAt).toBe(section?.updatedAt);
    expect(doc.overviewSeen).toEqual({ "l-one": "1970-01-01T00:00:00.000Z" });
    expect(doc.resets).toEqual({});
  });

  it("makes the main doc and each affected month ready to send", async () => {
    const source = await studied();
    const text = await exportOf(source);

    const target = device();
    await addProfile(target);
    const net = network(h);
    net.cookie = await cookieFor(CODE);
    const engine = createSyncEngine({
      db: target,
      api: createSyncApi(net.fetch),
      deviceNow: () => NOW,
      sleep: async () => undefined,
      random: () => 0.5,
    });
    await engine.run({ full: true });
    const months = async () => localMonths(target, CHILD);
    const clean = await dirtyDocs(target, "nha-minh", CHILD, await months());
    expect(clean.main.dirty).toBe(false);

    await importBackup(target, await plan(target, text));
    const report = await dirtyDocs(target, "nha-minh", CHILD, await months());
    expect(report.main.dirty).toBe(true);
    expect(report.months.map((m) => [m.month, m.dirty])).toEqual([
      ["2026-08", true],
      ["2026-09", true],
      ["2026-10", true],
    ]);
    // The next full sync sends all of it.
    await engine.run({ full: true });
    const after = await dirtyDocs(target, "nha-minh", CHILD, await months());
    expect(after.main.dirty).toBe(false);
    expect(after.months.some((m) => m.dirty)).toBe(false);
  });
});

// A time no honest file holds: a crafted or corrupt backup.
const FAR_FUTURE = "2099-01-01T00:00:00.000Z";

describe("import of a file with times in the future", () => {
  it("brings them down to now, so a future reset cannot hide what is studied later", async () => {
    const source = await studied();
    const file = JSON.parse(await exportOf(source)) as Record<string, unknown>;
    file.resets = { "l-one": FAR_FUTURE };
    const [first] = file.attempts as Record<string, unknown>[];
    file.attempts = [
      ...(file.attempts as unknown[]),
      { ...first, id: "f".repeat(32), at: FAR_FUTURE },
    ];
    const target = device();
    const p = await plan(target, JSON.stringify(file));
    expect(p.doc.resets).toEqual({ "l-one": NOW.toISOString() });
    // The future answer now lies in the current month, at now.
    const current = p.months.find((m) => m.month === "2026-10");
    expect(current?.attempts.find((a) => a.id === "f".repeat(32))?.at).toBe(
      NOW.toISOString(),
    );
    expect(p.months.some((m) => m.month > "2026-10")).toBe(false);

    await importBackup(target, p);
    // An answer given after the import is not hidden by the file's reset.
    setNowForTesting(() => new Date(NOW.getTime() + 60_000));
    await answer(target, new Date(NOW.getTime() + 60_000), {
      card: "l-one.card.later",
    });
    const visible = await readChildDoc(target, CHILD, "local-doc");
    expect(visible.cards.map((c) => c.cardId)).toContain("l-one.card.later");
  });
});

describe("import of a snapshot", () => {
  it("merges the state of a child the device has", async () => {
    const source = await studied();
    const snapshot = await readChildDoc(source, CHILD, "nha-minh");
    const target = device();
    await addProfile(target);
    const p = await plan(target, JSON.stringify(snapshot));
    expect(p).toMatchObject({
      source: "snapshot",
      childName: "Na",
      exportedAt: null,
      createsProfile: false,
    });
    await importBackup(target, p);
    const doc = await readChildDoc(target, CHILD, "nha-minh");
    expect(doc.sections).toEqual(snapshot.sections);
    expect(doc.cards).toHaveLength(3);
    expect(await listAttempts(target, scope)).toHaveLength(0);
  });

  it("brings a reset dated in the future down to now", async () => {
    const source = await studied();
    const snapshot = {
      ...(await readChildDoc(source, CHILD, "nha-minh")),
      resets: { "l-one": FAR_FUTURE },
    };
    const target = device();
    await addProfile(target);
    const p = await plan(target, JSON.stringify(snapshot));
    expect(p.doc.resets).toEqual({ "l-one": NOW.toISOString() });
  });

  it("refuses a child with no profile on the device", async () => {
    const source = await studied();
    const snapshot = await readChildDoc(source, CHILD, "nha-minh");
    const target = device();
    expect(await readBackup(target, JSON.stringify(snapshot), 1_000)).toEqual({
      ok: false,
      error: "no-profile",
    });
  });
});

describe("a file that cannot be imported", () => {
  async function refused(text: string, size = text.length) {
    const target = device();
    const result = await readBackup(target, text, size);
    expect(result.ok).toBe(false);
    for (const table of target.tables) {
      expect(await table.count(), table.name).toBe(0);
    }
    return result.ok ? null : result.error;
  }

  it("names each problem and writes nothing", async () => {
    const source = await studied();
    const good = JSON.parse(await exportOf(source));
    expect(await refused("{ not json")).toBe("not-json");
    expect(await refused("[1, 2]")).toBe("wrong-format");
    expect(await refused(JSON.stringify({ format: "something-else" }))).toBe(
      "wrong-format",
    );
    expect(await refused(JSON.stringify({ ...good, version: 3 }))).toBe(
      "too-new",
    );
    expect(await refused(JSON.stringify({ ...good, version: 0 }))).toBe(
      "invalid",
    );
    expect(
      await refused(
        JSON.stringify({
          ...good,
          cardStates: [{ ...good.cardStates[0], due: "tomorrow" }],
        }),
      ),
    ).toBe("invalid");
    expect(
      await refused(
        JSON.stringify({
          ...good,
          attempts: [{ ...good.attempts[0], at: "not a time" }],
        }),
      ),
    ).toBe("invalid");
    expect(
      await refused(
        JSON.stringify({ ...good, profile: { ...good.profile, id: "x" } }),
      ),
    ).toBe("invalid");
    expect(
      await refused(
        JSON.stringify({
          schema: "tutor-child-progress",
          version: 2,
          familyId: "nha-minh",
        }),
      ),
    ).toBe("too-new");
    expect(
      await refused(
        JSON.stringify({ schema: "tutor-child-progress", version: 1 }),
      ),
    ).toBe("invalid");
    expect(await refused("{}", BACKUP_IMPORT_MAX_BYTES + 1)).toBe("too-large");
  });
});
