import { SYNC_DEBOUNCE_MS } from "@/lib/config";
import { appDb } from "@/progress/hooks";
import { createSyncApi } from "@/sync/client";
import { createSyncEngine, type SyncEngine } from "@/sync/engine";
import { createSyncScheduler } from "@/sync/scheduler";

// The app's one sync: the engine over the browser's database and `/api/sync`,
// behind one scheduler. Screens call `requestSync`; the runner calls `syncNow`
// and `startSync`.

// Name of the Web Locks lock that lets one tab of the app sync at a time.
export const SYNC_LOCK_NAME = "tutor-sync";

// Runs `task` unless another tab holds the lock (that tab is syncing the same
// Dexie). Without Web Locks the task runs: the conflict path and the
// apply-back re-read keep data safe either way.
export async function withSyncLock(
  task: () => Promise<unknown>,
): Promise<unknown> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks;
  if (locks === undefined) return task();
  return locks.request(SYNC_LOCK_NAME, { ifAvailable: true }, (lock) =>
    lock === null ? undefined : task(),
  );
}

let engine: SyncEngine | null = null;

const scheduler = createSyncScheduler({
  debounceMs: SYNC_DEBOUNCE_MS,
  run: (options) =>
    withSyncLock(() => {
      engine ??= createSyncEngine({ db: appDb(), api: createSyncApi() });
      return engine.run(options);
    }),
});

export const requestSync = scheduler.request;
export const syncNow = scheduler.now;
export const startSync = scheduler.start;
