"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { FormulaRow, Pending, type Row } from "@/visuals/shared/formula-rows";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { digitsOf, divisible, verdictTex } from "./logic";
import { DigitRow } from "./tiles";

// The digits of a number, the last one picked out, then the verdict it gives.
// With divisor 0 there is no verdict: the picture ends on the picked digit.
// In a hint the last step stays a dimmed "?" and is never revealed.
export function Digits({ spec }: { spec: SpecOf<"digits"> }) {
  const { n, divisor, mode } = spec;
  const digits = digitsOf(n);
  const lastIndex = digits.length - 1;
  const last = digits[lastIndex];
  const hint = mode === "hint";
  const withVerdict = divisor > 0;
  const verdict: Row = {
    tex: verdictTex(n, divisor),
    tag: { text: `tận cùng ${last}`, color: "teal" },
  };
  const label = hint
    ? `Số ${n}: xét chữ số tận cùng${withVerdict ? ` để biết có chia hết cho ${divisor} không` : ""}`
    : !withVerdict
      ? `Số ${n} có chữ số tận cùng ${last}`
      : `Số ${n} có chữ số tận cùng ${last}, nên ${divisible(n, divisor) ? "chia hết" : "không chia hết"} cho ${divisor}`;

  const draw = (step: number) => (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-fit max-w-full flex-col items-end gap-1">
        <DigitRow
          digits={digits}
          picked={step >= 1 ? lastIndex : undefined}
          label={`Các chữ số: ${digits.join(", ")}`}
        />
        <Reveal
          shown={step >= 1}
          placeholder={hint && !withVerdict ? <Pending /> : undefined}
        >
          <p
            className={`flex items-center gap-2 text-caption ${CONCEPT_CLASSES.teal.text}`}
          >
            <ConceptMark color="teal" className="size-4" />
            Chữ số tận cùng
          </p>
        </Reveal>
      </div>
      {withVerdict && (
        <div className="w-full" aria-live="polite">
          <Reveal shown={step >= 2 && !hint} placeholder={<Pending />}>
            <FormulaRow row={verdict} />
          </Reveal>
        </div>
      )}
    </div>
  );

  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(withVerdict ? 2 : 1)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={(withVerdict ? 3 : 2) - (hint ? 1 : 0)} label={label}>
      {draw}
    </StepPlayer>
  );
}
