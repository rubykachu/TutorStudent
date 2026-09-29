"use client";

import { Fragment } from "react";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Highlight } from "@/visuals/shared/highlight";
import { PowerText } from "@/visuals/shared/power-text";
import { StepPlayer } from "@/visuals/shared/step-player";
import { MATH_LINE, Reveal } from "./parts";

// Hint for a product with a lone factor, e.g. 3⁴ · 3: the lone 3 is 3¹, so
// its exponent 1 joins the sum. It stops before the sum's value, which is the
// question's answer. `exponents` lists each factor's exponent; 1 is written
// as the bare base until the second step reveals it.
const REVEAL_STEP = 1;
const SUM_STEP = 2;

export function HiddenExponentOne({
  base,
  exponents,
}: {
  base: number;
  exponents: readonly number[];
}) {
  return (
    <StepPlayer steps={SUM_STEP + 1} label={`Số ${base} viết là ${base} mũ 1`}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <p className={MATH_LINE}>
            {exponents.map((exponent, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: factors never reorder
              <Fragment key={i}>
                {i > 0 && <span>·</span>}
                {exponent === 1 && step < REVEAL_STEP ? (
                  <span className="text-concept-blue">{base}</span>
                ) : (
                  <Highlight
                    active={exponent === 1}
                    color="violet"
                    className="mx-1 px-1"
                  >
                    <PowerText base={base} exponent={exponent} />
                  </Highlight>
                )}
              </Fragment>
            ))}
          </p>
          <Reveal shown={step >= REVEAL_STEP}>
            <p className={MATH_LINE}>
              <span className="text-concept-blue">{base}</span>
              <span>=</span>
              <PowerText base={base} exponent={1} />
            </p>
          </Reveal>
          <Reveal shown={step >= SUM_STEP}>
            <p className="flex items-center gap-2 text-body text-concept-violet md:text-body-lg">
              <ConceptMark color="violet" className="size-4" />
              {`${exponents.join(" + ")} = ? thừa số`}
            </p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
