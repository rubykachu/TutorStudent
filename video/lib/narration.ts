import { overviewParts } from "@/content/overview";
import type { LessonOverview } from "@/schema/content";
import type { TtsEngineName } from "../tts";
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
      return { text: sentence.text };
    }),
  }));
  const first = scenes[0];
  if (!first) throw new Error("The overview has no text");
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
