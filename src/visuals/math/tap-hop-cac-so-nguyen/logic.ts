import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";
import type { LineRange } from "@/visuals/shared/number-line-geometry";

// Pure helpers of the integer pictures: the validator of the "place the
// points" exercise and the regions of the "tap the point" exercise. No React,
// so `content:check` and tests read it.

export const LESSON_SLUG = "tap-hop-cac-so-nguyen";

// The point the child moves starts on this tick unless a picture says
// otherwise: the origin, where the child counts from.
export const START_TICK = 0;

// A line the child taps: points are named by capital letters, and a region
// id is the lower-case name.
export type TapPoint = { at: number; name: string };

export function lineTapRegions(points: readonly TapPoint[]): string[] {
  return points.map((point) => point.name.toLocaleLowerCase("vi"));
}

// Place-the-points exercise: params and state carry the value of each point
// under the keys `p0`, `p1`, …

const POINT_KEY = /^p\d+$/;

export const pointKey = (index: number): string => `p${index}`;

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

// The tick after `value` (or the one before), or `value` at the end of the
// line.
export function neighbour(
  range: LineRange,
  value: number,
  direction: "down" | "up",
): number {
  return direction === "up"
    ? Math.min(value + 1, range.to)
    : Math.max(value - 1, range.from);
}

// Place of each dot of the "place the points" picture. Dots that share a tick
// sit side by side. On a picture with many points, PILE_FROM dots or more on
// one tick look the same as a single dot, so the pile is drawn as one unnamed
// dot: names floating over the neighbouring ticks would read as other
// numbers, and dots drawn on top of each other overlap. A dot is drawn and
// named again once it leaves the pile.
export const PILE_FROM = 3;

export type DotPlace = {
  offset: number;
  // False for a dot hidden behind the first dot of its pile.
  drawn: boolean;
  named: boolean;
};

export function dotPlaces(
  values: readonly number[],
  radius: number,
  crowded: boolean,
): DotPlace[] {
  return values.map((value, i) => {
    const group = values.filter((other) => other === value).length;
    const rank = values.slice(0, i).filter((other) => other === value).length;
    if (crowded && group >= PILE_FROM) {
      return { offset: 0, drawn: rank === 0, named: false };
    }
    return {
      offset: (rank - (group - 1) / 2) * (radius * 2 + 2),
      drawn: true,
      named: true,
    };
  });
}
