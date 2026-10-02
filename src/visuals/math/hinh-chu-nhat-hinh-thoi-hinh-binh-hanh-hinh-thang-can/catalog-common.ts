import { gallery, small, THUMB } from "./builders";
import {
  looseQuadrilateral,
  pentagonFigure,
  QUAD_NAME,
  type QuadKind,
  quad,
  rightTrapezoid,
} from "./figures";
import type { VisualSpec } from "./spec";

// Thumbnails shared by the exercises that offer shapes as options, and the
// picture of the four shapes with their names.

const KINDS: readonly QuadKind[] = [
  "chu-nhat",
  "thoi",
  "binh-hanh",
  "thang-can",
];

export const COMMON_SPECS: Record<string, VisualSpec> = {
  sticker: { kind: "sticker" },
  // The four shapes alone, no marks: "th-chu-nhat", "th-thoi",
  // "th-binh-hanh", "th-thang-can".
  ...Object.fromEntries(
    KINDS.map((kind) => [
      `th-${kind}`,
      small(quad(kind, { label: QUAD_NAME[kind], ...THUMB })),
    ]),
  ),
  // The four shapes with their two diagonals drawn, no other marks.
  ...Object.fromEntries(
    KINDS.map((kind) => [
      `th-${kind}-cheo`,
      small(
        quad(kind, {
          label: `${QUAD_NAME[kind]} với hai đường chéo`,
          diagonals: "plain",
          ...THUMB,
        }),
      ),
    ]),
  ),
  // Shapes that are none of the four.
  "th-thang-vuong": small(
    rightTrapezoid("Hình thang có một cạnh bên thẳng đứng", THUMB),
  ),
  "th-ngu-giac": small(pentagonFigure("Hình có năm cạnh", THUMB)),
  "th-tu-giac-lech": small(
    looseQuadrilateral("Hình có bốn cạnh dài ngắn khác nhau", THUMB),
  ),
  "th-tu-giac-lech-cheo": small(
    looseQuadrilateral(
      "Hình có bốn cạnh dài ngắn khác nhau, với hai đường chéo",
      {
        ...THUMB,
        diagonals: true,
      },
    ),
  ),
  // The four shapes side by side, filled in their concept colour, each with
  // its name.
  "bon-hinh-ten": gallery(
    "Hình chữ nhật, hình thoi, hình bình hành và hình thang cân",
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
