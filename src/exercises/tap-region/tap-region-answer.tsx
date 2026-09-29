"use client";

import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { TapRegionInput } from "@/exercises/input";
import { toggleId } from "@/exercises/selection";
import type { TapRegionExercise } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";
import { RegionProvider } from "@/visuals/shared/region";

export type TapRegionAnswerProps = {
  exercise: TapRegionExercise;
  slot: AnswerSlotProps<TapRegionInput>;
};

const NONE: ReadonlySet<string> = new Set();

// The exercise's visual with its declared regions turned into toggles.
export function TapRegionAnswer({ exercise, slot }: TapRegionAnswerProps) {
  const { value, onChange, disabled, highlight, reveal } = slot;
  const selected = value?.selected ?? [];
  return (
    <div
      className="flex w-full justify-center"
      data-reveal={reveal || undefined}
    >
      <RegionProvider
        value={{
          selected: new Set(reveal ? exercise.answer : selected),
          revealed: reveal ? new Set(exercise.answer) : NONE,
          marks: highlight,
          disabled,
          onToggle: (id) => {
            const next = toggleId(selected, id);
            onChange(
              next.length > 0 ? { type: "tapRegion", selected: next } : null,
            );
          },
        }}
      >
        <RegistryVisual id={exercise.visualId} />
      </RegionProvider>
    </div>
  );
}
