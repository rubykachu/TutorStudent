import { OFFLINE_KILL_SWITCH } from "../src/offline/config";
import { buildWorker } from "./lib/offline-worker";

// Run by `pnpm build` after `next build` (and before the bundle check):
// writes the service worker to `public/sw.js`. Fails above the precache
// budget. With NEXT_PUBLIC_OFFLINE_KILL_SWITCH=1 it writes the worker that
// retires installed workers instead.
try {
  const { file, entries, bytes } = await buildWorker({
    rootDir: process.cwd(),
    killSwitch: OFFLINE_KILL_SWITCH,
  });
  console.log(
    OFFLINE_KILL_SWITCH
      ? `offline worker: KILL SWITCH, the worker that retires installed workers -> ${file}`
      : `offline worker: ${entries} entries, ${(bytes / 1024).toFixed(1)} KB script -> ${file}`,
  );
} catch (error) {
  console.error(
    `offline worker FAILED: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 1;
}
