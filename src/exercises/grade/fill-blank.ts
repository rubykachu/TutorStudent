import type { FillBlankInput } from "@/exercises/input";
import type { FillBlankExercise } from "@/schema/content";
import { normalizeText } from "./normalize";
import { fromWrongTargets, type GradeResult, ownValue } from "./result";

export function gradeFillBlank(
  ex: FillBlankExercise,
  input: FillBlankInput,
): GradeResult {
  const wrongTargets: string[] = [];
  for (const segment of ex.segments) {
    if (segment.type !== "blank") continue;
    const typed = normalizeText(ownValue(input.blanks, segment.id) ?? "");
    const accepted =
      typed !== "" && segment.accept.some((a) => normalizeText(a) === typed);
    if (!accepted) wrongTargets.push(segment.id);
  }
  return fromWrongTargets(wrongTargets);
}
