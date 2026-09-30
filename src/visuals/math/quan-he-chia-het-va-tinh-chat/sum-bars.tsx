"use client";

import { Formula } from "@/components/blocks/formula";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { packBags } from "./logic";
import { BagBox } from "./parts";

type Spec = SpecOf<"sumBars">;

const LABELS = {
  plus: ["Số hạng thứ nhất", "Số hạng thứ hai", "Tổng"],
  minus: ["Số bị trừ", "Số trừ", "Hiệu"],
} as const;

// `count` items packed into bags of `m`; what does not fill a bag is left over.
function BagRow({ count, m }: { count: number; m: number }) {
  const { bags, left } = packBags(count, m);
  return (
    <div className="flex flex-wrap items-end justify-center gap-1.5">
      {Array.from({ length: bags }, (_, i) => (
        <BagBox
          // biome-ignore lint/suspicious/noArrayIndexKey: bags never reorder
          key={i}
          count={m}
          size={m}
          tone="bag"
          compact
          label={`Túi ${i + 1}: ${m} cái`}
        />
      ))}
      {left > 0 && (
        <BagBox
          count={left}
          size={m}
          tone="left"
          compact
          label={`Còn thừa ${left} cái`}
        />
      )}
    </div>
  );
}

function Operand({
  label,
  count,
  m,
}: {
  label: string;
  count: number;
  m: number;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <p className="text-center text-caption font-semibold">{`${label}: ${count}`}</p>
      <BagRow count={count} m={m} />
    </div>
  );
}

// Equation lines under the rows: the operation, then whether the result is a
// multiple of `m`. In the plus case the numbers carry the colours of the sum.
function Equations({ spec }: { spec: Spec }) {
  const { a, b, m, op } = spec;
  const result = op === "plus" ? a + b : a - b;
  const sign = op === "plus" ? "+" : "-";
  const paint =
    op === "plus"
      ? {
          a: `\\concept{blue}{${a}}`,
          b: `\\concept{blue}{${b}}`,
          r: `\\concept{amber}{${result}}`,
        }
      : { a: `${a}`, b: `${b}`, r: `${result}` };
  const relation = result % m === 0 ? "\\chiahet" : "\\khongchiahet";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Formula
        tex={`${paint.a} ${sign} ${paint.b} = ${paint.r}`}
        className="text-body-lg md:text-block"
      />
      <Formula
        tex={`${paint.r} ${relation} \\concept{violet}{${m}}`}
        className="text-body-lg md:text-block"
      />
    </div>
  );
}

function SumBarsView({ spec, step }: { spec: Spec; step: number }) {
  const { a, b, m, op, mode } = spec;
  const hint = mode === "hint";
  const labels = LABELS[op];
  const result = op === "plus" ? a + b : a - b;
  const all = mode === "still";
  const resultShown = all || (!hint && step >= 2);
  const legend = [
    { color: "violet", name: `Một túi ${m} cái` },
    { color: "pink", name: "Còn thừa" },
  ] as const;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Operand label={labels[0]} count={a} m={m} />
      <Reveal
        shown={all || step >= 1}
        placeholder={<Operand label={labels[1]} count={b} m={m} />}
      >
        <Operand label={labels[1]} count={b} m={m} />
      </Reveal>
      <Reveal
        shown={resultShown}
        placeholder={
          <p className="text-center font-heading text-block font-bold text-muted-foreground">
            {`${labels[2]}: ?`}
          </p>
        }
      >
        <Operand label={labels[2]} count={result} m={m} />
      </Reveal>
      <Reveal shown={resultShown}>
        <Equations spec={spec} />
      </Reveal>
      <Legend items={legend} />
    </div>
  );
}

export function SumBars({ spec }: { spec: Spec }) {
  const { a, b, m, op } = spec;
  const word = op === "plus" ? "cộng" : "trừ";
  const label = `Hai nhóm ${a} và ${b} cái, xếp vào các túi ${m} cái, rồi ${word} hai nhóm`;
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <SumBarsView spec={spec} step={2} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={spec.mode === "hint" ? 2 : 3} label={label}>
      {(step) => <SumBarsView spec={spec} step={step} />}
    </StepPlayer>
  );
}
