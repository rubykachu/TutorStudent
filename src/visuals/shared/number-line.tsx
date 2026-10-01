"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import {
  ARROW_HEAD,
  ARROW_ROW,
  AXIS_LEFT,
  AXIS_RIGHT,
  type AxisArrows,
  axisSpan,
  DOT_RADIUS,
  LABEL_DROP,
  type LinePlan,
  type LineRange,
  labelledTicks,
  NAME_RISE,
  planLine,
  signed,
  TEXT_SIZE,
  tickGap,
  tickValues,
  tickX,
  VIEW_WIDTH,
  ZONE_ROW,
} from "@/visuals/shared/number-line-geometry";
import { StepPlayer } from "@/visuals/shared/step-player";

// The integer number line drawn in an SVG as wide as its frame: an axis with
// an arrow at both ends (or only at the positive end), a tick at every integer, the numbers under the ticks
// that carry one, and the layers of a picture on top (the origin, points,
// bands for the negative and positive side, distance arrows). Layers come one
// per step in a `StepPlayer`, or all at once in a still picture.

const TEXT = "font-heading font-bold";
const PLAIN_NUMBER = `${TEXT} fill-muted-foreground`;
const TICK_HALF = 7;
const ZERO_TICK_HALF = 12;
const BAND_HALF = 15;
const BAND_OPACITY = 0.2;
const TAG_SHAPE = 16;
const CHAR_WIDTH = 9.6;
const ARROW_START_GAP = 7;

export type LineLayer =
  // The origin O: a ring on 0 with its name above.
  | { type: "origin"; step?: number }
  // A point on a tick, named above; its number is written under the tick in
  // the point's colour, or "?" when `ask`, or left out when `hideNumber`.
  | {
      type: "point";
      at: number;
      name?: string;
      color: ConceptColor;
      ask?: boolean;
      hideNumber?: boolean;
      step?: number;
    }
  // A tinted band from tick `from` to tick `to` with a tag under the numbers.
  | {
      type: "zone";
      from: number;
      to: number;
      tag: string;
      color: ConceptColor;
      step?: number;
    }
  // An arrow above the axis from tick `from` to tick `to`, with a tag.
  | {
      type: "arrow";
      from: number;
      to: number;
      tag: string;
      color?: ConceptColor;
      // A coloured arrow with its tag as plain words, without the concept's
      // marker in front (for markers that read as a sign, like the cross).
      plainTag?: boolean;
      // Row above the axis (0 is the closest), for arrows that would overlap.
      row?: number;
      step?: number;
    };

export type NumberLineSpec = LineRange & {
  label: string;
  // Ticks that carry their number; every tick when absent.
  labelAt?: readonly number[];
  layers?: readonly LineLayer[];
  // Arrowheads of the axis: both ends (default), or only the positive end.
  arrows?: AxisArrows;
  // steps: animated walk-through that ends on the full picture; still: the
  // finished picture; hint: the walk-through that stops before the last step,
  // whose layers are never drawn.
  mode: "steps" | "still" | "hint";
};

export const layerStep = (layer: LineLayer): number => layer.step ?? 0;

export function lastStep(layers: readonly LineLayer[]): number {
  return layers.reduce((most, layer) => Math.max(most, layerStep(layer)), 0);
}

// What the layers need from the layout.
export function planOf(layers: readonly LineLayer[]): LinePlan {
  const arrows = layers.filter((layer) => layer.type === "arrow");
  return planLine({
    names: layers.some(
      (layer) =>
        layer.type === "origin" || (layer.type === "point" && !!layer.name),
    ),
    arrowRows: arrows.length
      ? Math.max(...arrows.map((layer) => (layer.row ?? 0) + 1))
      : 0,
    zoneTags: layers.some((layer) => layer.type === "zone"),
  });
}

export function lineViewBox(plan: LinePlan): string {
  return `0 0 ${VIEW_WIDTH} ${plan.height}`;
}

// The text that stands under a tick instead of its plain number.
export type TickMark = { text: string; className: string };

export function numberMark(color: ConceptColor, value: number): TickMark {
  return {
    text: signed(value),
    className: `${TEXT} ${CONCEPT_CLASSES[color].fill}`,
  };
}

export const ASK_MARK: TickMark = { text: "?", className: PLAIN_NUMBER };

// The axis, its ticks and the numbers under them. `marks` replaces the number
// under a tick (and adds one under a tick without); `behind` is drawn under
// the axis, `children` over it.
export function LineAxis({
  range,
  plan,
  labelAt,
  arrows,
  marks,
  behind,
  children,
}: {
  range: LineRange;
  plan: LinePlan;
  labelAt?: readonly number[];
  arrows?: AxisArrows;
  marks?: ReadonlyMap<number, TickMark>;
  behind?: ReactNode;
  children?: ReactNode;
}) {
  const { axisY } = plan;
  const span = axisSpan(arrows);
  const numbered = new Set([
    ...labelledTicks(range, labelAt),
    ...(marks?.keys() ?? []),
  ]);
  return (
    <>
      {behind}
      <g {...decorative} className="stroke-foreground" strokeLinecap="round">
        <line x1={span.x1} y1={axisY} x2={span.x2} y2={axisY} strokeWidth={3} />
        <polygon
          points={`${AXIS_RIGHT - ARROW_HEAD * 2},${axisY - ARROW_HEAD} ${AXIS_RIGHT},${axisY} ${AXIS_RIGHT - ARROW_HEAD * 2},${axisY + ARROW_HEAD}`}
          className="fill-foreground"
          strokeWidth={1}
          strokeLinejoin="round"
        />
        {span.negativeHead && (
          <polygon
            points={`${AXIS_LEFT + ARROW_HEAD * 2},${axisY - ARROW_HEAD} ${AXIS_LEFT},${axisY} ${AXIS_LEFT + ARROW_HEAD * 2},${axisY + ARROW_HEAD}`}
            className="fill-foreground"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        )}
        {tickValues(range).map((tick) => {
          const half = tick === 0 ? ZERO_TICK_HALF : TICK_HALF;
          return (
            <line
              key={tick}
              x1={tickX(range, tick)}
              x2={tickX(range, tick)}
              y1={axisY - half}
              y2={axisY + half}
              strokeWidth={tick === 0 ? 3 : 2}
            />
          );
        })}
      </g>
      {tickValues(range)
        .filter((tick) => numbered.has(tick))
        .map((tick) => {
          const mark = marks?.get(tick);
          return (
            <text
              key={tick}
              x={tickX(range, tick)}
              y={axisY + LABEL_DROP}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={TEXT_SIZE}
              stroke="none"
              className={
                mark?.className ??
                (tick === 0 ? `${TEXT} fill-foreground` : PLAIN_NUMBER)
              }
            >
              {mark?.text ?? signed(tick)}
            </text>
          );
        })}
      {children}
    </>
  );
}

// A group that fades in when its layer comes; until then it keeps its place
// but is hidden (and out of reach of screen readers).
export function Layer({
  shown,
  backdrop = false,
  children,
}: {
  shown: boolean;
  // A band behind the axis: the overlap check skips it.
  backdrop?: boolean;
  children: ReactNode;
}) {
  const transition = useVisualTransition();
  return (
    <motion.g
      {...(backdrop ? decorative : {})}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={transition}
      className={shown ? "" : "invisible"}
    >
      {children}
    </motion.g>
  );
}

// A named dot on a tick: its name above, its marker in the concept's shape.
export function NamedDot({
  x,
  y,
  color,
  name,
  radius = DOT_RADIUS,
}: {
  x: number;
  y: number;
  color: ConceptColor;
  name?: string;
  radius?: number;
}) {
  return (
    <>
      <ConceptShape
        color={color}
        cx={x}
        cy={y}
        r={radius}
        className="stroke-surface"
        strokeWidth={2}
      />
      {name && (
        <text
          x={x}
          y={y - radius - NAME_RISE / 2 - 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={TEXT_SIZE}
          stroke="none"
          className={`${TEXT} fill-foreground`}
        >
          {name}
        </text>
      )}
    </>
  );
}

// The ring that marks the origin O, with its name above.
function OriginMark({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={DOT_RADIUS}
        className="fill-surface stroke-foreground"
        strokeWidth={3}
      />
      <text
        x={x}
        y={y - DOT_RADIUS - NAME_RISE / 2 - 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={TEXT_SIZE}
        stroke="none"
        className={`${TEXT} fill-foreground`}
      >
        O
      </text>
    </>
  );
}

// A short label with the marker of its colour in front, centred on `x` but
// kept inside the drawing.
function Tag({
  x,
  y,
  text,
  color,
}: {
  x: number;
  y: number;
  text: string;
  color: ConceptColor;
}) {
  const width = text.length * CHAR_WIDTH + TAG_SHAPE;
  const left = Math.min(
    Math.max(x - width / 2, AXIS_LEFT),
    VIEW_WIDTH - AXIS_LEFT - width,
  );
  return (
    <>
      <ConceptShape color={color} cx={left + 6} cy={y} r={6} />
      <text
        x={left + TAG_SHAPE}
        y={y}
        dominantBaseline="central"
        fontSize={TEXT_SIZE}
        stroke="none"
        className={`${TEXT} fill-foreground`}
      >
        {text}
      </text>
    </>
  );
}

function ArrowMark({
  range,
  plan,
  layer,
  names,
}: {
  range: LineRange;
  plan: LinePlan;
  layer: Extract<LineLayer, { type: "arrow" }>;
  names: boolean;
}) {
  const direction = layer.to >= layer.from ? 1 : -1;
  // The arrow starts a little after its first tick, so two arrows leaving the
  // same tick (the origin) never join into one line.
  const from = tickX(range, layer.from) + direction * ARROW_START_GAP;
  const to = tickX(range, layer.to);
  const above = names ? NAME_RISE + DOT_RADIUS + 6 : 12;
  const y = plan.axisY - above - (layer.row ?? 0) * ARROW_ROW - 8;
  const colorClass = layer.color ? CONCEPT_CLASSES[layer.color] : undefined;
  return (
    <g
      className={colorClass ? colorClass.stroke : "stroke-foreground"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line
        x1={from}
        y1={y}
        x2={to - direction * ARROW_HEAD}
        y2={y}
        strokeWidth={3}
      />
      <polygon
        points={`${to - direction * ARROW_HEAD * 1.6},${y - ARROW_HEAD * 0.8} ${to},${y} ${to - direction * ARROW_HEAD * 1.6},${y + ARROW_HEAD * 0.8}`}
        className={colorClass ? colorClass.fill : "fill-foreground"}
        strokeWidth={1}
      />
      {layer.color && !layer.plainTag ? (
        <Tag
          x={(from + to) / 2}
          y={y - 22}
          text={layer.tag}
          color={layer.color}
        />
      ) : (
        <text
          x={(from + to) / 2}
          y={y - 22}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={TEXT_SIZE}
          stroke="none"
          className={`${TEXT} fill-foreground`}
        >
          {layer.tag}
        </text>
      )}
    </g>
  );
}

// The span of a zone in the drawing: from half a tick before `from` to half a
// tick after `to`, kept inside the axis.
function zoneSpan(
  range: LineRange,
  layer: Extract<LineLayer, { type: "zone" }>,
) {
  const half = tickGap(range) / 2;
  return {
    left: Math.max(AXIS_LEFT, tickX(range, layer.from) - half),
    right: Math.min(AXIS_RIGHT, tickX(range, layer.to) + half),
  };
}

function ZoneBand({
  range,
  plan,
  layer,
}: {
  range: LineRange;
  plan: LinePlan;
  layer: Extract<LineLayer, { type: "zone" }>;
}) {
  const { left, right } = zoneSpan(range, layer);
  return (
    <rect
      x={left}
      y={plan.axisY - BAND_HALF}
      width={right - left}
      height={BAND_HALF * 2}
      rx={6}
      className={CONCEPT_CLASSES[layer.color].fill}
      opacity={BAND_OPACITY}
    />
  );
}

function ZoneTag({
  range,
  plan,
  layer,
}: {
  range: LineRange;
  plan: LinePlan;
  layer: Extract<LineLayer, { type: "zone" }>;
}) {
  const { left, right } = zoneSpan(range, layer);
  return (
    <Tag
      x={(left + right) / 2}
      y={plan.axisY + LABEL_DROP + 14 + ZONE_ROW / 2}
      text={layer.tag}
      color={layer.color}
    />
  );
}

// The numbers a point writes under its tick.
export function pointMarks(
  layers: readonly LineLayer[],
  visible: (layer: LineLayer) => boolean,
): Map<number, TickMark> {
  const marks = new Map<number, TickMark>();
  for (const layer of layers) {
    if (layer.type !== "point" || layer.hideNumber || !visible(layer)) continue;
    marks.set(
      layer.at,
      layer.ask ? ASK_MARK : numberMark(layer.color, layer.at),
    );
  }
  return marks;
}

// One frame of a picture: the layers whose step has come.
function LineFrame({ spec, step }: { spec: NumberLineSpec; step: number }) {
  const layers = spec.layers ?? [];
  const plan = planOf(layers);
  const hint = spec.mode === "hint";
  const last = lastStep(layers);
  const visible = (layer: LineLayer) =>
    spec.mode === "still" ||
    (layerStep(layer) <= step && !(hint && layerStep(layer) === last));
  const names = layers.some(
    (layer) =>
      layer.type === "origin" || (layer.type === "point" && !!layer.name),
  );
  // Numbers of points that have not come yet are not written under the line.
  const marks = pointMarks(layers, visible);
  return (
    <svg
      viewBox={lineViewBox(plan)}
      role="img"
      aria-label={spec.label}
      className="h-auto w-full max-w-md"
    >
      <LineAxis
        range={spec}
        plan={plan}
        labelAt={spec.labelAt}
        arrows={spec.arrows}
        marks={marks}
        behind={layers.map((layer, i) =>
          layer.type === "zone" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: layers never reorder
            <Layer key={i} shown={visible(layer)} backdrop>
              <ZoneBand range={spec} plan={plan} layer={layer} />
            </Layer>
          ) : null,
        )}
      >
        {layers.map((layer, i) => {
          if (layer.type === "arrow") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: layers never reorder
              <Layer key={i} shown={visible(layer)}>
                <ArrowMark
                  range={spec}
                  plan={plan}
                  layer={layer}
                  names={names}
                />
              </Layer>
            );
          }
          if (layer.type === "point") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: layers never reorder
              <Layer key={i} shown={visible(layer)}>
                <NamedDot
                  x={tickX(spec, layer.at)}
                  y={plan.axisY}
                  color={layer.color}
                  name={layer.name}
                />
              </Layer>
            );
          }
          if (layer.type === "zone") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: layers never reorder
              <Layer key={i} shown={visible(layer)}>
                <ZoneTag range={spec} plan={plan} layer={layer} />
              </Layer>
            );
          }
          if (layer.type === "origin") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: layers never reorder
              <Layer key={i} shown={visible(layer)}>
                <OriginMark x={tickX(spec, 0)} y={plan.axisY} />
              </Layer>
            );
          }
          return null;
        })}
      </LineAxis>
    </svg>
  );
}

// A picture of the number line: still, or stepped through its layers.
export function NumberLine({ spec }: { spec: NumberLineSpec }) {
  const layers = spec.layers ?? [];
  if (spec.mode === "still") {
    return (
      <figure aria-label={spec.label} className="flex w-full justify-center">
        <LineFrame spec={spec} step={lastStep(layers)} />
      </figure>
    );
  }
  const last = lastStep(layers);
  const steps = spec.mode === "hint" ? last : last + 1;
  return (
    <StepPlayer steps={Math.max(steps, 1)} label={spec.label}>
      {(step) => <LineFrame spec={spec} step={step} />}
    </StepPlayer>
  );
}
