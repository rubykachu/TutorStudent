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
// - the section lists `checkIds` then `practiceIds`; each listed exercise is
//   either a book exercise (`bookRef`) or a lead-in step (`leadsTo`, no
//   `bookRef`, written in the lesson's own words);
// - every book exercise carries `explain` (a lesson listed in
//   content/legacy-lessons.json is asked for it here too, since this section
//   is new work);
// - a lead-in names the next book exercise of the same section after it,
//   and a book exercise has at most MAX_LEAD_INS lead-ins;
// - no `bookRef` appears twice in a lesson, so one book exercise is never
//   reproduced twice.

const MAX_LEAD_INS = 2;

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

  const exerciseIndex = (id: string) =>
    lesson.exercises.findIndex((e) => e.id === id);
  const listed = new Set<string>();
  for (const i of marked) {
    const section = lesson.sections[i];
    if (!section) continue;
    const ids = [...section.checkIds, ...section.practiceIds];
    ids.forEach((id) => {
      listed.add(id);
    });
    const leadIns = new Map<string, number>();
    ids.forEach((id, position) => {
      const index = exerciseIndex(id);
      const exercise = lesson.exercises[index];
      if (!exercise) return;
      if (exercise.bookRef !== undefined) {
        if (exercise.leadsTo !== undefined) {
          report(
            ["exercises", index, "leadsTo"],
            `Exercise "${id}" has bookRef, so it is a book exercise and cannot lead to another${learned("LL-23")}`,
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
        return;
      }
      if (exercise.leadsTo === undefined) {
        report(
          ["exercises", index, "bookRef"],
          `Exercise "${id}" is in a bookPractice section and needs bookRef (e.g. "SBT 3.12a"), or leadsTo when it is a lead-in step to a book exercise${learned("LL-23")}`,
        );
        return;
      }
      const targetPosition = ids.indexOf(exercise.leadsTo);
      const target = lesson.exercises[exerciseIndex(exercise.leadsTo)];
      const at = ["exercises", index, "leadsTo"];
      if (targetPosition < 0 || target?.bookRef === undefined) {
        report(
          at,
          `leadsTo "${exercise.leadsTo}" must be a book exercise (with bookRef) listed in the same bookPractice section${learned("LL-23")}`,
        );
        return;
      }
      const next = ids
        .slice(position + 1)
        .find((other) => lesson.exercises[exerciseIndex(other)]?.bookRef);
      if (targetPosition < position) {
        report(
          at,
          `Lead-in "${id}" must come before the book exercise "${exercise.leadsTo}" it leads to in checkIds/practiceIds${learned("LL-23")}`,
        );
      } else if (next !== exercise.leadsTo) {
        report(
          at,
          `Lead-in "${id}" must lead to the next book exercise after it ("${next}"), not "${exercise.leadsTo}"${learned("LL-23")}`,
        );
      }
      const count = (leadIns.get(exercise.leadsTo) ?? 0) + 1;
      leadIns.set(exercise.leadsTo, count);
      if (count > MAX_LEAD_INS) {
        report(
          at,
          `Book exercise "${exercise.leadsTo}" has more than ${MAX_LEAD_INS} lead-in steps; keep the guidance short${learned("LL-23")}`,
        );
      }
    });
  }

  lesson.exercises.forEach((exercise, i) => {
    if (exercise.leadsTo === undefined || listed.has(exercise.id)) return;
    report(
      ["exercises", i, "leadsTo"],
      `leadsTo belongs to a lead-in step listed in a bookPractice section's checkIds or practiceIds${learned("LL-23")}`,
    );
  });

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
