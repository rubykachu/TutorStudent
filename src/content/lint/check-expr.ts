import type { ChoiceExercise, Item } from "@/schema/content";
import { flattenExercises } from "../index";
import { CHECK_EXPR_SUBJECTS } from "./config";
import { comparisonValue, evaluateExpr, itemValue, sameNumber } from "./expr";
import { forbiddenOperators } from "./symbols";
import {
  type Finding,
  findingCollector,
  type LintInput,
  type LintReporter,
  learned,
} from "./types";

// Recomputes `check` and compares it with the stated answer, so a wrong
// answer key, or a distractor that is also right, cannot ship. Operator
// spelling inside expressions is reported by the symbols rule, not again here.

const TWO_CORRECT = learned("LL-01");

function format(value: number): string {
  return String(Number(value.toPrecision(12))).replace(".", ",");
}

// Whether each option is right under the exercise's check, or a message
// when the check cannot run; `undefined` entries are options without a value.
type Verdicts = (boolean | undefined)[] | string;

function choiceVerdicts(exercise: ChoiceExercise): Verdicts {
  const check = exercise.check;
  if (!check) return "no check";
  const relation = check.relation ?? "equal";
  if (relation === "holds" || relation === "fails") {
    return exercise.options.map((option) => {
      const truth = comparisonValue(option);
      return truth === undefined ? undefined : truth === (relation === "holds");
    });
  }
  const values = exercise.options.map(itemValue);
  if (relation === "max" || relation === "min") {
    const known = values.filter((v): v is number => v !== undefined);
    if (known.length === 0) return "no option has a computable value";
    const best = relation === "max" ? Math.max(...known) : Math.min(...known);
    return values.map((v) =>
      v === undefined ? undefined : sameNumber(v, best),
    );
  }
  const result = evaluateExpr(check.expr ?? "");
  if (!result.ok) return `Cannot evaluate check.expr: ${result.error}`;
  const expected = result.value;
  return values.map((v) =>
    v === undefined
      ? undefined
      : sameNumber(v, expected) === (relation === "equal"),
  );
}

function describe(option: Item, exercise: ChoiceExercise): string {
  const relation = exercise.check?.relation ?? "equal";
  if (relation === "holds" || relation === "fails") {
    return comparisonValue(option) ? "is true" : "is false";
  }
  const value = itemValue(option);
  return value === undefined ? "has no value" : `is ${format(value)}`;
}

function lintChoice(
  exercise: ChoiceExercise,
  path: (string | number)[],
  report: LintReporter,
): void {
  const verdicts = choiceVerdicts(exercise);
  if (typeof verdicts === "string") {
    report([...path, "check"], verdicts);
    return;
  }
  const relation = exercise.check?.relation ?? "equal";
  const answers = new Set(exercise.answer);
  exercise.options.forEach((option, i) => {
    const optionPath = [...path, "options", i];
    const right = verdicts[i];
    if (right === undefined) {
      if (answers.has(option.id)) {
        report(optionPath, "Answer option has no computable value to verify");
      }
      return;
    }
    if (right && !answers.has(option.id)) {
      report(
        optionPath,
        `Option ${describe(option, exercise)} and so also satisfies check (${relation}${
          exercise.check?.expr ? ` ${exercise.check.expr}` : ""
        }) but is not an answer${TWO_CORRECT}`,
      );
    }
    if (!right && answers.has(option.id)) {
      report(
        optionPath,
        `Answer option ${describe(option, exercise)}, which does not satisfy check (${relation}${
          exercise.check?.expr ? ` ${exercise.check.expr}` : ""
        })${TWO_CORRECT}`,
      );
    }
  });
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
      // Options that are all comparisons can each be judged true or false,
      // so a second right option is caught only if the check says which.
      if (
        required &&
        exercise.type === "choice" &&
        exercise.options.every((o) => comparisonValue(o) !== undefined)
      ) {
        report(
          path,
          `Every option is a comparison that can be verified; add check { "relation": "holds" } or { "relation": "fails" }${TWO_CORRECT}`,
        );
      }
      continue;
    }
    const { expr } = exercise.check;
    if (expr !== undefined && forbiddenOperators(expr).length > 0) continue;

    if (exercise.type === "choice") {
      lintChoice(exercise, path, report);
      continue;
    }

    if ((exercise.check.relation ?? "equal") !== "equal") {
      report(
        [...path, "check", "relation"],
        "Numeric exercises check with relation equal only",
      );
      continue;
    }
    const result = evaluateExpr(expr ?? "");
    if (!result.ok) {
      report(
        [...path, "check", "expr"],
        `Cannot evaluate check.expr: ${result.error}`,
      );
      continue;
    }
    const answer =
      exercise.answer.kind === "value"
        ? exercise.answer.value
        : exercise.answer.base ** exercise.answer.exponent;
    if (!sameNumber(answer, result.value)) {
      report(
        [...path, "answer"],
        `Answer is ${format(answer)} but check.expr gives ${format(result.value)}`,
      );
    }
  }
  return findings;
}
