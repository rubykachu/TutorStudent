import { lintCardExercises } from "./card-exercises";
import { lintCheckExpr } from "./check-expr";
import { lintColorLeak } from "./color-leak";
import { lintExplain } from "./explain";
import { lintGlossary } from "./glossary";
import { lintGuides } from "./guides";
import { lintHintAnswer } from "./hint-answer";
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
import { lintRuleSentence } from "./rule-sentence";
import { lintScreens } from "./screens";
import { lintSymbols } from "./symbols";
import { lintTextbookCopy } from "./textbook-copy";
import { lintTipBlocks } from "./tips";
import {
  type Finding,
  findingCollector,
  isVietnamese,
  type LintInput,
} from "./types";
import { lintVietnamese } from "./vietnamese";
import { collectStrings, type LessonStrings } from "./walk";

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
    ...lintGuides(input),
    ...lintRuleSentence(input),
  ];
}

// Spelling, number format and reading level written for Vietnamese; a subject
// taught in another language skips them.
function lintVietnameseRules(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  if (!isVietnamese(input)) return [];
  return [
    ...lintNumbers(input, strings),
    ...lintVietnamese(input, strings),
    ...lintLength(input, strings),
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
    ...lintGlossary(input, strings),
    ...lintVietnameseRules(input, strings),
    ...lintRecap(input),
    ...lintCardExercises(input),
    ...lintCheckExpr(input),
    ...lintHintAnswer(input),
    ...lintColorLeak(input),
    ...lintTextbookCopy(input, strings),
    ...lintPassage(input),
    ...lintReviewHash(input),
    ...lintOverview(input),
    ...lintExplain(input),
    ...lintTipBlocks(input),
    ...lintAuthoring(input),
  ];
}
