"use client";

import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// Small pieces the arithmetic lessons' pictures share: a line of maths, text
// in a concept colour, a result still to be found, and the colour legend.

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
