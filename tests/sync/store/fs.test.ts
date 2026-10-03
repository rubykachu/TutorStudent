// @vitest-environment node
import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createFsStore } from "@/sync/store/fs";
import { runStoreContract } from "./contract";

const folders: string[] = [];
async function folder() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "sync-store-"));
  folders.push(dir);
  return dir;
}
afterEach(async () => {
  await Promise.all(
    folders.splice(0).map((dir) => rm(dir, { recursive: true })),
  );
});

runStoreContract("fs", async (options) =>
  createFsStore(await folder(), options),
);

describe("fs store", () => {
  it("writes under its folder only and refuses keys that leave it", async () => {
    const dir = await folder();
    const store = createFsStore(dir);
    await store.put("dev/progress/OWL4K7MQ/profile.json", "{}");
    expect(await readdir(path.join(dir, "dev/progress/OWL4K7MQ"))).toEqual([
      "profile.json",
    ]);
    for (const key of [
      "../outside.json",
      "dev/../../outside.json",
      "/etc/passwd",
      "dev//a.json",
      "dev/a\\b.json",
      "dev/.hidden",
      "",
    ]) {
      await expect(store.put(key, "x")).rejects.toThrow();
      await expect(store.get(key)).rejects.toThrow();
    }
    expect(await readdir(path.dirname(dir))).not.toContain("outside.json");
  });

  it("keeps docs across store instances on the same folder", async () => {
    const dir = await folder();
    const { etag } = (await createFsStore(dir).put("dev/a.json", "1")) as {
      etag: string;
    };
    expect(await createFsStore(dir).get("dev/a.json")).toEqual({
      body: "1",
      etag,
    });
  });
});
