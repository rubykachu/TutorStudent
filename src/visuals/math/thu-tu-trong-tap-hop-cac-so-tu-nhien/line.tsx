"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  ARROW_TIP,
  AXIS_START,
  arrowY,
  DOT_RADIUS,
  LABEL_DROP,
  type LineGeometry,
  type LinePlan,
  nameY,
  planLine,
  TEXT_SIZE,
  tagWidth,
  tagY,
  tickValues,
  tickX,
  VIEW_WIDTH,
  visibleLabels,
} from "./line-logic";
import type { LineLayer, LineSpec } from "./types";

// A number line drawn in an SVG as wide as its frame: a ray with a tick at
// every step, the numbers under the ticks that carry one, and the layers of
// the picture (points, dots, bands, distance arrows) on top. `LineAxis` is the
// part the three number-line pictures share.

const TEXT = "font-heading font-bold";
const PLAIN_NUMBER = `${TEXT} fill-muted-foreground`;
const TICK_HALF = 7;
const BAND_HALF = 9;
const BAND_OPACITY = 0.55;
const ARROW_HEAD = 7;

// The text that stands under a tick instead of its plain number.
export type TickMark = { text: string; className: string };

export function numberMark(color: ConceptColor, text: string): TickMark {
  return { text, className: `${TEXT} ${CONCEPT_CLASSES[color].fill}` };
}

export const ASK_MARK: TickMark = { text: "?", className: PLAIN_NUMBER };

export function lineViewBox(plan: LinePlan): string {
  return `0 0 ${VIEW_WIDTH} ${plan.height}`;
}

// The ray, its ticks and the numbers under them. `marks` replaces the number
// under a tick (and adds one under a tick that has none); `behind` is drawn
// under the ray, `children` over it.
export function LineAxis({
  geometry,
  plan,
  marks,
  behind,
  children,
}: {
  geometry: LineGeometry;
  plan: LinePlan;
  marks?: ReadonlyMap<number, TickMark>;
  behind?: ReactNode;
  children?: ReactNode;
}) {
  const { axisY } = plan;
  const labelled = new Set(visibleLabels(geometry, [...(marks?.keys() ?? [])]));
  return (
    <>
      {behind}
      <g {...decorative} className="stroke-foreground" strokeLinecap="round">
        <line
          x1={AXIS_START}
          y1={axisY}
          x2={ARROW_TIP - ARROW_HEAD}
          y2={axisY}
          strokeWidth={3}
        />
        <polygon
          points={`${ARROW_TIP - ARROW_HEAD * 2},${axisY - ARROW_HEAD} ${ARROW_TIP},${axisY} ${ARROW_TIP - ARROW_HEAD * 2},${axisY + ARROW_HEAD}`}
          className="fill-foreground"
          strokeWidth={1}
          strokeLinejoin="round"
        />
        {tickValues(geometry).map((tick) => (
          <line
            key={tick}
            x1={tickX(geometry, tick)}
            x2={tickX(geometry, tick)}
            y1={axisY - TICK_HALF}
            y2={axisY + TICK_HALF}
            strokeWidth={2}
          />
        ))}
      </g>
      {tickValues(geometry)
        .filter((tick) => labelled.has(tick))
        .map((tick) => {
          const mark = marks?.get(tick);
          return (
            <text
              key={tick}
              x={tickX(geometry, tick)}
              y={axisY + LABEL_DROP}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={TEXT_SIZE}
              stroke="none"
              className={mark?.className ?? PLAIN_NUMBER}
            >
              {mark?.text ?? tick}
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
  opacity = 1,
  children,
}: {
  shown: boolean;
  opacity?: number;
  children: ReactNode;
}) {
  const transition = useVisualTransition();
  return (
    <motion.g
      initial={false}
      animate={{ opacity: shown ? opacity : 0 }}
      transition={transition}
      className={shown ? "" : "invisible"}
    >
      {children}
    </motion.g>
  );
}

// A short label under the line with the marker of its colour in front.
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
  const width = tagWidth(text, true);
  const left = x - width / 2;
  return (
    <>
      <ConceptShape color={color} cx={left + 6} cy={y} r={6} />
      <text
        x={left + 16}
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

// A named dot on a tick: its name above, its marker in the concept's shape.
export function NamedDot({
  x,
  y,
  color,
  name,
  radius,
  nameAt,
}: {
  x: number;
  y: number;
  color: ConceptColor;
  name?: string;
  radius: number;
  nameAt: number;
}) {
  return (
    <>
      <ConceptShape color={color} cx={x} cy={y} r={radius} />
      {name && (
        <text
          x={x}
          y={nameAt}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={TEXT_SIZE}
          stroke="none"
          className={`${TEXT} ${CONCEPT_CLASSES[color].fill}`}
        >
          {name}
        </text>
      )}
    </>
  );
}

// The empty slot of a point the hint does not name: dimmed, with "?" under.
function GhostDot({ x, y }: { x: number; y: number }) {
  return (
    <ConceptShape
      color="slate"
      cx={x}
      cy={y}
      r={DOT_RADIUS}
      variant="outline"
      strokeDasharray="3 3"
    />
  );
}

function Arrow({
  x1,
  x2,
  y,
  color,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: ConceptColor;
}) {
  const [left, right] = x1 < x2 ? [x1, x2] : [x2, x1];
  const paint = color ? CONCEPT_CLASSES[color].stroke : "stroke-foreground";
  const fill = color ? CONCEPT_CLASSES[color].fill : "fill-foreground";
  return (
    <g className={paint} strokeWidth={2.5} strokeLinecap="round">
      <line x1={left + ARROW_HEAD} y1={y} x2={right - ARROW_HEAD} y2={y} />
      <polygon
        points={`${left},${y} ${left + ARROW_HEAD * 1.6},${y - ARROW_HEAD / 1.4} ${left + ARROW_HEAD * 1.6},${y + ARROW_HEAD / 1.4}`}
        className={fill}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <polygon
        points={`${right},${y} ${right - ARROW_HEAD * 1.6},${y - ARROW_HEAD / 1.4} ${right - ARROW_HEAD * 1.6},${y + ARROW_HEAD / 1.4}`}
        className={fill}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </g>
  );
}

// What a layer is at this moment: on screen, still to come (keeps its place),
// the dimmed "?" of a hint, or left out.
type Status = "shown" | "pending" | "ghost" | "gone";

function statusOf(
  layer: LineLayer,
  index: number,
  step: number,
  spec: LineSpec,
): Status {
  if (spec.mode === "still") return "shown";
  if (spec.mode === "steps") return step >= index ? "shown" : "pending";
  if (index < hintLayers(spec)) return step >= index ? "shown" : "pending";
  return layer.type === "point" || layer.type === "dots" ? "ghost" : "gone";
}

// In a hint the last layer, the result, is the one that is not drawn.
function hintLayers(spec: LineSpec): number {
  return spec.hintLayers ?? Math.max(spec.layers.length - 1, 0);
}

function LineFigure({ spec, step }: { spec: LineSpec; step: number }) {
  const plan = planLine(spec);
  const x = (value: number) => tickX(spec, value);
  const marks = new Map<number, TickMark>();
  const behind: ReactNode[] = [];
  const front: ReactNode[] = [];

  spec.layers.forEach((layer, index) => {
    const status = statusOf(layer, index, step, spec);
    if (status === "gone") return;
    const shown = status === "shown";
    const key = `${layer.type}-${index}`;
    const tagAt = plan.tagRow[index];
    const tagCentre = plan.tagX[index] ?? 0;

    switch (layer.type) {
      case "point": {
        if (status === "ghost") {
          marks.set(layer.at, ASK_MARK);
          front.push(
            <Layer key={key} shown opacity={0.6}>
              <GhostDot x={x(layer.at)} y={plan.axisY} />
            </Layer>,
          );
          return;
        }
        if (shown) {
          marks.set(
            layer.at,
            layer.ask ? ASK_MARK : numberMark(layer.color, String(layer.at)),
          );
        } else if (layer.ask) {
          marks.set(layer.at, ASK_MARK);
        }
        front.push(
          <Layer key={key} shown={shown}>
            <NamedDot
              x={x(layer.at)}
              y={plan.axisY}
              color={layer.color}
              name={layer.name}
              radius={DOT_RADIUS}
              nameAt={nameY(plan, DOT_RADIUS, 0)}
            />
            {layer.tag && tagAt !== undefined && (
              <Tag
                x={tagCentre}
                y={tagY(plan, tagAt)}
                text={layer.tag}
                color={layer.color}
              />
            )}
          </Layer>,
        );
        return;
      }
      case "dots": {
        if (status === "ghost") {
          for (const at of layer.at) marks.set(at, ASK_MARK);
          front.push(
            <Layer key={key} shown opacity={0.6}>
              {layer.at.map((at) => (
                <GhostDot key={at} x={x(at)} y={plan.axisY} />
              ))}
            </Layer>,
          );
          return;
        }
        if (shown) {
          for (const at of layer.at) {
            marks.set(at, numberMark(layer.color, String(at)));
          }
        }
        front.push(
          <Layer key={key} shown={shown}>
            {layer.at.map((at) => (
              <ConceptShape
                key={at}
                color={layer.color}
                cx={x(at)}
                cy={plan.axisY}
                r={DOT_RADIUS}
              />
            ))}
            {layer.tag && tagAt !== undefined && (
              <Tag
                x={tagCentre}
                y={tagY(plan, tagAt)}
                text={layer.tag}
                color={layer.color}
              />
            )}
          </Layer>,
        );
        return;
      }
      case "span": {
        const [left, right] = [x(layer.from), x(layer.to)];
        behind.push(
          <Layer key={key} shown={shown}>
            <rect
              {...decorative}
              x={left}
              y={plan.axisY - BAND_HALF}
              width={right - left}
              height={BAND_HALF * 2}
              rx={BAND_HALF}
              className={CONCEPT_CLASSES[layer.color].fill}
              fillOpacity={BAND_OPACITY}
            />
          </Layer>,
        );
        if (layer.tag && tagAt !== undefined) {
          front.push(
            <Layer key={key} shown={shown}>
              <Tag
                x={tagCentre}
                y={tagY(plan, tagAt)}
                text={layer.tag}
                color={layer.color}
              />
            </Layer>,
          );
        }
        return;
      }
      case "arrow": {
        const row = plan.arrowRow[index] ?? 0;
        const y = arrowY(plan, row, DOT_RADIUS);
        front.push(
          <Layer key={key} shown={shown}>
            <Arrow
              x1={x(layer.from)}
              x2={x(layer.to)}
              y={y}
              color={layer.color}
            />
            <text
              x={tagCentre}
              y={y - 14}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={TEXT_SIZE}
              stroke="none"
              className={`${TEXT} fill-foreground`}
            >
              {layer.tag}
            </text>
          </Layer>,
        );
      }
    }
  });

  return (
    <svg
      viewBox={lineViewBox(plan)}
      aria-hidden
      className="h-auto w-full max-w-md"
    >
      <LineAxis geometry={spec} plan={plan} marks={marks} behind={behind}>
        {front}
      </LineAxis>
    </svg>
  );
}

// A number line with named points, dots, bands and distance arrows. "steps"
// brings one layer per step; "still" draws them all; "hint" plays the layers
// before `hintLayers` and shows the later points as dimmed "?" with no name,
// tag or number, and leaves later bands and arrows out, so the result is not
// drawn.
export function Line({ spec }: { spec: LineSpec }) {
  if (spec.mode === "still") {
    return (
      <figure aria-label={spec.label} className="flex w-full justify-center">
        <LineFigure spec={spec} step={spec.layers.length} />
      </figure>
    );
  }
  const steps = spec.mode === "hint" ? hintLayers(spec) : spec.layers.length;
  return (
    <StepPlayer steps={Math.max(steps, 1)} label={spec.label}>
      {(step) => <LineFigure spec={spec} step={step} />}
    </StepPlayer>
  );
}
