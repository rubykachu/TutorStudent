import { cleanup, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { numericExercise } from "./helpers";
import {
  checkAnswer,
  checkButton,
  expectVisualTiers,
  highlightOf,
  isMarkedWrong,
  renderExercise,
  startRetype,
  tap,
  VISUAL_HINTS,
} from "./render";

function slot(container: HTMLElement, id: string) {
  const el = container.querySelector(`[data-slot="${id}"]`);
  if (!el) throw new Error(`slot ${id} missing`);
  return el;
}

function press(...keys: string[]) {
  for (const key of keys) tap(key);
}

const POWER = { kind: "power", base: 2, exponent: 3 } as const;

describe("NumericAnswer", () => {
  it("accepts a plain value typed on the pad", () => {
    const { frame, container } = renderExercise(
      numericExercise({ kind: "value", value: 6 }),
    );
    expect(checkButton()).toBeDisabled();
    press("6");
    expect(slot(container, "value")).toHaveTextContent("6");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled();
  });

  it("types decimals with the comma key", () => {
    const { frame, container } = renderExercise(
      numericExercise({ kind: "value", value: 2.5 }),
    );
    press("2", "Dấu phẩy", "5");
    expect(slot(container, "value")).toHaveTextContent("2,5");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("types a negative answer with the minus key, shown as −5", () => {
    const { frame, container } = renderExercise({
      ...numericExercise({ kind: "value", value: -5 }),
      allowNegative: true,
    });
    press("5", "Dấu trừ");
    expect(slot(container, "value")).toHaveTextContent("−5");
    expect(slot(container, "value")).toHaveAttribute(
      "aria-label",
      "Đáp số: −5",
    );
    press("Dấu trừ");
    expect(slot(container, "value")).toHaveTextContent("5");
    press("Dấu trừ");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("takes the hyphen of a physical keyboard as the minus key", () => {
    const { frame, container } = renderExercise({
      ...numericExercise({ kind: "value", value: -5 }),
      allowNegative: true,
    });
    const value = slot(container, "value");
    fireEvent.keyDown(value, { key: "-" });
    fireEvent.keyDown(value, { key: "5" });
    expect(value).toHaveTextContent("−5");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("offers no minus key unless the exercise allows negatives", () => {
    const { container } = renderExercise(
      numericExercise({ kind: "value", value: 5 }),
    );
    expect(screen.queryByRole("button", { name: "Dấu trừ" })).toBeNull();
    fireEvent.keyDown(slot(container, "value"), { key: "-" });
    expect(slot(container, "value")).toHaveTextContent("");
  });

  it("allows the key on a positive answer without accepting the wrong sign", () => {
    const { frame } = renderExercise({
      ...numericExercise({ kind: "value", value: 5 }),
      allowNegative: true,
    });
    press("5", "Dấu trừ");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "wrong1");
  });

  it("disables the minus key while the exponent is typed", () => {
    renderExercise({
      ...numericExercise({ kind: "power", base: -2, exponent: 3 }),
      allowNegative: true,
    });
    press("2", "Dấu trừ", "Số mũ");
    expect(screen.getByRole("button", { name: "Dấu trừ" })).toBeDisabled();
  });

  it("enters a power with the mũ key moving to the exponent", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    press("2", "Số mũ");
    expect(slot(container, "exponent")).toHaveAttribute("data-focused");
    // A whole-number answer offers no comma key at all.
    expect(screen.queryByRole("button", { name: "Dấu phẩy" })).toBeNull();
    press("3");
    expect(slot(container, "base")).toHaveTextContent("2");
    expect(slot(container, "exponent")).toHaveTextContent("3");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("lets a tap on the base slot edit the base again", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    press("5", "Số mũ", "3");
    fireEvent.click(slot(container, "base"));
    expect(slot(container, "base")).toHaveAttribute("data-focused");
    press("Xoá", "2");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("takes keys from a physical keyboard", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    const value = slot(container, "value");
    fireEvent.keyDown(value, { key: "2" });
    fireEvent.keyDown(value, { key: "^" });
    fireEvent.keyDown(slot(container, "exponent"), { key: "3" });
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("points at the wrong part of a power, then reveals it for a retype", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    press("2", "Số mũ", "4");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(isMarkedWrong(slot(container, "exponent"))).toBe(true);
    expect(slot(container, "base")).not.toHaveAttribute("data-wrong");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(isMarkedWrong(slot(container, "exponent"))).toBe(true);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(slot(container, "base")).toHaveTextContent("2");
    expect(slot(container, "exponent")).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: "Số mũ" })).toBeDisabled();

    startRetype();
    expect(slot(container, "value")).toHaveTextContent("");
    expect(checkButton()).toBeDisabled();
    press("2", "Số mũ", "3");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("lights up the mũ key when a plain value misses a power answer", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    press("8");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(isMarkedWrong(slot(container, "value"))).toBe(true);
    const powerKey = highlightOf(screen.getByRole("button", { name: "Số mũ" }));
    expect(powerKey).not.toBeNull();
    // The same slate ring as a hint that names no concept, never yellow.
    expect(powerKey?.querySelector("[data-halo]")).toHaveClass(
      "border-concept-slate",
    );
    expect(frame.querySelector('[class*="highlight"]')).toBeNull();
  });

  it("reveals a decimal value with a comma", () => {
    const { container } = renderExercise(
      numericExercise({ kind: "value", value: 2.5 }),
    );
    press("3");
    checkAnswer();
    checkAnswer();
    checkAnswer();
    expect(slot(container, "value")).toHaveTextContent("2,5");
  });

  it("offers the comma key only when the answer has decimals", () => {
    renderExercise(numericExercise({ kind: "value", value: 6 }));
    expect(screen.queryByRole("button", { name: "Dấu phẩy" })).toBeNull();
    // A typed comma is ignored too.
    fireEvent.keyDown(screen.getByRole("button", { name: /Đáp số/ }), {
      key: ",",
    });
    expect(checkButton()).toBeDisabled();
    cleanup();
    renderExercise(numericExercise({ kind: "value", value: 2.5 }));
    expect(screen.getByRole("button", { name: "Dấu phẩy" })).toBeEnabled();
  });

  it("lets the hint visual take the pad's place until the child asks for it", () => {
    const { container } = renderExercise(
      numericExercise({ kind: "value", value: 6 }, VISUAL_HINTS),
    );
    const pad = () =>
      screen.getByRole("group", { name: "Bàn phím số" }).parentElement;
    press("9");
    checkAnswer();
    expect(pad()).not.toHaveAttribute("data-pad-collapsed");

    checkAnswer();
    expect(container.querySelector("[data-feedback-visual]")).not.toBeNull();
    // Hidden where the layout stacks; the two-column layout keeps it.
    expect(pad()).toHaveAttribute("data-pad-collapsed");
    expect(pad()).toHaveClass("hidden", "lg:landscape:block");
    expect(slot(container, "value")).toHaveTextContent("9");

    fireEvent.click(screen.getByRole("button", { name: "Mở bàn phím số" }));
    expect(pad()).not.toHaveAttribute("data-pad-collapsed");
    expect(screen.queryByRole("button", { name: "Mở bàn phím số" })).toBeNull();
    // The hint folds into a strip right above the pad where parts stack.
    const visual = container.querySelector("[data-feedback-visual]");
    expect(visual).toHaveClass("hidden", "lg:landscape:block");
    const strip = screen.getByRole("button", { name: "Xem gợi ý" });
    expect(strip).toHaveAttribute("data-hint-strip");
    expect(strip).toHaveClass("lg:landscape:hidden");

    // Tapping the strip shows the hint again in place of the pad.
    fireEvent.click(strip);
    expect(pad()).toHaveAttribute("data-pad-collapsed");
    expect(visual).not.toHaveClass("hidden");
    expect(screen.queryByRole("button", { name: "Xem gợi ý" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mở bàn phím số" }));

    // The solution visual takes the place again; the retype brings it back.
    checkAnswer();
    expect(pad()).toHaveAttribute("data-pad-collapsed");
    startRetype();
    expect(pad()).not.toHaveAttribute("data-pad-collapsed");
  });

  it("puts the revealed answer in place of the pad", () => {
    const { container } = renderExercise(
      numericExercise({ kind: "value", value: 6 }),
    );
    press("9");
    checkAnswer();
    checkAnswer();
    checkAnswer();
    expect(slot(container, "value")).toHaveTextContent("6");
    expect(slot(container, "value")).toHaveClass("border-correct");
    expect(
      screen.getByRole("group", { name: "Bàn phím số" }).parentElement,
    ).toHaveAttribute("data-pad-collapsed");
  });

  it("plays the hint and solution visuals when the exercise has them", () => {
    const view = renderExercise(numericExercise(POWER, VISUAL_HINTS));
    press("2", "Số mũ", "4");
    expectVisualTiers(view, () => slot(view.container, "exponent"));
    expect(slot(view.container, "value")).toHaveTextContent("");
    expect(checkButton()).toBeDisabled();
  });
});
