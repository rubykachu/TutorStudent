import type { GlossaryFile, Lesson } from "@/schema/content";
import type { Issue, IssuePath } from "../check";

export type LintRule =
  | "fields"
  | "nfc"
  | "symbols"
  | "numbers"
  | "glossary"
  | "vietnamese"
  | "length"
  | "check-expr"
  | "passage"
  | "review-hash";

export type Finding = Issue & { rule: LintRule };

export type LintInput = {
  file: string;
  lesson: Lesson;
  // Glossary of the lesson's subject; absent when the subject has none.
  glossary?: GlossaryFile;
  // Content of `source-passage.txt` next to lesson.json, when present.
  sourcePassage?: string;
};

export type LintReporter = (
  path: IssuePath,
  message: string,
  severity?: Issue["severity"],
) => void;

// Collects findings of one rule family with the lint input's file attached.
export function findingCollector(
  file: string,
  rule: LintRule,
): { findings: Finding[]; report: LintReporter } {
  const findings: Finding[] = [];
  const report: LintReporter = (path, message, severity = "error") => {
    findings.push({ severity, file, path, message, rule });
  };
  return { findings, report };
}
