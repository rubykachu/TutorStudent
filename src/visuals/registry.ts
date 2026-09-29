import type { ComponentType } from "react";
import {
  countEquals,
  solveCountEquals,
} from "@/visuals/_fixture/dot-counter-validators";
import {
  solveSquareOf,
  squareOf,
} from "@/visuals/_fixture/dot-square-validators";

// State an interactive visual reports while the child manipulates it.
export type VisualState = Record<string, number>;

export type VisualProps = {
  onStateChange?: (state: VisualState) => void;
  // Shown instead of the child's own state, read-only: the revealed answer of
  // a `manipulate` exercise.
  shownState?: VisualState;
  // Locks an interactive visual once its answer is accepted or shown.
  disabled?: boolean;
};

// Decides whether the reported state satisfies a `manipulate` exercise's params.
export type ManipulateValidator = (
  state: VisualState,
  params: Record<string, number>,
) => boolean;

// Builds a state the validator of the same id accepts, so a `manipulate`
// exercise without a solution visual can reveal its answer inside the visual.
export type ManipulateSolver = (params: Record<string, number>) => VisualState;

// Everything `content:check` needs to know about a visual, without React.
export type VisualMeta = {
  // Counted by `content:check --stats`: the child acts on it, not just watches.
  interactive: boolean;
  // Tappable region ids, for `tapRegion` exercises.
  regions?: readonly string[];
  validators?: Readonly<Record<string, ManipulateValidator>>;
  // Keyed by validator id; listed when the visual can show a solved state.
  solutions?: Readonly<Record<string, ManipulateSolver>>;
};

export type VisualEntry = VisualMeta & {
  // Dynamic import keeps each visual out of the bundle until a lesson uses it.
  load: () => Promise<{ default: ComponentType<VisualProps> }>;
};

export type VisualCatalog = Readonly<Record<string, VisualMeta>>;

export const visualRegistry: Readonly<Record<string, VisualEntry>> = {
  "fixture.visual.dot-grid": {
    interactive: false,
    load: () => import("@/visuals/_fixture/dot-grid"),
  },
  "fixture.visual.shapes": {
    interactive: false,
    regions: ["circle", "square", "triangle"],
    load: () => import("@/visuals/_fixture/shapes"),
  },
  "fixture.visual.dot-counter": {
    interactive: true,
    validators: { "count-equals": countEquals },
    solutions: { "count-equals": solveCountEquals },
    load: () => import("@/visuals/_fixture/dot-counter"),
  },
  "fixture.visual.dot-square": {
    interactive: true,
    validators: { "square-of": squareOf },
    solutions: { "square-of": solveSquareOf },
    load: () => import("@/visuals/_fixture/dot-square"),
  },
  "fixture.visual.star-sticker": {
    interactive: false,
    load: () => import("@/visuals/_fixture/star-sticker"),
  },
  "fixture.visual.bead-merge": {
    interactive: false,
    load: () => import("@/visuals/_fixture/bead-merge"),
  },
};

// Own keys only, so a URL like /dev/visuals/constructor never resolves to an
// Object.prototype member.
export function findVisual(id: string): VisualEntry | undefined {
  return Object.hasOwn(visualRegistry, id) ? visualRegistry[id] : undefined;
}
