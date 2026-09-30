import { MAX_RECAP_SENTENCES } from "./config";
import { sentences } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";

// Recaps of sections and cards: one short statement to remember, so the
// caption above the example stays within a sentence limit.

function recaps(input: LintInput) {
  return [
    ...input.lesson.sections.map((s, i) => ({
      recap: s.recap,
      path: ["sections", i, "recap", "caption"],
    })),
    ...input.lesson.cards.map((c, i) => ({
      recap: c.recap,
      path: ["cards", i, "recap", "caption"],
    })),
  ];
}

export function lintRecap(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "recap");
  for (const { recap, path } of recaps(input)) {
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

// A recap is one labelled example (a visual) with the sentence to remember
// as its caption, which the recap screen shows as body text above the
// picture. A bare formula carries no sentence.
export function lintRecapForm(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "recap");
  for (const { recap, path } of recaps(input)) {
    if (recap.type === "visual" && recap.caption?.trim()) continue;
    report(
      path.slice(0, -1),
      "Recap needs a visual with the sentence to remember in its caption",
    );
  }
  return findings;
}
