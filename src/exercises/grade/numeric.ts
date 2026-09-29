import type { NumericInput } from "@/exercises/input";
import type { NumericExercise } from "@/schema/content";
import { parseNumber } from "./normalize";
import { fromWrongTargets, type GradeResult } from "./result";

// Power answers are compared part by part so the hint can light up only the
// slot the child got wrong (base vs exponent).
export function gradeNumeric(
  ex: NumericExercise,
  input: NumericInput,
): GradeResult {
  const { answer } = ex;
  if (answer.kind === "power") {
    if (input.kind !== "power") return fromWrongTargets(["base", "exponent"]);
    const parts = { base: input.base, exponent: input.exponent };
    return fromWrongTargets(
      (["base", "exponent"] as const).filter(
        (part) => parseNumber(parts[part]) !== answer[part],
      ),
    );
  }
  const correct =
    input.kind === "value" && parseNumber(input.value) === answer.value;
  return fromWrongTargets(correct ? [] : ["value"]);
}
