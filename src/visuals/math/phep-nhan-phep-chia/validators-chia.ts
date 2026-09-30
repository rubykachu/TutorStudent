import type {
  ManipulateSolver,
  ManipulateValidator,
  VisualState,
} from "@/visuals/registry";
import {
  digitsOf,
  divide,
  fillPlaces,
  placeKey,
  readNumber,
} from "./long-division";

// Validators and solvers of the two division `manipulate` exercises.
// - "chia" (params total, people): state { q, r }, what each of `people` gets
//   and what is left over;
// - "thuong-du" (params dividend, divisor): state { q0, q1, … , r0, r1, … },
//   the digits of the quotient and of the remainder, place 0 the ones.

function hasParams(
  params: Record<string, number>,
  ...names: string[]
): boolean {
  return names.every((name) => {
    const value = params[name];
    return value !== undefined && Number.isInteger(value);
  });
}

const chia: ManipulateValidator = (state, params) => {
  if (!hasParams(params, "total", "people") || (params.people ?? 0) < 1) {
    return false;
  }
  const total = params.total as number;
  const people = params.people as number;
  return state.q === Math.floor(total / people) && state.r === total % people;
};

const solveChia: ManipulateSolver = (params) => {
  const total = params.total ?? 0;
  const people = Math.max(params.people ?? 1, 1);
  return { q: Math.floor(total / people), r: total % people };
};

const thuongDu: ManipulateValidator = (state, params) => {
  if (!hasParams(params, "dividend", "divisor") || (params.divisor ?? 0) < 1) {
    return false;
  }
  const dividend = params.dividend as number;
  const divisor = params.divisor as number;
  const places = fillPlaces(dividend, divisor);
  const real = divide(dividend, divisor);
  return (
    readNumber(state, "q", places.quotient) === real.quotient &&
    readNumber(state, "r", places.remainder) === real.remainder
  );
};

const solveThuongDu: ManipulateSolver = (params) => {
  const dividend = params.dividend ?? 0;
  const divisor = Math.max(params.divisor ?? 1, 1);
  const places = fillPlaces(dividend, divisor);
  const real = divide(dividend, divisor);
  const state: VisualState = {};
  const put = (kind: "q" | "r", value: number, length: number) => {
    digitsOf(value, length).forEach((digit, index) => {
      state[placeKey(kind, length - 1 - index)] = digit;
    });
  };
  put("q", real.quotient, places.quotient);
  put("r", real.remainder, places.remainder);
  return state;
};

export const validators = { chia, "thuong-du": thuongDu };
export const solutions = { chia: solveChia, "thuong-du": solveThuongDu };
