"use client";

import { BeadGroup } from "@/visuals/shared/bead-group";
import { PowerText } from "@/visuals/shared/power-text";
import { StepPlayer } from "@/visuals/shared/step-player";
import { FactorCount, FactorRow, MATH_LINE, Reveal } from "./parts";

const BASE = 3;
const M = 2;
const N = 4;
// The two powers, their factors side by side, the groups merged into one
// row with the count added up, then the product written as one power.
const FACTORS_STEP = 1;
const MERGED_STEP = 2;
const RESULT_STEP = 3;

export default function NhanHaiLuyThua() {
  return (
    <StepPlayer steps={RESULT_STEP + 1} label="Nhân hai luỹ thừa cùng cơ số 3">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <BeadGroup
            groups={[
              { color: "blue", count: M, text: String(BASE) },
              { color: "blue", count: N, text: String(BASE) },
            ]}
            merged={step >= MERGED_STEP}
            label={
              step >= MERGED_STEP
                ? "Sáu hạt số 3 xếp thành một hàng"
                : "Hai hạt số 3 và bốn hạt số 3"
            }
            scale={1}
            className="h-auto"
          />
          <p className={MATH_LINE}>
            <PowerText base={BASE} exponent={M} />
            <span>·</span>
            <PowerText base={BASE} exponent={N} />
          </p>
          <Reveal shown={step >= FACTORS_STEP}>
            <p className="flex flex-wrap items-baseline justify-center gap-x-2 font-heading text-block font-bold md:text-block-lg">
              <span>=</span>
              <span>
                (<FactorRow base={BASE} count={M} />)
              </span>
              <span>·</span>
              <span>
                (<FactorRow base={BASE} count={N} />)
              </span>
            </p>
          </Reveal>
          <Reveal shown={step >= MERGED_STEP}>
            <FactorCount count={M + N} working={`${M} + ${N} =`} />
          </Reveal>
          <Reveal shown={step >= RESULT_STEP}>
            <p className={`${MATH_LINE} rounded-lg bg-highlight px-4 py-1`}>
              <PowerText base={BASE} exponent={M} />
              <span>·</span>
              <PowerText base={BASE} exponent={N} />
              <span>=</span>
              <PowerText base={BASE} exponent={M + N} />
            </p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
