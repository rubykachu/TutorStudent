import { overviewParts } from "@/content/overview";
import type { LessonOverview } from "@/schema/content";
import type { TtsEngineName } from "../tts";
import { GeminiQuotaError } from "../tts/gemini-keys";
import type { VoiceSpec } from "../voices";
import type { VideoScript } from "./script";

// The overview narration (`pnpm narration:build`): the overview's text, part
// by part and sentence by sentence in the order the screen shows it, as a
// script the video pipeline's narration step reads. Each part is a scene, so
// the pause between parts is longer than between sentences.

// Superscript exponents and TeX read badly aloud and would need a respelling
// with a different word count, which the word-by-word highlight cannot map
// back to the text on screen; an overview says them in words instead.
const UNSPEAKABLE = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐ\\^_{}]/u;

export function narrationScript(
  lessonTitle: string,
  overview: LessonOverview,
  engine: TtsEngineName,
): VideoScript {
  const scenes = overviewParts(overview).map((part) => ({
    id: `${part.key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}-${part.item}`,
    sentences: part.sentences.map((sentence) => {
      if (UNSPEAKABLE.test(sentence.text)) {
        throw new Error(
          `Overview sentence cannot be narrated as written (say it in words): "${sentence.text}"`,
        );
      }
      const line: { text: string; opening?: true } = { text: sentence.text };
      return line;
    }),
  }));
  const first = scenes[0];
  const opening = first?.sentences[0];
  if (!first || !opening) throw new Error("The overview has no text");
  // The first sentence of the overview is the narration's opening line (see
  // `narrationOpeningIssues`).
  opening.opening = true;
  return {
    title: lessonTitle,
    engine,
    poster: { scene: first.id, at: 0 },
    scenes,
    clips: [],
  };
}

export function narrationPaths(lessonId: string) {
  const base = `narration/${lessonId}/overview`;
  return { audioUrl: `${base}.m4a`, vttUrl: `${base}.vtt` };
}

// Reads the whole narration with the lesson's narration voice; when Gemini's
// quota is used up on every key, discards that attempt and reads the whole
// narration again with the lesson's video voice, so one narration never mixes
// engines. `read` gets the voice to read with and returns what it made.
export async function readWithFallback<T>(
  spec: Pick<VoiceSpec, "narration" | "video">,
  read: (voice: VoiceSpec["narration"]) => Promise<T>,
  warn: (message: string) => void = console.warn,
): Promise<{ voice: VoiceSpec["narration"]; result: T }> {
  try {
    return { voice: spec.narration, result: await read(spec.narration) };
  } catch (error) {
    if (!(error instanceof GeminiQuotaError)) throw error;
    warn(
      `narration: ${error.message}\nnarration: reading the whole narration with "${spec.video.preset}" (${spec.video.engine}) instead; build again after the quota resets to use "${spec.narration.preset}"`,
    );
    return { voice: spec.video, result: await read(spec.video) };
  }
}
