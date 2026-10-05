import type { VisualState } from "@/visuals/registry";
import { isAxisOf, type Line } from "./geometry";
import { SHAPES, type ShapeId } from "./shapes";

// The candidate lines of a shape (its axes and some lines that only look like
// axes) as the child meets them: named a, b, c ... in the order a picture
// lists them, and the state of a picker that marks some of them. Pure, no
// React, so validators and the server-rendered pages read it.

export type LineRef = { src: "axis" | "fake"; i: number };

export type Candidate = {
  axis: Line;
  isAxis: boolean;
  // The name the child reads on the line: a, b, c ...
  letter: string;
};

const LETTERS = "abcdefghij";

export function candidatesOf(
  shape: ShapeId,
  refs: readonly LineRef[],
): Candidate[] {
  const def = SHAPES[shape];
  return refs.map((ref, n) => {
    const axis = (ref.src === "axis" ? def.axes : def.fakes)[ref.i];
    if (!axis) throw new Error(`${shape} has no ${ref.src} ${ref.i}`);
    return {
      axis,
      isAxis: ref.src === "axis",
      letter: LETTERS[n] ?? String(n),
    };
  });
}

// Every line of the shape: its axes first, then the lines that are not.
export function allLines(shape: ShapeId): LineRef[] {
  const def = SHAPES[shape];
  return [
    ...def.axes.map((_, i): LineRef => ({ src: "axis", i })),
    ...def.fakes.map((_, i): LineRef => ({ src: "fake", i })),
  ];
}

export type PickGroup = { shape: ShapeId; lines: readonly LineRef[] };

export type AxisPickerSpec = {
  // Each group is one shape with its candidate lines; the state has one key
  // per line, `g<group>l<line>`.
  groups: readonly PickGroup[];
  // Lesson screen only: closing line once the child has marked exactly the
  // axes. Without it the picker is free (an exercise).
  done?: string;
};

export const pickKey = (group: number, line: number) => `g${group}l${line}`;

// The state that marks exactly the axes among the candidates.
export function axesState(spec: AxisPickerSpec): VisualState {
  return Object.fromEntries(
    spec.groups.flatMap((group, g) =>
      candidatesOf(group.shape, group.lines).flatMap((c, i) =>
        c.isAxis ? [[pickKey(g, i), 1]] : [],
      ),
    ),
  );
}

// Right when the marked lines are exactly the axes.
export function marksAxes(spec: AxisPickerSpec, state: VisualState): boolean {
  return spec.groups.every((group, g) =>
    candidatesOf(group.shape, group.lines).every(
      (c, i) => (state[pickKey(g, i)] === 1) === c.isAxis,
    ),
  );
}

// ---------------------------------------------------------------------------
// Truth of a candidate list, for the catalog check.

export function candidateIsAxis(shape: ShapeId, ref: LineRef): boolean {
  const def = SHAPES[shape];
  const axis = (ref.src === "axis" ? def.axes : def.fakes)[ref.i];
  return axis !== undefined && isAxisOf(def.strokes, axis);
}
