// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getClockOffset, setClockOffset, setNowForTesting } from "@/lib/time";
import {
  DEVICE_SCOPE,
  getSetting,
  listAttempts,
  setSetting,
  type TutorDb,
} from "@/progress/db";
import { completeSection } from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { createSyncApi } from "@/sync/client";
import { CLOCK_OFFSET_KEY } from "@/sync/clock";
import { dirtyDocs } from "@/sync/dirty";
import { createSyncEngine, type SyncRun } from "@/sync/engine";
import { readChildDoc } from "@/sync/local";
import { readSyncFamily, readSyncState, SYNC_FAMILY_KEY } from "@/sync/state";
import {
  CHILD,
  childDoc,
  cookieFor,
  FAMILY,
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
import { type Network, network } from "./network";

const PROFILE = { kind: "profile", familyId: FAMILY } as const;
const MAIN = { kind: "child", familyId: FAMILY, childId: CHILD } as const;
const month = (m: string) => ({ ...MAIN, kind: "history", month: m }) as const;

// The fake server's clock; the device clock is the same unless a test says so.
const SERVER_NOW = "2026-10-02T03:00:00.000Z";

type Device = {
  db: TutorDb;
  net: Network;
  sync: (full?: boolean) => Promise<SyncRun>;
};

let h: Harness;
const opened: TutorDb[] = [];

function device(
  options: { deviceClock?: string; withProfile?: boolean } = {},
): Device {
  const db = openDevice();
  opened.push(db);
  const net = network(h);
  const engine = createSyncEngine({
    db,
    api: createSyncApi(net.fetch),
    deviceNow: () => new Date(options.deviceClock ?? SERVER_NOW),
    sleep: async () => undefined,
    random: () => 0.5,
  });
  return { db, net, sync: (full = false) => engine.run({ full }) };
}

async function seededDevice(options: Parameters<typeof device>[0] = {}) {
  const d = device(options);
  d.net.cookie = await cookieFor(FAMILY);
  await addProfile(d.db);
  return d;
}

const section = (db: TutorDb, when: Date, id = "l-one.s1") =>
  completeSection(
    db,
    scope,
    { lessonId: "l-one", sectionId: id },
    ["l-one.s1", "l-one.s2"],
    when,
  );

beforeEach(() => {
  h = harness();
  setNowForTesting(() => new Date(SERVER_NOW));
});

afterEach(async () => {
  setNowForTesting(null);
  setClockOffset(0);
  await closeDevices(opened.splice(0));
});

const storedKeys = async (months: string[]) =>
  Promise.all([
    h.stored(PROFILE),
    h.stored(MAIN),
    ...months.map((m) => h.stored(month(m))),
  ]).then((docs) => docs.map((doc) => doc !== null));

describe("first sync and a second device", () => {
  it("sends the profile, the recent months and then the main doc; an old month waits for a full check", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await answer(a.db, at(2));
    await answer(a.db, at(3, "2026-09"), { card: "l-one.card.b" });
    await answer(a.db, at(4, "2026-07"), { card: "l-one.card.c" });

    expect(await a.sync()).toEqual({ status: "synced" });
    expect(await storedKeys(["2026-10", "2026-09", "2026-07"])).toEqual([
      true,
      true,
      true,
      true,
      false,
    ]);
    // Months go before the main doc that lists them.
    const order = a.net.calls
      .filter((c) => c.method === "PUT")
      .map((c) =>
        c.query.includes("month=")
          ? "month"
          : c.query.includes("doc=")
            ? "profile"
            : "main",
      );
    expect(order).toEqual(["profile", "month", "month", "main"]);

    // Everything is in step, so the next run sends nothing.
    const puts = a.net.puts();
    expect(await a.sync()).toEqual({ status: "synced" });
    expect(a.net.puts()).toBe(puts);

    // At app start every local month is checked.
    expect(await a.sync(true)).toEqual({ status: "synced" });
    expect(await storedKeys(["2026-07"])).toEqual([true, true, true]);
    const main = (await h.stored(MAIN))?.doc;
    expect(main.historyMonths).toEqual(["2026-07", "2026-09", "2026-10"]);
    const report = await dirtyDocs(a.db, FAMILY, CHILD, [
      "2026-07",
      "2026-09",
      "2026-10",
    ]);
    expect(report.main.dirty).toBe(false);
    expect(report.months.some((m) => m.dirty)).toBe(false);
  });

  it("gives a new device the profiles, the main doc and the recent months", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await answer(a.db, at(2));
    await answer(a.db, at(4, "2026-07"), { card: "l-one.card.b" });
    await a.sync(true);

    const b = device();
    b.net.cookie = await cookieFor(FAMILY);
    expect(await b.sync()).toEqual({ status: "synced" });
    expect((await b.db.profiles.toArray()).map((p) => p.id)).toEqual([CHILD]);
    const doc = await readChildDoc(b.db, CHILD, FAMILY);
    expect(doc.sections).toHaveLength(1);
    // Both cards come with the main doc, whichever month they were answered in.
    expect(doc.cards).toHaveLength(2);
    expect(await listAttempts(b.db, scope)).toHaveLength(1);
    // July is listed but not pulled yet: it waits for the background pull.
    const state = await readSyncState(b.db, scope);
    expect(state.months["2026-07"]).toMatchObject({ applied: false });
    expect(state.months["2026-10"]).toMatchObject({ applied: true });
    expect(await readSyncFamily(b.db)).toBe(FAMILY);
    expect(b.net.puts()).toBe(0);
    // Nothing is dirty on B after pulling.
    const report = await dirtyDocs(b.db, FAMILY, CHILD, ["2026-10"]);
    expect(report.main.dirty).toBe(false);
  });

  it("brings each device the other's study through the cloud", async () => {
    const a = await seededDevice();
    const b = await seededDevice();
    await section(a.db, at(1), "l-one.s1");
    await answer(a.db, at(2), { card: "l-one.card.a" });
    await section(b.db, at(3), "l-one.s2");
    await answer(b.db, at(4), { card: "l-one.card.b" });

    await a.sync();
    await b.sync();
    await a.sync();

    for (const d of [a, b]) {
      const doc = await readChildDoc(d.db, CHILD, FAMILY);
      expect(doc.sections.map((s) => s.sectionId).sort()).toEqual([
        "l-one.s1",
        "l-one.s2",
      ]);
      expect(doc.cards.map((c) => c.cardId).sort()).toEqual([
        "l-one.card.a",
        "l-one.card.b",
      ]);
      expect(await listAttempts(d.db, scope)).toHaveLength(2);
    }
    expect((await readChildDoc(a.db, CHILD, FAMILY)).historyMonths).toEqual([
      "2026-10",
    ]);
  });
});

describe("races", () => {
  it("merges after losing a race for the main doc and the month", async () => {
    const a = await seededDevice();
    const b = await seededDevice();
    await a.sync();
    await b.sync();
    await section(a.db, at(1), "l-one.s1");
    await answer(a.db, at(2));
    await section(b.db, at(3), "l-one.s2");
    await answer(b.db, at(4), { card: "l-one.card.b" });

    // B syncs between A's read and A's write of each doc.
    let racing = false;
    a.net.beforeRequest = async (call) => {
      if (call.method !== "PUT" || racing || call.query.startsWith("?doc="))
        return;
      racing = true;
      await b.sync();
      racing = false;
      a.net.beforeRequest = undefined;
    };
    expect(await a.sync()).toEqual({ status: "synced" });
    await b.sync();

    const stored = (await h.stored(MAIN))?.doc;
    expect(stored.sections).toHaveLength(2);
    const attempts = (await h.stored(month("2026-10")))?.doc.attempts;
    expect(attempts).toHaveLength(2);
    expect(await listAttempts(a.db, scope)).toHaveLength(2);
    expect(await listAttempts(b.db, scope)).toHaveLength(2);
  });

  it("leaves the child unsent after three lost races in a row", async () => {
    const a = await seededDevice();
    const b = await seededDevice();
    await a.sync();
    await b.sync();
    await section(a.db, at(1), "l-one.s1");
    let n = 0;
    let racing = false;
    a.net.beforeRequest = async (call) => {
      if (call.method !== "PUT" || racing || !call.query.startsWith("?child="))
        return;
      racing = true;
      n += 1;
      await section(b.db, at(10 + n), `l-one.other-${n}`);
      await b.sync();
      racing = false;
    };
    const result = await a.sync();
    expect(result).toEqual({ status: "partial", failures: ["conflict"] });
    const report = await dirtyDocs(a.db, FAMILY, CHILD, []);
    expect(report.main.dirty).toBe(true);
    expect((await readSyncState(a.db, scope)).lastError).toBe("conflict");

    // The next trigger gets it through.
    a.net.beforeRequest = undefined;
    expect(await a.sync()).toEqual({ status: "synced" });
    expect((await readSyncState(a.db, scope)).lastError).toBeNull();
    expect(
      (await h.stored(MAIN))?.doc.sections.map(
        (s: { sectionId: string }) => s.sectionId,
      ),
    ).toContain("l-one.s1");
  });

  it("keeps a write made during a sync dirty", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    a.net.beforeRequest = async (call) => {
      if (call.method === "PUT" && call.query.startsWith("?child=")) {
        a.net.beforeRequest = undefined;
        await answer(a.db, at(30));
      }
    };
    expect(await a.sync()).toEqual({ status: "synced" });
    const report = await dirtyDocs(a.db, FAMILY, CHILD, ["2026-10"]);
    expect(report.main.dirty).toBe(true);
    expect(report.months[0]?.dirty).toBe(true);

    expect(await a.sync()).toEqual({ status: "synced" });
    const again = await dirtyDocs(a.db, FAMILY, CHILD, ["2026-10"]);
    expect(again.main.dirty).toBe(false);
    expect((await h.stored(month("2026-10")))?.doc.attempts).toHaveLength(1);
  });
});

describe("no network, no sync, wrong family", () => {
  it("keeps everything queued offline and sends it when the network is back", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await answer(a.db, at(2));
    a.net.online = false;
    expect(await a.sync()).toEqual({ status: "stopped", reason: "offline" });
    expect((await dirtyDocs(a.db, FAMILY, CHILD, ["2026-10"])).main.dirty).toBe(
      true,
    );
    expect(await h.stored(PROFILE)).toBeNull();

    a.net.online = true;
    expect(await a.sync()).toEqual({ status: "synced" });
    expect((await h.stored(MAIN))?.doc.sections).toHaveLength(1);
    expect((await dirtyDocs(a.db, FAMILY, CHILD, ["2026-10"])).main.dirty).toBe(
      false,
    );
  });

  it("settles a write whose answer was lost without sending it twice", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    a.net.afterRequest = (call) =>
      call.method === "PUT" && call.query.startsWith("?child=")
        ? "lose"
        : undefined;
    expect(await a.sync()).toEqual({ status: "stopped", reason: "offline" });
    const body = (await h.stored(MAIN))?.body;
    expect(body).toBeDefined();

    a.net.afterRequest = undefined;
    const puts = a.net.puts("child");
    expect(await a.sync()).toEqual({ status: "synced" });
    expect(a.net.puts("child")).toBe(puts);
    expect((await h.stored(MAIN))?.body).toBe(body);
    expect((await dirtyDocs(a.db, FAMILY, CHILD, [])).main.dirty).toBe(false);
  });

  it("stops on a rejected cookie and says so in the state", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    a.net.cookie = null;
    expect(await a.sync()).toEqual({
      status: "stopped",
      reason: "unauthorized",
    });
    expect(
      (await readSyncState(a.db, { familyId: "local", childId: "_family" }))
        .lastError,
    ).toBe("unauthorized");
    expect(a.net.calls).toHaveLength(1);
  });

  it.each([
    ["no store behind the route", () => harness({ store: null })],
    ["a server with no gate", () => harness({ access: { mode: "open" } })],
  ])(
    "switches itself off for the session with %s, silently",
    async (_name, make) => {
      h = make();
      const a = await seededDevice();
      await section(a.db, at(1));
      expect(await a.sync()).toEqual({ status: "off" });
      expect(await a.sync()).toEqual({ status: "off" });
      expect(a.net.calls).toHaveLength(1);
      const state = await readSyncState(a.db, {
        familyId: "local",
        childId: "_family",
      });
      expect(state.lastError).toBeNull();
      expect(await readSyncFamily(a.db)).toBeNull();
    },
  );

  it("does not write a family's docs for a device that belongs to another family", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await setSetting(a.db, DEVICE_SCOPE, SYNC_FAMILY_KEY, "nha-khac");
    expect(await a.sync()).toEqual({
      status: "stopped",
      reason: "family-mismatch",
    });
    expect(a.net.puts()).toBe(0);
    expect(await h.stored(MAIN)).toBeNull();
    expect(
      (await readSyncState(a.db, { familyId: "local", childId: "_family" }))
        .lastError,
    ).toBe("family-mismatch");
  });

  it("sends the profile doc and tries again when the cloud does not list the child yet", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await a.sync();
    await section(a.db, at(2), "l-one.s2");
    let refused = false;
    a.net.respond = (call) => {
      if (
        call.query.startsWith("?child=") &&
        !call.query.includes("month=") &&
        !refused
      ) {
        refused = true;
        return Response.json({ error: "child" }, { status: 403 });
      }
      return undefined;
    };
    expect(await a.sync()).toEqual({ status: "synced" });
    expect((await h.stored(MAIN))?.doc.sections).toHaveLength(2);
    expect(refused).toBe(true);
  });
});

describe("docs from a newer app", () => {
  it("neither merges nor writes a doc of a newer version, and skips it until reload", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    a.net.respond = (call) =>
      call.method === "GET" &&
      call.query.startsWith("?child=") &&
      !call.query.includes("month=")
        ? Response.json({
            familyId: FAMILY,
            doc: { ...childDoc(), version: 2 },
            etag: "e1",
            serverTime: SERVER_NOW,
          })
        : undefined;
    expect(await a.sync()).toEqual({
      status: "partial",
      failures: ["too-new"],
    });
    expect(a.net.puts("child")).toBe(0);
    expect(await h.stored(MAIN)).toBeNull();
    expect((await dirtyDocs(a.db, FAMILY, CHILD, [])).main.dirty).toBe(true);

    const calls = a.net.calls.length;
    expect(await a.sync()).toEqual({
      status: "partial",
      failures: ["too-new"],
    });
    // The blocked doc is not asked for again.
    expect(
      a.net.calls
        .slice(calls)
        .some(
          (c) => c.query.startsWith("?child=") && !c.query.includes("month="),
        ),
    ).toBe(false);
  });
});

describe("resets", () => {
  it("pushes the main doc after a reset and no old month", async () => {
    const a = await seededDevice();
    await section(a.db, at(1));
    await answer(a.db, at(2, "2026-09"));
    await answer(a.db, at(3));
    await a.sync();
    const before = a.net.calls.length;
    await resetLessonProgress(
      a.db,
      scope,
      "l-one",
      new Date("2026-10-02T02:30:00.000Z"),
    );
    expect(await a.sync(true)).toEqual({ status: "synced" });
    const puts = a.net.calls.slice(before).filter((c) => c.method === "PUT");
    expect(puts.map((c) => c.query.includes("month="))).toEqual([false]);
    expect((await h.stored(MAIN))?.doc.resets["l-one"]).toBe(
      "2026-10-02T02:30:00.000Z",
    );
    // The old answers stay in the cloud's month docs.
    expect((await h.stored(month("2026-09")))?.doc.attempts).toHaveLength(1);
  });

  it("drops what the other device had before the reset and keeps what it did after", async () => {
    const a = await seededDevice();
    const b = await seededDevice();
    await section(a.db, at(1));
    await answer(a.db, at(2));
    await a.sync();
    await b.sync();
    expect(await listAttempts(b.db, scope)).toHaveLength(1);

    await resetLessonProgress(
      a.db,
      scope,
      "l-one",
      new Date("2026-10-02T02:30:00.000Z"),
    );
    await a.sync();
    // B studies after the reset time before it has synced.
    await answer(b.db, new Date("2026-10-02T02:40:00.000Z"));
    await section(b.db, new Date("2026-10-02T02:41:00.000Z"), "l-one.s2");
    await b.sync();
    await a.sync();

    for (const d of [a, b]) {
      const doc = await readChildDoc(d.db, CHILD, FAMILY);
      expect(doc.sections.map((s) => s.sectionId)).toEqual(["l-one.s2"]);
      expect((await listAttempts(d.db, scope)).map((x) => x.at)).toEqual([
        "2026-10-02T02:40:00.000Z",
      ]);
    }
    // The first answer is still stored for the record.
    expect((await h.stored(month("2026-10")))?.doc.attempts).toHaveLength(2);
  });
});

describe("clocks", () => {
  it("applies what the server stored when it changed a time, and stops sending", async () => {
    const a = await seededDevice();
    await answer(a.db, new Date("2026-10-03T03:00:00.000Z"));
    // A month in the future is refused outright; the clamp is for times.
    const first = await a.sync();
    expect(first.status === "synced" || first.status === "partial").toBe(true);
    const cards = (await h.stored(MAIN))?.doc.cards;
    expect(cards[0].lastReviewAt).toBe(SERVER_NOW);
    expect(
      (await readChildDoc(a.db, CHILD, FAMILY)).cards[0]?.lastReviewAt,
    ).toBe(SERVER_NOW);
    const puts = a.net.puts("child");
    await a.sync();
    expect(a.net.puts("child")).toBe(puts);
  });

  it("measures how far the device clock is behind and keeps it", async () => {
    const a = await seededDevice({ deviceClock: "2026-10-02T02:55:00.000Z" });
    await section(a.db, at(1));
    await a.sync();
    expect(getClockOffset()).toBe(300_000);
    expect(await getSetting(a.db, DEVICE_SCOPE, CLOCK_OFFSET_KEY)).toBe(
      300_000,
    );
  });
});
