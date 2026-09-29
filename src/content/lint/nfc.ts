import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// Decomposed Vietnamese renders the same but compares differently (grading,
// glossary, search), so stored strings must already be NFC.

export function lintNfc(input: LintInput, strings: LessonStrings): Finding[] {
  const { findings, report } = findingCollector(input.file, "nfc");
  for (const { path, value } of strings.all) {
    if (value !== value.normalize("NFC")) {
      report(path, "Text is not Unicode NFC; re-save it composed");
    }
  }
  return findings;
}
