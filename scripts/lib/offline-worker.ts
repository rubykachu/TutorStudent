import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { WORKER_FILE, type WorkerBuildData } from "../../src/offline/config";
import { offlineWorkerOn } from "../../src/offline/flags";
import {
  checkBudget,
  keepBuildFile,
  type PrecacheEntry,
} from "../../src/offline/precache";
import { isFlightEntry } from "../../src/offline/strategy";
import { PRECACHE_LIST_FILE, type PrecacheListFile } from "./offline-manifest";

// Builds the service worker after `next build`: the precache list from
// `scripts/offline-manifest.ts` plus every file of the build's
// `<distDir>/static` that `keepBuildFile` keeps, injected into
// `src/offline/sw.ts` and bundled by esbuild to `public/sw.js`, the file
// Vercel serves at the root. Pages, their flights and lesson files are listed
// with the build id (or file hash) as revision; build files carry none, their names
// are hashed.

export type WorkerBuildResult = {
  file: string;
  entries: number;
  bytes: number;
};

function walk(dir: string, prefix = ""): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    if (entry.name.startsWith(".")) return [];
    return entry.isDirectory()
      ? walk(path.join(dir, entry.name), `${relative}/`)
      : [relative];
  });
}

// URLs and sizes of the build files the worker stores.
export function readBuildFiles(staticDir: string): {
  entries: PrecacheEntry[];
  bytes: number;
} {
  let bytes = 0;
  const entries: PrecacheEntry[] = [];
  for (const relative of walk(staticDir)) {
    const url = `/_next/static/${relative}`;
    if (!keepBuildFile(url) || relative.endsWith(".map")) continue;
    bytes += statSync(path.join(staticDir, relative)).size;
    entries.push({ url, revision: null });
  }
  return { entries, bytes };
}

// What the emitted pages weigh, from the HTML `next build` wrote for a page
// and the `.rsc` file it wrote for the page's flight.
export function pageBytes(
  distDir: string,
  pageUrls: readonly string[],
): number {
  let bytes = 0;
  for (const url of pageUrls) {
    const flight = isFlightEntry(url);
    const page = flight ? url.split("?")[0] : url;
    const name = page === "/" ? "index" : page.slice(1);
    const file = path.join(
      distDir,
      "server",
      "app",
      `${name}${flight ? ".rsc" : ".html"}`,
    );
    if (existsSync(file)) bytes += statSync(file).size;
  }
  return bytes;
}

export async function buildWorker({
  rootDir,
  distDir = process.env.NEXT_DIST_DIR || ".next",
  mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "",
  source = "src/offline/sw.ts",
  killSwitch = !offlineWorkerOn(),
  killSource = "src/offline/sw-kill.ts",
}: {
  rootDir: string;
  distDir?: string;
  mediaBaseUrl?: string;
  source?: string;
  // Write the worker that retires every installed worker instead of the
  // precaching one (offline support off, or the kill switch on:
  // `src/offline/flags.ts`).
  killSwitch?: boolean;
  killSource?: string;
}): Promise<WorkerBuildResult> {
  if (killSwitch) {
    return writeBundle(rootDir, killSource, {}, 0);
  }
  const listFile = path.join(rootDir, PRECACHE_LIST_FILE);
  if (!existsSync(listFile)) {
    throw new Error(
      `${PRECACHE_LIST_FILE} is missing; run offline-manifest first`,
    );
  }
  const list = JSON.parse(readFileSync(listFile, "utf8")) as PrecacheListFile;
  const staticDir = path.join(rootDir, distDir, "static");
  if (!existsSync(staticDir)) {
    throw new Error(
      `${path.join(distDir, "static")} is missing; run next build first`,
    );
  }
  const buildFiles = readBuildFiles(staticDir);
  const pages = list.entries.filter((e) => e.revision === list.buildId);
  checkBudget(
    list.knownBytes +
      buildFiles.bytes +
      pageBytes(
        path.join(rootDir, distDir),
        pages.map((e) => e.url),
      ),
  );

  const entries = [...list.entries, ...buildFiles.entries];
  const data: WorkerBuildData = {
    buildId: list.buildId,
    entries,
    mediaBaseUrl,
  };
  return writeBundle(
    rootDir,
    source,
    { __WORKER_DATA__: JSON.stringify(data) },
    entries.length,
  );
}

async function writeBundle(
  rootDir: string,
  source: string,
  define: Record<string, string>,
  entries: number,
): Promise<WorkerBuildResult> {
  const outfile = path.join(rootDir, "public", WORKER_FILE);
  mkdirSync(path.dirname(outfile), { recursive: true });
  const result = await build({
    entryPoints: [path.resolve(rootDir, source)],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    platform: "browser",
    define,
    write: false,
    tsconfig: path.resolve(rootDir, "tsconfig.json"),
    logLevel: "silent",
  });
  const output = result.outputFiles[0];
  if (!output) throw new Error("esbuild produced no output");
  // A worker has no `process`: reading it fails the script's evaluation, and
  // with it every install of the worker.
  if (/\bprocess\.env\b/.test(output.text)) {
    throw new Error(
      "the worker bundle reads process.env; keep build-time flags out of the modules the worker imports",
    );
  }
  writeFileSync(outfile, output.contents);
  return { file: outfile, entries, bytes: output.contents.length };
}
