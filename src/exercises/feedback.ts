import {
  feedbackTier,
  type MachineState,
  type Phase,
} from "@/exercises/machine";
import type { MascotExpression } from "@/mascot/expressions";
import type {
  BasicExercise,
  Concept,
  ConceptColor,
  TargetRef,
} from "@/schema/content";
import { HINT_FALLBACK_COLOR } from "@/visuals/shared/highlight";

// How an authored hint target is drawn: a ring or underline in the colour of
// the concept it names (a neutral colour when it names none), bolder at the
// second tier when there is no hint visual.
export type HighlightSpec = { color: ConceptColor; strong: boolean };

// Authored hint targets (`hints.highlight`) to light up. Neither they nor the
// child's own mistakes (which come separately as `FeedbackView.wrong`) are
// ever painted with the highlight fill, which reads as a selection.
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
  // Answer-area elements the grader flagged on the last check (from the first
  // tier on), drawn by each answer component as a subdued "try again" state.
  wrong: ReadonlySet<string>;
  // Visual to play next to the answer area: the hint visual on the second wrong
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

const NO_WRONG: ReadonlySet<string> = new Set();

function buildHighlights(
  targets: readonly TargetRef[],
  strong: boolean,
  concepts: ReadonlyMap<string, Concept> | undefined,
): FeedbackHighlights {
  const blocks = new Map<number, HighlightSpec>();
  const parts = new Map<string, HighlightSpec>();
  const options = new Map<string, HighlightSpec>();
  for (const target of targets) {
    const color =
      (target.conceptId && concepts?.get(target.conceptId)?.color) ||
      HINT_FALLBACK_COLOR;
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
        : buildHighlights(hints.highlight, strong, concepts),
    wrong: tier === 0 ? NO_WRONG : new Set(state.wrongTargets),
    visualId,
    reveal: state.phase === "wrong3" && hints.solutionVisualId === undefined,
    mascot: MASCOT[state.phase],
  };
}
