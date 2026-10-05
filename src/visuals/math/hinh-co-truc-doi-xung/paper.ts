import { horizontal, type Line, line, type Pt, vertical } from "./geometry";
import type { ShapeStroke } from "./shapes";

// Sheets of paper folded and cut, drawn open: the sheet's outline, the shape
// that is cut out of it and the fold lines. Folded in half along `fold`, the
// sheet shows only one half of the cut, which is all the child sees on the
// page; opened, the two halves together are the whole shape. Pure data.

export type Paper = {
  name: string;
  // The sheet, open, with the cut-out shapes.
  strokes: readonly ShapeStroke[];
  // The fold line (a vertical or horizontal line through the middle).
  fold: Line;
  // What the open sheet shows once the cut is opened.
  opens: string;
};

export type PaperId = "v" | "m" | "o" | "t";

const closed = (pts: readonly Pt[], fill = true): ShapeStroke => ({
  pts,
  closed: true,
  fill,
});

const MIDDLE = 120;

function mirror(pts: readonly Pt[]): Pt[] {
  return pts.map(([x, y]) => [2 * MIDDLE - x, y]);
}

// A sheet of two halves side by side, folded along the vertical line down its
// middle, with `half` cut in the left half and its mirror image in the right.
function sideBySide(half: readonly Pt[]): ShapeStroke[] {
  return [
    closed(
      [
        [40, 44],
        [200, 44],
        [200, 196],
        [40, 196],
      ],
      false,
    ),
    closed(half),
    closed(mirror(half)),
  ];
}

// The half of a letter V: a strip from the top-left corner down to the fold.
const V_HALF: Pt[] = [
  [58, 66],
  [86, 66],
  [120, 140],
  [120, 176],
];

// The half of a letter M, taken from a letter 140 wide and 120 tall.
const M_UNITS: Pt[] = [
  [0, 6],
  [0, 0],
  [1.2, 0],
  [3, 3.6],
  [3, 5.4],
  [1.2, 2.4],
  [1.2, 6],
];
const M_HALF: Pt[] = M_UNITS.map(([u, v]) => [50 + u * 23.33, 66 + v * 18]);

// A ring cut in a sheet folded along its lower edge: the band between two
// half ellipses, with the sheet above the fold line y = 150.
function bandAbove(): ShapeStroke[] {
  const outer = Array.from({ length: 19 }, (_, i): Pt => {
    const a = Math.PI + (Math.PI * i) / 18;
    return [120 + 72 * Math.cos(a), 150 + 76 * Math.sin(a)];
  });
  const inner = Array.from({ length: 19 }, (_, i): Pt => {
    const a = 2 * Math.PI - (Math.PI * i) / 18;
    return [120 + 40 * Math.cos(a), 150 + 44 * Math.sin(a)];
  });
  const upper = [...outer, ...inner];
  const lower = upper.map(([x, y]): Pt => [x, 300 - y]);
  return [
    closed(
      [
        [36, 60],
        [204, 60],
        [204, 240],
        [36, 240],
      ],
      false,
    ),
    closed(upper),
    closed(lower),
  ];
}

// The half of a diamond: a triangle with its long side on the fold.
const T_HALF: Pt[] = [
  [64, 120],
  [120, 70],
  [120, 170],
];

export const PAPERS: Readonly<Record<PaperId, Paper>> = {
  v: {
    name: "Tờ giấy cắt một dải chéo",
    strokes: sideBySide(V_HALF),
    fold: vertical(MIDDLE, 30, 210),
    opens: "chữ V",
  },
  m: {
    name: "Tờ giấy cắt nửa chữ M",
    strokes: sideBySide(M_HALF),
    fold: vertical(MIDDLE, 30, 210),
    opens: "chữ M",
  },
  t: {
    name: "Tờ giấy cắt một hình tam giác",
    strokes: sideBySide(T_HALF),
    fold: vertical(MIDDLE, 30, 210),
    opens: "hình thoi",
  },
  o: {
    name: "Tờ giấy cắt một dải cong",
    strokes: bandAbove(),
    fold: line([20, 150], [220, 150]),
    opens: "chữ O",
  },
};

// The sheet of the example: 3 cm by 5 cm, folded in half along the vertical
// line, then in half along the horizontal line, with a small rectangle cut
// at the corner where the two folds meet.
export const SHEET_TWICE: {
  strokes: readonly ShapeStroke[];
  vertical: Line;
  horizontal: Line;
} = {
  strokes: [
    closed(
      [
        [72, 40],
        [168, 40],
        [168, 200],
        [72, 200],
      ],
      false,
    ),
    closed([
      [100, 92],
      [140, 92],
      [140, 148],
      [100, 148],
    ]),
  ],
  vertical: vertical(MIDDLE, 20, 220),
  horizontal: horizontal(MIDDLE, 40, 200),
};
