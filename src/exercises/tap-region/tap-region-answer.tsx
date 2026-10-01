"use client";

import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { TapRegionInput } from "@/exercises/input";
import { toggleId, wrongPicks } from "@/exercises/selection";
import type { TapRegionExercise } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";
import { type RegionMark, RegionProvider } from "@/visuals/shared/region";

export type TapRegionAnswerProps = {
  exercise: TapRegionExercise;
  slot: AnswerSlotProps<TapRegionInput>;
};

const NONE: ReadonlySet<string> = new Set();

// Regions draw every mark as a ring around the shape, never as a fill that
// could pass for a selection: a chosen region the last check found wrong
// gets the orange dashed ring (in place of its selection ring, and it stays
// chosen), and an authored hint on the same region wins with its
// concept-coloured ring.
function regionMarks(
  highlight: ReadonlyMap<string, HighlightSpec>,
  wrong: ReadonlySet<string>,
): ReadonlyMap<string, RegionMark> {
  const marks = new Map<string, RegionMark>();
  for (const id of wrong) marks.set(id, { tone: "wrong" });
  for (const [id, spec] of highlight) marks.set(id, { tone: "hint", ...spec });
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
          marks: regionMarks(
            highlight,
            reveal ? NONE : wrongPicks(wrong, selected),
          ),
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
