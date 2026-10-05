// @vitest-environment node

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OVERVIEW_GOALS_LEAD } from "@/content/overview";
import type { LessonOverview } from "@/schema/content";
import { PROJECTS_DIR } from "../../video/config";
import {
  checkLessonNarration,
  narrationOpeningIssues,
} from "../../video/lib/consistency";
import { readLessonMedia } from "../../video/lib/lesson-media";
import {
  narrationPaths,
  narrationScript,
  readWithFallback,
} from "../../video/lib/narration";
import { VideoScriptSchema } from "../../video/lib/script";
import { GeminiQuotaError } from "../../video/tts/gemini-keys";
import { VOICES } from "../../video/voices";

const lessonsWithMedia = readdirSync(PROJECTS_DIR).filter((f) =>
  existsSync(path.join(PROJECTS_DIR, f, "media.json")),
);

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

describe("narration opening line", () => {
  it("flags the first sentence of the overview, and only it", () => {
    const script = narrationScript("Phép nhân", OVERVIEW, "local");
    const flagged = script.scenes.flatMap((s) =>
      s.sentences.filter((x) => x.opening),
    );
    expect(flagged).toEqual([{ text: "Mẹ mua hai túi kẹo.", opening: true }]);
  });

  it("accepts an overview whose first sentence greets the child as bạn", () => {
    const overview = {
      ...OVERVIEW,
      hook: { text: "Chào bạn! Mẹ mua hai túi kẹo." },
    };
    expect(narrationOpeningIssues("Phép nhân", overview)).toEqual([]);
  });

  it("refuses an overview that does not greet the child", () => {
    expect(narrationOpeningIssues("Phép nhân", OVERVIEW)[0]).toMatch(/"bạn"/);
  });

  it("lets an exempt lesson keep an overview without a greeting", () => {
    expect(narrationOpeningIssues("Phép nhân", OVERVIEW, true)).toEqual([]);
  });
});

describe("narration opening of committed lessons", () => {
  it("passes for every lesson that has a narration or is exempt", () => {
    for (const lessonId of lessonsWithMedia) {
      expect(checkLessonNarration(lessonId)).toEqual([]);
    }
  });

  it("exempts exactly the lessons narrated before the rule", () => {
    const exempt = lessonsWithMedia.filter(
      (id) => readLessonMedia(id).narrationOpeningExempt,
    );
    expect(exempt.sort()).toEqual(
      [
        "dau-hieu-chia-het",
        "luy-thua",
        "neu-cau-muon-co-mot-nguoi-ban",
        "phep-cong-phep-tru",
        "phep-nhan-phep-chia",
        "quan-he-chia-het-va-tinh-chat",
        "tap-hop",
        "thu-tu-thuc-hien-phep-tinh",
      ].sort(),
    );
  });

  it("does not fail a lesson that has no narration yet", () => {
    expect(checkLessonNarration("so-nguyen-to")).toEqual([]);
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

  it("on quota reads the whole narration again with the OmniVoice video voice, warning", async () => {
    const used: string[] = [];
    const warnings: string[] = [];
    const { voice, result } = await readWithFallback(
      spec,
      async (v) => {
        used.push(v.engine);
        if (v.engine === "gemini") throw quota;
        return "omnivoice take";
      },
      (m) => warnings.push(m),
    );
    expect(used).toEqual(["gemini", "omnivoice"]);
    expect(voice).toEqual({ engine: "omnivoice", preset: "Hải Đăng" });
    expect(result).toBe("omnivoice take");
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
