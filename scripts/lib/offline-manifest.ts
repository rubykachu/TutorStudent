import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildPrecacheEntries,
  checkBudget,
  type PrecacheEntry,
} from "../../src/offline/precache";
import {
  type PrecacheSources,
  readPrecacheInput,
} from "../../src/offline/precache-node";

// The generated precache list the worker build reads. It is gitignored: both
// `pnpm build` and the offline test lab write it with `writePrecacheList`, so
// the two builds cannot differ.
export const PRECACHE_LIST_FILE = "src/offline/precache-list.generated.json";

export type PrecacheListFile = {
  buildId: string;
  // Bytes of what is known before `next build` (content, sounds, public
  // files); the worker build adds the build files and the pages.
  knownBytes: number;
  entries: PrecacheEntry[];
};

// A new id per build: every page is stored again after a deploy, which keeps
// an offline page from ever coming from an older build than its chunks.
export function newBuildId(now: Date = new Date()): string {
  return now.toISOString().replace(/[^0-9]/g, "");
}

export function writePrecacheList({
  rootDir,
  buildId = newBuildId(),
  sources,
  mediaBaseUrl,
}: {
  rootDir: string;
  buildId?: string;
  sources?: PrecacheSources;
  mediaBaseUrl?: string;
}): { entries: PrecacheEntry[]; knownBytes: number; file: string } {
  const input = readPrecacheInput(rootDir, buildId, sources, mediaBaseUrl);
  const { entries, knownBytes } = buildPrecacheEntries(input);
  checkBudget(knownBytes);
  const file = path.join(rootDir, PRECACHE_LIST_FILE);
  mkdirSync(path.dirname(file), { recursive: true });
  const body: PrecacheListFile = { buildId, knownBytes, entries };
  writeFileSync(file, `${JSON.stringify(body, null, 2)}\n`);
  return { entries, knownBytes, file };
}
