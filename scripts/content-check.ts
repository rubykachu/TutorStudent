import path from "node:path";
import { parseArgs } from "node:util";
import { checkContent, formatIssue } from "@/content/check";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { groupBookRefs, splitGroups } from "@/content/split";
import {
  type Criterion,
  type LessonStats,
  lessonBookRefs,
  lessonCriteria,
  lessonStats,
} from "@/content/stats";
import { visualRegistry } from "@/visuals/registry";

// Usage: content-check [--root <dir>] [--stats]
// --stats prints each lesson's size and, for real lessons, PASS/FAIL against
// the spec minimums. It reports only: the exit code reflects errors alone,
// since a lesson being drafted is expected to fall short.
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

function describeCriterion(c: Criterion): string {
  const basis = c.basis === undefined ? "" : ` = ${c.basis}`;
  return `  ${c.pass ? "PASS" : "FAIL"} ${c.name}: ${c.actual} (min ${c.required}${basis})`;
}

if (values.stats) {
  for (const { file, fixture, lesson, subject } of lessons) {
    const stats = lessonStats(lesson, visualRegistry);
    console.log(`${lesson.id} (${file}): ${describeStats(stats)}`);
    const bookRefs = lessonBookRefs(lesson);
    if (bookRefs.length > 0) {
      console.log(
        `  book exercises (${bookRefs.length}): ${bookRefs.join(", ")}`,
      );
    }
    // The fixture is test content, not held to the lesson minimums.
    if (fixture) continue;
    for (const criterion of lessonCriteria(subject, stats)) {
      console.log(describeCriterion(criterion));
    }
  }
}

if (values.stats) {
  // A book lesson split across several lessons: its parts and the book
  // exercises they hold together (each must appear once; a repeat is an error
  // reported above).
  for (const group of splitGroups(lessons)) {
    console.log(
      `Bài ${group.number} (${group.subject}/${group.series}) split into ${group.lessons.length} lessons:`,
    );
    for (const { lesson } of group.lessons) {
      console.log(`  part ${lesson.part ?? "?"}: ${lesson.id}`);
    }
    const refs = groupBookRefs(group);
    const distinct = new Set(refs.map(({ ref }) => ref.trim().toLowerCase()));
    console.log(
      `  book exercises across the parts (${refs.length}, ${distinct.size} distinct): ${refs.map(({ ref }) => ref).join(", ")}`,
    );
  }
}

const errors = issues.filter((issue) => issue.severity === "error").length;
const warnings = issues.length - errors;
console.log(
  `content:check ${path.relative(process.cwd(), root) || "."}: ${lessons.length} lessons, ${errors} errors, ${warnings} warnings`,
);
process.exitCode = errors > 0 ? 1 : 0;
