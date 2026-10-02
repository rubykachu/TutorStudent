// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SYNC_DOC_MAX_BYTES } from "@/lib/config";
import { setClockOffset, setNowForTesting } from "@/lib/time";
import {
  ACTIVE_PROFILE_KEY,
  DEVICE_SCOPE,
  getSetting,
  setSetting,
  type TutorDb,
} from "@/progress/db";
import { createSyncApi } from "@/sync/client";
import { createSyncEngine } from "@/sync/engine";
import { clearLocalFamilyData } from "@/sync/family-switch";
import { readSyncFamily, SYNC_FAMILY_KEY } from "@/sync/state";
import {
  type ChildSyncStatus,
  type DeviceSyncStatus,
  hasUnsentWork,
  isFamilyMismatch,
  readSyncStatus,
  syncMessages,
} from "@/sync/status";
import {
  CHILD,
  CODE,
  cookieFor,
  type Harness,
  harness,
  OTHER_CODE,
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
const HOUR = 3_600_000;
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

async function syncedDevice() {
  const db = openDevice();
  opened.push(db);
  const net = network(h);
  net.cookie = await cookieFor(CODE);
  await addProfile(db);
  const engine = createSyncEngine({
    db,
    api: createSyncApi(net.fetch),
    deviceNow: () => NOW,
    sleep: async () => undefined,
    random: () => 0.5,
  });
  return { db, net, sync: () => engine.run({ full: true }) };
}

const child = (over: Partial<ChildSyncStatus> = {}): ChildSyncStatus => ({
  childId: CHILD,
  name: "Na",
  lastSyncAt: NOW.toISOString(),
  lastError: null,
  docBytes: 1_000,
  unsent: false,
  ...over,
});

const status = (over: Partial<DeviceSyncStatus> = {}): DeviceSyncStatus => ({
  familyId: "nha-minh",
  profileError: null,
  lastSyncAt: NOW.toISOString(),
  profileUnsent: false,
  children: [child()],
  ...over,
});

describe("readSyncStatus", () => {
  it("reports nothing on a device that has not reached a server with sync on", async () => {
    const db = openDevice();
    opened.push(db);
    expect(await readSyncStatus(db)).toBeNull();
  });

  it("gives the last sync time and notices records not sent yet", async () => {
    const d = await syncedDevice();
    await answer(d.db, at(1));
    await d.sync();
    const synced = await readSyncStatus(d.db);
    expect(synced).toMatchObject({
      familyId: "nha-minh",
      profileError: null,
      profileUnsent: false,
      lastSyncAt: NOW.toISOString(),
      children: [{ childId: CHILD, name: "Na", unsent: false }],
    });
    expect(hasUnsentWork(synced as DeviceSyncStatus)).toBe(false);

    await answer(d.db, at(2), { card: "l-one.card.b" });
    const after = await readSyncStatus(d.db);
    expect(after?.children[0]?.unsent).toBe(true);
    expect(hasUnsentWork(after as DeviceSyncStatus)).toBe(true);
  });

  it("keeps a rejected cookie as the profile error", async () => {
    const d = await syncedDevice();
    await d.sync();
    d.net.cookie = null;
    await d.sync();
    const result = await readSyncStatus(d.db);
    expect(result?.profileError).toBe("unauthorized");
    expect(
      syncMessages(result as DeviceSyncStatus, NOW).map((m) => m.id),
    ).toEqual(["unauthorized"]);
  });

  it("flags a cookie of another family and offers the switch only when nothing is unsent", async () => {
    const d = await syncedDevice();
    await d.sync();
    d.net.cookie = await cookieFor(OTHER_CODE);
    await d.sync();
    const clean = (await readSyncStatus(d.db)) as DeviceSyncStatus;
    expect(isFamilyMismatch(clean)).toBe(true);
    expect(hasUnsentWork(clean)).toBe(false);

    await answer(d.db, at(1));
    const dirty = (await readSyncStatus(d.db)) as DeviceSyncStatus;
    expect(isFamilyMismatch(dirty)).toBe(true);
    expect(hasUnsentWork(dirty)).toBe(true);
    expect(isFamilyMismatch(status())).toBe(false);
  });
});

describe("syncMessages", () => {
  it("says nothing when all is in step", () => {
    expect(syncMessages(status(), NOW)).toEqual([]);
  });

  it("warns about records unsent for more than a day, not before", () => {
    const unsent = (hours: number) =>
      status({
        lastSyncAt: new Date(NOW.getTime() - hours * HOUR).toISOString(),
        children: [child({ unsent: true })],
      });
    expect(syncMessages(unsent(23), NOW)).toEqual([]);
    expect(syncMessages(unsent(25), NOW).map((m) => m.id)).toEqual(["stale"]);
    expect(
      syncMessages(status({ lastSyncAt: null, profileUnsent: true }), NOW).map(
        (m) => m.id,
      ),
    ).toEqual(["stale"]);
    // Old but nothing waiting to be sent.
    expect(
      syncMessages(
        status({
          lastSyncAt: new Date(NOW.getTime() - 99 * HOUR).toISOString(),
        }),
        NOW,
      ),
    ).toEqual([]);
  });

  it("names a main doc past the warning ratio and one that is too large", () => {
    const near = syncMessages(
      status({ children: [child({ docBytes: SYNC_DOC_MAX_BYTES * 0.75 })] }),
      NOW,
    );
    expect(near.map((m) => m.id)).toEqual(["near-limit"]);
    expect(near[0]?.text).toContain("Na");
    expect(near[0]?.text).toContain("75%");
    const large = syncMessages(
      status({ children: [child({ lastError: "too-large" })] }),
      NOW,
    );
    expect(large.map((m) => m.id)).toEqual(["too-large"]);
  });

  it("tells about an app that is too old and a cookie that was rejected", () => {
    expect(
      syncMessages(
        status({ children: [child({ lastError: "too-new" })] }),
        NOW,
      ).map((m) => m.id),
    ).toEqual(["app-too-old"]);
    expect(
      syncMessages(status({ profileError: "upgrade-required" }), NOW).map(
        (m) => m.id,
      ),
    ).toEqual(["app-too-old"]);
    expect(
      syncMessages(status({ profileError: "unauthorized" }), NOW).map(
        (m) => m.id,
      ),
    ).toEqual(["unauthorized"]);
  });
});

describe("clearLocalFamilyData", () => {
  it("empties profiles, progress and bookkeeping and keeps the device's own settings", async () => {
    const d = await syncedDevice();
    await answer(d.db, at(1));
    await d.sync();
    await setSetting(d.db, DEVICE_SCOPE, ACTIVE_PROFILE_KEY, CHILD);
    await setSetting(d.db, DEVICE_SCOPE, "parentPin", "pin-hash");
    await setSetting(d.db, scope, "soundEnabled", false);
    expect(await readSyncFamily(d.db)).toBe("nha-minh");

    await clearLocalFamilyData(d.db);

    for (const table of d.db.tables) {
      if (table.name === "settings") continue;
      expect(await table.count(), table.name).toBe(0);
    }
    expect(
      await getSetting(d.db, DEVICE_SCOPE, SYNC_FAMILY_KEY),
    ).toBeUndefined();
    expect(
      await getSetting(d.db, DEVICE_SCOPE, ACTIVE_PROFILE_KEY),
    ).toBeUndefined();
    expect(await getSetting(d.db, scope, "soundEnabled")).toBeUndefined();
    expect(await getSetting(d.db, DEVICE_SCOPE, "parentPin")).toBe("pin-hash");
  });
});
