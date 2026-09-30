import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { computeReviewedHash } from "@/content/lint/review-hash";
import { LessonSchema } from "@/schema/content";

// The version of a lesson that a review round last read, so the next round
// can review only what changed (`pnpm content:diff`). The review hash of that
// version is written into review.md (`content:hash --mark`, and `--approve`);
// the version itself is read back from git history, so lesson.json must be
// committed after each round before it is edited again.

export const REVIEW_FILE = "review.md";
const LABEL = "Bản đã review";
const LINE = new RegExp(`^- ${LABEL}: \`([0-9a-f]{64})\``, "m");

// Hash of raw lesson JSON as content:hash computes it, or undefined when the
// JSON does not parse with today's schema.
export function hashOfRaw(raw: unknown): string | undefined {
  const parsed = LessonSchema.safeParse(raw);
  return parsed.success ? computeReviewedHash(parsed.data) : undefined;
}

export function readMarkedHash(lessonFile: string): string | undefined {
  const review = path.join(path.dirname(lessonFile), REVIEW_FILE);
  if (!existsSync(review)) return undefined;
  return LINE.exec(readFileSync(review, "utf8"))?.[1];
}

// Records `hash` in the review.md next to the lesson, replacing an older
// record; placed after the "Kết luận" line of the review template. Returns
// false when there is no review.md yet.
export function markReviewed(lessonFile: string, hash: string): boolean {
  const review = path.join(path.dirname(lessonFile), REVIEW_FILE);
  if (!existsSync(review)) return false;
  const line = `- ${LABEL}: \`${hash}\` (\`pnpm content:diff\` so với bản này)`;
  const lines = readFileSync(review, "utf8")
    .split("\n")
    .filter((l) => !LINE.test(l));
  const anchor = lines.findIndex((l) => l.startsWith("- Kết luận:"));
  const firstGap = lines.findIndex((l, i) => i > 0 && l.trim() === "");
  lines.splice(anchor >= 0 ? anchor + 1 : Math.max(firstGap, 1), 0, line);
  writeFileSync(review, lines.join("\n"));
  return true;
}

function git(cwd: string, args: string[]): string | undefined {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return result.status === 0 ? result.stdout : undefined;
}

export interface Baseline {
  commit: string;
  data: unknown;
  // How the commit was chosen, for the report.
  how: string;
}

// The reviewed version of `lessonFile`: the commit given by `base`; else the
// newest commit whose content has the hash recorded in review.md; else, with
// no record, the newest commit whose own reviewedHash matches its content
// (the last approved version).
export function findBaseline(
  lessonFile: string,
  base?: string,
): Baseline | { error: string } {
  // Real paths on both sides: git reports /private/var for macOS's /var.
  const absolute = realpathSync(lessonFile);
  const top = git(path.dirname(absolute), [
    "rev-parse",
    "--show-toplevel",
  ])?.trim();
  if (!top) return { error: `${lessonFile} is not inside a git repository` };
  const relative = path
    .relative(realpathSync(top), absolute)
    .split(path.sep)
    .join("/");
  const readAt = (commit: string) => {
    const text = git(top, ["show", `${commit}:${relative}`]);
    if (text === undefined) return undefined;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return undefined;
    }
  };

  if (base) {
    const data = readAt(base);
    return data === undefined
      ? { error: `${relative} not found at ${base}` }
      : { commit: base, data, how: "--base" };
  }

  const marked = readMarkedHash(lessonFile);
  const commits = (git(top, ["log", "--format=%H", "--", relative]) ?? "")
    .split("\n")
    .filter(Boolean);
  for (const commit of commits) {
    const data = readAt(commit);
    if (data === undefined) continue;
    const hash = hashOfRaw(data);
    if (hash === undefined) continue;
    const stored = (data as { reviewedHash?: unknown }).reviewedHash;
    if (marked ? hash === marked : hash === stored) {
      return {
        commit,
        data,
        how: marked
          ? `hash ${marked.slice(0, 12)} recorded in ${REVIEW_FILE}`
          : "last approved version (reviewedHash)",
      };
    }
  }
  // Reviewed but not committed yet: nothing can have changed since.
  const working = JSON.parse(readFileSync(lessonFile, "utf8")) as unknown;
  if (marked && hashOfRaw(working) === marked) {
    return { commit: "working tree", data: working, how: "not committed yet" };
  }
  return {
    error: marked
      ? `no commit of ${relative} has the reviewed hash ${marked.slice(0, 12)} from ${REVIEW_FILE}; commit lesson.json after each review round, or pass --base <commit>`
      : `no reviewed version of ${relative} in git history; pass --base <commit>`,
  };
}
