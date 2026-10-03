import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import {
  board,
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  steps,
} from "./builders";
import { finished, stage } from "./catalog-drawing";
import {
  FIGURE_411,
  FIGURE_412,
  figure413,
  figure414,
  figure415,
  hexagonDiagonals,
  labelSide,
  trayFigure,
  triangleStrip,
} from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of the book-practice section: the figures of exercises 4.8 to 4.19
// as the book prints them, the drawing boards of the exercises and their
// lead-ins, and the solutions.

const letters = ["a", "b", "c", "d"] as const;

// Heights of the drawings of figures 4.13 and 4.14 (see `figures.ts`); the
// lines of measures under them start below.
const FIGURE_413_HEIGHT = 230;
const FIGURE_414_HEIGHT = 230;

// The four figures of 4.11 or 4.12 side by side, with the letters the book
// prints; the shapes named in `fills` are painted in their colour.
function fourFigures(
  label: string,
  figures: readonly FigureSpec[],
  fills: Readonly<Record<number, "teal" | "pink" | "lime" | "sky">> = {},
  captions: Readonly<Record<number, string>> = {},
): VisualSpec {
  return gallery(
    label,
    figures.map((shape, i) => {
      const fill = fills[i];
      return {
        figure:
          fill === undefined
            ? shape
            : {
                ...shape,
                polys: (shape.polys ?? []).map((poly) => ({ ...poly, fill })),
              },
        caption: captions[i] ?? `${letters[i]})`,
      };
    }),
    2,
  );
}

const ABCD = ["A", "B", "C", "D"] as const;
const DEFG = ["D", "E", "F", "G"] as const;
const MNPQ = ["M", "N", "P", "Q"] as const;
const EFHK = ["E", "F", "H", "K"] as const;

// The figure without the names of its corners: three small figures side by
// side have no room for writing of a readable size.
const unnamed = (fig: FigureSpec): FigureSpec => ({ ...fig, names: [] });

// The frames of a drawing, from the first side to the finished figure.
const drawingSteps = (
  label: string,
  frames: readonly { figure: FigureSpec; caption: string }[],
) => steps(label, frames);

export const BOOK_SPECS: Record<string, VisualSpec> = {
  // The figures of the book
  "sbt-hinh-4-11": fourFigures("Hình 4.11: bốn hình a, b, c, d", FIGURE_411),
  "sbt-hinh-4-12": fourFigures("Hình 4.12: bốn hình a, b, c, d", FIGURE_412),
  // Figures 4.13 and 4.14 are for measuring: the child taps the sides (or
  // the halves of the diagonals) and the angles, and reads what each measures
  // on two lines under the drawing.
  "sbt-hinh-4-13": {
    kind: "probe",
    figure: {
      ...figure413("Hình 4.13: hình chữ nhật ABCD và tứ giác MNPQ"),
      h: FIGURE_413_HEIGHT + MEASURE_ROOM,
    },
    parts: (
      [
        ["M", "N", 95, 0],
        ["N", "P", 95, 1],
        ["P", "Q", 225, 0],
        ["Q", "M", 225, 1],
      ] as const
    ).map(([a, b, x, row]) => ({
      kind: "seg" as const,
      a,
      b,
      text: `${a}${b} = 5 cm`,
      label: `Cạnh ${a}${b}`,
      tone: "blue" as const,
      textAt: [x, measureY(row, FIGURE_413_HEIGHT)] as const,
    })),
    verb: "đo",
    done: "Cả bốn cạnh của MNPQ đều dài 5 cm.",
  },
  "sbt-hinh-4-14": {
    kind: "probe",
    figure: {
      ...figure414("Hình 4.14: hình chữ nhật ABCD và tứ giác EFPQ", {
        measure: true,
      }),
      h: FIGURE_414_HEIGHT + MEASURE_ROOM,
    },
    parts: [
      ...(
        [
          ["E", "O", "5 cm", 84, 0],
          ["O", "P", "5 cm", 84, 1],
          ["F", "O", "2 cm", 236, 0],
          ["O", "Q", "2 cm", 236, 1],
        ] as const
      ).map(([a, b, measure, x, row]) => ({
        kind: "seg" as const,
        a,
        b,
        text: `${a}${b} = ${measure}`,
        label: `Đoạn ${a}${b}`,
        tone: "amber" as const,
        textAt: [x, measureY(row, FIGURE_414_HEIGHT)] as const,
      })),
      ...(
        [
          ["B", "A", "C"],
          ["C", "B", "D"],
          ["D", "C", "A"],
          ["A", "D", "B"],
        ] as const
      ).map(([at, a, b]) => ({
        kind: "angle" as const,
        at,
        a,
        b,
        text: "90°",
        label: `Góc ${at}`,
        tone: "violet" as const,
        right: true,
        textDistance: 26,
      })),
    ],
    verb: "đo",
    done: "O chia mỗi đường chéo của EFPQ thành hai nửa bằng nhau, và ABCD có bốn góc 90°.",
  },
  "sbt-hinh-4-15": figure(figure415("Hình 4.15: các điểm A, B, C, D, E và O")),
  // The hexagon of the lead-in to 4.17, with the names U to Z.
  "hex-uvwxyz": figure(
    hexagonDiagonals(
      "Hình lục giác đều UVWXYZ chia thành sáu hình tam giác đều có chung đỉnh O",
      undefined,
      { nameO: true, names: ["U", "V", "W", "X", "Y", "Z"] },
    ),
  ),
  "sbt-hinh-4-16": figure(trayFigure("Hình 4.16: mặt khay hình lục giác", 8)),

  // Boards of the exercises and their lead-ins
  "ve-chu-nhat-defg": board("rectangle", DEFG),
  "ve-chu-nhat-xyzt": board("rectangle", ["X", "Y", "Z", "T"]),
  "ve-thoi-xyzt": board("rhombus", ["X", "Y", "Z", "T"]),
  "ve-binh-hanh-efhk": board("parallelogram", EFHK),
  "ve-binh-hanh-xyzt": board("parallelogram", ["X", "Y", "Z", "T"]),
  "ve-bh-cheo-xyzt": board("parallelogram-diagonal", ["X", "Y", "Z", "T"]),
  "ghep-ba-tam-giac": { kind: "pieces", which: "strip" },
  "ghep-khay": { kind: "pieces", which: "tray" },

  // The figure of the rules the section repeats
  "ve-ba-hinh": gallery(
    "Hình chữ nhật, hình thoi và hình bình hành vẽ xong",
    [
      {
        figure: unnamed(
          finished("rectangle", ABCD, { a: 4, b: 3 }, "Hình chữ nhật", true),
        ),
        caption: "Hình chữ nhật",
      },
      {
        figure: unnamed(
          finished("rhombus", ABCD, { side: 3, angle: 75 }, "Hình thoi", true),
        ),
        caption: "Hình thoi",
      },
      {
        figure: unnamed(
          finished(
            "parallelogram",
            ABCD,
            { a: 5, b: 3 },
            "Hình bình hành",
            true,
          ),
        ),
        caption: "Hình bình hành",
      },
    ],
    3,
  ),

  // Solutions, run with the numbers of each exercise
  "sbt-4-8-giai": fourFigures(
    "Hình 4.11b là hình chữ nhật, hình 4.11d là hình thoi",
    FIGURE_411,
    { 1: "teal", 3: "pink" },
    {
      0: "a) hình thang",
      1: "b) hình chữ nhật",
      2: "c) hình bình hành",
      3: "d) hình thoi",
    },
  ),
  "sbt-4-9-giai": fourFigures(
    "Hình 4.12c là hình bình hành, hình 4.12b là hình thang cân",
    FIGURE_412,
    { 2: "lime", 1: "sky" },
    {
      0: "a) hình thang",
      1: "b) hình thang cân",
      2: "c) hình bình hành",
      3: "d) hình năm cạnh",
    },
  ),
  "sbt-4-10-giai": drawingSteps(
    "Các bước vẽ hình chữ nhật DEFG có DE = 3 cm và EF = 5 cm",
    [
      frame(stage("rectangle", DEFG, { len: 3 }), "Vẽ DE = 3 cm"),
      frame(
        stage("rectangle", DEFG, { len: 3, perpD: 1, perpE: 1 }),
        "Dùng êke vẽ hai đường vuông góc ở D và ở E",
      ),
      frame(
        stage("rectangle", DEFG, { len: 3, perpD: 1, perpE: 1, h: 5 }),
        "Lấy G và F cách DE đúng 5 cm",
      ),
      frame(
        finished(
          "rectangle",
          DEFG,
          { a: 3, b: 5 },
          "Hình chữ nhật DEFG vẽ xong",
        ),
        "Nối G với F",
      ),
    ],
  ),
  "sbt-4-11-giai": drawingSteps(
    "Các bước vẽ hình thoi MNPQ có cạnh MN = 4 cm",
    [
      frame(stage("rhombus", MNPQ, { len: 4 }), "Vẽ MN = 4 cm"),
      frame(
        stage("rhombus", MNPQ, { len: 4, angle: 60 }),
        "Kẻ đường MQ tạo với MN một góc 60°",
      ),
      frame(
        stage("rhombus", MNPQ, { len: 4, angle: 60, markQ: 1 }),
        "Mở compa bằng MN = 4 cm, đặt kim ở M, vẽ cung cắt đường MQ tại Q",
      ),
      frame(
        stage("rhombus", MNPQ, {
          len: 4,
          angle: 60,
          markQ: 1,
          arcQ: 1,
          arcN: 1,
          pointP: 1,
        }),
        "Vẽ hai cung tâm Q và tâm N, chúng gặp nhau tại P",
      ),
      frame(
        finished(
          "rhombus",
          MNPQ,
          { side: 4, angle: 60 },
          "Hình thoi MNPQ vẽ xong",
        ),
        "Nối P với Q và với N",
      ),
    ],
  ),
  "sbt-4-12-giai": drawingSteps(
    "Các bước vẽ hình bình hành EFHK có EF = 3 cm và FH = 4 cm",
    [
      frame(stage("parallelogram", EFHK, { len: 3 }), "Vẽ EF = 3 cm"),
      frame(
        stage("parallelogram", EFHK, { len: 3, angle: 60 }),
        "Kẻ đường EK tạo với EF một góc 60°",
      ),
      frame(
        stage("parallelogram", EFHK, { len: 3, angle: 60, side: 4 }),
        "Lấy K trên đường EK, EK dài 4 cm (FH cũng 4 cm)",
      ),
      frame(
        stage("parallelogram", EFHK, {
          len: 3,
          angle: 60,
          side: 4,
          parF: 1,
          parK: 1,
        }),
        "Dùng êke vẽ qua F đường song song với EK, qua K đường song song với EF",
      ),
      frame(
        finished(
          "parallelogram",
          EFHK,
          { a: 3, b: 4 },
          "Hình bình hành EFHK vẽ xong",
        ),
        "Hai đường gặp nhau tại H. Nối K với H và F với H",
      ),
    ],
  ),
  "sbt-4-13-giai": drawingSteps(
    "Các bước vẽ hình bình hành ABCD có AB = 3 cm, BC = 5 cm và AC = 6 cm",
    [
      frame(stage("parallelogram-diagonal", ABCD, { len: 3 }), "Vẽ AB = 3 cm"),
      frame(
        stage("parallelogram-diagonal", ABCD, {
          len: 3,
          rBC: 5,
          arcB: 1,
          rAC: 6,
          arcA: 1,
        }),
        "Vẽ cung tâm B bán kính 5 cm và cung tâm A bán kính 6 cm",
      ),
      frame(
        stage("parallelogram-diagonal", ABCD, {
          len: 3,
          rBC: 5,
          arcB: 1,
          rAC: 6,
          arcA: 1,
          pointC: 1,
          parC: 1,
          parA: 1,
        }),
        "Hai cung gặp nhau tại C. Dùng êke vẽ hai đường song song",
      ),
      frame(
        finished(
          "parallelogram-diagonal",
          ABCD,
          { ab: 3, bc: 5, ac: 6 },
          "Hình bình hành ABCD vẽ xong",
        ),
        "Hai đường gặp nhau tại D. Nối D với C và với A",
      ),
    ],
  ),
  "sbt-4-14-giai": drawingSteps(
    "Các bước vẽ hình thoi MNPQ có cạnh 5 cm và góc 60°",
    [
      frame(stage("rhombus", MNPQ, { len: 5 }), "Vẽ MN = 5 cm"),
      frame(
        stage("rhombus", MNPQ, { len: 5, angle: 60 }),
        "Kẻ đường MQ tạo với MN một góc 60°",
      ),
      frame(
        stage("rhombus", MNPQ, { len: 5, angle: 60, markQ: 1 }),
        "Mở compa bằng MN = 5 cm, đặt kim ở M, vẽ cung cắt đường MQ tại Q",
      ),
      frame(
        stage("rhombus", MNPQ, {
          len: 5,
          angle: 60,
          markQ: 1,
          arcQ: 1,
          arcN: 1,
          pointP: 1,
        }),
        "Vẽ hai cung tâm Q và tâm N, chúng gặp nhau tại P",
      ),
      frame(
        finished(
          "rhombus",
          MNPQ,
          { side: 5, angle: 60 },
          "Hình thoi MNPQ vẽ xong",
        ),
        "Nối P với Q và với N",
      ),
    ],
  ),
  "sbt-4-15-giai": figure(
    (
      [
        ["M", "N"],
        ["N", "P"],
        ["P", "Q"],
        ["Q", "M"],
      ] as const
    ).reduce<FigureSpec>((fig, [a, b]) => labelSide(fig, a, b, "5 cm"), {
      ...figure413("Bốn cạnh của tứ giác MNPQ đều dài 5 cm"),
      ticks: [
        {
          segs: [
            ["M", "N"],
            ["N", "P"],
            ["P", "Q"],
            ["Q", "M"],
          ],
          count: 1,
          tone: "blue",
        },
      ],
    }),
  ),
  "sbt-4-16-giai": figure(
    figure414(
      "Hai đường chéo của EFPQ cắt nhau ở giữa, ABCD có bốn góc vuông",
      {
        solution: true,
      },
    ),
  ),
  "sbt-4-17-giai": figure({
    ...figure415(
      "Các đoạn đã đánh dấu bằng nhau; BE và CD song song; góc B và góc E đều bằng 60°",
    ),
    ticks: [
      {
        segs: [
          ["O", "A"],
          ["A", "B"],
          ["B", "C"],
          ["C", "O"],
          ["C", "D"],
          ["D", "E"],
          ["E", "O"],
        ],
        count: 1,
        tone: "blue",
      },
    ],
    // BE and CD are parallel: one chevron on each, BE's off the centre O.
    arrows: [
      { segs: [["B", "E"]], count: 1, tone: "slate", at: 0.25 },
      { segs: [["C", "D"]], count: 1, tone: "slate" },
    ],
    // The two angles of the trapezoid at the ends of its long base: each is
    // the angle of an equilateral triangle, 60°.
    angles: [
      {
        at: "B",
        a: "E",
        b: "C",
        text: "60°",
        tone: "violet",
        radius: 22,
        textDistance: 52,
      },
      {
        at: "E",
        a: "B",
        b: "D",
        text: "60°",
        tone: "violet",
        radius: 22,
        textDistance: 52,
      },
    ],
  }),
  "sbt-4-18-giai": figure(
    triangleStrip("Ba hình tam giác đều ghép thành hình thang cân", {
      count: 3,
      finished: true,
    }),
  ),
};
