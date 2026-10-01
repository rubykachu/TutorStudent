"use client";

import { FormulaRow, type Mode, Pending } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  primeFactors,
  primePowers,
  texFactorisation,
  texFactorList,
} from "./logic";

// Splitting a number into prime factors by dividing again and again: the
// column scheme of the textbook. Each row holds the number still to split
// (left of the bar) and the prime that divides it (right of the bar).

// What a ladder picture draws: the number and how it plays (a hint stops
// before the written-out result).
export type LadderSpec = { n: number; mode: Mode };

// The rows of the ladder: [number to split, prime dividing it], ending on
// [1, undefined].
export function ladderRows(n: number): [number, number | undefined][] {
  const rows: [number, number | undefined][] = [];
  let rest = n;
  for (const p of primeFactors(n)) {
    rows.push([rest, p]);
    rest /= p;
  }
  rows.push([1, undefined]);
  return rows;
}

// The result lines: "36 = 2 · 2 · 3 · 3" and, only when some prime repeats,
// "= 2² · 3²" below it.
export function resultLines(n: number): string[] {
  const repeats = primePowers(n).some(([, e]) => e > 1);
  return [
    `${n} = ${texFactorList(n)}`,
    ...(repeats ? [`= ${texFactorisation(n)}`] : []),
  ];
}

export function Ladder({ spec }: { spec: LadderSpec }) {
  const { n, mode } = spec;
  const hint = mode === "hint";
  const rows = ladderRows(n);
  const label = `Phân tích ${n} ra thừa số nguyên tố bằng cách chia dần`;
  const draw = (step: number) => (
    <div className="flex w-full flex-col items-center gap-4">
      <ul className="flex flex-col" aria-label={`Các bước chia ${n}`}>
        {rows.map(([value, prime], i) => (
          <li key={`${value}-${prime ?? "end"}`}>
            <Reveal shown={mode === "still" || step >= i}>
              <div className="flex items-stretch font-heading text-block font-bold tabular-nums md:text-block-lg">
                <span className="min-w-16 border-foreground border-r-4 py-0.5 pr-3 text-right">
                  {value}
                </span>
                <span className="min-w-12 py-0.5 pl-3 text-concept-blue">
                  {prime ?? ""}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="min-h-[5rem] w-full" aria-live="polite">
        <Reveal
          shown={!hint && (mode === "still" || step >= rows.length)}
          placeholder={<Pending />}
        >
          <div className="flex flex-col items-center gap-1">
            {resultLines(n).map((tex) => (
              <FormulaRow key={tex} row={{ tex }} />
            ))}
          </div>
        </Reveal>
      </div>
      <Legend items={[{ color: "blue", name: "Thừa số nguyên tố" }]} />
    </div>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(rows.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? rows.length : rows.length + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}
