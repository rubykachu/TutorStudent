import type { NextRequest } from "next/server";
import { createSyncService } from "@/sync/server";
import { openSyncStore, readSyncStoreConfig } from "@/sync/store/config";
import { syncEnvPrefix } from "@/sync/store/keys";

// Progress sync: one doc per request (`?doc=profile`, `?child=<id>`,
// `?child=<id>&month=<yyyy-mm>`). The checks and storage live in
// `src/sync/server.ts`; this file only wires them to the environment.

let service: ReturnType<typeof createSyncService> | null = null;

function syncService() {
  if (service === null) {
    const config = readSyncStoreConfig();
    if (config.kind === "off" && config.reason !== null) {
      console.error(`progress sync is off: ${config.reason}`);
    }
    service = createSyncService({
      store: openSyncStore(config),
      prefix: syncEnvPrefix(),
    });
  }
  return service;
}

export async function GET(request: NextRequest) {
  return syncService().get(request);
}
