import type { FigureSpec, Tone } from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { BoardSpec } from "./board-visual";
import type { GalleryItem } from "./gallery";
import type { VisualSpec } from "./spec";

// Small helpers the catalog files of the lessons on the shapes share to write
// their items.

// A still figure.
export const figure = (figureSpec: FigureSpec): VisualSpec => ({
  kind: "figure",
  figure: figureSpec,
});

// A small picture among options: it is never shown bigger than it is drawn.
export const small = (figureSpec: FigureSpec): VisualSpec =>
  figure({ ...figureSpec, maxScale: 1 });

// Room round a shape whose sides get their measures written beside them.
export const PROBE_MARGIN = 44;

// Room under a figure for two lines of measures written beneath it, so that
// they never touch its strokes. The figure itself is fitted to a drawing of
// `FITTED_HEIGHT`; the lines start under it.
export const MEASURE_ROOM = 52;
const FITTED_HEIGHT = 200;

// Where the centre of the text of the `row`-th line of measures stands (rows
// count from 0), under a figure fitted to a drawing `fitted` units high.
export const measureY = (row: number, fitted = FITTED_HEIGHT) =>
  fitted + 16 + 26 * row;

// Size of a thumbnail in a row of options or of a gallery.
export const THUMB = { w: 140, h: 112 } as const;

export const frame = (figureSpec: FigureSpec, caption: string) => ({
  figure: figureSpec,
  caption,
});

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

const boardParts = (
  shape: BoardSpec["shape"],
  names: readonly string[],
  goal?: BoardSpec["goal"],
  done?: string,
): BoardSpec => ({
  shape,
  names,
  ...(goal ? { goal } : {}),
  ...(done ? { done } : {}),
});

export const board = (...args: Parameters<typeof boardParts>): VisualSpec => ({
  kind: "board",
  ...boardParts(...args),
});

// A board drawn bigger (see `BoardSpec.roomy`).
export const roomyBoard = (
  ...args: Parameters<typeof boardParts>
): VisualSpec => ({ kind: "board", ...boardParts(...args), roomy: true });

// Probe parts: the sides of a figure all measuring `text`, or each its own
// text, and the angles at corners.
export const sideProbe = (
  pairs: readonly (readonly [string, string, string?])[],
  text: string,
  tone: Tone = "blue",
) =>
  pairs.map(([a, b, own]) => ({
    kind: "seg" as const,
    a,
    b,
    text: own ?? text,
    label: `Cạnh ${a}${b}`,
    tone,
  }));

export const angleProbe = (
  triples: readonly (readonly [string, string, string, string?])[],
  text: string,
  o: { right?: boolean; textDistance?: number } = {},
) =>
  triples.map(([at, a, b, own]) => ({
    kind: "angle" as const,
    at,
    a,
    b,
    text: own ?? text,
    label: `Góc ${at}`,
    tone: "violet" as Tone,
    ...(o.right ? { right: true } : {}),
    ...(o.textDistance ? { textDistance: o.textDistance } : {}),
  }));

// The items of a lesson's catalog files as one catalog; a key defined twice is
// an error.
export function mergeSpecs(
  ...parts: readonly Record<string, VisualSpec>[]
): Record<string, VisualSpec> {
  const merged: Record<string, VisualSpec> = {};
  for (const part of parts) {
    for (const [key, spec] of Object.entries(part)) {
      if (key in merged)
        throw new Error(`Visual key "${key}" is defined twice`);
      merged[key] = spec;
    }
  }
  return merged;
}
