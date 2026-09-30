import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Validators of the multiplication `manipulate` exercises. The dot-grid
// screen reports its state as { rows, cols }.

// The grid has exactly the asked rows and columns of dots.
const gridMatches: ManipulateValidator = (state, params) =>
  params.rows !== undefined &&
  params.cols !== undefined &&
  state.rows === params.rows &&
  state.cols === params.cols;

const solveGrid: ManipulateSolver = (params) => ({
  rows: params.rows ?? 1,
  cols: params.cols ?? 1,
});

export const validators = { luoi: gridMatches } as const;
export const solutions = { luoi: solveGrid } as const;
