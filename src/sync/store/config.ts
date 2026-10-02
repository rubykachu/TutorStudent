import { createFsStore } from "./fs";
import { createMemoryStore } from "./memory";
import type { BlobStore } from "./types";

// Which store the server uses, from the environment:
//   - `SYNC_STORE=fs:<folder>` or `SYNC_STORE=memory`: local runs and tests,
//     never allowed on a production server;
//   - unset: sync is off and the routes answer "not configured".
export type SyncStoreConfig =
  | { kind: "fs"; dir: string }
  | { kind: "memory" }
  // `reason` is for the server log only; it is null when nothing is set.
  | { kind: "off"; reason: string | null };

type Env = Record<string, string | undefined>;

export function readSyncStoreConfig(
  env: Env = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): SyncStoreConfig {
  const setting = (env.SYNC_STORE ?? "").trim();
  if (setting === "") return { kind: "off", reason: null };
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
    case "fs":
      return createFsStore(config.dir);
    case "memory":
      return createMemoryStore();
    case "off":
      return null;
  }
}
