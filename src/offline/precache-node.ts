import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { lessonContentFile, lessonTipsFile } from "@/content";
import { servedLessons, servedTipLessonIds } from "@/content/load";
import { FAVICON_ICO_PATH, MANIFEST_PATH } from "@/lib/brand";
import { allSoundUrls } from "@/lib/sound-manifest";
import {
  isDenied,
  isDotfile,
  type PrecacheInput,
  type PublicFileInput,
} from "./precache";
import { appPagePaths } from "./routes";

// Build side only: reads the emitted files and hashes them for
// `buildPrecacheEntries`.

export function fileHash(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 12);
}

// What the app serves, read from the content and the pages. Injectable so a
// test can use a small fixture instead of the real lessons.
export type PrecacheSources = {
  pagePaths: string[];
  lessonIds: string[];
  tipLessonIds: string[];
  soundUrls: string[];
};

export function appSources(): PrecacheSources {
  return {
    pagePaths: appPagePaths(),
    lessonIds: servedLessons().map((lesson) => lesson.id),
    tipLessonIds: servedTipLessonIds(),
    soundUrls: allSoundUrls(),
  };
}

function readHashed(file: string): { hash: string; bytes: number } | null {
  if (!existsSync(file)) return null;
  const bytes = readFileSync(file);
  return { hash: fileHash(bytes), bytes: bytes.length };
}

// Files under `dir` (forward-slash paths relative to it). Dotfiles and denied
// folders are not entered, so a large media folder is never read.
function walkPublic(dir: string, prefix = ""): PublicFileInput[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    if (isDotfile(relative)) return [];
    const full = path.join(dir, entry.name);
    // A linked folder (the lab links `public/media`) counts as a folder.
    if (
      entry.isDirectory() ||
      (entry.isSymbolicLink() && statSync(full).isDirectory())
    ) {
      if (isDenied(`${relative}/`)) return [];
      return walkPublic(full, `${relative}/`);
    }
    if (isDenied(relative)) return [];
    const bytes = readFileSync(full);
    return [{ path: relative, hash: fileHash(bytes), bytes: bytes.length }];
  });
}

export function readPrecacheInput(
  rootDir: string,
  buildId: string,
  sources: PrecacheSources = appSources(),
  mediaBaseUrl: string | undefined = process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
): PrecacheInput {
  const contentDir = path.join(rootDir, "public", "content");
  const tipIds = new Set(sources.tipLessonIds);
  const soundBytes = sources.soundUrls.reduce((total, url) => {
    const file = url.split("?")[0].replace(/^\//, "");
    const full = path.join(rootDir, "public", file);
    return total + (existsSync(full) ? statSync(full).size : 0);
  }, 0);
  const publicDir = path.join(rootDir, "public");
  return {
    pagePaths: sources.pagePaths,
    lessons: sources.lessonIds.map((id) => ({
      id,
      contentHash:
        readHashed(path.join(contentDir, lessonContentFile(id)))?.hash ?? null,
      tips: tipIds.has(id)
        ? {
            hash:
              readHashed(path.join(contentDir, lessonTipsFile(id)))?.hash ??
              null,
          }
        : null,
    })),
    contentIndex: readHashed(path.join(contentDir, "index.json")),
    soundUrls: sources.soundUrls,
    soundBytes,
    publicFiles: existsSync(publicDir) ? walkPublic(publicDir) : [],
    fileRoutes: [MANIFEST_PATH, FAVICON_ICO_PATH],
    buildId,
    mediaBaseUrl,
  };
}
