import { SYNC_DEBOUNCE_MS } from "@/lib/config";
import { appDb } from "@/progress/hooks";
import { createSyncApi } from "@/sync/client";
import { createSyncEngine, type SyncEngine, type SyncRun } from "@/sync/engine";
import { pullHistory } from "@/sync/history-pull";
import { createSyncScheduler } from "@/sync/scheduler";

// The app's one sync: the engine over the browser's database and `/api/sync`,
// behind one scheduler. Screens call `requestSync`; the runner calls `syncNow`
// and `startSync`.

// Name of the Web Locks lock that lets one tab of the app sync at a time.
export const SYNC_LOCK_NAME = "tutor-sync";

// Runs `task` under the lock that lets one tab sync at a time. By default it
// does not wait: when the lock is held the task is skipped (undefined), which
// suits the history pull, whose next request or next pull makes up for it.
// With `wait` the task queues behind the holder and runs when it is done, so
// a sync asked for during this tab's own history pull or another tab's run is
// not lost. Without Web Locks the task runs: the conflict path and the
// apply-back re-read keep data safe either way.
export async function withSyncLock<T>(
  task: () => Promise<T>,
  { wait = false }: { wait?: boolean } = {},
): Promise<T | undefined> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks;
  if (locks === undefined) return task();
  return locks.request(SYNC_LOCK_NAME, { ifAvailable: !wait }, (lock) =>
    lock === null ? undefined : task(),
  );
}

const api = createSyncApi();
let engine: SyncEngine | null = null;
let pulling = false;

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

// Pulls the old months a new device lacks, in the background, one pull at a
// time. It runs on its own, outside the scheduler's one-at-a-time run, so
// the child's syncs are never held back by its pacing; it takes the lock per
// request and skips a request while a sync holds it.
function pullInBackground() {
  if (pulling) return;
  pulling = true;
  pullHistory({
    db: appDb(),
    api,
    sleep,
    random: Math.random,
    active: () => scheduler.active(),
    exclusive: withSyncLock,
  })
    .catch(() => undefined)
    .finally(() => {
      pulling = false;
    });
}

const scheduler = createSyncScheduler({
  debounceMs: SYNC_DEBOUNCE_MS,
  run: async (options) => {
    engine ??= createSyncEngine({ db: appDb(), api });
    const current = engine;
    const result: SyncRun | undefined = await withSyncLock(
      () => current.run(options),
      { wait: true },
    );
    if (result?.status === "synced" || result?.status === "partial") {
      pullInBackground();
    }
  },
});

export const requestSync = scheduler.request;
export const syncNow = scheduler.now;
export const startSync = scheduler.start;
