"use client";

import { FormulaRow, type Mode, Pending } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  exponentOf,
  largestExponent,
  lcmOf,
  primesOf,
  texPower,
} from "./logic";

// The prime factors of several numbers side by side, one column per prime
// (named in the heading row): the picture of "find the least common multiple
// by factorising". A prime a number lacks leaves its cell empty (a dashed
// slot), never a dash that could read as a minus. Every prime is used; each
// keeps its largest exponent, and the product of those powers is the answer.

// What the table draws: the numbers and how it plays (a hint stops after the
// largest exponents are picked out).
export type BcnnTableSpec = { numbers: readonly number[]; mode: Mode };

function Power({ p, e }: { p: number; e: number }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-concept-sky">{p}</span>
      {e > 1 && <sup className="text-body text-concept-violet">{e}</sup>}
    </span>
  );
}

const CELL =
  "flex min-h-10 items-center justify-center rounded-lg font-heading text-block font-bold tabular-nums";

// The cell of a prime the number does not have.
function EmptySlot() {
  return (
    <span
      aria-hidden
      className="size-6 rounded-md border-2 border-dashed border-muted-foreground/60"
    />
  );
}

// Tex of the result: the chosen powers multiplied, then their value.
function resultTex(numbers: readonly number[], primes: readonly number[]) {
  const powers = primes.map((p) => texPower(p, largestExponent(numbers, p)));
  return `${powers.join(" \\cdot ")} = \\concept{pink}{${lcmOf(numbers)}}`;
}

// One row of the table: its heading, then one cell per prime.
function Row({ head, children }: { head: string; children: React.ReactNode }) {
  return (
    <>
      <span className="flex min-h-10 items-center font-heading text-body font-bold">
        {head}
      </span>
      {children}
    </>
  );
}

export function BcnnTable({ spec }: { spec: BcnnTableSpec }) {
  const { numbers, mode } = spec;
  const hint = mode === "hint";
  const primes = primesOf(numbers);
  const label = `Các thừa số nguyên tố của ${numbers.join(", ")} và bội chung nhỏ nhất`;

  const draw = (step: number) => {
    const picked = mode === "still" || step >= 1;
    const largest = !hint && (mode === "still" || step >= 2);
    const done = !hint && (mode === "still" || step >= 3);
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <div
          role="img"
          aria-label={label}
          className="grid w-full gap-x-1.5 gap-y-1"
          style={{
            gridTemplateColumns: `minmax(4.5rem, auto) repeat(${primes.length}, minmax(2.75rem, 1fr))`,
          }}
        >
          <Row head="Thừa số">
            {primes.map((p) => (
              <span key={p} className={`${CELL} text-concept-sky`}>
                {p}
              </span>
            ))}
          </Row>
          {numbers.map((n) => (
            <Row key={n} head={`${n} =`}>
              {primes.map((p) => {
                const e = exponentOf(n, p);
                const isLargest = e > 0 && e === largestExponent(numbers, p);
                return (
                  <span
                    key={p}
                    className={`${CELL} border-2 ${picked && isLargest ? "border-concept-violet bg-concept-violet/15" : "border-transparent"} ${picked && !isLargest ? "opacity-50" : ""}`}
                  >
                    {e > 0 ? <Power p={p} e={e} /> : <EmptySlot />}
                  </span>
                );
              })}
            </Row>
          ))}
          <Row head="Số mũ lớn nhất">
            {primes.map((p) => (
              <Reveal
                key={p}
                shown={largest}
                placeholder={<Pending />}
                className="flex min-h-10 items-center justify-center"
              >
                <span className={`${CELL} text-concept-violet`}>
                  {largestExponent(numbers, p)}
                </span>
              </Reveal>
            ))}
          </Row>
        </div>
        <div className="min-h-[3.25rem] w-full" aria-live="polite">
          <Reveal shown={done} placeholder={<Pending />}>
            <FormulaRow row={{ tex: resultTex(numbers, primes) }} />
          </Reveal>
        </div>
        <Legend
          items={[
            { color: "sky", name: "Số nguyên tố" },
            { color: "violet", name: "Số mũ" },
            ...(done
              ? [{ color: "pink" as const, name: "Bội chung nhỏ nhất" }]
              : []),
          ]}
        />
      </div>
    );
  };
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(3)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? 2 : 4} label={label}>
      {draw}
    </StepPlayer>
  );
}
