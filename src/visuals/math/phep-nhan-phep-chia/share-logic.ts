// Dealing items round by round, as data: how many rounds a division with
// remainder takes, and the steps an explainer shows. No React.

import type { Mode } from "./catalog";

// A walk-through shows at most this many dealing steps; a division with more
// rounds deals several rounds in one step.
export const MAX_ROUND_STEPS = 8;

export type ShareStep = {
  // Rounds dealt so far: every plate holds this many items.
  rounds: number;
  // The items left over are drawn apart, tagged "Dư".
  apart: boolean;
  caption: string;
  // The equation with its quotient and remainder is on screen.
  result: boolean;
};

export function shareResult(total: number, people: number) {
  return {
    quotient: Math.floor(total / people),
    remainder: total % people,
  };
}

// Sentence for the state after `rounds` rounds when more can follow.
export function roundCaption(
  rounds: number,
  left: number,
  perStep: number,
): string {
  const lead = perStep === 1 ? `Vòng ${rounds}` : `Sau ${rounds} vòng`;
  return `${lead}: mỗi bạn có ${rounds} cái, còn ${left} cái.`;
}

export function remainderCaption(left: number, people: number): string {
  return `Còn ${left} cái, ít hơn ${people} bạn nên không chia tiếp được. Số dư là ${left}.`;
}

export function shareSteps(
  total: number,
  people: number,
  mode: Mode,
): ShareStep[] {
  const { quotient, remainder } = shareResult(total, people);
  const left = (rounds: number) => total - rounds * people;
  const finalCaption =
    remainder === 0
      ? `Chia hết: mỗi bạn được ${quotient} cái.`
      : `Mỗi bạn được ${quotient} cái, còn dư ${remainder} cái.`;
  if (mode === "still") {
    return [
      {
        rounds: quotient,
        apart: remainder > 0,
        caption: finalCaption,
        result: true,
      },
    ];
  }

  const perStep = Math.ceil(quotient / MAX_ROUND_STEPS);
  const isHint = mode === "hint";
  // A hint stops one round before the end.
  const lastRound = isHint ? quotient - 1 : quotient;
  const cumulative: number[] = [];
  for (let r = perStep; r < lastRound; r += perStep) cumulative.push(r);
  if (lastRound > 0) cumulative.push(lastRound);

  const steps: ShareStep[] = [
    {
      rounds: 0,
      apart: false,
      caption: `Có ${total} cái, chia cho ${people} bạn. Mỗi vòng, mỗi bạn nhận 1 cái.`,
      result: false,
    },
    ...cumulative.map((rounds) => ({
      rounds,
      apart: false,
      caption: roundCaption(rounds, left(rounds), perStep),
      result: false,
    })),
  ];
  if (isHint) {
    steps.push({
      rounds: lastRound,
      apart: false,
      caption: `Còn ${left(lastRound)} cái. Chia tiếp đến khi còn ít hơn ${people} cái.`,
      result: false,
    });
    return steps;
  }
  if (remainder > 0) {
    steps.push({
      rounds: quotient,
      apart: true,
      caption: remainderCaption(remainder, people),
      result: false,
    });
  }
  steps.push({
    rounds: quotient,
    apart: remainder > 0,
    caption: finalCaption,
    result: true,
  });
  return steps;
}
