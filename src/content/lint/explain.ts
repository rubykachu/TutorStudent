import { flattenExercises } from "../index";
import { MAX_EXPLAIN_SENTENCES } from "./config";
import { sentences } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";

// The explanation an exercise shows after the child answers (`explain`).
// Its wording goes through the same text rules as every other child-facing
// string. Shape: at most MAX_EXPLAIN_SENTENCES sentences in `text` (and in
// each `wrong` reason), because it sits next to the "Tiếp" button; `wrong`
// names options of the same `choice` exercise that are not answers.
//
// Every gradable exercise needs one (top-level, review-bank and practice
// exercises, and the steps of an openEnded exercise; the framed writing task
// itself has no single answer to explain). Who must give one comes from
// content/legacy-lessons.json (`LintInput.legacy`): a lesson not listed
// (every new lesson) fails per exercise; a "warn" lesson gets one warning
// counting the exercises still without; an "exempt" lesson and the fixture
// are not asked.
export function lintExplain(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "explain");
  const missing: string[] = [];
  let total = 0;
  for (const { exercise, path } of flattenExercises(input.lesson)) {
    if (exercise.type === "openEnded") continue;
    total++;
    const { explain } = exercise;
    if (explain === undefined) {
      missing.push(exercise.id);
      if (input.legacy === undefined && !input.fixture) {
        report(
          [...path, "explain"],
          "Exercise has no explain; say in one to three sentences why the answer is right",
        );
      }
      continue;
    }
    const long = (text: string) =>
      sentences(text).length > MAX_EXPLAIN_SENTENCES;
    if (long(explain.text)) {
      report(
        [...path, "explain", "text"],
        `Explanation has ${sentences(explain.text).length} sentences (max ${MAX_EXPLAIN_SENTENCES}); keep the reasoning short and move detail into explain.tex or a visual`,
      );
    }
    explain.wrong?.forEach((reason, i) => {
      const at = [...path, "explain", "wrong", i];
      if (exercise.type !== "choice") {
        report(at, "`wrong` reasons belong to choice exercises only");
        return;
      }
      const option = exercise.options.find((o) => o.id === reason.optionId);
      if (!option) {
        report([...at, "optionId"], `Unknown option "${reason.optionId}"`);
      } else if (exercise.answer.includes(option.id)) {
        report(
          [...at, "optionId"],
          `Option "${option.id}" is an answer; \`wrong\` explains options that are not`,
        );
      }
      if (long(reason.text)) {
        report(
          [...at, "text"],
          `Reason has more than ${MAX_EXPLAIN_SENTENCES} sentences; one short sentence is enough`,
        );
      }
    });
  }
  if (input.legacy === "warn" && missing.length > 0) {
    report(
      ["exercises"],
      `${missing.length} of ${total} exercises have no explain yet (first: ${missing.slice(0, 3).join(", ")}); write them, then delete this lesson from content/legacy-lessons.json`,
      "warning",
    );
  }
  if (input.legacy === "warn" && missing.length === 0 && total > 0) {
    report(
      ["exercises"],
      "Every exercise has an explanation; delete this lesson from content/legacy-lessons.json so the lint requires them from now on",
      "warning",
    );
  }
  return findings;
}
