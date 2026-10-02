// @vitest-environment node
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { R2_ENV_NAMES, readSyncStoreConfig } from "@/sync/store/config";
import { testPrefix } from "@/sync/store/keys";
import { createR2Store } from "@/sync/store/r2";
import { createTestStore } from "@/sync/store/test-store";
import { runStoreContract } from "../sync/store/contract";

// The store contract against the real R2 bucket. It is a real, billed call, so
// it runs only through `pnpm test:r2`, which sets the flag below, and only
// when `.env.local` (or the shell) holds the four R2 variables; otherwise it
// is skipped with a message. Every key lives under one `test/<run-id>/` prefix
// through `createTestStore`, which refuses any other key, and the run deletes
// only the keys it wrote there. It never lists, reads or writes `prod/` or
// `dev/`.
const R2_SMOKE_FLAG = "TUTOR_R2_SMOKE";

if (process.env[R2_SMOKE_FLAG] === "1" && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const flagged = process.env[R2_SMOKE_FLAG] === "1";
const configured = readSyncStoreConfig(process.env, "test");
const ready = flagged && configured.kind === "r2";

if (!ready) {
  const why = flagged
    ? `${R2_ENV_NAMES.join(", ")} are not all valid in .env.local or the environment`
    : `run it with \`pnpm test:r2\` (sets ${R2_SMOKE_FLAG}=1)`;
  console.info(`real R2 smoke test skipped: ${why}`);
}

describe.skipIf(!ready)("real R2 bucket under test/<run-id>/", () => {
  const r2 = configured.kind === "r2" ? configured.r2 : null;
  const runId = `smoke-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
  const prefix = testPrefix(runId);
  const written = new Set<string>();

  const make = () => {
    if (r2 === null) throw new Error("R2 is not configured");
    const store = createTestStore(prefix, (options) =>
      createR2Store(r2, options),
    );
    // Remember what this run wrote, to delete exactly that afterwards.
    return {
      ...store,
      put: async (...args: Parameters<typeof store.put>) => {
        written.add(args[0]);
        return store.put(...args);
      },
    };
  };

  afterAll(async () => {
    const store = make();
    for (const key of written) await store.delete(key);
  });

  runStoreContract("real R2", make, { root: prefix, scoped: true });

  it("deletes a key it wrote and leaves a key outside its prefix alone", async () => {
    const store = make();
    await store.put(`${prefix}gone.json`, "1");
    await store.delete(`${prefix}gone.json`);
    expect(await store.get(`${prefix}gone.json`)).toBeNull();
    await expect(store.delete("dev/anything.json")).rejects.toThrow();
    await expect(store.delete("prod/anything.json")).rejects.toThrow();
  });
});

describe("real R2 smoke test guard", () => {
  it("builds its prefix as test/<run-id>/ only", () => {
    expect(testPrefix("smoke-abc123")).toBe("test/smoke-abc123/");
    for (const bad of ["", "../prod", "prod", "a/b", "Smoke-ABC123"]) {
      expect(() => testPrefix(bad)).toThrow();
    }
  });
});
