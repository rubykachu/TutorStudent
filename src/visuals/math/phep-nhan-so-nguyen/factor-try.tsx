"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Formula } from "@/components/blocks/formula";
import type { ConceptColor } from "@/schema/content";
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
import { MINUS, signed } from "@/visuals/shared/number-line-geometry";

// A pattern table of products `first · n`: it opens on the single row for n =
// `start`, each press of "down" lowers the second factor by 1 and adds a row,
// and "up" takes the last row away. State is { n }, the second factor of the
// newest row, reported from the start. Each product is coloured by its sign
// (lime positive, pink negative, slate zero) with that colour's mark, and the
// newest row is highlighted. A line under the table says how the product
// changes from one row to the next once two rows are shown.

export type FactorTrySpec = {
  label: string;
  // The fixed first factor.
  first: number;
  // The second factor of the first row, and the largest the table returns to.
  start: number;
  // The smallest second factor the table reaches.
  min: number;
  // Lesson screen only: the second factor the table must reach before "Tiếp"
  // works.
  goal?: number;
  done?: string;
};

const KEY = "n";
const BUTTON =
  "inline-flex h-touch min-w-touch shrink-0 items-center justify-center gap-1 rounded-lg border-2 border-border bg-surface px-2 font-heading text-body-lg font-bold text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

// A negative factor is written in brackets: `3 · (-1)`.
const factorTex = (value: number) => (value < 0 ? `(-${-value})` : `${value}`);

function signColor(value: number): ConceptColor {
  if (value > 0) return "lime";
  return value < 0 ? "pink" : "slate";
}

export function rowTex(first: number, n: number): string {
  const product = first * n;
  const body = `${product < 0 ? "-" : ""}${Math.abs(product)}`;
  return `${factorTex(first)} \\cdot ${factorTex(n)} = \\concept{${signColor(product)}}{${body}}`;
}

// What happens to the product each time the second factor drops by 1.
export function patternText(first: number): string | undefined {
  if (first === 0) return undefined;
  return first > 0
    ? `Mỗi lần số đứng sau dấu nhân giảm 1, tích giảm ${first}`
    : `Mỗi lần số đứng sau dấu nhân giảm 1, tích tăng ${-first}`;
}

export function FactorTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: FactorTrySpec }) {
  const { first, start, min, goal, done } = spec;
  const [own, setOwn] = useState<VisualState>({ [KEY]: start });
  const value = shownState?.[KEY] ?? own[KEY] ?? start;
  const locked = disabled || shownState !== undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: report the opening state once, on mount
  useEffect(() => {
    if (shownState === undefined) onStateChange?.(own);
  }, []);

  function move(next: number) {
    const state = { [KEY]: next };
    setOwn(state);
    onStateChange?.(state);
  }

  const guided = isLessonScreen(params) && goal !== undefined;
  const met = guided && value === goal;
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => {
      if (goal !== undefined) move(goal);
    },
  });

  const factors = Array.from(
    { length: Math.max(start - value, 0) + 1 },
    (_, i) => start - i,
  );
  const pattern = factors.length >= 2 ? patternText(first) : undefined;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ul
        aria-label={`${spec.label}: ${factorTex(first)} nhân với số đứng sau dấu nhân từ ${signed(start)} xuống ${signed(value)}`}
        className="flex w-full max-w-xs flex-col gap-1"
      >
        {factors.map((n) => {
          const newest = n === value;
          const color = signColor(first * n);
          return (
            <li
              key={n}
              className={`flex items-center justify-between gap-2 rounded-lg border-2 px-3 py-0.5 ${
                newest ? "border-border bg-highlight" : "border-transparent"
              }`}
            >
              <Formula tex={rowTex(first, n)} className="text-body-lg" />
              <ConceptMark color={color} className="size-5" />
            </li>
          );
        })}
      </ul>
      <fieldset
        className="flex flex-col items-center gap-1"
        {...stateStepper(KEY, value)}
      >
        <legend className="mx-auto text-caption text-muted-foreground">
          Số đứng sau dấu nhân
        </legend>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={BUTTON}
            aria-label="Giảm số đứng sau dấu nhân 1 đơn vị"
            {...stateStep(KEY, "down")}
            disabled={locked || value <= min}
            onClick={() => move(Math.max(value - 1, min))}
          >
            <ChevronDown aria-hidden className="size-6" />
            <span aria-hidden>{`${MINUS}1`}</span>
          </button>
          <output
            aria-live="polite"
            className={`min-w-14 text-center font-heading text-title font-bold tabular-nums ${CONCEPT_CLASSES.blue.text}`}
          >
            {signed(value)}
          </output>
          <button
            type="button"
            className={BUTTON}
            aria-label="Tăng số đứng sau dấu nhân 1 đơn vị"
            {...stateStep(KEY, "up")}
            disabled={locked || value >= start}
            onClick={() => move(Math.min(value + 1, start))}
          >
            <ChevronUp aria-hidden className="size-6" />
            <span aria-hidden>+1</span>
          </button>
        </div>
      </fieldset>
      {pattern && (
        <p
          className="text-center text-caption text-muted-foreground"
          aria-live="polite"
        >
          {pattern}
        </p>
      )}
      {met && !shown && <DoneLine>{done ?? "Xong rồi!"}</DoneLine>}
      {met && shown && (
        <ShownLine>{done ?? "Bảng đã tới đúng hàng."}</ShownLine>
      )}
    </div>
  );
}
