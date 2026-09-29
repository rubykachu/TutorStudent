// Data attributes shared by visuals, the /dev/visuals page and
// `pnpm visual:shot`, so the screenshot checker and the components cannot drift.

// The fixed-size box a visual must fit in; the checker measures against it.
export const VISUAL_FRAME_ATTR = "data-visual-frame";
export const visualFrame = { [VISUAL_FRAME_ATTR]: "" } as const;

// Purely visual backdrops (halos, rings, the shape behind a label) that are
// meant to sit under their siblings; the overlap check skips them.
export const DECORATIVE_ATTR = "data-decorative";
export const decorative = { [DECORATIVE_ATTR]: "" } as const;

// A StepPlayer root carries its current step and step count, and its manual
// "next" button is marked, so the checker can walk every step.
export const STEP_PLAYER_ATTR = "data-step-player";
export const STEP_ATTR = "data-step";
export const STEP_COUNT_ATTR = "data-steps";
export const STEP_NEXT_ATTR = "data-step-next";

export function attrSelector(attr: string): string {
  return `[${attr}]`;
}
