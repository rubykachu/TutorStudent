import type { GlossaryFile, GuidedInteraction, Lesson } from "@/schema/content";
import type { Issue, IssuePath } from "../check";

export type LintRule =
  | "fields"
  | "nfc"
  | "symbols"
  | "numbers"
  | "glossary"
  | "vietnamese"
  | "length"
  | "recap"
  | "card-exercises"
  | "check-expr"
  | "passage"
  | "review-hash"
  | "screens"
  | "practice"
  | "review-bank"
  | "placeholder"
  | "overview"
  | "hint-answer"
  | "color-leak"
  | "guides"
  | "rule-sentence"
  | "textbook-copy";

export type Finding = Issue & { rule: LintRule };

export type LintInput = {
  file: string;
  lesson: Lesson;
  // Test-only lesson under content/_fixture/; the authoring rules skip it.
  fixture: boolean;
  // Glossary of the lesson's subject; absent when the subject has none.
  glossary?: GlossaryFile;
  // Content of `source-passage.txt` next to lesson.json, when present.
  sourcePassage?: string;
  // Text layers (`p<page>.txt`) of the lesson's textbook pages under
  // sources/<subject>/<lesson>/, when present.
  sourceText?: string;
  // Interactions already taught by guide screens of lessons that come
  // earlier in the app (subject order of subjects.json, then `order`).
  priorGuides?: ReadonlySet<GuidedInteraction>;
};

// Pointer from a finding to the lessons-learned entry that explains the
// recurring error behind the rule (docs/lessons-learned/<id>-*.md).
export function learned(id: string): string {
  return ` (lessons-learned ${id})`;
}

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
