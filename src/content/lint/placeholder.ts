import { collectVisualRefs } from "../check";
import { type Finding, findingCollector, type LintInput } from "./types";

// Visuals of the fixture lesson stand in for a real lesson's own while it is
// drafted (the lesson-author skeleton starts with them). A published lesson
// must not show them.

const PLACEHOLDER_PREFIX = "fixture.";

export function lintPlaceholder(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "placeholder");
  const published = input.lesson.status === "published";
  for (const ref of collectVisualRefs(input.lesson)) {
    if (!ref.visualId.startsWith(PLACEHOLDER_PREFIX)) continue;
    report(
      ref.path,
      `Placeholder visual "${ref.visualId}"; replace it with the lesson's own before publishing`,
      published ? "error" : "warning",
    );
  }
  return findings;
}
