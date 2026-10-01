import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// A review lesson (`kind: "review"`) reproduces the textbook's exercises word
// for word; each such exercise names its place in the book with `bookRef`. No
// other lesson may do so.

// Child-facing fields of an exercise that carry the book's wording.
const BOOK_WORDING_KEYS = new Set([
  "prompt",
  "options",
  "segments",
  "left",
  "right",
  "items",
]);

// True when `path` points inside the book wording of an exercise of a review
// lesson that has `bookRef`: sentence limits do not apply there, because the
// book's text cannot be shortened.
export function isBookWording(
  input: LintInput,
  path: readonly (string | number)[],
): boolean {
  if (input.lesson.kind !== "review") return false;
  const [root, index, key] = path;
  if (root !== "exercises" || typeof index !== "number") return false;
  if (typeof key !== "string" || !BOOK_WORDING_KEYS.has(key)) return false;
  return input.lesson.exercises[index]?.bookRef !== undefined;
}

export function lintBookRef(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "book-ref");
  if (input.lesson.kind === "review") return findings;
  input.lesson.exercises.forEach((exercise, i) => {
    if (exercise.bookRef === undefined) return;
    report(
      ["exercises", i, "bookRef"],
      `Only a review lesson (kind "review") reproduces book exercises; drop bookRef and write the exercise in the lesson's own words${learned("LL-08")}`,
    );
  });
  return findings;
}
