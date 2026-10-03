import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { regularPoints } from "@/visuals/shared/plane/geometry";
import {
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  steps,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  diagonalParallelogram,
  hexagonDiagonals,
  isoTrapezoid,
  labelSide,
  triangleStrip,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of checking a parallelogram and an isosceles trapezoid by
// measuring, and of putting pieces together into a trapezoid.

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
  // Kiểm tra hình bình hành và hình thang cân
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
  // Ghép hình thang cân
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
