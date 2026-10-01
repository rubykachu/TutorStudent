import type { AsrWord } from "../asr/whisper";
import { editPairs } from "./align";
import { ownedTokens } from "./text";

// Cuts one take that speaks several sentences in a row into one piece per
// sentence. Whisper's word times give the cuts: the sentences' words are
// matched to the transcript's on a cheapest edit path, and each cut falls in
// the middle of the pause between the last word heard of one sentence and the
// first word heard of the next.

// Seconds at which to cut `sentences` (the spoken text of each, in order) out
// of a take of `duration` seconds that Whisper heard as `heard`: n - 1 cuts
// for n sentences, in order. Undefined when a sentence has no word in common
// with the transcript or the order of the matches breaks, so the take cannot
// be told apart into sentences.
export function sentenceCuts(
  sentences: readonly string[],
  heard: readonly AsrWord[],
  duration: number,
): number[] | undefined {
  const words = sentences.flatMap((s) => s.split(/\s+/).filter(Boolean));
  const sentenceOfWord = sentences.flatMap((s, i) =>
    s
      .split(/\s+/)
      .filter(Boolean)
      .map(() => i),
  );
  const script = ownedTokens(words);
  const transcript = ownedTokens(heard.map((w) => w.word));
  // Times of the first and last heard word of every sentence.
  const first = new Map<number, number>();
  const last = new Map<number, number>();
  for (const [s, h] of editPairs(
    script.map((t) => t.token),
    transcript.map((t) => t.token),
  )) {
    const sentence = sentenceOfWord[(script[s] as { owner: number }).owner];
    const word = heard[(transcript[h] as { owner: number }).owner];
    if (sentence === undefined || !word) continue;
    if (!first.has(sentence)) first.set(sentence, word.start);
    last.set(sentence, word.end);
  }
  const cuts: number[] = [];
  for (let i = 0; i + 1 < sentences.length; i++) {
    const end = last.get(i);
    const start = first.get(i + 1);
    if (end === undefined || start === undefined) return undefined;
    if (start < end) return undefined;
    cuts.push((end + start) / 2);
  }
  const lastEnd = last.get(sentences.length - 1);
  if (sentences.length > 0 && lastEnd === undefined) return undefined;
  const increasing = cuts.every((c, i) => c > (cuts[i - 1] ?? 0));
  return increasing && cuts.every((c) => c < duration) ? cuts : undefined;
}
