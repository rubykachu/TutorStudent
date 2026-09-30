"use client";

import { Fragment, type ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";
import { TIMES } from "./logic-nhan";

// Pieces shared by the multiplication visuals of this lesson.

// A line of maths: large, centred, wrapping between its nowrap pieces.
export const MATH_LINE =
  "flex flex-wrap items-baseline justify-center gap-x-2 font-heading text-block font-bold md:text-block-lg";

// Text in the colour of a concept.
export function Tint({
  color,
  children,
}: {
  color: ConceptColor;
  children: ReactNode;
}) {
  return <span className={CONCEPT_CLASSES[color].text}>{children}</span>;
}

// A result still to be found: a dashed box holding "?".
export function Hole() {
  return (
    <span className="inline-block min-w-10 rounded-md border-2 border-muted-foreground border-dashed px-1.5 text-center text-muted-foreground">
      ?
    </span>
  );
}

// "a · b" with both factors in the factor colour.
export function Product({
  factors,
  color = "blue",
}: {
  factors: readonly ReactNode[];
  color?: ConceptColor;
}) {
  return (
    <span className="whitespace-nowrap">
      {factors.map((factor, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: factors never reorder
        <Fragment key={i}>
          {i > 0 && ` ${TIMES} `}
          <Tint color={color}>{factor}</Tint>
        </Fragment>
      ))}
    </span>
  );
}

// "5 + 5 + 5": equal terms in the factor colour.
export function SumOf({
  term,
  count,
  color = "blue",
}: {
  term: ReactNode;
  count: number;
  color?: ConceptColor;
}) {
  return (
    <span className="whitespace-nowrap">
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: terms never reorder
        <Fragment key={i}>
          {i > 0 && " + "}
          <Tint color={color}>{term}</Tint>
        </Fragment>
      ))}
    </span>
  );
}

const DOT_CELL = 32;

// `count` dots laid out row by row in `rows` x `columns` cells, drawn as the
// lesson's factor shape (a blue circle).
export function DotBlock({
  rows,
  columns,
  count = rows * columns,
  label,
  className = "h-auto w-full",
}: {
  rows: number;
  columns: number;
  count?: number;
  label: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${columns * DOT_CELL} ${rows * DOT_CELL}`}
      className={className}
    >
      {Array.from({ length: count }, (_, i) => (
        <ConceptShape
          // biome-ignore lint/suspicious/noArrayIndexKey: dots are laid out by position
          key={i}
          color="blue"
          cx={(i % columns) * DOT_CELL + DOT_CELL / 2}
          cy={Math.floor(i / columns) * DOT_CELL + DOT_CELL / 2}
          r={DOT_CELL * 0.36}
        />
      ))}
    </svg>
  );
}

// "● Thừa số   ■ Tích": what the colours in a picture stand for.
export function Legend({
  items,
}: {
  items: readonly { color: ConceptColor; name: string }[];
}) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-caption">
      {items.map(({ color, name }) => (
        <li key={name} className="flex items-center gap-2">
          <ConceptMark color={color} className="size-4" />
          {name}
        </li>
      ))}
    </ul>
  );
}

export function capitalize(word: string): string {
  return word.charAt(0).toLocaleUpperCase("vi") + word.slice(1);
}
