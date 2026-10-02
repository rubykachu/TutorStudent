import type {
  FigureAngle,
  FigureArrow,
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
  polar,
  regularPoints,
} from "@/visuals/shared/plane/geometry";

// Builders of the pictures of this lesson: the four quadrilaterals with the
// marks the lesson teaches (equal-side strokes, parallel chevrons, right
// angles, angle measures, diagonals), and the figures of the workbook
// exercises.

export type QuadKind = "chu-nhat" | "thoi" | "binh-hanh" | "thang-can";

// The concept colour of each quadrilateral, as in the glossary.
export const QUAD_TONE: Readonly<Record<QuadKind, Tone>> = {
  "chu-nhat": "teal",
  thoi: "pink",
  "binh-hanh": "lime",
  "thang-can": "sky",
};

export const QUAD_NAME: Readonly<Record<QuadKind, string>> = {
  "chu-nhat": "Hình chữ nhật",
  thoi: "Hình thoi",
  "binh-hanh": "Hình bình hành",
  "thang-can": "Hình thang cân",
};

export type QuadCorner = "A" | "B" | "C" | "D";
const CORNERS: readonly QuadCorner[] = ["A", "B", "C", "D"];

// The corners of each quadrilateral in a 300 by 200 drawing, named clockwise
// from the top left (A is the left corner of the rhombus):
// - chữ nhật 180 by 120;
// - thoi: four sides of 90, angles 60° at A and C and 120° at B and D;
// - bình hành: base 150, side 100, angles 60° at B and D and 120° at A and C;
// - thang cân: bases 110 and 200, legs 90, angles 60° at C and D and 120° at
//   A and B.
const QUAD_POINTS: Readonly<Record<QuadKind, Record<QuadCorner, Pt>>> = {
  "chu-nhat": { A: [60, 40], B: [240, 40], C: [240, 160], D: [60, 160] },
  thoi: { A: [72, 100], B: [150, 55], C: [228, 100], D: [150, 145] },
  "binh-hanh": { A: [100, 63], B: [250, 63], C: [200, 150], D: [50, 150] },
  "thang-can": { A: [95, 72], B: [205, 72], C: [250, 150], D: [50, 150] },
};

// The sides of a quadrilateral as pairs of corner names, in order round it.
export const QUAD_SIDES = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "A"],
] as const;

export type QuadOptions = {
  label: string;
  w?: number;
  h?: number;
  // Writes the names of the corners.
  names?: boolean;
  // Outline colour (default ink) and a soft fill (true: the colour of the
  // shape).
  tone?: Tone;
  fill?: Tone | true;
  // Strokes on the sides: all four, opposite pairs (one stroke and two), or
  // the two legs of a trapezoid.
  sides?: "all" | "opposite" | "legs";
  // Chevrons: opposite sides, or the two bases of a trapezoid.
  parallel?: "opposite" | "bases";
  // Right-angle squares at the four corners.
  rights?: boolean;
  // An angle arc with its measure at the named corners.
  angles?: Partial<Record<QuadCorner, string>>;
  // The two diagonals, and what they show: nothing more (plain), equal
  // lengths, a right angle between them, or the middle of each.
  diagonals?: "plain" | "equal" | "perp" | "mid";
  texts?: readonly FigureText[];
  segs?: readonly FigureSeg[];
  nameShift?: Readonly<Record<string, Pt>>;
};

const SIDE_MARKS: Readonly<
  Record<NonNullable<QuadOptions["sides"]>, FigureTick[]>
> = {
  all: [{ segs: QUAD_SIDES, count: 1, tone: "blue" }],
  opposite: [
    {
      segs: [
        ["A", "B"],
        ["C", "D"],
      ],
      count: 1,
      tone: "blue",
    },
    {
      segs: [
        ["B", "C"],
        ["D", "A"],
      ],
      count: 2,
      tone: "blue",
    },
  ],
  legs: [
    {
      segs: [
        ["D", "A"],
        ["C", "B"],
      ],
      count: 1,
      tone: "blue",
    },
  ],
};

const PARALLEL_MARKS: Readonly<
  Record<NonNullable<QuadOptions["parallel"]>, FigureArrow[]>
> = {
  opposite: [
    {
      segs: [
        ["A", "B"],
        ["D", "C"],
      ],
      count: 1,
      tone: "slate",
    },
    {
      segs: [
        ["B", "C"],
        ["A", "D"],
      ],
      count: 2,
      tone: "slate",
    },
  ],
  bases: [
    {
      segs: [
        ["A", "B"],
        ["D", "C"],
      ],
      count: 1,
      tone: "slate",
    },
  ],
};

// Fits points into a w by h box (a margin all round for the names), keeping
// proportions; the drawing is centred.
function fitTo(
  points: Readonly<Record<string, Pt>>,
  w: number,
  h: number,
  margin: number,
): Record<string, Pt> {
  const all = Object.values(points);
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const scale = Math.min(
    (w - 2 * margin) / (maxX - minX),
    (h - 2 * margin) / (maxY - minY),
  );
  const offX = (w - (maxX - minX) * scale) / 2 - minX * scale;
  const offY = (h - (maxY - minY) * scale) / 2 - minY * scale;
  return Object.fromEntries(
    Object.entries(points).map(([name, [x, y]]) => [
      name,
      [offX + x * scale, offY + y * scale] as Pt,
    ]),
  );
}

// One of the four quadrilaterals, corners named A, B, C, D, with the marks
// asked for.
export function quad(kind: QuadKind, o: QuadOptions): FigureSpec {
  const w = o.w ?? 300;
  const h = o.h ?? 200;
  const base = QUAD_POINTS[kind];
  const pts: Record<string, Pt> = fitTo(base, w, h, o.names ? 26 : 14);
  const corner = (name: QuadCorner) => pts[name] as Pt;
  const polys: FigurePoly[] = [
    {
      v: CORNERS,
      tone: o.tone ?? "ink",
      ...(o.fill ? { fill: o.fill === true ? QUAD_TONE[kind] : o.fill } : {}),
    },
  ];
  const segs: FigureSeg[] = [...(o.segs ?? [])];
  const ticks: FigureTick[] = o.sides ? [...SIDE_MARKS[o.sides]] : [];
  const arrows: FigureArrow[] = o.parallel
    ? [...PARALLEL_MARKS[o.parallel]]
    : [];
  const rights: FigureRight[] = [];
  const angles: FigureAngle[] = [];
  const names: string[] = o.names ? [...CORNERS] : [];
  if (o.rights) {
    CORNERS.forEach((at, i) => {
      rights.push({
        at,
        a: CORNERS[(i + 3) % 4] as string,
        b: CORNERS[(i + 1) % 4] as string,
        tone: "violet",
      });
    });
  }
  for (const [at, text] of Object.entries(o.angles ?? {})) {
    const i = CORNERS.indexOf(at as QuadCorner);
    angles.push({
      at,
      a: CORNERS[(i + 3) % 4] as string,
      b: CORNERS[(i + 1) % 4] as string,
      text,
      tone: "violet",
      radius: 20,
      textDistance: 40,
    });
  }
  const dots: string[] = [];
  if (o.diagonals) {
    segs.push(
      { a: "A", b: "C", tone: "amber", bold: true },
      { a: "B", b: "D", tone: "amber", bold: true },
    );
    if (o.diagonals === "equal") {
      ticks.push({
        segs: [
          ["A", "C"],
          ["B", "D"],
        ],
        count: 2,
        tone: "blue",
        at: 0.22,
      });
    }
    const meet = lineIntersection(
      corner("A"),
      corner("C"),
      corner("B"),
      corner("D"),
    );
    if (meet && (o.diagonals === "perp" || o.diagonals === "mid")) {
      pts.O = meet;
      dots.push("O");
      names.push("O");
    }
    if (o.diagonals === "perp") {
      rights.push({ at: "O", a: "A", b: "B", tone: "violet" });
    }
    if (o.diagonals === "mid") {
      ticks.push(
        {
          segs: [
            ["A", "O"],
            ["O", "C"],
          ],
          count: 1,
          tone: "blue",
        },
        {
          segs: [
            ["B", "O"],
            ["O", "D"],
          ],
          count: 2,
          tone: "blue",
        },
      );
    }
  }
  return {
    label: o.label,
    w,
    h,
    pts,
    polys,
    ...(segs.length > 0 ? { segs } : {}),
    ...(names.length > 0 ? { names } : {}),
    ...(o.nameShift ? { nameShift: o.nameShift } : {}),
    ...(dots.length > 0 ? { dots } : {}),
    ...(ticks.length > 0 ? { ticks } : {}),
    ...(arrows.length > 0 ? { arrows } : {}),
    ...(rights.length > 0 ? { rights } : {}),
    ...(angles.length > 0 ? { angles } : {}),
    ...(o.texts ? { texts: o.texts } : {}),
  };
}

// A label written beside a point of the picture.
export const textAt = (
  x: number,
  y: number,
  text: string,
  tone: Tone = "ink",
  anchor: FigureText["anchor"] = "middle",
): FigureText => ({ x, y, text, tone, anchor });

// ---------------------------------------------------------------------------
// Shapes that are not one of the four (for choices and for the exercises)

type Size = { w?: number; h?: number };

// A polygon drawn alone with its own corner names, fitted to the drawing.
export function polygonFigure(
  label: string,
  o: Size & {
    points: Readonly<Record<string, Pt>>;
    names?: boolean;
    tone?: Tone;
    fill?: Tone;
    segs?: readonly FigureSeg[];
    ticks?: readonly FigureTick[];
    texts?: readonly FigureText[];
  },
): FigureSpec {
  const w = o.w ?? 300;
  const h = o.h ?? 200;
  return {
    label,
    w,
    h,
    pts: fitTo(o.points, w, h, o.names ? 26 : 14),
    polys: [
      {
        v: Object.keys(o.points),
        tone: o.tone ?? "ink",
        ...(o.fill ? { fill: o.fill } : {}),
      },
    ],
    ...(o.names ? { names: Object.keys(o.points) } : {}),
    ...(o.segs ? { segs: o.segs } : {}),
    ...(o.ticks ? { ticks: o.ticks } : {}),
    ...(o.texts ? { texts: o.texts } : {}),
  };
}

// A trapezoid whose legs are not equal: the left leg stands straight up.
export const rightTrapezoid = (
  label: string,
  o: Size & { names?: boolean } = {},
) =>
  polygonFigure(label, {
    ...o,
    points: { B: [60, 50], C: [150, 50], D: [250, 160], A: [60, 160] },
  });

// A pentagon: five sides, not a quadrilateral.
export const pentagonFigure = (
  label: string,
  o: Size & { names?: boolean } = {},
) =>
  polygonFigure(label, {
    ...o,
    points: Object.fromEntries(
      regularPoints(5, 150, 106, 78, -90).map((p, i) => [
        ["K", "J", "S", "R", "I"][i] as string,
        p,
      ]),
    ),
  });

// A quadrilateral with no equal sides and no parallel sides.
export const looseQuadrilateral = (
  label: string,
  o: Size & { names?: boolean; diagonals?: boolean } = {},
) =>
  polygonFigure(label, {
    ...o,
    points: { A: [70, 50], B: [230, 70], C: [250, 160], D: [50, 150] },
    ...(o.diagonals
      ? {
          segs: [
            { a: "A", b: "C", tone: "amber" as Tone, bold: true },
            { a: "B", b: "D", tone: "amber" as Tone, bold: true },
          ],
        }
      : {}),
  });

// ---------------------------------------------------------------------------
// Figures of the workbook exercises

// Figure 4.9 (example 1): the rectangle MNPQ, the rhombus EFGH joining the
// middles of its sides, and the rectangle ABCD joining the middles of the
// sides of that rhombus.
export function figure49(label: string): FigureSpec {
  const n: Pt = [40, 35];
  const p: Pt = [280, 35];
  const q: Pt = [280, 185];
  const m: Pt = [40, 185];
  const e = lerp(n, m, 0.5);
  const f = lerp(n, p, 0.5);
  const g = lerp(p, q, 0.5);
  const hPoint = lerp(m, q, 0.5);
  return {
    label,
    w: 320,
    h: 226,
    pts: {
      N: n,
      P: p,
      Q: q,
      M: m,
      E: e,
      F: f,
      G: g,
      H: hPoint,
      A: lerp(e, f, 0.5),
      B: lerp(f, g, 0.5),
      C: lerp(g, hPoint, 0.5),
      D: lerp(hPoint, e, 0.5),
    },
    polys: [
      { v: ["M", "N", "P", "Q"] },
      { v: ["E", "F", "G", "H"] },
      { v: ["A", "B", "C", "D"] },
    ],
    names: ["M", "N", "P", "Q", "E", "F", "G", "H", "A", "B", "C", "D"],
    nameShift: {
      A: [-4, -2],
      B: [4, -2],
      C: [4, 2],
      D: [-4, 2],
    },
  };
}

// The regular hexagon ABCDEF (A on the left, going clockwise) with its three
// main diagonals; `fill` paints the trapezoid of four of its corners.
export function hexagonDiagonals(
  label: string,
  fill?: { v: readonly string[]; tone: Tone },
): FigureSpec {
  const names = ["A", "B", "C", "D", "E", "F"];
  const corners = regularPoints(6, 160, 120, 100, 180);
  const pts: Record<string, Pt> = Object.fromEntries(
    names.map((name, i) => [name, corners[i] as Pt]),
  );
  pts.O = [160, 120];
  return {
    label,
    w: 320,
    h: 240,
    pts,
    polys: [
      ...(fill ? [{ v: fill.v, tone: "ink" as Tone, fill: fill.tone }] : []),
      { v: names },
    ],
    segs: [
      { a: "A", b: "D" },
      { a: "B", b: "E" },
      { a: "C", b: "F" },
    ],
    names,
  };
}

// One of the shapes of figures 4.11 and 4.12 on its own, fitted to a small
// drawing with its corner names.
function loneShape(
  label: string,
  points: Readonly<Record<string, Pt>>,
): FigureSpec {
  const fitted = fitTo(points, 170, 150, 28);
  return {
    label,
    w: 170,
    h: 150,
    maxScale: 1,
    pts: fitted,
    polys: [{ v: Object.keys(points) }],
    names: Object.keys(points),
  };
}

// Figure 4.11, one picture per shape: a trapezoid, a rectangle, a
// parallelogram and a rhombus.
export const FIGURE_411: readonly FigureSpec[] = [
  loneShape("Hình a: hình thang ABCD", {
    B: [39, 0],
    C: [94, 0],
    D: [115, 58],
    A: [0, 58],
  }),
  loneShape("Hình b: hình chữ nhật FGHE", {
    F: [0, 0],
    G: [106, 0],
    H: [106, 58],
    E: [0, 58],
  }),
  loneShape("Hình c: hình bình hành JKLI", {
    J: [16, 0],
    K: [122, 0],
    L: [106, 58],
    I: [0, 58],
  }),
  loneShape("Hình d: hình thoi MNOP", {
    M: [0, 56],
    N: [34, 0],
    O: [68, 56],
    P: [34, 112],
  }),
];

// Figure 4.12: a trapezoid with a straight leg, an isosceles trapezoid, a
// parallelogram and a pentagon.
export const FIGURE_412: readonly FigureSpec[] = [
  loneShape("Hình a: hình thang ABCD có một cạnh bên thẳng đứng", {
    B: [0, 0],
    C: [42, 0],
    D: [84, 58],
    A: [0, 58],
  }),
  loneShape("Hình b: hình thang cân MNPQ", {
    M: [28, 0],
    N: [90, 0],
    P: [118, 58],
    Q: [0, 58],
  }),
  loneShape("Hình c: hình bình hành EFGH", {
    E: [10, 0],
    F: [106, 0],
    G: [96, 58],
    H: [0, 58],
  }),
  loneShape(
    "Hình d: hình ngũ giác IJKRS",
    Object.fromEntries(
      regularPoints(5, 60, 60, 56, -90).map((p, i) => [
        ["K", "J", "S", "R", "I"][i] as string,
        p,
      ]),
    ),
  ),
];

// Figure 4.13: the rectangle ABCD and the quadrilateral MNPQ joining the
// middles of its sides (AB = 8, AD = 6 on a scale of 30 to the unit, so that
// the four sides of MNPQ are 5).
export function figure413(
  label: string,
  o: { sides?: boolean } = {},
): FigureSpec {
  const a: Pt = [30, 30];
  const b: Pt = [270, 30];
  const c: Pt = [270, 170];
  const d: Pt = [30, 170];
  return {
    label,
    w: 300,
    h: 200,
    pts: {
      A: a,
      B: b,
      C: c,
      D: d,
      N: lerp(a, b, 0.5),
      P: lerp(b, c, 0.5),
      Q: lerp(c, d, 0.5),
      M: lerp(d, a, 0.5),
    },
    polys: [{ v: ["A", "B", "C", "D"] }, { v: ["M", "N", "P", "Q"] }],
    names: ["A", "B", "C", "D", "M", "N", "P", "Q"],
    ...(o.sides
      ? {
          ticks: [
            {
              segs: [
                ["M", "N"],
                ["N", "P"],
                ["P", "Q"],
                ["Q", "M"],
              ],
              count: 1,
              tone: "blue" as Tone,
            },
          ],
        }
      : {}),
  };
}

// Figure 4.14: the rectangle ABCD (B top left, C top right, A bottom left, D
// bottom right) with a triangle on each side, so that E, F, P, Q are the
// corners of a parallelogram and B, C, D, A lie on its sides.
export function figure414(
  label: string,
  o: { diagonals?: boolean } = {},
): FigureSpec {
  const pts: Record<string, Pt> = {
    A: [110, 147],
    B: [110, 83],
    C: [210, 83],
    D: [210, 147],
    E: [35, 115],
    F: [160, 61.7],
    P: [285, 115],
    Q: [160, 168.3],
  };
  return {
    label,
    w: 320,
    h: 230,
    pts,
    polys: [{ v: ["E", "F", "P", "Q"] }, { v: ["A", "B", "C", "D"] }],
    names: ["A", "B", "C", "D", "E", "F", "P", "Q"],
    ...(o.diagonals
      ? {
          segs: [
            { a: "E", b: "P", tone: "amber" as Tone, bold: true },
            { a: "F", b: "Q", tone: "amber" as Tone, bold: true },
          ],
        }
      : {}),
  };
}

// Figure 4.15: five of the six corners of a regular hexagon on a circle with
// centre O (the sixth, F, is not drawn): the quadrilaterals OABC and OCDE
// and the trapezoid BEDC.
export function figure415(label: string): FigureSpec {
  const o: Pt = [160, 108];
  const r = 88;
  const circle = (from: number, to: number) => ({
    c: "O",
    r,
    from,
    to,
    tone: "mute" as Tone,
  });
  return {
    label,
    w: 320,
    h: 230,
    pts: {
      O: o,
      B: polar(o[0], o[1], r, 180),
      E: polar(o[0], o[1], r, 0),
      C: polar(o[0], o[1], r, 240),
      D: polar(o[0], o[1], r, 300),
      A: polar(o[0], o[1], r, 120),
    },
    arcs: [circle(0, 180), circle(180, 360)],
    segs: [
      { a: "B", b: "E" },
      { a: "O", b: "C" },
      { a: "O", b: "A" },
      { a: "B", b: "C" },
      { a: "C", b: "D" },
      { a: "D", b: "E" },
      { a: "A", b: "B" },
    ],
    names: ["A", "B", "C", "D", "E", "O"],
    nameShift: { O: [6, 4] },
    dots: ["O"],
  };
}

// ---------------------------------------------------------------------------
// Pieces put together: three triangles into a trapezoid, eight trapezoids
// into a hexagonal tray

// Three equilateral triangles in a strip (up, down, up) with the first
// `count` filled and the others as dashed outlines.
export function triangleStrip(
  label: string,
  o: { count: number; finished?: boolean },
): FigureSpec {
  const unit = 76;
  const height = (unit * Math.sqrt(3)) / 2;
  const left = 36;
  const top = 34;
  const pts: Record<string, Pt> = {
    B0: [left, top + height],
    B1: [left + unit, top + height],
    B2: [left + 2 * unit, top + height],
    U0: [left + unit / 2, top],
    U1: [left + (3 * unit) / 2, top],
  };
  // The strip is B0 B1 U0 (up), B1 U1 U0 (down), B1 B2 U1 (up); three
  // triangles make the trapezoid B0 B2 U1 U0.
  const triangles: readonly (readonly string[])[] = [
    ["B0", "B1", "U0"],
    ["B1", "U1", "U0"],
    ["B1", "B2", "U1"],
  ];
  const segs: FigureSeg[] = [];
  triangles.forEach((v, k) => {
    if (k < o.count) return;
    v.forEach((from, i) => {
      segs.push({
        a: from,
        b: v[(i + 1) % 3] as string,
        tone: "mute",
        dash: true,
      });
    });
  });
  return {
    label,
    w: 300,
    h: 134,
    pts,
    polys: triangles.slice(0, o.count).map((v) => ({
      v,
      tone: "ink" as Tone,
      fill: "teal" as Tone,
    })),
    ...(segs.length > 0 ? { segs } : {}),
    ...(o.finished
      ? {
          ticks: [
            {
              segs: [
                ["B0", "U0"],
                ["U0", "U1"],
                ["U1", "B2"],
              ],
              count: 1,
              tone: "blue" as Tone,
            },
          ],
        }
      : {}),
  };
}

// Corners of the tray: an outer regular hexagon of side 2u and an inner one
// of side u; eight equal trapezoids (bases 2u and u, legs u) fill it, six
// round the inner hexagon and two halves of the inner hexagon itself.
export function trayFigure(label: string, count: number): FigureSpec {
  const cx = 160;
  const cy = 120;
  const outerR = 104;
  const innerR = 52;
  const outer = regularPoints(6, cx, cy, outerR, 0);
  const inner = regularPoints(6, cx, cy, innerR, 0);
  const pts: Record<string, Pt> = {};
  outer.forEach((p, i) => {
    pts[`o${i}`] = p;
  });
  inner.forEach((p, i) => {
    pts[`i${i}`] = p;
  });
  // The two halves of the inner hexagon, cut along the diagonal i0-i3.
  const trapezoids: readonly (readonly string[])[] = [
    ["i0", "i1", "i2", "i3"],
    ["i3", "i4", "i5", "i0"],
    ...outer.map((_, k) => [
      `o${k}`,
      `o${(k + 1) % 6}`,
      `i${(k + 1) % 6}`,
      `i${k}`,
    ]),
  ];
  const segs: FigureSeg[] = [];
  trapezoids.forEach((v, k) => {
    if (k < count) return;
    v.forEach((from, i) => {
      segs.push({
        a: from,
        b: v[(i + 1) % v.length] as string,
        tone: "mute",
        dash: true,
      });
    });
  });
  return {
    label,
    w: 320,
    h: 240,
    pts,
    polys: trapezoids.slice(0, count).map((v) => ({
      v,
      tone: "ink" as Tone,
      fill: "sky" as Tone,
    })),
    ...(segs.length > 0 ? { segs } : {}),
  };
}
