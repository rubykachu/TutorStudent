import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Validators and solvers of the interactive pictures of this lesson. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG = "chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc";

// The floor is covered when the tiles go `perRow` to a row in `rows` rows:
// state { perRow, rows }, params { perRow, rows }.
const laidOut: ManipulateValidator = (state, params) =>
  params.perRow !== undefined &&
  params.rows !== undefined &&
  state.perRow === params.perRow &&
  state.rows === params.rows;

const solveLaidOut: ManipulateSolver = (params) => ({
  perRow: params.perRow ?? 0,
  rows: params.rows ?? 0,
});

export const validators = { "xep-gach": laidOut } as const;
export const solutions = { "xep-gach": solveLaidOut } as const;
