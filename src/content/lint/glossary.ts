import { conceptColorsInTex, isConceptColor } from "@/lib/tex";
import type { GlossaryFile } from "@/schema/content";
import type { IssuePath } from "../check";
import { findWordRun, wordKeys } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// One concept, one word, one colour: rejects non-standard synonyms listed in
// the subject glossary, keeps concept colours identical across lessons, and
// lets a formula paint a symbol only in the colour of one of the lesson's
// concepts.

export function lintGlossary(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "glossary");
  const terms = input.glossary?.terms ?? [];

  const forbidden = terms.flatMap((entry) =>
    entry.forbidden.map((word) => ({
      term: entry.term,
      word,
      keys: wordKeys(word),
    })),
  );
  for (const { path, value } of strings.texts) {
    const keys = wordKeys(value);
    for (const entry of forbidden) {
      if (findWordRun(keys, entry.keys) >= 0) {
        report(path, `Use "${entry.term}" instead of "${entry.word}"`);
      }
    }
  }

  const byTerm = new Map(terms.map((t) => [wordKeys(t.term).join(" "), t]));
  input.lesson.concepts.forEach((concept, i) => {
    const entry = byTerm.get(wordKeys(concept.name).join(" "));
    if (entry?.color !== undefined && entry.color !== concept.color) {
      report(
        ["concepts", i, "color"],
        `Concept "${concept.name}" must be ${entry.color}, as in the glossary`,
      );
    }
  });

  const lessonColors = new Set(input.lesson.concepts.map((c) => c.color));
  for (const { path, value } of strings.formulas) {
    for (const color of conceptColorsInTex(value)) {
      if (!isConceptColor(color)) {
        report(path, `"\\concept{${color}}" is not a concept colour`);
      } else if (!lessonColors.has(color)) {
        report(path, `No concept of this lesson is ${color}`);
      }
    }
  }
  return findings;
}

// Consistency of a glossary file itself: a word cannot be both a term and a
// forbidden synonym, or no lesson could use it.
export function checkGlossaryFile(
  glossary: GlossaryFile,
): { path: IssuePath; message: string }[] {
  const problems: { path: IssuePath; message: string }[] = [];
  const termKeys = new Map<string, number>();
  glossary.terms.forEach((entry, i) => {
    const key = wordKeys(entry.term).join(" ");
    if (termKeys.has(key)) {
      problems.push({
        path: ["terms", i, "term"],
        message: `Duplicate term "${entry.term}"`,
      });
    }
    termKeys.set(key, i);
  });
  glossary.terms.forEach((entry, i) => {
    entry.forbidden.forEach((word, j) => {
      if (termKeys.has(wordKeys(word).join(" "))) {
        problems.push({
          path: ["terms", i, "forbidden", j],
          message: `"${word}" is itself a glossary term`,
        });
      }
    });
  });
  return problems;
}
