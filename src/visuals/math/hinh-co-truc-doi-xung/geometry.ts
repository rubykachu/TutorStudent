// Pure geometry of the symmetry pictures: reflecting points in a line, and
// deciding by sampling whether a line is an axis of symmetry of a drawing.
// Screen coordinates: x to the right, y downwards. No React, so
// `content:check`, the validators and the tests read it.

export type Pt = readonly [number, number];

// A straight line through two different points.
export type Line = { readonly p: Pt; readonly q: Pt };

// Straight strokes of a drawing: each stroke is a chain of points, closed
// (the last point joins the first) or open.
export type Stroke = { readonly pts: readonly Pt[]; readonly closed: boolean };

export function line(p: Pt, q: Pt): Line {
  return { p, q };
}

export const vertical = (x: number, top = 0, bottom = 1): Line =>
  line([x, top], [x, bottom]);
export const horizontal = (y: number, left = 0, right = 1): Line =>
  line([left, y], [right, y]);

// The mirror image of `point` in `axis`.
export function reflect(point: Pt, axis: Line): Pt {
  const dx = axis.q[0] - axis.p[0];
  const dy = axis.q[1] - axis.p[1];
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const vx = point[0] - axis.p[0];
  const vy = point[1] - axis.p[1];
  const along = vx * ux + vy * uy;
  return [axis.p[0] + 2 * along * ux - vx, axis.p[1] + 2 * along * uy - vy];
}

// On which side of the line a point lies: 1, -1, or 0 on the line itself.
export function sideOf(point: Pt, axis: Line, tolerance = 1e-6): -1 | 0 | 1 {
  const cross =
    (axis.q[0] - axis.p[0]) * (point[1] - axis.p[1]) -
    (axis.q[1] - axis.p[1]) * (point[0] - axis.p[0]);
  const length = Math.hypot(axis.q[0] - axis.p[0], axis.q[1] - axis.p[1]);
  if (Math.abs(cross) / length <= tolerance) return 0;
  return cross > 0 ? 1 : -1;
}

// Direction of the line in degrees on the screen (0 to the right, 90 down).
export function angleDeg(axis: Line): number {
  return (
    (Math.atan2(axis.q[1] - axis.p[1], axis.q[0] - axis.p[0]) * 180) / Math.PI
  );
}

function distanceToSegment(point: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lengthSquared = dx * dx + dy * dy;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / lengthSquared,
          ),
        );
  return Math.hypot(point[0] - (a[0] + t * dx), point[1] - (a[1] + t * dy));
}

export function segmentsOf(strokes: readonly Stroke[]): [Pt, Pt][] {
  return strokes.flatMap(({ pts, closed }) => {
    const pairs: [Pt, Pt][] = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      pairs.push([pts[i] as Pt, pts[i + 1] as Pt]);
    }
    if (closed && pts.length > 2) {
      pairs.push([pts[pts.length - 1] as Pt, pts[0] as Pt]);
    }
    return pairs;
  });
}

// Points spread along every stroke, about `step` apart, vertices included.
export function samplePoints(strokes: readonly Stroke[], step: number): Pt[] {
  const points: Pt[] = [];
  for (const [a, b] of segmentsOf(strokes)) {
    const count = Math.max(
      1,
      Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step),
    );
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  // A drawing made of single dots has no segments.
  for (const { pts } of strokes)
    if (pts.length === 1) points.push(pts[0] as Pt);
  return points;
}

// How far (drawing units) the mirror image of a drawing may stray from the
// drawing and still count as lying on it.
export const AXIS_TOLERANCE = 0.9;

// Whether folding the drawing along `axis` makes the two halves lie exactly
// on each other: every point of the drawing has its mirror image on the
// drawing too.
export function isAxisOf(
  strokes: readonly Stroke[],
  axis: Line,
  tolerance = AXIS_TOLERANCE,
): boolean {
  const segments = segmentsOf(strokes);
  const dots = strokes
    .filter((s) => s.pts.length === 1)
    .map((s) => s.pts[0] as Pt);
  return samplePoints(strokes, tolerance * 2.2).every((point) => {
    const image = reflect(point, axis);
    return (
      segments.some(([a, b]) => distanceToSegment(image, a, b) <= tolerance) ||
      dots.some(
        (d) => Math.hypot(d[0] - image[0], d[1] - image[1]) <= tolerance,
      )
    );
  });
}

// The axes among lines through `centre` turned in steps of one degree, as
// the angles (0 to 179) of those lines, with neighbours merged.
export function axisAngles(
  strokes: readonly Stroke[],
  centre: Pt,
  tolerance = AXIS_TOLERANCE,
): number[] {
  const found: number[] = [];
  for (let degrees = 0; degrees < 180; degrees++) {
    const rad = (degrees * Math.PI) / 180;
    const axis = line(centre, [
      centre[0] + Math.cos(rad),
      centre[1] + Math.sin(rad),
    ]);
    if (isAxisOf(strokes, axis, tolerance)) found.push(degrees);
  }
  // Merge runs of neighbouring angles (a coarse tolerance finds an axis at a
  // few angles in a row, and 179 lies next to 0), keeping the middle one.
  const merged: number[] = [];
  let run: number[] = [];
  for (const degrees of found) {
    if (run.length > 0 && degrees - (run[run.length - 1] as number) > 1) {
      merged.push(run[Math.floor(run.length / 2)] as number);
      run = [];
    }
    run.push(degrees);
  }
  if (run.length > 0) merged.push(run[Math.floor(run.length / 2)] as number);
  const first = merged[0];
  const last = merged[merged.length - 1];
  if (merged.length > 1 && first !== undefined && last !== undefined) {
    // The run that touches 179 and the one that touches 0 are one axis.
    if (found.includes(0) && found.includes(179)) merged.pop();
  }
  return merged;
}

// The mirror image of a stroke.
export function reflectStroke(stroke: Stroke, axis: Line): Stroke {
  return {
    closed: stroke.closed,
    pts: stroke.pts.map((p) => reflect(p, axis)),
  };
}

export function polar(cx: number, cy: number, r: number, deg: number): Pt {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function regularPolygon(
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

// Where the balance point of a drawing lies, taking each stroke as a thin
// wire: every axis of symmetry of the drawing passes through it.
export function centroid(strokes: readonly Stroke[]): Pt {
  let weight = 0;
  let sx = 0;
  let sy = 0;
  for (const [a, b] of segmentsOf(strokes)) {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    weight += length;
    sx += (length * (a[0] + b[0])) / 2;
    sy += (length * (a[1] + b[1])) / 2;
  }
  for (const { pts } of strokes) {
    if (pts.length === 1) {
      weight += 1;
      sx += (pts[0] as Pt)[0];
      sy += (pts[0] as Pt)[1];
    }
  }
  return [sx / weight, sy / weight];
}

// A smooth curve through the points (Catmull-Rom), as a chain of short
// straight pieces: `per` pieces between two neighbouring points.
export function smooth(points: readonly Pt[], closed: boolean, per = 8): Pt[] {
  const n = points.length;
  const at = (i: number): Pt =>
    closed
      ? (points[((i % n) + n) % n] as Pt)
      : (points[Math.max(0, Math.min(n - 1, i))] as Pt);
  const out: Pt[] = [];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      const coord = (axis: 0 | 1) =>
        0.5 *
        (2 * p1[axis] +
          (-p0[axis] + p2[axis]) * t +
          (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
          (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3);
      out.push([coord(0), coord(1)]);
    }
  }
  if (!closed) out.push(points[n - 1] as Pt);
  return out;
}

// The closed outline of a shape that is symmetric about the vertical line
// x = `axisX`: the points of its right side, from the top of the axis to the
// bottom of it, then the mirror image of the same points back up.
export function mirroredOutline(right: readonly Pt[], axisX: number): Pt[] {
  const [first, ...rest] = right;
  const lastPoint = right[right.length - 1];
  if (!first || !lastPoint) return [];
  const left = rest
    .slice(0, -1)
    .map((p): Pt => [2 * axisX - p[0], p[1]])
    .reverse();
  return [first, ...rest, ...left];
}
