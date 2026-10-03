import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { regularPoints } from "@/visuals/shared/plane/geometry";
import {
  angleProbe,
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  steps,
  THUMB,
} from "./builders";
import {
  diagonalParallelogram,
  hexagonDiagonals,
  isoTrapezoid,
  labelSide,
  polygonFigure,
  quad,
  textAt,
  triangleStrip,
} from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of sections 16 to 18: telling the shapes apart by measuring, and
// putting pieces together.

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

// A parallelogram whose diagonals have halves of 4 and 3 units.
const checkParallelogram = (label: string, extra: object = {}) =>
  diagonalParallelogram(label, {
    first: 4,
    second: 3,
    between: 50,
    names: true,
    ...extra,
  });

// An isosceles trapezoid with base angles of 65°.
const checkTrapezoid = (label: string, extra: object = {}) =>
  isoTrapezoid(label, { angle: 65, names: true, ...extra });

// A regular hexagon with the trapezoids ABCD and DEFA, the two halves cut
// along the diagonal AD.
function twoHalves(): FigureSpec {
  const names = ["A", "B", "C", "D", "E", "F"];
  const corners = regularPoints(6, 160, 120, 100, 180);
  return {
    label: "Hai hình thang cân ghép thành một hình lục giác đều",
    w: 320,
    h: 240,
    pts: Object.fromEntries(names.map((name, i) => [name, corners[i] as Pt])),
    polys: [
      { v: ["A", "B", "C", "D"], tone: "ink", fill: "sky" },
      { v: ["D", "E", "F", "A"], tone: "ink", fill: "sky" },
    ],
    segs: [{ a: "A", b: "D", bold: true }],
    names,
  };
}

export const CHECK_SPECS: Record<string, VisualSpec> = {
  // 16. Kiểm tra hình thoi và hình chữ nhật
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
      e: [160, 20],
      f: [280, 20],
      g: [250, 84],
      h: [130, 84],
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
        region: "bh",
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

  // 17. Kiểm tra hình bình hành và hình thang cân
  "kiem-bh-cac-buoc": steps("Đo hai đường chéo của tứ giác ABCD", [
    frame(
      checkParallelogram("Tứ giác ABCD", { diagonals: "none" }),
      "Tứ giác ABCD",
    ),
    frame(
      checkParallelogram("Hai đường chéo cắt nhau tại O"),
      "Vẽ hai đường chéo AC và BD, chúng cắt nhau tại O",
    ),
    frame(
      {
        ...checkParallelogram("Đo OA và OC"),
        ticks: [
          {
            segs: [
              ["A", "O"],
              ["O", "C"],
            ],
            count: 1,
            tone: "blue",
          },
        ],
      },
      "Đo OA và OC: cùng 4 cm",
    ),
    frame(
      checkParallelogram("Đo OB và OD", { diagonals: "mid" }),
      "Đo OB và OD: cùng 3 cm",
    ),
    frame(
      checkParallelogram("O là trung điểm của AC và BD", {
        diagonals: "mid",
        fill: true,
      }),
      "O là trung điểm của cả hai đường chéo: ABCD là hình bình hành",
    ),
  ]),
  "kiem-thang-can-cac-buoc": steps("Đo hai góc kề đáy của hình thang ABCD", [
    frame(
      checkTrapezoid("Hình thang ABCD"),
      "Hình thang ABCD có hai đáy AB và DC",
    ),
    frame(
      checkTrapezoid("Hai đáy song song", { bases: true }),
      "Hai đáy AB và DC song song",
    ),
    frame(
      checkTrapezoid("Hai góc kề đáy DC", {
        bases: true,
        angles: { D: "65°", C: "65°" },
      }),
      "Đo góc D và góc C: cùng 65°",
    ),
    frame(
      checkTrapezoid("Hai góc kề đáy bằng nhau", {
        bases: true,
        angles: { D: "65°", C: "65°" },
        fill: true,
      }),
      "Hai góc kề đáy bằng nhau: ABCD là hình thang cân",
    ),
  ]),
  "kiem-hinh-quy-tac": gallery(
    "Hai đường chéo cắt nhau ở giữa là hình bình hành, hai góc kề đáy bằng nhau là hình thang cân",
    [
      {
        figure: diagonalParallelogram(
          "Hình bình hành có hai đường chéo cắt nhau tại trung điểm",
          {
            first: 4,
            second: 3,
            between: 50,
            fill: true,
            diagonals: "mid",
            ...THUMB,
          },
        ),
        caption: "Hai đường chéo cắt nhau tại trung điểm: hình bình hành",
      },
      {
        figure: isoTrapezoid("Hình thang cân có hai góc kề đáy bằng nhau", {
          angle: 65,
          fill: true,
          bases: true,
          angles: { D: "65°", C: "65°" },
          ...THUMB,
        }),
        caption: "Hai góc kề một đáy bằng nhau: hình thang cân",
      },
    ],
    2,
  ),
  "do-kiem-binh-hanh": {
    kind: "probe",
    figure: {
      ...checkParallelogram("Tứ giác ABCD có hai đường chéo cắt nhau tại O"),
      h: 200 + MEASURE_ROOM,
      segs: [
        { a: "A", b: "C", tone: "mute", dash: true },
        { a: "B", b: "D", tone: "mute", dash: true },
      ],
    },
    // Each half measures its length on a line under the figure, away from
    // the sides: one column for each diagonal.
    parts: (
      [
        ["A", "O", "4 cm", 84, 0],
        ["O", "C", "4 cm", 84, 1],
        ["B", "O", "3 cm", 216, 0],
        ["O", "D", "3 cm", 216, 1],
      ] as const
    ).map(([a, b, measure, x, row]) => ({
      kind: "seg" as const,
      a,
      b,
      text: `${a}${b} = ${measure}`,
      label: `Đoạn ${a}${b}`,
      tone: "amber" as const,
      textAt: [x, measureY(row)] as const,
    })),
    verb: "đo",
    done: "O là trung điểm của cả hai đường chéo, nên ABCD là hình bình hành.",
  },

  // 18. Ghép hình thang cân
  "ghep-thang-can-cac-buoc": steps(
    "Ghép ba hình tam giác đều thành hình thang cân",
    [
      frame(
        triangleStrip("Một hình tam giác đều", { count: 1 }),
        "Một hình tam giác đều",
      ),
      frame(
        triangleStrip("Hai hình tam giác đều", { count: 2 }),
        "Thêm một hình tam giác đều, đặt ngược chiều",
      ),
      frame(
        triangleStrip("Ba hình tam giác đều ghép thành hình thang cân", {
          count: 3,
          finished: true,
        }),
        "Thêm hình thứ ba: ghép thành hình thang cân",
      ),
    ],
  ),
  "ghep-quy-tac": figure(twoHalves()),
  "ghep-tam-giac-cung-lam": { kind: "pieces", which: "strip", goal: 3 },
  "ghep-hai-thang-can-cung-lam": {
    kind: "pieces",
    which: "halves",
    goal: 2,
  },
  "ghep-thang-can-5": figure(
    labelSide(
      triangleStrip("Ba hình tam giác đều ghép thành hình thang cân", {
        count: 3,
        finished: true,
      }),
      "B0",
      "B1",
      "5 cm",
    ),
  ),
  "hex-ten": figure(
    hexagonDiagonals(
      "Hình lục giác đều ABCDEF chia thành sáu hình tam giác đều có chung đỉnh O",
      undefined,
      { nameO: true },
    ),
  ),
};
