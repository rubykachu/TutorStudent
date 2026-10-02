import { formatVttTime, karaokeCueText } from "@/lib/karaoke-vtt";
import type { Video } from "@/schema/content";
import { CAPTION_MAX_WORDS, CLIP_PAD, PAUSE, RENDER } from "../config";
import type { TimedWord } from "./align";
import type { SentenceTake } from "./narrate";
import type { Pause, VideoScript } from "./script";
import { anchorKey } from "./text";

export type PlacedSentence = {
  sceneId: string;
  file: string;
  start: number;
  end: number;
  // Caption words with times on the video's clock.
  words: TimedWord[];
};

export type Timeline = {
  duration: number;
  sentences: PlacedSentence[];
  // Each scene runs from a little before its first word to the next scene.
  scenes: Map<string, { start: number; end: number }>;
};

const round = (t: number) => Math.round(t * 1000) / 1000;

// Lays the sentences end to end with the pauses from PAUSE. `pauses[i]` is
// the script's `pause` flag of sentence i: the silence after it is the longer
// of the usual gap and that pause.
export function schedule(
  takes: readonly SentenceTake[],
  words: readonly TimedWord[][],
  pauses: readonly (Pause | undefined)[] = [],
): Timeline {
  let at = PAUSE.leadIn;
  const sentences: PlacedSentence[] = takes.map((take, i) => {
    const previous = takes[i - 1];
    if (previous) {
      const usual =
        previous.sceneId === take.sceneId ? PAUSE.sentence : PAUSE.scene;
      const flag = pauses[i - 1];
      at += flag ? Math.max(usual, PAUSE[flag]) : usual;
    }
    const start = at;
    at += take.duration;
    return {
      sceneId: take.sceneId,
      file: take.file,
      start: round(start),
      end: round(at),
      words: (words[i] ?? []).map((w) => ({
        text: w.text,
        start: round(start + w.start),
        end: round(start + w.end),
      })),
    };
  });
  const duration = round(at + PAUSE.tail);
  const firsts = sentences.filter(
    (s, i) => sentences[i - 1]?.sceneId !== s.sceneId,
  );
  const scenes = new Map<string, { start: number; end: number }>();
  firsts.forEach((s, i) => {
    const next = firsts[i + 1];
    scenes.set(s.sceneId, {
      start: i === 0 ? 0 : round(s.start - PAUSE.scene / 2),
      end: next ? round(next.start - PAUSE.scene / 2) : duration,
    });
  });
  return { duration, sentences, scenes };
}

// Splits a sentence's words into captions of at most CAPTION_MAX_WORDS, as
// even in length as possible, moving each cut to a nearby comma or colon.
export function captionChunks(words: readonly TimedWord[]): TimedWord[][] {
  const count = Math.ceil(words.length / CAPTION_MAX_WORDS);
  const cuts: number[] = [];
  for (let k = 1; k < count; k++) {
    const even = Math.round((words.length * k) / count);
    const nearby = [0, -1, 1, -2, 2]
      .map((d) => even + d)
      .find(
        (cut) =>
          cut > (cuts.at(-1) ?? 0) &&
          cut < words.length &&
          cut - (cuts.at(-1) ?? 0) <= CAPTION_MAX_WORDS &&
          /[,:;.!?]$/.test(words[cut - 1]?.text ?? ""),
      );
    cuts.push(nearby ?? even);
  }
  return [0, ...cuts].map((from, i) =>
    words.slice(from, cuts[i] ?? words.length),
  );
}

// WebVTT karaoke captions (`src/lib/karaoke-vtt.ts`): a caption stays up
// until the next one, or a moment after its sentence ends.
export function buildVtt(timeline: Timeline): string {
  const cues: string[] = [];
  timeline.sentences.forEach((sentence, i) => {
    const nextStart = timeline.sentences[i + 1]?.start ?? timeline.duration;
    const chunks = captionChunks(sentence.words);
    chunks.forEach((chunk, j) => {
      const first = chunk[0];
      const last = chunk.at(-1);
      if (!first || !last) return;
      const end =
        chunks[j + 1]?.[0]?.start ?? Math.min(last.end + 0.6, nextStart);
      cues.push(
        `${cues.length + 1}\n${formatVttTime(first.start)} --> ${formatVttTime(end)}\n${karaokeCueText(chunk)}`,
      );
    });
  });
  return `WEBVTT\n\n${cues.join("\n\n")}\n`;
}

export function buildClips(
  script: VideoScript,
  timeline: Timeline,
): Video["clips"] {
  return script.clips.map((clip) => {
    const from = timeline.sentences.find((s) => s.sceneId === clip.from);
    const to = timeline.sentences.findLast((s) => s.sceneId === clip.to);
    if (!from || !to) throw new Error(`Clip ${clip.id} has no narrated scenes`);
    return {
      id: clip.id,
      start: round(Math.max(0, from.start - CLIP_PAD.before)),
      end: round(Math.min(timeline.duration, to.end + CLIP_PAD.after)),
      cardIds: clip.cardIds,
    };
  });
}

// `window.TIMING` of a composition: every scene's window and spoken words,
// looked up by `anchorKey` so choreography can wait for a word.
export function compositionTiming(timeline: Timeline) {
  return {
    duration: timeline.duration,
    fps: RENDER.fps,
    scenes: Object.fromEntries(
      [...timeline.scenes].map(([id, window]) => [
        id,
        {
          ...window,
          words: timeline.sentences
            .filter((s) => s.sceneId === id)
            .flatMap((s) =>
              s.words.map((w) => [anchorKey(w.text), w.start, w.end]),
            ),
        },
      ]),
    ),
  };
}
