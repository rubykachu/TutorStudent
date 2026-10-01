import type { NumericInput } from "@/exercises/input";
import type { PadKey } from "@/exercises/number-pad";
import { MINUS_SIGN, withMinusSign } from "@/lib/number-format";

// Which numeric slot the pad types into; also the hint target ids.
export type NumericSlot = "value" | "base" | "exponent";

// Long enough for any grade 6 answer, short enough to fit the phone display.
export const MAX_SLOT_LENGTH = 9;

export const EMPTY_NUMERIC: NumericInput = {
  type: "numeric",
  kind: "value",
  value: "",
};

// The minus sign only ever leads: the key toggles it, digits and the comma go
// after it.
function typeInto(text: string, key: PadKey): string {
  if (key === "backspace") return text.slice(0, -1);
  if (key === "power") return text;
  if (key === "minus") {
    if (text.startsWith(MINUS_SIGN)) return text.slice(MINUS_SIGN.length);
    return text.length >= MAX_SLOT_LENGTH ? text : MINUS_SIGN + text;
  }
  if (text.length >= MAX_SLOT_LENGTH) return text;
  const sign = text.startsWith(MINUS_SIGN) ? MINUS_SIGN : "";
  const body = text.slice(sign.length);
  if (key === "comma") {
    if (body.includes(",")) return text;
    return `${sign}${body === "" ? "0," : `${body},`}`;
  }
  // A leading zero is replaced, so "05" never appears.
  return `${sign}${body === "0" ? key : body + key}`;
}

export type NumericEdit = { input: NumericInput; focus: NumericSlot };

// Applies one pad key. The "mũ" key turns a plain value into the base of a
// power and moves to the exponent (or toggles between the two slots);
// deleting from an empty exponent goes back to a plain value.
export function applyPadKey(
  input: NumericInput | null,
  focus: NumericSlot,
  key: PadKey,
): NumericEdit {
  const current = input ?? EMPTY_NUMERIC;
  if (current.kind === "value") {
    if (key === "power") {
      return {
        input: {
          type: "numeric",
          kind: "power",
          base: current.value,
          exponent: "",
        },
        focus: "exponent",
      };
    }
    return {
      input: { ...current, value: typeInto(current.value, key) },
      focus: "value",
    };
  }
  const slot = focus === "base" ? "base" : "exponent";
  if (key === "power") {
    return { input: current, focus: slot === "base" ? "exponent" : "base" };
  }
  if (key === "backspace" && slot === "exponent" && current.exponent === "") {
    return {
      input: { type: "numeric", kind: "value", value: current.base },
      focus: "value",
    };
  }
  // Exponents are whole numbers and never negative.
  if ((key === "comma" || key === "minus") && slot === "exponent") {
    return { input: current, focus };
  }
  return {
    input: { ...current, [slot]: typeInto(current[slot], key) },
    focus: slot,
  };
}

// Numbers are shown the Vietnamese way, with a decimal comma and the minus
// sign.
export function formatNumber(value: number): string {
  return withMinusSign(String(value).replace(".", ","));
}
