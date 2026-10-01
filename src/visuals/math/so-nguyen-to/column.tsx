"use client";

import { Formula } from "@/components/blocks/formula";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { FormulaRow, Pending } from "@/visuals/shared/formula-rows";
import { Hole, Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { columnRows, primeFactors, productTex } from "./logic";

const NUMBER = "font-heading text-block-lg font-bold tabular-nums";

// A division column as the book draws it: the numbers on the left, the primes
// that divide them on the right, one vertical line between. The primes carry
// no mark of their own (it would read as a "+" before the divisor); the
// legend names their colour instead. `hide` lists cells
// (value 0, prime 1, next value 2, …) that stay "?" for an exercise to ask.
// One row appears per step, with the division it came from, then the product
// of the primes. In a hint the product stays "?".
export function Column({ spec }: { spec: SpecOf<"column"> }) {
  const { n, hide, mode } = spec;
  const hint = mode === "hint";
  const rows = columnRows(n);
  const showProduct = hide.length === 0;
  const factors = primeFactors(n);
  const label = `Sơ đồ cột của ${n}: ${rows
    .map(
      (row, i) =>
        `${hide.includes(2 * i) ? "?" : row.value}${row.prime === undefined ? "" : ` chia cho ${hide.includes(2 * i + 1) ? "?" : row.prime}`}`,
    )
    .join("; ")}`;

  const draw = (step: number) => {
    const reach = mode === "still" ? rows.length : step;
    // The division that led to the newest row; it stays on the last one.
    const previous = rows[Math.min(reach, rows.length - 1) - 1];
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <div className="flex">
          <ul className="flex flex-col border-foreground border-r-4">
            {rows.map((row, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are placed by position
              <li key={i}>
                <Reveal shown={i <= reach} placeholder={undefined}>
                  <span
                    className={`block min-w-20 px-3 py-0.5 text-right ${NUMBER}`}
                  >
                    {hide.includes(2 * i) ? <Hole /> : row.value}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col">
            {rows.map((row, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are placed by position
              <li key={i}>
                <Reveal shown={i <= reach} placeholder={undefined}>
                  <span
                    className={`block min-w-16 px-3 py-0.5 ${NUMBER} ${CONCEPT_CLASSES.sky.text}`}
                  >
                    {row.prime === undefined ? (
                      // Keeps the row as tall as the numbers on its left.
                      <span aria-hidden className="invisible">
                        0
                      </span>
                    ) : hide.includes(2 * i + 1) ? (
                      <Hole />
                    ) : (
                      row.prime
                    )}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        {hide.length === 0 && mode !== "still" && (
          <div className="min-h-10 w-full" aria-live="polite">
            <Reveal shown={previous !== undefined} placeholder={<Pending />}>
              {previous?.prime !== undefined && (
                <p className="text-center">
                  <Formula
                    tex={`${previous.value} : ${previous.prime} = ${previous.value / previous.prime}`}
                    className="text-block"
                  />
                </p>
              )}
            </Reveal>
          </div>
        )}
        {showProduct && (
          <div className="w-full">
            <Reveal
              shown={mode === "still" || (!hint && step >= rows.length)}
              placeholder={<Pending />}
            >
              <FormulaRow
                row={{
                  tex: `${n} = ${productTex(factors)}`,
                  tag: { text: "Tích các thừa số nguyên tố", color: "amber" },
                }}
              />
            </Reveal>
          </div>
        )}
        <Legend items={[{ color: "sky", name: "Số chia: số nguyên tố" }]} />
      </div>
    );
  };

  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(rows.length)}
      </figure>
    );
  }
  const total = rows.length + (showProduct ? 1 : 0);
  return (
    <StepPlayer steps={total - (hint ? 1 : 0)} label={label}>
      {draw}
    </StepPlayer>
  );
}
