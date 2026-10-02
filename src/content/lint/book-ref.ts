import type { Lesson } from "@/schema/content";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// Textbook exercises are reproduced word for word in two places, each exercise
// naming its place in the book with `bookRef`:
// - a review lesson (`kind: "review"`), in any exercise;
// - a `bookPractice` section (the last section of a regular lesson), in the
//   exercises its `checkIds` and `practiceIds` list.
// Nowhere else may an exercise carry `bookRef`.

// Child-facing fields of an exercise that carry the book's wording.
const BOOK_WORDING_KEYS = new Set([
  "prompt",
  "options",
  "segments",
  "left",
  "right",
  "items",
]);

// Ids of the exercises listed by the lesson's `bookPractice` sections.
export function bookPracticeIds(lesson: Lesson): Set<string> {
  return new Set(
    lesson.sections
      .filter((section) => section.bookPractice)
      .flatMap((section) => [...section.checkIds, ...section.practiceIds]),
  );
}

// True when `bookRef` is allowed on the lesson's exercise number `index`.
function mayReproduceBook(
  lesson: Lesson,
  index: number,
  practiceIds: ReadonlySet<string>,
): boolean {
  if (lesson.kind === "review") return true;
  const id = lesson.exercises[index]?.id;
  return id !== undefined && practiceIds.has(id);
}

// True when `path` points inside the book wording of an exercise that has
// `bookRef` and may reproduce the book: sentence limits and the textbook-copy
// check do not apply there, because the book's text cannot be reworded.
export function isBookWording(
  input: LintInput,
  path: readonly (string | number)[],
): boolean {
  const [root, index, key] = path;
  if (root !== "exercises" || typeof index !== "number") return false;
  if (typeof key !== "string" || !BOOK_WORDING_KEYS.has(key)) return false;
  const { lesson } = input;
  if (lesson.exercises[index]?.bookRef === undefined) return false;
  return mayReproduceBook(lesson, index, bookPracticeIds(lesson));
}

export function lintBookRef(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "book-ref");
  const { lesson } = input;
  const practiceIds = bookPracticeIds(lesson);
  lesson.exercises.forEach((exercise, i) => {
    if (exercise.bookRef === undefined) return;
    if (mayReproduceBook(lesson, i, practiceIds)) return;
    report(
      ["exercises", i, "bookRef"],
      `Only a review lesson (kind "review") or an exercise of a bookPractice section reproduces book exercises; drop bookRef and write the exercise in the lesson's own words${learned("LL-08")}`,
    );
  });
  return findings;
}
