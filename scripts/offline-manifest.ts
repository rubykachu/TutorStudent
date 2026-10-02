import { PRECACHE_LIST_FILE, writePrecacheList } from "./lib/offline-manifest";

// Run by `pnpm build` after the production content emit and before
// `next build`, and by the offline test lab. Writes the list of files the
// service worker stores at install; fails above the budget or when a served
// lesson has no emitted file.
try {
  const { entries, knownBytes } = writePrecacheList({
    rootDir: process.cwd(),
  });
  console.log(
    `offline manifest: ${entries.length} entries, ${(knownBytes / 1024).toFixed(0)} KB of content, sounds and public files (pages and build files are counted by the worker build) -> ${PRECACHE_LIST_FILE}`,
  );
} catch (error) {
  console.error(
    `offline manifest FAILED: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 1;
}
