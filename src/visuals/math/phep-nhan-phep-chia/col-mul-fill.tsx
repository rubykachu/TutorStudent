"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatInteger } from "@/lib/number-format";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { stateStep, stateStepper } from "@/visuals/shared/markers";
import { planMultiplication } from "./col-mul-digits";
import { ColMulFigure, PRODUCT_COLOR } from "./col-mul-figure";
import { PRODUCT_PLACES, productState, spelledProduct } from "./validators-cot";

const BUTTON =
  "inline-flex size-touch shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

const START: VisualState = productState(0);

// The answer area of "đặt tính rồi điền tích": one digit per place value of
// the product, read from the left, each with its own up and down button. Zeros
// left of the first digit are dimmed, since they are not part of the number.
// The state is { thousands, hundreds, tens, ones }, each 0 to 9.
export default function ColMulFill({
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [own, setOwn] = useState<VisualState>(START);
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const value = spelledProduct(state) ?? 0;
  // The task's own column, the factors written and the product left blank.
  const plan =
    params?.a !== undefined && params.b !== undefined
      ? planMultiplication(params.a, params.b)
      : undefined;

  function change(key: string, digit: number) {
    const next = { ...own, [key]: digit };
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {plan && (
        <ColMulFigure
          plan={plan}
          shown={new Set()}
          label={`Đặt tính ${formatInteger(plan.a)} nhân ${formatInteger(plan.b)}`}
        />
      )}
      <p className="flex items-center gap-2 font-heading text-block font-semibold md:text-block-lg">
        <ConceptMark color={PRODUCT_COLOR} className="size-5" />
        {`Tích: ${formatInteger(value)}`}
      </p>
      <fieldset className="flex justify-center gap-3">
        <legend className="sr-only">Các chữ số của tích</legend>
        {PRODUCT_PLACES.map(({ key, value: place, label }) => {
          const digit = state[key] ?? 0;
          const leading = digit === 0 && place > 1 && value < place;
          const name = label.toLocaleLowerCase("vi");
          return (
            <fieldset
              key={key}
              className="flex flex-col items-center gap-1"
              {...stateStepper(key, digit)}
            >
              <legend className="mx-auto text-caption text-muted-foreground">
                {label}
              </legend>
              <button
                type="button"
                className={BUTTON}
                aria-label={`Tăng chữ số hàng ${name}`}
                {...stateStep(key, "up")}
                disabled={locked || digit >= 9}
                onClick={() => change(key, digit + 1)}
              >
                <ChevronUp aria-hidden className="size-6" />
              </button>
              <output
                aria-live="polite"
                className={`flex h-14 min-w-12 items-center justify-center rounded-lg border-2 border-border bg-muted font-heading text-title font-bold tabular-nums ${CONCEPT_CLASSES[PRODUCT_COLOR].text} ${leading ? "opacity-35" : ""}`}
              >
                {digit}
              </output>
              <button
                type="button"
                className={BUTTON}
                aria-label={`Giảm chữ số hàng ${name}`}
                {...stateStep(key, "down")}
                disabled={locked || digit <= 0}
                onClick={() => change(key, digit - 1)}
              >
                <ChevronDown aria-hidden className="size-6" />
              </button>
            </fieldset>
          );
        })}
      </fieldset>
    </div>
  );
}
