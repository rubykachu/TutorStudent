import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";
import { type ConstructShape, solvedState } from "./construction";

// Validators and solvers of the interactive pictures of this lesson. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG = "hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu";

// A board is drawn right when every step has the value of the finished
// figure of the wanted side (params { side }).
export function isConstructed(
  shape: ConstructShape,
  diagonals: boolean,
): ManipulateValidator {
  return (state, params) =>
    params.side !== undefined &&
    Object.entries(solvedState(shape, params.side, diagonals)).every(
      ([key, want]) => state[key] === want,
    );
}

function solveConstructed(
  shape: ConstructShape,
  diagonals: boolean,
): ManipulateSolver {
  return (params) => solvedState(shape, params.side ?? 0, diagonals);
}

// The triangles of the hexagon put together: state { n }, params { n }.
export const ghepLucGiac: ManipulateValidator = (state, params) =>
  params.n !== undefined && state.n === params.n;

export const solveGhepLucGiac: ManipulateSolver = (params) => ({
  n: params.n ?? 0,
});

export const validators = {
  "ve-tam-giac-deu": isConstructed("triangle", false),
  "ve-hinh-vuong": isConstructed("square", false),
  "ve-hinh-vuong-cheo": isConstructed("square", true),
  "ghep-luc-giac": ghepLucGiac,
} as const;

export const solutions = {
  "ve-tam-giac-deu": solveConstructed("triangle", false),
  "ve-hinh-vuong": solveConstructed("square", false),
  "ve-hinh-vuong-cheo": solveConstructed("square", true),
  "ghep-luc-giac": solveGhepLucGiac,
} as const;
