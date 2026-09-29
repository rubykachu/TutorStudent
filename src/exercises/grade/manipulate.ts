import type { ManipulateInput } from "@/exercises/input";
import type { ManipulateExercise } from "@/schema/content";
import { findVisual } from "@/visuals/registry";
import type { GradeResult } from "./result";

// The visual is the whole answer area, so there is no smaller part to point at.
export function gradeManipulate(
  ex: ManipulateExercise,
  input: ManipulateInput,
): GradeResult {
  const validate = findVisual(ex.visualId)?.validators?.[ex.validatorId];
  // `content:check` guarantees the validator exists for published content.
  if (!validate) {
    throw new Error(
      `Visual "${ex.visualId}" has no validator "${ex.validatorId}"`,
    );
  }
  return { correct: validate(input.state, ex.params), wrongTargets: [] };
}
