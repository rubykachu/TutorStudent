import type { Block } from "@/schema/content";
import { flattenExercises, indexLesson, practiceExerciseIds } from "../index";
import { type Finding, findingCollector, type LintInput } from "./types";

// Review sessions skip the exercise just practised when the card has another,
// so the review bank should not ask the practice question again with the
// same numbers. Heuristic: two prompts with the same set of numbers.

const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUPERSCRIPT_RUN = new RegExp(`[${SUPERSCRIPTS}]+`, "g");
// Thousands separators inside a number: U+202F in text, "\," in TeX.
const GROUPING = /(?<=\d)(?:\u202f|\\,)(?=\d{3})/g;
// `\htmlId{name}` and `\concept{colour}` names are not numbers.
const TEX_NAMES = /\\(?:htmlId|concept)\{[^}]*\}/g;
const NUMBER = /\d+(?:[.,]\d+)?/g;

function numbersIn(source: string): string[] {
  const plain = source
    .replace(TEX_NAMES, "")
    .replace(GROUPING, "")
    // "2⁵" is the numbers 2 and 5, not 25.
    .replace(
      SUPERSCRIPT_RUN,
      (run) => ` ${[...run].map((c) => SUPERSCRIPTS.indexOf(c)).join("")}`,
    );
  return plain.match(NUMBER) ?? [];
}

function promptNumbers(prompt: readonly Block[]): Set<string> {
  return new Set(
    prompt.flatMap((block) => {
      if (block.type === "note") return numbersIn(block.text);
      if (block.type === "formula") return numbersIn(block.tex);
      return [];
    }),
  );
}

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  return a.size === b.size && [...a].every((item) => b.has(item));
}

export function lintReviewBank(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "review-bank");
  const { lesson } = input;
  const index = indexLesson(lesson);
  const practiced = practiceExerciseIds(lesson);
  const entries = new Map(
    flattenExercises(lesson).map((entry) => [entry.exercise.id, entry]),
  );
  for (const card of lesson.cards) {
    const ids = index.exerciseIdsByCard.get(card.id) ?? [];
    const practice = ids.filter((id) => practiced.has(id));
    for (const bankId of ids.filter((id) => !practiced.has(id))) {
      const bank = entries.get(bankId);
      if (!bank) continue;
      const bankNumbers = promptNumbers(bank.exercise.prompt);
      if (bankNumbers.size === 0) continue;
      for (const practiceId of practice) {
        const numbers = promptNumbers(
          entries.get(practiceId)?.exercise.prompt ?? [],
        );
        if (!sameSet(bankNumbers, numbers)) continue;
        report(
          [...bank.path, "prompt"],
          `Review exercise uses the same numbers (${[...bankNumbers].join(", ")}) as practice exercise "${practiceId}" of card "${card.id}"; change the numbers`,
          "warning",
        );
      }
    }
  }
  return findings;
}
