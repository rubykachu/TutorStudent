import type { ConceptColor } from "@/schema/content";

// The data a flat geometry drawing is made of. Every figure (shapes with their
// marks, steps of a construction, the pieces of a tiling) is one `FigureSpec`;
// `figure.tsx` draws it. Pure data, no React, so `content:check` and the
// registry can read it. Shared by the geometry lessons.

export type Pt = readonly [number, number];

// A concept colour, plain ink for the outline of a shape, or a muted grey for
// a line that only helps the eye.
export type Tone = ConceptColor | "ink" | "mute";

export type FigurePoly = {
  // Names of the vertices, in drawing order.
  v: readonly string[];
  // Outline colour (default ink).
  tone?: Tone;
  // Soft fill colour.
  fill?: Tone;
  // Makes the polygon a tappable region of a `tapRegion` exercise.
  region?: string;
  // Spoken name of that region.
  label?: string;
};

export type FigureSeg = {
  a: string;
  b: string;
  tone?: Tone;
  dash?: boolean;
  bold?: boolean;
};

// Short strokes across the middle of segments: the same number of strokes
// marks segments of equal length.
export type FigureTick = {
  segs: readonly (readonly [string, string])[];
  count: number;
  tone?: Tone;
  // How far along each segment the strokes sit, 0 to 1 (default: the middle).
  at?: number;
};

// A small square at vertex `at` between the directions to `a` and `b`.
export type FigureRight = { at: string; a: string; b: string; tone?: Tone };

// An arc at vertex `at` between the directions to `a` and `b`, with an
// optional measure written beside it. `right` draws the little square of a
// right angle instead of the arc.
export type FigureAngle = {
  at: string;
  a: string;
  b: string;
  text?: string;
  tone?: Tone;
  radius?: number;
  // Distance of the measure from the corner (default: just past the arc).
  textDistance?: number;
  right?: boolean;
};

// A compass arc round point `c`: radius in drawing units, directions in
// degrees as the screen measures them (0 to the right, 90 downwards).
export type FigureArc = {
  c: string;
  r: number;
  from: number;
  to: number;
  tone?: Tone;
  dash?: boolean;
};

export type FigureText = {
  x: number;
  y: number;
  text: string;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
};

// A centimetre ruler lying flat: its left end (the 0 mark) at (x, y), `cm`
// centimetres long, `unit` drawing units to the centimetre.
export type FigureRuler = { x: number; y: number; cm: number; unit: number };

export type FigureSpec = {
  // Spoken description of the whole picture.
  label: string;
  // Size of the drawing; text is 17 units tall, so a drawing meant to fill a
  // phone screen is about 320 wide.
  w: number;
  h: number;
  // Height of the writing in drawing units (default 17).
  textSize?: number;
  // How many times its own size the drawing may be shown at (default 1.2); a
  // small picture among options stays small so a row of them fits a screen.
  maxScale?: number;
  pts: Readonly<Record<string, Pt>>;
  polys?: readonly FigurePoly[];
  segs?: readonly FigureSeg[];
  // Points whose name is written beside them, pushed away from the middle
  // of the drawing; `nameShift` moves one name by (dx, dy) from there.
  names?: readonly string[];
  nameShift?: Readonly<Record<string, Pt>>;
  dots?: readonly string[];
  ticks?: readonly FigureTick[];
  rights?: readonly FigureRight[];
  angles?: readonly FigureAngle[];
  arcs?: readonly FigureArc[];
  texts?: readonly FigureText[];
  ruler?: FigureRuler;
};

// Ids of the tappable regions, in drawing order.
export function figureRegions(spec: FigureSpec): string[] {
  return (spec.polys ?? []).flatMap((poly) =>
    poly.region === undefined ? [] : [poly.region],
  );
}
