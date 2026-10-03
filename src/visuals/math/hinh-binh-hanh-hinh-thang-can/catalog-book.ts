import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import {
  board,
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  steps,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  finished,
  stage,
} from "@/visuals/shared/quadrilaterals/drawing-frames";
import {
  FIGURE_412,
  figure414,
  figure415,
  hexagonDiagonals,
  trayFigure,
  triangleStrip,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of the book-practice section: the figures of exercises 4.9, 4.14
// to 4.16 as the book prints them, the drawing boards of exercises 4.12 and
// 4.13 and their lead-ins, the piece boards of 4.18 and 4.19, and the
// solutions.

const letters = ["a", "b", "c", "d"] as const;

// Height of the drawing of figure 4.14 (see `figures.ts`); the lines of
// measures under it start below.
const FIGURE_414_HEIGHT = 230;

// The four figures of 4.12 side by side, with the letters the book
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
const EFHK = ["E", "F", "H", "K"] as const;

// Figure 4.14 with the rectangle ABCD wider than the book's, so that each
// half of a diagonal has a stretch outside ABCD to tap. B, C, D, A still lie
// on the four sides of EFPQ.
function wide414(base: FigureSpec): FigureSpec {
  const e: Pt = [28, 122];
  const f: Pt = [160, 40];
  const p: Pt = [292, 122];
  const q: Pt = [160, 204];
  const o: Pt = [160, 122];
  // B and C stand on EF and FP at x = 88 and 232; A and D mirror them below.
  const slope = (f[1] - e[1]) / (f[0] - e[0]);
  const top = e[1] + slope * (88 - e[0]);
  const bottom = 2 * o[1] - top;
  return {
    ...base,
    pts: {
      A: [88, bottom],
      B: [88, top],
      C: [232, top],
      D: [232, bottom],
      E: e,
      F: f,
      P: p,
      Q: q,
      O: o,
    },
  };
}

// The figure without the names of its corners: a small figure beside others
// has no room for writing of a readable size.
const unnamed = (fig: FigureSpec): FigureSpec => ({ ...fig, names: [] });

// The frames of a drawing, from the first side to the finished figure.
const drawingSteps = (
  label: string,
  frames: readonly { figure: FigureSpec; caption: string }[],
) => steps(label, frames);

export const BOOK_SPECS: Record<string, VisualSpec> = {
  // The figures of the book
  "sbt-hinh-4-12": fourFigures("Hình 4.12: bốn hình a, b, c, d", FIGURE_412),
  "sbt-hinh-4-14": {
    kind: "probe",
    figure: {
      ...wide414(
        figure414("Hình 4.14: hình chữ nhật ABCD và tứ giác EFPQ", {
          measure: true,
        }),
      ),
      h: FIGURE_414_HEIGHT + MEASURE_ROOM,
    },
    parts: [
      // The half-diagonals are tapped on the part of each diagonal outside
      // ABCD, where there is room for the "?"; their measures are written on
      // two lines under the figure.
      ...(
        [
          ["E", "O", "5 cm", 84, 0, 0.23],
          ["O", "P", "5 cm", 84, 1, 0.77],
          ["F", "O", "2 cm", 236, 0, 0.27],
          ["O", "Q", "2 cm", 236, 1, 0.73],
        ] as const
      ).map(([a, b, measure, x, row, at]) => ({
        kind: "seg" as const,
        a,
        b,
        text: `${a}${b} = ${measure}`,
        label: `Đoạn ${a}${b}`,
        tone: "amber" as const,
        at,
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
  "sbt-hinh-4-15": {
    kind: "probe",
    figure: figure415("Hình 4.15: các điểm A, B, C, D, E và O"),
    // The seven segments the exercise compares and the two angles of the
    // trapezoid BEDC at the ends of BE. The "?" of the segments next to a
    // measured angle stands off the middle, so no two "?" touch.
    parts: [
      ...(
        [
          ["O", "A"],
          ["A", "B"],
          ["B", "C", 0.7],
          ["C", "O"],
          ["C", "D"],
          ["D", "E", 0.3],
          ["E", "O", 0.65],
        ] as const
      ).map(([a, b, at]) => ({
        kind: "seg" as const,
        a,
        b,
        text: "3 cm",
        label: `Đoạn ${a}${b}`,
        tone: "blue" as const,
        ...(at === undefined ? {} : { at }),
      })),
      {
        kind: "angle" as const,
        at: "B",
        a: "E",
        b: "C",
        text: "60°",
        label: "Góc B",
        tone: "violet" as const,
        textDistance: 52,
      },
      {
        kind: "angle" as const,
        at: "E",
        a: "B",
        b: "D",
        text: "60°",
        label: "Góc E",
        tone: "violet" as const,
        textDistance: 52,
      },
    ],
    verb: "đo",
    done: "Các đoạn OA, AB, BC, CO, CD, DE, EO đều dài 3 cm, và góc B, góc E đều bằng 60°.",
  },
  // The hexagon of the lead-in to 4.17, with the names U to Z.
  "hex-uvwxyz": figure(
    hexagonDiagonals(
      "Hình lục giác đều UVWXYZ chia thành sáu hình tam giác đều có chung đỉnh O",
      undefined,
      { nameO: true, names: ["U", "V", "W", "X", "Y", "Z"] },
    ),
  ),
  "sbt-hinh-4-16": figure(trayFigure("Hình 4.16: mặt khay hình lục giác", 8)),
  // The figure of the rules the section repeats
  "ve-binh-hanh-xong": gallery(
    "Hình bình hành vẽ xong",
    [
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
    1,
  ),

  // Boards of the exercises and their lead-ins
  "ve-binh-hanh-efhk": board("parallelogram", EFHK),
  "ve-binh-hanh-xyzt": board("parallelogram", ["X", "Y", "Z", "T"]),
  "ve-bh-cheo-xyzt": board("parallelogram-diagonal", ["X", "Y", "Z", "T"]),
  "ghep-ba-tam-giac": { kind: "pieces", which: "strip" },
  "ghep-khay": { kind: "pieces", which: "tray" },
  // Solutions, run with the numbers of each exercise
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
  "sbt-4-16-giai": figure(
    wide414(
      figure414(
        "Hai đường chéo của EFPQ cắt nhau tại trung điểm của mỗi đường, ABCD có bốn góc vuông",
        { solution: true },
      ),
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
