import type { RowsSpec } from "@/visuals/shared/formula-rows";
import {
  type FigureSpec,
  figureRegions,
} from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { ProbeSpec } from "@/visuals/shared/plane/probe-model";
import type {
  CalcSpec,
  FloorSpec,
  GallerySpec,
  StageSpec,
  TilesSpec,
  WalkSpec,
} from "./models";

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
  // A worked calculation, line by line.
  | ({ kind: "calc" } & CalcSpec)
  // Formulas stacked, each with its name.
  | ({ kind: "rows" } & RowsSpec)
  // A figure whose parts the child taps to measure (see `ProbeSpec`).
  | ({ kind: "probe" } & ProbeSpec)
  // A walk once round a shape, adding up its sides.
  | ({ kind: "walk" } & WalkSpec)
  // Unit squares to tap and count.
  | ({ kind: "tiles" } & TilesSpec)
  // A floor covered with tiles in rows.
  | ({ kind: "floor" } & FloorSpec)
  // A drawing whose pieces are cut, slid or turned.
  | ({ kind: "stage" } & StageSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "probe",
  "walk",
  "tiles",
  "floor",
  "stage",
]);

// Validator id of the `manipulate` exercises a spec serves, if any.
export function validatorIdOf(spec: VisualSpec): string | undefined {
  return spec.kind === "floor" ? "xep-gach" : undefined;
}

// Ids of the tappable regions a spec declares.
export function regionsOf(spec: VisualSpec): string[] | undefined {
  if (spec.kind !== "figure") return undefined;
  const regions = figureRegions(spec.figure);
  return regions.length > 0 ? regions : undefined;
}
