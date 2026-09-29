import type { MatchInput } from "@/exercises/input";
import type { MatchExercise } from "@/schema/content";
import { fromWrongTargets, type GradeResult, ownValue } from "./result";

// A wrong pair points at its left item and at the right item the child chose,
// never at the right item it should have been.
export function gradeMatch(ex: MatchExercise, input: MatchInput): GradeResult {
  const wrong = new Set<string>();
  for (const pair of ex.pairs) {
    const chosen = ownValue(input.pairs, pair.left);
    if (chosen === pair.right) continue;
    wrong.add(pair.left);
    if (chosen !== undefined) wrong.add(chosen);
  }
  return fromWrongTargets([...wrong]);
}
