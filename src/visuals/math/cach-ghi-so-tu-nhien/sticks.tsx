// A sum made of matchsticks: each Roman letter, "+" and "=" is drawn from its
// sticks, so the child can see which stick moves.

import type { SticksSpec } from "./catalog";

type Stick = readonly [number, number, number, number];

const TOP = 6;
const BOTTOM = 50;
const MID = 28;
const GAP = 10;

// Width of a glyph and its sticks, relative to the glyph's left edge.
const GLYPHS: Readonly<
  Record<string, { width: number; sticks: readonly Stick[] }>
> = {
  I: { width: 6, sticks: [[3, TOP, 3, BOTTOM]] },
  V: {
    width: 40,
    sticks: [
      [3, TOP, 20, BOTTOM],
      [37, TOP, 20, BOTTOM],
    ],
  },
  X: {
    width: 40,
    sticks: [
      [3, TOP, 37, BOTTOM],
      [37, TOP, 3, BOTTOM],
    ],
  },
  "+": {
    width: 40,
    sticks: [
      [3, MID, 37, MID],
      [20, 11, 20, 45],
    ],
  },
  "=": {
    width: 40,
    sticks: [
      [3, 18, 37, 18],
      [3, 38, 37, 38],
    ],
  },
};

const SPOKEN: Readonly<Record<string, string>> = {
  I: "I",
  V: "V",
  X: "X",
  "+": "cộng",
  "=": "bằng",
};

export function layout(expr: string): { glyph: string; x: number }[] {
  let x = 6;
  return [...expr].map((glyph) => {
    const placed = { glyph, x };
    x += (GLYPHS[glyph]?.width ?? 0) + GAP;
    return placed;
  });
}

export function sticksTotal(expr: string): number {
  return [...expr].reduce(
    (total, glyph) => total + (GLYPHS[glyph]?.sticks.length ?? 0),
    0,
  );
}

export function Sticks({ spec }: { spec: SticksSpec }) {
  const placed = layout(spec.expr);
  const last = placed[placed.length - 1];
  const width = (last?.x ?? 0) + (GLYPHS[last?.glyph ?? ""]?.width ?? 0) + 6;
  const accent = new Set(spec.accent);
  return (
    <svg
      role="img"
      aria-label={`${[...spec.expr].map((g) => SPOKEN[g] ?? g).join(" ")}, xếp bằng ${sticksTotal(spec.expr)} que tính`}
      viewBox={`0 0 ${width} ${BOTTOM + TOP * 2}`}
      className="h-auto w-full max-w-md"
    >
      {placed.map(({ glyph, x }, index) =>
        (GLYPHS[glyph]?.sticks ?? []).map(([x1, y1, x2, y2], s) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: sticks are placed by position
            key={`${index}-${s}`}
            x1={x + x1}
            y1={y1 + TOP / 2}
            x2={x + x2}
            y2={y2 + TOP / 2}
            className={
              accent.has(index) ? "stroke-concept-amber" : "stroke-concept-sky"
            }
            strokeWidth={6}
            strokeLinecap="round"
          />
        )),
      )}
    </svg>
  );
}
