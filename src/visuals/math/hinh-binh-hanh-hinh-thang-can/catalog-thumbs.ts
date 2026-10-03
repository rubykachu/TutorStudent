import {
  gallery,
  small,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  polygonFigure,
  QUAD_NAME,
  type QuadKind,
  quad,
  turned,
} from "@/visuals/shared/quadrilaterals/figures";
import { OTHER_SHAPE_SPECS } from "@/visuals/shared/quadrilaterals/other-shapes";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Thumbnails shared by the exercises that offer shapes as options, and the
// picture of the two shapes with their names.

const KINDS: readonly QuadKind[] = ["binh-hanh", "thang-can"];

export const THUMB_SPECS: Record<string, VisualSpec> = {
  sticker: { kind: "sticker" },
  // The two shapes alone, no marks: "th-binh-hanh", "th-thang-can".
  ...Object.fromEntries(
    KINDS.map((kind) => [
      `th-${kind}`,
      small(quad(kind, { label: QUAD_NAME[kind], ...THUMB })),
    ]),
  ),
  // Shapes that are none of the two. The trapezoid has its long base on top
  // and its right leg straight; the loose quadrilateral has two sides that
  // visibly lean towards each other and four sides of four lengths.
  "th-thang-vuong": small(
    polygonFigure("Hình thang có một cạnh bên thẳng đứng", {
      ...THUMB,
      points: { A: [60, 50], B: [250, 50], C: [250, 160], D: [150, 160] },
    }),
  ),
  "th-tu-giac-lech": small(
    polygonFigure("Hình có bốn cạnh, hai cạnh đối nghiêng về nhau", {
      ...THUMB,
      points: { A: [80, 40], B: [230, 70], C: [250, 140], D: [50, 170] },
    }),
  ),
  "th-tam-giac": small(
    polygonFigure("Hình có ba cạnh", {
      ...THUMB,
      points: { A: [150, 30], B: [250, 170], C: [50, 170] },
    }),
  ),
  // The five-sided shape the matching exercise offers.
  "th-ngu-giac": OTHER_SHAPE_SPECS["th-ngu-giac"] as VisualSpec,
  // The same shapes turned another way, for the exercises that name a shape
  // whatever way it lies.
  "th-thang-can-nguoc": small(
    turned(quad("thang-can", { label: "Hình thang cân lộn ngược", ...THUMB }), {
      flip: "y",
    }),
  ),
  "th-binh-hanh-trai": small(
    turned(
      quad("binh-hanh", {
        label: "Hình bình hành nghiêng sang trái",
        ...THUMB,
      }),
      { flip: "x" },
    ),
  ),
  // The two shapes side by side, filled in their concept colour, each with
  // its name.
  "binh-hanh-thang-can-ten": gallery(
    "Hình bình hành và hình thang cân",
    KINDS.map((kind) => ({
      figure: quad(kind, {
        label: QUAD_NAME[kind],
        fill: true,
        ...THUMB,
      }),
      caption: QUAD_NAME[kind],
    })),
    2,
  ),
};
