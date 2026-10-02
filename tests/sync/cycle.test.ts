// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { SYNC_MAX_RETRIES } from "@/lib/config";
import type { TutorDb } from "@/progress/db";
import { completeSection } from "@/progress/record";
import { syncDoc } from "@/sync/cycle";
import { childAdapter, monthAdapter, profileAdapter } from "@/sync/docs";
import { readChildDoc } from "@/sync/local";
import { readHistoryDoc } from "@/sync/local-history";
import { readSyncState } from "@/sync/state";
import {
  CHILD,
  childDoc,
  FAMILY,
  harness,
  profileDoc,
} from "../api/sync-helpers";
import {
  addProfile,
  answer,
  at,
  closeDevices,
  cycleDeps,
  openDevice,
  scope,
} from "./devices";
import { network } from "./network";

const PROFILE = { kind: "profile", familyId: FAMILY } as const;
const MAIN = { kind: "child", familyId: FAMILY, childId: CHILD } as const;
const MONTH = { ...MAIN, kind: "history", month: "2026-10" } as const;

const opened: TutorDb[] = [];
function device() {
  const db = openDevice();
  opened.push(db);
  return db;
}
afterEach(async () => {
  await closeDevices(opened.splice(0));
});

async function setup() {
  const h = harness();
  await h.seed(PROFILE, profileDoc(FAMILY, [CHILD]));
  const net = network(h);
  return { h, net, deps: cycleDeps(net) };
}

const section = (db: TutorDb, when: Date, id = "l-one.s1") =>
  completeSection(
    db,
    scope,
    { lessonId: "l-one", sectionId: id },
    ["l-one.s1", "l-one.s2"],
    when,
  );

describe("one doc's cycle", () => {
  it("creates the doc when none is stored, then sends nothing while nothing changes", async () => {
    const { h, net, deps } = await setup();
    const db = device();
    await section(db, at(1));

    const first = await syncDoc(deps, childAdapter(db, deps.family, CHILD));
    expect(first).toEqual({ status: "synced", pulled: false });
    expect(net.puts("child")).toBe(1);
    const stored = (await h.stored(MAIN))?.doc;
    expect(stored.sections).toHaveLength(1);
    const state = await readSyncState(db, scope);
    expect(state.etag).toBe((await h.stored(MAIN))?.etag);
    expect(state.syncedHash).not.toBeNull();

    const second = await syncDoc(deps, childAdapter(db, deps.family, CHILD));
    expect(second).toEqual({ status: "synced", pulled: false });
    expect(net.puts("child")).toBe(1);
  });

  it("applies the cloud copy to an empty device", async () => {
    const { net, deps } = await setup();
    const a = device();
    const b = device();
    await section(a, at(1));
    await syncDoc(deps, childAdapter(a, deps.family, CHILD));

    const depsB = cycleDeps(net);
    const result = await syncDoc(depsB, childAdapter(b, depsB.family, CHILD));
    expect(result).toEqual({ status: "synced", pulled: true });
    expect((await readChildDoc(b, CHILD, FAMILY)).sections).toHaveLength(1);
    expect(net.puts("child")).toBe(1);
  });

  it("merges with the doc a 412 carries and tries again after a random wait", async () => {
    const { h, net } = await setup();
    const a = device();
    const b = device();
    await section(a, at(1), "l-one.s1");
    await section(b, at(2), "l-one.s2");
    const depsA = cycleDeps(net);
    const depsB = cycleDeps(net);
    // Device B writes between A's read and A's write.
    let raced = false;
    net.beforeRequest = async (call) => {
      if (call.method === "PUT" && !raced) {
        raced = true;
        await syncDoc(depsB, childAdapter(b, depsB.family, CHILD));
      }
    };
    const result = await syncDoc(depsA, childAdapter(a, depsA.family, CHILD));
    expect(result.status).toBe("synced");
    expect(depsA.waits).toEqual([300]);
    const stored = (await h.stored(MAIN))?.doc;
    expect(
      stored.sections.map((s: { sectionId: string }) => s.sectionId).sort(),
    ).toEqual(["l-one.s1", "l-one.s2"]);
    expect((await readChildDoc(a, CHILD, FAMILY)).sections).toHaveLength(2);
  });

  it("gives up after three lost races and leaves the doc unsent", async () => {
    const { h, net } = await setup();
    const a = device();
    const b = device();
    await section(a, at(1), "l-one.s1");
    const depsA = cycleDeps(net);
    const depsB = cycleDeps(net);
    let n = 0;
    let racing = false;
    net.beforeRequest = async (call) => {
      if (call.method !== "PUT" || racing) return;
      racing = true;
      n += 1;
      // Another device changes the doc before every write of A's.
      await section(b, at(10 + n), `l-one.other-${n}`);
      await syncDoc(depsB, childAdapter(b, depsB.family, CHILD));
      racing = false;
    };
    const adapter = childAdapter(a, depsA.family, CHILD);
    const result = await syncDoc(depsA, adapter);
    expect(result).toEqual({ status: "failed", reason: "conflict" });
    expect(depsA.waits).toHaveLength(SYNC_MAX_RETRIES - 1);
    expect(await adapter.isDirty(await adapter.build())).toBe(true);
    const stored = (await h.stored(MAIN))?.doc;
    expect(
      stored.sections.map((s: { sectionId: string }) => s.sectionId),
    ).not.toContain("l-one.s1");
  });

  it("keeps the doc unsent while the network is down and sends it when it is back", async () => {
    const { h, net, deps } = await setup();
    const db = device();
    await section(db, at(1));
    net.online = false;
    const adapter = childAdapter(db, deps.family, CHILD);
    deps.family.id = FAMILY;
    expect(await syncDoc(deps, adapter)).toEqual({
      status: "failed",
      reason: "offline",
    });
    expect(await adapter.isDirty(await adapter.build())).toBe(true);
    net.online = true;
    expect((await syncDoc(deps, adapter)).status).toBe("synced");
    expect(await adapter.isDirty(await adapter.build())).toBe(false);
    expect((await h.stored(MAIN))?.doc.sections).toHaveLength(1);
  });

  it("settles a write whose answer was lost without sending it twice", async () => {
    const { h, net, deps } = await setup();
    const db = device();
    await section(db, at(1));
    net.afterRequest = (call) => (call.method === "PUT" ? "lose" : undefined);
    const adapter = childAdapter(db, deps.family, CHILD);
    expect(await syncDoc(deps, adapter)).toEqual({
      status: "failed",
      reason: "offline",
    });
    const storedBody = (await h.stored(MAIN))?.body;
    expect(storedBody).toBeDefined();

    net.afterRequest = undefined;
    const putsBefore = net.puts();
    expect((await syncDoc(deps, adapter)).status).toBe("synced");
    expect(net.puts()).toBe(putsBefore);
    expect((await h.stored(MAIN))?.body).toBe(storedBody);
    expect(await adapter.isDirty(await adapter.build())).toBe(false);
  });

  it("neither merges nor writes a doc a newer app wrote", async () => {
    const { h, net, deps } = await setup();
    const db = device();
    await section(db, at(1));
    // A newer server answers with a doc of a version this app does not know.
    net.respond = () =>
      Response.json({
        familyId: FAMILY,
        doc: { ...childDoc(), version: 2 },
        etag: "e1",
        serverTime: "2026-10-02T03:00:00.000Z",
      });
    const result = await syncDoc(deps, childAdapter(db, deps.family, CHILD));
    expect(result).toEqual({ status: "failed", reason: "too-new" });
    expect(net.puts()).toBe(0);
    expect(await h.stored(MAIN)).toBeNull();
  });

  it("writes the server's clamped doc over the local records it changed", async () => {
    const { h, net, deps } = await setup();
    const db = device();
    // An answer stamped a day after the server's clock.
    await answer(db, new Date("2026-10-03T03:00:00.000Z"));
    const adapter = childAdapter(db, deps.family, CHILD);
    expect((await syncDoc(deps, adapter)).status).toBe("synced");

    const stored = (await h.stored(MAIN))?.doc;
    expect(stored.cards[0].lastReviewAt).toBe("2026-10-02T03:00:00.000Z");
    const local = await readChildDoc(db, CHILD, FAMILY);
    expect(local.cards[0]?.lastReviewAt).toBe("2026-10-02T03:00:00.000Z");
    expect(local.activityDays).toEqual(["2026-10-02"]);
    // Nothing is left to send: the clamp does not loop.
    const puts = net.puts();
    expect((await syncDoc(deps, adapter)).status).toBe("synced");
    expect(net.puts()).toBe(puts);
    expect(await adapter.isDirty(await adapter.build())).toBe(false);
  });

  it("never creates a doc with nothing in it, and records it as sent", async () => {
    const { net, deps } = await setup();
    const db = device();
    await addProfile(db);
    const adapter = childAdapter(db, deps.family, CHILD);
    expect((await syncDoc(deps, adapter)).status).toBe("synced");
    expect(net.puts()).toBe(0);
    expect(await adapter.isDirty(await adapter.build())).toBe(false);
  });

  it("syncs the profile doc and picks up a profile another device added", async () => {
    const { h, net, deps } = await setup();
    const a = device();
    const b = device();
    await addProfile(a, CHILD, "Na");
    expect((await syncDoc(deps, profileAdapter(a, deps.family))).status).toBe(
      "synced",
    );
    expect((await h.stored(PROFILE))?.doc.profiles).toHaveLength(1);
    const depsB = cycleDeps(net);
    await syncDoc(depsB, profileAdapter(b, depsB.family));
    expect((await b.profiles.toArray()).map((p) => p.name)).toEqual(["Na"]);
  });
});

describe("a month doc's cycle", () => {
  it("unions the answers of two devices", async () => {
    const { h, net } = await setup();
    const a = device();
    const b = device();
    const x = await answer(a, at(1));
    const y = await answer(b, at(2));
    const depsA = cycleDeps(net);
    const depsB = cycleDeps(net);
    await syncDoc(depsA, monthAdapter(a, depsA.family, CHILD, "2026-10"));
    await syncDoc(depsB, monthAdapter(b, depsB.family, CHILD, "2026-10"));
    await syncDoc(depsA, monthAdapter(a, depsA.family, CHILD, "2026-10"));

    const ids = (await h.stored(MONTH))?.doc.attempts.map(
      (r: { id: string }) => r.id,
    );
    expect(ids.sort()).toEqual([x.id, y.id].sort());
    for (const db of [a, b]) {
      expect(
        (await readHistoryDoc(db, CHILD, FAMILY, "2026-10")).attempts,
      ).toHaveLength(2);
    }
  });

  it("writes nothing for a month empty on both sides", async () => {
    const { net, deps } = await setup();
    const db = device();
    const adapter = monthAdapter(db, deps.family, CHILD, "2026-09");
    expect((await syncDoc(deps, adapter)).status).toBe("synced");
    expect(net.puts()).toBe(0);
    expect((await readSyncState(db, scope)).months).toEqual({});
  });
});
