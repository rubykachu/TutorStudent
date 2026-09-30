// Validators and solvers of the two "make a round sum" pictures. No React, so
// `content:check` can load them.

import type { VisualState } from "@/visuals/registry";

type Params = Record<string, number>;

function numbersOf(params: Params): number[] {
  const numbers: number[] = [];
  for (let i = 0; `n${i}` in params; i++) numbers.push(params[`n${i}`] ?? 0);
  return numbers;
}

function isMultiple(value: number, unit: number): boolean {
  return unit > 0 && value % unit === 0;
}

// Params { unit, n0, n1, ... }: exactly two numbers picked (pick<i> = 1) whose
// sum is a multiple of `unit`.
export function pairRound(state: VisualState, params: Params): boolean {
  const numbers = numbersOf(params);
  const picked = numbers.flatMap((n, i) =>
    state[`pick${i}`] === 1 ? [n] : [],
  );
  const [first, second] = picked;
  return (
    picked.length === 2 &&
    first !== undefined &&
    second !== undefined &&
    isMultiple(first + second, params.unit ?? 0)
  );
}

// The first pair, in reading order, whose sum is a multiple of `unit`.
export function solvePairRound(params: Params): VisualState {
  const numbers = numbersOf(params);
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (isMultiple((numbers[i] ?? 0) + (numbers[j] ?? 0), params.unit ?? 0)) {
        return { [`pick${i}`]: 1, [`pick${j}`]: 1 };
      }
    }
  }
  return {};
}

// Params { a, b, unit }: move k from a to b (0 < k < a) so that b + k is a
// multiple of `unit`.
export function shiftRound(state: VisualState, params: Params): boolean {
  const k = state.k;
  const { a = 0, b = 0, unit = 0 } = params;
  return (
    k !== undefined &&
    Number.isInteger(k) &&
    k > 0 &&
    k < a &&
    isMultiple(b + k, unit)
  );
}

export function solveShiftRound(params: Params): VisualState {
  const { b = 0, unit = 1 } = params;
  const k = (unit - (b % unit)) % unit;
  return { k: k === 0 ? unit : k };
}
