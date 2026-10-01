import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { NumericInput } from "@/exercises/input";
import { NumberPad, type PadKey } from "@/exercises/number-pad";
import {
  applyPadKey,
  EMPTY_NUMERIC,
  MAX_SLOT_LENGTH,
  type NumericSlot,
} from "@/exercises/numeric/edit";

describe("NumberPad", () => {
  it("reports every key it shows", () => {
    const onKey = vi.fn();
    render(<NumberPad onKey={onKey} decimal />);
    const names: [string, PadKey][] = [
      ...[..."0123456789"].map((d): [string, PadKey] => [d, d as PadKey]),
      ["Dấu phẩy", "comma"],
      ["Xoá", "backspace"],
      ["Số mũ", "power"],
    ];
    for (const [name] of names) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(onKey.mock.calls.map(([key]) => key)).toEqual(
      names.map(([, key]) => key),
    );
    expect(screen.getByRole("button", { name: "Số mũ" })).toHaveTextContent(
      "mũ",
    );
  });

  it("shows the minus key, 48px or more, only when negatives are allowed", () => {
    const onKey = vi.fn();
    const { rerender } = render(<NumberPad onKey={onKey} />);
    expect(screen.queryByRole("button", { name: "Dấu trừ" })).toBeNull();
    expect(screen.getByRole("button", { name: "0" })).toHaveClass("col-span-3");
    rerender(<NumberPad onKey={onKey} negative />);
    const minus = screen.getByRole("button", { name: "Dấu trừ" });
    expect(minus).toHaveTextContent("−");
    // Keys are size-16 (64px), size-15 (60px) on wide landscape screens.
    expect(minus).toHaveClass("size-16", "lg:landscape:size-15");
    expect(screen.getByRole("button", { name: "0" })).toHaveClass("col-span-2");
    fireEvent.click(minus);
    expect(onKey).toHaveBeenCalledWith("minus");
  });

  it("disables single keys, or all of them", () => {
    const { rerender } = render(
      <NumberPad onKey={() => {}} decimal disabledKeys={new Set(["comma"])} />,
    );
    expect(screen.getByRole("button", { name: "Dấu phẩy" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).toBeEnabled();
    rerender(<NumberPad onKey={() => {}} disabled />);
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("leaves out the comma unless decimals are needed, delete filling its place", () => {
    const { rerender } = render(<NumberPad onKey={() => {}} />);
    expect(screen.queryByRole("button", { name: "Dấu phẩy" })).toBeNull();
    expect(screen.getByRole("button", { name: "Xoá" })).toHaveClass(
      "row-span-2",
    );
    rerender(<NumberPad onKey={() => {}} decimal />);
    expect(screen.getByRole("button", { name: "Dấu phẩy" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Xoá" })).not.toHaveClass(
      "row-span-2",
    );
  });

  it("marks the mũ key while the exponent is being typed", () => {
    render(<NumberPad onKey={() => {}} powerActive />);
    expect(screen.getByRole("button", { name: "Số mũ" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

function typeKeys(keys: PadKey[]) {
  let input: NumericInput | null = null;
  let focus: NumericSlot = "value";
  for (const key of keys) ({ input, focus } = applyPadKey(input, focus, key));
  return { input, focus };
}

describe("applyPadKey", () => {
  it("builds a value digit by digit", () => {
    expect(typeKeys(["1", "2"]).input).toEqual({
      ...EMPTY_NUMERIC,
      value: "12",
    });
  });

  it("replaces a leading zero", () => {
    expect(typeKeys(["0", "7"]).input).toEqual({
      ...EMPTY_NUMERIC,
      value: "7",
    });
  });

  it("allows one comma and starts a bare comma with zero", () => {
    expect(typeKeys(["comma", "5", "comma"]).input).toEqual({
      ...EMPTY_NUMERIC,
      value: "0,5",
    });
  });

  it("stops at the length limit", () => {
    const keys = Array.from(
      { length: MAX_SLOT_LENGTH + 3 },
      () => "9" as const,
    );
    const { input } = typeKeys(keys);
    expect(input?.kind === "value" && input.value.length).toBe(MAX_SLOT_LENGTH);
  });

  it("toggles a leading minus and never puts one in the middle", () => {
    const value = (keys: PadKey[]) => {
      const { input } = typeKeys(keys);
      return input?.kind === "value" ? input.value : input;
    };
    expect(value(["minus"])).toBe("−");
    expect(value(["minus", "5"])).toBe("−5");
    expect(value(["5", "minus"])).toBe("−5");
    expect(value(["minus", "5", "minus"])).toBe("5");
    expect(value(["1", "minus", "2", "minus", "minus"])).toBe("−12");
    expect(value(["minus", "0", "7"])).toBe("−7");
    expect(value(["minus", "comma", "5"])).toBe("−0,5");
    expect(value(["minus", "5", "backspace"])).toBe("−");
    expect(value(["minus", "backspace"])).toBe("");
  });

  it("keeps the limit with the sign and keeps the minus out of exponents", () => {
    const nines = Array.from({ length: MAX_SLOT_LENGTH }, () => "9" as const);
    const { input } = typeKeys(["minus", ...nines]);
    expect(input?.kind === "value" && input.value.length).toBe(MAX_SLOT_LENGTH);
    expect(typeKeys(["2", "power", "minus", "3"]).input).toEqual({
      type: "numeric",
      kind: "power",
      base: "2",
      exponent: "3",
    });
    expect(typeKeys(["minus", "2", "power", "3"]).input).toEqual({
      type: "numeric",
      kind: "power",
      base: "−2",
      exponent: "3",
    });
  });

  it("turns a value into the base of a power and toggles slots", () => {
    expect(typeKeys(["2", "power", "3"])).toEqual({
      input: { type: "numeric", kind: "power", base: "2", exponent: "3" },
      focus: "exponent",
    });
    expect(typeKeys(["2", "power", "power", "5"])).toEqual({
      input: { type: "numeric", kind: "power", base: "25", exponent: "" },
      focus: "base",
    });
  });

  it("keeps exponents whole", () => {
    expect(typeKeys(["2", "power", "comma", "3"]).input).toEqual({
      type: "numeric",
      kind: "power",
      base: "2",
      exponent: "3",
    });
  });

  it("goes back to a plain value when deleting past the exponent", () => {
    expect(typeKeys(["2", "power", "3", "backspace", "backspace"])).toEqual({
      input: { ...EMPTY_NUMERIC, value: "2" },
      focus: "value",
    });
    expect(typeKeys(["4", "backspace", "backspace"]).input).toEqual(
      EMPTY_NUMERIC,
    );
  });
});
