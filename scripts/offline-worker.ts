import { buildWorker } from "./lib/offline-worker";

// Run by `pnpm build` after `next build` (and before the bundle check):
// writes the service worker to `public/sw.js`. Fails above the precache budget.
try {
  const { file, entries, bytes } = await buildWorker({
    rootDir: process.cwd(),
  });
  console.log(
    `offline worker: ${entries} entries, ${(bytes / 1024).toFixed(1)} KB script -> ${file}`,
  );
} catch (error) {
  console.error(
    `offline worker FAILED: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 1;
}
