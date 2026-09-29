import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fillBlankExercise, NO_HINTS } from "./helpers";
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

const BANK = ["Lan", "Minh", "Hoa"];

function blank() {
  return screen.getByRole("button", { name: /^Ô trống 1/ });
}

describe("FillBlankAnswer with a word bank", () => {
  it("places a tapped word into the tapped blank", () => {
    const { frame } = renderExercise(
      fillBlankExercise(["Lan"], NO_HINTS, BANK),
    );
    expect(checkButton()).toBeDisabled();

    tap("Lan");
    expect(screen.getByRole("button", { name: "Lan" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(blank());
    expect(blank()).toHaveTextContent("Lan");
    expect(screen.getByRole("button", { name: "Lan" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("clears a filled blank tapped with no word picked", () => {
    renderExercise(fillBlankExercise(["Lan"], NO_HINTS, BANK));
    tap("Hoa");
    fireEvent.click(blank());
    fireEvent.click(blank());
    expect(blank()).toHaveAccessibleName("Ô trống 1: chưa điền");
    expect(checkButton()).toBeDisabled();
  });

  it("walks the three wrong tiers, reveals the word and asks for a retype", () => {
    const { frame, container } = renderExercise(
      fillBlankExercise(["Lan"], NO_HINTS, BANK),
    );
    tap("Minh");
    fireEvent.click(blank());

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(highlightOf(blank())).not.toBeNull();
    expect(highlightOf(screen.getByRole("button", { name: "Lan" }))).toBeNull();

    checkAnswer();
    expect(isStrong(blank())).toBe(true);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(blank()).toHaveTextContent("Lan");
    expect(blank()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Hoa" })).toBeDisabled();

    startRetype();
    expect(blank()).toHaveAccessibleName("Ô trống 1: chưa điền");
    expect(checkButton()).toBeDisabled();
    tap("Lan");
    fireEvent.click(blank());
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });
});

describe("FillBlankAnswer with visuals", () => {
  it("plays the hint and solution visuals instead of revealing", () => {
    const view = renderExercise(fillBlankExercise(["Lan"], VISUAL_HINTS, BANK));
    tap("Hoa");
    fireEvent.click(blank());
    expectVisualTiers(view, blank);
    expect(blank()).toHaveAccessibleName("Ô trống 1: chưa điền");
  });
});

describe("FillBlankAnswer typed", () => {
  function input() {
    return screen.getByRole("textbox", { name: "Ô trống 1" });
  }

  it("accepts typed text regardless of case and spacing", () => {
    const { frame } = renderExercise(fillBlankExercise(["Lan"]));
    expect(screen.getByText("(1)")).toBeVisible();
    fireEvent.change(input(), { target: { value: "  lan " } });
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("keeps text entered through IME composition untouched", () => {
    const { frame } = renderExercise(fillBlankExercise(["Nguyễn"]));
    fireEvent.compositionStart(input());
    fireEvent.change(input(), { target: { value: "Nguyê" } });
    expect(input()).toHaveValue("Nguyê");
    fireEvent.change(input(), { target: { value: "Nguyễn" } });
    fireEvent.compositionEnd(input());
    expect(input()).toHaveValue("Nguyễn");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("reveals the accepted word and empties the input for the retype", () => {
    renderExercise(fillBlankExercise(["Lan"]));
    fireEvent.change(input(), { target: { value: "Hoa" } });
    checkAnswer();
    expect(highlightOf(input())).not.toBeNull();
    checkAnswer();
    checkAnswer();
    expect(input()).toHaveValue("Lan");
    expect(input()).toBeDisabled();
    startRetype();
    expect(input()).toHaveValue("");
    expect(input()).toBeEnabled();
  });
});
