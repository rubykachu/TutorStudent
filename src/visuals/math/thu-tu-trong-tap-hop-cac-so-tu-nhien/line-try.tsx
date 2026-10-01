"use client";

import { Minus, Plus } from "lucide-react";
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
import { LineAxis, lineViewBox, NamedDot, numberMark } from "./line";
import {
  nameY,
  planLine,
  TRY_DOT_RADIUS,
  tickValues,
  tickX,
} from "./line-logic";
import type { LineTrySpec } from "./types";

// A number line with named points the child moves, one pair of large − / +
// buttons per point (a tick is too narrow to tap), each press moving the point
// by one tick. State is { p0, p1, … }, the value of each point; every point
// starts on the first tick and the state is reported from the start.

const POINT_COLOR = "amber";
const BUTTON =
  "inline-flex size-touch shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

const keyOf = (index: number) => `p${index}`;

// The tick after `value` (or the one before), or `value` at the end of the line.
function neighbour(
  ticks: readonly number[],
  value: number,
  direction: "down" | "up",
): number {
  return direction === "up"
    ? (ticks.find((tick) => tick > value) ?? value)
    : (ticks.findLast((tick) => tick < value) ?? value);
}

function stateOf(values: readonly number[]): VisualState {
  return Object.fromEntries(values.map((value, i) => [keyOf(i), value]));
}

export function LineTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: LineTrySpec }) {
  const { names, goal, done } = spec;
  const ticks = tickValues(spec);
  const first = ticks[0] ?? spec.from;
  const last = ticks[ticks.length - 1] ?? first;
  const [own, setOwn] = useState<VisualState>(() =>
    stateOf(names.map(() => first)),
  );
  const values = names.map(
    (_, i) => shownState?.[keyOf(i)] ?? own[keyOf(i)] ?? first,
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

  const plan = planLine(
    { ...spec, layers: [] },
    {
      dotRadius: TRY_DOT_RADIUS,
      nameRows: Math.max(names.length - 1, 0),
    },
  );
  const marks = new Map(
    values.map((value) => [value, numberMark(POINT_COLOR, String(value))]),
  );
  const description = `Tia số từ ${first} đến ${last}: ${names
    .map((name, i) => `điểm ${name} ở ${values[i]}`)
    .join(", ")}`;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <svg
        viewBox={lineViewBox(plan)}
        role="img"
        aria-label={description}
        className="h-auto w-full max-w-md"
      >
        <LineAxis geometry={spec} plan={plan} marks={marks}>
          {names.map((name, i) => {
            const value = values[i] ?? first;
            // Points sharing a tick stack their names.
            const rank = values.slice(0, i).filter((v) => v === value).length;
            return (
              <motion.g
                key={name}
                initial={false}
                animate={{ x: tickX(spec, value) }}
                transition={transition}
              >
                <NamedDot
                  x={0}
                  y={plan.axisY}
                  color={POINT_COLOR}
                  name={name}
                  radius={TRY_DOT_RADIUS}
                  nameAt={nameY(plan, TRY_DOT_RADIUS, rank)}
                />
              </motion.g>
            );
          })}
        </LineAxis>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        {names.map((name, i) => {
          const value = values[i] ?? first;
          const label = `điểm ${name}`;
          return (
            <fieldset
              key={name}
              className="flex flex-col items-center gap-1"
              {...stateStepper(keyOf(i), value)}
            >
              <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
                <ConceptMark color={POINT_COLOR} className="size-4" />
                {`Điểm ${name}`}
              </legend>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={BUTTON}
                  aria-label={`Lùi ${label}`}
                  {...stateStep(keyOf(i), "down")}
                  disabled={locked || value <= first}
                  onClick={() => move(i, neighbour(ticks, value, "down"))}
                >
                  <Minus aria-hidden className="size-5" />
                </button>
                <output
                  aria-live="polite"
                  className="min-w-12 text-center font-heading text-title font-bold text-concept-amber tabular-nums"
                >
                  {value}
                </output>
                <button
                  type="button"
                  className={BUTTON}
                  aria-label={`Tiến ${label}`}
                  {...stateStep(keyOf(i), "up")}
                  disabled={locked || value >= last}
                  onClick={() => move(i, neighbour(ticks, value, "up"))}
                >
                  <Plus aria-hidden className="size-5" />
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
