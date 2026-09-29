import type { ComponentType, ReactNode } from "react";
import { ChoiceAnswer } from "@/exercises/choice/choice-answer";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import { FillBlankAnswer } from "@/exercises/fill-blank/fill-blank-answer";
import type { InputFor } from "@/exercises/input";
import { ManipulateAnswer } from "@/exercises/manipulate";
import { MatchAnswer } from "@/exercises/match";
import { NumericAnswer } from "@/exercises/numeric/numeric-answer";
import type { StepRenderer } from "@/exercises/open-ended/open-ended-runner";
import { OrderAnswer } from "@/exercises/order/order-answer";
import { TapRegionAnswer } from "@/exercises/tap-region";
import { TapTextAnswer } from "@/exercises/tap-text";
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
// answer area. Every type needs one, so adding a type to the schema fails
// type-checking here until it has a UI.
const ANSWER_COMPONENTS: { [T in BasicExerciseType]: AnswerComponent<T> } = {
  choice: ChoiceAnswer,
  numeric: NumericAnswer,
  match: MatchAnswer,
  order: OrderAnswer,
  fillBlank: FillBlankAnswer,
  tapText: TapTextAnswer,
  tapRegion: TapRegionAnswer,
  manipulate: ManipulateAnswer,
};

// Draws the answer area of any basic exercise inside `ExerciseFrame`:
//   <ExerciseFrame exercise={ex}>{(slot) => renderAnswer(ex, slot)}</ExerciseFrame>
export function renderAnswer<E extends BasicExercise>(
  exercise: E,
  slot: AnswerSlotProps<InputFor<E["type"]>>,
): ReactNode {
  // TypeScript cannot tie the looked-up entry to E, only to the union of
  // all types; the key is exactly `exercise.type`, so this is sound.
  const Answer = ANSWER_COMPONENTS[exercise.type] as unknown as ComponentType<{
    exercise: E;
    slot: AnswerSlotProps<InputFor<E["type"]>>;
  }>;
  return <Answer exercise={exercise} slot={slot} />;
}

// Open-ended steps hand over a slot typed with the whole input union; the
// frame only ever feeds a step inputs of that step's own type.
export const renderStep: StepRenderer = (exercise, slot) =>
  renderAnswer(
    exercise,
    slot as AnswerSlotProps<InputFor<typeof exercise.type>>,
  );
