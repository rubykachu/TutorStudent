// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PACING, PAUSE, PAUSE_MAX, PROJECTS_DIR } from "../../video/config";
import {
  pacingExemptVideos,
  pacingIssues,
  pauseGapIssues,
} from "../../video/lib/consistency";
import type { SentenceTake } from "../../video/lib/narrate";
import { type VideoScript, VideoScriptSchema } from "../../video/lib/script";
import { schedule } from "../../video/lib/timeline";

type S = {
  text: string;
  rule?: true;
  pause?: "think" | "ask";
};

function script(...scenes: S[][]): VideoScript {
  return {
    title: "t",
    engine: "local",
    poster: { scene: "s1", at: 0 },
    scenes: scenes.map((sentences, i) => ({ id: `s${i + 1}`, sentences })),
    clips: [],
  };
}

// A script that meets every pacing rule.
const GOOD = () =>
  script(
    [{ text: "Chào bạn!" }, { text: "Bạn thử đoán xem.", pause: "ask" }],
    [
      { text: "Đáp án là sáu." },
      { text: "Một ý.", rule: true, pause: "think" },
      { text: "Hai ý." },
      { text: "Ba ý." },
      { text: "Cuối cùng." },
      { text: "Nhớ nhé.", rule: true },
    ],
  );

describe("script fields", () => {
  it("accepts pause, rejects other pauses", () => {
    expect(VideoScriptSchema.parse(GOOD()).scenes[0]?.sentences[1]?.pause).toBe(
      "ask",
    );
    const bad = GOOD();
    (bad.scenes[0]?.sentences[0] as { pause?: string }).pause = "long";
    expect(VideoScriptSchema.safeParse(bad).success).toBe(false);
  });
});

describe("pacingIssues", () => {
  it("passes a paced script", () => {
    expect(pacingIssues(GOOD())).toEqual([]);
  });

  it("limits sentences and words", () => {
    const many = GOOD();
    many.scenes[1]?.sentences.push(
      ...Array.from({ length: PACING.maxSentences }, () => ({
        text: "Ý nữa.",
      })),
    );
    expect(pacingIssues(many).join("\n")).toContain("fewer ideas");
    const long = GOOD();
    const first = long.scenes[0]?.sentences[0];
    if (first)
      first.text = Array(PACING.maxWordsPerSentence + 1)
        .fill("a")
        .join(" ");
    expect(pacingIssues(long).join("\n")).toContain("one idea per sentence");
    const quoted = GOOD();
    const rule = quoted.scenes[1]?.sentences[1];
    if (rule)
      rule.text = Array(PACING.maxWordsPerSentence + 3)
        .fill("a")
        .join(" ");
    expect(pacingIssues(quoted)).toEqual([]);
  });

  it("wants a pause after every rule sentence but the last, and an ask", () => {
    const s = GOOD();
    const rule = s.scenes[1]?.sentences[1];
    if (rule) delete rule.pause;
    expect(pacingIssues(s).join("\n")).toContain('needs a "pause"');
    const noAsk = GOOD();
    const ask = noAsk.scenes[0]?.sentences[1];
    if (ask) ask.pause = "think";
    expect(pacingIssues(noAsk).join("\n")).toContain("ask");
  });
});

const take = (sceneId: string, text: string): SentenceTake => ({
  sceneId,
  text,
  spoken: text,
  file: "x.wav",
  duration: 2,
  transcript: text,
  matchRate: 1,
  attempts: 1,
  words: [],
});

describe("schedule with pauses", () => {
  const takes = [take("a", "Một."), take("a", "Hai."), take("b", "Ba.")];

  it("leaves the longer of the usual gap and the pause", () => {
    const plain = schedule(takes, [[], [], []]);
    const paced = schedule(takes, [[], [], []], ["ask", "think"]);
    expect(plain.sentences[1]?.start).toBe(PAUSE.leadIn + 2 + PAUSE.sentence);
    expect(paced.sentences[1]?.start).toBe(PAUSE.leadIn + 2 + PAUSE.ask);
    // at a scene change the longer of the scene gap and think wins
    expect(paced.sentences[2]?.start).toBe(
      (paced.sentences[1]?.end ?? 0) + Math.max(PAUSE.scene, PAUSE.think),
    );
  });

  it("keeps every pause between sentences and scenes within 1 to 1.5 seconds", () => {
    for (const seconds of [PAUSE.think, PAUSE.ask, PAUSE.scene]) {
      expect(seconds).toBeGreaterThanOrEqual(1);
      expect(seconds).toBeLessThanOrEqual(PAUSE_MAX);
    }
    expect(PAUSE.ask).toBeGreaterThanOrEqual(PAUSE.think);
  });
});

describe("pauseGapIssues", () => {
  const s = script([
    { text: "Bạn thử đoán xem.", pause: "ask" },
    { text: "Là sáu." },
  ]);
  const vtt = (second: string) =>
    `WEBVTT\n\n1\n00:00:01.000 --> 00:00:03.000\nBạn <00:00:01.300>thử <00:00:01.600>đoán <00:00:01.900>xem.\n\n2\n${second}\nLà <00:00:09.500>sáu.\n`;

  it("accepts the silence the build leaves", () => {
    expect(pauseGapIssues(s, vtt("00:00:05.000 --> 00:00:06.000"))).toEqual([]);
  });

  it("reports a pause the captions do not leave", () => {
    expect(
      pauseGapIssues(s, vtt("00:00:02.500 --> 00:00:03.000"))[0],
    ).toContain('"ask"');
  });
});

describe("the script template", () => {
  it("is a valid script that follows the pacing rules", () => {
    const template = VideoScriptSchema.parse(
      JSON.parse(
        readFileSync(
          ".claude/skills/lesson-video/templates/script.example.json",
          "utf8",
        ),
      ),
    );
    expect(pacingIssues(template)).toEqual([]);
  });
});

describe("pacing-exempt list", () => {
  const exempt = pacingExemptVideos();

  it("lists every video project that exists, as lesson/name", () => {
    const existing = readdirSync(PROJECTS_DIR).flatMap((lesson) => {
      const dir = path.join(PROJECTS_DIR, lesson);
      return readdirSync(dir)
        .filter((name) => existsSync(path.join(dir, name, "script.json")))
        .map((name) => `${lesson}/${name}`);
    });
    // Projects added after the rules are new and are not listed.
    expect(existing.length).toBeGreaterThan(0);
    for (const entry of exempt) expect(existing).toContain(entry);
  });

  it("does not exempt a project that is not listed", () => {
    expect(exempt.has("bai-moi/video-moi")).toBe(false);
  });
});
