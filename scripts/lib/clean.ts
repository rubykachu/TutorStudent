import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";

// What `pnpm clean` removes: output that any command regenerates. Caches that
// are expensive to rebuild (the final sentence files of the narration cache,
// the TTS environment) and everything authored stay.

// Screenshots and run logs of visual:shot, lesson:walk and E2E runs.
const SHOTS_DIR = ".shots";
const OUTPUT_DIRS = ["coverage", "test-results", "playwright-report"] as const;
// Intermediate render trees of the video pipeline: video/projects/<lesson>/<video>/renders.
const VIDEO_PROJECTS_DIR = path.join("video", "projects");
const RENDERS_DIR = "renders";
// Narration cache folders: <key>.wav is the sentence kept; the synthesis
// attempts (<key>.take<n>.raw.wav, <key>.take<n>.wav) are intermediates.
const NARRATION_CACHE_DIRS = [
  path.join("video", ".cache", "narration"),
  VIDEO_PROJECTS_DIR,
] as const;
const ATTEMPT_FILE = /\.take\d+(?:\.raw)?\.wav$/;
const NEXT_DIR = ".next";
// Written by `next dev` while it runs; names the server's process.
const NEXT_DEV_LOCK = path.join(NEXT_DIR, "dev", "lock");

export type CleanOptions = { root: string; deep: boolean };
export type CleanResult = {
  removed: string[];
  skipped: { path: string; reason: string }[];
};

// Whether a dev server started from this tree is still alive.
export function devServerRunning(root: string): boolean {
  const lock = path.join(root, NEXT_DEV_LOCK);
  if (!existsSync(lock)) return false;
  try {
    const { pid } = JSON.parse(readFileSync(lock, "utf8")) as { pid?: number };
    if (typeof pid !== "number") return false;
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM: the process exists but belongs to someone else.
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

function rendersDirs(root: string): string[] {
  const base = path.join(root, VIDEO_PROJECTS_DIR);
  if (!existsSync(base)) return [];
  const found: string[] = [];
  for (const lesson of readdirSync(base)) {
    const lessonDir = path.join(base, lesson);
    if (!statSync(lessonDir).isDirectory()) continue;
    for (const video of readdirSync(lessonDir)) {
      const dir = path.join(lessonDir, video, RENDERS_DIR);
      if (existsSync(dir)) found.push(dir);
    }
  }
  return found;
}

// Synthesis attempts inside every <base>/**/audio/ folder.
function attemptFiles(base: string): string[] {
  if (!existsSync(base)) return [];
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (path.basename(dir) === "audio" && ATTEMPT_FILE.test(entry.name))
        found.push(full);
    }
  };
  walk(base);
  return found;
}

export function clean({ root, deep }: CleanOptions): CleanResult {
  const result: CleanResult = { removed: [], skipped: [] };
  const serverRunning = devServerRunning(root);
  const remove = (target: string) => {
    if (!existsSync(target)) return;
    rmSync(target, { recursive: true, force: true });
    result.removed.push(path.relative(root, target));
  };

  const shots = path.join(root, SHOTS_DIR);
  if (existsSync(shots)) {
    for (const entry of readdirSync(shots)) {
      // A running server may still be writing its log here.
      if (serverRunning && entry.endsWith(".log")) {
        result.skipped.push({
          path: path.join(SHOTS_DIR, entry),
          reason: "dev server running",
        });
        continue;
      }
      remove(path.join(shots, entry));
    }
  }
  for (const dir of OUTPUT_DIRS) remove(path.join(root, dir));
  for (const dir of rendersDirs(root)) remove(dir);
  for (const base of NARRATION_CACHE_DIRS) {
    for (const file of attemptFiles(path.join(root, base))) remove(file);
  }

  if (deep) {
    if (serverRunning) {
      result.skipped.push({
        path: NEXT_DIR,
        reason: "dev server running; stop it first",
      });
    } else {
      remove(path.join(root, NEXT_DIR));
    }
  }
  return result;
}
