"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Figure } from "@/visuals/shared/plane/figure";
import { hexTriangles } from "./figures";

// Six equilateral triangles ghép (put together) round one point: the child
// adds them one at a time with a stepper and sees the hexagon appear. State
// is { n }, the triangles placed. On a lesson screen with `goal` it is a
// guided "cùng làm" step: "Tiếp" waits until all of them are placed.

export type AssembleSpec = {
  label: string;
  // Lesson screen only: how many triangles to place before "Tiếp" works.
  goal?: number;
  done?: string;
};

const PIECES = 6;

export function Assemble({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: AssembleSpec }) {
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const n = state.n ?? 0;
  const locked = disabled || shownState !== undefined;
  const guided = isLessonScreen(params) && spec.goal !== undefined;
  const met = guided && n === spec.goal;

  function set(value: number) {
    const next = { n: value };
    setOwn(next);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => set(spec.goal ?? PIECES),
  });

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-sm">
        <Figure
          spec={hexTriangles(spec.label, {
            w: 320,
            h: 240,
            cx: 160,
            cy: 120,
            r: 100,
            count: n,
          })}
        />
      </div>
      <NumberStepper
        label="Số miếng tam giác đã ghép"
        value={n}
        min={0}
        max={PIECES}
        color="teal"
        disabled={locked}
        stateKey="n"
        onChange={set}
      />
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ghép ${n}/${PIECES} miếng`}
      </p>
      {met && !shown && (
        <DoneLine>
          {spec.done ?? "Sáu miếng ghép thành hình lục giác đều."}
        </DoneLine>
      )}
      {met && shown && (
        <ShownLine>
          {spec.done ?? "Sáu miếng ghép thành hình lục giác đều."}
        </ShownLine>
      )}
    </div>
  );
}
