import type { AsrWord } from "../asr/whisper";
import { ownedTokens } from "./text";

export type TimedWord = { text: string; start: number; end: number };

type Span = { start: number; end: number };

// Pairs of (script token, transcript token) indexes on a cheapest edit path:
// equal tokens and substitutions pair up, insertions and deletions do not.
function editPairs(
  a: readonly string[],
  b: readonly string[],
): [number, number][] {
  const cost: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    cost.push(
      Array.from({ length: b.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0,
      ),
    );
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const row = cost[i] as number[];
      const up = cost[i - 1] as number[];
      row[j] = Math.min(
        (up[j] as number) + 1,
        (row[j - 1] as number) + 1,
        (up[j - 1] as number) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  const pairs: [number, number][] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 && j > 0) {
    const here = (cost[i] as number[])[j] as number;
    const diagonal =
      ((cost[i - 1] as number[])[j - 1] as number) +
      (a[i - 1] === b[j - 1] ? 0 : 1);
    if (here === diagonal) {
      pairs.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (here === ((cost[i - 1] as number[])[j] as number) + 1) {
      i--;
    } else {
      j--;
    }
  }
  return pairs.reverse();
}

// Times every caption word of a sentence from Whisper's word timestamps.
// `text` (shown) and `spoken` (said) have the same words one to one; the
// spoken tokens are matched to the transcript's on an edit path, and words
// Whisper missed share the gap between their neighbours by length.
export function alignWords(
  text: string,
  spoken: string,
  asr: readonly AsrWord[],
  duration: number,
): TimedWord[] {
  const shown = text.split(/\s+/);
  const script = ownedTokens(spoken.split(/\s+/));
  const heard = ownedTokens(asr.map((w) => w.word));
  const perWord = new Map<number, number>();
  for (const t of heard) perWord.set(t.owner, (perWord.get(t.owner) ?? 0) + 1);
  const seen = new Map<number, number>();
  const heardSpans: Span[] = heard.map((t) => {
    const word = asr[t.owner] as AsrWord;
    const n = perWord.get(t.owner) ?? 1;
    const k = seen.get(t.owner) ?? 0;
    seen.set(t.owner, k + 1);
    const step = (word.end - word.start) / n;
    return { start: word.start + step * k, end: word.start + step * (k + 1) };
  });

  const spans: (Span | undefined)[] = shown.map(() => undefined);
  for (const [si, hi] of editPairs(
    script.map((t) => t.token),
    heard.map((t) => t.token),
  )) {
    const owner = (script[si] as { owner: number }).owner;
    const span = heardSpans[hi] as Span;
    const current = spans[owner];
    spans[owner] = current
      ? {
          start: Math.min(current.start, span.start),
          end: Math.max(current.end, span.end),
        }
      : { ...span };
  }

  // Words without a match share the time between the known words around them.
  const words: TimedWord[] = [];
  let i = 0;
  while (i < shown.length) {
    const span = spans[i];
    if (span) {
      const floor = words.at(-1)?.end ?? 0;
      words.push({
        text: shown[i] as string,
        start: Math.max(span.start, floor),
        end: Math.max(span.end, floor),
      });
      i++;
      continue;
    }
    let j = i;
    while (j < shown.length && !spans[j]) j++;
    const from = words.at(-1)?.end ?? 0;
    const to = Math.max(from, spans[j]?.start ?? duration);
    const run = shown.slice(i, j);
    const total = run.reduce((sum, w) => sum + w.length, 0);
    let at = from;
    for (const w of run) {
      const length = ((to - from) * w.length) / total;
      words.push({ text: w, start: at, end: at + length });
      at += length;
    }
    i = j;
  }
  return words;
}
