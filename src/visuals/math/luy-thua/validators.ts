import type { VisualState } from "@/visuals/registry";

// Validators of the lesson's interactive visuals. Visuals that let the child
// build a power report it as { base, exponent }; the multiply and divide
// builders report their two exponents as { m, n }.

// Ranges the builders offer; solvers stay inside them.
export const BUILDER_BASE = { min: 1, max: 10 } as const;
export const BUILDER_EXPONENT = { min: 1, max: 6 } as const;
export const MULTIPLY_EXPONENT = { min: 1, max: 5 } as const;
export const DIVIDE_EXPONENT = { min: 1, max: 6 } as const;

export function powerIs(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return (
    params.base !== undefined &&
    params.exponent !== undefined &&
    state.base === params.base &&
    state.exponent === params.exponent
  );
}

export function solvePowerIs(params: Record<string, number>): VisualState {
  return { base: params.base ?? 1, exponent: params.exponent ?? 1 };
}

// aᵐ · aⁿ with m + n equal to `total`: any split counts.
export function exponentSum(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const { m, n } = state;
  return (
    m !== undefined &&
    n !== undefined &&
    params.total !== undefined &&
    m + n === params.total
  );
}

export function solveExponentSum(params: Record<string, number>): VisualState {
  const total = params.total ?? 2;
  const m = Math.max(MULTIPLY_EXPONENT.min, Math.floor(total / 2));
  return { m, n: total - m };
}

// aᵐ : aⁿ with m − n equal to `rest`: any pair with m ≥ n counts.
export function exponentDifference(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const { m, n } = state;
  return (
    m !== undefined &&
    n !== undefined &&
    params.rest !== undefined &&
    m >= n &&
    m - n === params.rest
  );
}

export function solveExponentDifference(
  params: Record<string, number>,
): VisualState {
  const rest = params.rest ?? 0;
  const m = Math.min(DIVIDE_EXPONENT.max, rest + 2);
  return { m, n: m - rest };
}
