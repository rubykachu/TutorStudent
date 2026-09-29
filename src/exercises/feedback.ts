import {
  feedbackTier,
  type MachineState,
  type Phase,
} from "@/exercises/machine";
import type { MascotExpression } from "@/mascot/expressions";
import type { BasicExercise, Concept, TargetRef } from "@/schema/content";
import type { HighlightColor } from "@/visuals/shared/highlight";

export type HighlightSpec = { color: HighlightColor; strong: boolean };

export type FeedbackHighlights = {
  // Prompt blocks by position.
  blocks: ReadonlyMap<number, HighlightSpec>;
  // Formula parts (`\htmlId`) and passage sentences in the prompt.
  parts: ReadonlyMap<string, HighlightSpec>;
  // Elements of the answer area, handed to the answer component.
  options: ReadonlyMap<string, HighlightSpec>;
};

// Everything the frame shows for the current phase, derived in one place so
// the fallbacks for exercises without hint/solution visuals cannot drift.
export type FeedbackView = {
  highlights: FeedbackHighlights;
  // Visual to play under the answer area: the hint visual on the second wrong
  // check, the solution visual on the third.
  visualId: string | undefined;
  // Third wrong check without a solution visual: the answer component shows
  // the correct answer itself.
  reveal: boolean;
  mascot: MascotExpression;
};

const MASCOT: Record<Phase, MascotExpression> = {
  idle: "idle",
  answered: "idle",
  wrong1: "idle",
  wrong2: "hint",
  wrong3: "cheer",
  retype: "cheer",
  correct: "happy",
  done: "happy",
};

const NO_HIGHLIGHTS: FeedbackHighlights = {
  blocks: new Map(),
  parts: new Map(),
  options: new Map(),
};

function buildHighlights(
  targets: readonly TargetRef[],
  wrongTargets: readonly string[],
  strong: boolean,
  concepts: ReadonlyMap<string, Concept> | undefined,
): FeedbackHighlights {
  const blocks = new Map<number, HighlightSpec>();
  const parts = new Map<string, HighlightSpec>();
  const options = new Map<string, HighlightSpec>();
  // Graded mistakes use the plain highlight colour; an authored target on the
  // same element overrides it with its concept colour.
  for (const id of wrongTargets)
    options.set(id, { color: "highlight", strong });
  for (const target of targets) {
    const color: HighlightColor =
      (target.conceptId && concepts?.get(target.conceptId)?.color) ||
      "highlight";
    const spec = { color, strong };
    if (target.target === "block") blocks.set(target.index, spec);
    else if (target.target === "part") parts.set(target.id, spec);
    else options.set(target.id, spec);
  }
  return { blocks, parts, options };
}

export function feedbackView(
  exercise: BasicExercise,
  state: MachineState<unknown>,
  concepts?: ReadonlyMap<string, Concept>,
): FeedbackView {
  const tier = feedbackTier(state);
  const { hints } = exercise;
  const strong = tier === 2 && hints.hintVisualId === undefined;
  const visualId =
    tier === 2
      ? hints.hintVisualId
      : tier === 3
        ? hints.solutionVisualId
        : undefined;
  return {
    highlights:
      tier === 0
        ? NO_HIGHLIGHTS
        : buildHighlights(
            hints.highlight,
            state.wrongTargets,
            strong,
            concepts,
          ),
    visualId,
    reveal: state.phase === "wrong3" && hints.solutionVisualId === undefined,
    mascot: MASCOT[state.phase],
  };
}
