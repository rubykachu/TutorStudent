"use client";

import { formatInteger } from "@/lib/number-format";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { Mode } from "./catalog";
import {
  litIds,
  type Plan,
  planMultiplication,
  SETUP_SENTENCE,
  shownAfter,
  stepSentence,
} from "./col-mul-digits";
import { ColMulFigure, figureLabel, Legend, legendFor } from "./col-mul-figure";

// Two lines of the sentence under the figure are always reserved, so the
// figure never jumps between steps.
const SENTENCE =
  "min-h-[3.4rem] max-w-prose text-center text-body md:text-body-lg";

// The finished written calculation, no animation.
function Still({ plan }: { plan: Plan }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ColMulFigure
        plan={plan}
        shown={shownAfter(plan, plan.steps.length)}
        label={figureLabel(plan, true)}
      />
      <Legend items={legendFor(plan)} />
    </div>
  );
}

// Column multiplication walked one digit at a time. Step 0 sets the numbers
// up, each next step multiplies one digit of a by one digit of b, and for a
// two-digit b the last step adds the partial products. A hint stops on that
// last step with its result left as "?".
function Steps({ plan, hint }: { plan: Plan; hint: boolean }) {
  const steps = plan.steps.length + 1;
  return (
    <StepPlayer
      steps={steps}
      label={`Nhân ${formatInteger(plan.a)} với ${formatInteger(plan.b)} bằng cách đặt tính`}
    >
      {(step) => {
        const current = plan.steps[step - 1];
        const hideResult = hint && step === steps - 1;
        const shown = shownAfter(plan, hideResult ? step - 1 : step);
        return (
          <div className="flex w-full flex-col items-center gap-3">
            <ColMulFigure
              plan={plan}
              shown={shown}
              lit={new Set(current ? litIds(current) : [])}
              label={figureLabel(plan, !hint && step === steps - 1)}
            />
            {plan.bDigits.length === 1 && <Legend items={legendFor(plan)} />}
            <p className={SENTENCE} aria-live="polite">
              {current ? stepSentence(current, hideResult) : SETUP_SENTENCE}
            </p>
          </div>
        );
      }}
    </StepPlayer>
  );
}

export function ColMul({ a, b, mode }: { a: number; b: number; mode: Mode }) {
  const plan = planMultiplication(a, b);
  return mode === "still" ? (
    <Still plan={plan} />
  ) : (
    <Steps plan={plan} hint={mode === "hint"} />
  );
}
