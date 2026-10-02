import {
  type FigureSeg,
  type FigureSpec,
  type FigureText,
  type FigureTick,
  figureRegions,
  type Pt,
  type Tone,
} from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import {
  directionDeg,
  dist,
  polar,
  regularPoints,
} from "@/visuals/shared/plane/geometry";
import type { ProbeSpec } from "@/visuals/shared/plane/probe-model";
import type { AssembleSpec } from "./assemble";
import type { ConstructSpec } from "./construct";
import {
  type ConstructShape,
  constructFigure,
  solvedState,
} from "./construction";
import {
  CORNERS,
  figure44,
  figure45,
  figure46,
  figure47,
  figure48,
  hexTriangles,
  type LatticeCell,
  latticeLines,
  polygon,
  rectangle,
  type ShapeOptions,
  shape,
  sidePairs,
  squareGrid,
  triangleBySides,
  triangleLattice,
} from "./figures";
import type { GallerySpec } from "./gallery";

// Every picture of the lesson: the registry builds one entry per item (id
// `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu.visual.<key>`), so a new
// picture is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // A still figure; its polygons with a `region` are tappable in a
  // `tapRegion` exercise.
  | { kind: "figure"; figure: FigureSpec }
  // Pictures side by side, each with a caption.
  | ({ kind: "gallery" } & GallerySpec)
  // A figure that plays frame by frame.
  | ({ kind: "steps" } & StepsSpec)
  // A figure whose parts the child taps to measure (see `ProbeSpec`).
  | ({ kind: "probe" } & ProbeSpec)
  // A drawing board worked step by step (see `ConstructSpec`).
  | ({ kind: "construct" } & ConstructSpec)
  // Six triangles put together into a hexagon (see `AssembleSpec`).
  | ({ kind: "assemble" } & AssembleSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "probe",
  "construct",
  "assemble",
]);

// Validator id of the `manipulate` exercises a spec serves, if any.
export function validatorIdOf(spec: VisualSpec): string | undefined {
  if (spec.kind === "assemble") return "ghep-luc-giac";
  if (spec.kind !== "construct") return undefined;
  if (spec.shape === "triangle") return "ve-tam-giac-deu";
  return spec.diagonals ? "ve-hinh-vuong-cheo" : "ve-hinh-vuong";
}

// Ids of the tappable regions a spec declares.
export function regionsOf(spec: VisualSpec): string[] | undefined {
  if (spec.kind !== "figure") return undefined;
  const regions = figureRegions(spec.figure);
  return regions.length > 0 ? regions : undefined;
}

// ---------------------------------------------------------------------------
// Builders

// A small picture among options: it is never shown bigger than it is drawn.
const small = (figureSpec: FigureSpec): VisualSpec => ({
  kind: "figure",
  figure: { ...figureSpec, maxScale: 1 },
});

const figure = (figureSpec: FigureSpec): VisualSpec => ({
  kind: "figure",
  figure: figureSpec,
});

// A triangle among options with its side lengths written on it: drawn large
// in its cell and with big writing, so a 5 is never read as a 6.
const labelledTriangle = (
  sides: readonly [number, number, number],
): VisualSpec =>
  figure({
    ...triangleBySides(`Hình tam giác có ba cạnh ${sides.join(", ")}`, sides, {
      w: 170,
      h: 150,
      lengths: true,
      margin: 26,
    }),
    textSize: 22,
    maxScale: 1.6,
  });

// The three shapes at the size of a full-width picture, and as a thumbnail
// in a row of options or of the gallery.
const tri = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("tri", { label, w: 300, h: 204, cx: 150, cy: 126, r: 96, ...o });
const sq = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("sq", { label, w: 300, h: 196, cx: 150, cy: 98, r: 88, ...o });
const hex = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("hex", { label, w: 300, h: 240, cx: 150, cy: 120, r: 104, ...o });
const THUMB = { w: 140, h: 112 } as const;
const triThumb = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("tri", { label, ...THUMB, cx: 70, cy: 62, r: 46, ...o });
const sqThumb = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("sq", { label, ...THUMB, cx: 70, cy: 56, r: 42, ...o });
const hexThumb = (label: string, o: Partial<ShapeOptions> = {}) =>
  shape("hex", { label, ...THUMB, cx: 70, cy: 56, r: 50, ...o });

const steps = (
  label: string,
  frames: readonly { figure: FigureSpec; caption: string }[],
): VisualSpec => ({ kind: "steps", label, frames });

const frame = (figureSpec: FigureSpec, caption: string) => ({
  figure: figureSpec,
  caption,
});

const TICKS = { ticks: true } as const;
const MARKS = { ticks: true, angles: true } as const;
// The same marks on a small picture: the arcs without their measures.
const ARCS = { ticks: true, angles: "arcs" } as const;

// Centres of the shapes drawn above, named O.
const SQ_CENTRE = { O: [150, 98] } as const satisfies Record<string, Pt>;
const HEX_CENTRE = { O: [150, 120] } as const satisfies Record<string, Pt>;

const SQUARE_DIAGONALS = [
  ["A", "C"],
  ["B", "D"],
] as const;
const HEX_MAIN = [
  ["A", "D"],
  ["B", "E"],
  ["C", "F"],
] as const;
const HEX_SHORT = [
  ["A", "C"],
  ["B", "D"],
  ["C", "E"],
  ["D", "F"],
  ["E", "A"],
  ["F", "B"],
] as const;

const HEX_SIDES = sidePairs(CORNERS.hex);

const segsOf = (
  pairs: readonly (readonly [string, string])[],
  o: { tone?: Tone; dash?: boolean; bold?: boolean } = {},
): FigureSeg[] => pairs.map(([a, b]) => ({ a, b, ...o }));

// Strokes marking equal diagonals, near one end so two of them never meet in
// the middle.
const equalDiagonals = (pairs: readonly (readonly [string, string])[]) => ({
  segs: pairs,
  count: 2,
  tone: "blue" as Tone,
  at: 0.22,
});

// ---------------------------------------------------------------------------
// The finished drawing boards, and the frames that lead to them

// What the board shows once a figure of this side is drawn, without the
// ruler and the compass writing: the picture of the rule.
function finishedBoard(
  shapeKind: ConstructShape,
  names: readonly string[],
  side: number,
  label: string,
): FigureSpec {
  const board = constructFigure(
    shapeKind,
    names,
    solvedState(shapeKind, side, false),
  );
  // Only the sides stay: the ruler, the compass span and the guide lines of
  // the board are left out.
  const { ruler: _ruler, texts: _texts, dots: _dots, ...rest } = board;
  const sides = (rest.segs ?? []).filter(
    (seg) => seg.tone === "ink" && !seg.dash,
  );
  const around = names.map((name, i) => [
    name,
    names[(i + 1) % names.length] as string,
  ]) as [string, string][];
  return {
    ...rest,
    label,
    segs: sides,
    ticks: [{ segs: around, count: 1, tone: "blue" }],
    ...(shapeKind === "square"
      ? {
          rights: names.map((at, i) => ({
            at,
            a: names[(i + 3) % 4] as string,
            b: names[(i + 1) % 4] as string,
            tone: "violet" as Tone,
          })),
        }
      : {}),
  };
}

const TRI_NAMES = ["A", "B", "C"] as const;
const SQ_NAMES = ["A", "B", "C", "D"] as const;

// The frames of drawing an equilateral triangle on the board, up to the
// first `upTo` of them.
function triangleFrames(
  side: number,
  names: readonly string[] = TRI_NAMES,
  upTo = 5,
): StepsSpec["frames"] {
  const [first = "A", second = "B", third = "C"] = names;
  const board = (state: Record<string, number>) =>
    constructFigure("triangle", names, state);
  return [
    frame(board({ len: side }), `Vẽ cạnh ${first}${second} dài ${side} cm`),
    frame(board({ len: side, open: side }), `Mở compa bằng ${side} cm`),
    frame(
      board({ len: side, open: side, arcM: 1, arcN: 1 }),
      `Vẽ hai cung tròn từ ${first} và từ ${second}`,
    ),
    frame(
      board({ len: side, open: side, arcM: 1, arcN: 1, apex: 1 }),
      `Hai cung gặp nhau tại ${third}`,
    ),
    frame(
      finishedBoard(
        "triangle",
        names,
        side,
        `Hình tam giác đều ${first}${second}${third} vẽ xong`,
      ),
      `Nối ${third} với ${first} và ${second}`,
    ),
  ].slice(0, upTo);
}

// The frames of drawing a square on the board, up to the first `upTo`; with
// `diagonals` it goes on to the two diagonals and the right angle between
// them.
function squareFrames(
  side: number,
  names: readonly string[] = SQ_NAMES,
  o: { upTo?: number; diagonals?: boolean } = {},
): StepsSpec["frames"] {
  const [first = "A", second = "B", third = "C", fourth = "D"] = names;
  const board = (state: Record<string, number>) =>
    constructFigure("square", names, state);
  const sides = { len: side, perpD: 1, perpE: 1, h: side, join: 1 };
  const frames = [
    frame(board({ len: side }), `Vẽ cạnh ${first}${second} dài ${side} cm`),
    frame(
      board({ len: side, perpD: 1, perpE: 1 }),
      "Dùng êke vẽ hai đường vuông góc",
    ),
    frame(
      board({ len: side, perpD: 1, perpE: 1, h: side }),
      `Lấy ${first}${fourth} và ${second}${third} cùng dài ${side} cm`,
    ),
    frame(
      o.diagonals
        ? board(sides)
        : finishedBoard(
            "square",
            names,
            side,
            `Hình vuông ${first}${second}${third}${fourth} vẽ xong`,
          ),
      `Nối ${fourth} với ${third}`,
    ),
  ];
  if (o.diagonals) {
    frames.push(
      frame(
        board({ ...sides, diag1: 1, diag2: 1 }),
        `Vẽ hai đường chéo ${first}${third} và ${second}${fourth}`,
      ),
      frame(
        board({ ...sides, diag1: 1, diag2: 1, ans: 1 }),
        "Êke khít: hai đường chéo vuông góc",
      ),
    );
  }
  return frames.slice(0, o.upTo ?? frames.length);
}

const sideProbe = (
  pairs: readonly (readonly [string, string])[],
  text: string,
  tone: Tone,
) =>
  pairs.map(([a, b]) => ({
    kind: "seg" as const,
    a,
    b,
    text,
    label: `Cạnh ${a}${b}`,
    tone,
  }));

const angleProbe = (
  triples: readonly (readonly [string, string, string])[],
  text: string,
  o: { right?: boolean } = {},
) =>
  triples.map(([at, a, b]) => ({
    kind: "angle" as const,
    at,
    a,
    b,
    text,
    label: `Góc ${at}`,
    tone: "violet" as Tone,
    ...(o.right ? { right: true } : {}),
  }));

// A label written beside a point of the picture.
const textAt = (
  x: number,
  y: number,
  text: string,
  tone: Tone = "ink",
  anchor: FigureText["anchor"] = "middle",
): FigureText => ({ x, y, text, tone, anchor });

// ---------------------------------------------------------------------------
// Shapes for the sections on finding shapes inside a bigger one

const SQUARE_SIDES = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "A"],
] as const;

// A big triangle DEF of side 4·u (the points G, H, K are the midpoints of its
// sides, P1, P2, P3 those of the top triangle DGH): cut into four triangles
// by the lines between G, H and K, and the top one cut again into four. It
// holds 4 small, 4 medium and 1 big equilateral triangle: 9 in all.
const NINE_CELLS = {
  D: [0, 0],
  E: [4, 0],
  F: [4, 4],
  G: [2, 0],
  H: [2, 2],
  K: [4, 2],
  P1: [1, 0],
  P2: [1, 1],
  P3: [2, 1],
} as const satisfies Record<string, LatticeCell>;

function triangleOfNine(label: string): FigureSpec {
  return triangleLattice(label, {
    w: 300,
    h: 262,
    side: 230,
    n: 4,
    cells: NINE_CELLS,
    labelled: ["D", "E", "F", "G", "H", "K"],
    outer: ["D", "E", "F"],
    lines: [
      [
        [2, 0],
        [2, 2],
      ],
      [
        [2, 0],
        [4, 2],
      ],
      [
        [2, 2],
        [4, 2],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      [
        [1, 0],
        [2, 1],
      ],
      [
        [1, 1],
        [2, 1],
      ],
    ],
  });
}

// A triangle ABC of side 3·u cut into nine equal triangles by the lines
// parallel to its sides: 9 small, 3 medium and 1 big equilateral triangle, 13
// in all.
const triangleOfThirteen = (label: string): FigureSpec =>
  triangleLattice(label, {
    w: 300,
    h: 262,
    side: 230,
    n: 3,
    cells: { A: [0, 0], B: [3, 0], C: [3, 3] },
    labelled: ["A", "B", "C"],
    outer: ["A", "B", "C"],
    lines: latticeLines(3),
  });

// Three equilateral triangles in a row, point up, point down, point up: a
// trapezoid, no bigger triangle.
function triangleStrip(label: string): FigureSpec {
  const u = 84;
  const h = (u * Math.sqrt(3)) / 2;
  const top = 36;
  const left = 66;
  return {
    label,
    w: 300,
    h: 160,
    pts: {
      B0: [left, top + h],
      B1: [left + u, top + h],
      B2: [left + 2 * u, top + h],
      U0: [left + u / 2, top],
      U1: [left + (3 * u) / 2, top],
    },
    polys: [
      { v: ["B0", "B1", "U0"] },
      { v: ["B1", "U1", "U0"] },
      { v: ["B1", "B2", "U1"] },
    ],
  };
}

// A hexagon cut into six equilateral triangles by its three main diagonals.
const hexByDiagonals = (label: string): FigureSpec =>
  shape("hex", {
    label,
    w: 300,
    h: 240,
    cx: 150,
    cy: 120,
    r: 104,
    segs: segsOf(HEX_MAIN),
    extraPts: HEX_CENTRE,
  });

// A shape of the exercise on tapping: a stretched hexagon whose sides are
// not all equal.
function stretchedHexagon(cx: number, cy: number): Pt[] {
  return [
    [cx - 52, cy],
    [cx - 26, cy - 20],
    [cx + 26, cy - 20],
    [cx + 52, cy],
    [cx + 26, cy + 20],
    [cx - 26, cy + 20],
  ];
}

// Six separate outlines to tap: two regular hexagons (one turned), a regular
// octagon, a square, an equilateral triangle and the stretched hexagon.
function hexagonGallery(): FigureSpec {
  const colX = [53, 160, 267];
  const rowY = [66, 188];
  const pts: Record<string, Pt> = {};
  const add = (prefix: string, points: readonly Pt[]) =>
    points.forEach((p, i) => {
      pts[`${prefix}${i}`] = p;
    });
  add("h1", regularPoints(6, colX[0] as number, rowY[0] as number, 44, 0));
  add("h2", regularPoints(8, colX[1] as number, rowY[0] as number, 44, -112.5));
  add("h3", regularPoints(4, colX[2] as number, rowY[0] as number, 46, -135));
  add("h4", regularPoints(6, colX[0] as number, rowY[1] as number, 44, 30));
  add("h5", regularPoints(3, colX[1] as number, rowY[1] as number, 46, -90));
  add("h6", stretchedHexagon(colX[2] as number, rowY[1] as number));
  const poly = (key: string, count: number, id: number) => ({
    v: Array.from({ length: count }, (_, i) => `${key}${i}`),
    fill: "mute" as Tone,
    region: `hinh-${id}`,
    label: `Hình ${id}`,
  });
  return {
    label: "Sáu hình để chạm chọn",
    w: 320,
    h: 254,
    pts,
    polys: [
      poly("h1", 6, 1),
      poly("h2", 8, 2),
      poly("h3", 4, 3),
      poly("h4", 6, 4),
      poly("h5", 3, 5),
      poly("h6", 6, 6),
    ],
    texts: [
      textAt(colX[0] as number, 126, "1"),
      textAt(colX[1] as number, 126, "2"),
      textAt(colX[2] as number, 126, "3"),
      textAt(colX[0] as number, 246, "4"),
      textAt(colX[1] as number, 246, "5"),
      textAt(colX[2] as number, 246, "6"),
    ],
  };
}

// A rhombus (four equal sides, `angle` and its supplement as the angles) for
// the compass and set-square check, corners named bottom left, top left, top
// right, bottom right. `sample` marks its first side as the one the compass is
// opened to.
function rhombus(
  label: string,
  o: {
    names?: readonly [string, string, string, string];
    angle?: number;
    sample?: boolean;
  } = {},
): FigureSpec {
  const [a0, b0, c0, d0] = o.names ?? ["A", "B", "C", "D"];
  const side = 100;
  const a: Pt = [100, 168];
  const d: Pt = [a[0] + side, a[1]];
  const b: Pt = polar(a[0], a[1], side, -(o.angle ?? 60));
  const c: Pt = [b[0] + side, b[1]];
  return {
    label,
    w: 300,
    h: 210,
    pts: { [a0]: a, [b0]: b, [c0]: c, [d0]: d },
    polys: [{ v: [a0, b0, c0, d0] }],
    names: [a0, b0, c0, d0],
    ...(o.sample
      ? {
          segs: [{ a: a0, b: b0, tone: "teal" as Tone, bold: true }],
          texts: [textAt(80, 112, "cạnh mẫu", "teal", "end")],
        }
      : {}),
  };
}

// The square MNPQ of Figure 4.6 drawn on its own and bigger: N and P above,
// M and Q below.
function squareMNPQ(label: string): FigureSpec {
  const side = 150;
  const left = (300 - side) / 2;
  const top = 36;
  return {
    label,
    w: 300,
    h: top + side + 36,
    pts: {
      N: [left, top],
      P: [left + side, top],
      Q: [left + side, top + side],
      M: [left, top + side],
    },
    polys: [{ v: ["M", "N", "P", "Q"] }],
    names: ["M", "N", "P", "Q"],
  };
}

// ---------------------------------------------------------------------------
// Figures of the workbook exercises 4.5 to 4.7, with the marks of the hints

// Figure 4.6 with compass arcs: round A through B and C (AB = AC), and, for
// the solution, round B through A, which runs past C because BC is shorter.
const FIG46 = figure46();
const fig46Point = (name: string) => FIG46.pts[name] as Pt;
const fig46Arcs = (withSecond: boolean) => [
  {
    c: "A",
    r: dist(fig46Point("A"), fig46Point("B")),
    from: directionDeg(fig46Point("A"), fig46Point("C")),
    to: directionDeg(fig46Point("A"), fig46Point("B")),
    tone: "teal" as Tone,
  },
  ...(withSecond
    ? [
        {
          c: "B",
          r: dist(fig46Point("B"), fig46Point("A")),
          from: directionDeg(fig46Point("B"), fig46Point("A")),
          to: 6,
          tone: "teal" as Tone,
        },
      ]
    : []),
];
const SQUARE_MNPQ = [
  ["M", "N"],
  ["N", "P"],
  ["P", "Q"],
  ["Q", "M"],
] as const;

// Tiny triangle strip of the hexagon exercises: one equilateral triangle, as
// a frame of a hint, painted in a colour.
const tone = (fill: Tone) => ({ tone: "ink" as Tone, fill });

// Every triangle is teal, the colour of the equilateral triangle; the two big
// ones tell apart by their strokes, 2 on ACE and 3 on BDF.
const FIG48_BIG_ACE = [{ v: ["A", "C", "E"], ...tone("teal") }] as const;
const FIG48_BIG_BDF = [{ v: ["B", "D", "F"], ...tone("teal") }] as const;
const FIG48_BIG_TICKS = [
  {
    segs: [
      ["A", "C"],
      ["C", "E"],
      ["E", "A"],
    ],
    count: 2,
    tone: "blue",
  },
  {
    segs: [
      ["B", "D"],
      ["D", "F"],
      ["F", "B"],
    ],
    count: 3,
    tone: "blue",
  },
] as const satisfies readonly FigureTick[];
const FIG48_SMALL = [
  ["A", "S", "R"],
  ["B", "M", "S"],
  ["C", "M", "N"],
  ["D", "N", "P"],
  ["E", "P", "Q"],
  ["F", "Q", "R"],
].map((v) => ({ v, ...tone("teal") }));

// A hexagon of six triangles, with its main diagonal AD when `diagonal`.
const hexOfSix = (label: string, diagonal: boolean) =>
  hexTriangles(label, {
    w: 300,
    h: 240,
    cx: 150,
    cy: 120,
    r: 104,
    count: 6,
    names: true,
    ...(diagonal ? { diagonal: ["A", "D"] as const } : {}),
  });

// Shapes the lead-ins of 4.1 ask to tell apart.
const octagon = polygon("Hình có tám cạnh", {
  ...THUMB,
  points: regularPoints(8, 70, 56, 46, -112.5),
});
const trapezoid = polygon("Hình có bốn cạnh, hai cạnh song song", {
  ...THUMB,
  points: [
    [44, 34],
    [96, 34],
    [118, 84],
    [22, 84],
  ],
});
const triangleDown = polygon("Hình tam giác đều quay đầu xuống", {
  ...THUMB,
  points: regularPoints(3, 70, 56, 50, 90),
});

// Hint of exercise 4.5a: the same check on another triangle XYZ with XY = XZ
// = 5 and YZ = 8. The compass, needle on X, reaches both Y and Z; the check
// of YZ is left as "?". The drawing is taller than the triangle because the
// arc through Y and Z bulges under YZ.
const SBT_4_5A_HINT: FigureSpec = (() => {
  const base = triangleBySides(
    "Kim compa ở X, đầu bút chạm cả Y và Z",
    [5, 5, 8],
    { w: 300, h: 150, names: ["X", "Y", "Z"], margin: 30 },
  );
  const [x, y, z] = [base.pts.X, base.pts.Y, base.pts.Z] as [Pt, Pt, Pt];
  const arcDepth = dist(x, y) - (z[1] - x[1]);
  return {
    ...base,
    h: Math.ceil(z[1] + arcDepth + 16),
    arcs: [
      {
        c: "X",
        r: dist(x, y),
        from: directionDeg(x, z),
        to: directionDeg(x, y),
        tone: "teal" as Tone,
      },
    ],
    ticks: [
      {
        segs: [
          ["X", "Y"],
          ["X", "Z"],
        ],
        count: 1,
        tone: "blue" as Tone,
      },
    ],
    texts: [textAt((y[0] + z[0]) / 2, y[1] - 22, "YZ: ?", "amber")],
  };
})();

// Hint of exercise "choose the equilateral triangle": a triangle with two
// sides of 4 and the third left as "?", and the one thing to check.
const TRIANGLE_HINT: FigureSpec = (() => {
  const base = triangleBySides(
    "Hình tam giác có hai cạnh dài 4 và một cạnh chưa biết",
    [4, 4, 4],
    { w: 300, h: 200, lengths: true },
  );
  // The lengths are written in the order left side, right side, base.
  const [left, right, bottom] = base.texts as [
    FigureText,
    FigureText,
    FigureText,
  ];
  return {
    ...base,
    h: 240,
    texts: [
      left,
      right,
      { ...bottom, text: "?", tone: "amber" },
      textAt(150, 222, "Ba cạnh phải cùng một số"),
    ],
  };
})();

// ---------------------------------------------------------------------------
// The catalog

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Hình đều quanh ta
  "doi-song-ba-vat": {
    kind: "gallery",
    label: "Gạch lát nền, tổ ong và biển báo nguy hiểm",
    items: [
      { scene: "tiles", caption: "Gạch lát nền" },
      { scene: "honeycomb", caption: "Tổ ong" },
      { scene: "sign", caption: "Biển báo nguy hiểm" },
    ],
  },
  "ba-hinh-deu": {
    kind: "gallery",
    label: "Hình tam giác đều, hình vuông và hình lục giác đều",
    items: [
      {
        figure: triThumb("Hình tam giác đều", { ...ARCS, fill: "teal" }),
        caption: "Hình tam giác đều",
      },
      {
        figure: sqThumb("Hình vuông", { ...ARCS, fill: "pink" }),
        caption: "Hình vuông",
      },
      {
        figure: hexThumb("Hình lục giác đều", { ...ARCS, fill: "lime" }),
        caption: "Hình lục giác đều",
      },
    ],
  },
  "hinh-deu-vi-du-vuong": figure(
    sq("Hình vuông có các cạnh bằng nhau và các góc bằng nhau", MARKS),
  ),
  "do-canh-hinh-vuong": {
    kind: "probe",
    figure: sq("Hình vuông ABCD", { names: true }),
    parts: sideProbe(SQUARE_SIDES, "3 cm", "blue"),
    verb: "đo",
    done: "Cả bốn cạnh đều dài 3 cm.",
  },
  "th-tam-giac-deu": small(triThumb("Hình tam giác có ba cạnh bằng nhau")),
  "th-hinh-vuong": small(sqThumb("Hình vuông")),
  "th-luc-giac-deu": small(hexThumb("Hình lục giác đều")),
  "th-chu-nhat": small(
    rectangle("Hình có hai cạnh dài và hai cạnh ngắn", {
      ...THUMB,
      width: 100,
      height: 56,
    }),
  ),
  "th-tam-giac-lech": small(
    triangleBySides(
      "Hình tam giác có ba cạnh dài ngắn khác nhau",
      [7, 5, 9],
      THUMB,
    ),
  ),

  // 2. Hình tam giác đều
  "tam-giac-deu-cac-buoc": steps(
    "Hình tam giác đều ABC có ba cạnh và ba góc bằng nhau",
    [
      frame(
        tri("Hình tam giác đều ABC", { names: true, fill: "teal" }),
        "Hình tam giác đều ABC",
      ),
      frame(
        tri("Ba cạnh bằng nhau", { names: true, fill: "teal", ...TICKS }),
        "Ba cạnh bằng nhau",
      ),
      frame(
        tri("Ba góc bằng nhau", { names: true, fill: "teal", ...MARKS }),
        "Ba góc bằng nhau, mỗi góc 60°",
      ),
    ],
  ),
  "tam-giac-deu-quy-tac": figure(
    tri("Hình tam giác đều: ba cạnh bằng nhau, ba góc 60°", {
      ...MARKS,
      fill: "teal",
    }),
  ),
  "do-tam-giac-deu": {
    kind: "probe",
    figure: tri("Hình tam giác đều ABC", { names: true, fill: "teal" }),
    parts: [
      ...sideProbe(
        [
          ["A", "B"],
          ["B", "C"],
          ["C", "A"],
        ],
        "3 cm",
        "blue",
      ),
      ...angleProbe(
        [
          ["A", "B", "C"],
          ["B", "C", "A"],
          ["C", "A", "B"],
        ],
        "60°",
      ),
    ],
    verb: "đo",
    done: "Ba cạnh đều dài 3 cm và ba góc đều bằng 60°.",
  },
  "tam-giac-deu-ab-6": figure(
    tri("Hình tam giác đều ABC có cạnh AB = 6 cm", {
      names: true,
      texts: [textAt(98, 96, "6 cm", "ink", "end")],
    }),
  ),
  "tam-giac-5-5-5": labelledTriangle([5, 5, 5]),
  "tam-giac-5-5-6": labelledTriangle([5, 5, 6]),
  "tam-giac-4-5-6": labelledTriangle([4, 5, 6]),
  "tam-giac-3-3-5": labelledTriangle([3, 3, 5]),
  "tam-giac-4-4-hoi": figure(TRIANGLE_HINT),
  // The triangle of the fill-in exercise, full size, its three sides marked
  // equal.
  "tam-giac-deu-vach": figure(
    tri("Hình tam giác đều có ba cạnh bằng nhau", {
      ...TICKS,
      fill: "teal",
    }),
  ),

  // 3. Hình vuông
  "hinh-vuong-cac-buoc": steps(
    "Hình vuông ABCD có bốn cạnh và bốn góc bằng nhau",
    [
      frame(
        sq("Hình vuông ABCD", { names: true, fill: "pink" }),
        "Hình vuông ABCD",
      ),
      frame(
        sq("Bốn cạnh bằng nhau", { names: true, fill: "pink", ...TICKS }),
        "Bốn cạnh bằng nhau",
      ),
      frame(
        sq("Bốn góc vuông", { names: true, fill: "pink", ...MARKS }),
        "Bốn góc vuông, mỗi góc 90°",
      ),
    ],
  ),
  "hinh-vuong-quy-tac": figure(
    sq("Hình vuông: bốn cạnh bằng nhau, bốn góc vuông", {
      ...MARKS,
      fill: "pink",
    }),
  ),
  "do-hinh-vuong": {
    kind: "probe",
    figure: sq("Hình vuông ABCD", { names: true, fill: "pink" }),
    parts: angleProbe(
      [
        ["A", "D", "B"],
        ["B", "A", "C"],
        ["C", "B", "D"],
        ["D", "C", "A"],
      ],
      "90°",
      { right: true },
    ),
    verb: "đo",
    done: "Cả bốn góc đều bằng 90°, là góc vuông.",
  },
  "hinh-vuong-ab-7": figure(
    sq("Hình vuông ABCD có cạnh AB = 7 cm", {
      names: true,
      texts: [textAt(150, 24, "7 cm")],
    }),
  ),

  // 4. Đường chéo của hình vuông
  "hinh-vuong-cheo-cac-buoc": steps("Hai đường chéo của hình vuông ABCD", [
    frame(
      sq("Hình vuông ABCD", {
        names: true,
        fill: "pink",
        dots: ["A", "B", "C", "D"],
      }),
      "Hình vuông ABCD có bốn đỉnh",
    ),
    frame(
      sq("Đường chéo AC", {
        names: true,
        fill: "pink",
        dots: ["A", "B", "C", "D"],
        segs: segsOf([["A", "C"]], { tone: "amber", bold: true }),
      }),
      "Đường chéo AC nối A và C",
    ),
    frame(
      sq("Đường chéo AC và BD", {
        names: true,
        fill: "pink",
        dots: ["A", "B", "C", "D"],
        segs: segsOf(SQUARE_DIAGONALS, { tone: "amber", bold: true }),
      }),
      "Đường chéo BD nối B và D",
    ),
    frame(
      sq("Hai đường chéo bằng nhau và vuông góc", {
        names: true,
        fill: "pink",
        segs: segsOf(SQUARE_DIAGONALS, { tone: "amber", bold: true }),
        extraPts: SQ_CENTRE,
        ticksExtra: [equalDiagonals(SQUARE_DIAGONALS)],
        rights: [{ at: "O", a: "A", b: "B", tone: "violet" }],
      }),
      "Bằng nhau và vuông góc",
    ),
  ]),
  "hinh-vuong-cheo-quy-tac": figure(
    sq("Hình vuông có hai đường chéo bằng nhau và vuông góc", {
      fill: "pink",
      segs: segsOf(SQUARE_DIAGONALS, { tone: "amber", bold: true }),
      extraPts: SQ_CENTRE,
      ticksExtra: [equalDiagonals(SQUARE_DIAGONALS)],
      rights: [{ at: "O", a: "A", b: "B", tone: "violet" }],
    }),
  ),
  "do-duong-cheo-vuong": {
    kind: "probe",
    figure: sq("Hình vuông ABCD cạnh 3 cm với hai đường chéo", {
      names: true,
      fill: "pink",
      segs: segsOf(SQUARE_DIAGONALS, { tone: "mute", dash: true }),
      extraPts: SQ_CENTRE,
      // Room under the square for the two measures, one line each.
      h: 240,
    }),
    parts: [
      ...sideProbe([["A", "C"]], "AC = 4,2 cm", "amber").map((part) => ({
        ...part,
        label: "Đường chéo AC",
        at: 0.1,
        textAt: [150, 192] as Pt,
      })),
      ...sideProbe([["B", "D"]], "BD = 4,2 cm", "amber").map((part) => ({
        ...part,
        label: "Đường chéo BD",
        at: 0.1,
        textAt: [150, 218] as Pt,
      })),
      {
        kind: "angle" as const,
        at: "O",
        a: "A",
        b: "B",
        text: "90°",
        label: "Góc ở chỗ hai đường chéo cắt nhau",
        tone: "violet" as Tone,
        right: true,
      },
    ],
    verb: "đo",
    done: "Hai đường chéo bằng nhau và cắt nhau tạo thành góc 90°.",
  },
  "hinh-vuong-cheo-ac-8": figure(
    sq("Hình vuông ABCD có đường chéo AC = 8 cm", {
      names: true,
      segs: [
        ...segsOf([["A", "C"]], { tone: "amber", bold: true }),
        ...segsOf([["B", "D"]], { tone: "amber", dash: true }),
      ],
      texts: [textAt(150, 206, "AC = 8 cm", "amber")],
      h: 222,
    }),
  ),
  "hinh-vuong-abcd-ten": figure(
    sq("Hình vuông ABCD", { names: true, dots: ["A", "B", "C", "D"] }),
  ),

  // 5. Hình lục giác đều
  "luc-giac-deu-cac-buoc": steps(
    "Hình lục giác đều ABCDEF có sáu cạnh và sáu góc bằng nhau",
    [
      frame(
        hex("Hình lục giác đều ABCDEF", { names: true, fill: "lime" }),
        "Hình lục giác đều ABCDEF",
      ),
      frame(
        hex("Sáu cạnh bằng nhau", { names: true, fill: "lime", ...TICKS }),
        "Sáu cạnh bằng nhau",
      ),
      frame(
        hex("Sáu góc bằng nhau", { names: true, fill: "lime", ...MARKS }),
        "Sáu góc bằng nhau, mỗi góc 120°",
      ),
    ],
  ),
  "luc-giac-deu-quy-tac": figure(
    hex("Hình lục giác đều: sáu cạnh bằng nhau, sáu góc 120°", {
      ...MARKS,
      fill: "lime",
    }),
  ),
  "do-luc-giac-deu": {
    kind: "probe",
    figure: hex("Hình lục giác đều ABCDEF", { names: true, fill: "lime" }),
    parts: sideProbe(HEX_SIDES, "3 cm", "blue"),
    verb: "đo",
    done: "Cả sáu cạnh đều dài 3 cm.",
  },
  "chon-luc-giac": figure(hexagonGallery()),
  // Hint of the exercise on tapping: a regular hexagon turned to neither of
  // the two directions of the pictures, its sides and angles marked, with the
  // two things to check beside it. It stays short: it shows under the six
  // shapes of the exercise and must fit on a phone screen above the buttons.
  "luc-giac-deu-goi-y": figure({
    ...hex("Hình lục giác đều xoay nghiêng, các cạnh và các góc bằng nhau", {
      ...ARCS,
      fill: "lime",
      turn: 15,
      w: 300,
      h: 110,
      cx: 62,
      cy: 55,
      r: 46,
      texts: [
        textAt(126, 30, "Đếm số cạnh.", "ink", "start"),
        textAt(126, 58, "Các cạnh có", "ink", "start"),
        textAt(126, 82, "bằng nhau không?", "ink", "start"),
      ],
    }),
    maxScale: 1,
  }),
  "luc-giac-deu-abcdef-8": figure(
    hex("Hình lục giác đều ABCDEF có cạnh AB = 8 cm", {
      names: true,
      texts: [textAt(78, 196, "8 cm", "ink", "end")],
    }),
  ),

  // 6. Đường chéo của hình lục giác đều
  "luc-giac-cheo-cac-buoc": steps(
    "Đường chéo chính và đường chéo phụ của hình lục giác đều",
    [
      frame(
        hex("Hình lục giác đều ABCDEF", {
          names: true,
          fill: "lime",
          extraPts: HEX_CENTRE,
        }),
        "Hình lục giác đều ABCDEF",
      ),
      frame(
        hex("Đường chéo chính AD", {
          names: true,
          fill: "lime",
          extraPts: HEX_CENTRE,
          segs: segsOf([["A", "D"]], { tone: "amber", bold: true }),
          dots: ["O"],
        }),
        "Đường chéo chính AD nối hai đỉnh đối diện nhau",
      ),
      frame(
        hex("Ba đường chéo chính", {
          names: true,
          fill: "lime",
          extraPts: HEX_CENTRE,
          segs: segsOf(HEX_MAIN, { tone: "amber", bold: true }),
          dots: ["O"],
        }),
        "Ba đường chéo chính AD, BE, CF",
      ),
      frame(
        hex("Đường chéo phụ", {
          names: true,
          fill: "lime",
          extraPts: HEX_CENTRE,
          segs: [
            ...segsOf(HEX_MAIN, { tone: "amber", bold: true }),
            ...segsOf(HEX_SHORT, { tone: "amber", dash: true }),
          ],
          dots: ["O"],
        }),
        "Đường chéo phụ nối hai đỉnh mà giữa chúng chỉ có một đỉnh",
      ),
    ],
  ),
  "luc-giac-cheo-quy-tac": figure(
    hex("Hình lục giác đều có ba đường chéo chính bằng nhau", {
      fill: "lime",
      extraPts: HEX_CENTRE,
      dots: ["O"],
      segs: segsOf(HEX_MAIN, { tone: "amber", bold: true }),
      ticksExtra: [equalDiagonals(HEX_MAIN)],
    }),
  ),
  "do-cheo-chinh": {
    kind: "probe",
    figure: hex("Hình lục giác đều ABCDEF với ba đường chéo chính", {
      names: true,
      fill: "lime",
      extraPts: HEX_CENTRE,
      dots: ["O"],
      segs: segsOf(HEX_MAIN, { tone: "mute", dash: true }),
    }),
    parts: [
      ["A", "D"],
      ["B", "E"],
      ["C", "F"],
    ].map(([a, b]) => ({
      kind: "seg" as const,
      a: a as string,
      b: b as string,
      text: "6 cm",
      label: `Đường chéo chính ${a}${b}`,
      tone: "amber" as Tone,
      at: 0.15,
    })),
    verb: "đo",
    done: "Ba đường chéo chính đều dài 6 cm.",
  },
  "luc-giac-abcdef-ten": figure(
    hex("Hình lục giác đều ABCDEF", {
      names: true,
      dots: [...["A", "B", "C", "D", "E", "F"]],
    }),
  ),
  "luc-giac-cheo-ad-12": figure(
    hex("Hình lục giác đều ABCDEF có đường chéo chính AD = 12 cm", {
      names: true,
      extraPts: HEX_CENTRE,
      segs: [
        ...segsOf([["A", "D"]], { tone: "amber", bold: true }),
        ...segsOf(
          [
            ["B", "E"],
            ["C", "F"],
          ],
          { tone: "amber", dash: true },
        ),
      ],
      texts: [textAt(150, 254, "AD = 12 cm", "amber")],
      h: 268,
    }),
  ),

  // 7. Ghép hình lục giác đều
  "ghep-cac-buoc": steps(
    "Sáu hình tam giác đều ghép thành hình lục giác đều",
    [1, 2, 3, 4, 5, 6]
      .map((count) =>
        frame(
          hexTriangles(`Đã ghép ${count} miếng`, {
            w: 300,
            h: 240,
            cx: 150,
            cy: 120,
            r: 104,
            count,
          }),
          count === 6
            ? "Sáu miếng ghép thành hình lục giác đều"
            : `Đã ghép ${count} miếng`,
        ),
      )
      .concat([
        frame(
          hexTriangles("Đường chéo chính dài bằng hai cạnh", {
            w: 300,
            h: 240,
            cx: 150,
            cy: 120,
            r: 104,
            count: 6,
            diagonal: ["A", "D"],
            equalMarks: true,
            names: true,
          }),
          "Đường chéo chính AD dài bằng hai cạnh",
        ),
      ]),
  ),
  "ghep-quy-tac": figure(
    hexTriangles(
      "Hình lục giác đều ghép từ sáu tam giác đều, đường chéo chính bằng hai cạnh",
      {
        w: 300,
        h: 240,
        cx: 150,
        cy: 120,
        r: 104,
        count: 6,
        diagonal: ["A", "D"],
        equalMarks: true,
      },
    ),
  ),
  "ghep-cung-lam": {
    kind: "assemble",
    label: "Ghép sáu miếng tam giác đều",
    goal: 6,
    done: "Sáu miếng ghép thành hình lục giác đều.",
  },
  "ghep-sau-mieng": figure(
    hexTriangles("Hình lục giác đều ghép từ sáu tam giác đều", {
      w: 300,
      h: 240,
      cx: 150,
      cy: 120,
      r: 104,
      count: 6,
    }),
  ),

  // 8. Vẽ hình tam giác đều
  "ve-td-cac-buoc": steps(
    "Vẽ hình tam giác đều ABC có cạnh 5 cm",
    triangleFrames(5),
  ),
  "ve-td-quy-tac": figure(
    finishedBoard(
      "triangle",
      TRI_NAMES,
      5,
      "Hình tam giác đều ABC vẽ bằng thước và compa",
    ),
  ),
  "ve-td-cung-lam": {
    kind: "construct",
    shape: "triangle",
    names: TRI_NAMES,
    goal: 3,
    done: "Bạn đã vẽ xong hình tam giác đều ABC có cạnh 3 cm.",
  },
  "ve-td-tap-lam": {
    kind: "construct",
    shape: "triangle",
    names: ["D", "E", "F"],
  },

  // 9. Vẽ hình vuông
  "ve-hv-cac-buoc": steps("Vẽ hình vuông ABCD có cạnh 4 cm", squareFrames(4)),
  "ve-hv-quy-tac": figure(
    finishedBoard(
      "square",
      SQ_NAMES,
      4,
      "Hình vuông ABCD vẽ bằng thước và êke",
    ),
  ),
  "ve-hv-cung-lam": {
    kind: "construct",
    shape: "square",
    names: SQ_NAMES,
    goal: 3,
    done: "Bạn đã vẽ xong hình vuông ABCD có cạnh 3 cm.",
  },
  "ve-hv-tap-lam": {
    kind: "construct",
    shape: "square",
    names: ["E", "F", "G", "H"],
  },

  // 10. Kiểm tra bằng compa và êke
  "kiem-cac-buoc": steps("Compa so các cạnh, êke kiểm tra góc vuông", [
    frame(
      tri("Mở compa bằng cạnh AB", {
        names: true,
        fill: "teal",
        dots: ["A", "B"],
        segs: segsOf([["A", "B"]], { tone: "teal", bold: true }),
      }),
      "Mở compa bằng cạnh AB",
    ),
    frame(
      (() => {
        const base = tri("Kim ở A, đầu bút chạm C", {
          names: true,
          fill: "teal",
          segs: segsOf([["A", "B"]], { tone: "teal", bold: true }),
        });
        return {
          ...base,
          arcs: [
            {
              c: "A",
              r: dist(base.pts.A as Pt, base.pts.B as Pt),
              from: directionDeg(base.pts.A as Pt, base.pts.C as Pt),
              to: directionDeg(base.pts.A as Pt, base.pts.B as Pt),
              tone: "teal" as Tone,
            },
          ],
        };
      })(),
      "Kim ở A: đầu bút chạm đúng C",
    ),
    frame(
      (() => {
        const base = tri("Kim ở B, đầu bút chạm C", {
          names: true,
          fill: "teal",
          segs: segsOf([["A", "B"]], { tone: "teal", bold: true }),
        });
        return {
          ...base,
          arcs: [
            {
              c: "B",
              r: dist(base.pts.B as Pt, base.pts.A as Pt),
              from: directionDeg(base.pts.B as Pt, base.pts.A as Pt),
              to: directionDeg(base.pts.B as Pt, base.pts.C as Pt),
              tone: "teal" as Tone,
            },
          ],
        };
      })(),
      "Kim ở B: đầu bút cũng chạm đúng C",
    ),
    frame(
      (() => {
        const base = sq("Êke khít vào góc A", { names: true, fill: "pink" });
        const a = base.pts.A as Pt;
        const b = base.pts.B as Pt;
        const d = base.pts.D as Pt;
        const reach = 52;
        const along = (to: Pt): Pt => {
          const length = dist(a, to);
          return [
            a[0] + ((to[0] - a[0]) * reach) / length,
            a[1] + ((to[1] - a[1]) * reach) / length,
          ];
        };
        return {
          ...base,
          pts: { ...base.pts, E1: along(b), E2: along(d) },
          polys: [
            ...(base.polys ?? []),
            {
              v: ["A", "E1", "E2"],
              tone: "mute" as Tone,
              fill: "mute" as Tone,
            },
          ],
          rights: [{ at: "A", a: "B", b: "D", tone: "violet" as Tone }],
        };
      })(),
      "Êke khít vào góc A: đó là góc vuông",
    ),
  ]),
  "kiem-quy-tac": {
    kind: "gallery",
    label:
      "Ba cạnh bằng nhau là hình tam giác đều; bốn cạnh bằng nhau và bốn góc vuông là hình vuông",
    items: [
      {
        figure: triThumb("Hình có ba cạnh bằng nhau", {
          ...TICKS,
          fill: "teal",
        }),
        caption: "Ba cạnh bằng nhau",
      },
      {
        figure: sqThumb("Hình có bốn cạnh bằng nhau và bốn góc vuông", {
          ...MARKS,
          fill: "pink",
        }),
        caption: "Bốn cạnh bằng nhau, bốn góc vuông",
      },
    ],
  },
  "kiem-cung-lam": {
    kind: "probe",
    figure: rhombus("Hình có bốn cạnh bằng nhau nhưng một góc không vuông", {
      sample: true,
    }),
    parts: [
      ...sideProbe(
        [
          ["B", "C"],
          ["C", "D"],
          ["D", "A"],
        ],
        "vừa khít",
        "teal",
      ),
      {
        kind: "angle" as const,
        at: "A",
        a: "D",
        b: "B",
        text: "≠ 90°",
        label: "Góc A",
        tone: "amber" as Tone,
      },
    ],
    verb: "kiểm tra",
    done: "Bốn cạnh bằng nhau nhưng góc A không vuông, nên đây không phải hình vuông.",
  },
  // The exercise on one angle that is not right: another rhombus, turned
  // and with an angle of 70°.
  "kiem-hinh-thoi-efgh": {
    kind: "probe",
    figure: rhombus("Hình EFGH có bốn cạnh bằng nhau", {
      names: ["E", "F", "G", "H"],
      angle: 70,
    }),
    parts: [
      ...sideProbe(
        [
          ["E", "F"],
          ["F", "G"],
          ["G", "H"],
          ["H", "E"],
        ],
        "vừa khít",
        "teal",
      ),
      {
        kind: "angle" as const,
        at: "E",
        a: "H",
        b: "F",
        text: "≠ 90°",
        label: "Góc E",
        tone: "amber" as Tone,
      },
    ],
    verb: "kiểm tra",
    done: "Bốn cạnh vừa khít, còn êke không khít ở góc E.",
  },
  "tam-giac-4-4-5": figure(
    triangleBySides(
      "Hình tam giác DEF có DE = 4 cm, DF = 4 cm, EF = 5 cm",
      [4, 4, 5],
      {
        w: 240,
        h: 190,
        lengths: true,
        names: ["D", "E", "F"],
      },
    ),
  ),

  // 11. Đếm hình trong một hình
  "dem-cac-buoc": steps("Đếm các hình vuông trong hình gồm bốn ô vuông nhỏ", [
    ...[1, 2, 3, 4].map((count) =>
      frame(
        squareGrid(`Đã tô ${count} hình vuông nhỏ`, {
          w: 300,
          h: 200,
          rows: 2,
          cols: 2,
          cell: 84,
          filled: (
            [
              [0, 0],
              [0, 1],
              [1, 0],
              [1, 1],
            ] as const
          ).slice(0, count),
        }),
        `${count} hình vuông nhỏ`,
      ),
    ),
    frame(
      squareGrid("Thêm hình vuông lớn", {
        w: 300,
        h: 200,
        rows: 2,
        cols: 2,
        cell: 84,
        filled: [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ],
        outlined: [{ row: 0, col: 0, size: 2, tone: "amber" }],
      }),
      "Thêm 1 hình vuông lớn: tất cả 5 hình",
    ),
  ]),
  "dem-quy-tac": figure({
    ...squareGrid("Bốn hình vuông nhỏ và một hình vuông lớn", {
      w: 300,
      h: 240,
      rows: 2,
      cols: 2,
      cell: 84,
      filled: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
      outlined: [{ row: 0, col: 0, size: 2, tone: "amber" }],
    }),
    texts: [textAt(150, 224, "4 + 1 = 5 hình vuông")],
  }),
  "dem-cung-lam": {
    kind: "probe",
    figure: triangleOfNine("Hình tam giác đều DEF chia thành các hình nhỏ"),
    parts: [
      // The four smallest, then the four medium ones, then the whole.
      ...(
        [
          ["D", "P1", "P2"],
          ["P1", "G", "P3"],
          ["P2", "P3", "H"],
          ["P1", "P2", "P3"],
          ["D", "G", "H"],
          ["G", "E", "K"],
          ["H", "K", "F"],
          ["G", "H", "K"],
        ] as const
      ).map((v, i) => ({
        kind: "poly" as const,
        v,
        label:
          i < 4
            ? `Hình tam giác nhỏ số ${i + 1}`
            : `Hình tam giác ${v.join("")}`,
        tone: "teal" as Tone,
      })),
      { kind: "chip", label: "Cả hình lớn DEF", tone: "amber" },
    ],
    whole: ["D", "E", "F"],
    verb: "tô",
    done: "Có 9 hình tam giác đều: 4 hình nhỏ, 4 hình vừa và 1 hình lớn.",
  },
  "dem-dai-ba-tam-giac": figure(
    triangleStrip("Ba hình tam giác đều nhỏ ghép thành hình thang"),
  ),
  "dem-luoi-2x3": figure(
    squareGrid("Hai hàng, mỗi hàng ba ô vuông", {
      w: 240,
      h: 150,
      rows: 2,
      cols: 3,
      cell: 64,
    }),
  ),
  "dem-luoi-goi-y": figure({
    ...squareGrid("Sáu hình vuông nhỏ", {
      w: 240,
      h: 170,
      top: 8,
      rows: 2,
      cols: 3,
      cell: 64,
      filled: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    }),
    texts: [textAt(120, 154, "6 hình nhỏ và ? hình lớn hơn")],
  }),
  "dem-luoi-giai": figure({
    ...squareGrid("Hai hình vuông lớn ghép từ bốn ô", {
      w: 240,
      h: 170,
      top: 8,
      rows: 2,
      cols: 3,
      cell: 64,
      filled: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      outlined: [
        { row: 0, col: 0, size: 2, tone: "amber" },
        { row: 0, col: 1, size: 2, tone: "blue" },
      ],
    }),
    texts: [textAt(120, 154, "6 + 2 = 8 hình vuông")],
  }),
  "dem-luc-giac-ba-cheo": figure(
    hexByDiagonals("Hình lục giác đều chia bởi ba đường chéo chính"),
  ),
  "dem-hang-ba-o": figure(
    squareGrid("Ba ô vuông xếp một hàng", {
      w: 300,
      h: 130,
      rows: 1,
      cols: 3,
      cell: 82,
    }),
  ),
  "dem-tam-giac-chia-9": figure(
    triangleOfThirteen("Hình tam giác đều ABC chia thành chín hình nhỏ"),
  ),

  // Lead-ins of the book exercises
  "dan-td-nguoc": small(triangleDown),
  "dan-tam-giac-cao": small(
    triangleBySides(
      "Hình tam giác có hai cạnh bên dài hơn cạnh đáy",
      [9, 9, 6],
      THUMB,
    ),
  ),
  "dan-hinh-thang": small(trapezoid),
  "dan-bat-giac": small(octagon),
  "ve-hai-hinh": {
    kind: "gallery",
    label:
      "Hình tam giác đều vẽ bằng thước và compa, hình vuông vẽ bằng thước và êke",
    items: [
      {
        figure: triThumb("Hình tam giác đều", { ...TICKS, fill: "teal" }),
        caption: "Thước và compa",
      },
      {
        figure: sqThumb("Hình vuông", { ...MARKS, fill: "pink" }),
        caption: "Thước và êke",
      },
    ],
  },

  // The figures of the workbook exercises 4.1 to 4.7
  "sbt-hinh-4-4": figure(figure44()),
  "sbt-hinh-4-5": figure(figure45()),
  "sbt-hinh-4-6": figure(FIG46),
  "sbt-hinh-4-7": figure(figure47()),
  "sbt-hinh-4-8": figure(figure48()),

  // The figures of the exercises 4.4b to 4.5b that the child measures
  "sbt-4-4b-do": {
    kind: "probe",
    // The two triangles cross, so their measures are written in two rows
    // under the hexagon, one column per side.
    figure: { ...figure45(), h: 312 },
    parts: (
      [
        ["M", "P"],
        ["P", "R"],
        ["R", "M"],
        ["N", "Q"],
        ["Q", "S"],
        ["S", "N"],
      ] as const
    ).flatMap(([a, b], i) =>
      sideProbe([[a, b]], `${a}${b} 6,9 cm`, "blue").map((part) => ({
        ...part,
        textAt: [55 + (i % 3) * 105, i < 3 ? 280 : 302] as Pt,
      })),
    ),
    verb: "đo",
    done: "Cả sáu đoạn đều dài 6,9 cm.",
  },
  "sbt-4-5a-do": {
    kind: "probe",
    figure: figure46(),
    parts: [
      ...sideProbe(
        [
          ["A", "B"],
          ["A", "C"],
        ],
        "7,8 cm",
        "blue",
      ).map((part) => ({ ...part, at: 0.28 })),
      ...sideProbe([["B", "C"]], "6 cm", "blue"),
    ],
    verb: "đo",
    done: "AB và AC đều dài 7,8 cm, còn BC dài 6 cm.",
  },
  "sbt-4-5b-do": {
    kind: "probe",
    figure: squareMNPQ("Hình MNPQ lấy từ Hình 4.6"),
    parts: [
      ...sideProbe(SQUARE_MNPQ, "3,3 cm", "blue"),
      ...angleProbe(
        [
          ["M", "Q", "N"],
          ["N", "M", "P"],
          ["P", "N", "Q"],
          ["Q", "P", "M"],
        ],
        "90°",
        { right: true },
      ),
    ],
    verb: "đo",
    done: "Bốn cạnh đều dài 3,3 cm và bốn góc đều bằng 90°.",
  },

  // Hints (other numbers or a stop before the result) and solutions
  "sbt-4-1-goi-y": figure(figure44({ counts: true })),
  "sbt-4-1-giai": steps(
    "Tìm hình tam giác đều, hình vuông, hình lục giác đều",
    [
      frame(
        figure44({ mark: "c" }),
        "Hình c có ba cạnh bằng nhau: hình tam giác đều",
      ),
      frame(
        figure44({ mark: "b" }),
        "Hình b có bốn cạnh bằng nhau và bốn góc vuông: hình vuông",
      ),
      frame(
        figure44({ mark: "f" }),
        "Hình f có sáu cạnh bằng nhau: hình lục giác đều",
      ),
    ],
  ),
  "sbt-4-2-ve": {
    kind: "construct",
    shape: "triangle",
    names: ["M", "N", "P"],
  },
  "sbt-4-2-goi-y": steps(
    "Các bước vẽ hình tam giác đều MNP có cạnh 3 cm, dừng trước điểm P",
    triangleFrames(3, ["M", "N", "P"], 3),
  ),
  "sbt-4-2-giai": steps(
    "Các bước vẽ hình tam giác đều MNP có cạnh 4 cm",
    triangleFrames(4, ["M", "N", "P"]),
  ),
  "sbt-4-3-ve": {
    kind: "construct",
    shape: "square",
    names: ["D", "E", "F", "Q"],
    diagonals: true,
  },
  "sbt-4-3-goi-y": steps(
    "Các bước vẽ hình vuông DEFQ có cạnh 3 cm, dừng trước hai đường chéo",
    squareFrames(3, ["D", "E", "F", "Q"], { upTo: 4 }),
  ),
  "sbt-4-3-giai": steps(
    "Các bước vẽ hình vuông DEFQ có cạnh 5 cm và hai đường chéo",
    squareFrames(5, ["D", "E", "F", "Q"], { diagonals: true }),
  ),
  "sbt-4-4a-giai": figure(
    figure45({ tone: "teal", boldSecondary: true, mainDiagonals: "dash" }),
  ),
  "sbt-4-4b-goi-y": figure(
    hex("Hình lục giác đều ABCDEF với ba đường chéo phụ AC, CE, EA", {
      names: true,
      fill: "lime",
      segs: segsOf(
        [
          ["A", "C"],
          ["C", "E"],
          ["E", "A"],
        ],
        { tone: "teal", bold: true },
      ),
      h: 270,
      texts: [textAt(150, 252, "AC, CE, EA bằng nhau không?")],
    }),
  ),
  "sbt-4-4b-giai": figure(
    figure45({
      polys: [
        { v: ["M", "P", "R"], fill: "teal" },
        { v: ["N", "Q", "S"], fill: "teal" },
      ],
      ticks: [
        {
          segs: [
            ["M", "P"],
            ["P", "R"],
            ["R", "M"],
          ],
          count: 2,
          tone: "blue",
        },
        {
          segs: [
            ["N", "Q"],
            ["Q", "S"],
            ["S", "N"],
          ],
          count: 3,
          tone: "blue",
        },
      ],
    }),
  ),
  "sbt-4-5a-goi-y": figure(SBT_4_5A_HINT),
  "sbt-4-5a-giai": steps("Dùng compa so các cạnh của hình ABC", [
    frame(
      figure46({
        arcs: fig46Arcs(false),
        ticks: [
          {
            segs: [
              ["A", "B"],
              ["A", "C"],
            ],
            count: 1,
            tone: "blue",
          },
        ],
      }),
      "Kim ở A: đầu bút chạm B và C, nên AB = AC",
    ),
    frame(
      figure46({
        arcs: fig46Arcs(true),
        ticks: [
          {
            segs: [
              ["A", "B"],
              ["A", "C"],
            ],
            count: 1,
            tone: "blue",
          },
          { segs: [["B", "C"]], count: 2, tone: "blue" },
        ],
      }),
      "Kim ở B, mở bằng BA: đầu bút đi quá C, nên BC ngắn hơn",
    ),
  ]),
  "sbt-4-5b-goi-y": figure(
    sq("Hình có bốn cạnh bằng nhau, còn các góc thì chưa biết", {
      ...TICKS,
      texts: [textAt(150, 98, "góc ?", "violet")],
    }),
  ),
  "sbt-4-5b-giai": figure(
    figure46({
      ticks: [{ segs: SQUARE_MNPQ, count: 1, tone: "blue" }],
      rights: [
        { at: "M", a: "Q", b: "N", tone: "violet" },
        { at: "N", a: "M", b: "P", tone: "violet" },
        { at: "P", a: "N", b: "Q", tone: "violet" },
        { at: "Q", a: "P", b: "M", tone: "violet" },
      ],
    }),
  ),
  "sbt-4-6-goi-y": steps(
    "Hình lục giác đều ghép từ sáu tam giác đều cạnh 3 cm",
    [
      frame(
        hexOfSix("Sáu miếng ghép thành hình lục giác đều", false),
        "Sáu miếng ghép thành hình lục giác đều",
      ),
      frame(
        hexOfSix("Đường chéo chính AD gồm hai cạnh", true),
        "AD gồm hai cạnh: 3 cm + 3 cm = ?",
      ),
    ],
  ),
  "sbt-4-6-giai": steps(
    "Hình lục giác đều ghép từ sáu tam giác đều cạnh 5 cm",
    [
      frame(
        hexOfSix("Sáu miếng ghép thành hình lục giác đều", false),
        "Sáu miếng ghép thành hình lục giác đều",
      ),
      frame(
        hexOfSix("Đường chéo chính AD gồm hai cạnh", true),
        "AD gồm hai cạnh: 5 cm + 5 cm = 10 cm",
      ),
    ],
  ),
  "sbt-4-7a-giai": steps("Hai hình lục giác đều trong hình", [
    frame(
      figure48({
        polys: [{ v: ["A", "B", "C", "D", "E", "F"], ...tone("lime") }],
      }),
      "ABCDEF có sáu cạnh bằng nhau",
    ),
    frame(
      figure48({
        polys: [{ v: ["M", "N", "P", "Q", "R", "S"], ...tone("lime") }],
      }),
      "MNPQRS ở giữa cũng là hình lục giác đều",
    ),
  ]),
  // Hint of 4.7b: the two big triangles, the small ones left to find.
  "sbt-4-7b-goi-y": figure(
    figure48({
      polys: [...FIG48_BIG_ACE, ...FIG48_BIG_BDF],
      ticks: FIG48_BIG_TICKS,
      h: 322,
      texts: [
        textAt(150, 274, "2 hình tam giác lớn"),
        textAt(150, 304, "và ? hình nhỏ ở các đỉnh"),
      ],
    }),
  ),
  "sbt-4-7b-giai": steps("Đếm các hình tam giác đều trong hình", [
    frame(
      figure48({
        polys: [...FIG48_BIG_ACE, ...FIG48_BIG_BDF],
        ticks: FIG48_BIG_TICKS,
      }),
      "2 hình tam giác lớn: ACE và BDF",
    ),
    frame(figure48({ polys: FIG48_SMALL }), "6 hình tam giác nhỏ ở sáu đỉnh"),
    frame(
      figure48({ polys: [...FIG48_BIG_ACE, ...FIG48_BIG_BDF, ...FIG48_SMALL] }),
      "Tất cả 2 + 6 = 8 hình tam giác đều",
    ),
  ]),
  sticker: { kind: "sticker" },
};
