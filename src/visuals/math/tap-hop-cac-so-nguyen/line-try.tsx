"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
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
  planLine,
  signed,
  tickX,
  tryDotRadius,
} from "@/visuals/shared/number-line-geometry";
import { dotPlaces, neighbour, pointKey, START_TICK } from "./logic";

// A number line with named points the child moves, one pair of large arrow
// buttons per point (a tick is too narrow to tap), each press moving the
// point by one tick to the left or right. State is { p0, p1, … }, the value
// of each point; every point starts on the origin and the state is reported
// from the start.

export type LineTrySpec = LineRange & {
  label: string;
  names: readonly string[];
  // Ticks that carry their number; every tick when absent.
  labelAt?: readonly number[];
  // Lesson screen only: where each point must end up before "Tiếp" works.
  goal?: readonly number[];
  done?: string;
};

const POINT_COLOR = "amber";
// More points than this and the steppers are drawn closer together, so two
// of them fit side by side on a phone and the picture stays short.
const COMPACT_FROM = 4;
const BUTTON =
  "inline-flex size-touch shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

function stateOf(values: readonly number[]): VisualState {
  return Object.fromEntries(values.map((value, i) => [pointKey(i), value]));
}

export function LineTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: LineTrySpec }) {
  const { names, goal, done } = spec;
  const [own, setOwn] = useState<VisualState>(() =>
    stateOf(names.map(() => START_TICK)),
  );
  const values = names.map(
    (_, i) => shownState?.[pointKey(i)] ?? own[pointKey(i)] ?? START_TICK,
  );
  const locked = disabled || shownState !== undefined;
  const transition = useVisualTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: report the opening state once, on mount
  useEffect(() => {
    if (shownState === undefined) onStateChange?.(own);
  }, []);

  function move(index: number, value: number) {
    const next = stateOf(values.map((old, i) => (i === index ? value : old)));
    setOwn(next);
    onStateChange?.(next);
  }

  // Lesson screen with a goal: "Tiếp" waits until every point is on its value.
  const guided = isLessonScreen(params) && goal !== undefined;
  const right = goal
    ? values.filter((value, i) => value === goal[i]).length
    : 0;
  const met = guided && goal !== undefined && right === goal.length;
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => {
      if (!goal) return;
      const next = stateOf(goal);
      setOwn(next);
      onStateChange?.(next);
    },
  });

  const compact = names.length >= COMPACT_FROM;
  const radius = tryDotRadius(spec);
  const plan = planLine({ names: true, arrowRows: 0, zoneTags: false });
  const places = dotPlaces(values, radius, compact);
  const marks = new Map(
    values.map((value) => [value, numberMark(POINT_COLOR, value)]),
  );

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <svg
        viewBox={lineViewBox(plan)}
        role="img"
        aria-label={`${spec.label}: ${names
          .map((name, i) => `điểm ${name} ở ${signed(values[i] ?? 0)}`)
          .join(", ")}`}
        className="h-auto w-full max-w-md"
      >
        <LineAxis range={spec} plan={plan} labelAt={spec.labelAt} marks={marks}>
          {names.map((name, i) =>
            places[i]?.drawn === false ? null : (
              <motion.g
                key={name}
                initial={false}
                animate={{
                  x:
                    tickX(spec, values[i] ?? START_TICK) +
                    (places[i]?.offset ?? 0),
                }}
                transition={transition}
              >
                <NamedDot
                  x={0}
                  y={plan.axisY}
                  color={POINT_COLOR}
                  name={places[i]?.named ? name : undefined}
                  radius={radius}
                />
              </motion.g>
            ),
          )}
        </LineAxis>
      </svg>
      <div
        className={`flex flex-wrap justify-center ${compact ? "gap-x-3 gap-y-2" : "gap-x-6 gap-y-3"}`}
      >
        {names.map((name, i) => {
          const value = values[i] ?? START_TICK;
          const label = `điểm ${name}`;
          return (
            <fieldset
              key={name}
              className="flex flex-col items-center gap-1"
              {...stateStepper(pointKey(i), value)}
            >
              <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
                <ConceptMark color={POINT_COLOR} className="size-4" />
                {`Điểm ${name}`}
              </legend>
              <div
                className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}
              >
                <button
                  type="button"
                  className={BUTTON}
                  aria-label={`Sang trái 1 đơn vị, ${label}`}
                  {...stateStep(pointKey(i), "down")}
                  disabled={locked || value <= spec.from}
                  onClick={() => move(i, neighbour(spec, value, "down"))}
                >
                  <ChevronLeft aria-hidden className="size-6" />
                </button>
                <output
                  aria-live="polite"
                  className={`${compact ? "min-w-9" : "min-w-14"} text-center font-heading text-title font-bold text-concept-amber tabular-nums`}
                >
                  {signed(value)}
                </output>
                <button
                  type="button"
                  className={BUTTON}
                  aria-label={`Sang phải 1 đơn vị, ${label}`}
                  {...stateStep(pointKey(i), "up")}
                  disabled={locked || value >= spec.to}
                  onClick={() => move(i, neighbour(spec, value, "up"))}
                >
                  <ChevronRight aria-hidden className="size-6" />
                </button>
              </div>
            </fieldset>
          );
        })}
      </div>
      {guided && goal && (
        <p
          className="text-center text-caption text-muted-foreground"
          aria-live="polite"
        >
          {`Đã đặt đúng ${right}/${goal.length} điểm`}
        </p>
      )}
      {met && !shown && <DoneLine>{done ?? "Xong rồi!"}</DoneLine>}
      {met && shown && (
        <ShownLine>{done ?? "Các điểm đã nằm đúng chỗ."}</ShownLine>
      )}
    </div>
  );
}
