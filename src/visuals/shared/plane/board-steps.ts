import type { VisualState } from "@/visuals/registry";

// The steps of a drawing board the child works on as on paper. A board is a
// list of steps; the child's state holds one key per step: a number for a
// stepper (a length) or a pick (one of a few values), 1 for a button pressed,
// 1 or 2 for a yes/no answer. Pure, so validators, walk-through frames and
// the component all agree.

export type BoardStep =
  // A length the child sets with − and + buttons.
  | {
      key: string;
      kind: "stepper";
      text: string;
      short: string;
      min: number;
      max: number;
    }
  // A button that draws a line or an arc.
  | { key: string; kind: "press"; text: string; short: string }
  // A yes/no question (1 = yes, 2 = no).
  | { key: string; kind: "choice"; text: string; yes: string; no: string }
  // One value out of a few, each with its own button (an angle to set).
  | {
      key: string;
      kind: "pick";
      text: string;
      short: string;
      options: readonly { value: number; label: string }[];
    };

export function stepDone(step: BoardStep, state: VisualState): boolean {
  const value = state[step.key];
  if (value === undefined) return false;
  switch (step.kind) {
    case "stepper":
      return true;
    case "press":
      return value === 1;
    case "choice":
      return value === 1 || value === 2;
    case "pick":
      return step.options.some((option) => option.value === value);
  }
}

// A step can be done once every step before it is.
export function stepEnabled(
  steps: readonly BoardStep[],
  index: number,
  state: VisualState,
): boolean {
  return steps.slice(0, index).every((step) => stepDone(step, state));
}
