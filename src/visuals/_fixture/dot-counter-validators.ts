import type { VisualState } from "@/visuals/registry";

export function countEquals(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return state.count !== undefined && state.count === params.count;
}
