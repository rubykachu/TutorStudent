import type { FigureSpec, Tone } from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { BoardSpec } from "./board-visual";
import type { GalleryItem } from "./gallery";
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

// Room round a shape whose sides get their measures written beside them.
export const PROBE_MARGIN = 44;

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

export const board = (
  shape: BoardSpec["shape"],
  names: readonly string[],
  goal?: BoardSpec["goal"],
  done?: string,
): VisualSpec => ({
  kind: "board",
  shape,
  names,
  ...(goal ? { goal } : {}),
  ...(done ? { done } : {}),
});

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
