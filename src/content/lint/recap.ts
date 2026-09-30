import { MAX_RECAP_SENTENCES } from "./config";
import { sentences } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";

// Recaps of sections and cards: one short statement to remember, so the
// caption above the example stays within a sentence limit.

export function lintRecap(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "recap");
  const recaps = [
    ...input.lesson.sections.map((s, i) => ({
      recap: s.recap,
      path: ["sections", i, "recap", "caption"],
    })),
    ...input.lesson.cards.map((c, i) => ({
      recap: c.recap,
      path: ["cards", i, "recap", "caption"],
    })),
  ];
  for (const { recap, path } of recaps) {
    if (recap.type !== "visual" || recap.caption === undefined) continue;
    const count = sentences(recap.caption).length;
    if (count > MAX_RECAP_SENTENCES) {
      report(
        path,
        `Recap caption has ${count} sentences (max ${MAX_RECAP_SENTENCES}); keep the one statement to remember and leave detail to the rule screen`,
      );
    }
  }
  return findings;
}
