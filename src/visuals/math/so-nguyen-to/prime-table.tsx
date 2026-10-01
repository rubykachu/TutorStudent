"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Legend } from "@/visuals/shared/math-parts";
import type { SpecOf } from "./catalog";
import { isPrime, primesBelow, TABLE_LIMIT } from "./logic";

const COLS = 10;
const CELL_W = 36;
const CELL_H = 32;
const FONT = 20;
// Three digits ("100") would touch the cell edges at the usual size, so
// they are squeezed to this width.
const THREE_DIGITS_WIDTH = 31;
const MARK = 4;
const NUMBERS = Array.from({ length: TABLE_LIMIT }, (_, i) => i + 1);
const WIDTH = COLS * CELL_W;
const HEIGHT = (TABLE_LIMIT / COLS) * CELL_H;
// Primes per row of the compact list.
const LIST_COLS = 5;

const TITLE = "Bảng các số nguyên tố nhỏ hơn 100";

function Cell({ n }: { n: number }) {
  const x = ((n - 1) % COLS) * CELL_W;
  const y = Math.floor((n - 1) / COLS) * CELL_H;
  const prime = isPrime(n);
  return (
    <g>
      <rect
        {...decorative}
        x={x + 1}
        y={y + 1}
        width={CELL_W - 2}
        height={CELL_H - 2}
        rx={4}
        className={
          prime
            ? `fill-concept-sky/20 ${CONCEPT_CLASSES.sky.stroke}`
            : "fill-surface stroke-border"
        }
        strokeWidth={prime ? 2 : 1}
      />
      <text
        x={x + CELL_W / 2}
        y={y + CELL_H / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        textLength={n >= TABLE_LIMIT ? THREE_DIGITS_WIDTH : undefined}
        lengthAdjust="spacingAndGlyphs"
        fontWeight={prime ? 700 : 500}
        className={`font-heading tabular-nums ${prime ? CONCEPT_CLASSES.sky.fill : "fill-foreground"}`}
      >
        {n}
      </text>
      {prime && (
        <ConceptShape
          {...decorative}
          color="sky"
          cx={x + CELL_W - MARK - 2}
          cy={y + MARK + 2}
          r={MARK}
        />
      )}
    </g>
  );
}

// The numbers 1..100 in ten rows with the primes marked. The number 1 is
// drawn like a composite: it is neither.
function Grid() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <svg
        role="img"
        aria-label={TITLE}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full max-w-[460px]"
      >
        {NUMBERS.map((n) => (
          <Cell key={n} n={n} />
        ))}
      </svg>
      <Legend items={[{ color: "sky", name: "Số nguyên tố" }]} />
      <p className="text-center text-caption">
        Số 1 không là số nguyên tố, cũng không là hợp số.
      </p>
    </div>
  );
}

// Only the 25 primes below 100, five to a row: small enough to sit under an
// exercise prompt next to the keypad.
function List() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Legend items={[{ color: "sky", name: TITLE }]} />
      <ul
        className="grid w-full max-w-[360px] gap-1.5"
        style={{ gridTemplateColumns: `repeat(${LIST_COLS}, minmax(0, 1fr))` }}
      >
        {primesBelow(TABLE_LIMIT).map((n) => (
          <li
            key={n}
            className={`rounded-lg border-2 bg-concept-sky/20 py-0.5 text-center font-bold font-heading text-block tabular-nums ${CONCEPT_CLASSES.sky.border}`}
          >
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Table of the primes below 100: the whole grid 1..100 with the primes
// marked, or the compact list of just the primes.
export function PrimeTable({ spec }: { spec: SpecOf<"table"> }) {
  return (
    <figure aria-label={TITLE} className="w-full">
      {spec.mode === "grid" ? <Grid /> : <List />}
    </figure>
  );
}
