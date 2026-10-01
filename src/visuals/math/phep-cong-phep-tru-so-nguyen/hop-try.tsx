"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative, stateStep, stateStepper } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import {
  LineAxis,
  lineViewBox,
  NamedDot,
  numberMark,
} from "@/visuals/shared/number-line";
import {
  type LineRange,
  planLine,
  signed,
  tickX,
  tryDotRadius,
} from "@/visuals/shared/number-line-geometry";

// A number line with one point the child walks: it starts on a given tick,
// and each press of an arrow button moves it one tick left or right (a tick
// is too narrow to tap). State is { p0 }, the tick the point stands on,
// reported from the start. The start stays marked in blue, the point in
// amber, and a line under the buttons says how far the point has walked.

export type HopTrySpec = LineRange & {
  label: string;
  start: number;
  // Lesson screen only: the tick the point must reach before "Tiếp" works.
  goal?: number;
  done?: string;
};

const START_COLOR = "blue";
const POINT_COLOR = "amber";
const START_MARK_RADIUS = 6;
const BUTTON =
  "inline-flex size-touch shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

const KEY = "p0";

export function walkedText(start: number, value: number): string {
  const moved = value - start;
  if (moved === 0) return "Chưa đi bước nào";
  return moved > 0
    ? `Đã đi sang phải ${moved} đơn vị`
    : `Đã đi sang trái ${-moved} đơn vị`;
}

export function HopTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: HopTrySpec }) {
  const { start, goal, done } = spec;
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

  const radius = tryDotRadius(spec);
  const plan = planLine({ names: false, arrowRows: 0, zoneTags: false });
  const marks = new Map([
    [start, numberMark(START_COLOR, start)],
    [value, numberMark(POINT_COLOR, value)],
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
          <g {...decorative}>
            <ConceptShape
              color={START_COLOR}
              cx={tickX(spec, start)}
              cy={plan.axisY}
              r={START_MARK_RADIUS}
              className="stroke-surface"
              strokeWidth={2}
            />
          </g>
          <motion.g
            initial={false}
            animate={{ x: tickX(spec, value) }}
            transition={transition}
          >
            <NamedDot
              x={0}
              y={plan.axisY}
              color={POINT_COLOR}
              radius={radius}
            />
          </motion.g>
        </LineAxis>
      </svg>
      <fieldset
        className="flex flex-col items-center gap-1"
        {...stateStepper(KEY, value)}
      >
        <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
          <ConceptMark color={POINT_COLOR} className="size-4" />
          Điểm đang đi
        </legend>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={BUTTON}
            aria-label="Sang trái 1 đơn vị"
            {...stateStep(KEY, "down")}
            disabled={locked || value <= spec.from}
            onClick={() => move(Math.max(value - 1, spec.from))}
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
          <output
            aria-live="polite"
            className="min-w-14 text-center font-heading text-title font-bold text-concept-amber tabular-nums"
          >
            {signed(value)}
          </output>
          <button
            type="button"
            className={BUTTON}
            aria-label="Sang phải 1 đơn vị"
            {...stateStep(KEY, "up")}
            disabled={locked || value >= spec.to}
            onClick={() => move(Math.min(value + 1, spec.to))}
          >
            <ChevronRight aria-hidden className="size-6" />
          </button>
        </div>
      </fieldset>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {walkedText(start, value)}
      </p>
      {met && !shown && <DoneLine>{done ?? "Xong rồi!"}</DoneLine>}
      {met && shown && <ShownLine>{done ?? "Điểm đã tới đúng chỗ."}</ShownLine>}
    </div>
  );
}
