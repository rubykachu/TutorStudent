import type { Pt } from "@/visuals/shared/plane/figure-spec";
import { boxOf, CANVAS, fitInto, units } from "./figures";

// Where the corners of the shapes that move or are cut go on the canvas, so
// the steps of a picture, its stage and its exercise figures share one
// geometry. Names tell the corners apart: T, R, B, L (top, right, bottom,
// left), TL, TR, BR, BL (corners of a box or of a parallelogram).

export type Geometry = {
  pts: Record<string, Pt>;
  scale: number;
  // The canvas the points were placed on.
  w: number;
  h: number;
};

// Canvas of the pictures with writing under the shape, and the room kept for
// that writing.
export type Canvas = {
  w?: number;
  h?: number;
  margin?: number;
  reserve?: number;
};

function named(
  names: readonly string[],
  units_: readonly Pt[],
  canvas: Canvas,
  margin: number,
): Geometry {
  const w = canvas.w ?? CANVAS.w;
  const h = canvas.h ?? CANVAS.h;
  const { pts, scale } = fitInto(
    units_,
    boxOf(w, h, canvas.margin ?? margin, canvas.reserve ?? 0),
  );
  return {
    pts: Object.fromEntries(names.map((n, i) => [n, pts[i] as Pt])),
    scale,
    w,
    h,
  };
}

// A parallelogram cut by the height from its top left corner: the foot F of
// the height lies on the base, and the left triangle is BL, TL, F.
export function parallelogramGeo(
  base: number,
  height: number,
  shift: number,
  canvas: Canvas = {},
): Geometry {
  const [tl, tr, br, bl] = units.parallelogram(base, height, shift) as [
    Pt,
    Pt,
    Pt,
    Pt,
  ];
  const foot: Pt = [tl[0], bl[1]];
  return named(
    ["TL", "TR", "BR", "BL", "F"],
    [tl, tr, br, bl, foot],
    canvas,
    44,
  );
}

// A rhombus with diagonals d1 (across) and d2 (up and down) inside the box
// of those diagonals. T, R, B, L are the corners of the rhombus, C its
// centre, and BOX_TL, BOX_TR, BOX_BR, BOX_BL the corners of the box.
export function rhombusGeo(
  d1: number,
  d2: number,
  canvas: Canvas = {},
): Geometry {
  return named(
    ["T", "R", "B", "L", "C", "BOX_TL", "BOX_TR", "BOX_BR", "BOX_BL"],
    [
      [d1 / 2, 0],
      [d1, d2 / 2],
      [d1 / 2, d2],
      [0, d2 / 2],
      [d1 / 2, d2 / 2],
      [0, 0],
      [d1, 0],
      [d1, d2],
      [0, d2],
    ],
    canvas,
    44,
  );
}

// An isosceles trapezoid BL, TL, TR, BR with bases `bottom` and `top`, and,
// to its right, the copy turned half a turn about the middle M of its right
// leg: the two together make a parallelogram with base `top + bottom`. The
// copy's corners are CBL, CTL, CTR, CBR; W_TL, W_TR, W_BR, W_BL are the
// corners of the parallelogram.
export function trapezoidGeo(
  bottom: number,
  top: number,
  height: number,
  canvas: Canvas = {},
): Geometry {
  const [bl, tl, tr, br] = units.trapezoid(bottom, top, height) as [
    Pt,
    Pt,
    Pt,
    Pt,
  ];
  const mid: Pt = [(tr[0] + br[0]) / 2, (tr[1] + br[1]) / 2];
  const turned = (p: Pt): Pt => [2 * mid[0] - p[0], 2 * mid[1] - p[1]];
  const wholeWidth = top + bottom;
  return named(
    [
      "BL",
      "TL",
      "TR",
      "BR",
      "M",
      "CBL",
      "CTL",
      "CTR",
      "CBR",
      "W_TL",
      "W_TR",
      "W_BR",
      "W_BL",
    ],
    [
      bl,
      tl,
      tr,
      br,
      mid,
      turned(bl),
      turned(tl),
      turned(tr),
      turned(br),
      [tl[0], 0],
      [tl[0] + wholeWidth, 0],
      [wholeWidth, height],
      [0, height],
    ],
    canvas,
    40,
  );
}
