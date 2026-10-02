"use client";

import { useState } from "react";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Figure } from "./figure";
import type { FigureSpec } from "./figure-spec";

// Equal pieces put together into one shape: the child adds them one at a time
// with a stepper and sees the shape appear. State is { n }, the pieces
// placed. On a lesson screen with a `goal` it is a guided "cùng làm" step:
// "Tiếp" waits until that many are placed.

export type PieceBoardProps = VisualProps & {
  // The picture with `n` pieces placed.
  figureOf: (n: number) => FigureSpec;
  // How many pieces there are in all.
  total: number;
  // Name of the stepper ("Số miếng tam giác đã ghép") and the progress line.
  pieceName: string;
  color: ConceptColor;
  goal?: number;
  done: string;
};

export function PieceBoard({
  figureOf,
  total,
  pieceName,
  color,
  goal,
  done,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: PieceBoardProps) {
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const n = state.n ?? 0;
  const locked = disabled || shownState !== undefined;
  const guided = isLessonScreen(params) && goal !== undefined;
  const met = guided && n === goal;

  function set(value: number) {
    const next = { n: value };
    setOwn(next);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => set(goal ?? total),
  });

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-sm">
        <Figure spec={figureOf(n)} />
      </div>
      <NumberStepper
        label={pieceName}
        value={n}
        min={0}
        max={total}
        color={color}
        disabled={locked}
        stateKey="n"
        onChange={set}
      />
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ghép ${n}/${total} miếng`}
      </p>
      {met && !shown && <DoneLine>{done}</DoneLine>}
      {met && shown && <ShownLine>{done}</ShownLine>}
    </div>
  );
}
