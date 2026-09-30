import { cleanup, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChoiceExercise } from "@/schema/content";
import { choiceExercise } from "./helpers";
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

function option(id: string) {
  return screen.getByRole("button", { name: id });
}

describe("ChoiceAnswer", () => {
  it("accepts a single correct option and says one is enough", () => {
    const { frame } = renderExercise(choiceExercise(["a"]));
    expect(screen.getByText("Chọn một đáp án")).toBeInTheDocument();
    expect(checkButton()).toBeDisabled();

    tap("b");
    tap("a");
    // Picking another option replaces the first one.
    expect(option("a")).toHaveAttribute("aria-pressed", "true");
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    checkAnswer();

    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(option("c")).toBeDisabled();
  });

  it("toggles several options when more than one is right", () => {
    const { frame } = renderExercise(choiceExercise(["a", "b"]));
    expect(screen.getByText("Chọn tất cả đáp án đúng")).toBeInTheDocument();

    tap("a");
    tap("c");
    tap("c");
    expect(option("c")).toHaveAttribute("aria-pressed", "false");
    tap("a");
    // Unticking everything empties the answer again.
    expect(checkButton()).toBeDisabled();
    tap("a");
    tap("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("reads as a multi-select: stated up front, with checkbox markers", () => {
    const { container } = renderExercise(choiceExercise(["a", "b"]));
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).toHaveAttribute("data-multiple");
    expect(fieldset?.querySelector("legend")).toHaveTextContent(
      "Chọn tất cả đáp án đúng",
    );
    const marker = (id: string) =>
      option(id).querySelector("[data-choice-marker]");
    expect(marker("a")).toHaveAttribute("data-choice-marker", "checkbox");
    tap("a");
    expect(marker("a")?.querySelector("svg")).not.toBeNull();
    cleanup();

    const single = renderExercise(choiceExercise(["a"]));
    expect(single.container.querySelector("fieldset")).not.toHaveAttribute(
      "data-multiple",
    );
    expect(option("a").querySelector("[data-choice-marker]")).toHaveAttribute(
      "data-choice-marker",
      "radio",
    );
  });

  it("keeps the right picks of a multi-select through a wrong check", () => {
    const { frame, container } = renderExercise(choiceExercise(["a", "b"]));
    tap("a");
    tap("c");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    // Only the wrong pick is marked and let go; the right one stays ticked.
    expect(isMarkedWrong(option("c"))).toBe(true);
    expect(option("c")).toHaveAttribute("aria-pressed", "false");
    expect(option("a")).toHaveAttribute("aria-pressed", "true");
    expect(isMarkedWrong(option("a"))).toBe(false);

    // A right pick alone is still incomplete: nothing is marked wrong.
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(container.querySelector("[data-wrong]")).toBeNull();
    expect(option("a")).toHaveAttribute("aria-pressed", "true");

    tap("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("reveals every right option of a multi-select at the third check", () => {
    const { frame, container } = renderExercise(choiceExercise(["a", "b"]));
    for (let i = 0; i < 3; i++) {
      if (checkButton().hasAttribute("disabled")) tap("c");
      checkAnswer();
    }
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(option("a")).toHaveAttribute("aria-pressed", "true");
    expect(option("b")).toHaveAttribute("aria-pressed", "true");
    expect(option("c")).toHaveAttribute("aria-pressed", "false");
  });

  it("renders formula options with KaTeX", () => {
    const exercise: ChoiceExercise = {
      ...choiceExercise(["a"]),
      options: [
        { id: "a", content: { type: "formula", tex: "2^3" } },
        { id: "b", content: { type: "text", text: "8" } },
      ],
    };
    const { container } = renderExercise(exercise);
    expect(container.querySelector('[data-option="a"] .katex')).not.toBeNull();
  });

  it("puts short options side by side and gives a long one a whole row", () => {
    const grid = (container: HTMLElement) =>
      container.querySelector('[data-option="a"]')?.closest(".grid");
    const short = renderExercise(choiceExercise(["a"]));
    expect(grid(short.container)?.className).toContain("auto-fit");
    cleanup();

    const long = renderExercise({
      ...choiceExercise(["a"]),
      options: [
        {
          id: "a",
          content: {
            type: "formula",
            tex: "3 \\cdot 10^{3} + 6 \\cdot 10 + 2",
          },
        },
        { id: "b", content: { type: "formula", tex: "10^{3}" } },
      ],
    });
    expect(grid(long.container)?.className).not.toContain("auto-fit");
    expect(grid(long.container)).toHaveAttribute("data-long-options");
  });

  it("walks the three wrong tiers, reveals the answer and asks for a retype", () => {
    const { frame, container } = renderExercise(choiceExercise(["a"]));

    tap("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    // The wrong pick is let go and marked orange, not lit up yellow.
    expect(isMarkedWrong(option("b"))).toBe(true);
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    expect(option("b")).toHaveClass("border-dashed", "border-retry");
    expect(option("b")).not.toHaveClass("bg-transparent");
    expect(highlightOf(option("a"))).toBeNull();
    expect(checkButton()).toBeDisabled();

    tap("c");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(isMarkedWrong(option("c"))).toBe(true);
    // Only the last check's mistakes are marked.
    expect(option("b")).not.toHaveAttribute("data-wrong");

    tap("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(option("a")).toHaveAttribute("aria-pressed", "true");
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    expect(option("a")).toBeDisabled();

    startRetype();
    expect(frame).toHaveAttribute("data-phase", "retype");
    expect(option("a")).toHaveAttribute("aria-pressed", "false");
    expect(checkButton()).toBeDisabled();
    tap("a");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("plays the hint and solution visuals when the exercise has them", () => {
    const view = renderExercise(choiceExercise(["a"], VISUAL_HINTS));
    tap("b");
    expectVisualTiers(
      view,
      () => option("b"),
      () => tap("b"),
    );
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    expect(checkButton()).toBeDisabled();
  });
});
