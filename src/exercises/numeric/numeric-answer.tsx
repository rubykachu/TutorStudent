"use client";

import { type KeyboardEvent, useState } from "react";
import { AnswerHighlight, surfaceFor } from "@/exercises/answer-highlight";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { NumericInput } from "@/exercises/input";
import {
  DIGITS,
  type Digit,
  NumberPad,
  type PadKey,
} from "@/exercises/number-pad";
import type { NumericExercise } from "@/schema/content";
import {
  applyPadKey,
  EMPTY_NUMERIC,
  formatNumber,
  type NumericSlot,
} from "./edit";

type NumericAnswerProps = {
  exercise: NumericExercise;
  slot: AnswerSlotProps<NumericInput>;
};

const NO_COMMA: ReadonlySet<PadKey> = new Set(["comma"]);

function revealedInput(exercise: NumericExercise): NumericInput {
  const { answer } = exercise;
  return answer.kind === "power"
    ? {
        type: "numeric",
        kind: "power",
        base: formatNumber(answer.base),
        exponent: formatNumber(answer.exponent),
      }
    : { type: "numeric", kind: "value", value: formatNumber(answer.value) };
}

// Physical keyboards (and switch access) type the same keys as the pad.
function padKeyOf(event: KeyboardEvent): PadKey | undefined {
  if ((DIGITS as readonly string[]).includes(event.key))
    return event.key as Digit;
  if (event.key === "," || event.key === ".") return "comma";
  if (event.key === "Backspace") return "backspace";
  if (event.key === "^") return "power";
  return undefined;
}

export function NumericAnswer({ exercise, slot }: NumericAnswerProps) {
  const { value, onChange, disabled, highlight, reveal } = slot;
  const [powerFocus, setPowerFocus] = useState<NumericSlot>("exponent");
  const shown = reveal ? revealedInput(exercise) : (value ?? EMPTY_NUMERIC);
  const focus: NumericSlot = shown.kind === "value" ? "value" : powerFocus;

  function press(key: PadKey) {
    if (disabled) return;
    const edit = applyPadKey(value, focus, key);
    if (edit.focus !== "value") setPowerFocus(edit.focus);
    onChange(edit.input);
  }

  // A plain value checked against a power answer: point at the "mũ" key.
  const powerHint =
    shown.kind === "value"
      ? (highlight.get("exponent") ?? highlight.get("base"))
      : undefined;

  const box = (
    id: NumericSlot,
    text: string,
    label: string,
    size: string,
    offset = "",
  ) => {
    const spec: HighlightSpec | undefined = highlight.get(id);
    const focused = !disabled && focus === id;
    return (
      <AnswerHighlight spec={spec} className={offset}>
        <button
          type="button"
          aria-label={`${label}: ${text === "" ? "chưa nhập" : text}`}
          disabled={disabled}
          data-slot={id}
          data-focused={focused || undefined}
          onClick={() => {
            if (id !== "value") setPowerFocus(id);
          }}
          className={`flex items-center justify-center rounded-lg px-3 font-bold tabular-nums ${size} ${
            focused
              ? `border-3 border-primary ${surfaceFor(spec)}`
              : `border-2 border-border ${surfaceFor(spec)}`
          } ${reveal ? "text-correct-soft-foreground" : ""}`}
        >
          {text}
        </button>
      </AnswerHighlight>
    );
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: forwards typed keys from the focused slot buttons to the pad
    <div
      className="flex flex-col items-center gap-6"
      data-reveal={reveal || undefined}
      onKeyDown={(event) => {
        const key = padKeyOf(event);
        if (!key) return;
        event.preventDefault();
        press(key);
      }}
    >
      <div className="flex min-h-20 items-center gap-3">
        {shown.kind === "value" ? (
          box(
            "value",
            shown.value,
            "Đáp số",
            "h-16 min-w-32 text-title md:text-title-lg",
          )
        ) : (
          <span className="flex items-start gap-1">
            {box(
              "base",
              shown.base,
              "Cơ số",
              "h-16 min-w-20 text-title md:text-title-lg",
              // Drops the base below the raised exponent, as a power is written.
              "mt-4",
            )}
            {box(
              "exponent",
              shown.exponent,
              "Số mũ",
              "h-12 min-w-12 text-block md:text-block-lg",
            )}
          </span>
        )}
        {exercise.unit && <span className="text-body-lg">{exercise.unit}</span>}
      </div>
      <NumberPad
        onKey={press}
        disabled={disabled}
        disabledKeys={focus === "exponent" ? NO_COMMA : undefined}
        powerActive={focus === "exponent"}
        powerHighlight={powerHint}
      />
    </div>
  );
}
