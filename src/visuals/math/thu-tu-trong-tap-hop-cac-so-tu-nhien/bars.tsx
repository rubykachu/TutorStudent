"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Legend } from "@/visuals/shared/math-parts";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Region, RegionSvg } from "@/visuals/shared/region";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { BarsSpec } from "./types";

// A bar chart on a vertical axis. Bars still to come keep their place as a
// dashed stub with a "?" (never as a bar, so no height gives the value away).

const WIDTH = 330;
const TOP = 40;
const PLOT_HEIGHT = 180;
const BASE = TOP + PLOT_HEIGHT;
// Space kept between two bars: every region stays this far from the next.
const BAR_GAP = 12;
const FONT = 16;
const LABEL_LINE = 18;
const CHAR_WIDTH = 8.6;
const MARK_RADIUS = 8;
const STUB_HEIGHT = 40;
const PENDING_OPACITY = 0.5;
const TEXT = "fill-foreground font-heading font-bold";

// Bars of the picture the plain colour of text: colour is kept for the bars
// a lesson marks as a concept.
const PLAIN_BAR = "fill-muted-foreground";

// Opacity fade of a group inside an SVG (`Reveal` is HTML, so it cannot sit in
// a drawing); only opacity moves, and reduced motion jumps to the end.
export function SvgFade({
  opacity,
  children,
}: {
  opacity: number;
  children: ReactNode;
}) {
  const transition = useVisualTransition();
  return (
    <motion.g
      initial={false}
      animate={{ opacity }}
      transition={transition}
      aria-hidden={opacity === 0 || undefined}
    >
      {children}
    </motion.g>
  );
}

// A label wraps word by word when it is wider than the bar's slot.
function labelLines(label: string, slot: number): string[] {
  return label.length * CHAR_WIDTH <= slot ? [label] : label.split(" ");
}

function showsValue(values: BarsSpec["values"], index: number): boolean {
  if (values === "all") return true;
  if (values === "none") return false;
  return values.includes(index);
}

type ChartProps = {
  spec: BarsSpec;
  // Bars from the left that are drawn; the others are stubs.
  shown: number;
};

function Chart({ spec, shown }: ChartProps) {
  const { items, max, gridEvery, values, marks = [], unit, tap } = spec;
  const count = items.length;
  const ticks = Array.from(
    { length: Math.floor(max / gridEvery) + 1 },
    (_, i) => i * gridEvery,
  );
  const axisWidth = 12 + String(max).length * 9;
  const slot = (WIDTH - axisWidth) / count;
  const barWidth = slot - BAR_GAP;
  const lines = items.map((item) => labelLines(item.label, slot));
  const labelRows = Math.max(...lines.map((words) => words.length));
  const labelsBottom = BASE + 6 + labelRows * LABEL_LINE;
  const visibleMarks = marks.filter((mark) => mark.index < shown);
  const markY = labelsBottom + MARK_RADIUS + 4;
  const height =
    visibleMarks.length > 0 ? markY + MARK_RADIUS + 6 : labelsBottom + 6;
  const yOf = (value: number) => BASE - (value / max) * PLOT_HEIGHT;
  const legend = [
    ...new Map(
      visibleMarks.map((mark) => [
        mark.tag,
        { color: mark.color, name: mark.tag },
      ]),
    ).values(),
  ];

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <RegionSvg
        label={spec.label}
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="h-auto w-full max-w-md"
      >
        <g {...decorative}>
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={axisWidth}
              x2={WIDTH}
              y1={yOf(tick)}
              y2={yOf(tick)}
              className={
                tick === 0 ? "stroke-muted-foreground" : "stroke-border"
              }
              strokeWidth={tick === 0 ? 2 : 1}
            />
          ))}
        </g>
        {ticks.map((tick) => (
          <text
            key={tick}
            x={axisWidth - 6}
            y={yOf(tick)}
            textAnchor="end"
            dominantBaseline="central"
            fontSize={FONT}
            stroke="none"
            className="fill-foreground font-heading"
          >
            {tick}
          </text>
        ))}
        {unit ? (
          <text
            x={0}
            y={10}
            dominantBaseline="central"
            fontSize={FONT}
            stroke="none"
            className="fill-foreground font-heading"
          >
            {`Đơn vị: ${unit}`}
          </text>
        ) : null}
        {items.map((item, i) => {
          const x = axisWidth + i * slot + BAR_GAP / 2;
          const centre = x + barWidth / 2;
          const visible = i < shown;
          // The last bar of a hint is left out of the drawing altogether, so
          // its height is nowhere in the page.
          const withheld = spec.mode === "hint" && i === count - 1;
          const mark = visible ? marks.find((m) => m.index === i) : undefined;
          const barClass = mark ? CONCEPT_CLASSES[mark.color].fill : PLAIN_BAR;
          const top = yOf(item.value);
          const bar = (
            <SvgFade opacity={visible ? 1 : 0}>
              <rect
                {...decorative}
                x={x}
                y={top}
                width={barWidth}
                height={BASE - top}
                rx={3}
                className={barClass}
              />
            </SvgFade>
          );
          return (
            <g key={item.label}>
              {withheld ? null : tap ? (
                <Region id={`b${i}`} label={item.label}>
                  <rect
                    {...decorative}
                    x={x}
                    y={TOP}
                    width={barWidth}
                    height={PLOT_HEIGHT}
                    rx={3}
                    fill="transparent"
                  />
                  {bar}
                </Region>
              ) : (
                bar
              )}
              <SvgFade opacity={visible || tap ? 0 : PENDING_OPACITY}>
                <rect
                  {...decorative}
                  x={x}
                  y={BASE - STUB_HEIGHT}
                  width={barWidth}
                  height={STUB_HEIGHT}
                  rx={3}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  className="fill-none stroke-muted-foreground"
                />
                <text
                  x={centre}
                  y={BASE - STUB_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={FONT + 4}
                  stroke="none"
                  className={TEXT}
                >
                  ?
                </text>
              </SvgFade>
              {withheld || !showsValue(values, i) ? null : (
                <SvgFade opacity={visible ? 1 : 0}>
                  <text
                    x={centre}
                    y={top - 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={FONT}
                    stroke="none"
                    className={TEXT}
                  >
                    {item.value}
                  </text>
                </SvgFade>
              )}
              {lines[i]?.map((word, row) => (
                <text
                  key={word}
                  x={centre}
                  y={BASE + 6 + row * LABEL_LINE + LABEL_LINE / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={FONT}
                  stroke="none"
                  className="fill-foreground font-heading"
                >
                  {word}
                </text>
              ))}
              {mark ? (
                <SvgFade opacity={1}>
                  <ConceptShape
                    color={mark.color}
                    cx={centre}
                    cy={markY}
                    r={MARK_RADIUS}
                  />
                </SvgFade>
              ) : null}
            </g>
          );
        })}
      </RegionSvg>
      {legend.length > 0 ? <Legend items={legend} /> : null}
    </div>
  );
}

// Bar chart of one familiar thing. "steps" adds a bar per step, "still" draws
// them all, "hint" plays like "steps" without ever drawing the last bar. A
// chart that is the picture of a `tapRegion` exercise (`tap`) is always drawn
// whole: its bars are the regions `b0`, `b1`, … in the order of `items`.
export function Bars({ spec }: { spec: BarsSpec }) {
  const count = spec.items.length;
  if (spec.tap || spec.mode === "still") {
    return <Chart spec={spec} shown={count} />;
  }
  const playable = spec.mode === "hint" ? Math.max(1, count - 1) : count;
  const cap = spec.mode === "hint" ? count - 1 : count;
  return (
    <StepPlayer steps={playable} label={spec.label}>
      {(step) => <Chart spec={spec} shown={Math.min(step + 1, cap)} />}
    </StepPlayer>
  );
}
