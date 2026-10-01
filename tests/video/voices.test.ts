// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PAUSE, PROJECTS_DIR } from "../../video/config";
import {
  checkLessonVoice,
  leadInIssues,
  narrationVoiceIssues,
  openingIssues,
  voiceIssues,
} from "../../video/lib/consistency";
import { LessonMediaSchema } from "../../video/lib/lesson-media";
import { cacheKey } from "../../video/lib/narrate";
import { readScript, VideoScriptSchema } from "../../video/lib/script";
import { localEngine } from "../../video/tts/local";
import { GEMINI_NARRATORS, VOICE_IDS, VOICES } from "../../video/voices";

type Sentence = { text: string; opening?: true; rule?: true; quote?: true };

function script(...scenes: Sentence[][]) {
  return VideoScriptSchema.parse({
    title: "t",
    engine: "local",
    poster: { scene: "s1", at: 0 },
    scenes: scenes.map((sentences, i) => ({ id: `s${i + 1}`, sentences })),
    clips: [],
  });
}

const OPENING: Sentence = {
  text: "Chào bạn! Hôm nay ta học phép cộng.",
  opening: true,
};

describe("voices", () => {
  it("lists each voice once with an engine preset and a gender", () => {
    expect(VOICE_IDS.sort()).toEqual(["hai-dang", "my-duyen"]);
    expect(VOICES["hai-dang"]).toMatchObject({
      video: { engine: "local", preset: "Hải Đăng" },
      gender: "male",
    });
    expect(VOICES["my-duyen"]).toMatchObject({
      video: { engine: "local", preset: "Mỹ Duyên" },
      gender: "female",
    });
  });

  it("reads every narration with the Gemini voice of the lesson voice's gender", () => {
    for (const id of VOICE_IDS) {
      const spec = VOICES[id];
      expect(spec.narration).toEqual({
        engine: "gemini",
        preset: GEMINI_NARRATORS[spec.gender],
      });
    }
    expect(GEMINI_NARRATORS.female).toBe("Sulafat");
    expect(GEMINI_NARRATORS.male).not.toBe(GEMINI_NARRATORS.female);
  });

  it("keeps the audio cache key of existing Hải Đăng takes", () => {
    // Takes cached before the voice moved to media.json were keyed by this.
    const voice = localEngine.voice(VOICES["hai-dang"].video.preset);
    expect(voice).toEqual({
      engine: "local",
      voiceName: "Hải Đăng",
      model: "VieNeu-TTS v3 Turbo",
    });
    expect(cacheKey(voice, "Bạn nhớ nhé.")).toBe("56dedb834ddda5c4");
  });
});

describe("LessonMediaSchema", () => {
  it("accepts a known voice and refuses an unknown one or stray keys", () => {
    expect(LessonMediaSchema.safeParse({ voice: "my-duyen" }).success).toBe(
      true,
    );
    expect(LessonMediaSchema.safeParse({ voice: "robot" }).success).toBe(false);
    expect(
      LessonMediaSchema.safeParse({ voice: "hai-dang", extra: 1 }).success,
    ).toBe(false);
  });
});

describe("script voice", () => {
  it("refuses a voice in script.json, since the lesson declares it", () => {
    const withVoice = {
      title: "t",
      engine: "local",
      voice: "Hải Đăng",
      poster: { scene: "s1", at: 0 },
      scenes: [{ id: "s1", sentences: [{ text: "Chào bạn." }] }],
      clips: [],
    };
    expect(VideoScriptSchema.safeParse(withVoice).success).toBe(false);
  });
});

describe("voiceIssues", () => {
  const spec = {
    id: "a.video.x",
    voice: { engine: "local", voiceName: "Hải Đăng" },
  };
  it("passes when every video used the lesson's voice", () => {
    expect(voiceIssues({ voice: "hai-dang" }, [spec], ["x"])).toEqual([]);
  });
  it("reports a video read by another voice", () => {
    const issues = voiceIssues({ voice: "my-duyen" }, [spec], ["x"]);
    expect(issues).toEqual([
      'video a.video.x was read by "Hải Đăng", the lesson\'s voice is "Mỹ Duyên"',
    ]);
  });
  it("reports an exemption that names no video", () => {
    expect(
      voiceIssues({ voice: "hai-dang", openingExempt: ["gone"] }, [], ["x"]),
    ).toHaveLength(1);
  });
});

describe("narrationVoiceIssues", () => {
  const media = { voice: "my-duyen" } as const;
  const recorded = (engine: string, voiceName: string) => ({
    voice: { engine, voiceName },
  });
  it("accepts the narration voice and, after a quota fallback, the video voice", () => {
    expect(narrationVoiceIssues(media, recorded("gemini", "Sulafat"))).toEqual(
      [],
    );
    expect(narrationVoiceIssues(media, recorded("local", "Mỹ Duyên"))).toEqual(
      [],
    );
  });
  it("accepts a narration with no recorded voice", () => {
    expect(narrationVoiceIssues(media, {})).toEqual([]);
    expect(narrationVoiceIssues(media, undefined)).toEqual([]);
  });
  it("refuses a voice of another lesson voice or gender", () => {
    expect(
      narrationVoiceIssues(media, recorded("local", "Hải Đăng")),
    ).toHaveLength(1);
    expect(
      narrationVoiceIssues(media, recorded("gemini", GEMINI_NARRATORS.male)),
    ).toHaveLength(1);
  });
});

describe("openingIssues", () => {
  it("accepts a flagged greeting to the child as the first sentence", () => {
    expect(openingIssues(script([OPENING, { text: "Ta bắt đầu." }]))).toEqual(
      [],
    );
  });
  it("requires the first sentence to be flagged", () => {
    expect(
      openingIssues(script([{ text: "Bạn cú có hai hạt." }])),
    ).toHaveLength(1);
  });
  it("requires the opening to address the child as bạn", () => {
    const s = script([{ text: "Hôm nay học phép cộng.", opening: true }]);
    expect(openingIssues(s)[0]).toMatch(/"bạn"/);
  });
  it("refuses an opening that is a rule", () => {
    const s = script([{ ...OPENING, rule: true }]);
    expect(openingIssues(s)[0]).toMatch(/rule or a quote/);
  });
  it("refuses the flag anywhere but the first sentence", () => {
    const s = script([OPENING], [{ text: "Chào bạn nhé.", opening: true }]);
    expect(openingIssues(s)).toHaveLength(1);
  });
  it("lets an exempt video stay without one, but not carry one", () => {
    expect(openingIssues(script([{ text: "Bạn cú có hạt." }]), true)).toEqual(
      [],
    );
    expect(openingIssues(script([OPENING]), true)).toHaveLength(1);
  });
});

describe("lead-in", () => {
  it("is at least one second of silence before the first word", () => {
    expect(PAUSE.leadIn).toBeGreaterThanOrEqual(1);
  });
  it("fails a caption that starts inside the lead-in", () => {
    const cue = (t: string) =>
      `WEBVTT\n\n1\n00:00:00.000 --> 00:00:03.000\nChào <${t}>bạn\n`;
    expect(leadInIssues(cue("00:00:00.300"))).toHaveLength(1);
  });
});

// Every committed lesson declares one known voice, agrees with its recorded
// videos, and every video not exempt opens with the opening line.
describe("committed video projects", () => {
  const lessons = existsSync(PROJECTS_DIR)
    ? readdirSync(PROJECTS_DIR).filter((f) =>
        existsSync(path.join(PROJECTS_DIR, f, "media.json")),
      )
    : [];
  const projects = existsSync(PROJECTS_DIR)
    ? readdirSync(PROJECTS_DIR).flatMap((l) =>
        readdirSync(path.join(PROJECTS_DIR, l))
          .filter((n) =>
            existsSync(path.join(PROJECTS_DIR, l, n, "script.json")),
          )
          .map((n) => [l, n] as const),
      )
    : [];

  it("every lesson with a video project has a media.json", () => {
    for (const lessonId of new Set(projects.map(([l]) => l))) {
      expect(lessons).toContain(lessonId);
    }
  });

  it.each(lessons)("%s keeps one voice", (lessonId) => {
    expect(checkLessonVoice(lessonId)).toEqual([]);
  });

  it.each(projects)("%s/%s passes the opening-line rule", (lessonId, name) => {
    const { openingExempt } = JSON.parse(
      readFileSync(path.join(PROJECTS_DIR, lessonId, "media.json"), "utf8"),
    ) as { openingExempt?: string[] };
    const file = path.join(PROJECTS_DIR, lessonId, name, "script.json");
    expect(
      openingIssues(readScript(file), openingExempt?.includes(name)),
    ).toEqual([]);
  });
});
