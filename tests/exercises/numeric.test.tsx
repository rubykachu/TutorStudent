import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { numericExercise } from "./helpers";
import {
  checkAnswer,
  checkButton,
  expectVisualTiers,
  highlightOf,
  isStrong,
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

  it("enters a power with the mũ key moving to the exponent", () => {
    const { frame, container } = renderExercise(numericExercise(POWER));
    press("2", "Số mũ");
    expect(slot(container, "exponent")).toHaveAttribute("data-focused");
    expect(screen.getByRole("button", { name: "Dấu phẩy" })).toBeDisabled();
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
    expect(highlightOf(slot(container, "exponent"))).not.toBeNull();
    expect(highlightOf(slot(container, "base"))).toBeNull();

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(isStrong(slot(container, "exponent"))).toBe(true);

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
    const { frame } = renderExercise(numericExercise(POWER));
    press("8");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(
      highlightOf(screen.getByRole("button", { name: "Số mũ" })),
    ).not.toBeNull();
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

  it("plays the hint and solution visuals when the exercise has them", () => {
    const view = renderExercise(numericExercise(POWER, VISUAL_HINTS));
    press("2", "Số mũ", "4");
    expectVisualTiers(view, () => slot(view.container, "exponent"));
    expect(slot(view.container, "value")).toHaveTextContent("");
    expect(checkButton()).toBeDisabled();
  });
});
