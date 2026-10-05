import { type Line, line, type Pt, reflect, type Stroke } from "./geometry";

// Block letters and digits drawn as chains of straight pieces, 10 wide and 16
// tall, so that folding them in the lesson matches the folding of the shapes.
// The two lines a glyph may be symmetric about: the vertical one down its
// middle and the horizontal one across it. Pure data, no React.

export const GLYPH_WIDTH = 10;
export const GLYPH_HEIGHT = 16;

export const VERTICAL_MIDDLE: Line = line([5, -2], [5, 18]);
export const HORIZONTAL_MIDDLE: Line = line([-2, 8], [12, 8]);

export const GLYPH_IDS = [
  "A",
  "B",
  "H",
  "M",
  "N",
  "X",
  "Y",
  "Z",
  "E",
  "T",
  "L",
  "D",
  "V",
  "P",
  "0",
  "1",
  "2",
  "3",
  "5",
  "6",
  "8",
  "9",
  "I",
  "U",
  "C",
  "O",
  "F",
  "K",
  "W",
  "b",
  "d",
] as const;
export type GlyphId = (typeof GLYPH_IDS)[number];

const open = (...pts: Pt[]): Stroke => ({ pts, closed: false });
const loop = (...pts: Pt[]): Stroke => ({ pts, closed: true });

const turned = (stroke: Stroke): Stroke => ({
  closed: stroke.closed,
  pts: stroke.pts.map(([x, y]) => [GLYPH_WIDTH - x, GLYPH_HEIGHT - y]),
});
const mirrored = (stroke: Stroke): Stroke => ({
  closed: stroke.closed,
  pts: stroke.pts.map((p) => reflect(p, VERTICAL_MIDDLE)),
});

// The squared 2 of the workbook's cards: its mirror image is a 5.
const TWO = open([0, 0], [10, 0], [10, 8], [0, 8], [0, 16], [10, 16]);
const SMALL_B: readonly Stroke[] = [
  open([0, 0], [0, 16]),
  loop([0, 8], [7, 8], [10, 10], [10, 14], [7, 16], [0, 16]),
];
const NINE_LOOP = loop(
  [2, 0],
  [8, 0],
  [10, 2],
  [10, 6],
  [8, 8],
  [2, 8],
  [0, 6],
  [0, 2],
);
const NINE = [NINE_LOOP, open([10, 6], [10, 14], [8, 16], [2, 16], [0, 14])];

export const GLYPHS: Readonly<Record<GlyphId, readonly Stroke[]>> = {
  A: [open([0, 16], [5, 0], [10, 16]), open([1.75, 10.4], [8.25, 10.4])],
  B: [
    open([0, 0], [0, 16]),
    open([0, 0], [6, 0], [8, 2], [8, 6], [6, 8], [0, 8]),
    open([0, 8], [6, 8], [8, 10], [8, 14], [6, 16], [0, 16]),
  ],
  H: [open([0, 0], [0, 16]), open([10, 0], [10, 16]), open([0, 8], [10, 8])],
  M: [open([0, 16], [0, 0], [5, 9], [10, 0], [10, 16])],
  N: [open([0, 16], [0, 0], [10, 16], [10, 0])],
  X: [open([0, 0], [10, 16]), open([10, 0], [0, 16])],
  Y: [open([0, 0], [5, 8], [10, 0]), open([5, 8], [5, 16])],
  Z: [open([0, 0], [10, 0], [0, 16], [10, 16])],
  E: [
    open([0, 0], [0, 16]),
    open([0, 0], [10, 0]),
    open([0, 8], [8, 8]),
    open([0, 16], [10, 16]),
  ],
  T: [open([0, 0], [10, 0]), open([5, 0], [5, 16])],
  L: [open([0, 0], [0, 16], [10, 16])],
  D: [
    open([0, 0], [0, 16]),
    open([0, 0], [5, 0], [10, 4], [10, 12], [5, 16], [0, 16]),
  ],
  V: [open([0, 0], [5, 16], [10, 0])],
  P: [
    open([0, 0], [0, 16]),
    open([0, 0], [7, 0], [10, 3], [10, 6], [7, 9], [0, 9]),
  ],
  "0": [
    loop([2, 0], [8, 0], [10, 2], [10, 14], [8, 16], [2, 16], [0, 14], [0, 2]),
  ],
  "1": [open([5, 0], [5, 16])],
  "2": [TWO],
  "3": [
    open([0, 0], [8, 0], [10, 2], [10, 6], [8, 8], [3, 8]),
    open([3, 8], [8, 8], [10, 10], [10, 14], [8, 16], [0, 16]),
  ],
  "5": [mirrored(TWO)],
  "6": NINE.map(turned),
  "8": [
    NINE_LOOP,
    loop(
      [2, 8],
      [8, 8],
      [10, 10],
      [10, 14],
      [8, 16],
      [2, 16],
      [0, 14],
      [0, 10],
    ),
  ],
  "9": NINE,
  I: [open([0, 0], [10, 0]), open([5, 0], [5, 16]), open([0, 16], [10, 16])],
  U: [open([0, 0], [0, 12], [3, 16], [7, 16], [10, 12], [10, 0])],
  C: [
    open([10, 3], [7, 0], [3, 0], [0, 3], [0, 13], [3, 16], [7, 16], [10, 13]),
  ],
  O: [
    loop([3, 0], [7, 0], [10, 3], [10, 13], [7, 16], [3, 16], [0, 13], [0, 3]),
  ],
  F: [open([0, 16], [0, 0], [10, 0]), open([0, 8], [7, 8])],
  K: [open([0, 0], [0, 16]), open([10, 0], [0, 8], [10, 16])],
  W: [open([0, 0], [2.5, 16], [5, 6], [7.5, 16], [10, 0])],
  b: SMALL_B,
  d: SMALL_B.map(mirrored),
};

// Which of the two middle lines are axes of the glyph: "v" the vertical one,
// "h" the horizontal one. A glyph with neither has no axis.
export const GLYPH_AXES: Readonly<Record<GlyphId, readonly ("v" | "h")[]>> = {
  A: ["v"],
  B: ["h"],
  H: ["v", "h"],
  M: ["v"],
  N: [],
  X: ["v", "h"],
  Y: ["v"],
  Z: [],
  E: ["h"],
  T: ["v"],
  L: [],
  D: ["h"],
  V: ["v"],
  P: [],
  "0": ["v", "h"],
  "1": ["v", "h"],
  "2": [],
  "3": ["h"],
  "5": [],
  "6": [],
  "8": ["v", "h"],
  "9": [],
  I: ["v", "h"],
  U: ["v"],
  C: ["h"],
  O: ["v", "h"],
  F: [],
  K: ["h"],
  W: ["v"],
  b: [],
  d: [],
};

export const GLYPH_NAME: Readonly<Record<GlyphId, string>> = {
  A: "Chữ A",
  B: "Chữ B",
  H: "Chữ H",
  M: "Chữ M",
  N: "Chữ N",
  X: "Chữ X",
  Y: "Chữ Y",
  Z: "Chữ Z",
  E: "Chữ E",
  T: "Chữ T",
  L: "Chữ L",
  D: "Chữ D",
  V: "Chữ V",
  P: "Chữ P",
  "0": "Chữ số 0",
  "1": "Chữ số 1",
  "2": "Chữ số 2",
  "3": "Chữ số 3",
  "5": "Chữ số 5",
  "6": "Chữ số 6",
  "8": "Chữ số 8",
  "9": "Chữ số 9",
  I: "Chữ I",
  U: "Chữ U",
  C: "Chữ C",
  O: "Chữ O",
  F: "Chữ F",
  K: "Chữ K",
  W: "Chữ W",
  b: "Chữ b",
  d: "Chữ d",
};
