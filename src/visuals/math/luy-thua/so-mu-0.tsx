"use client";

import { BeadGroup } from "@/visuals/shared/bead-group";
import { PowerText } from "@/visuals/shared/power-text";
import { StepPlayer } from "@/visuals/shared/step-player";
import { FactorCount, FactorRow, MATH_LINE, Reveal } from "./parts";

const BASE = 2;
const EXPONENT = 3;
// 2³ : 2³ takes every factor away (exponent 0), yet a number divided by
// itself is 1, which is why 2⁰ is taken to be 1.
const CROSS_STEP = 1;
const VALUE_STEP = 2;
const RESULT_STEP = 3;

// "hint" (second wrong answer on a zero-exponent question) stops at
// "8 : 8 = ?", because the value 1 is that question's answer.
export type ZeroExponentMode = "hint" | "solution";

export function ZeroExponent({ mode }: { mode: ZeroExponentMode }) {
  const solution = mode === "solution";
  return (
    <StepPlayer
      steps={solution ? RESULT_STEP + 1 : VALUE_STEP + 1}
      label="Vì sao 2 mũ 0 bằng 1"
    >
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <BeadGroup
            groups={[{ color: "blue", count: EXPONENT, text: String(BASE) }]}
            merged
            crossed={step >= CROSS_STEP ? EXPONENT : 0}
            label={
              step >= CROSS_STEP
                ? "Ba hạt số 2, gạch hết cả ba hạt"
                : "Ba hạt số 2"
            }
            scale={1}
            className="h-auto"
          />
          {/* A div, not a p: the revealed part is a block element. */}
          <div className={MATH_LINE}>
            <PowerText base={BASE} exponent={EXPONENT} />
            <span>:</span>
            <PowerText base={BASE} exponent={EXPONENT} />
            <Reveal
              shown={step >= CROSS_STEP}
              placeholder={
                <>
                  <span>=</span>
                  <span>?</span>
                </>
              }
              className="flex items-baseline gap-x-3"
            >
              <span>=</span>
              <PowerText base={BASE} exponent={0} />
            </Reveal>
          </div>
          <Reveal
            shown={step >= CROSS_STEP}
            placeholder={
              <FactorCount count="?" working={`${EXPONENT} − ${EXPONENT} =`} />
            }
          >
            <FactorCount count={0} working={`${EXPONENT} − ${EXPONENT} =`} />
          </Reveal>
          <Reveal
            shown={step >= VALUE_STEP}
            placeholder={
              <p className={MATH_LINE}>
                <PowerText base={BASE} exponent={EXPONENT} />
                <span>= ?</span>
              </p>
            }
            className="flex flex-col gap-1"
          >
            {/* Links the dividend to 8, so "8 : 8" does not appear from nowhere. */}
            <p className={MATH_LINE}>
              <PowerText base={BASE} exponent={EXPONENT} />
              <span>=</span>
              <FactorRow base={BASE} count={EXPONENT} />
              <span>=</span>
              <span>8</span>
            </p>
            <p className={MATH_LINE}>
              <span>8</span>
              <span>:</span>
              <span>8</span>
              <span>=</span>
              <span>{solution ? 1 : "?"}</span>
            </p>
          </Reveal>
          {solution && (
            <Reveal
              shown={step >= RESULT_STEP}
              placeholder={
                <p className={`${MATH_LINE} px-4 py-1`}>
                  <PowerText base={BASE} exponent={0} />
                  <span>= ?</span>
                </p>
              }
            >
              <p className={`${MATH_LINE} rounded-lg bg-highlight px-4 py-1`}>
                <PowerText base={BASE} exponent={0} />
                <span>=</span>
                <span>1</span>
              </p>
            </Reveal>
          )}
        </div>
      )}
    </StepPlayer>
  );
}
