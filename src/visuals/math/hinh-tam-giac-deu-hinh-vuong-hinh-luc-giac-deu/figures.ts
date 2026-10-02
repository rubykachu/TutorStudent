import type {
  FigureAngle,
  FigurePoly,
  FigureRight,
  FigureSeg,
  FigureSpec,
  FigureText,
  FigureTick,
  Pt,
  Tone,
} from "@/visuals/shared/plane/figure-spec";
import {
  lerp,
  lineIntersection,
  named,
  polar,
  regularPoints,
  unit,
} from "@/visuals/shared/plane/geometry";

// Builders of the pictures of this lesson: the three regular shapes with the
// marks the lesson teaches (equal-length strokes, angle arcs, diagonals),
// grids, the hexagon made of six triangles, and the figures of the workbook
// exercises.

export type ShapeKind = "tri" | "sq" | "hex";

// Corner names of each shape, in drawing order.
export const CORNERS: Readonly<Record<ShapeKind, readonly string[]>> = {
  tri: ["A", "B", "C"],
  sq: ["A", "B", "C", "D"],
  hex: ["A", "B", "C", "D", "E", "F"],
};

// Measure of one angle of each shape, as the lesson writes it.
export const ANGLE_TEXT: Readonly<Record<ShapeKind, string>> = {
  tri: "60°",
  sq: "90°",
  hex: "120°",
};

// Corners of each shape inscribed in a circle of radius r:
// - tri: A on top, B bottom left, C bottom right;
// - sq: A top left, B top right, C bottom right, D bottom left;
// - hex: A bottom left, B left, C top left, D top right, E right, F bottom
//   right (pointed at the left and right, flat top and bottom).
export function corners(
  kind: ShapeKind,
  cx: number,
  cy: number,
  r: number,
): Pt[] {
  switch (kind) {
    case "tri":
      return [
        polar(cx, cy, r, -90),
        polar(cx, cy, r, 150),
        polar(cx, cy, r, 30),
      ];
    case "sq":
      return regularPoints(4, cx, cy, r, -135);
    case "hex":
      return regularPoints(6, cx, cy, r, 120);
  }
}

// The sides of a shape as pairs of corner names, in order round the shape.
export function sidePairs(names: readonly string[]): [string, string][] {
  return names.map((name, i) => [
    name,
    names[(i + 1) % names.length] as string,
  ]);
}

export type ShapeOptions = {
  label: string;
  w: number;
  h: number;
  cx: number;
  cy: number;
  // Radius of the circle the shape is inscribed in.
  r: number;
  // Writes the names of the corners.
  names?: boolean;
  // Outline and soft fill colours.
  tone?: Tone;
  fill?: Tone;
  // Marks every side with one stroke (all sides equal).
  ticks?: boolean;
  // An arc with the measure at every corner; right-angle squares on a square.
  angles?: boolean;
  segs?: readonly FigureSeg[];
  texts?: readonly FigureText[];
  dots?: readonly string[];
  // Points added to the corners, e.g. a centre.
  extraPts?: Readonly<Record<string, Pt>>;
  ticksExtra?: readonly FigureTick[];
  rights?: readonly FigureRight[];
  nameShift?: Readonly<Record<string, Pt>>;
};

// One of the regular shapes with its corners named A, B, C…, plus the marks
// asked for.
export function shape(kind: ShapeKind, o: ShapeOptions): FigureSpec {
  const names = CORNERS[kind];
  const pts = {
    ...named(names, corners(kind, o.cx, o.cy, o.r)),
    ...(o.extraPts ?? {}),
  };
  const ticks: FigureTick[] = [
    ...(o.ticks
      ? [{ segs: sidePairs(names), count: 1, tone: "blue" as Tone }]
      : []),
    ...(o.ticksExtra ?? []),
  ];
  const angles: FigureAngle[] = [];
  const rights: FigureRight[] = [...(o.rights ?? [])];
  if (o.angles) {
    names.forEach((at, i) => {
      const prev = names[(i + names.length - 1) % names.length] as string;
      const next = names[(i + 1) % names.length] as string;
      if (kind === "sq") rights.push({ at, a: prev, b: next, tone: "violet" });
      else {
        angles.push({
          at,
          a: prev,
          b: next,
          text: ANGLE_TEXT[kind],
          tone: "violet",
          radius: kind === "hex" ? 19 : 23,
          ...(kind === "hex" ? { textDistance: 50 } : {}),
        });
      }
    });
  }
  const polys: FigurePoly[] = [
    { v: names, tone: o.tone ?? "ink", ...(o.fill ? { fill: o.fill } : {}) },
  ];
  return {
    label: o.label,
    w: o.w,
    h: o.h,
    pts,
    polys,
    ...(o.names ? { names } : {}),
    ...(o.nameShift ? { nameShift: o.nameShift } : {}),
    ...(o.dots ? { dots: o.dots } : {}),
    ...(ticks.length > 0 ? { ticks } : {}),
    ...(angles.length > 0 ? { angles } : {}),
    ...(rights.length > 0 ? { rights } : {}),
    ...(o.segs ? { segs: o.segs } : {}),
    ...(o.texts ? { texts: o.texts } : {}),
  };
}

// A triangle with the given side lengths (cm), side c at the bottom, b on the
// left and a on the right, scaled to fill the drawing, with the lengths
// written beside the sides when `lengths` is on.
export function triangleBySides(
  label: string,
  [a, b, c]: readonly [number, number, number],
  o: {
    w: number;
    h: number;
    lengths?: boolean;
    // Names of the apex, the left and the right corner (default A, B, C).
    names?: readonly [string, string, string];
  },
): FigureSpec {
  const x = (b * b + c * c - a * a) / (2 * c);
  const height = Math.sqrt(Math.max(b * b - x * x, 0));
  const minX = Math.min(0, x);
  const maxX = Math.max(c, x);
  const margin = o.lengths ? 28 : 12;
  const scale = Math.min(
    (o.w - 2 * margin) / (maxX - minX),
    (o.h - 2 * margin) / height,
  );
  const offX = (o.w - (maxX - minX) * scale) / 2 - minX * scale;
  const offY = (o.h + height * scale) / 2;
  const at = (px: number, py: number): Pt => [
    offX + px * scale,
    offY - py * scale,
  ];
  const [nameA, nameB, nameC] = o.names ?? ["A", "B", "C"];
  const pts: Record<string, Pt> = {
    [nameA]: at(x, height),
    [nameB]: at(0, 0),
    [nameC]: at(c, 0),
  };
  const [pa, pb, pc] = [pts[nameA], pts[nameB], pts[nameC]] as [Pt, Pt, Pt];
  const centre: Pt = [(pa[0] + pb[0] + pc[0]) / 3, (pa[1] + pb[1] + pc[1]) / 3];
  const label_ = (p: Pt, q: Pt, text: number): FigureText => {
    const mid = lerp(p, q, 0.5);
    const [ux, uy] = unit(centre, mid);
    return {
      x: mid[0] + ux * 17,
      y: mid[1] + uy * 17,
      text: String(text),
      tone: "ink",
    };
  };
  return {
    label,
    w: o.w,
    h: o.h,
    pts,
    polys: [{ v: [nameA, nameB, nameC] }],
    ...(o.names ? { names: [nameA, nameB, nameC] } : {}),
    ...(o.lengths
      ? {
          texts: [label_(pa, pb, b), label_(pa, pc, a), label_(pb, pc, c)],
        }
      : {}),
  };
}

// A polygon drawn alone, e.g. a thumbnail of a shape that is not regular.
export function polygon(
  label: string,
  o: { w: number; h: number; points: readonly Pt[] },
): FigureSpec {
  const pts = Object.fromEntries(o.points.map((p, i) => [`P${i}`, p]));
  return {
    label,
    w: o.w,
    h: o.h,
    pts,
    polys: [{ v: o.points.map((_, i) => `P${i}`) }],
  };
}

// A rectangle `width` by `height` centred in the drawing.
export function rectangle(
  label: string,
  o: { w: number; h: number; width: number; height: number },
): FigureSpec {
  const left = (o.w - o.width) / 2;
  const top = (o.h - o.height) / 2;
  return {
    label,
    w: o.w,
    h: o.h,
    pts: {
      A: [left, top],
      B: [left + o.width, top],
      C: [left + o.width, top + o.height],
      D: [left, top + o.height],
    },
    polys: [{ v: ["A", "B", "C", "D"] }],
  };
}

// ---------------------------------------------------------------------------
// Hexagon made of six equilateral triangles

const HEX_NAMES = CORNERS.hex;

// The hexagon with its centre O, the first `count` of its six triangles
// filled (the others as dashed outlines), and optionally a main diagonal.
export function hexTriangles(
  label: string,
  o: {
    w: number;
    h: number;
    cx: number;
    cy: number;
    r: number;
    count: number;
    diagonal?: readonly [string, string];
    names?: boolean;
    ticksOnDiagonal?: boolean;
  },
): FigureSpec {
  const pts: Record<string, Pt> = {
    ...named(HEX_NAMES, corners("hex", o.cx, o.cy, o.r)),
    O: [o.cx, o.cy],
  };
  const polys: FigurePoly[] = HEX_NAMES.slice(0, o.count).map((_, k) => ({
    v: ["O", HEX_NAMES[k] as string, HEX_NAMES[(k + 1) % 6] as string],
    tone: "ink",
    fill: "teal",
  }));
  const segs: FigureSeg[] = [];
  for (let k = o.count; k < 6; k++) {
    segs.push({
      a: "O",
      b: HEX_NAMES[k] as string,
      tone: "mute",
      dash: true,
    });
  }
  if (o.diagonal) {
    segs.push({
      a: o.diagonal[0],
      b: o.diagonal[1],
      tone: "amber",
      bold: true,
    });
  }
  const ticks: FigureTick[] = o.ticksOnDiagonal
    ? [
        {
          segs: [
            ["O", "A"],
            ["O", "D"],
          ],
          count: 2,
          tone: "blue",
        },
      ]
    : [];
  return {
    label,
    w: o.w,
    h: o.h,
    pts,
    polys,
    ...(segs.length > 0 ? { segs } : {}),
    ...(o.names ? { names: HEX_NAMES } : {}),
    ...(ticks.length > 0 ? { ticks } : {}),
  };
}

// ---------------------------------------------------------------------------
// Grids of squares and shapes made of equilateral triangles

// A grid of `rows` by `cols` equal squares (corner names g<row><col>), the
// listed unit cells filled, and the listed squares (top-left cell and size
// in cells) outlined in a colour.
export function squareGrid(
  label: string,
  o: {
    w: number;
    h: number;
    rows: number;
    cols: number;
    cell: number;
    filled?: readonly (readonly [number, number])[];
    fillTone?: Tone;
    outlined?: readonly {
      row: number;
      col: number;
      size: number;
      tone: Tone;
    }[];
    // Distance from the top of the drawing to the grid (default: centred).
    top?: number;
  },
): FigureSpec {
  const left = (o.w - o.cols * o.cell) / 2;
  const top = o.top ?? (o.h - o.rows * o.cell) / 2;
  const pts: Record<string, Pt> = {};
  for (let r = 0; r <= o.rows; r++) {
    for (let c = 0; c <= o.cols; c++) {
      pts[`g${r}${c}`] = [left + c * o.cell, top + r * o.cell];
    }
  }
  const cellPoly = (
    row: number,
    col: number,
    size: number,
    tone: Tone,
    fill?: Tone,
  ): FigurePoly => ({
    v: [
      `g${row}${col}`,
      `g${row}${col + size}`,
      `g${row + size}${col + size}`,
      `g${row + size}${col}`,
    ],
    tone,
    ...(fill ? { fill } : {}),
  });
  const polys: FigurePoly[] = [];
  for (let r = 0; r < o.rows; r++) {
    for (let c = 0; c < o.cols; c++) {
      const on = o.filled?.some(([fr, fc]) => fr === r && fc === c);
      polys.push(
        cellPoly(r, c, 1, "ink", on ? (o.fillTone ?? "pink") : undefined),
      );
    }
  }
  for (const big of o.outlined ?? []) {
    polys.push(cellPoly(big.row, big.col, big.size, big.tone));
  }
  return { label, w: o.w, h: o.h, pts, polys };
}

// ---------------------------------------------------------------------------
// Figures of the workbook exercises

// Exercise 4.1, figure 4.4: six outlines labelled a) to f): a regular
// octagon, a square, an equilateral triangle, a trapezoid, a triangle whose
// sides are not all equal, a regular hexagon.
export function figure44(
  o: {
    // Writes the number of sides next to each letter.
    counts?: boolean;
    // Marks one shape as found: its colour, equal-side strokes, right angles.
    mark?: "b" | "c" | "f";
  } = {},
): FigureSpec {
  const w = 320;
  const cellW = w / 3;
  const rowY = [66, 188];
  const colX = [cellW / 2, cellW * 1.5, cellW * 2.5];
  const pts: Record<string, Pt> = {};
  const addAll = (prefix: string, points: readonly Pt[]) =>
    points.forEach((p, i) => {
      pts[`${prefix}${i}`] = p;
    });
  const octagon = regularPoints(
    8,
    colX[0] as number,
    rowY[0] as number,
    46,
    -112.5,
  );
  addAll("a", octagon);
  const sq = 78;
  const [bx, by] = [colX[1] as number, rowY[0] as number];
  addAll("b", [
    [bx - sq / 2, by - sq / 2],
    [bx + sq / 2, by - sq / 2],
    [bx + sq / 2, by + sq / 2],
    [bx - sq / 2, by + sq / 2],
  ]);
  const side = 90;
  const [cx, cy] = [colX[2] as number, rowY[0] as number];
  const triHeight = (side * Math.sqrt(3)) / 2;
  addAll("c", [
    [cx, cy - triHeight / 2],
    [cx - side / 2, cy + triHeight / 2],
    [cx + side / 2, cy + triHeight / 2],
  ]);
  const [dx, dy] = [colX[0] as number, rowY[1] as number];
  addAll("d", [
    [dx - 28, dy - 28],
    [dx + 28, dy - 28],
    [dx + 52, dy + 28],
    [dx - 52, dy + 28],
  ]);
  const [ex, ey] = [colX[1] as number, rowY[1] as number];
  addAll("e", [
    [ex, ey - 48],
    [ex - 44, ey + 44],
    [ex + 44, ey + 44],
  ]);
  const hex = regularPoints(6, colX[2] as number, rowY[1] as number, 46, 0);
  addAll("f", hex);
  const poly = (prefix: string, count: number): FigurePoly => ({
    v: Array.from({ length: count }, (_, i) => `${prefix}${i}`),
  });
  const sides: Record<string, number> = { a: 8, b: 4, c: 3, d: 4, e: 3, f: 6 };
  const label = (key: string, x: number, y: number): FigureText => ({
    x,
    y,
    text: o.counts ? `${key}) ${sides[key]} cạnh` : `${key})`,
    tone: "ink",
  });
  const marked = (key: string, count: number): FigurePoly => ({
    ...poly(key, count),
    ...(o.mark === key
      ? { fill: ({ b: "pink", c: "teal", f: "lime" } as const)[o.mark] }
      : {}),
  });
  const ticks: FigureTick[] = o.mark
    ? [
        {
          segs: sidePairs(
            Array.from(
              { length: sides[o.mark] as number },
              (_, i) => `${o.mark}${i}`,
            ),
          ),
          count: 1,
          tone: "blue",
        },
      ]
    : [];
  const rights: FigureRight[] =
    o.mark === "b"
      ? [0, 1, 2, 3].map((i) => ({
          at: `b${i}`,
          a: `b${(i + 3) % 4}`,
          b: `b${(i + 1) % 4}`,
          tone: "violet",
        }))
      : [];
  return {
    label: "Hình 4.4: sáu hình a, b, c, d, e, f",
    w,
    h: 268,
    pts,
    polys: [
      marked("a", 8),
      marked("b", 4),
      marked("c", 3),
      poly("d", 4),
      poly("e", 3),
      marked("f", 6),
    ],
    texts: [
      label("a", colX[0] as number, 126),
      label("b", colX[1] as number, 126),
      label("c", colX[2] as number, 126),
      label("d", colX[0] as number, 250),
      label("e", colX[1] as number, 250),
      label("f", colX[2] as number, 250),
    ],
    ...(ticks.length > 0 ? { ticks } : {}),
    ...(rights.length > 0 ? { rights } : {}),
  };
}

// Exercise 4.4, figure 4.5: the regular hexagon MNPQRS with its six
// secondary diagonals NQ, QS, SN, MP, PR, MR.
export const FIG45_NAMES = ["P", "Q", "R", "S", "M", "N"] as const;
export function figure45(extra?: {
  segs?: readonly FigureSeg[];
  ticks?: readonly FigureTick[];
  polys?: readonly FigurePoly[];
  // Draws the three main diagonals too, bold or dashed.
  mainDiagonals?: "bold" | "dash";
  // Colour of the six secondary diagonals.
  tone?: Tone;
  boldSecondary?: boolean;
}): FigureSpec {
  const pts = named(FIG45_NAMES, regularPoints(6, 160, 135, 112, 240));
  const secondary: [string, string][] = [
    ["N", "Q"],
    ["Q", "S"],
    ["S", "N"],
    ["M", "P"],
    ["P", "R"],
    ["M", "R"],
  ];
  const main: [string, string][] = [
    ["M", "Q"],
    ["N", "R"],
    ["P", "S"],
  ];
  return {
    label: "Hình 4.5: hình lục giác đều MNPQRS và sáu đường chéo",
    w: 320,
    h: 270,
    pts: { ...pts, O: [160, 135] },
    polys: [{ v: ["M", "N", "P", "Q", "R", "S"] }, ...(extra?.polys ?? [])],
    segs: [
      ...secondary.map(
        ([a, b]): FigureSeg => ({
          a,
          b,
          tone: extra?.tone ?? "ink",
          ...(extra?.boldSecondary ? { bold: true } : {}),
        }),
      ),
      ...(extra?.mainDiagonals
        ? main.map(
            ([a, b]): FigureSeg => ({
              a,
              b,
              tone: "amber",
              ...(extra.mainDiagonals === "bold"
                ? { bold: true }
                : { dash: true }),
            }),
          )
        : []),
      ...(extra?.segs ?? []),
    ],
    names: [...FIG45_NAMES],
    ...(extra?.ticks ? { ticks: extra.ticks } : {}),
  };
}

// Exercise 4.5, figure 4.6: triangle ABC (taller than it is wide, so its
// sides are not all equal) with the square MNPQ inscribed in it: N on AB, P
// on AC, M and Q on BC.
export function figure46(extra?: {
  ticks?: readonly FigureTick[];
  rights?: readonly FigureRight[];
  arcs?: FigureSpec["arcs"];
  texts?: readonly FigureText[];
  segs?: readonly FigureSeg[];
}): FigureSpec {
  const half = 78;
  const height = 186;
  const baseY = 252;
  const a: Pt = [160, baseY - height];
  const b: Pt = [160 - half, baseY];
  const c: Pt = [160 + half, baseY];
  const t = height / (2 * half + height);
  const n = lerp(a, b, t);
  const p = lerp(a, c, t);
  const pts: Record<string, Pt> = {
    A: a,
    B: b,
    C: c,
    N: n,
    P: p,
    M: [n[0], baseY],
    Q: [p[0], baseY],
  };
  return {
    label: "Hình 4.6: tam giác ABC và hình MNPQ nằm trong nó",
    w: 320,
    h: 290,
    pts,
    polys: [{ v: ["A", "B", "C"] }, { v: ["M", "N", "P", "Q"] }],
    names: ["A", "B", "C", "M", "N", "P", "Q"],
    nameShift: {
      B: [-6, 4],
      C: [6, 4],
      M: [0, 12],
      Q: [0, 12],
      N: [-4, 0],
      P: [4, 0],
    },
    ...(extra?.ticks ? { ticks: extra.ticks } : {}),
    ...(extra?.rights ? { rights: extra.rights } : {}),
    ...(extra?.arcs ? { arcs: extra.arcs } : {}),
    ...(extra?.texts ? { texts: extra.texts } : {}),
    ...(extra?.segs ? { segs: extra.segs } : {}),
  };
}

// Exercise 4.6, figure 4.7: one triangle with its side "5 cm", an arrow, and
// the hexagon the six triangles make (the last triangle still beside it).
export function figure47(): FigureSpec {
  const side = 62;
  const triHeight = (side * Math.sqrt(3)) / 2;
  const pts: Record<string, Pt> = {
    loneTop: [58, 90 - triHeight / 2],
    loneLeft: [58 - side / 2, 90 + triHeight / 2],
    loneRight: [58 + side / 2, 90 + triHeight / 2],
    O: [226, 100],
  };
  const hex = regularPoints(6, 226, 100, side, 0);
  hex.forEach((p, i) => {
    pts[`H${i}`] = p;
  });
  // The sixth triangle (O, H5, H0) is moved up and to the right.
  const shift: Pt = [16, -18];
  pts.S0 = [226 + shift[0], 100 + shift[1]];
  pts.S1 = [hex[5][0] + shift[0], hex[5][1] + shift[1]];
  pts.S2 = [hex[0][0] + shift[0], hex[0][1] + shift[1]];
  pts.ArrowFrom = [102, 100];
  pts.ArrowTip = [136, 100];
  pts.ArrowWing1 = [128, 94];
  pts.ArrowWing2 = [128, 106];
  const triangle = (v: string[], fill: boolean): FigurePoly => ({
    v,
    ...(fill ? { fill: "teal" } : {}),
  });
  return {
    label:
      "Hình 4.7: một tam giác đều cạnh 5 cm và sáu tam giác ghép thành hình lục giác đều",
    w: 320,
    h: 190,
    pts,
    polys: [
      triangle(["loneTop", "loneLeft", "loneRight"], true),
      triangle(["O", "H0", "H1"], true),
      triangle(["O", "H1", "H2"], true),
      triangle(["O", "H2", "H3"], true),
      triangle(["O", "H3", "H4"], true),
      triangle(["O", "H4", "H5"], true),
      triangle(["S0", "S1", "S2"], true),
    ],
    segs: [
      { a: "ArrowFrom", b: "ArrowTip" },
      { a: "ArrowTip", b: "ArrowWing1" },
      { a: "ArrowTip", b: "ArrowWing2" },
    ],
    texts: [{ x: 58, y: 148, text: "5 cm", tone: "ink" }],
  };
}

// Exercise 4.7, figure 4.8: the hexagon ABCDEF with its six short diagonals,
// which cross in M, N, P, Q, R and S.
export function figure48(extra?: {
  polys?: readonly FigurePoly[];
  segs?: readonly FigureSeg[];
  texts?: readonly FigureText[];
  plainDiagonals?: boolean;
}): FigureSpec {
  const hex = named(CORNERS.hex, corners("hex", 150, 131, 100));
  const at = (name: string) => hex[name] as Pt;
  const cross = (a: string, b: string, c: string, d: string) =>
    lineIntersection(at(a), at(b), at(c), at(d)) as Pt;
  const pts: Record<string, Pt> = {
    ...hex,
    M: cross("A", "C", "B", "D"),
    N: cross("B", "D", "C", "E"),
    P: cross("C", "E", "D", "F"),
    Q: cross("D", "F", "A", "E"),
    R: cross("A", "E", "B", "F"),
    S: cross("B", "F", "A", "C"),
  };
  const diagonals: [string, string][] = [
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
    ["D", "F"],
    ["E", "A"],
    ["F", "B"],
  ];
  // The names M to S stand inside the small hexagon, away from the lines.
  const inside = Object.fromEntries(
    ["M", "N", "P", "Q", "R", "S"].map((name) => {
      const [ux, uy] = unit([150, 131], pts[name] as Pt);
      return [name, [-2 * 17 * ux - ux * 4, -2 * 17 * uy - uy * 4] as Pt];
    }),
  );
  return {
    label:
      "Hình 4.8: hình lục giác đều ABCDEF và sáu đường chéo cắt nhau tại M, N, P, Q, R, S",
    w: 300,
    h: 262,
    pts,
    polys: [{ v: [...CORNERS.hex] }, ...(extra?.polys ?? [])],
    segs: [
      ...diagonals.map(([a, b]): FigureSeg => ({ a, b })),
      ...(extra?.segs ?? []),
    ],
    names: [...CORNERS.hex, "M", "N", "P", "Q", "R", "S"],
    nameShift: inside,
    ...(extra?.texts ? { texts: extra.texts } : {}),
  };
}
