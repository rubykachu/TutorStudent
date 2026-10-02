import type { SyncRunOptions } from "@/sync/engine";

// When syncs run: at most one at a time, triggers inside a short window
// merged into one, and a trigger that arrives during a run answered by one
// more run afterwards (the run in flight may have read before the change).
// Nothing starts until a runner has called `start`, so a screen that asks for
// a sync outside the app shell (a test, a page without the runner) does
// nothing.

export type SyncScheduler = {
  // Asks for a sync soon; repeated asks inside the debounce give one.
  request(): void;
  // Syncs now, or after the run in flight; resolves when that run ends.
  now(options?: SyncRunOptions): Promise<void>;
  // Lets `request` act; the returned function undoes it.
  start(): () => void;
  // Whether a runner is started, that is, the app is open.
  active(): boolean;
};

export type SchedulerDeps = {
  run: (options: SyncRunOptions) => Promise<unknown>;
  debounceMs: number;
};

export function createSyncScheduler({
  run,
  debounceMs,
}: SchedulerDeps): SyncScheduler {
  let flight: Promise<void> | null = null;
  let queued: SyncRunOptions | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let starts = 0;

  // A failed run is already recorded by the engine; the scheduler only keeps
  // going.
  const attempt = async (options: SyncRunOptions) => {
    try {
      await run(options);
    } catch {
      // Silent: the child never sees sync.
    }
  };

  function now(options: SyncRunOptions = {}): Promise<void> {
    if (flight !== null) {
      queued = { full: Boolean(queued?.full || options.full) };
      return flight;
    }
    flight = (async () => {
      try {
        await attempt(options);
        while (queued !== null) {
          const next = queued;
          queued = null;
          await attempt(next);
        }
      } finally {
        flight = null;
      }
    })();
    return flight;
  }

  function clearTimer() {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
  }

  return {
    now,
    request() {
      if (starts === 0) return;
      clearTimer();
      timer = setTimeout(() => {
        timer = null;
        void now();
      }, debounceMs);
    },
    active: () => starts > 0,
    start() {
      starts += 1;
      let stopped = false;
      return () => {
        if (stopped) return;
        stopped = true;
        starts -= 1;
        if (starts === 0) clearTimer();
      };
    },
  };
}
