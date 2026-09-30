"use client";

import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { ManipulateInput } from "@/exercises/input";
import type { ManipulateExercise } from "@/schema/content";
import { findVisual } from "@/visuals/registry";
import { RegistryVisual } from "@/visuals/registry-visual";

export type ManipulateAnswerProps = {
  exercise: ManipulateExercise;
  slot: AnswerSlotProps<ManipulateInput>;
};

// The interactive visual is the whole answer area. Whether its state is right
// is shown only by the frame after "Kiểm tra", never live while the child
// works. `content:check` makes sure a revealed answer always has something to
// show: a solution visual in the frame or a solved state here.
export function ManipulateAnswer({ exercise, slot }: ManipulateAnswerProps) {
  const { onChange, disabled, reveal } = slot;
  const solve = findVisual(exercise.visualId)?.solutions?.[
    exercise.validatorId
  ];
  const shownState = reveal && solve ? solve(exercise.params) : undefined;
  return (
    <div
      className="flex w-full justify-center"
      data-reveal={shownState ? true : undefined}
    >
      <RegistryVisual
        id={exercise.visualId}
        params={exercise.params}
        shownState={shownState}
        disabled={disabled}
        onStateChange={(state) => onChange({ type: "manipulate", state })}
      />
    </div>
  );
}
