import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// Operators as Vietnamese textbooks print them: "·" for multiplication, ":"
// for division. Applies to formulas, check expressions and number–operator–
// number runs in text; words such as "km/h" are left alone.

const FORBIDDEN = [
  { pattern: /\\times(?![a-zA-Z])|×|\*/, use: "·" },
  { pattern: /\\div(?![a-zA-Z])|÷|\//, use: ":" },
] as const;

// `\text{km/h}` is a unit written in words, not an operator.
const TEX_TEXT = /\\(?:text|mathrm)\{[^}]*\}/g;
const TEXT_OPERATOR = /\d\s*[×*÷/]\s*\d/;
// Only full dates: "6/2" alone reads as a fraction.
const DATE = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;

// The replacement operators a formula or expression needs, empty when clean.
export function forbiddenOperators(source: string): string[] {
  return FORBIDDEN.filter(({ pattern }) => pattern.test(source)).map(
    ({ use }) => use,
  );
}

function message(uses: readonly string[]): string {
  return uses
    .map((use) =>
      use === "·"
        ? 'Write multiplication as "·" (\\cdot in TeX)'
        : 'Write division as ":"',
    )
    .join("; ");
}

export function lintSymbols(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "symbols");
  for (const { path, value } of strings.formulas) {
    const uses = forbiddenOperators(value.replace(TEX_TEXT, ""));
    if (uses.length > 0) report(path, message(uses));
  }
  for (const { path, value } of strings.exprs) {
    const uses = forbiddenOperators(value);
    if (uses.length > 0) report(path, message(uses));
  }
  for (const { path, value } of strings.texts) {
    const match = value.replace(DATE, "").match(TEXT_OPERATOR);
    if (match) report(path, message(forbiddenOperators(match[0])));
  }
  return findings;
}
