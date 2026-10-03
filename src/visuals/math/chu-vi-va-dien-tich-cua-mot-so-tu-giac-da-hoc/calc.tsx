"use client";

import { Lines } from "@/visuals/shared/formula-rows";
import { Figure } from "@/visuals/shared/plane/figure";
import type { CalcSpec } from "./models";

// A worked calculation, one line more at every step, with an optional picture
// above. In a hint the last line stays a "?".

const FIGURE_MAX_HEIGHT = 160;

export function Calc({ spec }: { spec: CalcSpec }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {spec.figure && (
        <Figure spec={spec.figure} maxHeight={FIGURE_MAX_HEIGHT} />
      )}
      <Lines spec={{ label: spec.label, rows: spec.rows, mode: spec.mode }} />
    </div>
  );
}
