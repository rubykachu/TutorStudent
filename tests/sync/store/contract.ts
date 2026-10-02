import { describe, expect, it } from "vitest";
import type { AdapterOptions, BlobStore } from "@/sync/store/types";

// The behaviour every store adapter must show; each adapter's test file runs
// it with a fresh store per test.
export function runStoreContract(
  name: string,
  make: (options?: AdapterOptions) => BlobStore | Promise<BlobStore>,
): void {
  describe(`${name} store contract`, () => {
    it("returns null for a missing key and the body with an etag for a stored one", async () => {
      const store = await make();
      expect(await store.get("dev/a.json")).toBeNull();
      const written = await store.put("dev/a.json", '{"a":1}');
      expect(written).toEqual({ etag: expect.any(String) });
      const read = await store.get("dev/a.json");
      expect(read).toEqual({
        body: '{"a":1}',
        etag: (written as { etag: string }).etag,
      });
    });

    it("refuses to create a key that exists with ifNoneMatch '*'", async () => {
      const store = await make();
      expect(await store.put("dev/a.json", "1", { ifNoneMatch: "*" })).toEqual({
        etag: expect.any(String),
      });
      expect(await store.put("dev/a.json", "2", { ifNoneMatch: "*" })).toEqual({
        conflict: true,
      });
      expect((await store.get("dev/a.json"))?.valueOf()).toMatchObject({
        body: "1",
      });
    });

    it("replaces with the current etag and answers conflict for a stale or missing one", async () => {
      const store = await make();
      const first = (await store.put("dev/a.json", "1")) as { etag: string };
      const second = (await store.put("dev/a.json", "2", {
        ifMatch: first.etag,
      })) as { etag: string };
      expect(second.etag).not.toBe(first.etag);
      expect(
        await store.put("dev/a.json", "3", { ifMatch: first.etag }),
      ).toEqual({ conflict: true });
      expect(await store.put("dev/none.json", "3", { ifMatch: "x" })).toEqual({
        conflict: true,
      });
      expect(await store.get("dev/a.json")).toMatchObject({ body: "2" });
      expect(await store.get("dev/none.json")).toBeNull();
    });

    it("answers unchanged to a conditional read with the current etag only", async () => {
      const store = await make();
      const { etag } = (await store.put("dev/a.json", "1")) as { etag: string };
      expect(await store.get("dev/a.json", { ifNoneMatch: etag })).toEqual({
        unchanged: true,
        etag,
      });
      expect(await store.get("dev/a.json", { ifNoneMatch: "old" })).toEqual({
        body: "1",
        etag,
      });
    });

    it("lets exactly one of two simultaneous creates win", async () => {
      const store = await make();
      const results = await Promise.all([
        store.put("dev/a.json", "x", { ifNoneMatch: "*" }),
        store.put("dev/a.json", "y", { ifNoneMatch: "*" }),
      ]);
      expect(results.filter((r) => "etag" in r)).toHaveLength(1);
      expect(results.filter((r) => "conflict" in r)).toHaveLength(1);
    });

    it("lets exactly one of two simultaneous replaces of one etag win", async () => {
      const store = await make();
      const { etag } = (await store.put("dev/a.json", "0")) as { etag: string };
      const results = await Promise.all([
        store.put("dev/a.json", "x", { ifMatch: etag }),
        store.put("dev/a.json", "y", { ifMatch: etag }),
      ]);
      expect(results.filter((r) => "etag" in r)).toHaveLength(1);
    });

    it("deletes only under the test prefix the store was made with", async () => {
      const prefix = "test/run-abc123/";
      const store = await make({ testPrefix: prefix });
      await store.put(`${prefix}a.json`, "1");
      await store.put("dev/b.json", "2");
      await expect(store.delete("dev/b.json")).rejects.toThrow();
      await expect(store.delete(`${prefix}../dev/b.json`)).rejects.toThrow();
      await expect(store.delete("test/run-other99/a.json")).rejects.toThrow();
      expect(await store.get("dev/b.json")).toMatchObject({ body: "2" });
      await store.delete(`${prefix}a.json`);
      expect(await store.get(`${prefix}a.json`)).toBeNull();
      await store.delete(`${prefix}a.json`);
    });

    it("cannot delete anything when made without a test prefix", async () => {
      const store = await make();
      await store.put("dev/a.json", "1");
      await expect(store.delete("dev/a.json")).rejects.toThrow();
      await expect(store.delete("test/run-abc123/a.json")).rejects.toThrow();
      expect(await store.get("dev/a.json")).toMatchObject({ body: "1" });
    });
  });
}
