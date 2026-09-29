"use client";

import { useState } from "react";
import { formatInteger } from "@/lib/number-format";
import type { VisualProps } from "@/visuals/registry";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { PowerText } from "@/visuals/shared/power-text";
import { FactorRow, MATH_LINE } from "./parts";

const BASE = 10;
const EXPONENT = { min: 1, max: 6 } as const;
const START = 2;

// 10ⁿ is 1 followed by n zeros: the zeros take the exponent colour so the
// child sees that their count is the exponent.
function ZerosInColour({ value }: { value: string }) {
  return (
    <span className="whitespace-nowrap">
      {[...value].map((char, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: digits never reorder
          key={i}
          className={char === "0" ? "text-concept-violet" : undefined}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function LuyThuaCua10({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [ownExponent, setOwnExponent] = useState(START);
  const exponent = shownState?.exponent ?? ownExponent;
  const locked = disabled || shownState !== undefined;
  const value = formatInteger(BigInt(10) ** BigInt(exponent));

  function update(next: number) {
    setOwnExponent(next);
    onStateChange?.({ base: BASE, exponent: next });
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <NumberStepper
        label="Số mũ"
        color="violet"
        value={exponent}
        {...EXPONENT}
        disabled={locked}
        onChange={update}
      />
      <div className="flex flex-col items-center gap-2" aria-live="polite">
        <p className={MATH_LINE}>
          <PowerText base={BASE} exponent={exponent} />
          <span>=</span>
          {exponent > 1 && (
            <>
              <FactorRow base={BASE} count={exponent} maxShown={4} />
              <span>=</span>
            </>
          )}
          <ZerosInColour value={value} />
        </p>
        <p className="flex items-center gap-2 text-body text-concept-violet md:text-body-lg">
          <ConceptMark color="violet" className="size-4" />
          {`${exponent} chữ số 0`}
        </p>
      </div>
    </div>
  );
}
