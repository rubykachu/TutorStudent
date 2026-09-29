import type { NumericInput } from "@/exercises/input";
import type { PadKey } from "@/exercises/number-pad";

// Which numeric slot the pad types into; also the hint target ids.
export type NumericSlot = "value" | "base" | "exponent";

// Long enough for any grade 6 answer, short enough to fit the phone display.
export const MAX_SLOT_LENGTH = 9;

export const EMPTY_NUMERIC: NumericInput = {
  type: "numeric",
  kind: "value",
  value: "",
};

function typeInto(text: string, key: PadKey): string {
  if (key === "backspace") return text.slice(0, -1);
  if (text.length >= MAX_SLOT_LENGTH) return text;
  if (key === "comma") {
    if (text.includes(",")) return text;
    return text === "" ? "0," : `${text},`;
  }
  if (key === "power") return text;
  // A leading zero is replaced, so "05" never appears.
  return text === "0" ? key : text + key;
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
  // Exponents are whole numbers.
  if (key === "comma" && slot === "exponent") return { input: current, focus };
  return {
    input: { ...current, [slot]: typeInto(current[slot], key) },
    focus: slot,
  };
}

// Numbers are shown the Vietnamese way, with a decimal comma.
export function formatNumber(value: number): string {
  return String(value).replace(".", ",");
}
