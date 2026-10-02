import { describe, expect, it } from "vitest";
import { openSyncStore, readSyncStoreConfig } from "@/sync/store/config";

describe("readSyncStoreConfig", () => {
  it("is off, without a reason, when SYNC_STORE is not set", () => {
    expect(readSyncStoreConfig({}, "development")).toEqual({
      kind: "off",
      reason: null,
    });
    expect(openSyncStore(readSyncStoreConfig({}, "production"))).toBeNull();
  });

  it("reads fs:<folder> and memory outside production", () => {
    expect(
      readSyncStoreConfig({ SYNC_STORE: "fs:.sync-store" }, "development"),
    ).toEqual({
      kind: "fs",
      dir: ".sync-store",
    });
    expect(readSyncStoreConfig({ SYNC_STORE: "memory" }, "test")).toEqual({
      kind: "memory",
    });
    expect(openSyncStore({ kind: "memory" })).not.toBeNull();
  });

  it("refuses fs and memory on a production server", () => {
    for (const SYNC_STORE of ["fs:.sync-store", "memory"]) {
      expect(readSyncStoreConfig({ SYNC_STORE }, "production")).toMatchObject({
        kind: "off",
        reason: expect.any(String),
      });
    }
  });

  it("refuses a value it does not know", () => {
    for (const SYNC_STORE of ["fs:", "s3:bucket", "yes"]) {
      expect(readSyncStoreConfig({ SYNC_STORE }, "development").kind).toBe(
        "off",
      );
    }
  });
});
