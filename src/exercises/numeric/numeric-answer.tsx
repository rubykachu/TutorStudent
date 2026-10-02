"use client";

import { Keyboard } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { AnswerHighlight, WRONG_TONE } from "@/exercises/answer-highlight";
import {
  type AnswerSlotProps,
  COLLAPSED_INPUT_CLASS,
} from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { NumericInput } from "@/exercises/input";
import {
  DIGITS,
  type Digit,
  NumberPad,
  type PadKey,
} from "@/exercises/number-pad";
import { MINUS_SIGN } from "@/lib/number-format";
import type { NumericExercise } from "@/schema/content";
import { HINT_FALLBACK_COLOR } from "@/visuals/shared/highlight";
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

// An exponent is a whole, non-negative number.
const NO_COMMA_OR_MINUS: ReadonlySet<PadKey> = new Set(["comma", "minus"]);
// The same ring as an authored hint that names no concept.
const POWER_KEY_HINT: HighlightSpec = {
  color: HINT_FALLBACK_COLOR,
  strong: false,
};

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

// The comma key is offered only when the answer itself has decimals, so a
// whole-number answer never suggests typing one. Exponents are whole numbers.
export function needsDecimal(exercise: NumericExercise): boolean {
  const { answer } = exercise;
  return !Number.isInteger(
    answer.kind === "power" ? answer.base : answer.value,
  );
}

// The "mũ" key is offered only when the answer is a power (base and
// exponent), so other answers never show a key that does not apply.
export function needsPower(exercise: NumericExercise): boolean {
  return exercise.answer.kind === "power";
}

// Physical keyboards (and switch access) type the same keys as the pad.
function padKeyOf(event: KeyboardEvent): PadKey | undefined {
  if ((DIGITS as readonly string[]).includes(event.key))
    return event.key as Digit;
  if (event.key === "," || event.key === ".") return "comma";
  if (event.key === "-" || event.key === MINUS_SIGN) return "minus";
  if (event.key === "Backspace") return "backspace";
  if (event.key === "^") return "power";
  return undefined;
}

export function NumericAnswer({ exercise, slot }: NumericAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal } = slot;
  const [powerFocus, setPowerFocus] = useState<NumericSlot>("exponent");
  const shown = reveal ? revealedInput(exercise) : (value ?? EMPTY_NUMERIC);
  const focus: NumericSlot = shown.kind === "value" ? "value" : powerFocus;
  const decimal = needsDecimal(exercise);
  const power = needsPower(exercise);
  // While a hint or solution visual (or the revealed answer) is showing, the
  // pad steps aside on stacked layouts so it is seen without scrolling; the
  // entered answer stays as a compact summary above.
  const padCollapsed =
    (slot.feedbackVisual || reveal) && (disabled || !slot.inputWanted);

  function press(key: PadKey) {
    if (disabled) return;
    if (key === "comma" && !decimal) return;
    if (key === "power" && !power) return;
    if (key === "minus" && !exercise.allowNegative) return;
    const edit = applyPadKey(value, focus, key);
    if (edit.focus !== "value") setPowerFocus(edit.focus);
    onChange(edit.input);
  }

  // A plain value checked against a power answer: point at the "mũ" key,
  // in the colour of an authored hint on the power if there is one.
  const powerHint =
    shown.kind === "value"
      ? (highlight.get("exponent") ??
        highlight.get("base") ??
        (wrong.has("exponent") ? POWER_KEY_HINT : undefined))
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
    // A plain value checked against a power answer is flagged by its parts
    // (base, exponent); the value box shows it was wrong all the same.
    const missed = !reveal && (id === "value" ? wrong.size > 0 : wrong.has(id));
    return (
      <AnswerHighlight spec={spec} className={offset}>
        <button
          type="button"
          aria-label={`${label}: ${text === "" ? "chưa nhập" : text}`}
          disabled={disabled}
          data-slot={id}
          data-focused={focused || undefined}
          data-wrong={missed || undefined}
          onClick={() => {
            if (id !== "value") setPowerFocus(id);
            slot.wantInput();
          }}
          className={`flex items-center justify-center rounded-lg px-3 font-bold tabular-nums ${size} ${
            reveal
              ? "border-3 border-correct bg-correct-soft text-correct-soft-foreground"
              : missed
                ? WRONG_TONE
                : focused
                  ? "border-3 border-primary bg-surface"
                  : "border-2 border-border bg-surface"
          }`}
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
        {padCollapsed && !disabled && (
          <button
            type="button"
            aria-label="Mở bàn phím số"
            data-open-pad
            onClick={slot.wantInput}
            className="flex size-14 items-center justify-center rounded-lg border-2 border-border bg-surface text-muted-foreground motion-safe:transition-transform motion-safe:active:scale-97 lg:landscape:hidden"
          >
            <Keyboard aria-hidden className="size-7" />
          </button>
        )}
      </div>
      {!padCollapsed && slot.feedbackStrip}
      <div
        className={padCollapsed ? COLLAPSED_INPUT_CLASS : undefined}
        data-pad-collapsed={padCollapsed || undefined}
      >
        <NumberPad
          onKey={press}
          decimal={decimal}
          negative={exercise.allowNegative}
          power={power}
          disabled={disabled}
          disabledKeys={focus === "exponent" ? NO_COMMA_OR_MINUS : undefined}
          powerActive={focus === "exponent"}
          powerHighlight={powerHint}
        />
      </div>
    </div>
  );
}
