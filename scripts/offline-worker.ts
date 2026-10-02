import {
  offlineEnabled,
  offlineKillSwitch,
  offlineWorkerOn,
} from "../src/offline/flags";
import { buildWorker } from "./lib/offline-worker";

// Run by `pnpm build` after `next build` (and before the bundle check):
// writes the service worker to `public/sw.js`. Fails above the precache
// budget. Unless offline support is on (`NEXT_PUBLIC_OFFLINE_ENABLED=1`) and
// the kill switch is off, it writes the worker that retires installed workers
// instead (`src/offline/flags.ts`).
function retiringReason(): string {
  if (offlineKillSwitch()) return "KILL SWITCH";
  if (!offlineEnabled()) return "offline support off";
  return "";
}

try {
  const on = offlineWorkerOn();
  const { file, entries, bytes } = await buildWorker({
    rootDir: process.cwd(),
  });
  console.log(
    on
      ? `offline worker: ${entries} entries, ${(bytes / 1024).toFixed(1)} KB script -> ${file}`
      : `offline worker: ${retiringReason()}, the worker that retires installed workers -> ${file}`,
  );
} catch (error) {
  console.error(
    `offline worker FAILED: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 1;
}
