import type { VisualState } from "@/visuals/registry";

// The chessboard story: square 1 holds one grain and every next square holds
// twice as many as the one before, so square n holds 2^(n-1) grains.

export const BOARD_SIZE = 8;
export const SQUARE_COUNT = BOARD_SIZE * BOARD_SIZE;

// Exact even for the last square (2^63), which a JS number cannot print.
export function grainsOn(square: number): bigint {
  return BigInt(2) ** BigInt(square - 1);
}

// Number of factors 2 in the product that gives the grains of a square.
export function factorsOn(square: number): number {
  return square - 1;
}

// State reported while the child walks the board. `grains` is only reported
// while it is a safe integer; later squares report the square alone.
export function boardState(square: number): VisualState {
  const grains = grainsOn(square);
  return grains <= BigInt(Number.MAX_SAFE_INTEGER)
    ? { square, grains: Number(grains) }
    : { square };
}

export function grainsEqual(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const { square } = state;
  const { grains } = params;
  return (
    isWhole(square) && isWhole(grains) && grainsOn(square) === BigInt(grains)
  );
}

function isWhole(value: number | undefined): value is number {
  return Number.isInteger(value);
}

export function solveGrainsEqual(params: Record<string, number>): VisualState {
  const grains = params.grains ?? 1;
  return boardState(Math.round(Math.log2(grains)) + 1);
}
