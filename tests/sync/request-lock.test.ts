import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A Web Locks stand-in: one holder at a time; `ifAvailable` answers null while
// held, otherwise a request waits its turn.
function createFakeLocks() {
  let held = false;
  const waiting: Array<() => void> = [];
  const grant = async <T>(callback: (lock: object | null) => Promise<T>) => {
    held = true;
    try {
      return await callback({});
    } finally {
      held = false;
      waiting.shift()?.();
    }
  };
  return {
    request: async <T>(
      _name: string,
      options: { ifAvailable?: boolean },
      callback: (lock: object | null) => Promise<T>,
    ): Promise<T> => {
      if (!held) return grant(callback);
      if (options.ifAvailable) return callback(null);
      await new Promise<void>((resume) => waiting.push(resume));
      return grant(callback);
    },
  };
}

const engineRun = vi.fn();
let pullTask: Promise<unknown> | null = null;
let releasePull: () => void = () => undefined;
// Holders of the lock at this moment, and the most there ever were.
let holders = 0;
let peak = 0;
const enter = () => {
  holders += 1;
  peak = Math.max(peak, holders);
};

vi.mock("@/progress/hooks", () => ({ appDb: () => ({}) }));
vi.mock("@/sync/client", () => ({ createSyncApi: () => ({}) }));
vi.mock("@/sync/engine", () => ({
  createSyncEngine: () => ({ run: engineRun }),
}));
// The pull holds the lock for one request, like the real one.
vi.mock("@/sync/history-pull", () => ({
  pullHistory: (deps: {
    exclusive: <T>(task: () => Promise<T>) => Promise<T | undefined>;
  }) => {
    pullTask = deps.exclusive(
      () =>
        new Promise<void>((done) => {
          enter();
          releasePull = () => {
            holders -= 1;
            done();
          };
        }),
    );
    return pullTask;
  },
}));

const flush = () => new Promise<void>((done) => setTimeout(done, 0));

beforeEach(() => {
  vi.resetModules();
  engineRun.mockReset();
  engineRun.mockResolvedValue({ status: "synced" });
  pullTask = null;
  holders = 0;
  peak = 0;
  vi.stubGlobal("navigator", { locks: createFakeLocks() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a sync asked for while this tab's history pull holds the lock", () => {
  it("runs once the pull's request is done instead of being dropped", async () => {
    const { syncNow, startSync } = await import("@/sync/request");
    const stop = startSync();
    await syncNow();
    await flush();
    expect(engineRun).toHaveBeenCalledTimes(1);
    expect(pullTask).not.toBeNull();

    let finished = false;
    const second = syncNow().then(() => {
      finished = true;
    });
    await flush();
    expect(engineRun).toHaveBeenCalledTimes(1);
    expect(finished).toBe(false);

    releasePull();
    await second;
    expect(engineRun).toHaveBeenCalledTimes(2);
    stop();
  });

  it("keeps the engine run and the pull's request apart", async () => {
    engineRun.mockImplementation(async () => {
      enter();
      await flush();
      holders -= 1;
      return { status: "synced" };
    });
    const { syncNow, startSync } = await import("@/sync/request");
    const stop = startSync();
    await syncNow();
    await flush();
    const second = syncNow();
    await flush();
    releasePull();
    await second;
    await flush();
    expect(engineRun).toHaveBeenCalledTimes(2);
    releasePull();
    expect(peak).toBe(1);
    stop();
  });
});
