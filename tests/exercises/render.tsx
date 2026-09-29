import { fireEvent, render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { BasicExercise, Concept, Hints } from "@/schema/content";

// Concepts a test exercise may colour its hints with.
export const CONCEPTS: ReadonlyMap<string, Concept> = new Map([
  [
    "test.concept.nhan-vat",
    { id: "test.concept.nhan-vat", name: "Nhân vật", color: "pink" },
  ],
]);

// Renders an exercise exactly as the app does: the real frame around the
// registered answer component.
export function renderExercise<E extends BasicExercise>(exercise: E) {
  const onDone = vi.fn();
  const view = render(
    <ExerciseFrame exercise={exercise} concepts={CONCEPTS} onDone={onDone}>
      {(slot) => renderAnswer(exercise, slot)}
    </ExerciseFrame>,
  );
  const frame = view.container.querySelector("section");
  if (!frame) throw new Error("frame missing");
  return { frame, onDone, container: view.container };
}

export function checkButton() {
  return screen.getByRole("button", { name: "Kiểm tra" });
}

export function checkAnswer() {
  fireEvent.click(checkButton());
}

export function startRetype() {
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

export function tap(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

// The Highlight wrapper around an answer-area element, when it is lit.
export function highlightOf(el: Element) {
  return el.closest("[data-highlighted]");
}

export function isStrong(el: Element) {
  return highlightOf(el)?.hasAttribute("data-highlight-strong") ?? false;
}

// Exercises with both visuals: tier 2 plays the hint visual and tier 3 the
// solution visual instead of the stronger highlight and the revealed answer.
export const VISUAL_HINTS: Hints = {
  highlight: [],
  hintVisualId: "fixture.visual.dot-grid",
  solutionVisualId: "fixture.visual.bead-merge",
};

// Walks the three wrong checks of an exercise built with VISUAL_HINTS whose
// current answer is wrong; `wrong` is the answer element the grader flags.
export function expectVisualTiers(
  { frame, container }: { frame: Element; container: HTMLElement },
  wrong: () => Element,
) {
  const visual = (id: string) =>
    container.querySelector(`[data-feedback-visual="${id}"]`);

  checkAnswer();
  expect(frame).toHaveAttribute("data-tier", "1");
  expect(highlightOf(wrong())).not.toBeNull();

  checkAnswer();
  expect(frame).toHaveAttribute("data-tier", "2");
  expect(visual("fixture.visual.dot-grid")).not.toBeNull();
  expect(isStrong(wrong())).toBe(false);

  checkAnswer();
  expect(frame).toHaveAttribute("data-tier", "3");
  expect(visual("fixture.visual.bead-merge")).not.toBeNull();
  // The solution visual shows the answer, so the answer area does not.
  expect(container.querySelector("[data-reveal]")).toBeNull();

  startRetype();
  expect(frame).toHaveAttribute("data-phase", "retype");
}
