import type { VisualState } from "@/visuals/registry";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { type BoardShape, boardFigure, solvedState } from "./construction";

// Frames of a drawing made with ruler, set square and compass, for the
// pictures that show the steps and the finished drawing of each shape.

// The drawing board in a state: ruler, guide lines and compass arcs included.
export const stage = (
  shape: BoardShape,
  names: readonly string[],
  state: VisualState,
) => boardFigure(shape, names, state);

// Longest side of a cropped finished drawing, and the room round it for the
// names, strokes and chevrons (drawing units).
const CROP_CONTENT = 150;
const CROP_MARGIN = 34;

// A finished drawing without the tools: only its sides (and the right-angle
// squares, strokes and chevrons that mark them), as the picture of the rule.
// `crop` cuts the frame to the drawing and scales it up, for a rule picture
// shown alone or beside others (a step frame keeps the frame of the board, so
// that the frames of a drawing do not change size).
export function finished(
  shape: BoardShape,
  names: readonly string[],
  params: Readonly<Record<string, number>>,
  label: string,
  crop = false,
): FigureSpec {
  const board = boardFigure(shape, names, solvedState(shape, params));
  const segs = (board.segs ?? []).filter((seg) => !seg.dash);
  const {
    ruler: _ruler,
    dots: _dots,
    texts: _texts,
    arcs: _arcs,
    angles: _angles,
    ...rest
  } = board;
  const used = new Set<string>([
    ...names,
    ...segs.flatMap((seg) => [seg.a, seg.b]),
    ...(rest.rights ?? []).flatMap((mark) => [mark.at, mark.a, mark.b]),
    ...(rest.ticks ?? []).flatMap((tick) => tick.segs.flat()),
    ...(rest.arrows ?? []).flatMap((arrow) => arrow.segs.flat()),
  ]);
  const kept = Object.entries(board.pts).filter(([name]) => used.has(name));
  const figure: FigureSpec = {
    ...rest,
    label,
    pts: Object.fromEntries(kept),
    segs,
    names: rest.names ?? [...names],
  };
  return crop ? cropped(figure) : figure;
}

// The figure with its frame cut to its points and scaled up.
function cropped(figure: FigureSpec): FigureSpec {
  const points = Object.values(figure.pts);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const [width, height] = [Math.max(...xs) - minX, Math.max(...ys) - minY];
  const scale = CROP_CONTENT / Math.max(width, height);
  return {
    ...figure,
    w: Math.round(width * scale + 2 * CROP_MARGIN),
    h: Math.round(height * scale + 2 * CROP_MARGIN),
    pts: Object.fromEntries(
      Object.entries(figure.pts).map(([name, [x, y]]) => [
        name,
        [(x - minX) * scale + CROP_MARGIN, (y - minY) * scale + CROP_MARGIN],
      ]),
    ),
  };
}
