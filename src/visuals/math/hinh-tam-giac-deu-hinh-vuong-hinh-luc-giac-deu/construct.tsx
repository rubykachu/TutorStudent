"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import {
  apexOf,
  type ConstructShape,
  constructFigure,
  constructSteps,
  MAX_CM,
  MIN_CM,
  solvedState,
  stepDone,
  stepEnabled,
} from "./construction";
import { Figure } from "./figure";
import { isConstructed } from "./logic";

// A drawing board the child works on as on paper: a ruler under the first
// segment, a compass or a set square for the rest. Under the picture the
// instruction of the step to do, the steppers that set a length, and the
// buttons that draw a line or an arc; each step waits for the ones before
// it. State is one key per step (see `construction.ts`). On a lesson screen
// with a `goal` side it is a guided "cùng làm" step: "Tiếp" waits until the
// figure of that side is drawn. In an exercise the validator decides and
// nothing is revealed.

export type ConstructSpec = {
  shape: ConstructShape;
  // Corners: base left, base right, then the apex (triangle) or the corner
  // above the right one and the corner above the left one (square).
  names: readonly string[];
  // Also draw the two diagonals and ask whether they are perpendicular.
  diagonals?: boolean;
  // Lesson screen only: the side length to draw before "Tiếp" works.
  goal?: number;
  done?: string;
};

// The picture is capped so the picture, the instruction and the controls
// of the biggest board still fit one frame.
const FIGURE_MAX_HEIGHT = 188;

// The look of a button of the board, in each state. They do not start from the
// shared action button, whose own colours would fight with the state's.
const BUTTON =
  "inline-flex min-h-touch items-center justify-center gap-1 whitespace-nowrap rounded-lg border-2 px-3 font-semibold disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97 md:px-4";
const BUTTON_TONE = {
  idle: "border-border bg-surface text-foreground",
  done: "border-correct bg-correct-soft text-correct-soft-foreground",
  chosen: "border-primary bg-primary text-primary-foreground",
} as const;

export function Construct({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: ConstructSpec }) {
  const diagonals = spec.diagonals ?? false;
  const steps = constructSteps(spec.shape, spec.names, diagonals);
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const guided = isLessonScreen(params) && spec.goal !== undefined;
  const side = guided ? (spec.goal as number) : (params?.side ?? 0);
  const met = guided && isConstructed(spec.shape, diagonals)(state, { side });

  function change(next: VisualState) {
    setOwn(next);
    onStateChange?.(next);
  }
  function set(key: string, value: number) {
    change({ ...state, [key]: value });
  }
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => change(solvedState(spec.shape, side, diagonals)),
  });

  const enabledAt = (i: number) => stepEnabled(steps, i, state);
  const currentIndex = steps.findIndex((step) => !stepDone(step, state));
  const current = steps[currentIndex];
  const apexMissing =
    spec.shape === "triangle" &&
    current?.key === "apex" &&
    apexOf(state) === undefined;
  const steppers = steps.flatMap((step, i) =>
    step.kind === "stepper" ? [{ step, i }] : [],
  );
  const presses = steps.flatMap((step, i) =>
    step.kind === "press" ? [{ step, i }] : [],
  );
  const choice = steps.find((step) => step.kind === "choice");
  const pressesDone = presses.every(({ step }) => stepDone(step, state));

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="w-full max-w-md">
        <Figure
          spec={constructFigure(spec.shape, spec.names, state)}
          maxHeight={FIGURE_MAX_HEIGHT}
        />
      </div>
      <p
        className={`min-h-12 text-center text-caption ${apexMissing ? "font-semibold text-retry-soft-foreground" : ""}`}
        aria-live="polite"
        data-construct-instruction
      >
        {apexMissing
          ? "Hai cung chưa gặp nhau. Hãy mở compa rộng hơn."
          : (current?.text ?? "Bạn đã làm xong mọi bước.")}
      </p>
      <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-1">
        {steppers.map(({ step, i }) => (
          <NumberStepper
            key={step.key}
            label={step.kind === "stepper" ? step.short : ""}
            value={state[step.key]}
            min={MIN_CM}
            max={MAX_CM}
            disabled={locked || !enabledAt(i)}
            stateKey={step.key}
            onChange={(value) => set(step.key, value)}
          />
        ))}
      </div>
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
            const done = stepDone(step, state);
            return (
              <button
                key={step.key}
                type="button"
                className={`${BUTTON} ${done ? BUTTON_TONE.done : BUTTON_TONE.idle}`}
                disabled={
                  locked ||
                  (!done && !enabledAt(i)) ||
                  (apexMissing && step.key === "apex")
                }
                aria-pressed={done}
                onClick={() => set(step.key, done ? 0 : 1)}
                {...stateSet(step.key, 1)}
              >
                {done && <Check aria-hidden className="size-5" />}
                {step.kind === "press" ? step.short : ""}
              </button>
            );
          })}
        </div>
      )}
      {met && !shown && (
        <DoneLine>{spec.done ?? "Bạn đã vẽ xong hình."}</DoneLine>
      )}
      {met && shown && <ShownLine>{spec.done ?? "Hình đã vẽ xong."}</ShownLine>}
    </div>
  );
}
