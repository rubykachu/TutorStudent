// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseKaraokeCue } from "@/lib/karaoke-vtt";
import { CAPTION_MAX_WORDS, PAUSE } from "../../video/config";
import { alignWords } from "../../video/lib/align";
import type { SentenceTake } from "../../video/lib/narrate";
import { buildVtt, captionChunks, schedule } from "../../video/lib/timeline";

const words = (text: string) =>
  text.split(" ").map((w, i) => ({ text: w, start: i, end: i + 0.8 }));

describe("alignWords", () => {
  it("times caption words from Whisper words, numbers included", () => {
    const timed = alignWords(
      "Ô thứ 64 có hạt.",
      "Ô thứ 64 có hạt.",
      [
        { word: "Ô", start: 0, end: 0.2 },
        { word: "thứ", start: 0.2, end: 0.4 },
        { word: "sáu", start: 0.4, end: 0.6 },
        { word: "mươi", start: 0.6, end: 0.8 },
        { word: "tư", start: 0.8, end: 1 },
        { word: "có", start: 1, end: 1.2 },
        { word: "hạt.", start: 1.2, end: 1.5 },
      ],
      1.6,
    );
    expect(timed.map((w) => [w.text, w.start])).toEqual([
      ["Ô", 0],
      ["thứ", 0.2],
      ["64", 0.4],
      ["có", 1],
      ["hạt.", 1.2],
    ]);
  });

  it("spreads words Whisper missed over the gap around them", () => {
    const timed = alignWords(
      "một hai ba",
      "một hai ba",
      [
        { word: "một", start: 0, end: 0.5 },
        { word: "ba", start: 2, end: 2.5 },
      ],
      3,
    );
    expect(timed[1]).toEqual({ text: "hai", start: 0.5, end: 2 });
  });
});

describe("captions", () => {
  it("cuts long sentences into even captions, at a comma when close", () => {
    const chunks = captionChunks(
      words(
        "Chia hai luỹ thừa cùng cơ số, khác 0: giữ nguyên cơ số, lấy số mũ thứ nhất trừ số mũ thứ hai.",
      ),
    );
    expect(chunks.every((c) => c.length <= CAPTION_MAX_WORDS)).toBe(true);
    expect(chunks[0]?.at(-1)?.text).toBe("số,");
  });

  it("writes WebVTT karaoke cues on the video clock", () => {
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
    const timeline = schedule(
      [take("s01", "Một hai."), take("s02", "Ba bốn.")],
      [
        words("Một hai.").map((w) => ({
          ...w,
          start: w.start / 2,
          end: w.end / 2,
        })),
        words("Ba bốn."),
      ],
    );
    expect(timeline.sentences[1]?.start).toBe(PAUSE.leadIn + 2 + PAUSE.scene);
    expect(timeline.scenes.get("s01")?.start).toBe(0);
    const vtt = buildVtt(timeline);
    expect(vtt.startsWith("WEBVTT\n\n1\n00:00:01.000 --> ")).toBe(true);
    const cue = vtt.split("\n\n")[1]?.split("\n")[2] ?? "";
    expect(parseKaraokeCue(cue, PAUSE.leadIn).map((w) => w.start)).toEqual([
      PAUSE.leadIn,
      PAUSE.leadIn + 0.5,
    ]);
  });
});
