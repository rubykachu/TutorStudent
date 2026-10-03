import type {
  FigureSpec,
  FigureText,
  Pt,
  Tone,
} from "@/visuals/shared/plane/figure-spec";
import { lerp, meetingPoints, unit } from "@/visuals/shared/plane/geometry";

// Drawing helpers of the lesson: a shape given in its own units (a rectangle
// 8 by 5) is scaled to fit a canvas, named A, B, C, … and given the measures
// written beside its sides. Pure data, no React.

export type Box = { x: number; y: number; w: number; h: number };

export const CANVAS = { w: 320, h: 200 } as const;
// Room round a shape for the measures written beside its sides.
export const SIDE_MARGIN = 46;
// Height of the flat figure of a rule (a shape with its letters, and nothing
// written under it): the same for every rule of the lesson.
export const RULE_FIGURE_HEIGHT = 140;

const CORNER_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
const CHAR_HALF_WIDTH = 4.7;
const TEXT_HALF_HEIGHT = 8.5;
const LABEL_GAP = 6;
// How far from its corner the name of a corner is written.
const NAME_DISTANCE = 19;
// Room a measure written above or below a side takes beyond the shape.
const LABEL_ROOM = 28;

export function cornerName(i: number): string {
  const name = CORNER_NAMES[i];
  if (name === undefined) throw new Error(`No name for corner ${i}`);
  return name;
}

// The part of the canvas a shape may fill, leaving `margin` at the sides
// for measures and `reserve` more at the bottom for a line of writing.
export function boxOf(
  w: number,
  h: number,
  margin = SIDE_MARGIN,
  reserve = 0,
): Box {
  // A measure above or below a side needs a line of room, whatever the
  // sides' margin.
  const vertical = Math.max(margin * 0.6, LABEL_ROOM);
  return {
    x: margin,
    y: vertical,
    w: w - 2 * margin,
    h: h - 2 * vertical - reserve,
  };
}

// Scales the points uniformly into the box and centres them there.
export function fitInto(
  points: readonly Pt[],
  box: Box,
): { pts: Pt[]; scale: number } {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX;
  const height = Math.max(...ys) - minY;
  const scale = Math.min(box.w / width, box.h / height);
  const ox = box.x + (box.w - width * scale) / 2;
  const oy = box.y + (box.h - height * scale) / 2;
  return {
    pts: points.map(([x, y]) => [
      ox + (x - minX) * scale,
      oy + (y - minY) * scale,
    ]),
    scale,
  };
}

export function centroid(points: readonly Pt[]): Pt {
  return [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length,
  ];
}

// Where a measure is written beside the segment from `a` to `b`: on the side
// away from `middle`, far enough that the text clears the segment.
export function sideTextAt(
  a: Pt,
  b: Pt,
  middle: Pt,
  text: string,
  gap = LABEL_GAP,
): Pt {
  const spot = lerp(a, b, 0.5);
  const [dx, dy] = unit(a, b);
  const first: Pt = [-dy, dx];
  const second: Pt = [dy, -dx];
  const away = (n: Pt) =>
    Math.hypot(spot[0] + n[0] - middle[0], spot[1] + n[1] - middle[1]);
  const normal =
    Math.abs(away(first) - away(second)) < 0.5
      ? first[1] < second[1]
        ? first
        : second
      : away(first) > away(second)
        ? first
        : second;
  const push =
    text.length * CHAR_HALF_WIDTH * Math.abs(normal[0]) +
    TEXT_HALF_HEIGHT * Math.abs(normal[1]) +
    gap;
  return [spot[0] + normal[0] * push, spot[1] + normal[1] * push];
}

// Twice the signed area of a polygon: positive when its corners run clockwise
// on the screen (y down).
function turnSign(points: readonly Pt[]): number {
  const sum = points.reduce((total, p, i) => {
    const q = points[(i + 1) % points.length] as Pt;
    return total + p[0] * q[1] - q[0] * p[1];
  }, 0);
  return sum >= 0 ? 1 : -1;
}

// The names A, B, C, … of a polygon's corners, each written on the outward
// bisector of the two sides that meet there (inside the notch at a reflex
// corner), far enough that no side runs through the letter.
export function cornerNameTexts(
  corners: readonly Pt[],
  distance = NAME_DISTANCE,
): FigureText[] {
  const sign = turnSign(corners);
  const outward = (from: Pt, to: Pt): Pt => {
    const [dx, dy] = unit(from, to);
    return [sign * dy, -sign * dx];
  };
  return corners.map((corner, i) => {
    const before = corners[(i + corners.length - 1) % corners.length] as Pt;
    const after = corners[(i + 1) % corners.length] as Pt;
    const [ax, ay] = outward(before, corner);
    const [bx, by] = outward(corner, after);
    const length = Math.hypot(ax + bx, ay + by) || 1;
    return {
      x: corner[0] + ((ax + bx) / length) * distance,
      y: corner[1] + ((ay + by) / length) * distance,
      text: cornerName(i),
      tone: "ink" as Tone,
    };
  });
}

// Unit corners of the five shapes of the lesson, screen coordinates (y down).
export const units = {
  rect: (a: number, b: number): Pt[] => [
    [0, 0],
    [a, 0],
    [a, b],
    [0, b],
  ],
  // Top side shifted right by `shift`: the slant leans to the right going up.
  parallelogram: (base: number, height: number, shift: number): Pt[] => [
    [shift, 0],
    [shift + base, 0],
    [base, height],
    [0, height],
  ],
  rhombus: (d1: number, d2: number): Pt[] => [
    [d1 / 2, 0],
    [d1, d2 / 2],
    [d1 / 2, d2],
    [0, d2 / 2],
  ],
  // Corners from the bottom left, clockwise on the screen.
  trapezoid: (bottom: number, top: number, height: number): Pt[] => [
    [0, height],
    [(bottom - top) / 2, 0],
    [(bottom + top) / 2, 0],
    [bottom, height],
  ],
} as const;

export type SideNote = {
  // The side runs from corner `i` to the next corner.
  i: number;
  text: string;
  tone?: Tone;
};

export type ShapeOptions = {
  label: string;
  corners: readonly Pt[];
  w?: number;
  h?: number;
  margin?: number;
  // Space kept free under the shape for a line of writing.
  reserve?: number;
  tone?: Tone;
  fill?: Tone;
  // Writes the names A, B, C, … beside the corners (see `cornerNameTexts`).
  names?: boolean;
  sides?: readonly SideNote[];
  // Right-angle squares at these corners.
  rights?: readonly number[];
  maxScale?: number;
  // More drawing on top of the shape, given the named points and the scale.
  extra?: (
    pts: Readonly<Record<string, Pt>>,
    scale: number,
  ) => Partial<FigureSpec>;
};

// A polygon with its corners named A, B, C, … in order.
export function shape(o: ShapeOptions): FigureSpec {
  const w = o.w ?? CANVAS.w;
  const h = o.h ?? CANVAS.h;
  const { pts: fitted, scale } = fitInto(
    o.corners,
    boxOf(w, h, o.margin, o.reserve),
  );
  const names = fitted.map((_, i) => cornerName(i));
  const nameTexts = o.names ? cornerNameTexts(fitted) : [];
  const pts: Record<string, Pt> = Object.fromEntries(
    names.map((name, i) => [name, fitted[i] as Pt]),
  );
  const middle = centroid(fitted);
  const texts: FigureText[] = (o.sides ?? []).map((side) => {
    const from = fitted[side.i] as Pt;
    const to = fitted[(side.i + 1) % fitted.length] as Pt;
    const [x, y] = sideTextAt(from, to, middle, side.text);
    return { x, y, text: side.text, tone: side.tone ?? "ink" };
  });
  const base: FigureSpec = {
    label: o.label,
    w,
    h,
    ...(o.maxScale === undefined ? {} : { maxScale: o.maxScale }),
    pts,
    polys: [
      {
        v: names,
        ...(o.tone ? { tone: o.tone } : {}),
        ...(o.fill ? { fill: o.fill } : {}),
      },
    ],
    texts: [...nameTexts, ...texts],
    ...(o.rights && o.rights.length > 0
      ? {
          rights: o.rights.map((i) => ({
            at: cornerName(i),
            a: cornerName((i + 1) % names.length),
            b: cornerName((i + names.length - 1) % names.length),
          })),
        }
      : {}),
  };
  const more = o.extra?.(pts, scale);
  if (!more) return base;
  return {
    ...base,
    ...more,
    pts: { ...pts, ...(more.pts ?? {}) },
    polys: [...(base.polys ?? []), ...(more.polys ?? [])],
    texts: [...nameTexts, ...texts, ...(more.texts ?? [])],
  };
}

// A grid of unit squares: every cell of `cells` (the whole `cols` by `rows`
// block when left out) is outlined, and those in `filled` (all of them when
// left out) are painted in `fill`.
export function gridFigure(o: {
  label: string;
  cols: number;
  rows: number;
  cell: number;
  cells?: readonly (readonly [number, number])[];
  filled?: readonly (readonly [number, number])[];
  fill?: Tone;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  texts?: readonly FigureText[];
  maxScale?: number;
}): FigureSpec {
  const x0 = o.x ?? 0;
  const y0 = o.y ?? 0;
  const pts: Record<string, Pt> = {};
  for (let c = 0; c <= o.cols; c++) {
    for (let r = 0; r <= o.rows; r++) {
      pts[`g${c}_${r}`] = [x0 + c * o.cell, y0 + r * o.cell];
    }
  }
  const cells: readonly (readonly [number, number])[] =
    o.cells ??
    Array.from({ length: o.cols * o.rows }, (_, i) => [
      i % o.cols,
      Math.floor(i / o.cols),
    ]);
  const filled = new Set((o.filled ?? cells).map(([c, r]) => `${c},${r}`));
  const polys = cells.map(([c, r]) => ({
    v: [`g${c}_${r}`, `g${c + 1}_${r}`, `g${c + 1}_${r + 1}`, `g${c}_${r + 1}`],
    tone: "mute" as Tone,
    ...(o.fill && filled.has(`${c},${r}`) ? { fill: o.fill } : {}),
  }));
  return {
    label: o.label,
    w: o.w ?? o.cols * o.cell + 2 * x0,
    h: o.h ?? o.rows * o.cell + 2 * y0,
    ...(o.maxScale === undefined ? {} : { maxScale: o.maxScale }),
    pts,
    polys,
    ...(o.texts ? { texts: o.texts } : {}),
  };
}

// A quadrilateral with sides a, b, c, d (in this order round the shape) and
// the angle at the corner between a and b, as the screen measures it. The
// first corner is the origin and the first side runs to the right.
export function quadrilateral(
  a: number,
  b: number,
  c: number,
  d: number,
  angleDeg: number,
): Pt[] {
  const first: Pt = [0, 0];
  const second: Pt = [a, 0];
  const rad = (angleDeg * Math.PI) / 180;
  // Straight ahead along a would be 0°; turn by the exterior angle.
  const third: Pt = [
    a + b * Math.cos(Math.PI - rad),
    b * Math.sin(Math.PI - rad),
  ];
  const meet = meetingPoints(first, d, third, c);
  if (!meet) throw new Error(`No quadrilateral with sides ${a} ${b} ${c} ${d}`);
  // The fourth corner on the same side of the third as the first corner.
  const fourth = meet[0][1] >= meet[1][1] ? meet[0] : meet[1];
  return [first, second, third, fourth];
}
