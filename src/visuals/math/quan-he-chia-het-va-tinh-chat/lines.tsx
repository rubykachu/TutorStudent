"use client";

import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { FormulaRow } from "./parts";

function Pending() {
  return (
    <p className="text-center font-heading text-block font-bold text-muted-foreground">
      ?
    </p>
  );
}

// Lines of a worked example, one more on every step. In a hint the last line
// stays a dimmed "?" and is never revealed.
export function Lines({ spec }: { spec: SpecOf<"lines"> }) {
  const { rows, mode, label } = spec;
  const hint = mode === "hint";
  const draw = (step: number) => (
    <ul className="flex w-full flex-col items-center gap-3">
      {rows.map((row, i) => {
        const hidden = hint && i === rows.length - 1;
        return (
          <li key={row.tex} className="w-full">
            <Reveal
              shown={mode === "still" || (step >= i && !hidden)}
              placeholder={i === 0 ? undefined : <Pending />}
            >
              <FormulaRow row={row} />
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(rows.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? rows.length - 1 : rows.length} label={label}>
      {draw}
    </StepPlayer>
  );
}
