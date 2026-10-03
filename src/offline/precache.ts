import { WORKER_FILE } from "./config";
import { flightEntryPath } from "./strategy";

// What the service worker stores at install, as one pure function so the
// build step and the worker share it. No Node imports: the worker bundle
// uses `keepBuildFile` and the constants, the build step
// (`precache-node.ts`) feeds it files from disk.

export type PrecacheEntry = {
  url: string;
  // Changes when the file behind the URL changes; null when the URL itself
  // carries the version (hashed build files, sound clips with `?v=`).
  revision: string | null;
};

// One emitted lesson file: its content hash, or null when the file is
// missing from the emitted content.
export type LessonFileInput = {
  id: string;
  contentHash: string | null;
  // The lesson's tips file, present only when the lesson has tips.
  tips: { hash: string | null } | null;
};

export type PublicFileInput = {
  // Path under `public/`, forward slashes, no leading slash.
  path: string;
  hash: string;
  bytes: number;
};

export type PrecacheInput = {
  // Every statically generated page (`appPagePaths()`); each is stored with
  // its flight.
  pagePaths: readonly string[];
  lessons: readonly LessonFileInput[];
  contentIndex: { hash: string; bytes: number } | null;
  // `allSoundUrls()`: every clip except songs.
  soundUrls: readonly string[];
  soundBytes: number;
  publicFiles: readonly PublicFileInput[];
  // Routes that are files and live outside `public/` (manifest, favicon).
  fileRoutes: readonly string[];
  buildId: string;
  // The media bucket origin or path; nothing may point at it.
  mediaBaseUrl?: string;
};

// What the entries cost to download, for the budget. Pages and build files
// are known only after `next build`, so they are not counted here.
export type PrecacheList = {
  entries: PrecacheEntry[];
  knownBytes: number;
};

// Largest precache the build accepts: a device keeps far more, this leaves
// room for about a hundred more lessons.
export const PRECACHE_BUDGET_BYTES = 50 * 1024 * 1024;

// Files of `public/` that never go into the precache, each with the reason.
// A path ends in "/" for a folder.
export const PRECACHE_DENY: readonly { path: string; reason: string }[] = [
  { path: "media/", reason: "videos and narration are never stored" },
  {
    path: "sounds/",
    reason:
      "short clips come from `allSoundUrls()` (with their hash in the URL) and songs are never stored",
  },
  {
    path: "content/",
    reason:
      "lesson files come from the served lessons, so stale drafts a dev emit left behind are never shipped",
  },
  {
    path: WORKER_FILE,
    reason: "the worker script is never part of its own precache",
  },
  {
    path: "brand/share.png",
    reason: "only chat crawlers read it, and they carry no service worker",
  },
];

// A cached URL never starts with one of these.
const FORBIDDEN_PREFIXES: readonly string[] = [
  "/api/",
  "/media/",
  "/unlock",
  "/dev/",
];

export function isDenied(publicPath: string): boolean {
  return PRECACHE_DENY.some(({ path }) =>
    path.endsWith("/") ? publicPath.startsWith(path) : publicPath === path,
  );
}

export function isDotfile(publicPath: string): boolean {
  return publicPath.split("/").some((segment) => segment.startsWith("."));
}

// Build files the worker stores. KaTeX lists woff2 first and every target
// browser reads woff2, so its ttf and woff copies are left out (a woff2 file
// ends in "woff2", so the test is on the exact extension).
export function keepBuildFile(url: string): boolean {
  const pathOnly = url.split("?")[0];
  return !(pathOnly.endsWith(".ttf") || pathOnly.endsWith(".woff"));
}

function checkUrl(url: string, mediaBaseUrl: string | undefined): void {
  const forbidden = FORBIDDEN_PREFIXES.find((p) => url.startsWith(p));
  if (forbidden) {
    throw new Error(`precache entry ${url} starts with ${forbidden}`);
  }
  if (mediaBaseUrl && url.startsWith(mediaBaseUrl)) {
    throw new Error(`precache entry ${url} points at the media base URL`);
  }
  if (!url.startsWith("/")) {
    throw new Error(`precache entry ${url} is not a same-origin path`);
  }
}

export function buildPrecacheEntries(input: PrecacheInput): PrecacheList {
  const entries: PrecacheEntry[] = [];
  let knownBytes = input.soundBytes;

  // Each page twice: its HTML for a page load, its flight for an in-app
  // navigation (`flight-network-first` in `strategy.ts`).
  for (const page of input.pagePaths) {
    entries.push({ url: page, revision: input.buildId });
    entries.push({ url: flightEntryPath(page), revision: input.buildId });
  }

  if (input.contentIndex === null) {
    throw new Error("the emitted content/index.json is missing");
  }
  entries.push({
    url: "/content/index.json",
    revision: input.contentIndex.hash,
  });
  knownBytes += input.contentIndex.bytes;

  for (const lesson of input.lessons) {
    if (lesson.contentHash === null) {
      throw new Error(`served lesson ${lesson.id} has no emitted file`);
    }
    entries.push({
      url: `/content/${lesson.id}.json`,
      revision: lesson.contentHash,
    });
    if (lesson.tips) {
      if (lesson.tips.hash === null) {
        throw new Error(`served lesson ${lesson.id} has no emitted tips file`);
      }
      entries.push({
        url: `/content/${lesson.id}.tips.json`,
        revision: lesson.tips.hash,
      });
    }
  }

  for (const url of input.soundUrls) entries.push({ url, revision: null });

  for (const file of input.publicFiles) {
    if (isDotfile(file.path) || isDenied(file.path)) continue;
    entries.push({ url: `/${file.path}`, revision: file.hash });
    knownBytes += file.bytes;
  }

  for (const url of input.fileRoutes) {
    entries.push({ url, revision: input.buildId });
  }

  const seen = new Set<string>();
  for (const { url } of entries) {
    checkUrl(url, input.mediaBaseUrl);
    if (seen.has(url)) throw new Error(`precache entry ${url} appears twice`);
    seen.add(url);
  }
  entries.sort((a, b) => a.url.localeCompare(b.url));
  return { entries, knownBytes };
}

export function checkBudget(totalBytes: number): void {
  if (totalBytes > PRECACHE_BUDGET_BYTES) {
    throw new Error(
      `precache is ${totalBytes} bytes, over the budget of ${PRECACHE_BUDGET_BYTES}`,
    );
  }
}
