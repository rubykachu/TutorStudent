import { describe, expect, it } from "vitest";
import { createMemoryStore } from "@/sync/store/memory";
import { createTestStore } from "@/sync/store/test-store";

describe("createTestStore", () => {
  it("refuses prod/, dev/, empty and ../ prefixes", () => {
    for (const prefix of [
      "prod/",
      "dev/",
      "",
      "../",
      "test/",
      "test/../prod/",
      "test/run-abc123",
      "prod/test/run-abc123/",
      "test/run-abc123/x/",
    ]) {
      expect(() => createTestStore(prefix, createMemoryStore)).toThrow();
    }
  });

  it("keeps every read, write and delete under its prefix", async () => {
    const prefix = "test/run-abc123/";
    const store = createTestStore(prefix, createMemoryStore);
    await store.put(`${prefix}a.json`, "1");
    expect(await store.get(`${prefix}a.json`)).toMatchObject({ body: "1" });
    for (const key of [
      "prod/a.json",
      "dev/a.json",
      "test/run-other99/a.json",
    ]) {
      await expect(store.get(key)).rejects.toThrow();
      await expect(store.put(key, "x")).rejects.toThrow();
      await expect(store.delete(key)).rejects.toThrow();
    }
    await store.delete(`${prefix}a.json`);
    expect(await store.get(`${prefix}a.json`)).toBeNull();
  });
});
