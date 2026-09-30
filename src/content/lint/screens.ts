import { type Finding, findingCollector, type LintInput } from "./types";

// Each entry of a section's `blocks` is one screen. A rule sentence is shown
// with its labelled example, so a note or formula alone on a screen belongs
// in a group with the other half.

export function lintScreens(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "screens");
  input.lesson.sections.forEach((section, i) => {
    section.blocks.forEach((block, j) => {
      if (block.type !== "note" && block.type !== "formula") return;
      report(
        ["sections", i, "blocks", j],
        `Screen with only a ${block.type}; put the rule sentence (note) and its labelled example (formula or visual) in one group`,
        "warning",
      );
    });
  });
  return findings;
}
