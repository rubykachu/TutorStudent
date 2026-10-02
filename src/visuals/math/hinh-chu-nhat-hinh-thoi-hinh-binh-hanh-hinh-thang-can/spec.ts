import {
  type FigureSpec,
  figureRegions,
} from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { ProbeSpec } from "@/visuals/shared/plane/probe-model";
import type { BoardSpec, PiecesSpec } from "./board-visual";
import type { GallerySpec } from "./gallery";
import { BOARD_VALIDATOR } from "./logic";
import type { TapCardsSpec } from "./tap-cards";

// What one picture of the lesson is made of: the registry builds one entry
// per item of the catalog, so a new picture is one item in a catalog file and
// its id in lesson.json. Pure data, no React, so `content:check` reads it.

export type VisualSpec =
  // A still figure; its polygons with a `region` are tappable in a
  // `tapRegion` exercise.
  | { kind: "figure"; figure: FigureSpec }
  // Pictures side by side, each with a caption.
  | ({ kind: "gallery" } & GallerySpec)
  // A figure that plays frame by frame.
  | ({ kind: "steps" } & StepsSpec)
  // A figure whose parts the child taps to measure (see `ProbeSpec`).
  | ({ kind: "probe" } & ProbeSpec)
  // Cards the child taps to see the name and marks of each shape.
  | ({ kind: "cards" } & TapCardsSpec)
  // A drawing board worked step by step (see `BoardSpec`).
  | ({ kind: "board" } & BoardSpec)
  // Pieces put together into a shape (see `PiecesSpec`).
  | ({ kind: "pieces" } & PiecesSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "probe",
  "cards",
  "board",
  "pieces",
]);

// Validator id of the `manipulate` exercises a spec serves, if any.
export function validatorIdOf(spec: VisualSpec): string | undefined {
  if (spec.kind === "pieces") return "ghep-hinh";
  if (spec.kind === "board") return BOARD_VALIDATOR[spec.shape];
  return undefined;
}

// Ids of the tappable regions a spec declares.
export function regionsOf(spec: VisualSpec): string[] | undefined {
  if (spec.kind !== "figure") return undefined;
  const regions = figureRegions(spec.figure);
  return regions.length > 0 ? regions : undefined;
}
