import type { ComponentType } from "react";
import { countEquals } from "@/visuals/_fixture/dot-counter-validators";

// State an interactive visual reports while the child manipulates it.
export type VisualState = Record<string, number>;

export type VisualProps = {
  onStateChange?: (state: VisualState) => void;
};

// Decides whether the reported state satisfies a `manipulate` exercise's params.
export type ManipulateValidator = (
  state: VisualState,
  params: Record<string, number>,
) => boolean;

// Everything `content:check` needs to know about a visual, without React.
export type VisualMeta = {
  // Counted by `content:check --stats`: the child acts on it, not just watches.
  interactive: boolean;
  // Tappable region ids, for `tapRegion` exercises.
  regions?: readonly string[];
  validators?: Readonly<Record<string, ManipulateValidator>>;
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
    load: () => import("@/visuals/_fixture/dot-counter"),
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
