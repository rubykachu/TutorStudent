import path from "node:path";
import { parseArgs } from "node:util";
import {
  checkContent,
  formatIssue,
  type LessonStats,
  lessonStats,
} from "@/content/check";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { visualRegistry } from "@/visuals/registry";

// Usage: content-check [--root <dir>] [--stats]
const { values } = parseArgs({
  options: {
    root: { type: "string" },
    stats: { type: "boolean", default: false },
  },
});
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;

const { issues, lessons } = checkContent(readContentRoot(root), visualRegistry);

for (const issue of issues) {
  const line = formatIssue(issue);
  if (issue.severity === "error") console.error(line);
  else console.warn(line);
}

function describeStats(stats: LessonStats): string {
  return [
    `${stats.sections} sections`,
    `${stats.cards} cards`,
    `${stats.exercises} exercises`,
    `${stats.exerciseTypes} exercise types`,
    `${stats.interactiveVisuals} interactive visuals`,
  ].join(", ");
}

if (values.stats) {
  for (const { file, lesson } of lessons) {
    const stats = lessonStats(lesson, visualRegistry);
    console.log(`${lesson.id} (${file}): ${describeStats(stats)}`);
  }
}

const errors = issues.filter((issue) => issue.severity === "error").length;
const warnings = issues.length - errors;
console.log(
  `content:check ${path.relative(process.cwd(), root) || "."}: ${lessons.length} lessons, ${errors} errors, ${warnings} warnings`,
);
process.exitCode = errors > 0 ? 1 : 0;
