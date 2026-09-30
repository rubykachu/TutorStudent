// Karaoke captions in WebVTT: each cue carries an inline timestamp before
// every word after the first (`Luỹ <00:00:01.200>thừa`), the standard WebVTT
// way to mark when each word is spoken. The video pipeline writes cues with
// `karaokeCueText`; the player reads them back with `parseKaraokeCue` to
// highlight the word being said. Both live here so the format has one owner.

export type TimedWord = { text: string; start: number };

export function formatVttTime(seconds: number): string {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number, width = 2) => String(n).padStart(width, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms % 1000, 3)}`;
}

export function karaokeCueText(words: readonly TimedWord[]): string {
  return words
    .map((w, i) => (i === 0 ? w.text : `<${formatVttTime(w.start)}>${w.text}`))
    .join(" ");
}

const TIMESTAMP = /<(\d{2,}):(\d{2}):(\d{2})\.(\d{3})>/;
const ANY_TAG = /<[^>]*>/g;

function parseTime(match: RegExpMatchArray): number {
  const [, h, m, s, ms] = match.map(Number);
  return (h ?? 0) * 3600 + (m ?? 0) * 60 + (s ?? 0) + (ms ?? 0) / 1000;
}

// Words of one cue with the time each one starts. A word without its own
// timestamp starts with the word before it (the first with the cue).
export function parseKaraokeCue(text: string, cueStart: number): TimedWord[] {
  const words: TimedWord[] = [];
  let start = cueStart;
  for (const token of text.split(/\s+/)) {
    const stamp = token.match(TIMESTAMP);
    if (stamp) start = parseTime(stamp);
    const word = token.replace(ANY_TAG, "");
    if (word) words.push({ text: word, start });
  }
  return words;
}

const CUE_TIMING =
  /^(\d{2,}):(\d{2}):(\d{2})\.(\d{3})\s+-->\s+\d{2,}:\d{2}:\d{2}\.\d{3}/;

// Every word of a whole karaoke WebVTT file, in order, with its start time;
// for pages that highlight a whole text in step with an audio file rather
// than one cue at a time.
export function parseKaraokeVtt(vtt: string): TimedWord[] {
  const words: TimedWord[] = [];
  for (const block of vtt.replace(/\r\n?/g, "\n").split(/\n{2,}/)) {
    const lines = block.split("\n");
    const at = lines.findIndex((line) => CUE_TIMING.test(line));
    const timing = at === -1 ? null : lines[at]?.match(CUE_TIMING);
    if (!timing) continue;
    const text = lines.slice(at + 1).join(" ");
    words.push(...parseKaraokeCue(text, parseTime(timing)));
  }
  return words;
}
