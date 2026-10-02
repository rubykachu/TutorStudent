import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";
import { type BoardShape, isDrawn, solvedState } from "./construction";

// Validators and solvers of the interactive pictures of this lesson. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG =
  "hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can";

// A board is drawn right when every step has the value of the finished
// figure for the exercise's params (see `expectedState`).
function drawn(shape: BoardShape): ManipulateValidator {
  return (state, params) => isDrawn(shape, state, params);
}

function solve(shape: BoardShape): ManipulateSolver {
  return (params) => solvedState(shape, params);
}

// The pieces put together: state { n }, params { n }.
const putTogether: ManipulateValidator = (state, params) =>
  params.n !== undefined && state.n === params.n;

const solvePutTogether: ManipulateSolver = (params) => ({ n: params.n ?? 0 });

export const validators = {
  "ve-hinh-chu-nhat": drawn("rectangle"),
  "ve-hinh-thoi": drawn("rhombus"),
  "ve-binh-hanh-hai-canh": drawn("parallelogram"),
  "ve-binh-hanh-duong-cheo": drawn("parallelogram-diagonal"),
  "ghep-hinh": putTogether,
} as const;

export const solutions = {
  "ve-hinh-chu-nhat": solve("rectangle"),
  "ve-hinh-thoi": solve("rhombus"),
  "ve-binh-hanh-hai-canh": solve("parallelogram"),
  "ve-binh-hanh-duong-cheo": solve("parallelogram-diagonal"),
  "ghep-hinh": solvePutTogether,
} as const;

export type ValidatorId = keyof typeof validators;

// The validator of the exercises each board serves.
export const BOARD_VALIDATOR: Readonly<Record<BoardShape, ValidatorId>> = {
  rectangle: "ve-hinh-chu-nhat",
  rhombus: "ve-hinh-thoi",
  parallelogram: "ve-binh-hanh-hai-canh",
  "parallelogram-diagonal": "ve-binh-hanh-duong-cheo",
};
