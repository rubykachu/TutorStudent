// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  OVERVIEW_GOALS_LEAD,
  overviewParts,
  overviewSentences,
  overviewWordCount,
} from "@/content/overview";
import type { LessonOverview } from "@/schema/content";

const OVERVIEW: LessonOverview = {
  hook: { text: "Mẹ mua hai túi kẹo. Có bao nhiêu cái?" },
  summary: "Bài này nói về phép nhân.",
  goals: ["biết phép nhân", "tính nhanh"],
  whyItMatters: "Phép nhân giúp bạn đếm nhanh.",
};

describe("overviewParts", () => {
  it("reads hook, summary, the goals with their lead-in, then why", () => {
    const parts = overviewParts(OVERVIEW);
    expect(parts.map((p) => [p.key, p.item, p.text])).toEqual([
      ["hook", 0, "Mẹ mua hai túi kẹo. Có bao nhiêu cái?"],
      ["summary", 0, "Bài này nói về phép nhân."],
      ["goalsLead", 0, OVERVIEW_GOALS_LEAD],
      ["goal", 0, "biết phép nhân"],
      ["goal", 1, "tính nhanh"],
      ["why", 0, "Phép nhân giúp bạn đếm nhanh."],
    ]);
  });

  it("numbers sentences and words across the whole overview", () => {
    const parts = overviewParts(OVERVIEW);
    const all = overviewSentences(parts);
    expect(all.map((s) => s.text).slice(0, 3)).toEqual([
      "Mẹ mua hai túi kẹo.",
      "Có bao nhiêu cái?",
      "Bài này nói về phép nhân.",
    ]);
    expect(all.map((s) => s.index)).toEqual(all.map((_, i) => i));
    expect(all[1]).toMatchObject({
      words: ["Có", "bao", "nhiêu", "cái?"],
      firstWord: 5,
    });
    const last = all.at(-1);
    expect(overviewWordCount(parts)).toBe(
      (last?.firstWord ?? 0) + (last?.words.length ?? 0),
    );
  });
});
