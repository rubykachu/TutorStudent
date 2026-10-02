import type { Pt } from "./figure-spec";

// Pure geometry of the pictures: points on a circle, distances, where two
// compass arcs meet. Screen coordinates: x to the right, y downwards, angles
// in degrees measured clockwise from the right.

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function polar(cx: number, cy: number, r: number, deg: number): Pt {
  return [cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))];
}

// The corners of a regular polygon, clockwise on the screen, the first one at
// `startDeg` (-90 puts it straight above the centre).
export function regularPoints(
  n: number,
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
): Pt[] {
  return Array.from({ length: n }, (_, i) =>
    polar(cx, cy, r, startDeg + (360 * i) / n),
  );
}

// Names the corners of a polygon: names[i] belongs to points[i].
export function named(
  names: readonly string[],
  points: readonly Pt[],
): Record<string, Pt> {
  return Object.fromEntries(names.map((name, i) => [name, points[i] as Pt]));
}

export function dist(a: Pt, b: Pt): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// Direction from `from` to `to`, in degrees on the screen.
export function directionDeg(from: Pt, to: Pt): number {
  return toDeg(Math.atan2(to[1] - from[1], to[0] - from[0]));
}

// Unit vector from `from` towards `to`.
export function unit(from: Pt, to: Pt): Pt {
  const length = dist(from, to) || 1;
  return [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
}

// The two points at distance r1 from c1 and r2 from c2, upper one first;
// undefined when the circles do not meet.
export function meetingPoints(
  c1: Pt,
  r1: number,
  c2: Pt,
  r2: number,
): [Pt, Pt] | undefined {
  const d = dist(c1, c2);
  if (d === 0 || d > r1 + r2 || d < Math.abs(r1 - r2)) return undefined;
  const along = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(r1 * r1 - along * along, 0));
  const [ux, uy] = unit(c1, c2);
  const base: Pt = [c1[0] + ux * along, c1[1] + uy * along];
  const one: Pt = [base[0] - uy * height, base[1] + ux * height];
  const two: Pt = [base[0] + uy * height, base[1] - ux * height];
  return one[1] <= two[1] ? [one, two] : [two, one];
}

// Where the lines through p1-p2 and through p3-p4 cross; undefined when they
// are parallel.
export function lineIntersection(
  p1: Pt,
  p2: Pt,
  p3: Pt,
  p4: Pt,
): Pt | undefined {
  const d =
    (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  if (Math.abs(d) < 1e-9) return undefined;
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [
    (a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d,
    (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d,
  ];
}
