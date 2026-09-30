"use client";

import { Legend } from "@/visuals/shared/math-parts";
import type { SpecOf } from "./catalog";
import { FormulaRow } from "./parts";

// Formulas stacked, each with its tag: a still picture of labelled examples.
export function Rows({ spec }: { spec: SpecOf<"rows"> }) {
  const legend = spec.legend ?? [];
  return (
    <figure aria-label={spec.label} className="flex w-full flex-col gap-3">
      <ul className="flex flex-col items-center gap-3">
        {spec.rows.map((row) => (
          <li key={row.tex} className="w-full">
            <FormulaRow row={row} />
          </li>
        ))}
      </ul>
      {legend.length > 0 && <Legend items={legend} />}
    </figure>
  );
}
