import type { ConceptColor } from "@/schema/content";

// What each kind of picture of the lesson draws. Pure data and types, no
// React, so `content:check` and the catalog can read them. The catalog
// (`catalog.ts`) holds one item per picture of the lesson.

export const LESSON_SLUG = "thu-tu-trong-tap-hop-cac-so-tu-nhien";

// How a picture with several steps plays: "steps" walks through it and ends
// on the full result (also used for a solution drawn with an exercise's own
// numbers); "still" draws the finished picture; "hint" walks through other
// numbers and stops at a "?" before the result.
export type PlayMode = "steps" | "still" | "hint";

// ---------------------------------------------------------------------------
// Number line

// What one layer adds to a number line. Layers appear one per step.
export type LineLayer =
  // A dot on a tick, with its name above ("O", "A") and its number under the
  // tick. `ask` draws a "?" under the tick instead of the number.
  | {
      type: "point";
      at: number;
      name?: string;
      color: ConceptColor;
      tag?: string;
      ask?: boolean;
    }
  // Several dots at once (the elements of a set), one tag for all of them.
  | {
      type: "dots";
      at: readonly number[];
      color: ConceptColor;
      tag?: string;
    }
  // A band of the line between two values, with a tag under it.
  | {
      type: "span";
      from: number;
      to: number;
      color: ConceptColor;
      tag?: string;
    }
  // A double arrow above the line between two values: the distance, with the
  // words of the distance as its tag ("3 đơn vị").
  | {
      type: "arrow";
      from: number;
      to: number;
      tag: string;
      color?: ConceptColor;
    };

// The line itself: a ray pointing right with a tick at `from`,
// `from + step`, … up to `to`; `labelAt` lists the ticks that carry their
// number (default: all of them). A figure for the lesson screens, the hints
// and the solutions.
//
// In "hint" mode the layers before `hintLayers` play as usual; each later
// `point` or `dots` layer shows only as a dimmed "?" at its place (its name
// and tag stay hidden) and later spans and arrows are left out, so the
// result of the exercise is never drawn.
export type LineSpec = {
  from: number;
  to: number;
  step?: number;
  labelAt?: readonly number[];
  layers: readonly LineLayer[];
  mode: PlayMode;
  hintLayers?: number;
  // Spoken name of the whole picture.
  label: string;
};

// A line on which the child moves named points with large − / + buttons (one
// stepper per name; a tick is too narrow to tap on a phone). Each press moves
// the point by one tick (`step` units). A point starts on `from`. State is
// { p0, p1, … }: the value each point sits on, always reported (also at the
// start, so a point left on `from` counts as placed there). In an exercise
// `params` carry the wanted values under the same keys; the validator
// `dat-diem` accepts exactly those values.
//
// On a lesson screen (no `params`) `goal` makes it a guided step: it holds
// the screen's "Tiếp" until every point sits on its goal value, then shows
// `done`.
export type LineTrySpec = {
  from: number;
  to: number;
  step?: number;
  labelAt?: readonly number[];
  names: readonly string[];
  goal?: readonly number[];
  done?: string;
};

// A line whose named points are the regions of a `tapRegion` exercise (ids
// are the lower-case names, in the order of `points`). The points are drawn
// without their number under the tick when the number is what is asked:
// `labelAt` still labels the ticks, which is how the child reads a point.
export type LineTapSpec = {
  from: number;
  to: number;
  step?: number;
  labelAt?: readonly number[];
  points: readonly { at: number; name: string }[];
  label: string;
};

// ---------------------------------------------------------------------------
// Bars

// A bar chart: one bar per item, taller for a bigger value, on a vertical
// axis with grid lines every `gridEvery` up to `max`. `values` says which
// bars carry their number on top. Bars listed in `marks` are drawn in a
// concept colour (with a tag in the legend). In "steps" mode the bars appear
// one per step; in "hint" mode the last step is never shown. With `tap` the
// bars are the regions of a `tapRegion` exercise (ids `b0`, `b1`, … in order).
export type BarsSpec = {
  items: readonly { label: string; value: number }[];
  max: number;
  gridEvery: number;
  values: "all" | "none" | readonly number[];
  marks?: readonly { index: number; color: ConceptColor; tag: string }[];
  // Name of the unit under the axis ("quyển").
  unit?: string;
  mode: PlayMode;
  tap?: boolean;
  label: string;
};

// ---------------------------------------------------------------------------
// Signs

// Two numbers with the comparison sign between them. The smaller number is
// drawn blue and the bigger one violet (the concepts "số nhỏ hơn" and "số
// lớn hơn"); the sign's pointed end faces the smaller number. Steps: the two
// numbers with a "?" between them, then the sign with its reading under it.
// In "hint" mode the sign is never drawn. With "=" both numbers are plain.
export type SignsSpec = {
  left: string;
  right: string;
  sign: "<" | ">" | "≤" | "≥" | "=";
  mode: PlayMode;
  label: string;
};

// ---------------------------------------------------------------------------
// Digits

// Two numbers written one digit per box, right-aligned. Steps: both numbers
// with their count of digits; then either "more digits is bigger" (counts
// differ) or the pairs of digits from the left, equal pairs dimmed and the
// first different pair in the colours of the smaller (blue) and bigger
// (violet) number. In "hint" mode it stops before the verdict. Digits are
// given as plain strings without spaces ("40982").
export type DigitsSpec = {
  a: string;
  b: string;
  mode: PlayMode;
  label: string;
};
