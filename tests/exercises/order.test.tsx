import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { orderExercise } from "./helpers";
import {
  checkAnswer,
  checkButton,
  expectVisualTiers,
  highlightOf,
  isStrong,
  renderExercise,
  startRetype,
  VISUAL_HINTS,
} from "./render";

const IDS = ["mot", "hai", "ba", "bon"];

function shownOrder(container: HTMLElement): string[] {
  return [...container.querySelectorAll("[data-item]")].map(
    (el) => el.getAttribute("data-item") ?? "",
  );
}

function item(container: HTMLElement, id: string) {
  const el = container.querySelector(`[data-item="${id}"]`);
  if (!el) throw new Error(`item ${id} missing`);
  return el;
}

// Sorts by taps only: pick the item that belongs at each position, then tap
// the item currently there.
function solveByTaps(container: HTMLElement) {
  IDS.forEach((id, index) => {
    const current = shownOrder(container);
    if (current[index] === id) return;
    fireEvent.click(item(container, id));
    fireEvent.click(item(container, current[index]));
  });
}

describe("OrderAnswer", () => {
  it("starts from a scrambled order that can already be checked", () => {
    const { container } = renderExercise(orderExercise(IDS));
    const start = shownOrder(container);
    expect(start).not.toEqual(IDS);
    expect([...start].sort()).toEqual([...IDS].sort());
    expect(checkButton()).toBeEnabled();
  });

  it("moves a tapped item to the tapped position without dragging", () => {
    const { container } = renderExercise(orderExercise(IDS));
    const [first, second, third] = shownOrder(container);
    fireEvent.click(item(container, third));
    expect(item(container, third)).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(item(container, first));
    expect(shownOrder(container).slice(0, 3)).toEqual([third, first, second]);
    expect(item(container, third)).toHaveAttribute("aria-pressed", "false");
  });

  it("drops the selection when the same item is tapped twice", () => {
    const { container } = renderExercise(orderExercise(IDS));
    const start = shownOrder(container);
    fireEvent.click(item(container, start[0]));
    fireEvent.click(item(container, start[0]));
    expect(item(container, start[0])).toHaveAttribute("aria-pressed", "false");
    expect(shownOrder(container)).toEqual(start);
  });

  it("accepts the correct order", () => {
    const { frame, container } = renderExercise(orderExercise(IDS));
    solveByTaps(container);
    expect(shownOrder(container)).toEqual(IDS);
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("walks the three wrong tiers, reveals the order and asks for a retype", () => {
    const { frame, container } = renderExercise(orderExercise(IDS));
    const start = shownOrder(container);
    const misplaced = IDS.filter((id, index) => start[index] !== id);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    for (const id of IDS) {
      const lit = highlightOf(item(container, id)) !== null;
      expect(lit).toBe(misplaced.includes(id));
    }

    checkAnswer();
    expect(isStrong(item(container, misplaced[0]))).toBe(true);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(shownOrder(container)).toEqual(IDS);
    expect(item(container, IDS[0])).toBeDisabled();

    startRetype();
    expect(frame).toHaveAttribute("data-phase", "retype");
    expect(shownOrder(container)).toEqual(start);
    solveByTaps(container);
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });
});

describe("OrderAnswer with visuals", () => {
  it("plays the hint and solution visuals instead of revealing", () => {
    const view = renderExercise(orderExercise(IDS, VISUAL_HINTS));
    const start = shownOrder(view.container);
    const misplaced = IDS.find((id, index) => start[index] !== id) ?? "";
    expectVisualTiers(view, () => item(view.container, misplaced));
    expect(shownOrder(view.container)).toEqual(start);
  });
});
