"use client";

import { Formula } from "@/components/blocks/formula";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import type { SpecOf } from "./catalog";

function Card({
  color,
  name,
  value,
}: {
  color: ConceptColor;
  name: string;
  value: number;
}) {
  return (
    <div
      className={`flex min-w-28 flex-col items-center gap-1 rounded-2xl border-2 bg-surface px-5 py-3 ${CONCEPT_CLASSES[color].border}`}
    >
      <p className="flex items-center gap-2 text-caption">
        <ConceptMark color={color} className="size-4" />
        {name}
      </p>
      <p
        className={`font-heading text-title font-bold ${CONCEPT_CLASSES[color].text}`}
      >
        {value}
      </p>
    </div>
  );
}

// A number as a multiple (blue card) and its divisor (violet card), with the
// two equations that say the same thing.
export function UocBoi({ spec }: { spec: SpecOf<"uocBoi"> }) {
  const { big, small } = spec;
  return (
    <figure
      aria-label={`${big} là bội của ${small}, ${small} là ước của ${big}`}
      className="flex w-full flex-col items-center gap-4"
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Card color="blue" name="Bội" value={big} />
        <Card color="violet" name="Ước" value={small} />
      </div>
      <Formula
        tex={`\\concept{blue}{${big}} \\chiahet \\concept{violet}{${small}}`}
        className="text-block md:text-block-lg"
      />
      <Formula
        tex={`\\concept{blue}{${big}} = \\concept{violet}{${small}} \\cdot \\concept{amber}{${big / small}}`}
        className="text-block md:text-block-lg"
      />
    </figure>
  );
}
