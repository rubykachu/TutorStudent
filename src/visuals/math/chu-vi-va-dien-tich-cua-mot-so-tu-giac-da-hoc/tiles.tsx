"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { type TilesSpec, tileCells } from "./models";

// Unit squares the child taps one by one to count them; a counted square
// shows its number. State is one key per square, { c0, c1, … }, with 1 =
// counted.

const MAX_CELL = 64;
const SIDE = 20;

function allCounted(total: number): VisualState {
  return Object.fromEntries(
    Array.from({ length: total }, (_, i) => [`c${i}`, 1]),
  );
}

export function Tiles({
  spec,
  onStateChange,
  shownState,
  disabled = false,
  params,
}: VisualProps & { spec: TilesSpec }) {
  const cells = tileCells(spec);
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  // The order the squares were counted in, so each shows its own number.
  const [order, setOrder] = useState<number[]>([]);
  const counted = cells.map((_, i) => state[`c${i}`] === 1);
  const count = counted.filter(Boolean).length;
  const finished = count === cells.length;

  function tap(i: number) {
    const next = { ...own, [`c${i}`]: 1 };
    setOwn(next);
    setOrder([...order, i]);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met: finished,
    guided: isLessonScreen(params),
    reveal: () => {
      const all = allCounted(cells.length);
      setOwn(all);
      setOrder(cells.map((_, i) => i));
      onStateChange?.(all);
    },
  });

  const cell = Math.min(MAX_CELL, Math.floor((320 - 2 * SIDE) / spec.cols));
  const width = spec.cols * cell + 2 * SIDE;
  const height = spec.rows * cell + 2 * SIDE;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md">
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={spec.label}
          className="h-auto max-h-72 w-full"
        >
          {cells.map(([c, r], i) => {
            const done = counted[i];
            const x = SIDE + c * cell;
            const y = SIDE + r * cell;
            return (
              // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
              <g
                // biome-ignore lint/suspicious/noArrayIndexKey: squares never reorder
                key={i}
                role="button"
                tabIndex={locked || done ? -1 : 0}
                aria-label={`Ô vuông số ${i + 1}`}
                aria-pressed={done}
                aria-disabled={locked || undefined}
                className={`outline-none focus-visible:stroke-ring ${locked || done ? "" : "cursor-pointer"}`}
                onClick={() => {
                  if (!locked && !done) tap(i);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  if (!locked && !done) tap(i);
                }}
                {...stateSet(`c${i}`, 1)}
              >
                <rect
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  strokeWidth={2.5}
                  className={`stroke-foreground ${done ? "fill-concept-teal" : "fill-surface"}`}
                  fillOpacity={done ? 0.45 : 1}
                />
                {done && (
                  <text
                    {...decorative}
                    x={x + cell / 2}
                    y={y + cell / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={20}
                    stroke="none"
                    className="fill-foreground font-heading font-bold"
                  >
                    {order.indexOf(i) + 1 || i + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-center text-caption text-muted-foreground">
        {spec.legend}
      </p>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >{`Đã đếm ${count}/${cells.length}`}</p>
      {finished && !shown && <DoneLine>{spec.done}</DoneLine>}
      {finished && shown && <ShownLine>{spec.done}</ShownLine>}
    </div>
  );
}
