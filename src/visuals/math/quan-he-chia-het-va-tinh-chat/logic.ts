import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Pure helpers of the divisibility pictures: how a number splits into bags,
// where equal hops land, the divisor pairs of a number, and the validator of
// the bag-size exercise. No React, so `content:check` and tests read it.

export const LESSON_SLUG = "quan-he-chia-het-va-tinh-chat";

// Bag sizes the child may try on the "pick a bag size" screen. Size 1 fits
// every number, so the range starts at 2.
export const BAG_RANGE = { min: 2, max: 9 } as const;

// The landings of equal hops from 0: step, 2 · step, … up to `limit`.
export function landings(step: number, limit: number): number[] {
  const out: number[] = [];
  for (let value = step; value <= limit; value += step) out.push(value);
  return out;
}

// Divisors of n, smallest first.
export function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

// The ways to write n as a product of two numbers, smaller factor first:
// 12 gives [1, 12], [2, 6], [3, 4].
export function divisorPairs(n: number): [number, number][] {
  return divisors(n)
    .filter((d) => d * d <= n)
    .map((d) => [d, n / d] as [number, number]);
}

// Validator of the bag-size exercise. The screen reports { size }; params
// are the total and `fits` (1 = the bags must hold it exactly, 0 = some
// items must be left over).
const bagSizeFits: ManipulateValidator = (state, params) => {
  const { size } = state;
  if (size === undefined || params.total === undefined) return false;
  return (params.total % size === 0) === (params.fits === 1);
};

// The smallest size in range that satisfies the validator.
const solveBagSize: ManipulateSolver = (params) => {
  const total = params.total ?? 0;
  for (let size = BAG_RANGE.min; size <= BAG_RANGE.max; size++) {
    if ((total % size === 0) === (params.fits === 1)) return { size };
  }
  return { size: BAG_RANGE.min };
};

export const validators = { tui: bagSizeFits } as const;
export const solutions = { tui: solveBagSize } as const;
