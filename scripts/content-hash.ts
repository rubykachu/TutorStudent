import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkContent, formatIssue } from "@/content/check";
import {
  computeReviewedHash,
  computeTipsHash,
} from "@/content/lint/review-hash";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { REQUIRE_OWNER_APPROVAL } from "@/lib/config";
import { visualRegistry } from "@/visuals/registry";
import { markReviewed, REVIEW_FILE } from "./lib/review-baseline";

// Usage: content-hash <lessonId> [--root <dir>] [--tips] [--mark | --approve]
// Prints the review hash of a lesson. --mark (run when a review round ends
// with blocking findings) records the hash in the lesson's review.md, so the
// next round can diff against this version (`pnpm content:diff`). --approve
// (run once no blocking finding is left) records it too, writes
// `reviewedHash` and publishes the lesson, unless REQUIRE_OWNER_APPROVAL
// leaves publishing to the admin. --tips does the same for the lesson's
// tips.json (its own hash and status; the lesson itself is untouched, so a
// published lesson gains tips without a new review of the lesson).
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    root: { type: "string" },
    mark: { type: "boolean", default: false },
    approve: { type: "boolean", default: false },
    tips: { type: "boolean", default: false },
  },
});
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;
const lessonId = positionals[0];
if (lessonId === undefined) {
  console.error(
    "Usage: content-hash <lessonId> [--root <dir>] [--tips] [--mark | --approve]",
  );
  process.exit(2);
}

const raw = readContentRoot(root);
const { issues, lessons } = checkContent(raw, visualRegistry);
const checked = lessons.find((l) => l.lesson.id === lessonId);
if (!checked) {
  console.error(`content:hash: no valid lesson "${lessonId}" in ${root}`);
  process.exit(1);
}
if (values.tips && !checked.tips) {
  console.error(`content:hash: lesson "${lessonId}" has no valid tips.json`);
  process.exit(1);
}
const hash =
  values.tips && checked.tips
    ? computeTipsHash(checked.tips)
    : computeReviewedHash(checked.lesson);

if (values.tips && values.mark) {
  console.error("content:hash: --mark records a lesson review, not tips");
  process.exit(2);
}

const mark = () => {
  const marked = markReviewed(checked.file, hash);
  console.log(
    marked
      ? `content:hash: recorded the reviewed version in ${REVIEW_FILE}`
      : `content:hash: no ${REVIEW_FILE} next to the lesson; reviewed version not recorded`,
  );
};

if (!values.approve) {
  console.log(hash);
  if (values.mark) mark();
  process.exit(0);
}

// A stale hash is exactly what approving fixes; every other error blocks, and
// so do placeholder visuals, which only become errors once published.
const reviewedFile =
  values.tips && checked.tipsFile ? checked.tipsFile : checked.file;
const blocking = issues.filter(
  (issue) =>
    issue.file === reviewedFile &&
    ((issue.severity === "error" && issue.rule !== "review-hash") ||
      issue.rule === "placeholder"),
);
if (blocking.length > 0) {
  for (const issue of blocking) console.error(formatIssue(issue));
  console.error("content:hash: fix the errors above before approving");
  process.exit(1);
}

const rawLesson = raw.lessons.find((l) => l.file === checked.file);
const rawFile = values.tips ? rawLesson?.tips : rawLesson;
const data = { ...(rawFile?.data as Record<string, unknown>) };
// Rebuilt key by key so reviewedHash sits right after status in the file.
const next: Record<string, unknown> = {};
for (const [key, value] of Object.entries(data)) {
  if (key === "reviewedHash") continue;
  next[key] = key === "status" && !REQUIRE_OWNER_APPROVAL ? "published" : value;
  if (key === "status") next.reviewedHash = hash;
}
const absolute = path.resolve(reviewedFile);
writeFileSync(absolute, `${JSON.stringify(next, null, 2)}\n`);
// Biome owns JSON layout in this repo; formatting here keeps `pnpm lint` clean.
spawnSync(path.join(process.cwd(), "node_modules", ".bin", "biome"), [
  "format",
  "--write",
  absolute,
]);
if (!values.tips) mark();
console.log(
  `content:hash: ${checked.lesson.id}${values.tips ? " tips" : ""} reviewedHash=${hash}${REQUIRE_OWNER_APPROVAL ? " (awaiting admin to publish)" : ", status=published"}`,
);
