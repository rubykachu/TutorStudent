// Packing items into groups of a fixed size, as data: the groups, the
// leftover and the decision, plus the steps an explainer shows. No React.

import type { Mode } from "./catalog";

export type PackGoal = "up" | "down";

// `perVerb` is what a group does with its items in the story: a coach
// "chở", a shelf "chứa", a notebook "giá" (a price).
export type PackWords = {
  groupWord: string;
  itemWord: string;
  perVerb: string;
};

export function packResult(total: number, per: number, goal: PackGoal) {
  const full = Math.floor(total / per);
  const remainder = total % per;
  // "up": every item must go in, so a started group counts too.
  const answer = goal === "up" && remainder > 0 ? full + 1 : full;
  return { full, remainder, answer };
}

// The decision sentence once the leftover is known.
export function decisionCaption(
  total: number,
  per: number,
  goal: PackGoal,
  { groupWord, itemWord }: PackWords,
  hideAnswer = false,
): string {
  const { remainder, answer } = packResult(total, per, goal);
  const shown = hideAnswer ? "?" : String(answer);
  if (goal === "up") {
    return remainder > 0
      ? `Còn ${remainder} ${itemWord}, cần thêm 1 ${groupWord}. Cần ${shown} ${groupWord}.`
      : `Không còn ${itemWord} nào. Cần ${shown} ${groupWord}.`;
  }
  return remainder > 0
    ? `Còn ${remainder} ${itemWord}, chưa đủ mua thêm 1 ${groupWord}. Mua được ${shown} ${groupWord}.`
    : `Không còn dư ${itemWord}. Mua được ${shown} ${groupWord}.`;
}

export type PackStep = {
  // Full groups filled so far.
  filled: number;
  // The leftover items are drawn apart.
  leftover: boolean;
  // The decision is made: the leftover group counts (goal "up") or not.
  decided: boolean;
  caption: string;
  // Equation total = per · q + r on screen.
  equation: boolean;
};

export function packSteps(
  total: number,
  per: number,
  goal: PackGoal,
  mode: Mode,
  words: PackWords,
): PackStep[] {
  const { full, remainder } = packResult(total, per, goal);
  const { groupWord, itemWord, perVerb } = words;
  const left = (filled: number) => total - filled * per;
  if (mode === "still") {
    return [
      {
        filled: full,
        leftover: true,
        decided: true,
        caption: decisionCaption(total, per, goal, words),
        equation: true,
      },
    ];
  }
  const steps: PackStep[] = [
    {
      filled: 0,
      leftover: false,
      decided: false,
      caption: `Có ${total} ${itemWord}. Mỗi ${groupWord} ${perVerb} ${per} ${itemWord}.`,
      equation: false,
    },
  ];
  for (let filled = 1; filled <= full; filled++) {
    steps.push({
      filled,
      leftover: false,
      decided: false,
      caption: `${capitalize(groupWord)} ${filled} đủ ${per} ${itemWord}. Còn ${left(filled)} ${itemWord}.`,
      equation: false,
    });
  }
  steps.push({
    filled: full,
    leftover: true,
    decided: false,
    caption:
      remainder > 0
        ? `Còn ${remainder} ${itemWord}, ít hơn ${per}. Đặt riêng ra.`
        : `Không còn ${itemWord} nào.`,
    equation: true,
  });
  steps.push({
    filled: full,
    leftover: true,
    decided: mode !== "hint",
    caption: decisionCaption(total, per, goal, words, mode === "hint"),
    equation: true,
  });
  return steps;
}

export function capitalize(word: string): string {
  return word.charAt(0).toLocaleUpperCase("vi") + word.slice(1);
}
