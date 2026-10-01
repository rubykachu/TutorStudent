import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  MEDIA_CACHE_CONTROL,
  MEDIA_CONTENT_TYPES,
  MEDIA_EXCLUDED_LESSONS,
  MEDIA_KINDS,
  MEDIA_ROOT,
  R2_BUCKET,
  WRANGLER,
} from "./release-config";
import type { Exec } from "./run";

export type UploadArgs = {
  lessons: string[];
  all: boolean;
  dryRun: boolean;
};

export const UPLOAD_USAGE =
  "Usage: media:upload <lesson>... | --all  [--dry-run]";

export function parseUploadArgs(argv: readonly string[]): UploadArgs {
  const { values, positionals } = parseArgs({
    args: [...argv],
    allowPositionals: true,
    options: {
      all: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
  });
  if (values.all && positionals.length > 0) {
    throw new Error("Give lesson names or --all, not both.");
  }
  if (!values.all && positionals.length === 0) {
    throw new Error(
      `Name at least one lesson, or pass --all.\n${UPLOAD_USAGE}`,
    );
  }
  return {
    lessons: [...new Set(positionals)],
    all: values.all ?? false,
    dryRun: values["dry-run"] ?? false,
  };
}

export function contentTypeFor(file: string): string {
  const type = MEDIA_CONTENT_TYPES[path.extname(file).toLowerCase()];
  if (!type) {
    throw new Error(
      `No Content-Type for "${file}": add its extension to MEDIA_CONTENT_TYPES in scripts/lib/release-config.ts.`,
    );
  }
  return type;
}

export type MediaFile = {
  lesson: string;
  // Object key in the bucket, also the path under the media root.
  key: string;
  file: string;
  contentType: string;
};

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(full) : [full];
    })
    .sort();
}

// Every lesson that has a media folder, fixture excluded.
export function listMediaLessons(root: string): string[] {
  const lessons = new Set<string>();
  for (const kind of MEDIA_KINDS) {
    const dir = path.join(root, MEDIA_ROOT, kind);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) lessons.add(entry.name);
    }
  }
  return [...lessons]
    .filter((lesson) => !MEDIA_EXCLUDED_LESSONS.includes(lesson))
    .sort();
}

// The files of one lesson: `<kind>/<lesson>/**` under the media root.
export function selectLessonFiles(root: string, lesson: string): MediaFile[] {
  if (MEDIA_EXCLUDED_LESSONS.includes(lesson)) {
    throw new Error(`"${lesson}" is never uploaded.`);
  }
  const base = path.join(root, MEDIA_ROOT);
  const files = MEDIA_KINDS.flatMap((kind) =>
    listFiles(path.join(base, kind, lesson)),
  ).map((file) => ({
    lesson,
    key: path.relative(base, file).split(path.sep).join("/"),
    file,
    contentType: contentTypeFor(file),
  }));
  if (files.length === 0) {
    throw new Error(`No media for lesson "${lesson}" under ${MEDIA_ROOT}/.`);
  }
  return files;
}

// What the bucket already holds for a key (null when it is missing or cannot
// be checked). `etag` is the object's MD5 for a single-part upload.
export type RemoteInfo = { etag: string | null } | null;
export type HeadRemote = (key: string) => Promise<RemoteInfo>;

// Cheap read-only check through the public bucket URL; no credentials needed.
export function headThroughPublicUrl(baseUrl: string): HeadRemote {
  return async (key) => {
    try {
      const response = await fetch(`${baseUrl}/${key}`, { method: "HEAD" });
      if (!response.ok) return null;
      const etag = response.headers.get("etag")?.replace(/^W\//, "");
      return { etag: etag ? etag.replace(/"/g, "").toLowerCase() : null };
    } catch {
      return null;
    }
  };
}

export function md5(file: string): string {
  return createHash("md5").update(readFileSync(file)).digest("hex");
}

export function putCommand(item: MediaFile): string[] {
  return [
    ...WRANGLER,
    "r2",
    "object",
    "put",
    `${R2_BUCKET}/${item.key}`,
    "--file",
    item.file,
    "--content-type",
    item.contentType,
    "--cache-control",
    MEDIA_CACHE_CONTROL,
    "--remote",
  ];
}

export type UploadDeps = {
  root: string;
  exec: Exec;
  // Absent: nothing can be compared, so every file of the lesson is uploaded.
  head?: HeadRemote;
  log: (line: string) => void;
};

function formatSize(file: string): string {
  return `${(statSync(file).size / 1024 / 1024).toFixed(1)} MB`;
}

// Returns the process exit code.
export async function runMediaUpload(
  argv: readonly string[],
  deps: UploadDeps,
): Promise<number> {
  const { root, exec, head, log } = deps;
  let args: UploadArgs;
  let items: MediaFile[];
  try {
    args = parseUploadArgs(argv);
    const lessons = args.all ? listMediaLessons(root) : args.lessons;
    items = lessons.flatMap((lesson) => selectLessonFiles(root, lesson));
  } catch (error) {
    log(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const todo: MediaFile[] = [];
  let same = 0;
  for (const item of items) {
    const remote = head ? await head(item.key) : null;
    if (remote?.etag && remote.etag === md5(item.file)) {
      same += 1;
      log(`same    ${item.key}`);
    } else {
      todo.push(item);
      log(
        `${args.dryRun ? "would upload" : "upload "} ${item.key} (${item.contentType}, ${formatSize(item.file)})`,
      );
    }
  }
  if (!head) log("remote check off: no media base URL, all files are uploaded");

  if (args.dryRun) {
    log(
      `media:upload dry run: ${todo.length} to upload, ${same} already identical, bucket ${R2_BUCKET}`,
    );
    return 0;
  }

  let failed = 0;
  for (const item of todo) {
    const result = exec(putCommand(item));
    if (result.status !== 0) {
      failed += 1;
      log(
        `FAILED  ${item.key}: ${result.stderr.trim() || result.stdout.trim()}`,
      );
    }
  }
  log(
    `media:upload: ${todo.length - failed} uploaded, ${same} already identical, ${failed} failed, bucket ${R2_BUCKET}`,
  );
  return failed === 0 ? 0 : 1;
}
