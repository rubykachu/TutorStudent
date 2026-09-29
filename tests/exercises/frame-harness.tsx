import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";
import {
  type AnswerSlotProps,
  ExerciseFrame,
} from "@/exercises/exercise-frame";
import type { InputFor } from "@/exercises/input";
import type { BasicExercise, Concept, Hints } from "@/schema/content";

// Shared driver for answer components rendered inside the real frame.

export const NO_HINTS: Hints = { highlight: [] };

export const HINT_VISUALS: Hints = {
  highlight: [],
  hintVisualId: "fixture.visual.dot-grid",
  solutionVisualId: "fixture.visual.bead-merge",
};

export const CONCEPTS: ReadonlyMap<string, Concept> = new Map([
  [
    "test.concept.nhan-vat",
    { id: "test.concept.nhan-vat", name: "Nhân vật", color: "pink" },
  ],
]);

export function renderInFrame<E extends BasicExercise>(
  exercise: E,
  answer: (slot: AnswerSlotProps<InputFor<E["type"]>>) => ReactNode,
) {
  const onDone = vi.fn();
  const view = render(
    <ExerciseFrame exercise={exercise} concepts={CONCEPTS} onDone={onDone}>
      {answer}
    </ExerciseFrame>,
  );
  const frame = view.container.querySelector("section");
  if (!frame) throw new Error("frame missing");
  return { frame, onDone, container: view.container };
}

export function checkAnswer() {
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
}

export function checkButton() {
  return screen.getByRole("button", { name: "Kiểm tra" });
}

export function retype() {
  fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
}

export function next() {
  fireEvent.click(screen.getByRole("button", { name: /Tiếp/ }));
}

export function feedbackVisual(container: HTMLElement, id: string) {
  return container.querySelector(`[data-feedback-visual="${id}"]`);
}

export function revealed(container: HTMLElement) {
  return container.querySelector("[data-reveal]");
}

// The Highlight wrapper around an answer element, or null when it is unlit.
export function litWrapper(el: Element) {
  return el.closest("[data-highlighted]");
}
