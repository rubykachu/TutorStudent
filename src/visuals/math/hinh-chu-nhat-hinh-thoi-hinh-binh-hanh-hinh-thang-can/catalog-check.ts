import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import {
  angleProbe,
  figure,
  frame,
  gallery,
  steps,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  polygonFigure,
  quad,
  textAt,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of the lesson on checking a rhombus and a rectangle: telling a
// quadrilateral apart by measuring its sides and its angles.

// A leaning rhombus XYZT with sides of 110 and a 60° angle at X, for the
// measuring steps.
const RHOMBUS_POINTS: Record<string, Pt> = {
  X: [50, 150],
  Y: [160, 150],
  Z: [215, 54.7],
  T: [105, 54.7],
};
const rhombusXyzt = (label: string, extra: Partial<FigureSpec> = {}) => ({
  ...polygonFigure(label, { points: RHOMBUS_POINTS, names: true }),
  ...extra,
});
const SIDE_PAIRS = [
  ["X", "Y"],
  ["Y", "Z"],
  ["Z", "T"],
  ["T", "X"],
] as const;
// The first `count` sides of XYZT drawn bold blue: the sides measured so far.
const measured = (count: number): FigureSpec => ({
  ...rhombusXyzt("Tứ giác XYZT"),
  segs: SIDE_PAIRS.slice(0, count).map(([a, b]) => ({
    a,
    b,
    tone: "blue" as const,
    bold: true,
  })),
});

export const CHECK_SPECS: Record<string, VisualSpec> = {
  // Kiểm tra hình thoi và hình chữ nhật
  "kiem-cac-buoc": steps("Đo bốn cạnh của tứ giác XYZT", [
    frame(rhombusXyzt("Tứ giác XYZT"), "Tứ giác XYZT"),
    frame(measured(1), "Đo cạnh XY: 4 cm"),
    frame(measured(2), "Đo cạnh YZ: 4 cm"),
    frame(measured(4), "Đo cạnh ZT và cạnh TX: cũng 4 cm"),
    frame(
      {
        ...measured(4),
        label: "Bốn cạnh bằng nhau",
        ticks: [{ segs: SIDE_PAIRS, count: 1, tone: "blue" }],
      },
      "Bốn cạnh bằng nhau: XYZT là hình thoi",
    ),
  ]),
  "kiem-quy-tac": gallery(
    "Bốn cạnh bằng nhau là hình thoi, bốn góc vuông là hình chữ nhật",
    [
      {
        figure: quad("thoi", {
          label: "Hình thoi có bốn cạnh bằng nhau",
          fill: true,
          sides: "all",
          ...THUMB,
        }),
        caption: "Bốn cạnh bằng nhau: hình thoi",
      },
      {
        figure: quad("chu-nhat", {
          label: "Hình chữ nhật có bốn góc vuông",
          fill: true,
          rights: true,
          ...THUMB,
        }),
        caption: "Bốn góc vuông: hình chữ nhật",
      },
    ],
    2,
  ),
  "to-giay-goc": figure({
    label: "Góc tờ giấy khít với góc vuông của hình",
    w: 300,
    h: 200,
    pts: {
      O: [90, 150],
      X: [250, 150],
      Y: [90, 30],
      p1: [180, 150],
      p2: [180, 60],
      p3: [90, 60],
    },
    polys: [{ v: ["O", "p1", "p2", "p3"], tone: "mute", fill: "amber" }],
    segs: [
      { a: "O", b: "X", bold: true },
      { a: "O", b: "Y", bold: true },
    ],
    rights: [{ at: "O", a: "X", b: "Y", tone: "violet" }],
    texts: [textAt(150, 182, "Góc tờ giấy khít góc vuông")],
  }),
  "kiem-chu-nhat-goc": {
    kind: "probe",
    figure: quad("chu-nhat", {
      label: "Tứ giác ABCD cần kiểm tra bằng êke",
      names: true,
      fill: true,
    }),
    parts: angleProbe(
      [
        ["A", "D", "B"],
        ["B", "A", "C"],
        ["C", "B", "D"],
        ["D", "C", "A"],
      ],
      "khít",
      { right: true },
    ),
    verb: "kiểm",
    done: "Cả bốn góc đều khít góc vuông, nên ABCD là hình chữ nhật.",
  },
  // The three shapes of the tapping exercise lie apart, so that no shape
  // contains another and none gives the answer away.
  "chon-hinh-bon-goc-vuong": figure({
    label: "Ba hình để chạm chọn",
    w: 300,
    h: 200,
    pts: {
      a: [75, 12],
      b: [125, 52],
      c: [75, 92],
      d: [25, 52],
      e: [158, 22],
      f: [282, 10],
      g: [262, 84],
      h: [132, 80],
      i: [95, 112],
      j: [215, 112],
      k: [215, 184],
      l: [95, 184],
    },
    polys: [
      {
        v: ["a", "b", "c", "d"],
        fill: "mute",
        region: "thoi",
        label: "Hình thứ nhất",
      },
      {
        v: ["e", "f", "g", "h"],
        fill: "mute",
        region: "lech",
        label: "Hình thứ hai",
      },
      {
        v: ["i", "j", "k", "l"],
        fill: "mute",
        region: "cn",
        label: "Hình thứ ba",
      },
    ],
  }),
};
