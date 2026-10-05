import type { VisualState } from "@/visuals/registry";
import { isAxisOf, type Line, type Pt } from "./geometry";
import { FRAME, SHAPES, type ShapeId } from "./shapes";

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
  // The end of the line its name stands at, chosen so that no two names
  // crowd each other (lines side by side, lines meeting at the middle).
  end: "p" | "q";
};

const LETTERS = "abcdefghij";

// The radius of a name badge, and the room it keeps from the frame's edge.
export const BADGE_RADIUS = 14;

// Where a name stands at the end of `axis`: kept inside the frame, so a line
// that ends at its edge keeps its name.
export function badgeSpot(axis: Line, end: "p" | "q", scale = 1): Pt {
  const radius = BADGE_RADIUS * scale;
  const limit = FRAME - radius - 2;
  const [x, y] = axis[end];
  return [
    Math.max(radius + 2, Math.min(limit, x)),
    Math.max(radius + 2, Math.min(limit, y)),
  ];
}

// The end of each line its name goes to: the end farthest from the names
// already placed (the second of two near-parallel lines goes to the other
// end; of lines meeting in the middle, each takes a free end).
function chooseEnds(axes: readonly Line[]): ("p" | "q")[] {
  const placed: Pt[] = [];
  return axes.map((axis) => {
    const gap = (end: "p" | "q") =>
      Math.min(
        Infinity,
        ...placed.map((other) => {
          const spot = badgeSpot(axis, end);
          return Math.hypot(spot[0] - other[0], spot[1] - other[1]);
        }),
      );
    const end = gap("p") > gap("q") ? "p" : "q";
    placed.push(badgeSpot(axis, end));
    return end;
  });
}

export function candidatesOf(
  shape: ShapeId,
  refs: readonly LineRef[],
): Candidate[] {
  const def = SHAPES[shape];
  const axes = refs.map((ref) => {
    const axis = (ref.src === "axis" ? def.axes : def.fakes)[ref.i];
    if (!axis) throw new Error(`${shape} has no ${ref.src} ${ref.i}`);
    return axis;
  });
  const ends = chooseEnds(axes);
  return refs.map((ref, n) => ({
    axis: axes[n] as Line,
    isAxis: ref.src === "axis",
    letter: LETTERS[n] ?? String(n),
    end: ends[n] as "p" | "q",
  }));
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
