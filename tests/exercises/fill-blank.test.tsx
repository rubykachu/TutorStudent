import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  splitAfterBlank,
  splitBeforeBlank,
} from "@/exercises/fill-blank/fill-blank-answer";
import { fillBlankExercise, NO_HINTS } from "./helpers";
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
    expect(isMarkedWrong(blank())).toBe(true);
    expect(blank()).toHaveTextContent("Minh");
    expect(highlightOf(screen.getByRole("button", { name: "Lan" }))).toBeNull();

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(isMarkedWrong(blank())).toBe(true);

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
    expect(isMarkedWrong(input())).toBe(true);
    checkAnswer();
    checkAnswer();
    expect(input()).toHaveValue("Lan");
    expect(input()).toBeDisabled();
    startRetype();
    expect(input()).toHaveValue("");
    expect(input()).toBeEnabled();
  });
});

describe("splitBeforeBlank", () => {
  it("keeps the last word and the operator before it with the blank", () => {
    expect(splitBeforeBlank("5 247 = 5 · 10³ + 2 · ")).toEqual({
      head: "5 247 = 5 · 10³ + ",
      tail: "2 · ",
    });
  });

  it("keeps a plain last word with the blank", () => {
    expect(splitBeforeBlank("Số mũ là ")).toEqual({
      head: "Số mũ ",
      tail: "là ",
    });
  });

  it("leaves text of spaces alone", () => {
    expect(splitBeforeBlank(" ")).toEqual({ head: " ", tail: "" });
  });
});

describe("splitAfterBlank", () => {
  it("keeps punctuation right after a blank with it", () => {
    expect(splitAfterBlank(", các số mũ ")).toEqual({
      lead: ",",
      rest: " các số mũ ",
    });
    expect(splitAfterBlank(".")).toEqual({ lead: ".", rest: "" });
    expect(splitAfterBlank(" + 4")).toEqual({ lead: "", rest: " + 4" });
  });
});

describe("FillBlankAnswer blank width", () => {
  it("reserves room for every bank word, so a placed word never resizes the blank", () => {
    renderExercise(fillBlankExercise(["Lan"], NO_HINTS, BANK));
    const sizers = blank().querySelectorAll("[data-blank-sizer]");
    expect([...sizers].map((el) => el.textContent)).toEqual(BANK);
    // The sizers are hidden from assistive technology and from view.
    for (const sizer of sizers) {
      expect(sizer).toHaveAttribute("aria-hidden", "true");
      expect(sizer).toHaveClass("invisible");
    }
    tap("Minh");
    fireEvent.click(blank());
    expect(blank().querySelectorAll("[data-blank-sizer]")).toHaveLength(
      BANK.length,
    );
  });
});

describe("FillBlankAnswer line breaking", () => {
  it("keeps the word before a blank and the full stop after it on one unbreakable line", () => {
    renderExercise(fillBlankExercise(["Lan"], NO_HINTS, BANK));
    const unit = blank().closest(".whitespace-nowrap");
    const shown = unit?.cloneNode(true) as HTMLElement;
    // The invisible words that size the blank are not part of the sentence.
    for (const sizer of shown.querySelectorAll("[data-blank-sizer]"))
      sizer.remove();
    expect(shown.textContent).toMatch(/^là .*\.$/);
  });
});
