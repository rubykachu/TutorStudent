import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/progress/hooks", () => ({ appDb: () => ({}) }));

import { SYNC_LOCK_NAME, withSyncLock } from "@/sync/request";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("withSyncLock", () => {
  it("runs the task when the browser has no Web Locks", async () => {
    vi.stubGlobal("navigator", {});
    const task = vi.fn(async () => "done");
    expect(await withSyncLock(task)).toBe("done");
  });

  it("runs the task under the sync lock without waiting for it", async () => {
    const request = vi.fn(
      async (
        _name: string,
        _options: { ifAvailable: boolean },
        callback: (lock: object | null) => unknown,
      ) => callback({}),
    );
    vi.stubGlobal("navigator", { locks: { request } });
    const task = vi.fn(async () => "done");
    expect(await withSyncLock(task)).toBe("done");
    expect(request.mock.calls[0]?.slice(0, 2)).toEqual([
      SYNC_LOCK_NAME,
      { ifAvailable: true },
    ]);
  });

  it("skips the task when another tab holds the lock", async () => {
    const request = vi.fn(
      async (
        _name: string,
        _options: unknown,
        callback: (lock: object | null) => unknown,
      ) => callback(null),
    );
    vi.stubGlobal("navigator", { locks: { request } });
    const task = vi.fn(async () => "done");
    await withSyncLock(task);
    expect(task).not.toHaveBeenCalled();
  });
});
