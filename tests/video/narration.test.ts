// @vitest-environment node
import { describe, expect, it } from "vitest";
import { OVERVIEW_GOALS_LEAD } from "@/content/overview";
import type { LessonOverview } from "@/schema/content";
import {
  NARRATION_VOICE,
  narrationPaths,
  narrationScript,
} from "../../video/lib/narration";
import { VideoScriptSchema } from "../../video/lib/script";

const OVERVIEW: LessonOverview = {
  hook: { text: "Mẹ mua hai túi kẹo. Có bao nhiêu cái?" },
  summary: "Bài này nói về phép nhân.",
  goals: ["biết phép nhân", "tính nhanh"],
  whyItMatters: "Phép nhân giúp bạn đếm nhanh.",
};

describe("narrationScript", () => {
  it("reads the overview part by part, one sentence per line, in screen order", () => {
    const script = narrationScript("Phép nhân", OVERVIEW);
    expect(VideoScriptSchema.parse(script)).toEqual(script);
    expect(script.voice).toBe(NARRATION_VOICE);
    expect(
      script.scenes.map((s) => [s.id, s.sentences.map((x) => x.text)]),
    ).toEqual([
      ["hook-0", ["Mẹ mua hai túi kẹo.", "Có bao nhiêu cái?"]],
      ["summary-0", ["Bài này nói về phép nhân."]],
      ["goals-lead-0", [OVERVIEW_GOALS_LEAD]],
      ["goal-0", ["biết phép nhân"]],
      ["goal-1", ["tính nhanh"]],
      ["why-0", ["Phép nhân giúp bạn đếm nhanh."]],
    ]);
  });

  it("refuses text the voice would misread and the highlight could not map", () => {
    expect(() =>
      narrationScript("Luỹ thừa", { ...OVERVIEW, summary: "Ta có 2³ = 8." }),
    ).toThrow(/say it in words/);
  });
});

describe("narrationPaths", () => {
  it("puts the files under the media base, per lesson", () => {
    expect(narrationPaths("luy-thua")).toEqual({
      audioUrl: "narration/luy-thua/overview.m4a",
      vttUrl: "narration/luy-thua/overview.vtt",
    });
  });
});
