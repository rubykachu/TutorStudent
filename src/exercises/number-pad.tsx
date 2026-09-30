"use client";

import { Delete } from "lucide-react";
import type { ReactNode } from "react";
import { AnswerHighlight } from "@/exercises/answer-highlight";
import type { HighlightSpec } from "@/exercises/feedback";

export const DIGITS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
] as const;
export type Digit = (typeof DIGITS)[number];
// "power" moves entry to the exponent of a power (the "mũ" key).
export type PadKey = Digit | "comma" | "backspace" | "power";

type NumberPadProps = {
  onKey: (key: PadKey) => void;
  // Shows the decimal comma key; answers without decimals leave it out.
  decimal?: boolean;
  disabled?: boolean;
  // Keys that make no sense for the focused slot (a comma in an exponent).
  disabledKeys?: ReadonlySet<PadKey>;
  // The exponent slot is the one being typed into.
  powerActive?: boolean;
  // Lights up the "mũ" key when the hint says the answer is a power.
  powerHighlight?: HighlightSpec;
};

const PLAIN = "border-2 border-border bg-surface";

const KEY =
  "flex items-center justify-center rounded-lg font-semibold text-block select-none motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-50 md:text-block-lg";

// Big on-screen keypad so numeric answers never depend on the system
// keyboard: digits in a 3-column block, with delete, the decimal comma (only
// when the answer has decimals) and the "mũ" key in a fourth column. Without
// the comma, delete grows to two rows so the column stays filled. Keys are
// 64px, and 60px in the narrower answer column of the two-column exercise
// layout (wide landscape screens).
export function NumberPad({
  onKey,
  decimal = false,
  disabled = false,
  disabledKeys,
  powerActive = false,
  powerHighlight,
}: NumberPadProps) {
  const key = (
    padKey: PadKey,
    label: ReactNode,
    extra: {
      size?: string;
      tone?: string;
      ariaLabel?: string;
      pressed?: boolean;
    } = {},
  ) => (
    <button
      key={padKey}
      type="button"
      className={`${KEY} ${extra.size ?? "size-16 lg:landscape:size-15"} ${extra.tone ?? PLAIN}`}
      aria-label={extra.ariaLabel}
      aria-pressed={extra.pressed}
      disabled={disabled || disabledKeys?.has(padKey)}
      data-pad-key={padKey}
      onClick={() => onKey(padKey)}
    >
      {label}
    </button>
  );

  return (
    <fieldset
      className="min-w-0 grid w-fit grid-cols-4 gap-3"
      aria-label="Bàn phím số"
    >
      {key("1", "1")}
      {key("2", "2")}
      {key("3", "3")}
      {key("backspace", <Delete aria-hidden className="size-7" />, {
        ariaLabel: "Xoá",
        size: decimal ? undefined : "row-span-2 h-full w-16 lg:landscape:w-15",
      })}
      {key("4", "4")}
      {key("5", "5")}
      {key("6", "6")}
      {decimal && key("comma", ",", { ariaLabel: "Dấu phẩy" })}
      {key("7", "7")}
      {key("8", "8")}
      {key("9", "9")}
      <AnswerHighlight spec={powerHighlight} className="row-span-2">
        {key("power", "mũ", {
          ariaLabel: "Số mũ",
          pressed: powerActive,
          size: "h-full w-16 lg:landscape:w-15",
          tone: `${powerActive ? "border-3 border-primary" : "border-2 border-border"} bg-surface`,
        })}
      </AnswerHighlight>
      {key("0", "0", { size: "col-span-3 h-16 w-full lg:landscape:h-15" })}
    </fieldset>
  );
}
