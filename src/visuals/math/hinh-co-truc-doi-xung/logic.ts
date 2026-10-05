import type {
  ManipulateSolver,
  ManipulateValidator,
  VisualMeta,
} from "@/visuals/registry";
import type { VisualSpec } from "./catalog";
import { INTERACTIVE_KINDS } from "./catalog";
import {
  type EdgeParams,
  isDrawnRight,
  solveEdges,
  stateOfEdges,
} from "./edges";
import { axesState, marksAxes } from "./lines";
import { isMirrored, solvedMirror } from "./mirror-model";

// Validators, solvers and tappable regions of the interactive pictures of this
// lesson. No React, so `content:check` and the tests read it.

export const LESSON_SLUG = "hinh-co-truc-doi-xung";

// Ids of the `manipulate` exercises the pictures serve.
export const VALIDATOR_PICK_AXES = "chon-truc";
export const VALIDATOR_MIRROR = "ve-doi-xung";
export const VALIDATOR_EDGES = "ve-gap-khuc";

const edgeParams = (params: Record<string, number>): EdgeParams => ({
  length: params.length ?? 0,
  axes: params.axes ?? 0,
});

type Checks = {
  validators: Readonly<Record<string, ManipulateValidator>>;
  solutions: Readonly<Record<string, ManipulateSolver>>;
};

function checksOf(spec: VisualSpec): Checks | undefined {
  switch (spec.kind) {
    case "axisPicker":
      return {
        validators: {
          [VALIDATOR_PICK_AXES]: (state) => marksAxes(spec, state),
        },
        solutions: { [VALIDATOR_PICK_AXES]: () => axesState(spec) },
      };
    case "mirror":
      return {
        validators: {
          [VALIDATOR_MIRROR]: (state) => isMirrored(spec.board, state),
        },
        solutions: { [VALIDATOR_MIRROR]: () => solvedMirror(spec.board) },
      };
    case "edges":
      return {
        validators: {
          [VALIDATOR_EDGES]: (state, params) =>
            isDrawnRight(spec.board, state, edgeParams(params)),
        },
        solutions: {
          [VALIDATOR_EDGES]: (params) => {
            const found = solveEdges(spec.board, edgeParams(params));
            return found ? stateOfEdges(spec.board, found) : {};
          },
        },
      };
    default:
      return undefined;
  }
}

// What the registry needs to know about a picture, without React.
export function metaOf(spec: VisualSpec): VisualMeta {
  const checks = checksOf(spec);
  return {
    interactive: INTERACTIVE_KINDS.has(spec.kind),
    ...(spec.kind === "strip" && spec.mode === "tap"
      ? { regions: spec.items.map((item) => item.id) }
      : {}),
    ...(checks ?? {}),
  };
}
