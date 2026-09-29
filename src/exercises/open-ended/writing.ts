import type { WritingCheck } from "@/progress/db";

export type WritingResult = { text: string; checks: WritingCheck[] };

export type WritingStats = { sentences: number; words: number };

// Vietnamese words are space-separated syllables, so a word count here is a
// syllable count, which is what a child means by "chữ".
export function writingStats(text: string): WritingStats {
  const trimmed = text.trim();
  if (trimmed === "") return { sentences: 0, words: 0 };
  const sentences = trimmed
    .split(/[.!?…]+(?:\s+|$)/u)
    .filter((part) => part.trim() !== "").length;
  return { sentences, words: trimmed.split(/\s+/u).length };
}

// The textarea starts with the suggested opening, so the child has written
// something only once the text says more than that opening.
export function hasOwnWriting(text: string, starter: string): boolean {
  const own = text.trim();
  return own !== "" && own !== starter.trim();
}
