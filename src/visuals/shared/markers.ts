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

// Controls of an interactive visual, marked by the state key they change, so
// `pnpm lesson:walk` can drive any visual to the state a solver asks for:
// - a stepper root carries the key and its current value, with its two
//   buttons marked "down" and "up";
// - a button that sets one value directly is marked "<key>=<value>".
export const STATE_KEY_ATTR = "data-state-key";
export const STATE_VALUE_ATTR = "data-state-value";
export const STATE_STEP_ATTR = "data-state-step";
export const STATE_SET_ATTR = "data-state-set";

export function stateStepper(key: string | undefined, value: number) {
  return key === undefined
    ? {}
    : { [STATE_KEY_ATTR]: key, [STATE_VALUE_ATTR]: value };
}

export function stateStep(key: string | undefined, direction: "down" | "up") {
  return key === undefined ? {} : { [STATE_STEP_ATTR]: direction };
}

export function stateSet(key: string, value: number) {
  return { [STATE_SET_ATTR]: `${key}=${value}` };
}

export function attrSelector(attr: string): string {
  return `[${attr}]`;
}
