// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { CACHE_PREFIX } from "@/offline/config";
import { retireWorker } from "@/offline/kill-switch";

function fakeCaches(names: string[]) {
  const live = new Set(names);
  return {
    live,
    caches: {
      keys: async () => [...live],
      delete: async (name: string) => live.delete(name),
    } as unknown as CacheStorage,
  };
}

describe("retireWorker", () => {
  it("deletes the offline caches, leaves others and unregisters", async () => {
    const { live, caches } = fakeCaches([
      `${CACHE_PREFIX}B0`,
      `${CACHE_PREFIX}B1`,
      "other-cache",
    ]);
    const unregister = vi.fn(async () => true);
    await retireWorker({ caches, unregister });
    expect([...live]).toEqual(["other-cache"]);
    expect(unregister).toHaveBeenCalledOnce();
  });

  it("still unregisters when there is no cache", async () => {
    const { caches } = fakeCaches([]);
    const unregister = vi.fn(async () => true);
    await retireWorker({ caches, unregister });
    expect(unregister).toHaveBeenCalledOnce();
  });
});
