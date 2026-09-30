import { lintCardExercises } from "./card-exercises";
import { lintCheckExpr } from "./check-expr";
import { lintGlossary } from "./glossary";
import { lintLength } from "./length";
import { lintNfc } from "./nfc";
import { lintNumbers } from "./numbers";
import { lintOverview } from "./overview";
import { lintPassage } from "./passage";
import { lintPlaceholder } from "./placeholder";
import { lintPractice } from "./practice";
import { lintRecap, lintRecapForm } from "./recap";
import { lintReviewBank } from "./review-bank";
import { lintReviewHash } from "./review-hash";
import { lintScreens } from "./screens";
import { lintSymbols } from "./symbols";
import { type Finding, findingCollector, type LintInput } from "./types";
import { lintVietnamese } from "./vietnamese";
import { collectStrings } from "./walk";

// Automated wording, notation and answer checks of one parsed lesson.

// How a lesson is authored for a slow learner (the lesson-author skill's
// rules). The fixture lesson is exempt: it exists to exercise every renderer
// path (formula recaps, single blocks, several practice exercises per card).
function lintAuthoring(input: LintInput): Finding[] {
  if (input.fixture) return [];
  return [
    ...lintScreens(input),
    ...lintPractice(input),
    ...lintRecapForm(input),
    ...lintReviewBank(input),
    ...lintPlaceholder(input),
  ];
}

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
    ...lintRecap(input),
    ...lintCardExercises(input),
    ...lintCheckExpr(input),
    ...lintPassage(input),
    ...lintReviewHash(input),
    ...lintOverview(input),
    ...lintAuthoring(input),
  ];
}
