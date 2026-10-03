import { small, THUMB } from "./builders";
import { looseQuadrilateral, pentagonFigure } from "./figures";
import type { VisualSpec } from "./spec";

// Thumbnails of shapes that are none of the four: the wrong options of the
// exercises that ask for one of the shapes. Every lesson on the shapes lists
// them in its own catalog.
export const OTHER_SHAPE_SPECS: Record<string, VisualSpec> = {
  "th-ngu-giac": small(pentagonFigure("Hình có năm cạnh", THUMB)),
  "th-tu-giac-lech": small(
    looseQuadrilateral("Hình có bốn cạnh dài ngắn khác nhau", THUMB),
  ),
};
