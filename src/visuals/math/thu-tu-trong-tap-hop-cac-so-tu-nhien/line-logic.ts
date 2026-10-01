import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";
import type { LineLayer, LineTapSpec } from "./types";

// Pure logic of the number-line pictures: which ticks a line has, where they
// sit in the drawing, how the layers of a picture are stacked so that no two
// labels overlap, and the validator of the "place the points" exercise.

// The shape of a line, shared by the three number-line specs.
export type LineGeometry = {
  from: number;
  to: number;
  step?: number;
  labelAt?: readonly number[];
};

// ---------------------------------------------------------------------------
// Ticks

// The values of the ticks: `from`, `from + step`, … up to `to`.
export function tickValues({ from, to, step = 1 }: LineGeometry): number[] {
  const size = step > 0 ? step : 1;
  const values: number[] = [];
  for (let value = from; value <= to; value += size) values.push(value);
  return values;
}

// The ticks that carry their number: `labelAt`, or every tick without it.
export function labelledTicks(spec: LineGeometry): number[] {
  const ticks = tickValues(spec);
  const { labelAt } = spec;
  return labelAt ? ticks.filter((tick) => labelAt.includes(tick)) : ticks;
}

// ---------------------------------------------------------------------------
// Layout, in the units of the drawing's viewBox. The drawing is 288 wide so
// that, in the narrowest frame a picture gets on a 390px phone (about 296px,
// inside a tip or recap card), the 16-unit text is still drawn at 16px or more.

export const VIEW_WIDTH = 288;
export const TEXT_SIZE = 16;
// Widest a bold digit or letter is at `TEXT_SIZE`, rounded up.
export const CHAR_WIDTH = 9;
export const X_FIRST = 22;
export const X_LAST = 256;
export const ARROW_TIP = 280;
export const AXIS_START = 6;
// Marker radius of a plain point, and of a point the child taps.
export const DOT_RADIUS = 9;
export const TRY_DOT_RADIUS = 11;
export const TAP_DOT_RADIUS = 14;
// Offsets from the axis.
export const LABEL_DROP = 26;
const TAG_SHAPE = 16;
const LABEL_GAP = 2;
const MIN_DOT_RADIUS = 7;
const MARGIN = 4;
const ROW_GAP = 6;
const NAME_ROW = 22;
const ARROW_ROW = 30;
const TAG_ROW = 24;

// Horizontal position of a tick (or of any value between the first and last).
export function tickX(spec: LineGeometry, value: number): number {
  const ticks = tickValues(spec);
  const first = ticks[0] ?? spec.from;
  const last = ticks[ticks.length - 1] ?? first;
  if (last === first) return X_FIRST;
  return X_FIRST + ((value - first) / (last - first)) * (X_LAST - X_FIRST);
}

// Width of a short label of `characters` letters, with the marker of its
// concept colour in front when `withShape`.
export function tagWidth(text: string, withShape: boolean): number {
  return text.length * CHAR_WIDTH + (withShape ? TAG_SHAPE : 0);
}

// Smallest horizontal gap between two neighbouring numbers of the line, minus
// the width of the wider of the two: negative means they would overlap.
export function labelClearance(
  spec: LineGeometry,
  extraTicks: readonly number[] = [],
): number {
  const shown = [...new Set([...labelledTicks(spec), ...extraTicks])].sort(
    (a, b) => a - b,
  );
  let worst = Number.POSITIVE_INFINITY;
  for (let i = 1; i < shown.length; i++) {
    const [a, b] = [shown[i - 1] as number, shown[i] as number];
    const gap = tickX(spec, b) - tickX(spec, a);
    const wide = Math.max(String(a).length, String(b).length) * CHAR_WIDTH;
    worst = Math.min(worst, gap - wide);
  }
  return worst;
}

// Numbers to write under the ticks: those of `labelAt` and every tick in
// `marked` (a point's own number, always kept). A plain number that would
// touch the number of a marked tick next to it is left out.
export function visibleLabels(
  spec: LineGeometry,
  marked: readonly number[],
): number[] {
  const width = (value: number) => String(value).length * CHAR_WIDTH;
  const touches = (tick: number) =>
    marked.some(
      (other) =>
        other !== tick &&
        Math.abs(tickX(spec, tick) - tickX(spec, other)) <
          (width(tick) + width(other)) / 2 + LABEL_GAP,
    );
  const markedSet = new Set(marked);
  return tickValues(spec).filter((tick) =>
    markedSet.has(tick)
      ? true
      : labelledTicks(spec).includes(tick) && !touches(tick),
  );
}

// Radius of the dot of a point the child moves: as big as a tick's spacing
// allows, so dots on neighbouring ticks never touch.
export function tryDotRadius(spec: LineGeometry): number {
  const count = tickValues(spec).length;
  if (count < 2) return TRY_DOT_RADIUS;
  const room = (X_LAST - X_FIRST) / (count - 1) / 2 - 1;
  return Math.min(TRY_DOT_RADIUS, Math.max(room, MIN_DOT_RADIUS));
}

// Sideways shift of each point so that points sharing a tick sit side by
// side instead of on top of each other (0 for a point alone on its tick).
export function dotOffsets(
  values: readonly number[],
  radius: number,
): number[] {
  return values.map((value, i) => {
    const group = values.filter((other) => other === value).length;
    const rank = values.slice(0, i).filter((other) => other === value).length;
    return (rank - (group - 1) / 2) * (radius * 2 + 2);
  });
}

// First-fit packing of horizontal intervals into rows: the row of each
// interval, so that intervals sharing a row stay `ROW_GAP` apart.
export function packRows(
  intervals: readonly (readonly [number, number])[],
): number[] {
  const rows: (readonly [number, number])[][] = [];
  return intervals.map((interval) => {
    const free = rows.findIndex((row) =>
      row.every(
        ([left, right]) =>
          interval[1] + ROW_GAP <= left || interval[0] >= right + ROW_GAP,
      ),
    );
    const index = free === -1 ? rows.length : free;
    rows[index] = [...(rows[index] ?? []), interval];
    return index;
  });
}

export type LinePlan = {
  // Height of the axis in the drawing, and the drawing's height.
  axisY: number;
  height: number;
  // Per layer: the row of its arrow above the line, the row of its tag under
  // the line, and the middle of its tag. `undefined` where it has none.
  arrowRow: readonly (number | undefined)[];
  tagRow: readonly (number | undefined)[];
  tagX: readonly (number | undefined)[];
};

type Placed = { low: number; high: number; centre: number; width: number };

function placeTag(
  text: string,
  withShape: boolean,
  middle: number,
  low: number,
  high: number,
): Placed {
  const width = tagWidth(text, withShape);
  const half = width / 2 + MARGIN;
  const centre = Math.min(Math.max(middle, half), VIEW_WIDTH - half);
  return {
    low: Math.min(low, centre - width / 2),
    high: Math.max(high, centre + width / 2),
    centre,
    width,
  };
}

// Where every part of a line picture goes. Layers that are not shown yet (or
// are hidden in a hint) still take their place, so nothing moves between steps.
// `nameRows` is how many extra rows of names a point can need above the line.
export function planLine(
  spec: LineGeometry & { layers?: readonly LineLayer[] },
  options: { dotRadius?: number; nameRows?: number } = {},
): LinePlan {
  const { dotRadius = DOT_RADIUS, nameRows = 0 } = options;
  const layers = spec.layers ?? [];
  const x = (value: number) => tickX(spec, value);

  const arrows: { index: number; placed: Placed }[] = [];
  const tags: { index: number; placed: Placed }[] = [];
  layers.forEach((layer, index) => {
    switch (layer.type) {
      case "arrow": {
        const [left, right] = [x(layer.from), x(layer.to)].sort(
          (a, b) => a - b,
        ) as [number, number];
        arrows.push({
          index,
          placed: placeTag(
            layer.tag,
            layer.color !== undefined,
            (left + right) / 2,
            left,
            right,
          ),
        });
        return;
      }
      case "point":
      case "dots": {
        if (!layer.tag) return;
        const at = layer.type === "point" ? [layer.at] : layer.at;
        const xs = at.map(x);
        const middle = xs.reduce((sum, v) => sum + v, 0) / xs.length;
        const placed = placeTag(layer.tag, true, middle, middle, middle);
        tags.push({ index, placed });
        return;
      }
      case "span": {
        if (!layer.tag) return;
        const [left, right] = [x(layer.from), x(layer.to)];
        tags.push({
          index,
          placed: placeTag(layer.tag, true, (left + right) / 2, left, right),
        });
      }
    }
  });

  const arrowRows = packRows(
    arrows.map(({ placed }) => [placed.low, placed.high]),
  );
  const tagRows = packRows(tags.map(({ placed }) => [placed.low, placed.high]));
  const arrowCount = arrowRows.length ? Math.max(...arrowRows) + 1 : 0;
  const tagCount = tagRows.length ? Math.max(...tagRows) + 1 : 0;

  const namesTop = dotRadius + 30 + nameRows * NAME_ROW;
  const arrowsTop = dotRadius + 31 + (arrowCount - 1) * ARROW_ROW + 14 + 8 + 4;
  const axisY = arrowCount > 0 ? Math.max(namesTop, arrowsTop) : namesTop;
  const height =
    tagCount > 0
      ? axisY + 58 + (tagCount - 1) * TAG_ROW + 14
      : axisY + LABEL_DROP + 18;

  const arrowRow: (number | undefined)[] = layers.map(() => undefined);
  const tagRow: (number | undefined)[] = layers.map(() => undefined);
  const tagX: (number | undefined)[] = layers.map(() => undefined);
  arrows.forEach(({ index, placed }, i) => {
    arrowRow[index] = arrowRows[i];
    tagX[index] = placed.centre;
  });
  tags.forEach(({ index, placed }, i) => {
    tagRow[index] = tagRows[i];
    tagX[index] = placed.centre;
  });
  return { axisY, height, arrowRow, tagRow, tagX };
}

// Vertical position of the line in a row of the picture, from the axis.
export function arrowY(plan: LinePlan, row: number, dotRadius: number): number {
  return plan.axisY - dotRadius - 31 - row * ARROW_ROW;
}

export function tagY(plan: LinePlan, row: number): number {
  return plan.axisY + 58 + row * TAG_ROW;
}

// Height of a point's name above the axis; `rank` stacks names of points that
// share a tick.
export function nameY(plan: LinePlan, dotRadius: number, rank: number): number {
  return plan.axisY - dotRadius - 15 - rank * NAME_ROW;
}

// ---------------------------------------------------------------------------
// Tap exercise

// Region ids of a line the child taps: the lower-case names, in the order of
// `points`.
export function lineTapRegions(spec: LineTapSpec): string[] {
  return spec.points.map((point) => point.name.toLocaleLowerCase("vi"));
}

// ---------------------------------------------------------------------------
// Place-the-points exercise: params and state carry the value of each point
// under the keys `p0`, `p1`, …

const POINT_KEY = /^p\d+$/;

function pointKeys(values: Record<string, number>): string[] {
  return Object.keys(values).filter((key) => POINT_KEY.test(key));
}

// Right when every point of the task sits on its wanted value and the child
// placed no other point.
export const datDiem: ManipulateValidator = (state, params) => {
  const wanted = pointKeys(params);
  return (
    wanted.length > 0 &&
    wanted.every((key) => state[key] === params[key]) &&
    pointKeys(state).every((key) => wanted.includes(key))
  );
};

export const solveDatDiem: ManipulateSolver = (params) =>
  Object.fromEntries(pointKeys(params).map((key) => [key, params[key] ?? 0]));

export const validators = { "dat-diem": datDiem } as const;
export const solutions = { "dat-diem": solveDatDiem } as const;
