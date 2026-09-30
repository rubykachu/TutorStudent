import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChoiceInput } from "@/exercises/input";
import {
  canCheck,
  exerciseReducer,
  feedbackTier,
  initialMachineState,
  isFirstTryCorrect,
  type MachineAction,
  type MachineState,
  useExerciseMachine,
} from "@/exercises/machine";
import { choiceExercise } from "./helpers";

type State = MachineState<ChoiceInput>;
type Action = MachineAction<ChoiceInput>;

const pick = (...selected: string[]): Action => ({
  type: "input",
  input: { type: "choice", selected },
});
const RIGHT: Action = {
  type: "check",
  result: { correct: true, wrongTargets: [] },
};
const WRONG: Action = {
  type: "check",
  result: { correct: false, wrongTargets: ["b"] },
};

function run(...actions: Action[]): State {
  return actions.reduce<State>(
    exerciseReducer,
    initialMachineState<ChoiceInput>(),
  );
}

describe("exerciseReducer", () => {
  it("tracks whether anything is entered before the first check", () => {
    expect(run().phase).toBe("idle");
    expect(run(pick("a")).phase).toBe("answered");
    expect(run(pick("a"), pick()).phase).toBe("idle");
    expect(canCheck(run(pick()))).toBe(false);
  });

  it("ignores a check with nothing entered", () => {
    expect(run(RIGHT)).toEqual(run());
  });

  it("is first-try correct only when right on the first check", () => {
    const state = run(pick("a"), RIGHT);
    expect(state.phase).toBe("correct");
    expect(isFirstTryCorrect(state)).toBe(true);
    const done = exerciseReducer(state, { type: "finish" });
    expect(done.phase).toBe("done");
    expect(isFirstTryCorrect(done)).toBe(true);
  });

  it("is not first-try correct after one wrong check", () => {
    const state = run(pick("b"), WRONG, pick("a"), RIGHT);
    expect(state.phase).toBe("correct");
    expect(state.wrongCount).toBe(1);
    expect(isFirstTryCorrect(state)).toBe(false);
  });

  it("climbs a tier per wrong check and keeps the mistake to highlight", () => {
    const one = run(pick("b"), WRONG);
    expect([one.phase, feedbackTier(one)]).toEqual(["wrong1", 1]);
    expect(one.wrongTargets).toEqual(["b"]);
    // Editing keeps the feedback phase until the next check.
    const edited = exerciseReducer(one, pick("c"));
    expect(edited.phase).toBe("wrong1");
    const two = exerciseReducer(edited, WRONG);
    expect([two.phase, feedbackTier(two)]).toEqual(["wrong2", 2]);
    const three = exerciseReducer(two, WRONG);
    expect([three.phase, feedbackTier(three)]).toEqual(["wrong3", 3]);
  });

  it("lets go of wrong picks of a selection and keeps the right ones", () => {
    const state = run(
      { type: "input", input: { type: "choice", selected: ["a", "b"] } },
      { type: "check", result: { correct: false, wrongTargets: ["b"] } },
    );
    expect(state.phase).toBe("wrong1");
    expect(state.input).toEqual({ type: "choice", selected: ["a"] });
    const emptied = run(pick("b"), WRONG);
    expect(emptied.input).toBeNull();
    expect(canCheck(emptied)).toBe(false);
  });

  it("requires retyping the answer after three wrong checks", () => {
    const three = run(pick("b"), WRONG, pick("b"), WRONG, pick("b"), WRONG);
    expect(three.phase).toBe("wrong3");
    // The answer is on show: no edits, no checks, no finishing.
    expect(exerciseReducer(three, pick("a"))).toBe(three);
    expect(exerciseReducer(three, RIGHT)).toBe(three);
    expect(exerciseReducer(three, { type: "finish" })).toBe(three);

    const retype = exerciseReducer(three, { type: "retype" });
    expect(retype.phase).toBe("retype");
    expect(retype.input).toBeNull();
    expect(feedbackTier(retype)).toBe(0);
    expect(three.retypes).toBe(0);
    expect(retype.retypes).toBe(1);

    const missed = exerciseReducer(exerciseReducer(retype, pick("c")), WRONG);
    expect(missed.phase).toBe("retype");
    expect(missed.retypeMissed).toBe(true);
    expect(feedbackTier(missed)).toBe(1);
    expect(missed.wrongCount).toBe(4);

    const right = exerciseReducer(exerciseReducer(missed, pick("a")), RIGHT);
    expect(right.phase).toBe("correct");
    expect(isFirstTryCorrect(right)).toBe(false);
    // The answer area is keyed by it: accepting must not remount it.
    expect(right.retypes).toBe(1);
    expect(exerciseReducer(right, { type: "finish" }).phase).toBe("done");
  });

  it("ignores retype and finish outside their phases", () => {
    const answered = run(pick("a"));
    expect(exerciseReducer(answered, { type: "retype" })).toBe(answered);
    expect(exerciseReducer(answered, { type: "finish" })).toBe(answered);
    const done = run(pick("a"), RIGHT, { type: "finish" });
    expect(exerciseReducer(done, pick("b"))).toBe(done);
  });
});

describe("useExerciseMachine", () => {
  it("grades the entered input and reports the outcome", () => {
    const { result } = renderHook(() =>
      useExerciseMachine(choiceExercise(["a"])),
    );
    act(() => result.current.setInput({ type: "choice", selected: ["b"] }));
    act(() => result.current.check());
    expect(result.current.tier).toBe(1);
    expect(result.current.state.wrongTargets).toEqual(["b"]);

    act(() => result.current.setInput({ type: "choice", selected: ["a"] }));
    act(() => result.current.check());
    expect(result.current.state.phase).toBe("correct");

    let outcome: ReturnType<typeof result.current.finish> | undefined;
    act(() => {
      outcome = result.current.finish();
    });
    expect(outcome).toEqual({ firstTryCorrect: false, wrongCount: 1 });
    expect(result.current.state.phase).toBe("done");
  });

  it("does nothing on check before any input", () => {
    const { result } = renderHook(() =>
      useExerciseMachine(choiceExercise(["a"])),
    );
    act(() => result.current.check());
    expect(result.current.state.phase).toBe("idle");
    expect(result.current.canCheck).toBe(false);
  });
});
