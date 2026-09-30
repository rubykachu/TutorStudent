"use client";

import { BeadGroup } from "@/visuals/shared/bead-group";
import { PowerText } from "@/visuals/shared/power-text";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { FactorCount, MATH_LINE } from "./parts";

const BASE = 2;
const M = 5;
const N = 3;
// Five factors, three of them taken away by the divisor, then the quotient.
const CROSS_STEP = 1;
const RESULT_STEP = 2;

export default function ChiaHaiLuyThua() {
  return (
    <StepPlayer steps={RESULT_STEP + 1} label="Chia hai luỹ thừa cùng cơ số 2">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <BeadGroup
            groups={[{ color: "blue", count: M, text: String(BASE) }]}
            merged
            crossed={step >= CROSS_STEP ? N : 0}
            label={
              step >= CROSS_STEP
                ? "Năm hạt số 2, gạch đi ba hạt, còn hai hạt"
                : "Năm hạt số 2"
            }
            scale={1}
            className="h-auto"
          />
          <p className={MATH_LINE}>
            <PowerText base={BASE} exponent={M} />
            <span>:</span>
            <PowerText base={BASE} exponent={N} />
          </p>
          <Reveal
            shown={step >= CROSS_STEP}
            placeholder={<FactorCount count="?" working={`${M} − ${N} =`} />}
          >
            <FactorCount count={M - N} working={`${M} − ${N} =`} />
          </Reveal>
          <Reveal
            shown={step >= RESULT_STEP}
            placeholder={
              <p className={`${MATH_LINE} px-4 py-1`}>
                <PowerText base={BASE} exponent={M} />
                <span>:</span>
                <PowerText base={BASE} exponent={N} />
                <span>=</span>
                <span>?</span>
              </p>
            }
          >
            <p className={`${MATH_LINE} rounded-lg bg-highlight px-4 py-1`}>
              <PowerText base={BASE} exponent={M} />
              <span>:</span>
              <PowerText base={BASE} exponent={N} />
              <span>=</span>
              <PowerText base={BASE} exponent={M - N} />
            </p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
