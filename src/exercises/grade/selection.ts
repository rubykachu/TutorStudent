import type { GradeResult } from "./result";

// Shared by choice (options), tapText (sentences) and tapRegion (regions):
// the chosen set must equal the answer set. Only wrongly chosen ids are
// pointed at; marking a missed one would give the answer away at the first
// hint.
export function gradeSelection(
  answer: readonly string[],
  selected: readonly string[],
): GradeResult {
  const expected = new Set(answer);
  const chosen = new Set(selected);
  const wrongTargets = [...chosen].filter((id) => !expected.has(id));
  const complete = answer.every((id) => chosen.has(id));
  return { correct: complete && wrongTargets.length === 0, wrongTargets };
}
