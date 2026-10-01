import { useCallback, useReducer } from "react";
import { grade } from "@/exercises/grade";
import type { GradeResult } from "@/exercises/grade/result";
import {
  type ExerciseInput,
  type InputFor,
  isInputEmpty,
} from "@/exercises/input";
import type { BasicExercise } from "@/schema/content";

// A wrong check never edits the child's input: the answer stays exactly as
// the child left it (wrong picks marked, nothing added or removed) and only
// the third wrong check or "Bỏ qua" shows the right answer.
//
// Life of one exercise attempt:
//   idle -> answered -> correct -> done
//                    -> wrong1 -> wrong2 -> wrong3 -> retype -> correct -> done
// A correct check from any wrong phase also goes to `correct`. After the third
// wrong check the answer is shown (visual or revealed answer); the child must
// then enter it again from an empty answer area before the exercise counts as
// finished. From `correct` the child may also play the exercise again
// ("Làm lại"): back to `idle` with a clean slate, for practice only. The
// outcome of the first accepted play is kept and is what `finish` reports,
// so a replay never changes a rating or the child's progress.
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
  // Times the child started over from an empty answer area after the answer
  // was shown. Stays put through the accepting check, so whatever keys the
  // answer area by it keeps the answer the child just entered on screen.
  retypes: number;
  // Times the child played the exercise again after it was accepted.
  replays: number;
  // How the first accepted play went; null until an answer is accepted.
  outcome: ExerciseOutcome | null;
};

export type MachineAction<I> =
  | { type: "input"; input: I | null }
  | { type: "check"; result: GradeResult }
  | { type: "retype" }
  | { type: "replay" }
  | { type: "finish" };

// 0: no feedback; 1: shake + concept-coloured hint marks; 2: hint visual or
// bolder hint marks; 3: solution visual or revealed answer.
export type FeedbackTier = 0 | 1 | 2 | 3;

export function initialMachineState<I>(): MachineState<I> {
  return {
    phase: "idle",
    input: null,
    wrongCount: 0,
    wrongTargets: [],
    retypeMissed: false,
    retypes: 0,
    replays: 0,
    outcome: null,
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
          outcome: state.outcome ?? {
            firstTryCorrect: state.wrongCount === 0,
            wrongCount: state.wrongCount,
          },
        };
      }
      return {
        ...state,
        phase: NEXT_WRONG[state.phase] ?? state.phase,
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
        retypes: state.retypes + 1,
      };
    case "replay":
      if (state.phase !== "correct") return state;
      return {
        ...initialMachineState<I>(),
        replays: state.replays + 1,
        outcome: state.outcome,
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
// becomes the SRS rating (Good vs Again). Replays never change it.
export function isFirstTryCorrect<I>(state: MachineState<I>): boolean {
  return state.outcome?.firstTryCorrect === true;
}

export type ExerciseOutcome = {
  firstTryCorrect: boolean;
  wrongCount: number;
  // The child chose "Bỏ qua": moved on without an accepted answer. Never
  // rated, and never counted as a miss.
  skipped?: true;
};

// What a skipped exercise reports.
export function skippedOutcome(wrongCount = 0): ExerciseOutcome {
  return { firstTryCorrect: false, wrongCount, skipped: true };
}

export type ExerciseMachine<I> = {
  state: MachineState<I>;
  tier: FeedbackTier;
  canCheck: boolean;
  firstTryCorrect: boolean;
  setInput: (input: I | null) => void;
  // Grades the input; returns the state it leads to, or null when there is
  // nothing to check.
  check: () => MachineState<I> | null;
  startRetype: () => void;
  // Plays an accepted exercise again, unrated.
  replay: () => void;
  // Moves `correct` to `done` and returns the outcome to record: that of the
  // first accepted play.
  finish: () => ExerciseOutcome;
};

// An exercise the child already finished, shown again read-only: nothing
// can be entered, checked or recorded.
export function finishedMachineState<I>(): MachineState<I> {
  return { ...initialMachineState<I>(), phase: "done" };
}

// One machine per exercise: callers key the owning component by exercise id
// so a new exercise starts from a fresh state.
export function useExerciseMachine<E extends BasicExercise>(
  exercise: E,
  finished = false,
): ExerciseMachine<InputFor<E["type"]>> {
  type I = InputFor<E["type"]>;
  const [state, dispatch] = useReducer(
    exerciseReducer<I>,
    undefined,
    finished ? finishedMachineState<I> : initialMachineState<I>,
  );

  const setInput = useCallback((input: I | null) => {
    dispatch({ type: "input", input });
  }, []);

  const check = useCallback(() => {
    if (!canCheck(state) || state.input === null) return null;
    const action: MachineAction<I> = {
      type: "check",
      result: grade(exercise, state.input),
    };
    dispatch(action);
    return exerciseReducer(state, action);
  }, [exercise, state]);

  const startRetype = useCallback(() => dispatch({ type: "retype" }), []);
  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  const finish = useCallback((): ExerciseOutcome => {
    dispatch({ type: "finish" });
    return (
      state.outcome ?? {
        firstTryCorrect: false,
        wrongCount: state.wrongCount,
      }
    );
  }, [state]);

  return {
    state,
    tier: feedbackTier(state),
    canCheck: canCheck(state),
    firstTryCorrect: isFirstTryCorrect(state),
    setInput,
    check,
    startRetype,
    replay,
    finish,
  };
}
