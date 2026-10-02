import { LOCAL_FAMILY_ID, SYNC_HISTORY_PULL_PER_MINUTE } from "@/lib/config";
import { listProfiles, type TutorDb } from "@/progress/db";
import type { SyncApi } from "@/sync/client";
import { syncDoc } from "@/sync/cycle";
import { type FamilyRef, monthAdapter } from "@/sync/docs";
import { ENDS_RUN } from "@/sync/engine";
import { childStateScope, readSyncFamily, readSyncState } from "@/sync/state";

// The background pull of old months on a device that is new or was away: the
// months a child's main doc lists that this device has not applied yet,
// newest first (the parent page needs the recent days before the old ones),
// one request at a time and spaced out so the pull never uses up the read
// limit. A month the cloud lists but does not hold yet counts as empty and is
// asked for again at the next pull. The child studies meanwhile: nothing
// here is awaited by a screen.

export type HistoryPull =
  // Every listed month is applied or found missing.
  | { status: "done"; pulled: number }
  // Stopped early (no network, rate limit, left the app, another tab syncing);
  // the next pull continues.
  | { status: "stopped"; pulled: number };

export type PullDeps = {
  db: TutorDb;
  api: SyncApi;
  sleep: (ms: number) => Promise<void>;
  random: () => number;
  // Whether the app is still open; the pull checks between requests.
  active: () => boolean;
  // Runs one request under the lock that lets one tab sync at a time; returns
  // undefined without running it when another tab holds the lock.
  exclusive: <T>(task: () => Promise<T>) => Promise<T | undefined>;
  // Time between two requests.
  paceMs?: number;
};

export const DEFAULT_PULL_PACE_MS = Math.ceil(
  60_000 / SYNC_HISTORY_PULL_PER_MINUTE,
);

// The months of a child not applied yet, newest first.
export async function pendingMonths(
  db: TutorDb,
  childId: string,
): Promise<string[]> {
  const { months } = await readSyncState(db, childStateScope(childId));
  return Object.entries(months)
    .filter(([, state]) => !state.applied)
    .map(([month]) => month)
    .sort()
    .reverse();
}

export async function pullHistory(deps: PullDeps): Promise<HistoryPull> {
  const { db, api } = deps;
  const paceMs = deps.paceMs ?? DEFAULT_PULL_PACE_MS;
  const familyId = await readSyncFamily(db);
  if (familyId === null) return { status: "done", pulled: 0 };
  const family: FamilyRef = { id: familyId };
  let pulled = 0;
  let requested = false;

  for (const { id: childId } of await listProfiles(db, LOCAL_FAMILY_ID)) {
    for (const month of await pendingMonths(db, childId)) {
      if (requested) await deps.sleep(paceMs);
      requested = true;
      if (!deps.active()) return { status: "stopped", pulled };
      // Another sync may have applied it while this one waited.
      if (!(await pendingMonths(db, childId)).includes(month)) continue;
      const result = await deps.exclusive(() =>
        syncDoc(
          {
            api,
            family,
            sleep: deps.sleep,
            random: deps.random,
            onServerTime: () => undefined,
          },
          monthAdapter(db, family, childId, month),
        ),
      );
      if (result === undefined) return { status: "stopped", pulled };
      if (result.status === "failed") {
        if (ENDS_RUN.has(result.reason)) return { status: "stopped", pulled };
        continue;
      }
      if (result.pulled) pulled += 1;
    }
  }
  return { status: "done", pulled };
}
