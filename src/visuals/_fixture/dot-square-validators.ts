import type { VisualState } from "@/visuals/registry";

// The dot board reports how many dots are placed and the size of the smallest
// box around them; a filled n × n square is the only layout with n² dots in an
// n-by-n box.
export function squareOf(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const { n } = params;
  if (n === undefined) return false;
  return state.count === n * n && state.width === n && state.height === n;
}

export function solveSquareOf(params: Record<string, number>): VisualState {
  const n = params.n ?? 0;
  return { count: n * n, width: n, height: n };
}
