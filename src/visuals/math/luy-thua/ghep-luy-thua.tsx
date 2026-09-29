"use client";

import { Combine, Split } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { PowerText } from "@/visuals/shared/power-text";
import { ACTION_BUTTON, FactorCount, MATH_LINE, Reveal } from "./parts";
import { MULTIPLY_EXPONENT } from "./validators";

const BASE = 2;
const START = { m: 1, n: 1 };

// The child picks both exponents of 2ᵐ · 2ⁿ and merges the two groups of
// factors to see that the exponents add up.
export default function GhepLuyThua({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [own, setOwn] = useState(START);
  const [ownMerged, setOwnMerged] = useState(false);
  const m = shownState?.m ?? own.m;
  const n = shownState?.n ?? own.n;
  const merged = shownState !== undefined || ownMerged;
  const locked = disabled || shownState !== undefined;

  function update(next: { m: number; n: number }) {
    setOwn(next);
    // New groups start apart again, so the child merges them anew.
    setOwnMerged(false);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 md:gap-x-8">
        <NumberStepper
          label="Số mũ thứ nhất"
          stateKey="m"
          color="violet"
          value={m}
          {...MULTIPLY_EXPONENT}
          disabled={locked}
          onChange={(value) => update({ m: value, n })}
        />
        <NumberStepper
          label="Số mũ thứ hai"
          stateKey="n"
          color="violet"
          value={n}
          {...MULTIPLY_EXPONENT}
          disabled={locked}
          onChange={(value) => update({ m, n: value })}
        />
      </div>
      <BeadGroup
        groups={[
          { color: "blue", count: m },
          { color: "blue", count: n },
        ]}
        merged={merged}
        label={
          merged
            ? `${m + n} thừa số 2 xếp thành một hàng`
            : `${m} thừa số 2 và ${n} thừa số 2`
        }
        scale={1}
        className="h-auto"
      />
      <p className={MATH_LINE} aria-live="polite">
        <PowerText base={BASE} exponent={m} />
        <span>·</span>
        <PowerText base={BASE} exponent={n} />
        <span>=</span>
        {merged ? (
          <PowerText base={BASE} exponent={m + n} />
        ) : (
          <span className="text-muted-foreground">?</span>
        )}
      </p>
      <Reveal shown={merged}>
        <FactorCount count={m + n} working={`${m} + ${n} =`} />
      </Reveal>
      <button
        type="button"
        className={ACTION_BUTTON}
        disabled={locked}
        onClick={() => setOwnMerged(!ownMerged)}
      >
        {merged ? (
          <Split aria-hidden className="size-5" />
        ) : (
          <Combine aria-hidden className="size-5" />
        )}
        {merged ? "Tách ra" : "Ghép lại"}
      </button>
    </div>
  );
}
