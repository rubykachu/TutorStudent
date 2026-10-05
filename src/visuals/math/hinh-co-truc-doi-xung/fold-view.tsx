"use client";

import { useEffect, useId, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { Strokes } from "./draw";
import { angleDeg, type Line, type Pt } from "./geometry";
import type { ShapeStroke } from "./shapes";

// A drawing folded along a line: one half stays, the other half turns over
// the line and lands on the first. The halves are drawn in two colours, so a
// fold that fits shows one drawing and a fold that does not fit shows pieces
// sticking out. `t` is how far the fold has gone: 0 open, 1 folded.

const FOLD_MS = 700;
const BIG = 600;

const FIXED_FILL = CONCEPT_CLASSES.sky.fill;
const MOVING_FILL = CONCEPT_CLASSES.violet.fill;
const MOVING_LINE = CONCEPT_CLASSES.violet.stroke;

function direction(axis: Line): Pt {
  const dx = axis.q[0] - axis.p[0];
  const dy = axis.q[1] - axis.p[1];
  const length = Math.hypot(dx, dy);
  return [dx / length, dy / length];
}

// The side that turns over: the lower or the right one, so a vertical line
// folds its right half to the left and a horizontal line its lower half up.
export function movingSide(axis: Line): 1 | -1 {
  const [ux, uy] = direction(axis);
  const normal: Pt = [-uy, ux];
  const score = (n: Pt) => n[0] + n[1] + n[1] * 1e-3;
  return score(normal) > score([-normal[0], -normal[1]]) ? 1 : -1;
}

// A big polygon covering one side of the line.
function halfPlane(axis: Line, side: 1 | -1): string {
  const [ux, uy] = direction(axis);
  const [nx, ny] = [-uy * side, ux * side];
  const [px, py] = axis.p;
  const corners: Pt[] = [
    [px - ux * BIG, py - uy * BIG],
    [px + ux * BIG, py + uy * BIG],
    [px + ux * BIG + nx * BIG, py + uy * BIG + ny * BIG],
    [px - ux * BIG + nx * BIG, py - uy * BIG + ny * BIG],
  ];
  return corners.map(([x, y]) => `${x},${y}`).join(" ");
}

// How far the fold has gone, moving from 0 to `target` after the line
// changes (instantly with reduced motion).
export function useFold(target: number, key: string) {
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState(reduced ? target : 0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` restarts the fold when another line is chosen
  useEffect(() => {
    if (reduced) {
      setT(target);
      return;
    }
    setT(0);
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setT(target)),
    );
    return () => cancelAnimationFrame(frame);
  }, [reduced, target, key]);
  return { t: reduced ? target : t, reduced };
}

export function FoldGroup({
  strokes,
  axis,
  t,
  smoothly,
  details = true,
}: {
  strokes: readonly ShapeStroke[];
  axis: Line;
  t: number;
  // The turn is animated (a CSS transition on the moving half).
  smoothly: boolean;
  details?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  const side = movingSide(axis);
  const [px, py] = axis.p;
  const theta = angleDeg(axis);
  const scale = 1 - 2 * t;
  const transform = `translate(${px}px, ${py}px) rotate(${theta}deg) scaleY(${scale}) rotate(${-theta}deg) translate(${-px}px, ${-py}px)`;
  return (
    <g {...decorative}>
      <defs>
        <clipPath id={`${uid}-fixed`}>
          <polygon points={halfPlane(axis, side === 1 ? -1 : 1)} />
        </clipPath>
        <clipPath id={`${uid}-moving`}>
          <polygon points={halfPlane(axis, side)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-fixed)`}>
        <Strokes strokes={strokes} fillClass={FIXED_FILL} details={details} />
      </g>
      <g
        style={{
          transform,
          transformOrigin: "0 0",
          transition: smoothly ? `transform ${FOLD_MS}ms ease-in-out` : "none",
        }}
      >
        <g clipPath={`url(#${uid}-moving)`}>
          {t === 0 ? (
            <Strokes strokes={strokes} details={details} />
          ) : (
            <Strokes
              strokes={strokes}
              lineClass={MOVING_LINE}
              fillClass={MOVING_FILL}
              details={details}
              dashed
            />
          )}
        </g>
      </g>
    </g>
  );
}
