import {
  type Line,
  line,
  mirroredOutline,
  type Pt,
  polar,
  regularPolygon,
  type Stroke,
  smooth,
} from "./geometry";

// The drawings of the lesson that are folded, tested and counted: shapes,
// everyday things and symbols. Each one lists its strokes (the lines the
// fold must match), its axes of symmetry and some lines that look like axes
// but are not. Everything is symmetric by construction (a half drawn once
// and mirrored), and `tests/visuals/hinh-co-truc-doi-xung.test.tsx` checks the
// lists against the strokes by folding numerically. Pure data, no React.

export type ShapeStroke = Stroke & {
  // Soft fill inside a closed stroke.
  fill?: boolean;
  // A fine detail (veins, spots) drawn with a thinner line.
  thin?: boolean;
};

export const SHAPE_IDS = [
  "triangle",
  "square",
  "hexagon",
  "star",
  "circle",
  "rectangle",
  "rhombus",
  "trapezoid",
  "parallelogram",
  "plus",
  "butterfly",
  "leaf",
  "gate",
  "house",
  "peace",
  "medical",
  "pentomino",
  "staircase",
  "sheet",
] as const;
export type ShapeId = (typeof SHAPE_IDS)[number];

export type ShapeDef = {
  id: ShapeId;
  // Spoken description, also the title of a card.
  name: string;
  strokes: readonly ShapeStroke[];
  // Every axis of symmetry, as a line long enough to cross the drawing. A
  // circle lists four of its endless axes (`endless`).
  axes: readonly Line[];
  // Lines through the drawing that are not axes: the ones a child may take
  // for an axis (diagonals, midlines).
  fakes: readonly Line[];
  endless?: boolean;
};

// Every drawing fits a square frame of this size, its middle at CENTRE.
export const FRAME = 240;
export const CENTRE: Pt = [120, 120];
const REACH = 106;

// The line through `at` turned `deg` degrees (0 to the right, 90 down),
// reaching `reach` to each side.
export function through(at: Pt, deg: number, reach = REACH): Line {
  const [dx, dy] = polar(0, 0, reach, deg);
  return line([at[0] - dx, at[1] - dy], [at[0] + dx, at[1] + dy]);
}

// The line through two points, stretched past both by `extra`.
function across(a: Pt, b: Pt, extra = 14): Line {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / length;
  const uy = (b[1] - a[1]) / length;
  return line(
    [a[0] - ux * extra, a[1] - uy * extra],
    [b[0] + ux * extra, b[1] + uy * extra],
  );
}

const closed = (pts: readonly Pt[], more: Partial<ShapeStroke> = {}) => ({
  pts,
  closed: true,
  ...more,
});
const open = (pts: readonly Pt[], more: Partial<ShapeStroke> = {}) => ({
  pts,
  closed: false,
  ...more,
});

function mirrorX(points: readonly Pt[]): Pt[] {
  return points.map(([x, y]) => [2 * CENTRE[0] - x, y]);
}

function ellipse(cx: number, cy: number, rx: number, ry: number, n = 36) {
  return Array.from({ length: n }, (_, i): Pt => {
    const rad = (2 * Math.PI * i) / n;
    return [cx + rx * Math.cos(rad), cy + ry * Math.sin(rad)];
  });
}

const VERTICAL = through(CENTRE, 90);
const HORIZONTAL = through(CENTRE, 0);

// A pair of strokes, one mirrored in the vertical axis through the middle.
function pair(
  stroke: readonly Pt[],
  more: Partial<ShapeStroke> & { closed: boolean },
): ShapeStroke[] {
  return [
    { pts: stroke, ...more },
    { pts: mirrorX(stroke), ...more },
  ];
}

function regular(
  name: string,
  id: ShapeId,
  n: number,
  radius: number,
  startDeg: number,
  fakeDegrees: readonly number[],
): ShapeDef {
  const strokes = [
    closed(regularPolygon(n, 120, 120, radius, startDeg), { fill: true }),
  ];
  // The axes of a regular polygon pass through its middle and, in turn, a
  // corner or the middle of a side: `n` lines, every 180 / n degrees.
  const axes = Array.from({ length: n }, (_, i) =>
    through(CENTRE, startDeg + (180 * i) / n),
  );
  const fakes = fakeDegrees.map((deg) => through(CENTRE, deg));
  return { id, name, strokes, axes, fakes };
}

function star(): ShapeDef {
  const outer = 90;
  const inner = outer * 0.382;
  const pts = Array.from({ length: 10 }, (_, i) =>
    polar(120, 126, i % 2 === 0 ? outer : inner, -90 + 36 * i),
  );
  const centre: Pt = [120, 126];
  return {
    id: "star",
    name: "Ngôi sao năm cánh",
    strokes: [closed(pts, { fill: true })],
    axes: Array.from({ length: 5 }, (_, i) =>
      through(centre, -90 + 72 * i, 104),
    ),
    fakes: [0, 36, 108].map((deg) => through(centre, deg, 104)),
  };
}

function circle(): ShapeDef {
  return {
    id: "circle",
    name: "Hình tròn",
    strokes: [closed(regularPolygon(90, 120, 120, 84, 0), { fill: true })],
    axes: [0, 45, 90, 135].map((deg) => through(CENTRE, deg)),
    fakes: [],
    endless: true,
  };
}

function rectangle(): ShapeDef {
  const corners: Pt[] = [
    [42, 72],
    [198, 72],
    [198, 168],
    [42, 168],
  ];
  return {
    id: "rectangle",
    name: "Hình chữ nhật",
    strokes: [closed(corners, { fill: true })],
    axes: [through(CENTRE, 90, 90), through(CENTRE, 0, 114)],
    fakes: [
      across(corners[0] as Pt, corners[2] as Pt),
      across(corners[1] as Pt, corners[3] as Pt),
    ],
  };
}

function rhombus(): ShapeDef {
  const corners: Pt[] = [
    [30, 120],
    [120, 68],
    [210, 120],
    [120, 172],
  ];
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  return {
    id: "rhombus",
    name: "Hình thoi",
    strokes: [closed(corners, { fill: true })],
    axes: [through(CENTRE, 0, 114), through(CENTRE, 90, 70)],
    fakes: [across(mid(a, b), mid(c, d)), across(mid(b, c), mid(d, a))],
  };
}

function trapezoid(): ShapeDef {
  const corners: Pt[] = [
    [36, 170],
    [72, 72],
    [168, 72],
    [204, 170],
  ];
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  const middle = (y: number): Line => through([120, y], 0, 106);
  return {
    id: "trapezoid",
    name: "Hình thang cân",
    strokes: [closed(corners, { fill: true })],
    axes: [through([120, 121], 90, 66)],
    fakes: [middle(121), across(a, c), across(b, d)],
  };
}

function parallelogram(): ShapeDef {
  const corners: Pt[] = [
    [72, 72],
    [204, 72],
    [168, 168],
    [36, 168],
  ];
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  return {
    id: "parallelogram",
    name: "Hình bình hành",
    strokes: [closed(corners, { fill: true })],
    axes: [],
    fakes: [
      across(a, c),
      across(b, d),
      across(mid(a, d), mid(b, c)),
      across(mid(a, b), mid(c, d)),
    ],
  };
}

function plus(): ShapeDef {
  const arm = 26;
  const reach = 86;
  const [lo, hi] = [120 - arm, 120 + arm];
  const [far, near] = [120 - reach, 120 + reach];
  const pts: Pt[] = [
    [lo, far],
    [hi, far],
    [hi, lo],
    [near, lo],
    [near, hi],
    [hi, hi],
    [hi, near],
    [lo, near],
    [lo, hi],
    [far, hi],
    [far, lo],
    [lo, lo],
  ];
  return {
    id: "plus",
    name: "Dấu cộng Chữ thập đỏ",
    strokes: [closed(pts, { fill: true })],
    axes: [0, 45, 90, 135].map((deg) => through(CENTRE, deg)),
    fakes: [22, 68].map((deg) => through(CENTRE, deg)),
  };
}

function butterfly(): ShapeDef {
  const upper = smooth(
    [
      [130, 112],
      [150, 70],
      [188, 32],
      [222, 38],
      [228, 76],
      [210, 106],
      [176, 120],
    ],
    true,
  );
  const lower = smooth(
    [
      [130, 126],
      [176, 128],
      [206, 148],
      [204, 186],
      [170, 202],
      [142, 170],
      [128, 138],
    ],
    true,
  );
  const antenna = smooth(
    [
      [124, 76],
      [134, 54],
      [152, 40],
    ],
    false,
  );
  const spot = (cx: number, cy: number, r: number): Pt[] =>
    ellipse(cx, cy, r, r, 16);
  return {
    id: "butterfly",
    name: "Cánh bướm",
    strokes: [
      ...pair(upper, { closed: true, fill: true }),
      ...pair(lower, { closed: true, fill: true }),
      closed(ellipse(120, 122, 8, 52, 40), { fill: true }),
      ...pair(antenna, { closed: false }),
      ...pair(spot(190, 66, 9), { closed: true, thin: true }),
      ...pair(spot(176, 166, 7), { closed: true, thin: true }),
    ],
    axes: [VERTICAL],
    fakes: [HORIZONTAL, through([150, 122], 90, 100), through(CENTRE, 45, 104)],
  };
}

function leaf(): ShapeDef {
  const right = smooth(
    [
      [120, 20],
      [152, 52],
      [172, 96],
      [164, 142],
      [140, 180],
      [120, 200],
    ],
    false,
    10,
  );
  const outline = mirroredOutline(right, 120);
  const vein = (y: number, dx: number, dy: number): Pt[] => [
    [120, y],
    [120 + dx, y - dy],
  ];
  const veins = [
    vein(170, 30, 26),
    vein(136, 40, 32),
    vein(100, 42, 34),
    vein(66, 28, 26),
  ];
  return {
    id: "leaf",
    name: "Chiếc lá",
    strokes: [
      closed(outline, { fill: true }),
      open(
        [
          [120, 20],
          [120, 232],
        ],
        {},
      ),
      ...veins.flatMap((v) => pair(v, { closed: false, thin: true })),
    ],
    axes: [through([120, 126], 90, 112)],
    fakes: [HORIZONTAL, through([146, 126], 90, 112), through(CENTRE, 45, 104)],
  };
}

function gate(): ShapeDef {
  const roof: Pt[] = [
    [24, 74],
    [44, 88],
    [78, 62],
    [104, 46],
    [120, 42],
    [136, 46],
    [162, 62],
    [196, 88],
    [216, 74],
    [198, 104],
    [42, 104],
  ];
  const pillar = (x0: number, x1: number): Pt[] => [
    [x0, 104],
    [x1, 104],
    [x1, 210],
    [x0, 210],
  ];
  const arch: Pt[] = [
    [86, 210],
    ...Array.from(
      { length: 17 },
      (_, i): Pt => polar(120, 164, 34, 180 + 180 * (i / 16)),
    ),
    [154, 210],
  ];
  return {
    id: "gate",
    name: "Cổng đền",
    strokes: [
      closed(roof, { fill: true }),
      closed(pillar(54, 78), { fill: true }),
      closed(pillar(162, 186), { fill: true }),
      closed(
        [
          [54, 120],
          [186, 120],
          [186, 136],
          [54, 136],
        ],
        { fill: true },
      ),
      open(arch, { thin: true }),
      closed(
        [
          [104, 144],
          [136, 144],
          [136, 156],
          [104, 156],
        ],
        { thin: true },
      ),
    ],
    axes: [through([120, 126], 90, 100)],
    fakes: [HORIZONTAL, through([146, 126], 90, 100), through(CENTRE, 45, 104)],
  };
}

function house(): ShapeDef {
  return {
    id: "house",
    name: "Ngôi nhà",
    strokes: [
      closed(
        [
          [58, 112],
          [120, 48],
          [182, 112],
          [182, 196],
          [58, 196],
        ],
        { fill: true },
      ),
      closed(
        [
          [102, 144],
          [138, 144],
          [138, 196],
          [102, 196],
        ],
        { thin: true },
      ),
      closed(ellipse(120, 100, 12, 12, 20), { thin: true }),
    ],
    axes: [through([120, 122], 90, 90)],
    fakes: [
      HORIZONTAL,
      through([146, 122], 90, 90),
      through([120, 122], 45, 100),
    ],
  };
}

function peace(): ShapeDef {
  return {
    id: "peace",
    name: "Biểu tượng Hòa bình",
    strokes: [
      closed(regularPolygon(90, 120, 120, 84, 0)),
      open([
        [120, 36],
        [120, 204],
      ]),
      open([polar(120, 120, 0, 0), polar(120, 120, 84, 135)]),
      open([polar(120, 120, 0, 0), polar(120, 120, 84, 45)]),
    ],
    axes: [VERTICAL],
    fakes: [HORIZONTAL],
  };
}

function medical(): ShapeDef {
  const bowl: Pt[] = Array.from(
    { length: 13 },
    (_, i): Pt => polar(120, 100, 40, 180 * (i / 12)),
  );
  const snake = smooth(
    [
      [120, 64],
      [142, 82],
      [100, 104],
      [142, 128],
      [100, 150],
      [128, 176],
    ],
    false,
  );
  return {
    id: "medical",
    name: "Biểu tượng Y Dược",
    strokes: [
      closed(regularPolygon(90, 120, 120, 84, 0)),
      closed(bowl, { fill: true }),
      open([
        [120, 140],
        [120, 178],
      ]),
      open([
        [92, 190],
        [148, 190],
      ]),
      open(snake, { thin: true }),
    ],
    axes: [],
    fakes: [VERTICAL, HORIZONTAL],
  };
}

// A polygon on a square lattice, `unit` frame units to a lattice unit, its
// middle at the middle of the frame.
function latticePolygon(
  corners: readonly Pt[],
  unit: number,
  width: number,
  height: number,
): Pt[] {
  const dx = 120 - (width * unit) / 2;
  const dy = 120 - (height * unit) / 2;
  return corners.map(([x, y]): Pt => [dx + x * unit, dy + y * unit]);
}

// Five squares with no axis of symmetry (the shape of the letter F).
function pentomino(): ShapeDef {
  const corners: Pt[] = [
    [1, 0],
    [3, 0],
    [3, 1],
    [2, 1],
    [2, 3],
    [1, 3],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 1],
  ];
  const [a, b] = [through(CENTRE, 90, 96), through(CENTRE, 0, 96)];
  return {
    id: "pentomino",
    name: "Hình năm ô vuông lệch",
    strokes: [closed(latticePolygon(corners, 48, 3, 3), { fill: true })],
    axes: [],
    fakes: [a, b, through(CENTRE, 45, 100), through(CENTRE, 135, 100)],
  };
}

// A band of squares one step wide, running down the diagonal: its two axes
// are the two diagonals.
function staircase(): ShapeDef {
  const corners: Pt[] = [
    [0, 0],
    [2, 0],
    [2, 1],
    [3, 1],
    [3, 2],
    [4, 2],
    [4, 4],
    [2, 4],
    [2, 3],
    [1, 3],
    [1, 2],
    [0, 2],
  ];
  return {
    id: "staircase",
    name: "Hình bậc thang",
    strokes: [closed(latticePolygon(corners, 38, 4, 4), { fill: true })],
    axes: [through(CENTRE, 45, 108), through(CENTRE, 135, 108)],
    fakes: [through(CENTRE, 90, 96), through(CENTRE, 0, 96)],
  };
}

// The sheet of paper of the folding example, opened out: a 3 by 5 rectangle
// with a small rectangular hole in the middle.
function sheet(): ShapeDef {
  const corners: Pt[] = [
    [72, 40],
    [168, 40],
    [168, 200],
    [72, 200],
  ];
  const hole: Pt[] = [
    [100, 92],
    [140, 92],
    [140, 148],
    [100, 148],
  ];
  return {
    id: "sheet",
    name: "Tờ giấy đã mở ra",
    strokes: [closed(corners), closed(hole, { fill: true })],
    axes: [through(CENTRE, 90, 100), through(CENTRE, 0, 66)],
    fakes: [
      across(corners[0] as Pt, corners[2] as Pt, 8),
      across(corners[1] as Pt, corners[3] as Pt, 8),
    ],
  };
}

const DEFS: Record<ShapeId, ShapeDef> = {
  triangle: regular("Hình tam giác đều", "triangle", 3, 90, -90, [0, 60]),
  square: regular("Hình vuông", "square", 4, 94, -135, [20, 70]),
  hexagon: regular("Hình lục giác đều", "hexagon", 6, 88, 0, [15, 45]),
  star: star(),
  circle: circle(),
  rectangle: rectangle(),
  rhombus: rhombus(),
  trapezoid: trapezoid(),
  parallelogram: parallelogram(),
  plus: plus(),
  butterfly: butterfly(),
  leaf: leaf(),
  gate: gate(),
  house: house(),
  peace: peace(),
  medical: medical(),
  pentomino: pentomino(),
  staircase: staircase(),
  sheet: sheet(),
};

export const SHAPES: Readonly<Record<ShapeId, ShapeDef>> = DEFS;

export const AXIS_COUNT: Readonly<Record<ShapeId, number | "vô số">> =
  Object.fromEntries(
    SHAPE_IDS.map((id) => [
      id,
      DEFS[id].endless ? "vô số" : DEFS[id].axes.length,
    ]),
  ) as Record<ShapeId, number | "vô số">;
