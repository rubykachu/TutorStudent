import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Pure helpers of the divisibility-sign pictures: digits of a number, the
// digits that make a number divisible, TeX of the verdict lines, and the
// validator of the "which digit fits the box" exercise. No React, so
// `content:check` and tests read it.

export const LESSON_SLUG = "dau-hieu-chia-het";

// Digits the child may put in the box.
export const DIGIT_RANGE = { min: 0, max: 9 } as const;

// The digits of n, most significant first.
export function digitsOf(n: number): number[] {
  return [...String(n)].map(Number);
}

export function digitSum(n: number): number {
  return digitsOf(n).reduce((sum, digit) => sum + digit, 0);
}

export function divisible(n: number, d: number): boolean {
  return n % d === 0;
}

// The digits 0..9 a number ending in them must end in to be divisible by
// `divisor` (2: 0, 2, 4, 6, 8; 5: 0, 5).
export function endingDigitsFor(divisor: number): number[] {
  const digits: number[] = [];
  for (let d = DIGIT_RANGE.min; d <= DIGIT_RANGE.max; d++) {
    if (divisible(d, divisor)) digits.push(d);
  }
  return digits;
}

// The number `before`, the digit, then `after` written on `afterLen` digits.
// `before` 0 means no digits before the box.
export function numberWithDigit(
  before: number,
  digit: number,
  after: number,
  afterLen: number,
): number {
  return (before * 10 + digit) * 10 ** afterLen + after;
}

// The digits for the box that make the whole number divisible by every
// divisor.
export function fittingDigits(
  before: number,
  after: number,
  afterLen: number,
  divisors: readonly number[],
): number[] {
  const digits: number[] = [];
  for (let d = DIGIT_RANGE.min; d <= DIGIT_RANGE.max; d++) {
    const n = numberWithDigit(before, d, after, afterLen);
    if (divisors.every((divisor) => divisible(n, divisor))) digits.push(d);
  }
  return digits;
}

// A whole number in TeX with thousands grouped by thin spaces.
export function texInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

// "n ⋮ d" or "n ⋮̸ d" in TeX; with `color` the number is painted in it.
export function verdictTex(n: number, d: number, color?: string): string {
  const left = color ? `\\concept{${color}}{${texInt(n)}}` : texInt(n);
  return `${left} ${divisible(n, d) ? "\\chiahet" : "\\khongchiahet"} ${d}`;
}

// "4 + 3 + 2 + 6 = 15" in TeX, the sum painted in `color`.
export function sumTex(n: number, color: string): string {
  return `${digitsOf(n).join(" + ")} = \\concept{${color}}{${digitSum(n)}}`;
}

// "2", "2 và 5", "2, 3 và 5".
export function listDivisors(divisors: readonly number[]): string {
  if (divisors.length <= 1) return divisors.join("");
  return `${divisors.slice(0, -1).join(", ")} và ${divisors[divisors.length - 1]}`;
}

// The divisors an exercise's params name: `divisor`, plus `divisor2` unless
// it is 0.
export function paramDivisors(params: Record<string, number>): number[] {
  const { divisor, divisor2 } = params;
  if (divisor === undefined) return [];
  return divisor2 !== undefined && divisor2 > 0
    ? [divisor, divisor2]
    : [divisor];
}

// Whether `digit` in the box gives a number divisible by every divisor (the
// exercise's `fits` = 1) or not (`fits` = 0).
function digitFits(digit: number, params: Record<string, number>): boolean {
  const n = numberWithDigit(
    params.before ?? 0,
    digit,
    params.after ?? 0,
    params.afterLen ?? 0,
  );
  const all = paramDivisors(params).every((d) => divisible(n, d));
  return all === (params.fits === 1);
}

// Validator of the box exercise. The screen reports { d }; params are
// before, after, afterLen, divisor, divisor2 (0 = none) and fits.
const chiaHet: ManipulateValidator = (state, params) => {
  const { d } = state;
  if (d === undefined || paramDivisors(params).length === 0) return false;
  return digitFits(d, params);
};

// The smallest digit the validator accepts.
const solveChiaHet: ManipulateSolver = (params) => {
  for (let d = DIGIT_RANGE.min; d <= DIGIT_RANGE.max; d++) {
    if (digitFits(d, params)) return { d };
  }
  return { d: DIGIT_RANGE.min };
};

export const validators = { "chia-het": chiaHet } as const;
export const solutions = { "chia-het": solveChiaHet } as const;
