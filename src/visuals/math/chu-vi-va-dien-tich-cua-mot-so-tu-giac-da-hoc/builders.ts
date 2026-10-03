import type { ConceptColor } from "@/schema/content";
import type { Row } from "@/visuals/shared/formula-rows";
import type { FigureSpec, Pt, Tone } from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { GalleryItem } from "./models";
import { type WalkSpec, walkFigure } from "./models";
import type { VisualSpec } from "./spec";

// Small helpers the catalog files share to write their items.

// A still figure.
export const figure = (figureSpec: FigureSpec): VisualSpec => ({
  kind: "figure",
  figure: figureSpec,
});

// A small picture among options: it is never shown bigger than it is drawn.
export const small = (figureSpec: FigureSpec): VisualSpec =>
  figure({ ...figureSpec, maxScale: 1 });

// Size of a thumbnail in a row of options or of a gallery.
export const THUMB = { w: 150, h: 112, margin: 18 } as const;

export const steps = (
  label: string,
  frames: StepsSpec["frames"],
): VisualSpec => ({ kind: "steps", label, frames });

export const gallery = (
  label: string,
  items: readonly GalleryItem[],
  columns?: 1 | 2 | 3,
): VisualSpec => ({
  kind: "gallery",
  label,
  items,
  ...(columns ? { columns } : {}),
});

// A line of a worked calculation with its tag.
export const row = (
  tex: string,
  tag?: readonly [string, ConceptColor],
): Row => ({
  tex,
  ...(tag ? { tag: { text: tag[0], color: tag[1] } } : {}),
});

export const calc = (
  label: string,
  rows: readonly Row[],
  mode: "steps" | "hint" | "still" = "steps",
  fig?: FigureSpec,
): VisualSpec => ({
  kind: "calc",
  label,
  rows,
  mode,
  ...(fig ? { figure: fig } : {}),
});

// The steps of a walk once round a shape: the figure after k sides, with the
// caption of each step.
export function walkFrames(
  spec: WalkSpec,
  captions: readonly string[],
): { figure: FigureSpec; caption: string }[] {
  return captions.map((caption, k) => ({
    figure: walkFigure(spec, Math.min(k, spec.sides.length)),
    caption,
  }));
}

// Equal-length strokes on all the sides of a shape named A, B, C, … .
export function equalTicks(
  corners: number,
  tone: Tone = "blue",
): { ticks: NonNullable<FigureSpec["ticks"]> } {
  const names = Array.from({ length: corners }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  return {
    ticks: [
      {
        segs: names.map(
          (n, i) =>
            [n, names[(i + 1) % corners] as string] as readonly [
              string,
              string,
            ],
        ),
        count: 1,
        tone,
      },
    ],
  };
}

// A formula that never breaks across lines: its spaces do not break.
export const unbreakable = (formula: string): string =>
  formula.replaceAll(" ", "\u00a0");

// A caption "Name: formula" whose formula never breaks across lines, so a
// narrow caption wraps after the colon.
export const formulaCaption = (name: string, formula: string): string =>
  `${name}: ${unbreakable(formula)}`;

// A text where each measure keeps its number and its unit on one line ("6 cm",
// "10 m²" never end a line on the number).
export const keepUnits = (text: string): string =>
  text.replace(/(\d) (cm²|cm|m²|m)(?![\p{L}\d])/gu, "$1\u00a0$2");

export const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
