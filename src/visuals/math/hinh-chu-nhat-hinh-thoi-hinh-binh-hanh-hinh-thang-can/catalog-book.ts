import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { board, figure, frame, gallery, steps } from "./builders";
import { finished, stage } from "./catalog-drawing";
import {
  FIGURE_411,
  FIGURE_412,
  figure413,
  figure414,
  figure415,
  labelSide,
  trayFigure,
  triangleStrip,
} from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of the book-practice section: the figures of exercises 4.8 to 4.19
// as the book prints them, the drawing boards of the exercises and their
// lead-ins, and the solutions.

const letters = ["a", "b", "c", "d"] as const;

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
  "sbt-hinh-4-13": figure(
    figure413("Hình 4.13: hình chữ nhật ABCD và tứ giác MNPQ"),
  ),
  "sbt-hinh-4-14": figure(
    figure414("Hình 4.14: hình chữ nhật ABCD và tứ giác EFPQ"),
  ),
  "sbt-hinh-4-15": figure(figure415("Hình 4.15: hình có tâm O")),
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
          finished("rectangle", ABCD, { a: 4, b: 3 }, "Hình chữ nhật"),
        ),
        caption: "Hình chữ nhật",
      },
      {
        figure: unnamed(
          finished("rhombus", ABCD, { side: 3, angle: 75 }, "Hình thoi"),
        ),
        caption: "Hình thoi",
      },
      {
        figure: unnamed(
          finished("parallelogram", ABCD, { a: 5, b: 3 }, "Hình bình hành"),
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
        "Kẻ tia MQ, chọn góc NMQ bằng 60°",
      ),
      frame(
        stage("rhombus", MNPQ, { len: 4, angle: 60, markQ: 1 }),
        "Mở compa 4 cm, vẽ cung từ M cắt tia tại Q",
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
        "Vẽ hai cung từ Q và từ N, chúng gặp nhau tại P",
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
        "Kẻ tia EK, chọn góc FEK bằng 60°",
      ),
      frame(
        stage("parallelogram", EFHK, { len: 3, angle: 60, side: 4 }),
        "Lấy K trên tia, EK dài 4 cm (FH cũng 4 cm)",
      ),
      frame(
        stage("parallelogram", EFHK, {
          len: 3,
          angle: 60,
          side: 4,
          parF: 1,
          parK: 1,
        }),
        "Dùng êke vẽ qua F và qua K hai đường song song",
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
        "Vẽ cung từ B bán kính 5 cm và cung từ A bán kính 6 cm",
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
        "Kẻ tia MQ tạo với MN một góc 60°",
      ),
      frame(
        stage("rhombus", MNPQ, { len: 5, angle: 60, markQ: 1 }),
        "Mở compa 5 cm, vẽ cung từ M cắt tia tại Q",
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
        "Vẽ hai cung từ Q và từ N, chúng gặp nhau tại P",
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
    ...figure415("Các đoạn đã đánh dấu bằng nhau; BE và CD song song"),
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
  }),
  "sbt-4-18-giai": figure(
    triangleStrip("Ba hình tam giác đều ghép thành hình thang cân", {
      count: 3,
      finished: true,
    }),
  ),
};
