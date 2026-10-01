"use client";

import { Check } from "lucide-react";
import { FormulaRow, type Mode, Pending } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { exponentOf, gcdOf, primesOf, texPower } from "./logic";

// The prime factors of several numbers side by side, one column per prime
// (named in the heading row): the picture of "find the greatest common divisor
// by factorising". A prime a number lacks leaves its cell empty (a dashed
// slot), never a dash that could read as a minus. Columns whose prime is in
// every number are the shared ones; each keeps its smallest exponent, and the
// product of those powers is the answer.

// What the table draws: the numbers and how it plays (a hint stops after the
// shared primes are picked out).
export type ExpTableSpec = { numbers: readonly number[]; mode: Mode };

function Power({ p, e }: { p: number; e: number }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-concept-blue">{p}</span>
      {e > 1 && <sup className="text-body text-concept-violet">{e}</sup>}
    </span>
  );
}

const CELL =
  "flex min-h-11 items-center justify-center rounded-lg font-heading text-block font-bold tabular-nums";

// The cell of a prime the number does not have.
function EmptySlot() {
  return (
    <span
      aria-hidden
      className="size-6 rounded-md border-2 border-dashed border-muted-foreground/60"
    />
  );
}

// Tex of the result: the shared powers multiplied, then their value.
function resultTex(numbers: readonly number[], shared: readonly number[]) {
  const powers = shared.map((p) =>
    texPower(p, Math.min(...numbers.map((n) => exponentOf(n, p)))),
  );
  return `${powers.join(" \\cdot ")} = \\concept{amber}{${gcdOf(numbers)}}`;
}

export function ExpTable({ spec }: { spec: ExpTableSpec }) {
  const { numbers, mode } = spec;
  const hint = mode === "hint";
  const primes = primesOf(numbers);
  const shared = primes.filter((p) =>
    numbers.every((n) => exponentOf(n, p) > 0),
  );
  const label = `Các thừa số nguyên tố của ${numbers.join(", ")} và ước chung lớn nhất`;

  const draw = (step: number) => {
    const picked = mode === "still" || step >= 1;
    const smallest = !hint && (mode === "still" || step >= 2);
    const done = !hint && (mode === "still" || step >= 3);
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <div
          role="img"
          aria-label={label}
          className="grid w-full gap-1.5"
          style={{
            gridTemplateColumns: `minmax(4.5rem, auto) repeat(${primes.length}, minmax(2.75rem, 1fr))`,
          }}
        >
          <Row head="Thừa số">
            {primes.map((p) => (
              <span key={p} className={`${CELL} text-concept-blue`}>
                {p}
              </span>
            ))}
          </Row>
          {numbers.map((n) => (
            <Row key={n} head={`${n} =`}>
              {primes.map((p) => {
                const e = exponentOf(n, p);
                const isShared = shared.includes(p);
                return (
                  <span
                    key={p}
                    className={`${CELL} ${picked && isShared ? "border-2 border-concept-blue bg-concept-blue/15" : "border-2 border-transparent"} ${picked && !isShared ? "opacity-50" : ""}`}
                  >
                    {e > 0 ? <Power p={p} e={e} /> : <EmptySlot />}
                  </span>
                );
              })}
            </Row>
          ))}
          <Row head="Chung">
            {primes.map((p) => (
              <Reveal
                key={p}
                shown={picked}
                className="flex min-h-11 items-center justify-center"
              >
                {shared.includes(p) && (
                  <Check
                    aria-label={`${p} có ở mọi số`}
                    className="size-6 text-concept-blue"
                    strokeWidth={3}
                  />
                )}
              </Reveal>
            ))}
          </Row>
          <Row head="Số mũ nhỏ nhất">
            {primes.map((p) => (
              <Reveal
                key={p}
                shown={smallest}
                placeholder={<Pending />}
                className="flex min-h-11 items-center justify-center"
              >
                {shared.includes(p) && (
                  <span className={`${CELL} text-concept-violet`}>
                    {Math.min(...numbers.map((n) => exponentOf(n, p)))}
                  </span>
                )}
              </Reveal>
            ))}
          </Row>
        </div>
        <div className="min-h-[3.25rem] w-full" aria-live="polite">
          <Reveal shown={done} placeholder={<Pending />}>
            <FormulaRow row={{ tex: resultTex(numbers, shared) }} />
          </Reveal>
        </div>
        <Legend
          items={[
            { color: "blue", name: "Thừa số nguyên tố" },
            { color: "violet", name: "Số mũ" },
            ...(done
              ? [{ color: "amber" as const, name: "Ước chung lớn nhất" }]
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

// One row of the table: its heading, then one cell per prime.
function Row({ head, children }: { head: string; children: React.ReactNode }) {
  return (
    <>
      <span className="flex min-h-11 items-center font-heading text-body font-bold">
        {head}
      </span>
      {children}
    </>
  );
}
