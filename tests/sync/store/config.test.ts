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

  describe("R2 variables", () => {
    const r2 = {
      R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
      R2_ACCESS_KEY_ID: "AKIDEXAMPLE",
      R2_SECRET_ACCESS_KEY: "secret-value-not-to-be-logged",
      R2_PRIVATE_BUCKET: "tutor-progress",
    };

    it("opens the bucket when all four are set", () => {
      for (const nodeEnv of ["production", "development", "test"]) {
        expect(readSyncStoreConfig(r2, nodeEnv)).toEqual({
          kind: "r2",
          r2: {
            accountId: r2.R2_ACCOUNT_ID,
            accessKeyId: r2.R2_ACCESS_KEY_ID,
            secretAccessKey: r2.R2_SECRET_ACCESS_KEY,
            bucket: r2.R2_PRIVATE_BUCKET,
          },
        });
      }
      expect(
        openSyncStore(readSyncStoreConfig(r2, "production")),
      ).not.toBeNull();
    });

    it("trims values pasted with a newline", () => {
      const config = readSyncStoreConfig(
        { ...r2, R2_PRIVATE_BUCKET: " tutor-progress\n" },
        "production",
      );
      expect(config).toMatchObject({
        kind: "r2",
        r2: { bucket: "tutor-progress" },
      });
    });

    it("keeps sync off, naming the missing variables, when only some are set", () => {
      const { R2_SECRET_ACCESS_KEY: _, R2_PRIVATE_BUCKET: __, ...some } = r2;
      const config = readSyncStoreConfig(some, "production");
      expect(config).toEqual({
        kind: "off",
        reason: "R2_SECRET_ACCESS_KEY, R2_PRIVATE_BUCKET not set",
      });
      expect(openSyncStore(config)).toBeNull();
    });

    it("keeps sync off, and never prints a value, for a malformed id or bucket", () => {
      for (const bad of [
        { R2_ACCOUNT_ID: "evil.example.com/x" },
        { R2_ACCOUNT_ID: "0123" },
        { R2_PRIVATE_BUCKET: "Bad_Bucket" },
        { R2_PRIVATE_BUCKET: "a/b" },
      ]) {
        const config = readSyncStoreConfig({ ...r2, ...bad }, "production");
        expect(config.kind).toBe("off");
        const text = JSON.stringify(config);
        for (const value of Object.values({ ...r2, ...bad })) {
          expect(text).not.toContain(value);
        }
      }
    });

    it("prefers SYNC_STORE outside production so a test server never reaches the bucket", () => {
      expect(
        readSyncStoreConfig({ ...r2, SYNC_STORE: "memory" }, "development"),
      ).toEqual({ kind: "memory" });
    });

    it("refuses SYNC_STORE on a production server even with the variables set", () => {
      expect(
        readSyncStoreConfig({ ...r2, SYNC_STORE: "memory" }, "production").kind,
      ).toBe("off");
    });
  });
});
