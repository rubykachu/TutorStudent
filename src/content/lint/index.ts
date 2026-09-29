import { lintCheckExpr } from "./check-expr";
import { lintGlossary } from "./glossary";
import { lintLength } from "./length";
import { lintNfc } from "./nfc";
import { lintNumbers } from "./numbers";
import { lintPassage } from "./passage";
import { lintReviewHash } from "./review-hash";
import { lintSymbols } from "./symbols";
import { type Finding, findingCollector, type LintInput } from "./types";
import { lintVietnamese } from "./vietnamese";
import { collectStrings } from "./walk";

// Automated wording, notation and answer checks of one parsed lesson.

export function lintLesson(input: LintInput): Finding[] {
  const strings = collectStrings(input.lesson);
  const fields = findingCollector(input.file, "fields");
  for (const { path } of strings.unclassified) {
    fields.report(
      path,
      "String field unknown to the content lint; classify it in src/content/lint/walk.ts",
    );
  }
  return [
    ...fields.findings,
    ...lintNfc(input, strings),
    ...lintSymbols(input, strings),
    ...lintNumbers(input, strings),
    ...lintGlossary(input, strings),
    ...lintVietnamese(input, strings),
    ...lintLength(input, strings),
    ...lintCheckExpr(input),
    ...lintPassage(input),
    ...lintReviewHash(input),
  ];
}
