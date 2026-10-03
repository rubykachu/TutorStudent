"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { type BoardStep, stepDone, stepEnabled } from "./board-steps";
import { Figure } from "./figure";
import type { FigureSpec } from "./figure-spec";

// A drawing board the child works on as on paper. Under the picture: the
// instruction of the step to do, the steppers that set a length, the buttons
// that pick a value, and the buttons that draw a line or an arc; each step
// waits for the ones before it. State is one key per step (see
// `board-steps.ts`). On a lesson screen with a goal (`guided`) it is a
// guided "cùng làm" step: "Tiếp" waits until `met`. In an exercise the
// validator of the visual decides and nothing is revealed.

export type BoardWarning = {
  text: string;
  // Key of the press step that stays off while the warning shows.
  blocks: string;
};

export type BoardProps = VisualProps & {
  steps: readonly BoardStep[];
  // The board as it looks in a state.
  figureOf: (state: VisualState) => FigureSpec;
  // Lesson screen: the child has drawn what the screen asks for.
  guided: boolean;
  met: (state: VisualState) => boolean;
  // The state "Xem cách làm" shows.
  solved: () => VisualState;
  // Shown instead of the instruction while a step cannot work yet (two
  // compass arcs that do not meet).
  warning?: (
    state: VisualState,
    current: BoardStep | undefined,
  ) => BoardWarning | undefined;
  done: string;
  // Exercise (not guided): said, in plain writing, once every step is done,
  // instead of "Bạn đã làm xong mọi bước."; left out once the frame has
  // graded the answer (the board is locked then).
  finished?: string;
  // The picture is capped so it, the instruction and the controls of the
  // biggest board still fit one frame: pixels, or a CSS length.
  maxHeight?: number | string;
};

const DEFAULT_MAX_HEIGHT = 188;

// The look of a button of the board, in each state. They do not start from the
// shared action button, whose own colours would fight with the state's.
const BUTTON =
  "inline-flex min-h-touch items-center justify-center gap-1 whitespace-nowrap rounded-lg border-2 px-3 font-semibold disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97 md:px-4";
const BUTTON_TONE = {
  idle: "border-border bg-surface text-foreground",
  done: "border-correct bg-correct-soft text-correct-soft-foreground",
  chosen: "border-primary bg-primary text-primary-foreground",
} as const;

export function Board({
  steps,
  figureOf,
  guided,
  met,
  solved,
  warning,
  done,
  finished,
  maxHeight = DEFAULT_MAX_HEIGHT,
  onStateChange,
  shownState,
  disabled = false,
}: BoardProps) {
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const reached = guided && met(state);

  function change(next: VisualState) {
    setOwn(next);
    onStateChange?.(next);
  }
  function set(key: string, value: number) {
    change({ ...state, [key]: value });
  }
  const { shown } = useGuidedGoal({
    met: reached,
    guided,
    reveal: () => change(solved()),
  });

  const enabledAt = (i: number) => stepEnabled(steps, i, state);
  const current = steps.find((step) => !stepDone(step, state));
  const warn = warning?.(state, current);
  const indexed = steps.map((step, i) => ({ step, i }));
  const steppers = indexed.flatMap(({ step, i }) =>
    step.kind === "stepper" ? [{ step, i }] : [],
  );
  const picks = indexed.flatMap(({ step, i }) =>
    step.kind === "pick" ? [{ step, i }] : [],
  );
  const presses = indexed.flatMap(({ step, i }) =>
    step.kind === "press" ? [{ step, i }] : [],
  );
  const choice = steps.find((step) => step.kind === "choice");
  const pressesDone = presses.every(({ step }) => stepDone(step, state));
  const closing =
    finished === undefined || guided
      ? "Bạn đã làm xong mọi bước."
      : locked
        ? ""
        : finished;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="w-full max-w-md">
        <Figure spec={figureOf(state)} maxHeight={maxHeight} />
      </div>
      <p
        className={`min-h-12 text-center text-caption ${warn ? "font-semibold text-retry-soft-foreground" : ""}`}
        aria-live="polite"
        data-construct-instruction
      >
        {warn ? warn.text : (current?.text ?? closing)}
      </p>
      <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-1">
        {steppers.map(({ step, i }) =>
          step.kind === "stepper" ? (
            <NumberStepper
              key={step.key}
              label={step.short}
              value={state[step.key]}
              min={step.min}
              max={step.max}
              disabled={locked || !enabledAt(i)}
              stateKey={step.key}
              onChange={(value) => set(step.key, value)}
            />
          ) : null,
        )}
      </div>
      {picks.map(({ step, i }) =>
        step.kind === "pick" ? (
          <div
            key={step.key}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-caption text-muted-foreground">
              {step.short}
            </span>
            {step.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${BUTTON} ${state[step.key] === option.value ? BUTTON_TONE.chosen : BUTTON_TONE.idle}`}
                disabled={locked || !enabledAt(i)}
                aria-pressed={state[step.key] === option.value}
                onClick={() => set(step.key, option.value)}
                {...stateSet(step.key, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null,
      )}
      {choice?.kind === "choice" && pressesDone ? (
        <div className="flex flex-wrap justify-center gap-2">
          {(
            [
              [1, choice.yes],
              [2, choice.no],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              className={`${BUTTON} ${state[choice.key] === value ? BUTTON_TONE.chosen : BUTTON_TONE.idle}`}
              disabled={locked}
              aria-pressed={state[choice.key] === value}
              onClick={() => set(choice.key, value)}
              {...stateSet(choice.key, value)}
            >
              {text}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {presses.map(({ step, i }) => {
            const stepIsDone = stepDone(step, state);
            return (
              <button
                key={step.key}
                type="button"
                className={`${BUTTON} ${stepIsDone ? BUTTON_TONE.done : BUTTON_TONE.idle}`}
                disabled={
                  locked ||
                  (!stepIsDone && !enabledAt(i)) ||
                  warn?.blocks === step.key
                }
                aria-pressed={stepIsDone}
                onClick={() => set(step.key, stepIsDone ? 0 : 1)}
                {...stateSet(step.key, 1)}
              >
                {stepIsDone && <Check aria-hidden className="size-5" />}
                {step.kind === "press" ? step.short : ""}
              </button>
            );
          })}
        </div>
      )}
      {reached && !shown && <DoneLine>{done}</DoneLine>}
      {reached && shown && <ShownLine>{done}</ShownLine>}
    </div>
  );
}
