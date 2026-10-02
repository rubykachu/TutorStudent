"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateStep, stateStepper } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import {
  LineAxis,
  lineViewBox,
  NamedDot,
  numberMark,
} from "@/visuals/shared/number-line";
import {
  type LineRange,
  MINUS,
  planLine,
  signed,
  tickX,
  tryDotRadius,
} from "@/visuals/shared/number-line-geometry";

// A number line with one point the child walks in equal jumps: it starts on
// a given tick, and each press of an arrow button moves it `step` ticks left
// or right (a tick is too narrow to tap). State is { p0 }, the tick the point
// stands on, reported from the start. The start stays written in blue under
// its tick; the point is blue too (the factor it started from), and turns
// amber on the tick of the lesson screen's goal (the product). A line under
// the buttons says how many jumps the point has made.

export type JumpTrySpec = LineRange & {
  label: string;
  start: number;
  // Ticks the point moves on each press.
  step: number;
  // Lesson screen only: the tick the point must reach before "Tiếp" works.
  goal?: number;
  done?: string;
};

const START_COLOR = "blue";
const RESULT_COLOR = "amber";
const BUTTON =
  "inline-flex h-touch min-w-touch shrink-0 items-center justify-center gap-1 rounded-lg px-2 font-heading text-body-lg font-bold border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

const KEY = "p0";

export function walkedText(start: number, value: number, step: number): string {
  const moved = value - start;
  if (moved === 0) return "Chưa bấm lần nào";
  const times = Math.abs(moved) / step;
  return `Đã đi sang ${moved > 0 ? "phải" : "trái"} ${times} lần, mỗi lần ${step} đơn vị`;
}

export function JumpTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: JumpTrySpec }) {
  const { start, step, goal, done } = spec;
  const [own, setOwn] = useState<VisualState>({ [KEY]: start });
  const value = shownState?.[KEY] ?? own[KEY] ?? start;
  const locked = disabled || shownState !== undefined;
  const transition = useVisualTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: report the opening state once, on mount
  useEffect(() => {
    if (shownState === undefined) onStateChange?.(own);
  }, []);

  function move(next: number) {
    const state = { [KEY]: next };
    setOwn(state);
    onStateChange?.(state);
  }

  // Lesson screen with a goal: "Tiếp" waits until the point is on its tick.
  const guided = isLessonScreen(params) && goal !== undefined;
  const met = guided && value === goal;
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => {
      if (goal !== undefined) move(goal);
    },
  });

  const pointColor = guided && value === goal ? RESULT_COLOR : START_COLOR;
  const radius = tryDotRadius(spec);
  const plan = planLine({ names: false, arrowRows: 0, zoneTags: false });
  const marks = new Map([
    [start, numberMark(START_COLOR, start)],
    [value, numberMark(pointColor, value)],
  ]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <svg
        viewBox={lineViewBox(plan)}
        role="img"
        aria-label={`${spec.label}: bắt đầu ở ${signed(start)}, điểm đang ở ${signed(value)}`}
        className="h-auto w-full max-w-md"
      >
        <LineAxis range={spec} plan={plan} marks={marks}>
          <motion.g
            initial={false}
            animate={{ x: tickX(spec, value) }}
            transition={transition}
          >
            <NamedDot x={0} y={plan.axisY} color={pointColor} radius={radius} />
          </motion.g>
        </LineAxis>
      </svg>
      <fieldset
        className="flex flex-col items-center gap-1"
        {...stateStepper(KEY, value)}
      >
        <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
          <ConceptMark color={pointColor} className="size-4" />
          Điểm đang đi
        </legend>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={BUTTON}
            aria-label={`Sang trái ${step} đơn vị`}
            {...stateStep(KEY, "down")}
            disabled={locked || value <= spec.from}
            onClick={() => move(Math.max(value - step, spec.from))}
          >
            <ChevronLeft aria-hidden className="size-6" />
            <span aria-hidden>{`${MINUS}${step}`}</span>
          </button>
          <output
            aria-live="polite"
            className={`min-w-14 text-center font-heading text-title font-bold tabular-nums ${CONCEPT_CLASSES[pointColor].text}`}
          >
            {signed(value)}
          </output>
          <button
            type="button"
            className={BUTTON}
            aria-label={`Sang phải ${step} đơn vị`}
            {...stateStep(KEY, "up")}
            disabled={locked || value >= spec.to}
            onClick={() => move(Math.min(value + step, spec.to))}
          >
            <span aria-hidden>{`+${step}`}</span>
            <ChevronRight aria-hidden className="size-6" />
          </button>
        </div>
      </fieldset>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {walkedText(start, value, step)}
      </p>
      {met && !shown && <DoneLine>{done ?? "Xong rồi!"}</DoneLine>}
      {met && shown && <ShownLine>{done ?? "Điểm đã tới đúng chỗ."}</ShownLine>}
    </div>
  );
}
