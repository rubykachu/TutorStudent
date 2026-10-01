"use client";

import { motion } from "motion/react";
import { Fragment, useId, useState } from "react";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { useGuidedGoal } from "@/visuals/shared/guided-feedback";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import {
  type AreaModel,
  areaModel,
  classifySplit,
  fmt,
  MINUS,
  productSum,
  type Strip,
  TIMES,
  writtenParts,
} from "./logic-nhan";
import { Hole, MATH_LINE, Product, Tint } from "./parts-nhan";

// Geometry of the area model, in viewBox units. Each row holds `a` cells, so
// the width is the first factor; the second factor is the number of rows.
const WIDTH = 400;
const LEFT = 56;
const RIGHT = 88;
const TOP = 52;
const BOTTOM = 12;
const MAX_WIDTH = WIDTH - LEFT - RIGHT;
const MAX_HEIGHT = 170;
// The hands-on screen also holds steppers and two lines of feedback.
const TRY_HEIGHT = 130;
const LABEL_SIZE = 22;
const BRACKET_TICK = 7;
const BRACKET_INSET = 2;
const BRACKET_GAP = 12;
const LABEL_GAP = 10;

const SPLIT_STAGE = 1;
const AREA_STAGE = 2;
const SUM_STAGE = 3;

// Colours of the parts that are added; neither stands for a lesson concept,
// so each part also carries its own shape mark in the lines below.
const PART_COLORS: readonly ConceptColor[] = ["teal", "sky"];
const DROP_COLOR: ConceptColor = "slate";
const PART_FILL: Readonly<Record<ConceptColor, string>> = {
  blue: "fill-concept-blue/25",
  violet: "fill-concept-violet/25",
  pink: "fill-concept-pink/25",
  amber: "fill-concept-amber/25",
  teal: "fill-concept-teal/25",
  sky: "fill-concept-sky/25",
  lime: "fill-concept-lime/25",
  slate: "fill-concept-slate/25",
};

function stripColor(strips: readonly Strip[], strip: Strip): ConceptColor {
  if (strip.kind === "drop") return DROP_COLOR;
  const keep = strips.filter((s) => s.kind === "keep");
  return PART_COLORS[keep.indexOf(strip) % PART_COLORS.length] ?? "teal";
}

// Colour of the i-th written part, matching the strip it becomes.
function partColor(parts: readonly number[], i: number): ConceptColor {
  if ((parts[i] ?? 0) < 0) return DROP_COLOR;
  const before = parts.slice(0, i).filter((p) => p > 0).length;
  return PART_COLORS[before % PART_COLORS.length] ?? "teal";
}

// Bracket over a stretch of the top edge; its ticks point at the rectangle.
function Bracket({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const a = x1 + BRACKET_INSET;
  const b = x2 - BRACKET_INSET;
  return (
    <path
      {...decorative}
      d={`M ${a} ${y + BRACKET_TICK} V ${y} H ${b} V ${y + BRACKET_TICK}`}
      className="fill-none stroke-muted-foreground"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}

// Bracket beside a stretch of rows. `side` is -1 on the left edge and 1 on the
// right edge; its ticks point at the rectangle.
function RowBracket({
  y1,
  y2,
  x,
  side,
}: {
  y1: number;
  y2: number;
  x: number;
  side: -1 | 1;
}) {
  const tick = -side * BRACKET_TICK;
  return (
    <path
      {...decorative}
      d={`M ${x + tick} ${y1 + BRACKET_INSET} H ${x} V ${y2 - BRACKET_INSET} H ${x + tick}`}
      className="fill-none stroke-muted-foreground"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}

// Rectangle of rows with `a` cells each, the rows cut into parts. Stage 0
// shows the whole rectangle; from stage 1 the parts are tinted and named. A
// part that is taken away is hatched and named on the right.
function AreaFigure({
  a,
  model,
  stage,
  label,
  maxHeight = MAX_HEIGHT,
}: {
  a: number;
  model: AreaModel;
  stage: number;
  label: string;
  maxHeight?: number;
}) {
  const patternId = useId().replace(/:/g, "");
  const transition = useVisualTransition();
  const { strips, rows } = model;
  const unit = Math.min(MAX_WIDTH / a, maxHeight / rows);
  const width = a * unit;
  const height = rows * unit;
  const x0 = LEFT + (MAX_WIDTH - width) / 2;
  const y0 = TOP;
  const split = stage >= SPLIT_STAGE;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${y0 + height + BOTTOM}`}
      className="h-auto w-full max-w-72"
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(45)"
        >
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={8}
            className="stroke-muted-foreground"
            strokeWidth={2}
          />
        </pattern>
      </defs>
      <rect
        {...decorative}
        x={x0}
        y={y0}
        width={width}
        height={height}
        rx={4}
        className="fill-muted stroke-border"
        strokeWidth={2}
      />
      <motion.g
        {...decorative}
        initial={false}
        animate={{ opacity: split ? 1 : 0 }}
        transition={transition}
      >
        {strips.map((strip) => {
          const color = stripColor(strips, strip);
          return (
            <rect
              {...decorative}
              key={`${strip.kind}-${strip.start}`}
              x={x0}
              y={y0 + strip.start * unit}
              width={width}
              height={strip.width * unit}
              fill={strip.kind === "drop" ? `url(#${patternId})` : undefined}
              strokeDasharray={strip.kind === "drop" ? "6 4" : undefined}
              className={
                strip.kind === "drop"
                  ? `${CONCEPT_CLASSES[color].stroke} fill-surface/60`
                  : `${PART_FILL[color]} ${CONCEPT_CLASSES[color].stroke}`
              }
              strokeWidth={2}
            />
          );
        })}
      </motion.g>
      <g {...decorative}>
        {Array.from({ length: a - 1 }, (_, i) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: grid lines are fixed by position
            key={`v${i}`}
            x1={x0 + (i + 1) * unit}
            x2={x0 + (i + 1) * unit}
            y1={y0}
            y2={y0 + height}
            className="stroke-surface"
            strokeWidth={1}
            opacity={0.8}
          />
        ))}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: grid lines are fixed by position
            key={`h${i}`}
            x1={x0}
            x2={x0 + width}
            y1={y0 + (i + 1) * unit}
            y2={y0 + (i + 1) * unit}
            className="stroke-surface"
            strokeWidth={1}
            opacity={0.8}
          />
        ))}
      </g>
      {/* Cells in a row: the factor a. */}
      <Bracket x1={x0} x2={x0 + width} y={y0 - BRACKET_GAP} />
      <text
        x={x0 + width / 2}
        y={y0 - BRACKET_GAP - 12}
        textAnchor="middle"
        fontSize={LABEL_SIZE}
        className={`${CONCEPT_CLASSES.blue.fill} font-heading font-bold`}
      >
        {a}
      </text>
      {/* Stage 0 names all the rows, later stages name each part. */}
      <motion.g
        initial={false}
        animate={{ opacity: split ? 0 : 1 }}
        transition={transition}
      >
        <RowBracket x={x0 - BRACKET_GAP} y1={y0} y2={y0 + height} side={-1} />
        <text
          x={x0 - BRACKET_GAP - LABEL_GAP}
          y={y0 + height / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontSize={LABEL_SIZE}
          className="fill-foreground font-heading font-bold"
        >
          {rows}
        </text>
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: split ? 1 : 0 }}
        transition={transition}
      >
        {strips.map((strip) => {
          const color = stripColor(strips, strip);
          const drop = strip.kind === "drop";
          const from = y0 + strip.start * unit;
          const to = from + (drop ? strip.width : strip.written) * unit;
          const x = drop ? x0 + width + BRACKET_GAP : x0 - BRACKET_GAP;
          return (
            <Fragment key={`${strip.kind}-${strip.start}`}>
              <RowBracket x={x} y1={from} y2={to} side={drop ? 1 : -1} />
              <text
                x={drop ? x + LABEL_GAP : x - LABEL_GAP}
                y={(from + to) / 2}
                textAnchor={drop ? "start" : "end"}
                dominantBaseline="central"
                fontSize={LABEL_SIZE}
                className={`${CONCEPT_CLASSES[color].fill} font-heading font-bold`}
              >
                {drop ? `bớt ${strip.written}` : strip.written}
              </text>
            </Fragment>
          );
        })}
      </motion.g>
    </svg>
  );
}

function AreaLine({
  a,
  strip,
  color,
}: {
  a: number;
  strip: Strip;
  color: ConceptColor;
}) {
  return (
    <p className="flex items-center justify-center gap-2 font-heading text-block font-bold md:text-block-lg">
      <ConceptMark color={color} className="size-4" />
      <Tint color={color}>
        {`${a} ${TIMES} ${fmt(strip.written)} = ${fmt(strip.product)}`}
        {strip.kind === "drop" ? " (bớt đi)" : ""}
      </Tint>
    </p>
  );
}

// "30 + 6 = 36": the products joined by their signs; a hint stops at "?".
function SumLine({ model, hidden }: { model: AreaModel; hidden: boolean }) {
  return (
    <p className="flex items-center justify-center gap-2 font-heading text-block font-bold md:text-block-lg">
      <ConceptMark color="amber" className="size-4" />
      <span>
        {`${productSum(model.strips)} = `}
        {hidden ? <Hole /> : <Tint color="amber">{fmt(model.total)}</Tint>}
      </span>
    </p>
  );
}

// "3 · (10 + 2)" with each part in its colour once the parts are shown.
function WrittenExpression({
  a,
  parts,
  coloured,
}: {
  a: number;
  parts: readonly number[];
  coloured: boolean;
}) {
  return (
    <p className={MATH_LINE}>
      <Product factors={[a]} />
      <span className="whitespace-nowrap">
        {` ${TIMES} (`}
        {coloured
          ? parts.map((p, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
              <Fragment key={i}>
                {i > 0 && ` ${p < 0 ? MINUS : "+"} `}
                <Tint color={partColor(parts, i)}>{fmt(Math.abs(p))}</Tint>
              </Fragment>
            ))
          : writtenParts(parts)}
        {")"}
      </span>
    </p>
  );
}

function describeArea(a: number, parts: readonly number[]): string {
  return `Hình chữ nhật mỗi hàng ${a} ô, số hàng tách thành ${writtenParts(parts)}`;
}

function SplitAreaView({
  spec,
  stage,
}: {
  spec: SpecOf<"splitArea">;
  stage: number;
}) {
  const { a, parts, mode } = spec;
  const model = areaModel(a, parts);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <WrittenExpression a={a} parts={parts} coloured={stage >= SPLIT_STAGE} />
      <AreaFigure
        a={a}
        model={model}
        stage={stage}
        label={describeArea(a, parts)}
      />
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap justify-center gap-x-6">
          {model.strips.map((strip) => (
            <Reveal
              key={`${strip.kind}-${strip.start}`}
              shown={stage >= AREA_STAGE}
              placeholder={
                <p className="text-center font-heading text-block font-bold text-muted-foreground">
                  {`${a} ${TIMES} ${fmt(strip.written)} = ?`}
                </p>
              }
            >
              <AreaLine
                a={a}
                strip={strip}
                color={stripColor(model.strips, strip)}
              />
            </Reveal>
          ))}
        </div>
        <Reveal
          shown={stage >= SUM_STAGE}
          placeholder={
            <p className="text-center font-heading text-block font-bold text-muted-foreground">
              = ?
            </p>
          }
        >
          <SumLine model={model} hidden={mode === "hint"} />
        </Reveal>
      </div>
    </div>
  );
}

export function SplitArea({ spec }: { spec: SpecOf<"splitArea"> }) {
  const label = describeArea(spec.a, spec.parts);
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <SplitAreaView spec={spec} stage={SUM_STAGE} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={SUM_STAGE + 1} label={label}>
      {(stage) => <SplitAreaView spec={spec} stage={stage} />}
    </StepPlayer>
  );
}

// --- Hands-on: split the second factor any way you like ----------------------

function SecondNumber({ value }: { value: number }) {
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
        <ConceptMark color="sky" className="size-4" />
        Số thứ hai
      </legend>
      <output
        aria-live="polite"
        className="flex h-touch min-w-16 items-center justify-center font-heading text-title font-bold tabular-nums text-concept-sky"
      >
        {value}
      </output>
    </fieldset>
  );
}

// The child cuts b into two numbers with a stepper and watches a · b split
// into two products. Cutting b into tens and ones gives the easy one.
export function SplitTry({
  spec,
  onStateChange,
}: { spec: SpecOf<"splitTry"> } & Pick<VisualProps, "onStateChange">) {
  const { a, b } = spec;
  const [first, setFirst] = useState(Math.floor(b / 2));
  const [tried, setTried] = useState<ReadonlySet<number>>(new Set());
  const [reached, setReached] = useState(false);
  const second = b - first;
  const kind = classifySplit(b, first);
  const tens = Math.floor(b / 10) * 10;
  const ones = b - tens;
  const parts = [first, second].filter((p) => p > 0);
  const model = areaModel(a, parts);
  // "Tiếp" waits until b has been cut into tens and ones (once is enough), or
  // "Xem cách làm" makes that cut.
  useGuidedGoal({ met: reached, guided: true, reveal: () => change(tens) });

  function change(next: number) {
    const nextTried = new Set(tried).add(next);
    const nextReached = reached || classifySplit(b, next).kind === "tensOnes";
    setFirst(next);
    setTried(nextTried);
    setReached(nextReached);
    onStateChange?.({
      first: next,
      second: b - next,
      tried: nextTried.size,
      done: nextReached ? 1 : 0,
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex items-start justify-center gap-6">
        <NumberStepper
          label="Số thứ nhất"
          value={first}
          min={0}
          max={b}
          color="teal"
          stateKey="first"
          onChange={change}
        />
        <SecondNumber value={second} />
      </div>
      <AreaFigure
        a={a}
        model={model}
        stage={SPLIT_STAGE}
        maxHeight={TRY_HEIGHT}
        label={`Hình chữ nhật mỗi hàng ${a} ô, tách ${b} hàng thành ${first} và ${second}`}
      />
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap justify-center gap-x-6">
          {model.strips.map((strip) => (
            <AreaLine
              key={`${strip.kind}-${strip.start}`}
              a={a}
              strip={strip}
              color={stripColor(model.strips, strip)}
            />
          ))}
        </div>
        <SumLine model={model} hidden={false} />
      </div>
      <p className="text-center text-caption" aria-live="polite">
        {tried.size === 0
          ? "Bấm + hoặc − để tách thử."
          : `Đã thử ${tried.size} cách tách`}
      </p>
      <p
        className={`rounded-lg px-4 py-1 text-center text-caption ${
          kind.kind === "tensOnes"
            ? "bg-correct-soft font-semibold text-correct-soft-foreground"
            : "bg-muted"
        }`}
        aria-live="polite"
      >
        {kind.kind === "tensOnes"
          ? `Tách ${b} = ${tens} + ${ones}: ${a} ${TIMES} ${tens} = ${fmt(a * tens)}, ${a} ${TIMES} ${ones} = ${fmt(a * ones)}, tổng ${fmt(a * b)}`
          : `Nhân với ${kind.hardFactor} khó hơn nhân với 10. Thử tách ${b} thành chục và đơn vị.`}
      </p>
    </div>
  );
}
