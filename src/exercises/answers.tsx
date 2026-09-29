import type { ComponentType, ReactNode } from "react";
import { ChoiceAnswer } from "@/exercises/choice/choice-answer";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import { FillBlankAnswer } from "@/exercises/fill-blank/fill-blank-answer";
import type { InputFor } from "@/exercises/input";
import { NumericAnswer } from "@/exercises/numeric/numeric-answer";
import type { StepRenderer } from "@/exercises/open-ended/open-ended-runner";
import { OrderAnswer } from "@/exercises/order/order-answer";
import type { BasicExercise, BasicExerciseType } from "@/schema/content";

type ExerciseOf<T extends BasicExerciseType> = Extract<
  BasicExercise,
  { type: T }
>;

export type AnswerComponent<T extends BasicExerciseType> = ComponentType<{
  exercise: ExerciseOf<T>;
  slot: AnswerSlotProps<InputFor<T>>;
}>;

// The single place an exercise type is tied to the component that draws its
// answer area; a type without an entry has no UI yet.
const ANSWER_COMPONENTS: { [T in BasicExerciseType]?: AnswerComponent<T> } = {
  choice: ChoiceAnswer,
  numeric: NumericAnswer,
  fillBlank: FillBlankAnswer,
  order: OrderAnswer,
};

export function hasAnswerComponent(type: BasicExerciseType): boolean {
  return ANSWER_COMPONENTS[type] !== undefined;
}

// Draws the answer area of any basic exercise inside `ExerciseFrame`:
//   <ExerciseFrame exercise={ex}>{(slot) => renderAnswer(ex, slot)}</ExerciseFrame>
export function renderAnswer<E extends BasicExercise>(
  exercise: E,
  slot: AnswerSlotProps<InputFor<E["type"]>>,
): ReactNode {
  // TypeScript cannot tie the looked-up entry to E, only to the union of
  // all types; the key is exactly `exercise.type`, so this is sound.
  const Answer = ANSWER_COMPONENTS[exercise.type] as
    | ComponentType<{
        exercise: E;
        slot: AnswerSlotProps<InputFor<E["type"]>>;
      }>
    | undefined;
  if (!Answer) {
    throw new Error(`No answer component for "${exercise.type}" exercises`);
  }
  return <Answer exercise={exercise} slot={slot} />;
}

// Open-ended steps hand over a slot typed with the whole input union; the
// frame only ever feeds a step inputs of that step's own type.
export const renderStep: StepRenderer = (exercise, slot) =>
  renderAnswer(
    exercise,
    slot as AnswerSlotProps<InputFor<typeof exercise.type>>,
  );
