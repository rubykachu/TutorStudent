import type { LessonOverview } from "@/schema/content";
import { sentences } from "./lint/text";

// The lesson overview as the text that is shown and read aloud, in reading
// order. The overview screen, its read-aloud and the narration build
// (`pnpm narration:build`) all walk this one sequence, so a word's position
// here is also its position in the narration's karaoke captions.

// Printed above the goals (each goal completes it) and read before them.
export const OVERVIEW_GOALS_LEAD = "Học xong bài này, bạn sẽ:";

export type OverviewPartKey = "hook" | "summary" | "goalsLead" | "goal" | "why";

export type OverviewSentence = {
  text: string;
  // Words as the narration's captions split them: at whitespace.
  words: string[];
  // Position of the first word in the whole overview.
  firstWord: number;
  // Position of the sentence in the whole overview.
  index: number;
};

export type OverviewPart = {
  key: OverviewPartKey;
  // Which goal, for "goal" parts; 0 otherwise.
  item: number;
  text: string;
  sentences: OverviewSentence[];
};

export function overviewParts(overview: LessonOverview): OverviewPart[] {
  const texts: { key: OverviewPartKey; item: number; text: string }[] = [
    { key: "hook", item: 0, text: overview.hook.text },
    { key: "summary", item: 0, text: overview.summary },
    { key: "goalsLead", item: 0, text: OVERVIEW_GOALS_LEAD },
    ...overview.goals.map((text, item) => ({
      key: "goal" as const,
      item,
      text,
    })),
    { key: "why", item: 0, text: overview.whyItMatters },
  ];
  let word = 0;
  let index = 0;
  return texts.map((part) => ({
    ...part,
    sentences: sentences(part.text).map((text) => {
      const words = text.split(/\s+/).filter(Boolean);
      const sentence = { text, words, firstWord: word, index };
      word += words.length;
      index += 1;
      return sentence;
    }),
  }));
}

// Every sentence of the overview in reading order.
export function overviewSentences(
  parts: readonly OverviewPart[],
): OverviewSentence[] {
  return parts.flatMap((part) => part.sentences);
}

export function overviewWordCount(parts: readonly OverviewPart[]): number {
  return overviewSentences(parts).reduce((n, s) => n + s.words.length, 0);
}
