import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import {
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  roomyBoard,
  steps,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  finished,
  stage,
  trimTop,
} from "@/visuals/shared/quadrilaterals/drawing-frames";
import {
  FIGURE_411,
  figure413,
  labelSide,
  quad,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of the book-practice section: the figures of exercises 4.8 and 4.15
// as the book prints them, the drawing boards of exercises 4.10, 4.11 and 4.14
// and their lead-ins, and the solutions.

const letters = ["a", "b", "c", "d"] as const;

// Rows of the board (centimetres) cut off the top of a frame of a rectangle
// drawn 5 cm high: the board has room for 7 cm.
const ROWS_CUT_AT_5_CM = 2;

// Height of the drawing of figure 4.13 (see `figures.ts`); the lines of
// measures under it start below.
const FIGURE_413_HEIGHT = 230;

// The four figures of 4.11 side by side, with the letters the book
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

// The figure without the names of its corners: two small figures side by
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
  // Figure 4.13 is for measuring: the child taps the sides and reads what each
  // measures on two lines under the drawing.
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
  // The two shapes with the mark each is known for: the hint of 4.8.
  "so-sanh-hai-hinh": gallery(
    "Hình chữ nhật và hình thoi đặt cạnh nhau, mỗi hình với dấu riêng của nó",
    [
      {
        figure: quad("chu-nhat", {
          label: "Hình chữ nhật",
          fill: true,
          ...THUMB,
          rights: true,
        }),
        caption: "Hình chữ nhật",
      },
      {
        figure: quad("thoi", {
          label: "Hình thoi",
          fill: true,
          ...THUMB,
          sides: "all",
        }),
        caption: "Hình thoi",
      },
    ],
    2,
  ),

  // The figure of the rules the section repeats
  "ve-hai-hinh": gallery(
    "Hình chữ nhật và hình thoi vẽ xong",
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
    ],
    2,
  ),

  // Boards of the exercises and their lead-ins
  "ve-chu-nhat-defg": roomyBoard("rectangle", DEFG),
  "ve-chu-nhat-xyzt": roomyBoard("rectangle", ["X", "Y", "Z", "T"]),
  "ve-thoi-xyzt": roomyBoard("rhombus", ["X", "Y", "Z", "T"]),
  // Solutions, run with the numbers of each exercise
  "sbt-4-8-giai": fourFigures(
    "Hình 4.11b là hình chữ nhật, hình 4.11d là hình thoi",
    FIGURE_411,
    { 1: "teal", 3: "pink" },
    {
      0: "a) hình khác",
      1: "b) hình chữ nhật",
      2: "c) hình khác",
      3: "d) hình thoi",
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
        "Lấy EF = DG = 5 cm trên hai đường vuông góc, cùng một phía",
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
    ].map(({ figure: shown, caption }) =>
      frame(trimTop(shown, ROWS_CUT_AT_5_CM), caption),
    ),
  ),
  "sbt-4-11-giai": drawingSteps(
    "Các bước vẽ hình thoi MNPQ có cạnh MN = 4 cm",
    [
      frame(stage("rhombus", MNPQ, { len: 4 }), "Vẽ MN = 4 cm"),
      frame(
        stage("rhombus", MNPQ, { len: 4, angle: 60 }),
        "Chọn một góc, ví dụ 60°, kẻ đường MQ tạo với MN góc đó",
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
        "Đặt kim ở Q rồi ở N, vẽ hai cung gặp nhau tại P",
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
        "Đặt kim ở Q rồi ở N, vẽ hai cung gặp nhau tại P",
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
};
