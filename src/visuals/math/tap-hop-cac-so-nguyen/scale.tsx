"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Layer } from "@/visuals/shared/number-line";
import { signed } from "@/visuals/shared/number-line-geometry";
import { StepPlayer } from "@/visuals/shared/step-player";

// A vertical scale with zero in the middle, for the everyday things a negative
// number measures: a thermometer, the floors of a building and the height
// above the sea. Numbers above zero are positive, below zero negative. Marks
// and bands come one per step, or all at once in a still picture.

export type ScaleTheme = "thermometer" | "building" | "sea";

// A thing standing at a tick, with the words next to it.
export type ScaleMark = {
  at: number;
  text: string;
  color: ConceptColor;
  step?: number;
};

// A tag at the far end of the scale ("above zero" at the top, "below zero" at
// the bottom).
export type ScaleZone = {
  side: "up" | "down";
  tag: string;
  color: ConceptColor;
  step?: number;
};

export type ScaleSpec = {
  theme: ScaleTheme;
  label: string;
  // Lowest and highest tick.
  from: number;
  to: number;
  // What zero is called here ("0 °C", "mặt đất", "mực nước biển").
  zero: string;
  // Thermometer only: where the column ends (0 when absent).
  level?: number;
  marks: readonly ScaleMark[];
  zones?: readonly ScaleZone[];
  mode: "steps" | "still" | "hint";
};

const VIEW_WIDTH = 320;
const TEXT_SIZE = 17;
// A tick's number needs about 1.6 times its font size in height.
const GAP = 28;
const TOP = 22;
// Room under the lowest tick: the thermometer has its bulb there.
const BOTTOM = 46;
const BOTTOM_PLAIN = 22;
const AXIS_X = 76;
const NUMBER_X = 62;
const ART_LEFT = 94;
const ART_RIGHT = 178;
const ART_MIDDLE = (ART_LEFT + ART_RIGHT) / 2;
const TEXT_X = 192;
const DOT_RADIUS = 9;
const TEXT = "font-heading font-bold";
const BAND_OPACITY = 0.22;

const stepOf = (item: { step?: number }): number => item.step ?? 0;

function lastStep(spec: ScaleSpec): number {
  return Math.max(
    0,
    ...spec.marks.map(stepOf),
    ...(spec.zones ?? []).map(stepOf),
  );
}

// Height in the drawing of tick `value`, the highest tick at the top.
export function scaleY(spec: Pick<ScaleSpec, "from" | "to">, value: number) {
  return TOP + (spec.to - value) * GAP;
}

export function scaleHeight(
  spec: Pick<ScaleSpec, "from" | "to" | "theme">,
): number {
  return (
    scaleY(spec, spec.from) +
    (spec.theme === "thermometer" ? BOTTOM : BOTTOM_PLAIN)
  );
}

function Art({ spec }: { spec: ScaleSpec }) {
  const { theme, from, to } = spec;
  const top = scaleY(spec, to);
  const zero = scaleY(spec, 0);
  const bottom = scaleY(spec, from);
  if (theme === "thermometer") {
    const level = spec.level ?? 0;
    const column =
      level < 0
        ? "fill-concept-pink"
        : level > 0
          ? "fill-concept-lime"
          : "fill-concept-slate";
    return (
      <g {...decorative}>
        <rect
          x={ART_MIDDLE - 14}
          y={top - 10}
          width={28}
          height={bottom - top + 36}
          rx={14}
          className="fill-surface stroke-foreground"
          strokeWidth={2.5}
        />
        <circle cx={ART_MIDDLE} cy={bottom + 18} r={13} className={column} />
        <rect
          x={ART_MIDDLE - 5}
          y={scaleY(spec, level)}
          width={10}
          height={bottom + 18 - scaleY(spec, level)}
          className={column}
        />
      </g>
    );
  }
  if (theme === "building") {
    const floors = Array.from({ length: to - from + 1 }, (_, i) => to - i);
    return (
      <g {...decorative}>
        <rect
          x={ART_LEFT}
          y={zero}
          width={ART_RIGHT - ART_LEFT}
          height={bottom - zero + 8}
          className="fill-concept-pink"
          opacity={BAND_OPACITY}
        />
        <rect
          x={ART_LEFT}
          y={top}
          width={ART_RIGHT - ART_LEFT}
          height={zero - top}
          className="fill-concept-lime"
          opacity={BAND_OPACITY}
        />
        <rect
          x={ART_LEFT}
          y={top}
          width={ART_RIGHT - ART_LEFT}
          height={bottom - top + 8}
          rx={4}
          className="fill-none stroke-foreground"
          strokeWidth={2.5}
        />
        {floors.map((value) => (
          <line
            key={value}
            x1={ART_LEFT}
            x2={ART_RIGHT}
            y1={scaleY(spec, value)}
            y2={scaleY(spec, value)}
            className="stroke-foreground"
            strokeWidth={value === 0 ? 5 : 1.5}
          />
        ))}
      </g>
    );
  }
  return (
    <g {...decorative}>
      <rect
        x={ART_LEFT}
        y={top}
        width={ART_RIGHT - ART_LEFT}
        height={zero - top}
        className="fill-concept-sky"
        opacity={0.1}
      />
      <rect
        x={ART_LEFT}
        y={zero}
        width={ART_RIGHT - ART_LEFT}
        height={bottom - zero + 8}
        className="fill-concept-sky"
        opacity={0.4}
      />
      <path
        d={`M ${ART_LEFT} ${zero} q 10.5 -9 21 0 t 21 0 t 21 0 t 21 0`}
        className="fill-none stroke-concept-sky"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
}

function Axis({ spec }: { spec: ScaleSpec }) {
  const ticks = Array.from(
    { length: spec.to - spec.from + 1 },
    (_, i) => spec.to - i,
  );
  const top = scaleY(spec, spec.to);
  const bottom = scaleY(spec, spec.from);
  return (
    <>
      <g {...decorative} className="stroke-foreground" strokeLinecap="round">
        <line
          x1={AXIS_X}
          x2={AXIS_X}
          y1={top - 12}
          y2={bottom + 12}
          strokeWidth={3}
        />
        {ticks.map((value) => (
          <line
            key={value}
            x1={AXIS_X - (value === 0 ? 11 : 6)}
            x2={AXIS_X + (value === 0 ? 11 : 6)}
            y1={scaleY(spec, value)}
            y2={scaleY(spec, value)}
            strokeWidth={value === 0 ? 3 : 2}
          />
        ))}
      </g>
      {ticks.map((value) => (
        <text
          key={value}
          x={NUMBER_X - 10}
          y={scaleY(spec, value)}
          textAnchor="end"
          dominantBaseline="central"
          fontSize={TEXT_SIZE}
          stroke="none"
          className={`${TEXT} ${value === 0 ? "fill-foreground" : "fill-muted-foreground"}`}
        >
          {signed(value)}
        </text>
      ))}
      <text
        x={TEXT_X}
        y={scaleY(spec, 0)}
        dominantBaseline="central"
        fontSize={TEXT_SIZE}
        stroke="none"
        className={`${TEXT} fill-foreground`}
      >
        {spec.zero}
      </text>
    </>
  );
}

function Frame({ spec, step }: { spec: ScaleSpec; step: number }) {
  const last = lastStep(spec);
  const hint = spec.mode === "hint";
  const visible = (item: { step?: number }) =>
    spec.mode === "still" ||
    (stepOf(item) <= step && !(hint && stepOf(item) === last));
  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${scaleHeight(spec)}`}
      role="img"
      aria-label={spec.label}
      className="h-auto w-full max-w-[19rem]"
    >
      <Art spec={spec} />
      <Axis spec={spec} />
      {(spec.zones ?? []).map((zone) => {
        const y =
          zone.side === "up" ? scaleY(spec, spec.to) : scaleY(spec, spec.from);
        return (
          <Layer key={`${zone.side}-${zone.tag}`} shown={visible(zone)}>
            <ConceptShape color={zone.color} cx={TEXT_X + 6} cy={y} r={6} />
            <text
              x={TEXT_X + 18}
              y={y}
              dominantBaseline="central"
              fontSize={TEXT_SIZE}
              stroke="none"
              className={`${TEXT} fill-foreground`}
            >
              {zone.tag}
            </text>
          </Layer>
        );
      })}
      {spec.marks.map((mark) => {
        const y = scaleY(spec, mark.at);
        return (
          <Layer key={`${mark.at}-${mark.text}`} shown={visible(mark)}>
            <ConceptShape
              color={mark.color}
              cx={ART_MIDDLE}
              cy={y}
              r={DOT_RADIUS}
              className="stroke-surface"
              strokeWidth={2}
            />
            <text
              x={TEXT_X}
              y={y}
              dominantBaseline="central"
              fontSize={TEXT_SIZE}
              stroke="none"
              className={`${TEXT} ${CONCEPT_CLASSES[mark.color].fill}`}
            >
              {mark.text}
            </text>
          </Layer>
        );
      })}
    </svg>
  );
}

// A picture of a vertical scale: still, or stepped through its marks.
export function Scale({ spec }: { spec: ScaleSpec }) {
  if (spec.mode === "still") {
    return (
      <figure aria-label={spec.label} className="flex w-full justify-center">
        <Frame spec={spec} step={lastStep(spec)} />
      </figure>
    );
  }
  const last = lastStep(spec);
  const steps = spec.mode === "hint" ? last : last + 1;
  return (
    <StepPlayer steps={Math.max(steps, 1)} label={spec.label}>
      {(step) => <Frame spec={spec} step={step} />}
    </StepPlayer>
  );
}
