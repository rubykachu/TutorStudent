import { MAX_NOTE_SENTENCES, MAX_SENTENCE_SYLLABLES } from "./config";
import { sentences, syllableCount } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// Short sentences for grade-6 readers. Formulas live in their own blocks, so
// text fields hold only words and plain numbers.

export function lintLength(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "length");
  for (const { path, value } of strings.texts) {
    for (const sentence of sentences(value)) {
      const count = syllableCount(sentence);
      if (count > MAX_SENTENCE_SYLLABLES) {
        report(
          path,
          `Sentence has ${count} syllables (max ${MAX_SENTENCE_SYLLABLES}): "${sentence}"`,
        );
      }
    }
  }
  for (const { path, value } of strings.notes) {
    const count = sentences(value).length;
    if (count > MAX_NOTE_SENTENCES) {
      report(
        path,
        `Note has ${count} sentences (max ${MAX_NOTE_SENTENCES}); split it or move detail into a visual`,
      );
    }
  }
  return findings;
}
