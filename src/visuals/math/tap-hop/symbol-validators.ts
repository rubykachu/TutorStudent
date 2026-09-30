import type { VisualState } from "@/visuals/registry";

// Validators of the symbol visuals that let the child draw a mark or place
// semicolons. Stroke visuals report { n } strokes drawn; the semicolon row
// reports { g0, g1, … }, each 1 when its gap holds a ";".

// Every stroke of the mark is drawn: params.total is its stroke count.
export function strokesDone(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return params.total !== undefined && state.n === params.total;
}

export function solveStrokesDone(params: Record<string, number>): VisualState {
  return { n: params.total ?? 0 };
}

// Every gap among params.gaps holds a ";".
export function gapsFilled(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const gaps = params.gaps;
  if (gaps === undefined) return false;
  return Array.from({ length: gaps }, (_, i) => state[`g${i}`] === 1).every(
    Boolean,
  );
}

export function solveGapsFilled(params: Record<string, number>): VisualState {
  return Object.fromEntries(
    Array.from({ length: params.gaps ?? 0 }, (_, i) => [`g${i}`, 1]),
  );
}
