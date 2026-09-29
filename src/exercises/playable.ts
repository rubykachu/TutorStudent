import type { AnyExercise } from "@/content";
import { hasAnswerComponent } from "@/exercises/answers";
import type { OpenEndedExercise } from "@/schema/content";

// Whether the app can show this exercise now: a basic type with an answer UI,
// or an open-ended task (its steps without UI are left out, see below).
// Content may reference types whose UI is still being built; those are
// skipped rather than breaking a lesson.
export function isPlayable(exercise: AnyExercise): boolean {
  return exercise.type === "openEnded" || hasAnswerComponent(exercise.type);
}

export function playableOpenEnded(
  exercise: OpenEndedExercise,
): OpenEndedExercise {
  return {
    ...exercise,
    steps: exercise.steps.filter((step) => hasAnswerComponent(step.type)),
  };
}
