import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChoiceExercise } from "@/schema/content";
import { choiceExercise } from "./helpers";
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

  it("walks the three wrong tiers, reveals the answer and asks for a retype", () => {
    const { frame, container } = renderExercise(choiceExercise(["a"]));

    tap("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(highlightOf(option("b"))).not.toBeNull();
    expect(highlightOf(option("a"))).toBeNull();
    expect(isStrong(option("b"))).toBe(false);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    // No hint visual: the same option is marked more boldly instead.
    expect(isStrong(option("b"))).toBe(true);

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
    expectVisualTiers(view, () => option("b"));
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    expect(checkButton()).toBeDisabled();
  });
});
