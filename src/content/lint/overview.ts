import {
  MAX_OVERVIEW_SUMMARY_SENTENCES,
  MAX_OVERVIEW_WHY_SENTENCES,
} from "./config";
import { sentences } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";

// Shape of the lesson overview's prose; its wording goes through the same
// text rules as every other child-facing string.
export function lintOverview(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "overview");
  const overview = input.lesson.overview;
  if (!overview) return findings;
  const summary = sentences(overview.summary).length;
  if (summary > MAX_OVERVIEW_SUMMARY_SENTENCES) {
    report(
      ["overview", "summary"],
      `Summary has ${summary} sentences (max ${MAX_OVERVIEW_SUMMARY_SENTENCES})`,
    );
  }
  const why = sentences(overview.whyItMatters).length;
  if (why > MAX_OVERVIEW_WHY_SENTENCES) {
    report(
      ["overview", "whyItMatters"],
      `Says why the lesson matters in ${why} sentences (max ${MAX_OVERVIEW_WHY_SENTENCES})`,
    );
  }
  return findings;
}
