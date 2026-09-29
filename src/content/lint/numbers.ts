import { NUMBER_EXEMPT_PREFIXES, THOUSANDS_MIN_DIGITS } from "./config";
import { nfc } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// Number formatting of Vietnamese textbooks: thousands grouped by a narrow
// no-break space (U+202F; "\," in TeX) and a decimal comma. Years, pages and
// exercise numbers keep their plain form.

const N = THOUSANDS_MIN_DIGITS;
const NARROW_SPACE = " ";

const escaped = NUMBER_EXEMPT_PREFIXES.map((p) =>
  p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
);
const EXEMPT_BEFORE = new RegExp(
  `(?:^|[^\\p{L}])(?:${escaped.join("|")})\\s*$`,
  "iu",
);

// Digits that are part of a larger number on the left are not a number start.
const UNGROUPED = new RegExp(`(?<![\\d${NARROW_SPACE},.])\\d{${N},}`, "g");
const WRONG_GROUPING = /(?<![\d,.])\d{1,3}(?:[  .]\d{3})+(?![\d,])/g;
const DECIMAL_DOT = /(?<![\d.])\d+\.\d+(?![\d.])/g;

type Problem = { index: number; message: string };

function textProblems(text: string): Problem[] {
  const problems: Problem[] = [];
  const wrong = [...text.matchAll(WRONG_GROUPING)].filter(
    (m) => m[0].replace(/\D/g, "").length >= N,
  );
  for (const m of wrong) {
    problems.push({
      index: m.index,
      message: `Group thousands with U+202F (narrow no-break space) in "${m[0]}"`,
    });
  }
  for (const m of text.matchAll(UNGROUPED)) {
    problems.push({
      index: m.index,
      message: `Group thousands with U+202F (narrow no-break space) in "${m[0]}"`,
    });
  }
  for (const m of text.matchAll(DECIMAL_DOT)) {
    const insideGrouping = wrong.some(
      (w) => m.index >= w.index && m.index < w.index + w[0].length,
    );
    if (!insideGrouping) {
      problems.push({
        index: m.index,
        message: `Write decimals with a comma in "${m[0]}"`,
      });
    }
  }
  return problems.filter((p) => !EXEMPT_BEFORE.test(text.slice(0, p.index)));
}

// `\htmlId{part}` names are ids, not numbers.
const HTML_ID_NAME = /\\htmlId\{[^}]*\}/g;
const TEX_UNGROUPED = new RegExp(`(?<![\\d,.])\\d{${N},}`, "g");
const TEX_DECIMAL_DOT = /\d\.\d/;

function texProblems(tex: string): string[] {
  const source = tex.replace(HTML_ID_NAME, "");
  const problems = [...source.matchAll(TEX_UNGROUPED)].map(
    (m) => `Group thousands with "\\," in "${m[0]}"`,
  );
  if (TEX_DECIMAL_DOT.test(source)) {
    problems.push('Write decimals with "{,}" in TeX');
  }
  return problems;
}

export function lintNumbers(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "numbers");
  for (const { path, value } of strings.texts) {
    for (const problem of textProblems(nfc(value))) {
      report(path, problem.message);
    }
  }
  for (const { path, value } of strings.formulas) {
    for (const problem of texProblems(value)) report(path, problem);
  }
  return findings;
}
