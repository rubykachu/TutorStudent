// Numbers of the estimate picture, without React: the bounds of the product,
// where every value sits on its number line, and which option fits between
// the bounds.

export type EstimateNumbers = {
  a: number;
  b: number;
  lowA: number;
  highA: number;
  options?: readonly number[];
};

export type Bounds = { low: number; high: number; product: number };

export function boundsOf({ a, b, lowA, highA }: EstimateNumbers): Bounds {
  return { low: lowA * b, high: highA * b, product: a * b };
}

// A value lies in the zone when it is at least the low bound and at most the
// high bound.
export function inZone(value: number, { low, high }: Bounds): boolean {
  return value >= low && value <= high;
}

// Options this many zone-widths from the zone still share the zoomed axis;
// any farther one goes to a slot past a break in the line.
const NEAR_SPANS = 2;
// The zoomed axis reaches this share of the zone-width past its outermost
// value on each side.
const MARGIN_SPANS = 0.3;

export type FarSlot = { value: number; x: number };

export type AxisPlan = {
  toX: (value: number) => number;
  // Horizontal positions of the breaks drawn across the line.
  breaks: number[];
  far: FarSlot[];
};

// Places values on a line from x0 to x1. The zoomed part covers the bounds
// and the options close to them; options far away are not drawn to scale but
// sit in a slot at the end of the line, behind a break mark, so that the
// bounds stay readable.
export function planAxis(
  { low, high }: Bounds,
  options: readonly number[],
  x0: number,
  x1: number,
  slotWidth: number,
): AxisPlan {
  const span = Math.max(high - low, 1);
  const near = options.filter(
    (v) => v >= low - NEAR_SPANS * span && v <= high + NEAR_SPANS * span,
  );
  const farLow = options.filter((v) => v < low - NEAR_SPANS * span).sort(asc);
  const farHigh = options.filter((v) => v > high + NEAR_SPANS * span).sort(asc);
  const from = Math.min(low, ...near) - MARGIN_SPANS * span;
  const to = Math.max(high, ...near) + MARGIN_SPANS * span;
  const left = farLow.length > 0 ? slotWidth : 0;
  const right = farHigh.length > 0 ? slotWidth : 0;
  const start = x0 + left;
  const end = x1 - right;
  const far: FarSlot[] = [
    ...farLow.map((value, i) => ({
      value,
      x: x0 + ((i + 0.5) * slotWidth) / farLow.length - 4,
    })),
    ...farHigh.map((value, i) => ({
      value,
      x: end + ((i + 0.5) * slotWidth) / farHigh.length + 4,
    })),
  ];
  const breaks = [
    ...(left > 0 ? [start - 4] : []),
    ...(right > 0 ? [end + 4] : []),
  ];
  return {
    toX: (value) => start + ((value - from) / (to - from)) * (end - start),
    breaks,
    far,
  };
}

function asc(p: number, q: number) {
  return p - q;
}

// Labels written above the line go in one of two lanes, so that values close
// together never overlap: a label within `gap` of the previous one moves to
// the other lane.
export function assignLanes(xs: readonly number[], gap: number): number[] {
  const order = xs.map((x, i) => ({ x, i })).sort((p, q) => p.x - q.x);
  const lanes: number[] = Array(xs.length).fill(0);
  let previous: { x: number; lane: number } | undefined;
  for (const { x, i } of order) {
    const lane =
      previous !== undefined && x - previous.x < gap ? 1 - previous.lane : 0;
    lanes[i] = lane;
    previous = { x, lane };
  }
  return lanes;
}
