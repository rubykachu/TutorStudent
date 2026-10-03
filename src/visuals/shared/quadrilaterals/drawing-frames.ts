import type { VisualState } from "@/visuals/registry";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { unit } from "@/visuals/shared/plane/geometry";
import {
  type BoardShape,
  boardFigure,
  solvedState,
  UNIT,
} from "./construction";
import { textAt } from "./figures";

// Frames of a drawing made with ruler, set square and compass, for the
// pictures that show the steps and the finished drawing of each shape.

// How far the name of the fourth corner of a rhombus board stands from the
// corner, on the bisector of the guide line and the compass arc that both
// leave it: the name touches neither stroke.
const FOURTH_NAME_DISTANCE = 30;

// The board as the child sees it. On the rhombus board the compass arc that
// marks the fourth corner runs through the corner, and the name that
// `boardFigure` puts beside the corner would sit on the arc; the name is
// written on the free side instead.
export function boardView(
  shape: BoardShape,
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const board = boardFigure(shape, names, state);
  const [first, , , fourth] = names;
  if (shape !== "rhombus" || first === undefined || fourth === undefined)
    return board;
  const start = board.pts[first];
  const corner = board.pts[fourth];
  if (!start || !corner || !board.names?.includes(fourth)) return board;
  // The guide line leaves the first corner towards the fourth; the arc
  // leaves the fourth at a right angle to it. Their bisector points out.
  const [ux, uy] = unit(start, corner);
  const [bx, by] = unit([0, 0], [ux + uy, uy - ux]);
  return {
    ...board,
    names: board.names.filter((name) => name !== fourth),
    texts: [
      ...(board.texts ?? []),
      textAt(
        corner[0] + bx * FOURTH_NAME_DISTANCE,
        corner[1] + by * FOURTH_NAME_DISTANCE,
        fourth,
      ),
    ],
  };
}

// The drawing board in a state: ruler, guide lines and compass arcs included.
export const stage = boardView;

// A frame of a board with its top `cm` centimetres cut off, for a drawing
// whose height stays below the top of the board: the frame is shorter, so the
// picture is drawn bigger. The frames of one drawing are all cut alike.
const TRIMMED_MAX_SCALE = 2;
export function trimTop(figure: FigureSpec, cm: number): FigureSpec {
  const cut = cm * UNIT;
  const down = ([x, y]: readonly [number, number]): [number, number] => [
    x,
    y - cut,
  ];
  return {
    ...figure,
    h: figure.h - cut,
    maxScale: TRIMMED_MAX_SCALE,
    pts: Object.fromEntries(
      Object.entries(figure.pts).map(([name, p]) => [name, down(p)]),
    ),
    ...(figure.ruler
      ? { ruler: { ...figure.ruler, y: figure.ruler.y - cut } }
      : {}),
    ...(figure.texts
      ? {
          texts: figure.texts.map((text) => ({ ...text, y: text.y - cut })),
        }
      : {}),
  };
}

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
