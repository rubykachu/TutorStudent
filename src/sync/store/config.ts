import { createFsStore } from "./fs";
import { createMemoryStore } from "./memory";
import { createR2Store, type R2Config } from "./r2";
import type { BlobStore } from "./types";

// Which store the server uses, from the environment:
//   - the four `R2_*` variables: the private R2 bucket (production, and local
//     runs against the real bucket under `dev/`);
//   - `SYNC_STORE=fs:<folder>` or `SYNC_STORE=memory`: local runs and tests,
//     never allowed on a production server, and chosen over R2 when both are
//     set so a test server never reaches the bucket;
//   - nothing set: sync is off and the routes answer "not configured".
export type SyncStoreConfig =
  | { kind: "r2"; r2: R2Config }
  | { kind: "fs"; dir: string }
  | { kind: "memory" }
  // `reason` is for the server log only; it is null when nothing is set. It
  // names variables, never values.
  | { kind: "off"; reason: string | null };

type Env = Record<string, string | undefined>;

export const R2_ENV_NAMES = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_PRIVATE_BUCKET",
] as const;

// A Cloudflare account id is 32 hex digits; a bucket name is 3 to 63 lowercase
// letters, digits or dashes. Both go into the request URL, so anything else is
// refused rather than put there.
const ACCOUNT_ID_PATTERN = /^[0-9a-f]{32}$/;
const BUCKET_PATTERN = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

function readR2Config(env: Env): SyncStoreConfig | null {
  const value = (name: (typeof R2_ENV_NAMES)[number]) =>
    (env[name] ?? "").trim();
  const missing = R2_ENV_NAMES.filter((name) => value(name) === "");
  if (missing.length === R2_ENV_NAMES.length) return null;
  if (missing.length > 0) {
    return { kind: "off", reason: `${missing.join(", ")} not set` };
  }
  const r2: R2Config = {
    accountId: value("R2_ACCOUNT_ID"),
    accessKeyId: value("R2_ACCESS_KEY_ID"),
    secretAccessKey: value("R2_SECRET_ACCESS_KEY"),
    bucket: value("R2_PRIVATE_BUCKET"),
  };
  if (!ACCOUNT_ID_PATTERN.test(r2.accountId)) {
    return { kind: "off", reason: "R2_ACCOUNT_ID is not a 32-digit hex id" };
  }
  if (!BUCKET_PATTERN.test(r2.bucket)) {
    return { kind: "off", reason: "R2_PRIVATE_BUCKET is not a bucket name" };
  }
  return { kind: "r2", r2 };
}

export function readSyncStoreConfig(
  env: Env = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): SyncStoreConfig {
  const setting = (env.SYNC_STORE ?? "").trim();
  if (setting === "") return readR2Config(env) ?? { kind: "off", reason: null };
  if (nodeEnv === "production") {
    return {
      kind: "off",
      reason: "SYNC_STORE is not allowed on a production server",
    };
  }
  if (setting === "memory") return { kind: "memory" };
  if (setting.startsWith("fs:") && setting.length > 3) {
    return { kind: "fs", dir: setting.slice(3) };
  }
  return { kind: "off", reason: "SYNC_STORE must be fs:<folder> or memory" };
}

// The store for a config, or null when sync is off.
export function openSyncStore(config: SyncStoreConfig): BlobStore | null {
  switch (config.kind) {
    case "r2":
      return createR2Store(config.r2);
    case "fs":
      return createFsStore(config.dir);
    case "memory":
      return createMemoryStore();
    case "off":
      return null;
  }
}
