"use client";

import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { PowerText } from "@/visuals/shared/power-text";
import { FactorCount, MATH_LINE } from "./parts";
import { DIVIDE_EXPONENT } from "./validators";

const BASE = 2;
const START = { m: 4, n: 1 };

// The child picks both exponents of 2ᵐ : 2ⁿ (m ≥ n) and sees the divisor
// cross out n of the m factors; equal exponents leave 2⁰ = 1.
export default function BotLuyThua({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [own, setOwn] = useState(START);
  const m = shownState?.m ?? own.m;
  const n = shownState?.n ?? own.n;
  const locked = disabled || shownState !== undefined;
  const rest = m - n;

  function update(next: { m: number; n: number }) {
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 md:gap-x-8">
        <NumberStepper
          label="Số mũ thứ nhất"
          color="violet"
          value={m}
          {...DIVIDE_EXPONENT}
          disabled={locked}
          // The divisor's exponent may not exceed the dividend's.
          onChange={(value) => update({ m: value, n: Math.min(n, value) })}
        />
        <NumberStepper
          label="Số mũ thứ hai"
          color="violet"
          value={n}
          min={DIVIDE_EXPONENT.min}
          max={m}
          disabled={locked}
          onChange={(value) => update({ m, n: value })}
        />
      </div>
      <BeadGroup
        groups={[{ color: "blue", count: m, text: String(BASE) }]}
        merged
        crossed={n}
        label={`${m} hạt số 2, gạch đi ${n} hạt, còn ${rest} hạt`}
        scale={1}
        className="h-auto"
      />
      <p className={MATH_LINE} aria-live="polite">
        <PowerText base={BASE} exponent={m} />
        <span>:</span>
        <PowerText base={BASE} exponent={n} />
        <span>=</span>
        <PowerText base={BASE} exponent={rest} />
        {rest === 0 && (
          <>
            <span>=</span>
            <span>1</span>
          </>
        )}
      </p>
      <FactorCount count={rest} working={`${m} − ${n} =`} />
    </div>
  );
}
