import {
  gallery,
  small,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  looseQuadrilateral,
  QUAD_NAME,
  type QuadKind,
  quad,
  turned,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Thumbnails shared by the exercises that offer shapes as options, and the
// picture of the two shapes with their names.

const KINDS: readonly QuadKind[] = ["chu-nhat", "thoi"];

export const THUMB_SPECS: Record<string, VisualSpec> = {
  sticker: { kind: "sticker" },
  // The two shapes alone, no marks: "th-chu-nhat", "th-thoi".
  ...Object.fromEntries(
    KINDS.map((kind) => [
      `th-${kind}`,
      small(quad(kind, { label: QUAD_NAME[kind], ...THUMB })),
    ]),
  ),
  // The two shapes with their diagonals drawn, no other marks.
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
  // A shape that is none of the two, with its diagonals.
  "th-tu-giac-lech-cheo": small(
    looseQuadrilateral(
      "Hình có bốn cạnh dài ngắn khác nhau, với hai đường chéo",
      {
        ...THUMB,
        diagonals: true,
      },
    ),
  ),
  // The rectangle turned another way, for the exercises that name a shape
  // whatever way it lies.
  "th-chu-nhat-xoay": small(
    turned(quad("chu-nhat", { label: "Hình chữ nhật nằm nghiêng", ...THUMB }), {
      degrees: 20,
    }),
  ),
  // The two shapes side by side, filled in their concept colour, each with
  // its name.
  "hai-hinh-ten": gallery(
    "Hình chữ nhật và hình thoi",
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
