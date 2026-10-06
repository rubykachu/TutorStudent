"use client";

import { useEffect, useId, useRef, useState } from "react";
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

// How long one fold or unfold takes.
export const FOLD_MS = 700;
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

// The fold of a picture where the child chooses the line. One line is folded
// at a time, and every fold starts from the whole shape: tapping the folded
// line again opens the shape, and tapping another line first opens the shape,
// then folds it along the new line. `line` is the line the drawing folds
// along (null: the shape lies open), `t` how far it is folded, `target` the
// line the child last chose (null after opening). With reduced motion every
// change is instant.
export function useLineFold() {
  const reduced = usePrefersReducedMotion();
  const [line, setLine] = useState<number | null>(null);
  const [folded, setFolded] = useState(false);
  const [target, setTarget] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const frames = useRef<number[]>([]);

  function clear() {
    for (const id of timers.current) clearTimeout(id);
    for (const id of frames.current) cancelAnimationFrame(id);
    timers.current = [];
    frames.current = [];
  }
  // Nothing pending may fire once the picture is gone.
  useEffect(
    () => () => {
      for (const id of timers.current) clearTimeout(id);
      for (const id of frames.current) cancelAnimationFrame(id);
    },
    [],
  );

  function after(ms: number, run: () => void) {
    timers.current.push(window.setTimeout(run, ms));
  }
  // Folds along `i` from the open shape: the open drawing is painted once
  // before the fold starts, so the turn is animated from the whole shape.
  function foldAlong(i: number) {
    setLine(i);
    setFolded(false);
    frames.current.push(
      requestAnimationFrame(() =>
        frames.current.push(requestAnimationFrame(() => setFolded(true))),
      ),
    );
  }

  function open() {
    clear();
    setTarget(null);
    setFolded(false);
    if (reduced) setLine(null);
    else after(FOLD_MS, () => setLine(null));
  }

  function tap(i: number) {
    if (line === i && target === i && (folded || reduced)) {
      open();
      return;
    }
    clear();
    setTarget(i);
    if (reduced) {
      setLine(i);
      setFolded(true);
    } else if (line === null) {
      foldAlong(i);
    } else if (line === i) {
      // Still opening along this line: fold it back.
      setFolded(true);
    } else {
      setFolded(false);
      after(FOLD_MS, () => foldAlong(i));
    }
  }

  return {
    line,
    t: folded ? 1 : 0,
    target,
    // The chosen line is folded (or folding) and nothing else is pending.
    settled: target !== null && line === target && folded,
    reduced,
    tap,
    open,
  };
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

// A sheet of paper as it lies folded: the half that stays, with the sheet's
// edge drawn solid and the cut drawn dashed, as in the workbook.
export function FixedHalf({
  strokes,
  axis,
}: {
  strokes: readonly ShapeStroke[];
  axis: Line;
}) {
  const uid = useId().replaceAll(":", "");
  const side = movingSide(axis);
  return (
    <g {...decorative}>
      <defs>
        <clipPath id={`${uid}-half`}>
          <polygon points={halfPlane(axis, side === 1 ? -1 : 1)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-half)`}>
        <Strokes strokes={strokes.filter((s) => !s.fill)} fillClass="none" />
        <Strokes strokes={strokes.filter((s) => s.fill)} dashed />
      </g>
    </g>
  );
}
