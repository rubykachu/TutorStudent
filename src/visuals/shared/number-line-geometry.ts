// Pure geometry of the integer number line (a line with an arrow at both
// ends, or only at the positive end, and a tick at every integer) shared by
// the lessons of chapter III: which ticks it has, where they sit in the
// drawing and how tall the drawing is for the layers it carries. No React, so
// `content:check` and tests read it.

import { MINUS_SIGN } from "@/lib/number-format";

// The minus sign of a written number (U+2212), as printed in textbooks.
export const MINUS = MINUS_SIGN;

// "−3" for -3, "5" for 5: how a number is written inside a drawing.
export function signed(value: number): string {
  return value < 0 ? `${MINUS}${-value}` : String(value);
}

// The ticks of a line: every integer from `from` to `to`.
export type LineRange = { from: number; to: number };

export function tickValues({ from, to }: LineRange): number[] {
  const values: number[] = [];
  for (let value = from; value <= to; value++) values.push(value);
  return values;
}

// ---------------------------------------------------------------------------
// Layout, in the units of the drawing's viewBox. The drawing is 320 wide so
// that text of `TEXT_SIZE` keeps at least 16px at 95% of that width, as in a
// narrow card.

export const VIEW_WIDTH = 320;
export const TEXT_SIZE = 17;
export const X_FIRST = 38;
export const X_LAST = 282;
export const AXIS_LEFT = 6;
export const AXIS_RIGHT = 314;
export const DOT_RADIUS = 9;
export const TRY_DOT_RADIUS = 11;
// Distance from the axis to the numbers under it, and to a point's name above.
export const LABEL_DROP = 28;
export const NAME_RISE = 22;
// Height of one row of arrows above the axis (line and its tag), and of the
// row of zone tags under the numbers.
export const ARROW_ROW = 48;
export const ZONE_ROW = 34;
const TOP_PAD = 14;
const BOTTOM_PAD = 16;

// Which ends of the axis carry an arrowhead: both (the whole integer line,
// going on without end each way) or only the positive end (a line that starts
// at a point and runs on to the right).
export type AxisArrows = "both" | "positive";

export const ARROW_HEAD = 7;

// The axis stroke ends where an arrowhead begins; a bare end stays at the
// edge of the drawing.
export function axisSpan(arrows: AxisArrows = "both"): {
  x1: number;
  x2: number;
  negativeHead: boolean;
} {
  const negativeHead = arrows === "both";
  return {
    x1: negativeHead ? AXIS_LEFT + ARROW_HEAD : AXIS_LEFT,
    x2: AXIS_RIGHT - ARROW_HEAD,
    negativeHead,
  };
}

// Horizontal position of an integer (also between ticks).
export function tickX(range: LineRange, value: number): number {
  const { from, to } = range;
  if (to === from) return (X_FIRST + X_LAST) / 2;
  return X_FIRST + ((value - from) / (to - from)) * (X_LAST - X_FIRST);
}

// Spacing between two neighbouring ticks.
export function tickGap(range: LineRange): number {
  const count = range.to - range.from;
  return count <= 0 ? X_LAST - X_FIRST : (X_LAST - X_FIRST) / count;
}

// What a layer of a picture needs to be placed.
export type PlanInput = {
  // A point carries a name above the axis.
  names: boolean;
  // Rows of arrows above the axis.
  arrowRows: number;
  // A zone tag under the numbers.
  zoneTags: boolean;
};

export type LinePlan = {
  // Height of the axis in the drawing, and the drawing's height.
  axisY: number;
  height: number;
};

export function planLine({ names, arrowRows, zoneTags }: PlanInput): LinePlan {
  const above = Math.max(names ? NAME_RISE + DOT_RADIUS + 6 : 0, 12);
  const axisY = TOP_PAD + above + arrowRows * ARROW_ROW;
  const below = LABEL_DROP + 14 + (zoneTags ? ZONE_ROW : 0);
  return { axisY, height: axisY + below + BOTTOM_PAD };
}

// Ticks whose number is written under them: `labelAt`, or every tick when it
// is absent. A tick that has a point with its own text there is left out by
// the drawing, not here.
export function labelledTicks(
  range: LineRange,
  labelAt?: readonly number[],
): number[] {
  const ticks = tickValues(range);
  return labelAt ? ticks.filter((tick) => labelAt.includes(tick)) : ticks;
}

// Sideways shift of each dot so that dots sharing a tick sit side by side.
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

// Radius of the dot of a point the child moves: as large as the tick spacing
// allows, so dots on neighbouring ticks never touch.
export function tryDotRadius(range: LineRange): number {
  return Math.min(TRY_DOT_RADIUS, Math.max(tickGap(range) / 2 - 1, 7));
}
