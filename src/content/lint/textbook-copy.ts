import { COPY_MAX_SHARE, COPY_MIN_WORDS, COPY_NGRAM } from "./config";
import { nfc } from "./text";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";
import type { LessonStrings } from "./walk";

// Lessons retell the textbook in their own words and examples; a text that
// shares most of its word runs with the textbook's text layer was copied.
// A review lesson reproduces the book's exercises on purpose and is skipped
// (see book-ref.ts).
// Quoted words (“…”) are exempt: a lesson may quote a reading passage. Runs
// only when sources/<subject>/<lesson>/p*.txt exist.

const QUOTED = /“[^”]*”|"[^"]*"/g;
const TOKEN = /[\p{L}\p{M}]+|\d+/gu;

// Lower-case words and numbers, so copied numbers count as copied too.
function tokens(text: string): string[] {
  return nfc(text).toLocaleLowerCase("vi").match(TOKEN) ?? [];
}

function grams(words: readonly string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i + COPY_NGRAM <= words.length; i++) {
    out.push(words.slice(i, i + COPY_NGRAM).join(" "));
  }
  return out;
}

export function lintTextbookCopy(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "textbook-copy");
  if (!input.sourceText || input.lesson.kind === "review") return findings;
  const source = new Set(grams(tokens(input.sourceText)));
  for (const { path, value } of strings.texts) {
    const words = tokens(value.replace(QUOTED, " "));
    if (words.length < COPY_MIN_WORDS) continue;
    const own = grams(words);
    const copied = own.filter((g) => source.has(g)).length;
    const share = copied / own.length;
    if (share < COPY_MAX_SHARE) continue;
    report(
      path,
      `${Math.round(share * 100)}% of this text's ${COPY_NGRAM}-word runs are in the textbook; retell it in the lesson's own words and numbers${learned("LL-08")}`,
      "warning",
    );
  }
  return findings;
}
