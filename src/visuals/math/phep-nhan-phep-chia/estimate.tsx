"use client";

import { Fragment } from "react";
import { formatInteger } from "@/lib/number-format";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { Mode } from "./catalog";
import { Legend } from "./col-mul-figure";
import {
  assignLanes,
  type Bounds,
  boundsOf,
  type EstimateNumbers,
  inZone,
  planAxis,
} from "./estimate-model";

// Steps of the picture, in order. A hint stops after the high bound, with both
// bounds still "?"; the options step exists only when options are given.
const STEP_ROUND = 0;
const STEP_LOW = 1;
const STEP_HIGH = 2;
const STEP_ZONE = 3;
const STEP_OPTIONS = 4;

const WIDTH = 340;
const LEFT = 24;
const RIGHT = WIDTH - 24;
const FACTOR_AXIS_Y = 64;
const FACTOR_LOW_X = 70;
const FACTOR_HIGH_X = 270;
const PRODUCT_AXIS_Y = 220;
const HEIGHT = 302;
const SLOT_WIDTH = 64;
const LANE_GAP = 84;
const NUMBER_SIZE = 22;
const CAPTION_SIZE = 17;
const TICK_HALF = 14;
const ZONE_HALF = 13;
// Widest a digit of the numbers drawn reaches, per unit of font size.
const DIGIT_EM = 0.62;

const NUMBER = "font-bold tabular-nums";
const SENTENCE =
  "min-h-[3.4rem] max-w-prose text-center text-body md:text-body-lg";

type Props = EstimateNumbers & { mode: Mode };

function numberWidth(text: string) {
  return text.length * NUMBER_SIZE * DIGIT_EM;
}

function Label({
  x,
  y,
  children,
  size = NUMBER_SIZE,
  className = "fill-foreground",
  number = true,
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
  className?: string;
  number?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      className={`${number ? NUMBER : ""} ${className}`}
    >
      {children}
    </text>
  );
}

function Glow({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <rect
      {...decorative}
      x={x - width / 2}
      y={y - 15}
      width={width}
      height={30}
      rx={8}
      className="fill-highlight"
    />
  );
}

// "Làm tròn" on its own line: a in blue between the two numbers it is
// rounded to.
function FactorAxis({ numbers }: { numbers: EstimateNumbers }) {
  const { a, lowA, highA } = numbers;
  const x =
    FACTOR_LOW_X +
    ((a - lowA) / (highA - lowA)) * (FACTOR_HIGH_X - FACTOR_LOW_X);
  return (
    <g>
      <line
        x1={LEFT}
        x2={RIGHT}
        y1={FACTOR_AXIS_Y}
        y2={FACTOR_AXIS_Y}
        strokeWidth={3}
        strokeLinecap="round"
        className="stroke-muted-foreground"
      />
      {[
        { at: FACTOR_LOW_X, value: lowA, caption: "làm tròn xuống" },
        { at: FACTOR_HIGH_X, value: highA, caption: "làm tròn lên" },
      ].map(({ at, value, caption }) => (
        <Fragment key={caption}>
          <line
            x1={at}
            x2={at}
            y1={FACTOR_AXIS_Y - TICK_HALF}
            y2={FACTOR_AXIS_Y + TICK_HALF}
            strokeWidth={3}
            className="stroke-foreground"
          />
          <Label x={at} y={FACTOR_AXIS_Y + 38}>
            {formatInteger(value)}
          </Label>
          <Label
            x={at}
            y={FACTOR_AXIS_Y + 64}
            size={CAPTION_SIZE}
            className="fill-muted-foreground"
            number={false}
          >
            {caption}
          </Label>
        </Fragment>
      ))}
      <ConceptShape color="blue" cx={x} cy={FACTOR_AXIS_Y} r={11} />
      <Label x={x} y={FACTOR_AXIS_Y - 32} className="fill-concept-blue">
        {formatInteger(a)}
      </Label>
    </g>
  );
}

function BoundTick({
  x,
  value,
  expression,
  step,
  from,
  hidden,
}: {
  x: number;
  value: number;
  expression: string;
  // Current step of the picture and the step this bound appears in.
  step: number;
  from: number;
  hidden: boolean;
}) {
  const shown = step >= from && !hidden;
  const dim = !shown;
  return (
    <>
      {step === from && !hidden && (
        <Glow
          x={x}
          y={PRODUCT_AXIS_Y + 36}
          width={numberWidth(formatInteger(value)) + 16}
        />
      )}
      <line
        x1={x}
        x2={x}
        y1={PRODUCT_AXIS_Y - TICK_HALF}
        y2={PRODUCT_AXIS_Y + TICK_HALF}
        strokeWidth={3}
        className={`stroke-foreground ${step >= from ? "" : "opacity-35"}`}
      />
      <Label
        x={x}
        y={PRODUCT_AXIS_Y + 36}
        className={`fill-foreground ${dim ? "opacity-35" : ""}`}
      >
        {shown ? formatInteger(value) : "?"}
      </Label>
      <Label
        x={x}
        y={PRODUCT_AXIS_Y + 62}
        size={CAPTION_SIZE}
        number={false}
        className={`fill-muted-foreground ${step >= from ? "" : "opacity-35"}`}
      >
        {expression}
      </Label>
    </>
  );
}

// The marks of one option on the line: the ones inside the zone get a check in
// the "right" green, the others an orange cross and a line through the number.
function OptionMark({
  x,
  value,
  lane,
  inside,
}: {
  x: number;
  value: number;
  lane: number;
  inside: boolean;
}) {
  const text = formatInteger(value);
  const y = PRODUCT_AXIS_Y - 32 - lane * 28;
  const half = numberWidth(text) / 2;
  const tone = inside ? "stroke-correct" : "stroke-retry";
  return (
    <>
      <Label x={x} y={y} className={inside ? "fill-correct" : "fill-retry"}>
        {text}
      </Label>
      {!inside && (
        <line
          x1={x - half - 2}
          x2={x + half + 2}
          y1={y}
          y2={y}
          strokeWidth={3}
          strokeLinecap="round"
          className="stroke-retry"
        />
      )}
      <line
        x1={x}
        x2={x}
        y1={y + 14}
        y2={PRODUCT_AXIS_Y - ZONE_HALF - 3}
        strokeWidth={2}
        strokeDasharray="3 3"
        className={tone}
      />
      {inside ? (
        <path
          d={`M ${x - 7} ${PRODUCT_AXIS_Y} l 5 6 l 10 -12`}
          fill="none"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={tone}
        />
      ) : (
        <path
          d={`M ${x - 6} ${PRODUCT_AXIS_Y - 6} l 12 12 m 0 -12 l -12 12`}
          fill="none"
          strokeWidth={3.5}
          strokeLinecap="round"
          className={tone}
        />
      )}
    </>
  );
}

function BreakMark({ x }: { x: number }) {
  return (
    <path
      d={`M ${x - 4} ${PRODUCT_AXIS_Y + 9} l 5 -18 M ${x + 2} ${PRODUCT_AXIS_Y + 9} l 5 -18`}
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="stroke-foreground"
    />
  );
}

function Picture({
  numbers,
  step,
  hint,
  label,
}: {
  numbers: EstimateNumbers;
  step: number;
  hint: boolean;
  label: string;
}) {
  const bounds = boundsOf(numbers);
  const options = numbers.options ?? [];
  const axis = planAxis(bounds, options, LEFT, RIGHT, SLOT_WIDTH);
  const xLow = axis.toX(bounds.low);
  const xHigh = axis.toX(bounds.high);
  const zoneShown = step >= STEP_ZONE && !hint;
  const optionsShown = step >= STEP_OPTIONS && options.length > 0;
  // The true product gets its own mark only when no options give the answer.
  const productX = axis.toX(bounds.product);
  const placed = [
    ...options
      .filter((v) => axis.far.every((f) => f.value !== v))
      .map((value) => ({ value, x: axis.toX(value) })),
    ...axis.far,
  ];
  const lanes = assignLanes(
    placed.map((p) => p.x),
    LANE_GAP,
  );

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full max-w-[22rem]"
    >
      <FactorAxis numbers={numbers} />
      <line
        x1={LEFT}
        x2={RIGHT}
        y1={PRODUCT_AXIS_Y}
        y2={PRODUCT_AXIS_Y}
        strokeWidth={3}
        strokeLinecap="round"
        className="stroke-muted-foreground"
      />
      {optionsShown && axis.breaks.map((x) => <BreakMark key={x} x={x} />)}
      <rect
        {...decorative}
        x={xLow}
        y={PRODUCT_AXIS_Y - ZONE_HALF}
        width={xHigh - xLow}
        height={ZONE_HALF * 2}
        rx={6}
        className={`fill-concept-amber/20 stroke-concept-amber motion-safe:transition-opacity ${zoneShown ? "opacity-100" : "opacity-0"}`}
        strokeWidth={2}
      />
      <BoundTick
        x={xLow}
        value={bounds.low}
        expression={`${numbers.lowA} · ${numbers.b}`}
        step={step}
        from={STEP_LOW}
        hidden={hint}
      />
      <BoundTick
        x={xHigh}
        value={bounds.high}
        expression={`${numbers.highA} · ${numbers.b}`}
        step={step}
        from={STEP_HIGH}
        hidden={hint}
      />
      {zoneShown && options.length === 0 && (
        <>
          <ConceptShape
            color="amber"
            cx={productX}
            cy={PRODUCT_AXIS_Y}
            r={11}
          />
          <Label
            x={productX}
            y={PRODUCT_AXIS_Y - 34}
            className="fill-concept-amber"
          >
            {formatInteger(bounds.product)}
          </Label>
        </>
      )}
      {optionsShown &&
        placed.map((p, i) => (
          <OptionMark
            key={p.value}
            x={p.x}
            value={p.value}
            lane={lanes[i] ?? 0}
            inside={inZone(p.value, bounds)}
          />
        ))}
    </svg>
  );
}

function sentence(
  numbers: EstimateNumbers,
  bounds: Bounds,
  step: number,
  hint: boolean,
): string {
  const { a, b, lowA, highA, options = [] } = numbers;
  const result = (value: number) => (hint ? "?" : formatInteger(value));
  switch (step) {
    case STEP_ROUND:
      return `${a} nằm giữa ${lowA} và ${highA}. Làm tròn xuống: ${lowA}. Làm tròn lên: ${highA}.`;
    case STEP_LOW:
      return `Làm tròn xuống: ${lowA} · ${b} = ${result(bounds.low)}`;
    case STEP_HIGH:
      return `Làm tròn lên: ${highA} · ${b} = ${result(bounds.high)}`;
    case STEP_ZONE:
      return `Tích ${a} · ${b} nằm giữa ${formatInteger(bounds.low)} và ${formatInteger(bounds.high)}.`;
    default: {
      const fitting = options.filter((v) => inZone(v, bounds));
      const range = `${formatInteger(bounds.low)} và ${formatInteger(bounds.high)}`;
      return fitting.length === 1
        ? `Chỉ ${formatInteger(fitting[0] as number)} nằm giữa ${range}. Các số khác bị loại.`
        : `Số nằm giữa ${range} được giữ, các số nằm ngoài bị loại.`;
    }
  }
}

function pictureLabel(
  numbers: EstimateNumbers,
  bounds: Bounds,
  complete: boolean,
) {
  const base = `Trục số ước lượng tích ${numbers.a} · ${numbers.b} từ ${numbers.lowA} · ${numbers.b} và ${numbers.highA} · ${numbers.b}`;
  return complete
    ? `${base}: tích nằm giữa ${formatInteger(bounds.low)} và ${formatInteger(bounds.high)}`
    : base;
}

const LEGEND = [
  { color: "blue", label: "Thừa số" },
  { color: "amber", label: "Tích" },
] as const;

export function Estimate({ mode, ...numbers }: Props) {
  const bounds = boundsOf(numbers);
  const hint = mode === "hint";
  const hasOptions = (numbers.options?.length ?? 0) > 0;
  const steps = hint
    ? STEP_HIGH + 1
    : hasOptions
      ? STEP_OPTIONS + 1
      : STEP_ZONE + 1;
  if (mode === "still") {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <Picture
          numbers={numbers}
          step={steps - 1}
          hint={false}
          label={pictureLabel(numbers, bounds, true)}
        />
        <Legend items={LEGEND} />
      </div>
    );
  }
  return (
    <StepPlayer
      steps={steps}
      label={`Ước lượng tích ${numbers.a} · ${numbers.b} bằng hai số tròn`}
    >
      {(step) => (
        <div className="flex w-full flex-col items-center gap-3">
          <Picture
            numbers={numbers}
            step={step}
            hint={hint}
            label={pictureLabel(numbers, bounds, !hint && step >= STEP_ZONE)}
          />
          <Legend items={LEGEND} />
          <p className={SENTENCE} aria-live="polite">
            {sentence(numbers, bounds, step, hint)}
          </p>
        </div>
      )}
    </StepPlayer>
  );
}
