import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadContent } from "@/content/load";
import type { ManipulateExercise } from "@/schema/content";
import { findVisual, type VisualState } from "@/visuals/registry";
import {
  STATE_KEY_ATTR,
  STATE_SET_ATTR,
  STATE_STEP_ATTR,
  STATE_VALUE_ATTR,
} from "@/visuals/shared/markers";
import { checkAnswer, renderExercise, startRetype } from "./render";

// Every `manipulate` exercise the app serves, open-ended steps included: its
// validator must accept exactly the solved state, and the answer area must
// keep showing the state the child submitted once it is accepted.

const MAX_TAPS = 100;

const exercises: ManipulateExercise[] = loadContent({
  includeFixture: false,
  includeDraft: false,
}).lessons.flatMap(({ lesson }) =>
  lesson.exercises.flatMap((exercise) => {
    const all = exercise.type === "openEnded" ? exercise.steps : [exercise];
    return all.filter((e): e is ManipulateExercise => e.type === "manipulate");
  }),
);

function toolsOf(exercise: ManipulateExercise) {
  const entry = findVisual(exercise.visualId);
  const validate = entry?.validators?.[exercise.validatorId];
  const solve = entry?.solutions?.[exercise.validatorId];
  if (!validate || !solve) {
    throw new Error(`${exercise.id}: no validator or solver`);
  }
  return { validate, solve };
}

function steppers(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(`[${STATE_KEY_ATTR}]`)];
}

function stepperValue(stepper: HTMLElement): number {
  return Number(stepper.getAttribute(STATE_VALUE_ATTR));
}

function stepButton(stepper: HTMLElement, direction: "down" | "up") {
  const button = stepper.querySelector<HTMLButtonElement>(
    `[${STATE_STEP_ATTR}="${direction}"]`,
  );
  if (!button) throw new Error(`stepper has no "${direction}" button`);
  return button;
}

// Brings the visual to `state` through its marked controls, the way
// `pnpm lesson:walk` does in the browser. A value already on screen is moved
// away and back, since only a change reports the state; keys without a
// control are values the visual derives itself.
function driveTo(area: HTMLElement, state: VisualState) {
  let driven = 0;
  for (const [key, target] of Object.entries(state)) {
    const set = area.querySelector<HTMLElement>(
      `[${STATE_SET_ATTR}="${key}=${target}"]`,
    );
    if (set) {
      fireEvent.click(set);
      driven += 1;
      continue;
    }
    const stepper = area.querySelector<HTMLElement>(
      `[${STATE_KEY_ATTR}="${key}"]`,
    );
    if (!stepper) continue;
    driven += 1;
    if (stepperValue(stepper) === target) {
      const up = stepButton(stepper, "up");
      fireEvent.click(up.disabled ? stepButton(stepper, "down") : up);
    }
    for (let taps = 0; stepperValue(stepper) !== target; taps++) {
      if (taps >= MAX_TAPS) throw new Error(`cannot bring ${key} to ${target}`);
      fireEvent.click(
        stepButton(stepper, stepperValue(stepper) < target ? "up" : "down"),
      );
    }
  }
  if (driven === 0) throw new Error("no marked control for the solved state");
}

// The values the visual's steppers show, by key.
function shownValues(area: HTMLElement): Record<string, number> {
  return Object.fromEntries(
    steppers(area).map((s) => [
      s.getAttribute(STATE_KEY_ATTR),
      stepperValue(s),
    ]),
  );
}

// The solved state restricted to the keys the visual has a stepper for.
function expectedValues(
  area: HTMLElement,
  state: VisualState,
): Record<string, number> {
  const keys = new Set(
    steppers(area).map((s) => s.getAttribute(STATE_KEY_ATTR)),
  );
  return Object.fromEntries(
    Object.entries(state).filter(([key]) => keys.has(key)),
  );
}

async function renderReady(exercise: ManipulateExercise) {
  const view = renderExercise(exercise);
  const area = view.container.querySelector<HTMLElement>("[data-answer-area]");
  if (!area) throw new Error("answer area missing");
  // The visual loads on first use.
  await screen.findAllByRole("button");
  await expect.poll(() => steppers(area).length).toBeGreaterThan(0);
  return { ...view, area };
}

describe("manipulate exercises of the served lessons", () => {
  it("has some to check", () => {
    expect(exercises.length).toBeGreaterThan(0);
  });

  describe.each(exercises.map((e) => [e.id, e] as const))(
    "%s",
    (_, exercise) => {
      it("accepts the solved state and rejects a one-step change of any control", async () => {
        const { validate, solve } = toolsOf(exercise);
        const solved = solve(exercise.params);
        expect(validate(solved, exercise.params)).toBe(true);
        // Only values the child sets are changed; the others (the grains of a
        // chessboard square) follow from them and the validator may ignore them.
        const { area } = await renderReady(exercise);
        const controlled = Object.keys(expectedValues(area, solved));
        expect(controlled.length).toBeGreaterThan(0);
        for (const key of controlled) {
          for (const delta of [-1, 1]) {
            const changed = { ...solved, [key]: (solved[key] ?? 0) + delta };
            expect(validate(changed, exercise.params), `${key}${delta}`).toBe(
              false,
            );
          }
        }
      });

      it("keeps the submitted state on screen once it is accepted", async () => {
        const { solve } = toolsOf(exercise);
        const solved = solve(exercise.params);
        const { frame, area } = await renderReady(exercise);
        driveTo(area, solved);
        const submitted = shownValues(area);
        expect(submitted).toEqual(expectedValues(area, solved));
        checkAnswer();
        expect(frame).toHaveAttribute("data-phase", "correct");
        expect(shownValues(area)).toEqual(submitted);
      });

      it("shows the solved state at the third miss and keeps the retyped answer once accepted", async () => {
        const { solve } = toolsOf(exercise);
        const solved = solve(exercise.params);
        const { frame, area } = await renderReady(exercise);
        // One step off the solved state.
        driveTo(area, solved);
        const first = steppers(area)[0];
        if (!first) throw new Error("no stepper");
        const up = stepButton(first, "up");
        fireEvent.click(up.disabled ? stepButton(first, "down") : up);
        checkAnswer();
        checkAnswer();
        checkAnswer();
        expect(frame).toHaveAttribute("data-tier", "3");
        if (!exercise.hints.solutionVisualId) {
          expect(shownValues(area)).toEqual(expectedValues(area, solved));
        }
        startRetype();
        await expect.poll(() => steppers(area).length).toBeGreaterThan(0);
        driveTo(area, solved);
        const submitted = shownValues(area);
        checkAnswer();
        expect(frame).toHaveAttribute("data-phase", "correct");
        expect(shownValues(area)).toEqual(submitted);
      });
    },
  );
});

describe("luy-thua.ex.tim-o-16-hat", () => {
  const exercise = exercises.find((e) => e.id === "luy-thua.ex.tim-o-16-hat");

  it("accepts only square 5 of the chessboard, the one with 16 = 2⁴ grains", () => {
    if (!exercise) throw new Error("exercise missing");
    const { validate } = toolsOf(exercise);
    const accepted = Array.from({ length: 64 }, (_, i) => i + 1).filter(
      (square) => validate({ square }, exercise.params),
    );
    expect(accepted).toEqual([5]);
  });
});
