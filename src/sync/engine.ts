import { LOCAL_FAMILY_ID } from "@/lib/config";
import { now, setClockOffset } from "@/lib/time";
import { listProfiles, type TutorDb } from "@/progress/db";
import type { SyncApi } from "@/sync/client";
import { offsetFromServerTime, storeClockOffset } from "@/sync/clock";
import {
  type CycleDeps,
  type CycleFailure,
  type CycleResult,
  syncDoc,
} from "@/sync/cycle";
import { dirtyDocs } from "@/sync/dirty";
import {
  childAdapter,
  type DocAdapter,
  type FamilyRef,
  monthAdapter,
  profileAdapter,
} from "@/sync/docs";
import { localMonths, recentMonths } from "@/sync/local-history";
import type { DocKind } from "@/sync/schema";
import {
  childStateScope,
  profileStateScope,
  readSyncFamily,
  updateSyncState,
  writeSyncFamily,
} from "@/sync/state";

// One whole sync of this device: the family's profile doc, then for every
// local child the month docs that may hold unsent or new records, then the
// child's main doc. A month goes before the main doc that lists it, so a
// listed month normally exists. Nothing here is shown to the child: every
// failure ends in the state this device keeps (`syncState`) or in silence.

export type SyncRunOptions = {
  // Check every local month for unsent records, not only the current and the
  // previous one: at app start and after an import.
  full?: boolean;
};

export type SyncRun =
  // Every doc is in step with the cloud.
  | { status: "synced" }
  // Some docs were not sent or pulled; they stay dirty for the next trigger.
  | { status: "partial"; failures: CycleFailure[] }
  // The run ended early: no network, rate limit, rejected cookie, other family.
  | { status: "stopped"; reason: CycleFailure }
  // Sync is not available on this server; nothing is tried again this session.
  | { status: "off" };

export type EngineDeps = {
  db: TutorDb;
  api: SyncApi;
  // The device's own clock, from which the clock offset is measured.
  deviceNow?: () => Date;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
};

export type SyncEngine = {
  run(options?: SyncRunOptions): Promise<SyncRun>;
};

// Failures after which no other doc is worth trying in this run (the history
// pull stops on them too).
export const ENDS_RUN: ReadonlySet<CycleFailure> = new Set([
  "unavailable",
  "unauthorized",
  "offline",
  "rate",
  "origin",
  "server",
  "family-mismatch",
]);

// Failures the parent page reports; the others (no network, rate limit) are
// passing and leave the last error alone.
const REMEMBERED: ReadonlySet<CycleFailure> = new Set([
  "unauthorized",
  "family-mismatch",
  "server",
]);

// A doc of a newer version stays untouched until the app is reloaded.
const BLOCKS_DOC: ReadonlySet<CycleFailure> = new Set([
  "too-new",
  "upgrade-required",
]);

const docKey = (adapter: DocAdapter<DocKind>) => JSON.stringify(adapter.target);

export function createSyncEngine(deps: EngineDeps): SyncEngine {
  const { db, api } = deps;
  const deviceNow = deps.deviceNow ?? (() => new Date());
  const sleep =
    deps.sleep ?? ((ms: number) => new Promise((done) => setTimeout(done, ms)));
  const random = deps.random ?? Math.random;
  let unavailable = false;
  const blocked = new Map<string, CycleFailure>();

  async function run({ full = false }: SyncRunOptions = {}): Promise<SyncRun> {
    if (unavailable) return { status: "off" };
    const family: FamilyRef = { id: await readSyncFamily(db) };
    let offset: number | null = null;
    const cycle: CycleDeps = {
      api,
      family,
      sleep,
      random,
      onServerTime(serverTime) {
        // Measured once per run, from the first answer.
        if (offset !== null) return;
        offset = offsetFromServerTime(serverTime, deviceNow());
        if (Number.isFinite(offset)) setClockOffset(offset);
      },
    };

    async function attempt<K extends DocKind>(
      make: () => DocAdapter<K>,
    ): Promise<CycleResult> {
      const adapter = make();
      const reason = blocked.get(docKey(adapter));
      if (reason !== undefined) return { status: "failed", reason };
      const result = await syncDoc(cycle, adapter);
      if (result.status === "failed" && BLOCKS_DOC.has(result.reason)) {
        blocked.set(docKey(adapter), result.reason);
      }
      return result;
    }

    // A child's doc refused because the cloud does not list the child yet:
    // send the profile doc, then try that doc once more.
    async function attemptChild<K extends DocKind>(
      make: () => DocAdapter<K>,
    ): Promise<CycleResult> {
      const result = await attempt(make);
      if (result.status !== "failed" || result.reason !== "child") {
        return result;
      }
      const profiles = await attempt(() => profileAdapter(db, family));
      return profiles.status === "synced" ? attempt(make) : result;
    }

    // Records how the last sync of a doc group ended. A passing failure (no
    // network, rate limit) leaves the record as it is.
    async function remember(
      scope: ReturnType<typeof childStateScope>,
      failure: CycleFailure | null,
    ) {
      if (
        failure !== null &&
        ENDS_RUN.has(failure) &&
        !REMEMBERED.has(failure)
      ) {
        return;
      }
      await updateSyncState(db, scope, (state) => ({
        ...state,
        lastError: failure,
        lastSyncAt: failure === null ? now().toISOString() : state.lastSyncAt,
      }));
    }

    try {
      const failures: CycleFailure[] = [];
      const ended = async (reason: CycleFailure): Promise<SyncRun> => {
        await remember(profileStateScope, reason);
        if (reason === "unavailable") {
          unavailable = true;
          return { status: "off" };
        }
        return { status: "stopped", reason };
      };

      const profile = await attempt(() => profileAdapter(db, family));
      if (profile.status === "failed") {
        if (ENDS_RUN.has(profile.reason)) {
          return ended(profile.reason);
        }
        failures.push(profile.reason);
      } else if (family.id !== null) {
        if ((await readSyncFamily(db)) === null) {
          await writeSyncFamily(db, family.id);
        }
      }
      await remember(
        profileStateScope,
        profile.status === "failed" ? profile.reason : null,
      );
      if (family.id === null) return { status: "partial", failures };
      const familyId = family.id;

      const children = await listProfiles(db, LOCAL_FAMILY_ID);
      for (const { id: childId } of children) {
        const scope = childStateScope(childId);
        let first: CycleFailure | null = null;
        const note = async (
          result: CycleResult,
        ): Promise<CycleFailure | null> => {
          if (result.status === "synced") return null;
          first ??= result.reason;
          if (ENDS_RUN.has(result.reason)) return result.reason;
          return null;
        };

        const months = new Set(recentMonths(now()));
        if (full) {
          const report = await dirtyDocs(
            db,
            familyId,
            childId,
            await localMonths(db, childId),
          );
          for (const m of report.months) if (m.dirty) months.add(m.month);
        }
        for (const month of [...months].sort()) {
          const stop = await note(
            await attemptChild(() => monthAdapter(db, family, childId, month)),
          );
          if (stop !== null) return ended(stop);
        }
        const stop = await note(
          await attemptChild(() => childAdapter(db, family, childId)),
        );
        if (stop !== null) return ended(stop);

        await remember(scope, first);
        if (first !== null) failures.push(first);
      }
      return failures.length === 0
        ? { status: "synced" }
        : { status: "partial", failures };
    } finally {
      if (offset !== null && Number.isFinite(offset)) {
        await storeClockOffset(db, offset);
      }
    }
  }

  return { run };
}
