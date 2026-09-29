import type { VisualState } from "@/visuals/registry";

export function countEquals(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return state.count !== undefined && state.count === params.count;
}

export function solveCountEquals(params: Record<string, number>): VisualState {
  return { count: params.count ?? 0 };
}
