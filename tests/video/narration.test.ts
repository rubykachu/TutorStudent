// @vitest-environment node
import { describe, expect, it } from "vitest";
import { OVERVIEW_GOALS_LEAD } from "@/content/overview";
import type { LessonOverview } from "@/schema/content";
import {
  narrationPaths,
  narrationScript,
  readWithFallback,
} from "../../video/lib/narration";
import { VideoScriptSchema } from "../../video/lib/script";
import { GeminiQuotaError } from "../../video/tts/gemini-keys";
import { VOICES } from "../../video/voices";

const OVERVIEW: LessonOverview = {
  hook: { text: "Mẹ mua hai túi kẹo. Có bao nhiêu cái?" },
  summary: "Bài này nói về phép nhân.",
  goals: ["biết phép nhân", "tính nhanh"],
  whyItMatters: "Phép nhân giúp bạn đếm nhanh.",
};

describe("narrationScript", () => {
  it("reads the overview part by part, one sentence per line, in screen order", () => {
    const script = narrationScript("Phép nhân", OVERVIEW, "local");
    expect(VideoScriptSchema.parse(script)).toEqual(script);
    expect(script.engine).toBe("local");
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
      narrationScript(
        "Luỹ thừa",
        { ...OVERVIEW, summary: "Ta có 2³ = 8." },
        "local",
      ),
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

describe("readWithFallback", () => {
  const spec = VOICES["hai-dang"];
  const quota = new GeminiQuotaError("quota used up");

  it("reads with the narration voice and never touches the video voice", async () => {
    const used: string[] = [];
    const { voice, result } = await readWithFallback(
      spec,
      async (v) => {
        used.push(v.preset);
        return "gemini take";
      },
      () => {},
    );
    expect(used).toEqual([spec.narration.preset]);
    expect(voice).toEqual(spec.narration);
    expect(result).toBe("gemini take");
  });

  it("on quota reads the whole narration again with the video voice, warning", async () => {
    const used: string[] = [];
    const warnings: string[] = [];
    const { voice, result } = await readWithFallback(
      spec,
      async (v) => {
        used.push(v.engine);
        if (v.engine === "gemini") throw quota;
        return "vieneu take";
      },
      (m) => warnings.push(m),
    );
    expect(used).toEqual(["gemini", "local"]);
    expect(voice).toEqual(spec.video);
    expect(result).toBe("vieneu take");
    expect(warnings[0]).toMatch(/quota used up/);
    expect(warnings[0]).toMatch(/Hải Đăng/);
  });

  it("does not fall back on any other error", async () => {
    await expect(
      readWithFallback(spec, async () => {
        throw new Error("bad request");
      }),
    ).rejects.toThrow("bad request");
  });
});
