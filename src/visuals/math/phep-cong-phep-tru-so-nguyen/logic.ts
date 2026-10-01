import type { LineRange } from "@/visuals/shared/number-line-geometry";
import { tickGap } from "@/visuals/shared/number-line-geometry";

// Pure helpers of the pictures of integer addition and subtraction: where a
// walk along the number line goes and which ticks carry their number. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG = "phep-cong-phep-tru-so-nguyen";

// Where a walk ends after each hop: hops[i] is the number added at hop i
// (positive goes right, negative goes left).
export function positionsOf(start: number, hops: readonly number[]): number[] {
  const positions = [start];
  for (const hop of hops) {
    positions.push((positions[positions.length - 1] ?? start) + hop);
  }
  return positions;
}

// The line shows every integer from -m to m: as small as the walk allows, but
// never fewer than 5 each side, so the ticks stay wide apart.
const MIN_REACH = 5;

export function hopRange(positions: readonly number[]): LineRange {
  const reach = Math.max(MIN_REACH, ...positions.map((p) => Math.abs(p) + 1));
  return { from: -reach, to: reach };
}

// A number written under the line is as wide as this many pixels of the
// 320-wide drawing; two of them closer than that would touch.
const NUMBER_WIDTH = 20;
const LANDMARK_STEP = 5;

// Ticks that carry their number, or undefined when every tick can (the line
// is wide enough). On a crowded line only 0 and the multiples of 5 are
// written, and one that stands too close to a marked tick is left out.
export function labelsFor(
  range: LineRange,
  marked: readonly number[],
): number[] | undefined {
  if (tickGap(range) >= NUMBER_WIDTH) return undefined;
  const apart = Math.ceil(NUMBER_WIDTH / tickGap(range));
  const labels: number[] = [];
  for (let tick = range.from; tick <= range.to; tick++) {
    if (tick % LANDMARK_STEP !== 0) continue;
    const crowded = marked.some(
      (other) => other !== tick && Math.abs(other - tick) < apart,
    );
    if (!crowded) labels.push(tick);
  }
  return labels;
}

// How far apart (in ticks) two marked ticks must stand so their numbers do
// not touch, and so the names written over two points ("đầu", "tổng") do not.
export function minApart(range: LineRange): number {
  return Math.ceil(NUMBER_WIDTH / tickGap(range));
}

const NAME_WIDTH = 44;

export function minApartNamed(range: LineRange): number {
  return Math.ceil(NAME_WIDTH / tickGap(range));
}
