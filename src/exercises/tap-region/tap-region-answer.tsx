"use client";

import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
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

// Regions draw every mark as a ring around the shape, never as a fill that
// could pass for a selection: a region the last check found wrong (and let
// go) gets the plain ring, and an authored hint on the same region wins.
function regionMarks(
  highlight: ReadonlyMap<string, HighlightSpec>,
  wrong: ReadonlySet<string>,
): ReadonlyMap<string, HighlightSpec> {
  if (wrong.size === 0) return highlight;
  const marks = new Map<string, HighlightSpec>();
  for (const id of wrong) marks.set(id, { color: "highlight", strong: false });
  for (const [id, spec] of highlight) marks.set(id, spec);
  return marks;
}

// The exercise's visual with its declared regions turned into toggles.
export function TapRegionAnswer({ exercise, slot }: TapRegionAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal } = slot;
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
          marks: regionMarks(highlight, wrong),
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
