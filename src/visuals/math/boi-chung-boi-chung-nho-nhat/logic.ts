import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Pure helpers of the common-multiple pictures: multiples, least common
// multiple, prime factorisation, and the validator of the "two things that
// repeat" exercise. No React, so `content:check` and tests read it.

export const LESSON_SLUG = "boi-chung-boi-chung-nho-nhat";

// How many rounds (trips, turns) the child may count on each side. Round 1
// is where both sides start.
export const ROUND_RANGE = { min: 1, max: 12 } as const;

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

export function lcmOf(numbers: readonly number[]): number {
  return numbers.reduce(lcm);
}

// The non-zero multiples of `step` up to `upTo`, smallest first.
export function multiplesUpTo(step: number, upTo: number): number[] {
  const out: number[] = [];
  for (let n = step; n <= upTo; n += step) out.push(n);
  return out;
}

// Non-zero multiples of every step up to `upTo`, smallest first.
export function commonMultiples(
  steps: readonly number[],
  upTo: number,
): number[] {
  return multiplesUpTo(lcmOf(steps), upTo);
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

// Largest exponent the prime p has in any of the numbers.
export function largestExponent(numbers: readonly number[], p: number) {
  return Math.max(...numbers.map((n) => exponentOf(n, p)));
}

// "p^{e}" in TeX, with the base painted sky (prime number) and the exponent
// violet (exponent); exponent 1 is left out.
export function texPower(p: number, e: number): string {
  const base = `\\concept{sky}{${p}}`;
  return e === 1 ? base : `${base}^{\\concept{violet}{${e}}}`;
}

// Whether a count of rounds on each side puts both at the same place: side A
// covers `p` per round, side B `q`. With `first` set, the place must also be
// the first one both reach.
export function meets(
  rounds: { a: number; b: number },
  params: { p: number; q: number; first: boolean },
): boolean {
  const { a, b } = rounds;
  const { p, q, first } = params;
  if (a < ROUND_RANGE.min || b < ROUND_RANGE.min) return false;
  if (p * a !== q * b) return false;
  return !first || p * a === lcm(p, q);
}

function meetParams(params: Record<string, number>) {
  return { p: params.p ?? 0, q: params.q ?? 0, first: params.first === 1 };
}

// Validator of the "two things that repeat" exercise. The screen reports
// { a, b } (rounds counted on each side); params are the length of one round
// p and q, and `first` (1 = the first place they meet).
const meetValidator: ManipulateValidator = (state, params) => {
  const { a, b } = state;
  const { p, q } = meetParams(params);
  if (a === undefined || b === undefined || p < 1 || q < 1) return false;
  return meets({ a, b }, meetParams(params));
};

// The first place both sides reach, which every validator setting accepts.
const solveMeet: ManipulateSolver = (params) => {
  const { p, q } = meetParams(params);
  const place = lcm(p, q);
  return { a: place / p, b: place / q };
};

export const validators = { "gap-nhau": meetValidator } as const;
export const solutions = { "gap-nhau": solveMeet } as const;
