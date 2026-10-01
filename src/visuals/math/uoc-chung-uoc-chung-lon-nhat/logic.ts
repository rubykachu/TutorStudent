import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Pure helpers of the common-divisor pictures: divisors, greatest common
// divisor, prime factorisation, and the validator of the "cut the strips"
// exercise. No React, so `content:check` and tests read it.

export const LESSON_SLUG = "uoc-chung-uoc-chung-lon-nhat";

// Piece lengths the child may try on the strip screens. Length 1 fits every
// strip, so the range starts at 2.
export const PIECE_RANGE = { min: 2, max: 9 } as const;

// Divisors of n, smallest first.
export function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function gcdOf(numbers: readonly number[]): number {
  return numbers.reduce(gcd);
}

// Divisors shared by every number, smallest first.
export function commonDivisors(numbers: readonly number[]): number[] {
  return divisors(gcdOf(numbers));
}

// The prime factors of n with repetition, smallest first: 36 gives
// [2, 2, 3, 3].
export function primeFactors(n: number): number[] {
  const out: number[] = [];
  let rest = n;
  for (let p = 2; rest > 1; p++) {
    while (rest % p === 0) {
      out.push(p);
      rest /= p;
    }
  }
  return out;
}

// The prime factors of n as [prime, exponent] pairs: 36 gives [[2, 2], [3, 2]].
export function primePowers(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (const p of primeFactors(n)) {
    const last = out[out.length - 1];
    if (last?.[0] === p) last[1]++;
    else out.push([p, 1]);
  }
  return out;
}

// Exponent of the prime p in n (0 when p does not divide n).
export function exponentOf(n: number, p: number): number {
  return primePowers(n).find(([prime]) => prime === p)?.[1] ?? 0;
}

// Primes that appear in at least one of the numbers, smallest first.
export function primesOf(numbers: readonly number[]): number[] {
  return [...new Set(numbers.flatMap(primeFactors))].sort((a, b) => a - b);
}

// A whole number in TeX with thousands grouped by thin spaces.
export function texInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

// "p^{e}" in TeX, with the base painted sky (prime number) and the exponent
// violet (exponent); exponent 1 is left out.
export function texPower(p: number, e: number): string {
  const base = `\\concept{sky}{${p}}`;
  return e === 1 ? base : `${base}^{\\concept{violet}{${e}}}`;
}

// "2^2 · 3^2" for the factorisation of n, or the number itself when prime.
export function texFactorisation(n: number): string {
  return primePowers(n)
    .map(([p, e]) => texPower(p, e))
    .join(" \\cdot ");
}

// "2 · 2 · 3 · 3": the prime factors written one by one.
export function texFactorList(n: number): string {
  return primeFactors(n)
    .map((p) => `\\concept{sky}{${p}}`)
    .join(" \\cdot ");
}

// The strip lengths an exercise's params name: a, b and, unless 0, c.
export function stripLengths(params: Record<string, number>): number[] {
  const { a, b, c } = params;
  return [a, b, c].filter((n): n is number => n !== undefined && n > 0);
}

// Whether a piece length cuts every strip exactly; with `largest` = 1 it must
// also be the greatest such length.
function pieceFits(d: number, params: Record<string, number>): boolean {
  const strips = stripLengths(params);
  if (strips.length === 0) return false;
  if (!strips.every((n) => n % d === 0)) return false;
  return params.largest !== 1 || d === gcdOf(strips);
}

// Validator of the strip exercise. The screen reports { d }; params are the
// strip lengths a, b, c (0 = none) and `largest` (1 = the longest piece).
const stripCut: ManipulateValidator = (state, params) => {
  const { d } = state;
  return d !== undefined && pieceFits(d, params);
};

// The smallest piece length in range that satisfies the validator.
const solveStripCut: ManipulateSolver = (params) => {
  for (let d = PIECE_RANGE.min; d <= PIECE_RANGE.max; d++) {
    if (pieceFits(d, params)) return { d };
  }
  return { d: PIECE_RANGE.min };
};

export const validators = { "cat-vua-het": stripCut } as const;
export const solutions = { "cat-vua-het": solveStripCut } as const;
