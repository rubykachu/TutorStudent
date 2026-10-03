import {
  gallery,
  small,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  QUAD_NAME,
  type QuadKind,
  quad,
  rightTrapezoid,
  turned,
} from "@/visuals/shared/quadrilaterals/figures";
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
  // A shape that is none of the two.
  "th-thang-vuong": small(
    rightTrapezoid("Hình thang có một cạnh bên thẳng đứng", THUMB),
  ),
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
