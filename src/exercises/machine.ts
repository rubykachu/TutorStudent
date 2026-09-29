import { useCallback, useReducer } from "react";
import { grade } from "@/exercises/grade";
import type { GradeResult } from "@/exercises/grade/result";
import {
  type ExerciseInput,
  type InputFor,
  isInputEmpty,
  releaseWrongPicks,
} from "@/exercises/input";
import type { BasicExercise } from "@/schema/content";

// Life of one exercise attempt:
//   idle -> answered -> correct -> done
//                    -> wrong1 -> wrong2 -> wrong3 -> retype -> correct -> done
// A correct check from any wrong phase also goes to `correct`. After the third
// wrong check the answer is shown (visual or revealed answer); the child must
// then enter it again from an empty answer area before the exercise counts as
// finished.
export type Phase =
  | "idle"
  | "answered"
  | "correct"
  | "wrong1"
  | "wrong2"
  | "wrong3"
  | "retype"
  | "done";

export type MachineState<I> = {
  phase: Phase;
  input: I | null;
  // Every wrong check, retype misses included.
  wrongCount: number;
  wrongTargets: readonly string[];
  // The last check while retyping was wrong; drives a first-tier nudge.
  retypeMissed: boolean;
};

export type MachineAction<I> =
  | { type: "input"; input: I | null }
  | { type: "check"; result: GradeResult }
  | { type: "retype" }
  | { type: "finish" };

// 0: no feedback; 1: shake + highlight; 2: hint visual or stronger highlight;
// 3: solution visual or revealed answer.
export type FeedbackTier = 0 | 1 | 2 | 3;

export function initialMachineState<I>(): MachineState<I> {
  return {
    phase: "idle",
    input: null,
    wrongCount: 0,
    wrongTargets: [],
    retypeMissed: false,
  };
}

const EDITABLE: ReadonlySet<Phase> = new Set([
  "idle",
  "answered",
  "wrong1",
  "wrong2",
  "retype",
]);

const NEXT_WRONG: Partial<Record<Phase, Phase>> = {
  answered: "wrong1",
  wrong1: "wrong2",
  wrong2: "wrong3",
  retype: "retype",
};

function hasAnswer<I extends ExerciseInput>(input: I | null): boolean {
  return input !== null && !isInputEmpty(input);
}

export function canCheck<I extends ExerciseInput>(
  state: MachineState<I>,
): boolean {
  return EDITABLE.has(state.phase) && hasAnswer(state.input);
}

export function exerciseReducer<I extends ExerciseInput>(
  state: MachineState<I>,
  action: MachineAction<I>,
): MachineState<I> {
  switch (action.type) {
    case "input": {
      if (!EDITABLE.has(state.phase)) return state;
      // Before the first check the phase tracks whether anything is entered;
      // afterwards the feedback phase stays until the next check.
      const beforeFirstCheck =
        state.phase === "idle" || state.phase === "answered";
      const phase = beforeFirstCheck
        ? hasAnswer(action.input)
          ? "answered"
          : "idle"
        : state.phase;
      return { ...state, phase, input: action.input };
    }
    case "check": {
      if (!canCheck(state)) return state;
      if (action.result.correct) {
        return {
          ...state,
          phase: "correct",
          wrongTargets: [],
          retypeMissed: false,
        };
      }
      return {
        ...state,
        phase: NEXT_WRONG[state.phase] ?? state.phase,
        input: releaseWrongPicks(state.input, action.result.wrongTargets),
        wrongCount: state.wrongCount + 1,
        wrongTargets: action.result.wrongTargets,
        retypeMissed: state.phase === "retype",
      };
    }
    case "retype":
      if (state.phase !== "wrong3") return state;
      return {
        ...state,
        phase: "retype",
        input: null,
        wrongTargets: [],
        retypeMissed: false,
      };
    case "finish":
      return state.phase === "correct" ? { ...state, phase: "done" } : state;
  }
}

export function feedbackTier<I>(state: MachineState<I>): FeedbackTier {
  switch (state.phase) {
    case "wrong1":
      return 1;
    case "wrong2":
      return 2;
    case "wrong3":
      return 3;
    case "retype":
      return state.retypeMissed ? 1 : 0;
    default:
      return 0;
  }
}

// Only a correct answer with no wrong check before it counts as recalled; it
// becomes the SRS rating (Good vs Again).
export function isFirstTryCorrect<I>(state: MachineState<I>): boolean {
  return (
    (state.phase === "correct" || state.phase === "done") &&
    state.wrongCount === 0
  );
}

export type ExerciseOutcome = {
  firstTryCorrect: boolean;
  wrongCount: number;
};

export type ExerciseMachine<I> = {
  state: MachineState<I>;
  tier: FeedbackTier;
  canCheck: boolean;
  firstTryCorrect: boolean;
  setInput: (input: I | null) => void;
  // Grades the input; returns whether the answer was accepted.
  check: () => boolean;
  startRetype: () => void;
  // Moves `correct` to `done` and returns the outcome to record.
  finish: () => ExerciseOutcome;
};

// One machine per exercise: callers key the owning component by exercise id
// so a new exercise starts from a fresh state.
export function useExerciseMachine<E extends BasicExercise>(
  exercise: E,
): ExerciseMachine<InputFor<E["type"]>> {
  type I = InputFor<E["type"]>;
  const [state, dispatch] = useReducer(
    exerciseReducer<I>,
    undefined,
    initialMachineState<I>,
  );

  const setInput = useCallback((input: I | null) => {
    dispatch({ type: "input", input });
  }, []);

  const check = useCallback(() => {
    if (!canCheck(state) || state.input === null) return false;
    const result = grade(exercise, state.input);
    dispatch({ type: "check", result });
    return result.correct;
  }, [exercise, state]);

  const startRetype = useCallback(() => dispatch({ type: "retype" }), []);

  const finish = useCallback((): ExerciseOutcome => {
    dispatch({ type: "finish" });
    return {
      firstTryCorrect: isFirstTryCorrect(state),
      wrongCount: state.wrongCount,
    };
  }, [state]);

  return {
    state,
    tier: feedbackTier(state),
    canCheck: canCheck(state),
    firstTryCorrect: isFirstTryCorrect(state),
    setInput,
    check,
    startRetype,
    finish,
  };
}
