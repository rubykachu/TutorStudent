"use client";

import { useState } from "react";
import { formatInteger } from "@/lib/number-format";
import type { VisualProps } from "@/visuals/registry";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { PowerText } from "@/visuals/shared/power-text";
import { FactorCount, FactorRow, MATH_LINE } from "./parts";
import { BUILDER_BASE, BUILDER_EXPONENT } from "./validators";

const START = { base: 2, exponent: 3 };

// The child picks a base and an exponent and sees the power unfold into its
// equal factors: one bead per factor, then the product and its value.
export default function TaoLuyThua({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [own, setOwn] = useState(START);
  const base = shownState?.base ?? own.base;
  const exponent = shownState?.exponent ?? own.exponent;
  const locked = disabled || shownState !== undefined;

  function update(next: { base: number; exponent: number }) {
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 md:gap-x-8">
        <NumberStepper
          label="Cơ số"
          stateKey="base"
          color="blue"
          value={base}
          {...BUILDER_BASE}
          disabled={locked}
          onChange={(value) => update({ base: value, exponent })}
        />
        <NumberStepper
          label="Số mũ"
          stateKey="exponent"
          color="violet"
          value={exponent}
          {...BUILDER_EXPONENT}
          disabled={locked}
          onChange={(value) => update({ base, exponent: value })}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        <BeadGroup
          groups={[{ color: "blue", count: exponent, text: String(base) }]}
          merged
          label={`${exponent} hạt, mỗi hạt là số ${base}`}
          scale={1}
          className="h-auto"
        />
        <FactorCount count={exponent} />
      </div>
      <p className={MATH_LINE} aria-live="polite">
        <PowerText base={base} exponent={exponent} />
        <span>=</span>
        {exponent > 1 && (
          <>
            {/* Two-digit factors collapse sooner so the line fits a phone. */}
            <FactorRow
              base={base}
              count={exponent}
              maxShown={base >= 10 ? 4 : 6}
            />
            <span>=</span>
          </>
        )}
        <span className="whitespace-nowrap">
          {formatInteger(base ** exponent)}
        </span>
      </p>
    </div>
  );
}
