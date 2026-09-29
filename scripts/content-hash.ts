import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkContent, formatIssue } from "@/content/check";
import { computeReviewedHash } from "@/content/lint/review-hash";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { REQUIRE_OWNER_APPROVAL } from "@/lib/config";
import { visualRegistry } from "@/visuals/registry";

// Usage: content-hash <lessonId> [--root <dir>] [--approve]
// Prints the review hash of a lesson. With --approve (run by the review once
// no blocking finding is left) it writes `reviewedHash` and publishes the
// lesson, unless REQUIRE_OWNER_APPROVAL leaves publishing to the admin.
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    root: { type: "string" },
    approve: { type: "boolean", default: false },
  },
});
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;
const lessonId = positionals[0];
if (lessonId === undefined) {
  console.error("Usage: content-hash <lessonId> [--root <dir>] [--approve]");
  process.exit(2);
}

const raw = readContentRoot(root);
const { issues, lessons } = checkContent(raw, visualRegistry);
const checked = lessons.find((l) => l.lesson.id === lessonId);
if (!checked) {
  console.error(`content:hash: no valid lesson "${lessonId}" in ${root}`);
  process.exit(1);
}
const hash = computeReviewedHash(checked.lesson);

if (!values.approve) {
  console.log(hash);
  process.exit(0);
}

// A stale hash is exactly what approving fixes; every other error blocks.
const blocking = issues.filter(
  (issue) =>
    issue.file === checked.file &&
    issue.severity === "error" &&
    issue.rule !== "review-hash",
);
if (blocking.length > 0) {
  for (const issue of blocking) console.error(formatIssue(issue));
  console.error("content:hash: fix the errors above before approving");
  process.exit(1);
}

const rawFile = raw.lessons.find((l) => l.file === checked.file);
const data = { ...(rawFile?.data as Record<string, unknown>) };
// Rebuilt key by key so reviewedHash sits right after status in the file.
const next: Record<string, unknown> = {};
for (const [key, value] of Object.entries(data)) {
  if (key === "reviewedHash") continue;
  next[key] = key === "status" && !REQUIRE_OWNER_APPROVAL ? "published" : value;
  if (key === "status") next.reviewedHash = hash;
}
const absolute = path.resolve(checked.file);
writeFileSync(absolute, `${JSON.stringify(next, null, 2)}\n`);
// Biome owns JSON layout in this repo; formatting here keeps `pnpm lint` clean.
spawnSync(path.join(process.cwd(), "node_modules", ".bin", "biome"), [
  "format",
  "--write",
  absolute,
]);
console.log(
  `content:hash: ${checked.lesson.id} reviewedHash=${hash}${REQUIRE_OWNER_APPROVAL ? " (awaiting admin to publish)" : ", status=published"}`,
);
