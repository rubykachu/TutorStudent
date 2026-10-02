// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setClockOffset, setNowForTesting } from "@/lib/time";
import { listAttempts, type TutorDb } from "@/progress/db";
import { readParentData } from "@/progress/parent-data";
import { completeSection } from "@/progress/record";
import { createSyncApi } from "@/sync/client";
import { createSyncEngine } from "@/sync/engine";
import { pendingMonths, pullHistory } from "@/sync/history-pull";
import { readChildDoc } from "@/sync/local";
import { PENDING_MONTH, readSyncState, updateSyncState } from "@/sync/state";
import {
  CHILD,
  CODE,
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

const SERVER_NOW = "2026-10-02T03:00:00.000Z";
const PACE = 1_500;

let h: Harness;
const opened: TutorDb[] = [];

type Device = { db: TutorDb; net: Network; sync: () => Promise<unknown> };

async function device(withProfile: boolean): Promise<Device> {
  const db = openDevice();
  opened.push(db);
  const net = network(h);
  net.cookie = await cookieFor(CODE);
  if (withProfile) await addProfile(db);
  const engine = createSyncEngine({
    db,
    api: createSyncApi(net.fetch),
    deviceNow: () => new Date(SERVER_NOW),
    sleep: async () => undefined,
    random: () => 0.5,
  });
  return { db, net, sync: () => engine.run({ full: true }) };
}

function pull(
  d: Device,
  options: {
    active?: () => boolean;
    exclusive?: <T>(task: () => Promise<T>) => Promise<T | undefined>;
    waits?: number[];
  } = {},
) {
  return pullHistory({
    db: d.db,
    api: createSyncApi(d.net.fetch),
    sleep: async (ms) => {
      options.waits?.push(ms);
    },
    random: () => 0.5,
    active: options.active ?? (() => true),
    exclusive: options.exclusive ?? ((task) => task()),
    paceMs: PACE,
  });
}

const monthGets = (d: Device) =>
  d.net.calls
    .filter((c) => c.method === "GET" && c.query.includes("month="))
    .map((c) => /month=([\d-]+)/.exec(c.query)?.[1]);

// Device A answered in four months and sent everything.
async function sourceDevice() {
  const a = await device(true);
  await completeSection(
    a.db,
    scope,
    { lessonId: "l-one", sectionId: "l-one.s1" },
    ["l-one.s1", "l-one.s2"],
    at(1),
  );
  await answer(a.db, at(2));
  await answer(a.db, at(3, "2026-09"), { card: "l-one.card.b" });
  await answer(a.db, at(4, "2026-08"), { card: "l-one.card.c" });
  await answer(a.db, at(5, "2026-07"), { card: "l-one.card.d" });
  await a.sync();
  return a;
}

beforeEach(() => {
  h = harness();
  setNowForTesting(() => new Date(SERVER_NOW));
});

afterEach(async () => {
  setNowForTesting(null);
  setClockOffset(0);
  await closeDevices(opened.splice(0));
});

describe("history pull on a new device", () => {
  it("has sections and cards from the main doc before any old month, then pulls newest first", async () => {
    const a = await sourceDevice();
    const b = await device(false);
    await b.sync();

    const doc = await readChildDoc(b.db, CHILD, FAMILY);
    expect(doc.sections).toHaveLength(1);
    expect(doc.cards).toHaveLength(4);
    expect(await pendingMonths(b.db, CHILD)).toEqual(["2026-08", "2026-07"]);
    expect(await listAttempts(b.db, scope)).toHaveLength(2);

    b.net.calls.length = 0;
    const waits: number[] = [];
    expect(await pull(b, { waits })).toEqual({ status: "done", pulled: 2 });
    expect(monthGets(b)).toEqual(["2026-08", "2026-07"]);
    // One pause between the two requests, none before the first.
    expect(waits).toEqual([PACE]);
    expect(await pendingMonths(b.db, CHILD)).toEqual([]);
    expect(b.net.puts()).toBe(0);

    // What the parent page totals are the same as on the source device.
    const [fromA, fromB] = await Promise.all([
      readParentData(a.db, scope),
      readParentData(b.db, scope),
    ]);
    const ids = (d: typeof fromA) => d.attempts.map((x) => x.id).sort();
    expect(ids(fromB)).toEqual(ids(fromA));
    expect(fromB.attempts).toHaveLength(4);
  });

  it("continues after an interruption without asking for applied months again", async () => {
    await sourceDevice();
    const b = await device(false);
    await b.sync();
    b.net.calls.length = 0;

    let checks = 0;
    const result = await pull(b, { active: () => ++checks <= 1 });
    expect(result).toEqual({ status: "stopped", pulled: 1 });
    expect(monthGets(b)).toEqual(["2026-08"]);
    expect(await pendingMonths(b.db, CHILD)).toEqual(["2026-07"]);

    expect(await pull(b)).toEqual({ status: "done", pulled: 1 });
    expect(monthGets(b)).toEqual(["2026-08", "2026-07"]);
    expect(await pull(b)).toEqual({ status: "done", pulled: 0 });
    expect(monthGets(b)).toHaveLength(2);
  });

  it("treats a listed month that is missing as empty and asks again next time", async () => {
    await sourceDevice();
    const b = await device(false);
    await b.sync();
    await updateSyncState(b.db, scope, (state) => ({
      ...state,
      months: { ...state.months, "2026-05": PENDING_MONTH },
    }));
    b.net.calls.length = 0;

    expect(await pull(b)).toEqual({ status: "done", pulled: 2 });
    expect(await pendingMonths(b.db, CHILD)).toEqual(["2026-05"]);
    expect((await readSyncState(b.db, scope)).months["2026-05"]?.applied).toBe(
      false,
    );
    b.net.calls.length = 0;
    expect(await pull(b)).toEqual({ status: "done", pulled: 0 });
    expect(monthGets(b)).toEqual(["2026-05"]);
    expect(b.net.puts()).toBe(0);
  });

  it("stops when the network is down, the limit is hit or another tab holds the lock", async () => {
    await sourceDevice();
    const b = await device(false);
    await b.sync();

    b.net.online = false;
    expect(await pull(b)).toEqual({ status: "stopped", pulled: 0 });
    b.net.online = true;

    b.net.respond = () =>
      new Response(JSON.stringify({ error: "rate" }), { status: 429 });
    expect(await pull(b)).toEqual({ status: "stopped", pulled: 0 });
    delete b.net.respond;

    expect(await pull(b, { exclusive: async () => undefined })).toEqual({
      status: "stopped",
      pulled: 0,
    });
    expect(await pendingMonths(b.db, CHILD)).toEqual(["2026-08", "2026-07"]);
  });

  it("does nothing on a device that has not synced yet", async () => {
    const b = await device(true);
    expect(await pull(b)).toEqual({ status: "done", pulled: 0 });
    expect(b.net.calls).toEqual([]);
  });
});
