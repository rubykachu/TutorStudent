// @vitest-environment node
import { describe, expect, it } from "vitest";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import {
  addPending,
  readPending,
  removePending,
} from "@/user-feedback/pending";

const A = { id: "a".repeat(32), month: "2026-10" };
const B = { id: "b".repeat(32), month: "2026-10" };

describe("pending list", () => {
  it("adds once, in order, and removes", async () => {
    const store = createMemoryStore();
    expect(await addPending(store, "dev/", A)).toBe("added");
    expect(await addPending(store, "dev/", A)).toBe("listed");
    expect(await addPending(store, "dev/", B)).toBe("added");
    expect((await readPending(store, "dev/")).list.items).toEqual([A, B]);
    expect(await removePending(store, "dev/", A.id)).toBe("removed");
    expect(await removePending(store, "dev/", A.id)).toBe("absent");
    expect((await readPending(store, "dev/")).list.items).toEqual([B]);
  });

  it("keeps both of two adds at once", async () => {
    const store = createMemoryStore();
    await Promise.all([
      addPending(store, "dev/", A),
      addPending(store, "dev/", B),
    ]);
    const ids = (await readPending(store, "dev/")).list.items.map((i) => i.id);
    expect(ids.sort()).toEqual([A.id, B.id]);
  });

  it("reads a damaged list as empty and replaces it", async () => {
    const store = createMemoryStore();
    await store.put(syncKey("dev/", { kind: "feedback-pending" }), "{oops");
    expect((await readPending(store, "dev/")).list.items).toEqual([]);
    expect(await addPending(store, "dev/", A)).toBe("added");
    expect((await readPending(store, "dev/")).list.items).toEqual([A]);
  });
});
