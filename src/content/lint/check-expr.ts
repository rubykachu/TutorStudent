import type { Item } from "@/schema/content";
import { flattenExercises } from "../index";
import { CHECK_EXPR_SUBJECTS } from "./config";
import { evaluateExpr, sameNumber, textValue, texValue } from "./expr";
import { forbiddenOperators } from "./symbols";
import { type Finding, findingCollector, type LintInput } from "./types";

// Recomputes `check.expr` and compares it with the stated answer, so a wrong
// answer key cannot ship. Operator spelling inside expressions is reported by
// the symbols rule, not again here.

function itemValue(item: Item): number | undefined {
  if (item.content.type === "text") return textValue(item.content.text);
  if (item.content.type === "formula") return texValue(item.content.tex);
  return undefined;
}

function format(value: number): string {
  return String(Number(value.toPrecision(12))).replace(".", ",");
}

export function lintCheckExpr(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "check-expr");
  const required = (CHECK_EXPR_SUBJECTS as readonly string[]).includes(
    input.lesson.subject,
  );

  for (const { exercise, path } of flattenExercises(input.lesson)) {
    if (exercise.type !== "numeric" && exercise.type !== "choice") continue;
    if (exercise.check === undefined) {
      if (required && exercise.type === "numeric") {
        report(path, "Numeric exercises of this subject need check.expr");
      }
      continue;
    }
    const exprPath = [...path, "check", "expr"];
    if (forbiddenOperators(exercise.check.expr).length > 0) continue;
    const result = evaluateExpr(exercise.check.expr);
    if (!result.ok) {
      report(exprPath, `Cannot evaluate check.expr: ${result.error}`);
      continue;
    }
    const expected = result.value;

    if (exercise.type === "numeric") {
      const answer =
        exercise.answer.kind === "value"
          ? exercise.answer.value
          : exercise.answer.base ** exercise.answer.exponent;
      if (!sameNumber(answer, expected)) {
        report(
          [...path, "answer"],
          `Answer is ${format(answer)} but check.expr gives ${format(expected)}`,
        );
      }
      continue;
    }

    // A choice is right when exactly the answer options show the value.
    const answers = new Set(exercise.answer);
    exercise.options.forEach((option, i) => {
      const value = itemValue(option);
      const optionPath = [...path, "options", i];
      if (value === undefined) {
        if (answers.has(option.id)) {
          report(optionPath, "Answer option has no computable value to verify");
        }
        return;
      }
      const matches = sameNumber(value, expected);
      if (matches && !answers.has(option.id)) {
        report(
          optionPath,
          `Option equals check.expr (${format(expected)}) but is not an answer`,
        );
      }
      if (!matches && answers.has(option.id)) {
        report(
          optionPath,
          `Answer option is ${format(value)} but check.expr gives ${format(expected)}`,
        );
      }
    });
  }
  return findings;
}
