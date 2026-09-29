import { ABBREVIATIONS } from "./config";

// Word-level helpers shared by the wording rules. Input is NFC-normalised
// first, so composed and decomposed Vietnamese behave the same.

// Letters and combining marks, but not modifier letters such as the "ⁿ" of
// "aⁿ", which belong to notation rather than words.
const WORD_PATTERN = /[\p{Ll}\p{Lu}\p{Lt}\p{Lo}\p{M}]+/gu;
const TOKEN_PATTERN = /[\p{Ll}\p{Lu}\p{Lt}\p{Lo}\p{M}]+|\d+(?:[ ,.]\d+)*/gu;

export function nfc(text: string): string {
  return text.normalize("NFC");
}

export function words(text: string): string[] {
  return nfc(text).match(WORD_PATTERN) ?? [];
}

// Lower-cased words, the form used for every word comparison.
export function wordKeys(text: string): string[] {
  return words(text).map((word) => word.toLocaleLowerCase("vi"));
}

// Spoken units of a sentence: each word is one syllable, each number one unit.
export function syllableCount(text: string): number {
  return (nfc(text).match(TOKEN_PATTERN) ?? []).length;
}

const ABBREVIATION_KEYS = new Set(
  ABBREVIATIONS.map((a) => a.toLocaleLowerCase("vi")),
);
const SENTENCE_END = /[.!?…]+(?=\s|$)/g;

// Splits at sentence-final punctuation followed by a space or the end, except
// after an abbreviation. A colon never ends a sentence ("Ví dụ: …").
export function sentences(text: string): string[] {
  const source = nfc(text);
  const out: string[] = [];
  let start = 0;
  for (const match of source.matchAll(SENTENCE_END)) {
    const end = match.index + match[0].length;
    const lastWord = source
      .slice(start, match.index)
      .match(/[\p{L}\p{M}]+$/u)?.[0]
      .toLocaleLowerCase("vi");
    if (
      match[0] === "." &&
      lastWord !== undefined &&
      ABBREVIATION_KEYS.has(lastWord)
    ) {
      continue;
    }
    const sentence = source.slice(start, end).trim();
    if (sentence) out.push(sentence);
    start = end;
  }
  const rest = source.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

// Finds `needle` as a run of whole words inside `haystack` (both lower-cased
// word lists); returns the index of the first match or -1.
export function findWordRun(
  haystack: readonly string[],
  needle: readonly string[],
): number {
  if (needle.length === 0) return -1;
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    if (needle.every((word, j) => haystack[i + j] === word)) return i;
  }
  return -1;
}
