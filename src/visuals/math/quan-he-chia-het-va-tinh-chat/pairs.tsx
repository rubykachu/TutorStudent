"use client";

import { FormulaRow, Pending } from "@/visuals/shared/formula-rows";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { divisorPairs, divisors } from "./logic";

// The ways to write n as a product of two numbers, one per step, then the
// divisors they give. In a hint the list of divisors stays a "?".
export function Pairs({ spec }: { spec: SpecOf<"pairs"> }) {
  const { n, mode } = spec;
  const pairs = divisorPairs(n);
  const hint = mode === "hint";
  const label = `Viết ${n} thành tích của hai số theo mọi cách`;
  const list = divisors(n)
    .map((d) => `\\concept{violet}{${d}}`)
    .join(";\\ ");
  const draw = (step: number) => (
    <ul className="flex w-full flex-col items-center gap-3">
      {pairs.map(([d, e], i) => (
        <li key={d} className="w-full">
          <Reveal
            shown={mode === "still" || step >= i}
            placeholder={<Pending />}
          >
            <FormulaRow
              row={{
                tex: `${n} = \\concept{violet}{${d}} \\cdot \\concept{violet}{${e}}`,
              }}
            />
          </Reveal>
        </li>
      ))}
      <li className="w-full">
        <Reveal
          shown={mode === "still" || (!hint && step >= pairs.length)}
          placeholder={<Pending />}
        >
          <FormulaRow
            row={{ tex: list, tag: { text: "Các ước", color: "violet" } }}
          />
        </Reveal>
      </li>
    </ul>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(pairs.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? pairs.length : pairs.length + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}
