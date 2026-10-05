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
  "scalene",
  "cloud",
  "heart",
  "arrow",
  "nosign",
  "tallrect",
  "flatrhombus",
  "slantleft",
  "cross",
  "mask",
  "glass",
  "pine",
  "umbrella",
  "bell",
  "bottle",
  "key",
  "flag",
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

const midpoint = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

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
    fakes: [through(centre, 0, 104)],
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

// A rectangle `halfWidth` to each side of the middle and `halfHeight` above
// and below it.
function rectangleOf(
  id: ShapeId,
  name: string,
  halfWidth: number,
  halfHeight: number,
): ShapeDef {
  const [left, right] = [120 - halfWidth, 120 + halfWidth];
  const [top, bottom] = [120 - halfHeight, 120 + halfHeight];
  const corners: Pt[] = [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ];
  return {
    id,
    name,
    strokes: [closed(corners, { fill: true })],
    axes: [
      through(CENTRE, 90, Math.min(REACH, halfHeight + 42)),
      through(CENTRE, 0, Math.min(REACH + 8, halfWidth + 36)),
    ],
    fakes: [
      across(corners[0] as Pt, corners[2] as Pt),
      across(corners[1] as Pt, corners[3] as Pt),
    ],
  };
}

// A rhombus whose diagonals are `2 * halfWide` across and `2 * halfTall` tall.
function rhombusOf(
  id: ShapeId,
  name: string,
  halfWide: number,
  halfTall: number,
): ShapeDef {
  const corners: Pt[] = [
    [120 - halfWide, 120],
    [120, 120 - halfTall],
    [120 + halfWide, 120],
    [120, 120 + halfTall],
  ];
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  return {
    id,
    name,
    strokes: [closed(corners, { fill: true })],
    axes: [
      through(CENTRE, 0, halfWide + 24),
      through(CENTRE, 90, halfTall + 18),
    ],
    fakes: [
      across(midpoint(a, b), midpoint(c, d)),
      across(midpoint(b, c), midpoint(d, a)),
    ],
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

// A parallelogram that leans right (`lean` 1) or left (`lean` -1).
function parallelogramOf(id: ShapeId, name: string, lean: 1 | -1): ShapeDef {
  const lower = (x: number) => (lean === 1 ? x : 240 - x);
  const corners: Pt[] = [
    [lower(72), 72],
    [lower(204), 72],
    [lower(168), 168],
    [lower(36), 168],
  ];
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  return {
    id,
    name,
    strokes: [closed(corners, { fill: true })],
    axes: [],
    fakes: [
      across(a, c),
      across(b, d),
      across(midpoint(a, d), midpoint(b, c)),
      across(midpoint(a, b), midpoint(c, d)),
    ],
  };
}

// A cross whose arms are `arm` wide on each side of the middle and reach
// `reachX` to the left and right, `reachY` up and down.
function crossOutline(arm: number, reachX: number, reachY: number): Pt[] {
  const [lo, hi] = [120 - arm, 120 + arm];
  const [left, right] = [120 - reachX, 120 + reachX];
  const [top, bottom] = [120 - reachY, 120 + reachY];
  return [
    [lo, top],
    [hi, top],
    [hi, lo],
    [right, lo],
    [right, hi],
    [hi, hi],
    [hi, bottom],
    [lo, bottom],
    [lo, hi],
    [left, hi],
    [left, lo],
    [lo, lo],
  ];
}

function plus(): ShapeDef {
  return {
    id: "plus",
    name: "Dấu cộng Chữ thập đỏ",
    strokes: [closed(crossOutline(26, 86, 86), { fill: true })],
    axes: [0, 45, 90, 135].map((deg) => through(CENTRE, deg)),
    fakes: [22, 68].map((deg) => through(CENTRE, deg)),
  };
}

// A cross whose two arms across are longer than the two arms up and down: the
// vertical and the horizontal line are its axes, the diagonals are not.
function cross(): ShapeDef {
  return {
    id: "cross",
    name: "Chữ thập có cánh ngang dài, cánh dọc ngắn",
    strokes: [closed(crossOutline(24, 100, 62), { fill: true })],
    axes: [through(CENTRE, 90, 90), through(CENTRE, 0, 108)],
    fakes: [38, 142].map((deg) => through(CENTRE, deg)),
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
    fakes: [HORIZONTAL, through([150, 122], 90, 100), through(CENTRE, 62, 104)],
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
      open(snake),
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

// Eight squares with no axis of symmetry: the first figure of the workbook's
// exercise on drawing every axis, redrawn square for square.
function pentomino(): ShapeDef {
  const corners: Pt[] = [
    [1, 0],
    [2, 0],
    [2, 1],
    [4, 1],
    [4, 2],
    [3, 2],
    [3, 4],
    [2, 4],
    [2, 3],
    [0, 3],
    [0, 2],
    [1, 2],
  ];
  const [a, b] = [through(CENTRE, 90, 96), through(CENTRE, 0, 96)];
  return {
    id: "pentomino",
    name: "Hình tám ô vuông lệch",
    strokes: [closed(latticePolygon(corners, 44, 4, 4), { fill: true })],
    axes: [],
    fakes: [a, b, through(CENTRE, 45, 100), through(CENTRE, 135, 100)],
  };
}

// Four squares meeting corner to corner along a diagonal (the third figure
// of the same exercise): its two axes are the two diagonals.
function staircase(): ShapeDef {
  const unit = 44;
  const square = (i: number) =>
    closed(
      latticePolygon(
        [
          [i, i],
          [i + 1, i],
          [i + 1, i + 1],
          [i, i + 1],
        ],
        unit,
        4,
        4,
      ),
      { fill: true },
    );
  return {
    id: "staircase",
    name: "Bốn ô vuông xếp chéo",
    strokes: [0, 1, 2, 3].map(square),
    axes: [through(CENTRE, 45, 108), through(CENTRE, 135, 108)],
    fakes: [through(CENTRE, 90, 96), through(CENTRE, 0, 96)],
  };
}

// A triangle whose three sides all differ: no axis.
function scalene(): ShapeDef {
  const corners: Pt[] = [
    [34, 184],
    [196, 160],
    [88, 56],
  ];
  const [a, b, c] = corners as [Pt, Pt, Pt];
  return {
    id: "scalene",
    name: "Hình tam giác có ba cạnh khác nhau",
    strokes: [closed(corners, { fill: true })],
    axes: [],
    fakes: [across(a, midpoint(b, c)), across(b, midpoint(a, c))],
  };
}

// A cloud pushed to one side by the wind: no axis.
function cloud(): ShapeDef {
  const outline = smooth(
    [
      [34, 160],
      [30, 124],
      [62, 108],
      [70, 74],
      [110, 58],
      [146, 76],
      [186, 70],
      [214, 98],
      [200, 132],
      [214, 160],
      [170, 176],
      [100, 170],
    ],
    true,
  );
  return {
    id: "cloud",
    name: "Đám mây lệch",
    strokes: [closed(outline, { fill: true })],
    axes: [],
    fakes: [VERTICAL, HORIZONTAL],
  };
}

// A heart: one vertical axis.
function heart(): ShapeDef {
  const right = smooth(
    [
      [120, 76],
      [146, 44],
      [186, 48],
      [208, 82],
      [194, 128],
      [150, 170],
      [120, 204],
    ],
    false,
  );
  return {
    id: "heart",
    name: "Hình trái tim",
    strokes: [closed(mirroredOutline(right, 120), { fill: true })],
    axes: [through([120, 126], 90, 100)],
    fakes: [HORIZONTAL, through([150, 126], 90, 100), through(CENTRE, 45, 104)],
  };
}

// An arrow pointing up: one vertical axis.
function arrow(): ShapeDef {
  const right: Pt[] = [
    [120, 30],
    [186, 104],
    [148, 104],
    [148, 206],
  ];
  const left = right
    .slice(1)
    .map((p): Pt => [2 * 120 - p[0], p[1]])
    .reverse();
  return {
    id: "arrow",
    name: "Mũi tên chỉ lên",
    strokes: [closed([...right, ...left], { fill: true })],
    axes: [through([120, 118], 90, 100)],
    fakes: [HORIZONTAL, through([140, 118], 90, 100), through(CENTRE, 45, 104)],
  };
}

// A "no entry" sign: a ring with a bar across it, two axes.
function nosign(): ShapeDef {
  return {
    id: "nosign",
    name: "Biển báo cấm",
    strokes: [
      closed(regularPolygon(90, 120, 120, 88, 0), { fill: true }),
      closed(
        [
          [58, 100],
          [182, 100],
          [182, 140],
          [58, 140],
        ],
        { fill: true },
      ),
    ],
    axes: [through(CENTRE, 90, 96), through(CENTRE, 0, 96)],
    fakes: [through(CENTRE, 45, 100), through(CENTRE, 135, 100)],
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

// A closed outline from its right half: the points from the top of the axis
// down to the bottom, then the same points mirrored back up.
function symmetricOutline(right: readonly Pt[]): Pt[] {
  return [...right, ...mirrorX(right.slice(1)).reverse()];
}

const VERTICAL_AXIS = through([120, 126], 90, 100);

// A face mask: one vertical axis.
function mask(): ShapeDef {
  const mouth = Array.from({ length: 9 }, (_, i) =>
    polar(120, 140, 30, 30 + 15 * i),
  );
  return {
    id: "mask",
    name: "Mặt nạ",
    strokes: [
      closed(ellipse(120, 120, 74, 96, 48), { fill: true }),
      closed(ellipse(86, 100, 20, 11, 24)),
      closed(ellipse(154, 100, 20, 11, 24)),
      closed(
        [
          [120, 112],
          [132, 148],
          [108, 148],
        ],
        { thin: true },
      ),
      open(mouth),
    ],
    axes: [VERTICAL_AXIS],
    fakes: [HORIZONTAL, through(CENTRE, 45, 104)],
  };
}

// A wine glass: one vertical axis.
function glass(): ShapeDef {
  return {
    id: "glass",
    name: "Chiếc ly",
    strokes: [
      closed(
        symmetricOutline([
          [120, 40],
          [172, 40],
          [152, 108],
          [128, 134],
          [128, 184],
          [162, 200],
          [162, 212],
        ]),
        { fill: true },
      ),
      open(
        [
          [88, 76],
          [152, 76],
        ],
        { thin: true },
      ),
    ],
    axes: [VERTICAL_AXIS],
    fakes: [HORIZONTAL, through([146, 126], 90, 100)],
  };
}

// A fir tree: one vertical axis.
function pine(): ShapeDef {
  return {
    id: "pine",
    name: "Cây thông",
    strokes: [
      closed(
        symmetricOutline([
          [120, 20],
          [158, 78],
          [140, 78],
          [176, 134],
          [152, 134],
          [192, 192],
          [134, 192],
          [134, 222],
        ]),
        { fill: true },
      ),
    ],
    axes: [through([120, 126], 90, 106)],
    fakes: [HORIZONTAL, through([150, 126], 90, 106)],
  };
}

// An umbrella seen from the front: a dome with a scalloped edge, ribs and a
// handle. One vertical axis.
function umbrella(): ShapeDef {
  const dome = Array.from({ length: 13 }, (_, i) =>
    polar(120, 132, 92, 180 + 15 * i),
  );
  const scallops = [189, 143, 97, 51].flatMap((cx, k) =>
    // The last piece stops short of its end, which is the start of the dome.
    Array.from({ length: k === 3 ? 11 : 12 }, (_, i) =>
      polar(cx, 132, 23, 15 * (i + 1)),
    ),
  );
  return {
    id: "umbrella",
    name: "Chiếc ô",
    strokes: [
      closed([...dome, ...scallops], { fill: true }),
      ...pair(
        [
          [120, 40],
          [74, 132],
        ],
        { closed: false, thin: true },
      ),
      open([
        [120, 132],
        [120, 206],
      ]),
    ],
    axes: [VERTICAL_AXIS],
    fakes: [HORIZONTAL, through([150, 126], 90, 100)],
  };
}

// A bell with its ring and clapper: one vertical axis.
function bell(): ShapeDef {
  return {
    id: "bell",
    name: "Cái chuông",
    strokes: [
      closed(
        symmetricOutline([
          [120, 40],
          [142, 46],
          [158, 74],
          [164, 118],
          [174, 156],
          [204, 176],
          [204, 190],
        ]),
        { fill: true },
      ),
      closed(ellipse(120, 28, 8, 8, 14)),
      closed(ellipse(120, 208, 10, 10, 16), { fill: true }),
    ],
    axes: [VERTICAL_AXIS],
    fakes: [HORIZONTAL, through([150, 126], 90, 100)],
  };
}

// A bottle with a label: one vertical axis.
function bottle(): ShapeDef {
  return {
    id: "bottle",
    name: "Chai nước",
    strokes: [
      closed(
        symmetricOutline([
          [120, 24],
          [134, 24],
          [134, 70],
          [164, 106],
          [164, 214],
        ]),
        { fill: true },
      ),
      closed(
        [
          [100, 140],
          [140, 140],
          [140, 180],
          [100, 180],
        ],
        { thin: true },
      ),
    ],
    axes: [through([120, 120], 90, 106)],
    fakes: [HORIZONTAL, through([150, 120], 90, 106)],
  };
}

// A key with its teeth on one side: no axis.
function key(): ShapeDef {
  return {
    id: "key",
    name: "Chiếc chìa khóa",
    strokes: [
      closed(ellipse(70, 120, 36, 36, 28), { fill: true }),
      closed(ellipse(70, 120, 14, 14, 16), { thin: true }),
      closed(
        [
          [104, 114],
          [212, 114],
          [212, 126],
          [104, 126],
        ],
        { fill: true },
      ),
      closed(
        [
          [176, 126],
          [176, 150],
          [190, 150],
          [190, 126],
        ],
        { fill: true },
      ),
      closed(
        [
          [198, 126],
          [198, 142],
          [210, 142],
          [210, 126],
        ],
        { fill: true },
      ),
    ],
    axes: [],
    fakes: [HORIZONTAL, VERTICAL],
  };
}

// A flag on its pole: the pole runs below the flag, so no axis.
function flag(): ShapeDef {
  return {
    id: "flag",
    name: "Lá cờ cắm trên cột",
    strokes: [
      closed(
        [
          [54, 28],
          [64, 28],
          [64, 214],
          [54, 214],
        ],
        { fill: true },
      ),
      closed(
        [
          [64, 36],
          [190, 36],
          [160, 76],
          [190, 116],
          [64, 116],
        ],
        { fill: true },
      ),
    ],
    axes: [],
    fakes: [HORIZONTAL, VERTICAL],
  };
}

const DEFS: Record<ShapeId, ShapeDef> = {
  triangle: regular("Hình tam giác đều", "triangle", 3, 90, -90, [0, 60]),
  square: regular("Hình vuông", "square", 4, 94, -135, [20, 70]),
  hexagon: regular("Hình lục giác đều", "hexagon", 6, 88, 0, [15, 45]),
  star: star(),
  circle: circle(),
  rectangle: rectangleOf("rectangle", "Hình chữ nhật", 78, 48),
  rhombus: rhombusOf("rhombus", "Hình thoi", 90, 52),
  trapezoid: trapezoid(),
  parallelogram: parallelogramOf("parallelogram", "Hình bình hành", 1),
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
  scalene: scalene(),
  cloud: cloud(),
  heart: heart(),
  arrow: arrow(),
  nosign: nosign(),
  tallrect: rectangleOf("tallrect", "Hình chữ nhật đứng", 48, 84),
  flatrhombus: rhombusOf("flatrhombus", "Hình thoi dẹt", 104, 36),
  slantleft: parallelogramOf(
    "slantleft",
    "Hình bình hành nghiêng sang trái",
    -1,
  ),
  cross: cross(),
  mask: mask(),
  glass: glass(),
  pine: pine(),
  umbrella: umbrella(),
  bell: bell(),
  bottle: bottle(),
  key: key(),
  flag: flag(),
};

export const SHAPES: Readonly<Record<ShapeId, ShapeDef>> = DEFS;

export const AXIS_COUNT: Readonly<Record<ShapeId, number | "vô số">> =
  Object.fromEntries(
    SHAPE_IDS.map((id) => [
      id,
      DEFS[id].endless ? "vô số" : DEFS[id].axes.length,
    ]),
  ) as Record<ShapeId, number | "vô số">;
