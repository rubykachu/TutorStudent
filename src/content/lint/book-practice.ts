import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// A `bookPractice` section reproduces the workbook's exercises of the lesson
// (see book-ref.ts). Shape rules:
// - a regular lesson only (a review lesson marks each exercise with
//   `bookRef` instead), at most one such section, and it is the lesson's last;
// - every exercise in its `checkIds` and `practiceIds` carries `bookRef` and
//   an `explain` (a lesson listed in content/legacy-lessons.json is asked for
//   it here too, since this section is new work);
// - no `bookRef` appears twice in a lesson, so one book exercise is never
//   reproduced twice.

export function lintBookPractice(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "book-practice");
  const { lesson } = input;
  const last = lesson.sections.length - 1;
  const marked = lesson.sections.flatMap((section, i) =>
    section.bookPractice ? [i] : [],
  );
  marked.forEach((i, n) => {
    const at = ["sections", i, "bookPractice"];
    if (lesson.kind === "review") {
      report(
        at,
        `A review lesson marks each exercise with bookRef; drop bookPractice${learned("LL-23")}`,
      );
    } else if (n > 0) {
      report(
        at,
        `A lesson has at most one bookPractice section; merge it into the first${learned("LL-23")}`,
      );
    }
    if (i !== last) {
      report(
        at,
        `The bookPractice section must be the last section of the lesson${learned("LL-23")}`,
      );
    }
  });

  for (const i of marked) {
    const section = lesson.sections[i];
    if (!section) continue;
    for (const id of [...section.checkIds, ...section.practiceIds]) {
      const index = lesson.exercises.findIndex((e) => e.id === id);
      const exercise = lesson.exercises[index];
      if (!exercise) continue;
      if (exercise.bookRef === undefined) {
        report(
          ["exercises", index, "bookRef"],
          `Exercise "${id}" is in a bookPractice section and needs bookRef (e.g. "SBT 3.12a"); an exercise in the lesson's own words does not belong here${learned("LL-23")}`,
        );
      }
      if (
        exercise.explain === undefined &&
        input.legacy !== undefined &&
        !input.fixture
      ) {
        report(
          ["exercises", index, "explain"],
          `Exercise "${id}" is in a bookPractice section and needs explain, even in a lesson listed in legacy-lessons.json`,
        );
      }
    }
  }

  const firstIndex = new Map<string, number>();
  lesson.exercises.forEach((exercise, i) => {
    const ref = exercise.bookRef?.trim().toLocaleLowerCase("vi");
    if (ref === undefined) return;
    const earlier = firstIndex.get(ref);
    if (earlier === undefined) {
      firstIndex.set(ref, i);
      return;
    }
    report(
      ["exercises", i, "bookRef"],
      `bookRef "${exercise.bookRef}" repeats exercise ${earlier}; reproduce each book exercise once${learned("LL-23")}`,
    );
  });
  return findings;
}
