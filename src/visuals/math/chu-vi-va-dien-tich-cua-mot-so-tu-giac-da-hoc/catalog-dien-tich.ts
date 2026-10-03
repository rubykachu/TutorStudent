import type {
  FigurePoly,
  FigureSpec,
  Pt,
} from "@/visuals/shared/plane/figure-spec";
import {
  figure,
  formulaCaption,
  gallery,
  small,
  steps,
  unbreakable,
} from "./builders";
import {
  centroid,
  gridFigure,
  RULE_FIGURE_HEIGHT,
  shape,
  sideTextAt,
  units,
} from "./figures";
import type { FloorSpec, TilesSpec } from "./models";
import type { VisualSpec } from "./spec";
import {
  parallelogramFrames,
  parallelogramSlide,
  rhombusFold,
  rhombusFrames,
  trapezoidFrames,
  trapezoidJoin,
} from "./stages";

// Pictures of the sections on the area: unit squares, the rectangle and the
// square, the parallelogram cut into a rectangle, the rhombus fitted into
// half of its box, the trapezoid doubled into a parallelogram, and the
// figures of the exercises.

const OPTION = { w: 200, h: 140, margin: 28 } as const;

type Cell = readonly [number, number];

const cellsOfRows = (cols: number, rows: number): Cell[] =>
  Array.from({ length: cols * rows }, (_, i) => [
    i % cols,
    Math.floor(i / cols),
  ]);

// Grid of unit squares centred on a canvas, rows from the top painted.
function paintedRows(
  label: string,
  cols: number,
  rows: number,
  cell: number,
  paintedRowCount: number,
  extra: { h?: number; y?: number; texts?: FigureSpec["texts"] } = {},
): FigureSpec {
  const w = 320;
  return gridFigure({
    label,
    cols,
    rows,
    cell,
    x: (w - cols * cell) / 2,
    y: extra.y ?? 16,
    w,
    h: extra.h ?? rows * cell + 32,
    filled: cellsOfRows(cols, paintedRowCount),
    fill: "teal",
    ...(extra.texts ? { texts: extra.texts } : {}),
  });
}

// Adds the height of a shape: a dashed violet segment from corner `top` to
// its foot on the base line through `base` (same height as `foot`), the little
// square of the right angle, and the measure beside it.
function heightExtra(
  top: string,
  footBase: string,
  along: string,
  text: string,
): (pts: Readonly<Record<string, Pt>>) => Partial<FigureSpec> {
  return (pts) => {
    const t = pts[top] as Pt;
    const f: Pt = [t[0], (pts[footBase] as Pt)[1]];
    return {
      pts: { F: f },
      segs: [{ a: top, b: "F", tone: "violet", dash: true }],
      rights: [{ at: "F", a: top, b: along, tone: "violet" }],
      texts: [
        {
          x: f[0] + (text.length * 4.7 + 12),
          y: (t[1] + f[1]) / 2,
          text,
          tone: "violet",
        },
      ],
    };
  };
}

// The floor of the lesson screen, 6 m by 4 m in squares of 1 m, with its
// measures; the first `painted` rows are painted.
function floorRows(label: string, painted: number): FigureSpec {
  const cell = 36;
  return paintedRows(label, 6, 4, cell, painted, {
    y: 30,
    h: 190,
    texts: [
      { x: 160, y: 14, text: "6 m", tone: "ink" },
      { x: 26, y: 30 + 2 * cell, text: "4 m", tone: "ink" },
    ],
  });
}

const TILES_STAIRS: TilesSpec = {
  label: "Hình bậc thang gồm các ô vuông, mỗi ô có diện tích 1 cm²",
  cols: 4,
  rows: 4,
  cells: [
    [0, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ],
  legend: "Mỗi ô vuông có diện tích 1 cm².",
  done: "Có 10 ô vuông, nên diện tích của hình là 10 cm².",
};

const FLOOR: FloorSpec = {
  goal: { perRow: 5, rows: 3 },
  tile: "1 m",
  done: "5 · 3 = 15 ô vuông: diện tích sàn là 15 m².",
};

// Three shapes of unit squares for the exercise "tap the shape of 4 cm²":
// 3 squares (an L), 4 squares (2 by 2) and 6 squares (3 by 2).
function squaresChoice(): FigureSpec {
  const cell = 30;
  const shapes = [
    {
      id: "h3",
      label: "Hình thứ nhất",
      ox: 22,
      cells: [
        [0, 0],
        [0, 1],
        [1, 1],
      ] as Cell[],
      outline: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
        [0, 2],
      ] as Cell[],
    },
    {
      id: "h4",
      label: "Hình thứ hai",
      ox: 122,
      cells: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ] as Cell[],
      outline: [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ] as Cell[],
    },
    {
      id: "h6",
      label: "Hình thứ ba",
      ox: 212,
      cells: cellsOfRows(3, 2),
      outline: [
        [0, 0],
        [3, 0],
        [3, 2],
        [0, 2],
      ] as Cell[],
    },
  ];
  const oy = 24;
  const pts: Record<string, Pt> = {};
  const polys: FigurePoly[] = [];
  for (const s of shapes) {
    for (const [c, r] of s.cells) {
      const names = [
        [c, r],
        [c + 1, r],
        [c + 1, r + 1],
        [c, r + 1],
      ].map(([x, y]) => {
        const name = `${s.id}c${x}_${y}`;
        pts[name] = [s.ox + (x as number) * cell, oy + (y as number) * cell];
        return name;
      });
      polys.push({ v: names, tone: "mute", fill: "teal" });
    }
  }
  for (const s of shapes) {
    const names = s.outline.map(([x, y], i) => {
      const name = `${s.id}o${i}`;
      pts[name] = [s.ox + x * cell, oy + y * cell];
      return name;
    });
    polys.push({ v: names, tone: "ink", region: s.id, label: s.label });
  }
  return {
    label: "Ba hình gồm các ô vuông, mỗi ô vuông có diện tích 1 cm²",
    w: 320,
    h: 110,
    pts,
    polys,
  };
}

const rectAB = (w: number, h: number) => ({
  h: RULE_FIGURE_HEIGHT,
  corners: units.rect(w, h),
});

export const DIEN_TICH_SPECS: Record<string, VisualSpec> = {
  // Section 4: what area is.
  "phu-o-vuong": steps("Phủ các ô vuông lên một hình chữ nhật", [
    {
      figure: gridFigure({
        label: "Một ô vuông cạnh 1 cm",
        cols: 4,
        rows: 3,
        cell: 40,
        x: 80,
        y: 16,
        w: 320,
        h: 152,
        filled: [[0, 0]],
        fill: "teal",
      }),
      caption: "Một ô vuông cạnh 1 cm có diện tích 1 cm².",
    },
    {
      figure: paintedRows("Hàng đầu có 4 ô vuông", 4, 3, 40, 1, { h: 152 }),
      caption: "Hàng đầu có 4 ô: diện tích 4 cm².",
    },
    {
      figure: paintedRows("Hai hàng có 8 ô vuông", 4, 3, 40, 2, { h: 152 }),
      caption: "Thêm một hàng nữa: 8 ô, diện tích 8 cm².",
    },
    {
      figure: paintedRows("Ba hàng có 12 ô vuông", 4, 3, 40, 3, { h: 152 }),
      caption: "Phủ kín hình bằng 12 ô: diện tích 12 cm².",
    },
  ]),
  "dt-quy-tac": figure(
    paintedRows("Hình chữ nhật phủ kín bởi 12 ô vuông", 4, 3, 40, 3, {
      h: 196,
      texts: [{ x: 160, y: 180, text: "12 ô vuông: 12 cm²", tone: "teal" }],
    }),
  ),
  "tiles-bac-thang": { kind: "tiles", ...TILES_STAIRS },
  "f-do-7-o": figure(
    gridFigure({
      label: "Hình gồm 7 ô vuông, mỗi ô có diện tích 1 cm²",
      cols: 4,
      rows: 3,
      cell: 36,
      x: 88,
      y: 12,
      w: 320,
      h: 132,
      cells: [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [0, 2],
        [1, 2],
      ],
      fill: "teal",
    }),
  ),
  "f-chu-l-9-o": figure(
    gridFigure({
      label: "Hình chữ L gồm 11 ô vuông, mỗi ô có diện tích 1 cm²",
      cols: 5,
      rows: 3,
      cell: 36,
      x: 70,
      y: 12,
      w: 320,
      h: 132,
      cells: [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
      ],
      fill: "teal",
    }),
  ),
  "cham-hinh-4-o": figure(squaresChoice()),
  // Section 5: rectangle and square.
  "hang-cot-gach": steps(
    "Sàn dài 6 m, rộng 4 m, chia thành các ô vuông cạnh 1 m",
    [
      {
        figure: floorRows("Sàn 6 ô một hàng, 4 hàng", 0),
        caption: "Sàn dài 6 m, rộng 4 m. Dài 6 m nên mỗi hàng có 6 ô.",
      },
      {
        figure: floorRows("Một hàng có 6 ô", 1),
        caption: "Hàng đầu có 6 ô.",
      },
      {
        figure: floorRows("Hai hàng có 12 ô", 2),
        caption: "Hai hàng có 6 + 6 = 12 ô.",
      },
      {
        figure: floorRows("Ba hàng có 18 ô", 3),
        caption: "Ba hàng có 18 ô.",
      },
      {
        figure: floorRows("Bốn hàng có 24 ô", 4),
        caption:
          "Rộng 4 m nên có 4 hàng: 6 · 4 = 24 ô, diện tích sàn là 24 m².",
      },
    ],
  ),
  "dt-cn-quy-tac": gallery(
    "Hình chữ nhật có hai cạnh a và b, hình vuông có cạnh a",
    [
      {
        caption: `${formulaCaption("Hình chữ nhật", "S = a · b")}\nSách viết ab nghĩa là a · b.`,
        figure: shape({
          label: "Hình chữ nhật có hai cạnh a và b",
          ...rectAB(5, 3),
          fill: "teal",
          sides: [
            { i: 0, text: "a", tone: "ink" },
            { i: 3, text: "b", tone: "ink" },
          ],
        }),
      },
      {
        caption: `${formulaCaption("Hình vuông", "S = a · a")}\nSách viết a · a là a².`,
        figure: shape({
          label: "Hình vuông có cạnh a",
          ...rectAB(1, 1),
          fill: "teal",
          sides: [
            { i: 0, text: "a", tone: "ink" },
            { i: 3, text: "a", tone: "ink" },
          ],
        }),
      },
    ],
    1,
  ),
  "floor-lesson": { kind: "floor", ...FLOOR },
  "f-chu-nhat-9-4": figure(
    shape({
      label: "Hình chữ nhật dài 9 cm, rộng 4 cm",
      corners: units.rect(9, 4),
      fill: "teal",
      sides: [
        { i: 0, text: "9 cm" },
        { i: 3, text: "4 cm" },
      ],
    }),
  ),
  // Section 6: parallelogram.
  "bbh-cat-ghep": steps(
    "Cắt hình bình hành rồi ghép thành hình chữ nhật",
    parallelogramFrames(),
  ),
  "bbh-quy-tac": gallery(
    "Hình bình hành có cạnh đáy a và chiều cao h",
    [
      {
        caption: `${formulaCaption("Hình bình hành", "S = a · h")}\na là cạnh đáy, h là chiều cao`,
        figure: shape({
          label: "Hình bình hành có cạnh đáy a và chiều cao h",
          corners: units.parallelogram(6, 3, 2),
          h: RULE_FIGURE_HEIGHT,
          fill: "teal",
          sides: [{ i: 2, text: "a", tone: "ink" }],
          extra: heightExtra("A", "D", "C", "h"),
        }),
      },
    ],
    1,
  ),
  "stage-bbh": { kind: "stage", ...parallelogramSlide() },
  "f-bbh-9-5": figure(
    shape({
      label: "Hình bình hành có cạnh đáy 9 cm và chiều cao 5 cm",
      corners: units.parallelogram(9, 5, 3),
      fill: "teal",
      sides: [{ i: 2, text: "9 cm" }],
      extra: heightExtra("A", "D", "C", "5 cm"),
    }),
  ),
  "f-bbh-8-5-4": figure(
    shape({
      label: "Hình bình hành có cạnh đáy 8 cm, cạnh bên 5 cm và chiều cao 4 cm",
      corners: units.parallelogram(8, 4, 3),
      fill: "teal",
      sides: [
        { i: 2, text: "8 cm" },
        { i: 1, text: "5 cm" },
      ],
      extra: heightExtra("A", "D", "C", "4 cm"),
    }),
  ),
  // The three drawings of "which one is the height".
  "h-dung": small(
    shape({
      label: "Đoạn h kẻ từ một đỉnh thẳng xuống cạnh đáy",
      corners: units.parallelogram(6, 3, 2),
      ...OPTION,
      extra: (pts) => {
        const a = pts.A as Pt;
        const d = pts.D as Pt;
        const foot: Pt = [a[0], d[1]];
        return {
          pts: { F: foot },
          segs: [{ a: "A", b: "F", tone: "violet", bold: true }],
          texts: [
            {
              x: foot[0] + 16,
              y: (a[1] + foot[1]) / 2,
              text: "h",
              tone: "violet",
            },
          ],
        };
      },
    }),
  ),
  "h-canh-ben": small(
    shape({
      label: "Đoạn h là cạnh bên nghiêng của hình bình hành",
      corners: units.parallelogram(6, 3, 2),
      ...OPTION,
      sides: [{ i: 3, text: "h", tone: "violet" }],
      extra: () => ({ segs: [{ a: "D", b: "A", tone: "violet", bold: true }] }),
    }),
  ),
  "h-duong-cheo": small(
    shape({
      label: "Đoạn h là đường chéo của hình bình hành",
      corners: units.parallelogram(6, 3, 2),
      ...OPTION,
      extra: (pts) => {
        const a = pts.A as Pt;
        const c = pts.C as Pt;
        const [x, y] = sideTextAt(a, c, centroid([a, c]), "h");
        return {
          segs: [{ a: "A", b: "C", tone: "violet", bold: true }],
          texts: [{ x, y, text: "h", tone: "violet" }],
        };
      },
    }),
  ),
  // Section 7: rhombus.
  "thoi-gap": steps(
    "Xoay bốn tam giác nằm ngoài vào trong hình thoi",
    rhombusFrames(),
  ),
  "thoi-quy-tac": gallery(
    "Hình thoi có hai đường chéo a và b",
    [
      {
        caption: `${formulaCaption("Hình thoi", "S = a · b : 2")}\na, b là hai đường chéo\nSách viết ${unbreakable("½ · a · b")}, nghĩa là ${unbreakable("a · b : 2")}.`,
        figure: shape({
          label: "Hình thoi có hai đường chéo a và b",
          corners: units.rhombus(8, 6),
          fill: "teal",
          extra: (pts) => {
            const top = pts.A as Pt;
            const left = pts.D as Pt;
            const cx = top[0];
            const cy = left[1];
            return {
              segs: [
                { a: "A", b: "C", tone: "amber", dash: true },
                { a: "B", b: "D", tone: "amber", dash: true },
              ],
              // Each letter beside its own diagonal, on the side where the
              // rhombus is wide enough to hold it clear of every line.
              texts: [
                { x: (cx + left[0]) / 2, y: cy + 17, text: "a", tone: "amber" },
                {
                  x: cx + 17,
                  y: (top[1] + cy) / 2,
                  text: "b",
                  tone: "amber",
                },
              ],
            };
          },
        }),
      },
    ],
    1,
  ),
  "stage-thoi": { kind: "stage", ...rhombusFold() },
  "f-thoi-10-4": figure(
    shape({
      label: "Hình thoi có hai đường chéo 10 cm và 4 cm",
      corners: units.rhombus(10, 4),
      fill: "teal",
      w: 360,
      margin: 70,
      h: 210,
      reserve: 40,
      extra: (pts) => {
        const top = pts.A as Pt;
        const right = pts.B as Pt;
        const bottom = pts.C as Pt;
        const left = pts.D as Pt;
        // The diagonals as dashed lines, their lengths on dimension lines
        // under and beside the rhombus.
        const under = bottom[1] + 26;
        const beside = right[0] + 20;
        return {
          pts: {
            U1: [left[0], under],
            U2: [right[0], under],
            S1: [beside, top[1]],
            S2: [beside, bottom[1]],
          },
          segs: [
            { a: "A", b: "C", tone: "amber", dash: true },
            { a: "B", b: "D", tone: "amber", dash: true },
            { a: "U1", b: "U2", tone: "amber" },
            { a: "S1", b: "S2", tone: "amber" },
          ],
          texts: [
            { x: top[0], y: under + 20, text: "10 cm", tone: "amber" },
            { x: beside + 28, y: left[1], text: "4 cm", tone: "amber" },
          ],
        };
      },
    }),
  ),
  // Section 8: trapezoid.
  "thang-ghep": steps(
    "Ghép hai hình thang cân thành một hình bình hành",
    trapezoidFrames(),
  ),
  "thang-quy-tac": gallery(
    "Hình thang cân có hai đáy a, b và chiều cao h",
    [
      {
        caption: `${formulaCaption("Hình thang cân", "S = (a + b) · h : 2")}\na, b là hai đáy, h là chiều cao\nSách viết ${unbreakable("½ · (a + b) · h")}, nghĩa là ${unbreakable("(a + b) · h : 2")}.`,
        figure: shape({
          label: "Hình thang cân có hai đáy a, b và chiều cao h",
          corners: units.trapezoid(8, 4, 3),
          h: RULE_FIGURE_HEIGHT,
          fill: "teal",
          sides: [
            { i: 1, text: "a", tone: "ink" },
            { i: 3, text: "b", tone: "ink" },
          ],
          extra: heightExtra("B", "A", "D", "h"),
        }),
      },
    ],
    1,
  ),
  "stage-thang": { kind: "stage", ...trapezoidJoin() },
  "f-thang-3-7-4": figure(
    shape({
      label: "Hình thang cân có hai đáy 3 cm và 7 cm, chiều cao 4 cm",
      corners: units.trapezoid(7, 3, 4),
      fill: "teal",
      sides: [
        { i: 1, text: "3 cm" },
        { i: 3, text: "7 cm" },
      ],
      extra: heightExtra("B", "A", "D", "4 cm"),
    }),
  ),
  "f-thang-6-12-5-4": figure(
    shape({
      label:
        "Hình thang cân có hai đáy 6 cm và 12 cm, cạnh bên 5 cm, chiều cao 4 cm",
      corners: units.trapezoid(12, 6, 4),
      fill: "teal",
      sides: [
        { i: 1, text: "6 cm" },
        { i: 3, text: "12 cm" },
        { i: 0, text: "5 cm" },
      ],
      extra: heightExtra("B", "A", "D", "4 cm"),
    }),
  ),
};
