import type { Issue } from "./check";

// A book lesson too long for the learner is split across several lessons of
// the app, the parts of one book lesson. The parts share `subject`, `series`,
// `number` and `chapter` and each carries `part` (1, 2, ...). This checks the
// set as a whole, which no single lesson's lint can see:
// - a book lesson with several lessons gives every one of them its `part`, the
//   parts run 1 to n without a gap, and `order` is `number + (part - 1) / 10`
//   so the parts stay together between the neighbouring book lessons;
// - a lesson with `part` has a `number`, and a sibling for the other parts;
// - every `bookRef` is reproduced by exactly one part, so no workbook
//   exercise is asked twice and none is left out by the split.

export const PART_ORDER_STEP = 0.1;

// What the check reads of a lesson; `CheckedLesson` has all of it.
export type SplitCandidate = {
  file: string;
  fixture: boolean;
  lesson: {
    id: string;
    subject: string;
    series: string;
    kind?: string | undefined;
    number?: number | undefined;
    part?: number | undefined;
    order: number;
    chapter?: { numeral: string } | undefined;
    exercises: readonly { bookRef?: string | undefined }[];
  };
};

export type SplitGroup<T extends SplitCandidate = SplitCandidate> = {
  subject: string;
  series: string;
  number: number;
  // In `part` order (lessons without `part` last, in `order`).
  lessons: T[];
};

// The lessons that share one number of the same book (a review lesson has no
// number, so it is never part of a group). A group of one lesson is a lesson
// that is not split.
export function lessonGroups<T extends SplitCandidate>(
  candidates: readonly T[],
): SplitGroup<T>[] {
  const groups = new Map<string, SplitGroup<T>>();
  for (const candidate of candidates) {
    const { lesson } = candidate;
    if (candidate.fixture || lesson.kind !== undefined) continue;
    if (lesson.number === undefined) continue;
    const key = `${lesson.subject}/${lesson.series}/${lesson.number}`;
    const group = groups.get(key) ?? {
      subject: lesson.subject,
      series: lesson.series,
      number: lesson.number,
      lessons: [],
    };
    group.lessons.push(candidate);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    group.lessons.sort(
      (a, b) =>
        (a.lesson.part ?? Number.POSITIVE_INFINITY) -
          (b.lesson.part ?? Number.POSITIVE_INFINITY) ||
        a.lesson.order - b.lesson.order,
    );
  }
  return [...groups.values()];
}

// The groups of lessons that really are split: more than one lesson.
export function splitGroups<T extends SplitCandidate>(
  candidates: readonly T[],
): SplitGroup<T>[] {
  return lessonGroups(candidates).filter((group) => group.lessons.length > 1);
}

// Book exercises of the parts of a group, in part order, each with the lesson
// that holds it.
export function groupBookRefs(
  group: SplitGroup,
): { ref: string; lessonId: string }[] {
  return group.lessons.flatMap(({ lesson }) =>
    lesson.exercises.flatMap((exercise) =>
      exercise.bookRef === undefined
        ? []
        : [{ ref: exercise.bookRef, lessonId: lesson.id }],
    ),
  );
}

function refKey(ref: string): string {
  return ref.trim().replace(/\s+/g, " ").toLocaleLowerCase("vi");
}

const ORDER_TOLERANCE = 1e-9;

export function checkSplitLessons(
  candidates: readonly SplitCandidate[],
): Issue[] {
  const issues: Issue[] = [];
  const report = (file: string, path: Issue["path"], message: string) =>
    issues.push({ severity: "error", file, path, message, rule: "split" });

  for (const candidate of candidates) {
    const { lesson } = candidate;
    if (candidate.fixture) continue;
    if (lesson.part !== undefined && lesson.number === undefined) {
      report(
        candidate.file,
        ["part"],
        "A lesson with part is one share of a book lesson, so it needs the book's number",
      );
    }
    if (lesson.part !== undefined && lesson.kind !== undefined) {
      report(
        candidate.file,
        ["part"],
        `A ${lesson.kind} lesson is never split into parts`,
      );
    }
  }

  for (const group of lessonGroups(candidates)) {
    const label = `Bài ${group.number} of ${group.subject}/${group.series}`;
    const { lessons } = group;
    if (lessons.length === 1) {
      const [only] = lessons;
      if (only && only.lesson.part !== undefined) {
        report(
          only.file,
          ["part"],
          `${label} has part ${only.lesson.part} but no other lesson holds the rest; drop part or add the other parts`,
        );
      }
      continue;
    }
    lessons.forEach(({ file, lesson }, i) => {
      if (lesson.part === undefined) {
        report(
          file,
          ["part"],
          `${label} is held by ${lessons.length} lessons; give each its part (1 to ${lessons.length})`,
        );
        return;
      }
      if (lesson.part !== i + 1) {
        report(
          file,
          ["part"],
          `${label} must have parts 1 to ${lessons.length} once each; this lesson has part ${lesson.part}`,
        );
        return;
      }
      const order = group.number + (lesson.part - 1) * PART_ORDER_STEP;
      if (Math.abs(lesson.order - order) > ORDER_TOLERANCE) {
        report(
          file,
          ["order"],
          `Part ${lesson.part} of ${label} must have order ${order} (number + (part - 1) / 10), not ${lesson.order}`,
        );
      }
    });
    const first = lessons[0];
    for (const { file, lesson } of lessons.slice(1)) {
      if (first && lesson.chapter?.numeral !== first.lesson.chapter?.numeral) {
        report(
          file,
          ["chapter"],
          `Every part of ${label} is in the same chapter as "${first.lesson.id}"`,
        );
      }
    }

    const holder = new Map<string, string>();
    for (const { file, lesson } of lessons) {
      lesson.exercises.forEach((exercise, i) => {
        if (exercise.bookRef === undefined) return;
        const key = refKey(exercise.bookRef);
        const earlier = holder.get(key);
        if (earlier === undefined) {
          holder.set(key, lesson.id);
        } else if (earlier !== lesson.id) {
          report(
            file,
            ["exercises", i, "bookRef"],
            `bookRef "${exercise.bookRef}" is also reproduced by "${earlier}"; a book exercise belongs to one part of ${label}`,
          );
        }
      });
    }
  }
  return issues;
}
