import {
  equalTicks,
  figure,
  formulaCaption,
  gallery,
  steps,
  walkFrames,
} from "./builders";
import { quadrilateral, shape, units } from "./figures";
import type { WalkSpec } from "./models";
import type { VisualSpec } from "./spec";

// Pictures of the sections on the perimeter: the walk once round a garden,
// the rule examples, the walks of the lesson screens and the figures of the
// exercises.

const GALLERY_THUMB = { w: 150, h: 112, margin: 26 } as const;

function walkOf(
  label: string,
  corners: ReturnType<typeof units.rect>,
  sides: readonly number[],
  unit: string,
  closing: string,
): WalkSpec {
  return { figure: shape({ label, corners }), sides, unit, closing };
}

const GARDEN = walkOf(
  "Mảnh vườn hình chữ nhật dài 8 m, rộng 5 m",
  units.rect(8, 5),
  [8, 5, 8, 5],
  "m",
  "Đi hết một vòng: 8 + 5 + 8 + 5 = 26 m.",
);
const SQUARE_GARDEN = walkOf(
  "Mảnh vườn hình vuông có cạnh 6 m",
  units.rect(6, 6),
  [6, 6, 6, 6],
  "m",
  "Đi hết một vòng: 6 + 6 + 6 + 6 = 24 m.",
);
const YARD = walkOf(
  "Sân hình chữ nhật dài 7 m, rộng 4 m",
  units.rect(7, 4),
  [7, 4, 7, 4],
  "m",
  "Đi hết một vòng: 7 + 4 + 7 + 4 = 22 m.",
);

const WALK_TRAPEZOID: VisualSpec = {
  kind: "walk",
  ...walkOf(
    "Mảnh đất hình thang cân có hai đáy 5 m và 9 m, hai cạnh bên 3 m",
    units.trapezoid(9, 5, Math.sqrt(5)),
    [3, 5, 3, 9],
    "m",
    "Chu vi mảnh đất: 3 + 5 + 3 + 9 = 20 m.",
  ),
};
const WALK_RHOMBUS: VisualSpec = {
  kind: "walk",
  ...walkOf(
    "Hình thoi có bốn cạnh dài 5 cm",
    units.rhombus(8, 6),
    [5, 5, 5, 5],
    "cm",
    "Chu vi hình thoi: 4 · 5 = 20 cm.",
  ),
};
const WALK_PARALLELOGRAM: VisualSpec = {
  kind: "walk",
  ...walkOf(
    "Hình bình hành có hai cạnh kề nhau dài 6 cm và 4 cm",
    units.parallelogram(6, Math.sqrt(12), 2),
    [6, 4, 6, 4],
    "cm",
    "Chu vi hình bình hành: 6 + 4 + 6 + 4 = 20 cm, tức 2 · (6 + 4).",
  ),
};

// The sides a, b of the rule examples, in the colour of the perimeter.
const rectSides = [
  { i: 0, text: "a", tone: "blue" as const },
  { i: 1, text: "b", tone: "blue" as const },
  { i: 2, text: "a", tone: "blue" as const },
  { i: 3, text: "b", tone: "blue" as const },
];
const parallelogramSides = [
  { i: 0, text: "a", tone: "blue" as const },
  { i: 1, text: "b", tone: "blue" as const },
  { i: 2, text: "a", tone: "blue" as const },
  { i: 3, text: "b", tone: "blue" as const },
];

const QUAD_3456 = quadrilateral(3, 4, 5, 6, 90);

export const CHU_VI_SPECS: Record<string, VisualSpec> = {
  // Section 1: perimeter is the walk once round.
  "vuon-di-vong": steps("Đi một vòng quanh mảnh vườn", [
    ...walkFrames(GARDEN, [
      "Bạn bắt đầu đi từ một đỉnh của vườn.",
      "Đi hết một cạnh dài: 8 m.",
      "Đi hết một cạnh ngắn: 5 m.",
      "Đi hết cạnh dài còn lại: 8 m.",
      "Đi hết cạnh ngắn còn lại: 5 m. Cả vòng: 8 + 5 + 8 + 5 = 26 m.",
    ]),
  ]),
  "chu-vi-quy-tac": figure(
    shape({
      label: "Hình có bốn cạnh dài 3 cm, 4 cm, 5 cm và 6 cm",
      corners: QUAD_3456,
      h: 240,
      reserve: 30,
      sides: [
        { i: 0, text: "3 cm", tone: "blue" },
        { i: 1, text: "4 cm", tone: "blue" },
        { i: 2, text: "5 cm", tone: "blue" },
        { i: 3, text: "6 cm", tone: "blue" },
      ],
      extra: () => ({
        texts: [
          { x: 160, y: 222, text: "3 + 4 + 5 + 6 = 18 cm", tone: "blue" },
        ],
      }),
    }),
  ),
  "walk-thang-can": WALK_TRAPEZOID,
  // Section 2: four equal sides.
  "vuong-di-vong": steps("Đi một vòng quanh mảnh vườn hình vuông", [
    ...walkFrames(SQUARE_GARDEN, [
      "Bạn bắt đầu đi từ một đỉnh của vườn.",
      "Đi hết một cạnh: 6 m.",
      "Đi hết cạnh thứ hai: 6 m. Cạnh này cũng dài 6 m.",
      "Đi hết cạnh thứ ba: cũng 6 m.",
      "Đi hết cạnh thứ tư. Cả vòng: 6 + 6 + 6 + 6 = 4 · 6 = 24 m.",
    ]),
  ]),
  "c4a-quy-tac": gallery(
    "Hình vuông và hình thoi, mỗi hình có bốn cạnh bằng nhau và dài a",
    [
      {
        caption: formulaCaption("Hình vuông", "C = 4 · a"),
        figure: shape({
          label: "Hình vuông có cạnh a",
          corners: units.rect(1, 1),
          ...GALLERY_THUMB,
          sides: [{ i: 0, text: "a", tone: "blue" }],
          extra: () => equalTicks(4),
        }),
      },
      {
        caption: formulaCaption("Hình thoi", "C = 4 · a"),
        figure: shape({
          label: "Hình thoi có cạnh a",
          corners: units.rhombus(8, 6),
          ...GALLERY_THUMB,
          sides: [{ i: 0, text: "a", tone: "blue" }],
          extra: () => equalTicks(4),
        }),
      },
    ],
    2,
  ),
  "walk-thoi": WALK_RHOMBUS,
  // Section 3: two pairs of equal sides.
  "chu-nhat-di-vong": steps("Đi một vòng quanh sân hình chữ nhật", [
    ...walkFrames(YARD, [
      "Bạn bắt đầu đi từ một đỉnh của sân.",
      "Đi hết một cạnh dài: 7 m.",
      "Đi hết một cạnh ngắn: 4 m.",
      "Đi hết cạnh dài còn lại: 7 m.",
      "Đi hết cạnh ngắn còn lại: 4 m. Cả vòng: 7 + 4 + 7 + 4 = 22 m.",
      "Hai lần (7 + 4): 2 · (7 + 4) = 22 m.",
    ]),
  ]),
  "c2ab-quy-tac": gallery(
    "Hình chữ nhật và hình bình hành, mỗi hình có hai cạnh kề nhau dài a và b",
    [
      {
        caption: formulaCaption("Hình chữ nhật", "C = 2 · (a + b)"),
        figure: shape({
          label: "Hình chữ nhật có hai cạnh kề nhau a và b",
          corners: units.rect(5, 3),
          ...GALLERY_THUMB,
          sides: rectSides,
        }),
      },
      {
        caption: formulaCaption("Hình bình hành", "C = 2 · (a + b)"),
        figure: shape({
          label: "Hình bình hành có hai cạnh kề nhau a và b",
          corners: units.parallelogram(5, 3, 2),
          ...GALLERY_THUMB,
          sides: parallelogramSides,
        }),
      },
    ],
    2,
  ),
  "walk-binh-hanh": WALK_PARALLELOGRAM,
  // Figures of the exercises.
  "f-tu-giac-5-7-6-9": figure(
    shape({
      label: "Mảnh vườn hình tứ giác có bốn cạnh 5 m, 7 m, 6 m và 9 m",
      corners: quadrilateral(5, 7, 6, 9, 75),
      sides: [
        { i: 0, text: "5 m" },
        { i: 1, text: "7 m" },
        { i: 2, text: "6 m" },
        { i: 3, text: "9 m" },
      ],
    }),
  ),
  "f-thang-can-4-10-5": figure(
    shape({
      label: "Mảnh đất hình thang cân có hai đáy 4 m và 10 m, mỗi cạnh bên 5 m",
      corners: units.trapezoid(10, 4, 4),
      sides: [
        { i: 0, text: "5 m" },
        { i: 1, text: "4 m" },
        { i: 2, text: "5 m" },
        { i: 3, text: "10 m" },
      ],
    }),
  ),
  "f-vuong-9": figure(
    shape({
      label: "Khung ảnh hình vuông có cạnh 9 cm",
      corners: units.rect(1, 1),
      sides: [{ i: 0, text: "9 cm" }],
      extra: () => equalTicks(4),
    }),
  ),
  "f-binh-hanh-10-6": figure(
    shape({
      label: "Hình bình hành có hai cạnh kề nhau dài 10 cm và 6 cm",
      corners: units.parallelogram(10, Math.sqrt(27), 3),
      sides: [
        { i: 2, text: "10 cm" },
        { i: 1, text: "6 cm" },
      ],
    }),
  ),
  "f-chu-nhat-12-8": figure(
    shape({
      label: "Khung ảnh hình chữ nhật dài 12 cm, rộng 8 cm",
      corners: units.rect(12, 8),
      sides: [
        { i: 0, text: "12 cm" },
        { i: 3, text: "8 cm" },
      ],
    }),
  ),
};
