"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, useId, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { stateSet } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  EQUATION_LINE,
  NamedMark,
  NumberChip,
  RoundBadge,
  roundLabel,
} from "./arrange-parts";
import { formatNumber, type StepsMode } from "./types";

// Steps of the animated regrouping: the addends in their own order, the
// bracketed ones slid together, each bracket's sum, the total.
const ARRANGE_STEP = 1;
const SUM_STEP = 2;
const TOTAL_STEP = 3;
const STEP_COUNT = TOTAL_STEP + 1;
// From this many addends on the chips shrink so a row still fits a phone.
const DENSE_FROM = 4;

type Segment =
  | { kind: "single"; index: number }
  | { kind: "group"; indices: readonly number[]; id: number };

function originalSegments(count: number): Segment[] {
  return Array.from({ length: count }, (_, index) => ({
    kind: "single" as const,
    index,
  }));
}

// Ungrouped numbers in their own order first, then each bracketed group.
function arrangedSegments(
  count: number,
  groups: readonly (readonly number[])[],
): Segment[] {
  const grouped = new Set(groups.flat());
  return [
    ...originalSegments(count).filter(
      (s) => s.kind === "single" && !grouped.has(s.index),
    ),
    ...groups.map((indices, id) => ({ kind: "group" as const, indices, id })),
  ];
}

function Plus() {
  return (
    <span
      aria-hidden
      className="font-heading text-block font-bold text-muted-foreground"
    >
      +
    </span>
  );
}

function sumOf(numbers: readonly number[], indices: readonly number[]) {
  return indices.reduce((total, i) => total + (numbers[i] ?? 0), 0);
}

function describe(
  numbers: readonly number[],
  groups: readonly (readonly number[])[],
) {
  const sum = numbers.map(formatNumber).join(" + ");
  const brackets = groups
    .map((g) => `(${g.map((i) => formatNumber(numbers[i] ?? 0)).join(" + ")})`)
    .join(", ");
  return `Cộng ${sum}, ghép ${brackets}`;
}

type ChipRowProps = {
  numbers: readonly number[];
  groups: readonly (readonly number[])[];
  arranged: boolean;
  summed: boolean;
  // Chips carrying this prefix slide to their new place when `arranged`
  // flips; left out, the row is a plain still.
  scope?: string;
};

// The addends as blue chips with "+" between; once arranged the bracketed
// ones sit together in a lime bracket, and once summed a bracket holds its
// sum in amber.
function ChipRow({ numbers, groups, arranged, summed, scope }: ChipRowProps) {
  const transition = useVisualTransition();
  // With reduced motion nothing slides: the DOM is final as soon as it renders.
  const reducedMotion = usePrefersReducedMotion();
  const plain = scope === undefined || reducedMotion;
  const dense = numbers.length >= DENSE_FROM;
  const segments = arranged
    ? arrangedSegments(numbers.length, groups)
    : originalSegments(numbers.length);

  function chip(index: number) {
    return (
      <motion.span
        key={index}
        layout={!plain}
        layoutId={plain ? undefined : `${scope}-${index}`}
        transition={transition}
        className="inline-flex"
      >
        <NumberChip color="blue" dense={dense}>
          {formatNumber(numbers[index] ?? 0)}
        </NumberChip>
      </motion.span>
    );
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-4">
      {segments.map((segment, position) => (
        <Fragment
          key={segment.kind === "single" ? segment.index : `g${segment.id}`}
        >
          {position > 0 && <Plus />}
          {segment.kind === "single" ? (
            chip(segment.index)
          ) : (
            <motion.span
              initial={plain ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition}
              className={`relative inline-flex items-center gap-1.5 rounded-2xl border-2 px-2 pt-4 pb-1.5 ${CONCEPT_CLASSES.lime.border}`}
            >
              <ConceptMark
                color="lime"
                className="absolute -top-3 -left-2 size-5 rounded-full bg-background"
              />
              {summed ? (
                <motion.span
                  initial={plain ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition}
                  className="inline-flex"
                >
                  <NumberChip color="amber" dense={dense}>
                    {formatNumber(sumOf(numbers, segment.indices))}
                  </NumberChip>
                </motion.span>
              ) : (
                segment.indices.map((index, i) => (
                  <Fragment key={index}>
                    {i > 0 && <Plus />}
                    {chip(index)}
                  </Fragment>
                ))
              )}
            </motion.span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

// "268 + 100 = 368": what is left to add once the brackets are summed. With
// `hidden` the total shows as "?".
function TotalLine({
  numbers,
  groups,
  hidden,
}: {
  numbers: readonly number[];
  groups: readonly (readonly number[])[];
  hidden: boolean;
}) {
  const grouped = new Set(groups.flat());
  // Every term is an addend here, group sums included, so all are blue; only
  // the total after "=" is amber.
  const terms = [
    ...numbers.filter((_, i) => !grouped.has(i)),
    ...groups.map((g) => sumOf(numbers, g)),
  ];
  const total = numbers.reduce((a, b) => a + b, 0);
  return (
    <p className={EQUATION_LINE}>
      {terms.map((term, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: terms never reorder
        <Fragment key={i}>
          {i > 0 && <span>+</span>}
          <span className={CONCEPT_CLASSES.blue.text}>
            {formatNumber(term)}
          </span>
        </Fragment>
      ))}
      <span>=</span>
      <span
        className={
          hidden ? "text-muted-foreground" : CONCEPT_CLASSES.amber.text
        }
      >
        {hidden ? "?" : formatNumber(total)}
      </span>
    </p>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
      <NamedMark color="blue" name="Số hạng" />
      <NamedMark color="lime" name="Kết hợp" />
      <NamedMark color="amber" name="Tổng" />
    </div>
  );
}

type RegroupProps = {
  // Addends in their original order.
  numbers: readonly number[];
  // Indices into `numbers` that get bracketed together.
  groups: readonly (readonly number[])[];
  mode: StepsMode;
};

// Regrouping a sum by the associative and commutative properties: the addends
// first in their own order, then slid so each bracketed group sits together,
// then each group's sum, then the total. 4 steps; "hint" leaves the total as
// "?", "still" shows everything at once.
export function Regroup({ numbers, groups, mode }: RegroupProps) {
  const scope = useId();
  const label = describe(numbers, groups);

  if (mode === "still") {
    return (
      <figure
        aria-label={label}
        className="flex w-full flex-col items-center gap-3"
      >
        <ChipRow
          numbers={numbers}
          groups={groups}
          arranged={false}
          summed={false}
        />
        <ArrowDown aria-hidden className="size-5 text-muted-foreground" />
        <ChipRow numbers={numbers} groups={groups} arranged summed />
        <TotalLine numbers={numbers} groups={groups} hidden={false} />
        <Legend />
      </figure>
    );
  }

  return (
    <StepPlayer steps={STEP_COUNT} label={label}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <ChipRow
            numbers={numbers}
            groups={groups}
            arranged={step >= ARRANGE_STEP}
            summed={step >= SUM_STEP}
            scope={scope}
          />
          <Reveal
            shown={step >= TOTAL_STEP}
            placeholder={<p className={EQUATION_LINE}>= ?</p>}
          >
            <TotalLine
              numbers={numbers}
              groups={groups}
              hidden={mode === "hint"}
            />
          </Reveal>
          <Legend />
        </div>
      )}
    </StepPlayer>
  );
}

type PairTryProps = VisualProps & {
  numbers: readonly number[];
  // The sum must be a multiple of this (10 or 100).
  unit: number;
};

// The child taps two numbers whose sum is round. Each chip is a toggle that
// reports pick<i> = 0 | 1; a live line shows the pair's sum and whether it is
// round.
export function PairTry({
  numbers,
  unit,
  onStateChange,
  shownState,
  disabled = false,
}: PairTryProps) {
  const [own, setOwn] = useState<readonly number[]>(() => numbers.map(() => 0));
  const picks = numbers.map((_, i) =>
    shownState ? (shownState[`pick${i}`] ?? 0) : (own[i] ?? 0),
  );
  const locked = disabled || shownState !== undefined;
  const picked = numbers.flatMap((n, i) => (picks[i] === 1 ? [n] : []));

  function toggle(index: number) {
    const next = picks.map((v, i) => (i === index ? 1 - v : v));
    setOwn(next);
    onStateChange?.(
      Object.fromEntries(next.map((v, i) => [`pick${i}`, v] as const)),
    );
  }

  const [first, second] = picked;
  const pair =
    picked.length === 2 && first !== undefined && second !== undefined
      ? first + second
      : undefined;
  const round = pair !== undefined && pair % unit === 0;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <fieldset className="m-0 flex min-w-0 flex-wrap justify-center gap-3 border-0 p-0">
        <legend className="sr-only">Các số để chọn</legend>
        {numbers.map((n, i) => {
          const on = picks[i] === 1;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: numbers may repeat and never reorder
              key={i}
              type="button"
              aria-pressed={on}
              disabled={locked}
              onClick={() => toggle(i)}
              {...stateSet(`pick${i}`, 1)}
              className={`inline-flex min-h-touch min-w-16 items-center justify-center rounded-xl border-2 px-4 font-heading text-title font-bold tabular-nums motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-100 ${CONCEPT_CLASSES.blue.text} ${
                on
                  ? "border-foreground bg-highlight"
                  : `bg-surface ${CONCEPT_CLASSES.blue.border}`
              }`}
            >
              {formatNumber(n)}
            </button>
          );
        })}
      </fieldset>
      <div
        className="flex min-h-24 flex-col items-center justify-center gap-2"
        aria-live="polite"
      >
        {picked.length === 0 && (
          <p className="text-center text-body md:text-body-lg">
            {`Chọn hai số có tổng ${roundLabel(unit).toLocaleLowerCase("vi")}.`}
          </p>
        )}
        {picked.length === 1 && (
          <p className="text-center text-body md:text-body-lg">
            Chọn thêm một số.
          </p>
        )}
        {picked.length > 2 && (
          <p className="text-center text-body md:text-body-lg">
            Chọn đúng hai số.
          </p>
        )}
        {pair !== undefined && first !== undefined && second !== undefined && (
          <>
            <p className={EQUATION_LINE}>
              <span className={CONCEPT_CLASSES.blue.text}>
                {formatNumber(first)}
              </span>
              <span>+</span>
              <span className={CONCEPT_CLASSES.blue.text}>
                {formatNumber(second)}
              </span>
              <span>=</span>
              <span className={CONCEPT_CLASSES.amber.text}>
                {formatNumber(pair)}
              </span>
            </p>
            <RoundBadge round={round} unit={unit} />
            {round && (
              <p className="text-body font-semibold text-correct md:text-body-lg">
                Đúng rồi.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
