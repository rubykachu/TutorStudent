import type { AnyExercise, LessonIndex } from "@/content";
import type { SectionPosition } from "@/progress/db";
import type { RecapBlock, Section, SectionBlock } from "@/schema/content";

// A section as the ordered list of screens the child goes through.

export type ExerciseContext = "check" | "practice";

export type SectionStep =
  | { kind: "block"; position: SectionPosition; block: SectionBlock }
  | {
      kind: "exercise";
      position: SectionPosition;
      context: ExerciseContext;
      exercise: AnyExercise;
    }
  | { kind: "recap"; position: SectionPosition; recap: RecapBlock };

function exerciseSteps(
  ids: readonly string[],
  context: ExerciseContext,
  index: LessonIndex,
): SectionStep[] {
  // Ids left behind by edited content are skipped; positions count only the
  // exercises that remain.
  const exercises = ids.flatMap((id) => {
    const exercise = index.exerciseById.get(id)?.exercise;
    return exercise ? [exercise] : [];
  });
  return exercises.map((exercise, i) => ({
    kind: "exercise",
    position: { phase: context, index: i },
    context,
    exercise,
  }));
}

// Blocks one at a time (a group is one screen), then the comprehension checks, the practice
// exercises and finally the recap.
export function sectionSteps(
  section: Section,
  index: LessonIndex,
): SectionStep[] {
  return [
    ...section.blocks.map(
      (block, i): SectionStep => ({
        kind: "block",
        position: { phase: "blocks", index: i },
        block,
      }),
    ),
    ...exerciseSteps(section.checkIds, "check", index),
    ...exerciseSteps(section.practiceIds, "practice", index),
    {
      kind: "recap",
      position: { phase: "recap", index: 0 },
      recap: section.recap,
    },
  ];
}

// The step to resume on. When the saved item no longer exists (content was
// edited), the child restarts the phase they were in, or the section.
export function resumeStepIndex(
  steps: readonly SectionStep[],
  position: SectionPosition,
): number {
  const exact = steps.findIndex(
    (s) =>
      s.position.phase === position.phase &&
      s.position.index === position.index,
  );
  if (exact >= 0) return exact;
  const phaseStart = steps.findIndex(
    (s) => s.position.phase === position.phase,
  );
  return Math.max(phaseStart, 0);
}

// The name of each screen's dot: "Lý thuyết 1", "Câu 1" (comprehension checks
// and practice exercises count together) and "Nhớ nhé" for the recap.
export function stepLabels(steps: readonly SectionStep[]): string[] {
  let theory = 0;
  let question = 0;
  return steps.map((step) => {
    if (step.kind === "block") {
      theory += 1;
      return `Lý thuyết ${theory}`;
    }
    if (step.kind === "exercise") {
      question += 1;
      return `Câu ${question}`;
    }
    return "Nhớ nhé";
  });
}
