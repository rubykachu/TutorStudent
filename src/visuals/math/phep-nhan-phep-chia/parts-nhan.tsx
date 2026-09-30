"use client";

import { Fragment, type ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { TIMES } from "./logic-nhan";

// Pieces shared by the multiplication visuals of this lesson; the generic ones
// (Tint, Hole, Legend, MATH_LINE) live in `shared/math-parts` and are re-exported.
export { Hole, Legend, MATH_LINE, Tint };

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

// "5 + 5 + 5": equal terms. They are addends, not factors, so they carry no
// concept colour unless the caller asks for one.
export function SumOf({
  term,
  count,
  color,
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
          {color ? <Tint color={color}>{term}</Tint> : term}
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

export function capitalize(word: string): string {
  return word.charAt(0).toLocaleUpperCase("vi") + word.slice(1);
}
