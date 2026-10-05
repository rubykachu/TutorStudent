import type { VisualState } from "@/visuals/registry";
import type { Pt } from "./geometry";
import { type LatticeAxis, mirrorPoint, onAxis, sideOfAxis } from "./lattice";

// What a "vẽ thêm cho đối xứng" board is made of: a half of a drawing on a
// lattice and the axis it must be mirrored in. The child taps the lattice
// points where the mirror image of each corner belongs; the pieces of the
// mirror image appear once their corners are placed. Pure data and logic.

export type MirrorPart =
  // A chain of straight pieces through lattice points.
  | { kind: "line"; pts: readonly Pt[]; closed?: boolean }
  // A circle round a lattice point.
  | { kind: "ring"; c: Pt; r: number }
  // A filled dot on a lattice point.
  | { kind: "dot"; c: Pt }
  // A piece of a circle (angles in degrees on the screen, 0 to the right, 90
  // down) with a lattice point on it, the one whose mirror image the child
  // places.
  | { kind: "arc"; c: Pt; r: number; from: number; to: number; anchor: Pt };

export type MirrorSpec = {
  label: string;
  // Lattice points: columns x = 0 … cols - 1, rows y = 0 … rows - 1.
  cols: number;
  rows: number;
  axis: LatticeAxis;
  parts: readonly MirrorPart[];
  // Names written beside lattice points of the given half; the mirror image
  // of a name gets a prime (A becomes A′) once it is placed.
  names?: Readonly<Record<string, Pt>>;
  // Where a name stands beside its point, in lattice units (default up and
  // to the left).
  nameShift?: Readonly<Record<string, Pt>>;
  // Writes 1, 2, 3 ... above the columns or beside the rows (counting from 1),
  // for a question that names a column or a row.
  numbering?: "cols" | "rows";
  // Lesson screen only: the closing line once the child has placed every
  // point. Without it the board is free (an exercise).
  done?: string;
};

export function anchorsOf(part: MirrorPart): Pt[] {
  switch (part.kind) {
    case "line":
      return [...part.pts];
    case "ring":
    case "dot":
      return [part.c];
    case "arc":
      return [part.anchor];
  }
}

export const pointKey = (spec: MirrorSpec, [x, y]: Pt) =>
  `p${y * spec.cols + x}`;

const sameKey = (a: Pt, b: Pt) => a[0] === b[0] && a[1] === b[1];

// The points the child has to place: the mirror image of every corner of the
// given half that is not on the axis already, each once.
export function requiredPoints(spec: MirrorSpec): Pt[] {
  const found: Pt[] = [];
  for (const part of spec.parts) {
    for (const anchor of anchorsOf(part)) {
      if (onAxis(anchor, spec.axis)) continue;
      const image = mirrorPoint(anchor, spec.axis);
      if (!found.some((p) => sameKey(p, image))) found.push(image);
    }
  }
  return found;
}

// The state with exactly the required points placed.
export function solvedMirror(spec: MirrorSpec): VisualState {
  return Object.fromEntries(
    requiredPoints(spec).map((p) => [pointKey(spec, p), 1]),
  );
}

// Right when the placed points are exactly the required ones.
export function isMirrored(spec: MirrorSpec, state: VisualState): boolean {
  const want = new Set(requiredPoints(spec).map((p) => pointKey(spec, p)));
  const placed = Object.entries(state).filter(([, v]) => v === 1);
  return placed.length === want.size && placed.every(([key]) => want.has(key));
}

export function isPlaced(
  spec: MirrorSpec,
  state: VisualState,
  point: Pt,
): boolean {
  return state[pointKey(spec, point)] === 1;
}

// A piece of the mirror image is drawn once the mirror images of all its
// corners that are off the axis are placed.
export function isPartDrawn(
  spec: MirrorSpec,
  state: VisualState,
  part: MirrorPart,
): boolean {
  return anchorsOf(part)
    .filter((anchor) => !onAxis(anchor, spec.axis))
    .every((anchor) => isPlaced(spec, state, mirrorPoint(anchor, spec.axis)));
}

// The lattice points that can be tapped: those on the far side of the axis
// from the given half, off the axis.
export function tappablePoints(spec: MirrorSpec): Pt[] {
  const sides = spec.parts
    .flatMap(anchorsOf)
    .map((p) => sideOfAxis(p, spec.axis))
    .filter((s) => s !== 0);
  const given = sides.reduce((sum, s) => sum + s, 0) >= 0 ? 1 : -1;
  const points: Pt[] = [];
  for (let y = 0; y < spec.rows; y++) {
    for (let x = 0; x < spec.cols; x++) {
      const side = sideOfAxis([x, y], spec.axis);
      if (side !== 0 && side !== given) points.push([x, y]);
    }
  }
  return points;
}

// Placed points that are not a mirror image of any corner.
export function wrongPoints(spec: MirrorSpec, state: VisualState): Pt[] {
  const want = new Set(requiredPoints(spec).map((p) => pointKey(spec, p)));
  return tappablePoints(spec).filter(
    (p) => isPlaced(spec, state, p) && !want.has(pointKey(spec, p)),
  );
}

// ---------------------------------------------------------------------------
// Mirror image of a piece, as real coordinates (for drawing).

export function reflectReal([x, y]: Pt, axis: LatticeAxis): Pt {
  return mirrorPoint([x, y], axis);
}

export function arcPoints(
  c: Pt,
  r: number,
  from: number,
  to: number,
  steps = 24,
): Pt[] {
  return Array.from({ length: steps + 1 }, (_, i): Pt => {
    const rad = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [c[0] + r * Math.cos(rad), c[1] + r * Math.sin(rad)];
  });
}
