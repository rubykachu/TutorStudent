import { formatInteger } from "@/lib/number-format";

// Pure helpers of the multiplication visuals: no React, so validators and
// unit tests use them directly.

export const TIMES = "·";
export const MINUS = "−";

// Range of the row and column steppers of the dot-grid screens.
export const GRID_RANGE = { min: 1, max: 9 } as const;

export function fmt(value: number): string {
  return formatInteger(value);
}

// "5 + 5 + 5": `count` copies of `term`.
export function repeatedSum(term: number, count: number): string {
  return Array.from({ length: count }, () => fmt(term)).join(" + ");
}

// How close a dot grid is to the rows or columns it should have.
export type GridProgress = "short" | "exact" | "over";

export function gridProgress(have: number, want: number): GridProgress {
  if (have < want) return "short";
  return have === want ? "exact" : "over";
}

// What a skip-counting line lands on after each of `hops` jumps, from 0.
export function landings(step: number, hops: number): number[] {
  return Array.from({ length: hops + 1 }, (_, i) => i * step);
}

// --- Splitting a factor -----------------------------------------------------

// The way a number is cut in two for a · (p + q): into tens and ones, which
// makes the easy product with a round number, or some other way, where the
// larger part that is not a round number is the hard factor.
export type SplitKind =
  | { kind: "tensOnes" }
  | { kind: "hard"; hardFactor: number };

export function classifySplit(total: number, first: number): SplitKind {
  const tens = Math.floor(total / 10) * 10;
  const ones = total - tens;
  if (first === tens || first === ones) return { kind: "tensOnes" };
  const second = total - first;
  const hard = [first, second].filter((part) => part % 10 !== 0);
  if (hard.length === 0) return { kind: "tensOnes" };
  return { kind: "hard", hardFactor: Math.max(...hard) };
}

// --- Area model of a · (p1 + p2 ...) -----------------------------------------

// One column strip of the rectangle. A "keep" strip is part of the answer; a
// "drop" strip is taken away again, as the 1 in 12 · (20 − 1).
export type Strip = {
  kind: "keep" | "drop";
  // Column where the strip starts and how many columns it covers.
  start: number;
  width: number;
  // The width as written in the expression, for the bracket above the strip.
  written: number;
  // a · written width.
  product: number;
};

export type AreaModel = {
  strips: Strip[];
  // Columns of the whole rectangle (the positive parts together).
  columns: number;
  total: number;
};

// Positive parts lay out left to right; a negative part is cut off the right
// end of the last positive one.
export function areaModel(a: number, parts: readonly number[]): AreaModel {
  const positives = parts.filter((p) => p > 0);
  const negatives = parts.filter((p) => p < 0);
  const cut = negatives.reduce((sum, p) => sum - p, 0);
  const last = positives[positives.length - 1] ?? 0;
  if (cut >= last) throw new Error("A taken-away part must be narrower");
  const columns = positives.reduce((sum, p) => sum + p, 0);
  const strips: Strip[] = [];
  let start = 0;
  positives.forEach((written, i) => {
    const width = i === positives.length - 1 ? written - cut : written;
    strips.push({ kind: "keep", start, width, written, product: a * written });
    start += width;
  });
  let dropStart = columns - cut;
  for (const p of negatives) {
    strips.push({
      kind: "drop",
      start: dropStart,
      width: -p,
      written: -p,
      product: a * -p,
    });
    dropStart += -p;
  }
  return {
    strips,
    columns,
    total: a * parts.reduce((sum, p) => sum + p, 0),
  };
}

// "30 + 6" or "240 − 12": the strips' products joined by their signs.
export function productSum(strips: readonly Strip[]): string {
  return strips
    .map((strip, i) => {
      const text = fmt(strip.product);
      if (i === 0) return text;
      return `${strip.kind === "drop" ? MINUS : "+"} ${text}`;
    })
    .join(" ");
}

// "10 + 2" or "20 − 1": the written parts.
export function writtenParts(parts: readonly number[]): string {
  return parts
    .map((p, i) => {
      if (i === 0) return fmt(Math.abs(p));
      return `${p < 0 ? MINUS : "+"} ${fmt(Math.abs(p))}`;
    })
    .join(" ");
}

// --- Parenthesised group inside a calculation line ---------------------------

export type LineSegment = { text: string; group: boolean };

// Splits "= 11 · (4 · 25)" around its parentheses so the group can be marked.
export function splitGroup(line: string): LineSegment[] {
  const open = line.indexOf("(");
  const close = line.indexOf(")", open);
  if (open < 0 || close < 0) return [{ text: line, group: false }];
  return [
    { text: line.slice(0, open), group: false },
    { text: line.slice(open, close + 1), group: true },
    { text: line.slice(close + 1), group: false },
  ].filter((segment) => segment.text !== "");
}
