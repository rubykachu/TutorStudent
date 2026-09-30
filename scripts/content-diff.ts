import { readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { diffLessons, formatDiff } from "@/content/review-diff";
import { findBaseline } from "./lib/review-baseline";

// Usage: content-diff <lessonId> [--root <dir>] [--base <git-rev>]
// Lists the sections, blocks, cards, exercises and videos that changed since
// the last reviewed version of the lesson, with their text, and the sections
// a diff review round rereads. The reviewed version is found in git history
// (scripts/lib/review-baseline.ts); --base picks a commit instead.
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    root: { type: "string" },
    base: { type: "string" },
  },
});
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;
const lessonId = positionals[0];
if (lessonId === undefined) {
  console.error("Usage: content-diff <lessonId> [--root <dir>] [--base <rev>]");
  process.exit(2);
}

const file = readContentRoot(root).lessons.find(
  (l) => (l.data as { id?: unknown } | undefined)?.id === lessonId,
)?.file;
if (!file) {
  console.error(`content:diff: no lesson "${lessonId}" in ${root}`);
  process.exit(1);
}

const baseline = findBaseline(file, values.base);
if ("error" in baseline) {
  console.error(`content:diff: ${baseline.error}`);
  process.exit(1);
}
const current: unknown = JSON.parse(readFileSync(file, "utf8"));
console.log(
  `content:diff ${lessonId}: against ${baseline.commit.slice(0, 10)} (${baseline.how})\n`,
);
console.log(formatDiff(diffLessons(baseline.data, current)));
