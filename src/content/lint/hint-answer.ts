import { flattenExercises } from "../index";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// The first hint level lights up where to look, never the answer itself:
// lighting a right option, region or passage sentence hands the child the
// answer before they have thought about it.

export function lintHintAnswer(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "hint-answer");
  for (const { exercise, path } of flattenExercises(input.lesson)) {
    let answers: ReadonlySet<string>;
    let target: "option" | "part";
    if (exercise.type === "choice" || exercise.type === "tapRegion") {
      answers = new Set(exercise.answer);
      target = "option";
    } else if (exercise.type === "tapText") {
      answers = new Set(exercise.answer);
      target = "part";
    } else {
      continue;
    }
    exercise.hints.highlight.forEach((ref, i) => {
      if (ref.target !== target || !answers.has(ref.id)) return;
      report(
        [...path, "hints", "highlight", i],
        `First hint lights up the answer "${ref.id}"; light up the part of the prompt that leads to it instead${learned("LL-02")}`,
      );
    });
  }
  return findings;
}
