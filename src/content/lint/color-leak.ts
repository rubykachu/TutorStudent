import { conceptColorsInTex } from "@/lib/tex";
import type { Item } from "@/schema/content";
import { flattenExercises } from "../index";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// Concept colours help a child read a formula, but in a choice they must not
// tell the right options apart: when every right option is painted one way
// and every other option another way, the colours alone give the answer.

// Concept colours an option paints, e.g. "blue,violet"; "" for none.
function colourSignature(item: Item): string {
  const tex =
    item.content.type === "formula"
      ? item.content.tex
      : item.content.type === "text"
        ? item.content.text
        : "";
  return [...new Set(conceptColorsInTex(tex))].sort().join(",");
}

export function lintColorLeak(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "color-leak");
  for (const { exercise, path } of flattenExercises(input.lesson)) {
    if (exercise.type !== "choice") continue;
    const answers = new Set(exercise.answer);
    const right = new Set<string>();
    const wrong = new Set<string>();
    for (const option of exercise.options) {
      (answers.has(option.id) ? right : wrong).add(colourSignature(option));
    }
    if (wrong.size === 0) continue;
    if ([...right].some((signature) => wrong.has(signature))) continue;
    report(
      [...path, "options"],
      `Concept colours tell the right options (${[...right].map((s) => s || "no colour").join(" / ")}) from the others (${[...wrong].map((s) => s || "no colour").join(" / ")}); paint every option the same way or not at all${learned("LL-03")}`,
    );
  }
  return findings;
}
