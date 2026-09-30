"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { decorative } from "@/visuals/shared/markers";
import {
  GLYPHS,
  type Stroke,
  strokeStart,
  strokeWidth,
  TRACE_GLYPH,
  type TraceSymbol,
} from "./glyphs";

// A mark drawn stroke by stroke, shared by the explainers (which play the
// strokes) and the tracing exercise (where the child taps each start dot).
// The path length animation is the one motion here that is not a transform or
// an opacity; it stays inside this small drawing.

// Room around the 120 x 160 glyph box for the start dots and their hit areas.
export const FIGURE_VIEW_BOX = "-24 -14 172 188";
const DOT_RADIUS = 10;
const RING_RADIUS = 15;
// Radius of the invisible circle that catches a tap: 20 box units are at least
// 48 screen pixels wide on the smallest figure.
export const HIT_RADIUS = 22;
const DRAW_SECONDS = 0.7;

// Distance of the default start dot from the start of its stroke.
const DOT_OFFSET = 22;

function badgePoint(stroke: Stroke): readonly [number, number] {
  if (stroke.badge) return stroke.badge;
  const { x, y, angle } = strokeStart(stroke);
  return [x - Math.cos(angle) * DOT_OFFSET, y - Math.sin(angle) * DOT_OFFSET];
}

// Small arrow beside a start dot, pointing in at the start of the stroke.
function DirectionArrow({ stroke }: { stroke: Stroke }) {
  const { x, y } = strokeStart(stroke);
  const [cx, cy] = badgePoint(stroke);
  const angle = Math.atan2(y - cy, x - cx);
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const point = (along: number, across: number) =>
    `${cx + ux * along - uy * across},${cy + uy * along + ux * across}`;
  return (
    <polygon
      points={`${point(DOT_RADIUS + 12, 0)} ${point(DOT_RADIUS + 3, 5)} ${point(DOT_RADIUS + 3, -5)}`}
      className="fill-primary"
    />
  );
}

function StartDot({
  stroke,
  number,
  active,
}: {
  stroke: Stroke;
  number: number;
  active: boolean;
}) {
  const [cx, cy] = badgePoint(stroke);
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={DOT_RADIUS}
        className={
          active
            ? "fill-primary"
            : "fill-surface stroke-muted-foreground [stroke-width:2]"
        }
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        stroke="none"
        className={`font-heading font-bold ${active ? "fill-primary-foreground" : "fill-muted-foreground"}`}
      >
        {number}
      </text>
      {active ? <DirectionArrow stroke={stroke} /> : null}
    </g>
  );
}

function DrawnStroke({
  stroke,
  animate,
}: {
  stroke: Stroke;
  animate: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const play = animate && !reduced;
  return (
    <motion.path
      d={stroke.d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth(stroke)}
      className="stroke-foreground"
      initial={play ? { pathLength: 0 } : false}
      animate={{ pathLength: 1 }}
      transition={{ duration: DRAW_SECONDS, ease: "easeInOut" }}
    />
  );
}

export type StrokeFigureProps = {
  symbol: TraceSymbol;
  // Strokes 0 … drawn - 1 are on the paper.
  drawn: number;
  // Stroke whose start dot is lit, if any.
  active: number | null;
  // Show the dots of the strokes still to come, dim.
  showPending: boolean;
  // Draw new strokes with their animation (off when showing a finished state).
  animate: boolean;
  // Makes the lit dot a button that draws its stroke.
  onTap?: () => void;
  // Attributes marking the lit button for `pnpm lesson:walk`.
  tapMarker?: Record<string, string>;
  className?: string;
};

export function StrokeFigure({
  symbol,
  drawn,
  active,
  showPending,
  animate,
  onTap,
  tapMarker,
  className = "h-auto w-full max-w-64",
}: StrokeFigureProps) {
  const glyph = GLYPHS[TRACE_GLYPH[symbol]];
  const strokes = glyph.strokes;
  const activeStroke = active === null ? undefined : strokes[active];
  return (
    <svg
      role="img"
      aria-label={`${glyph.label}: đã vẽ ${Math.min(drawn, strokes.length)} trên ${strokes.length} nét`}
      viewBox={FIGURE_VIEW_BOX}
      className={className}
    >
      <g {...decorative}>
        {strokes.map((stroke, i) =>
          i < drawn || (showPending && i !== active) ? null : (
            <path
              key={`guide-${stroke.d}`}
              d={stroke.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={stroke.dot ? 10 : 5}
              strokeDasharray={stroke.dot ? undefined : "0.1 9"}
              strokeDashoffset={stroke.dot ? undefined : 4.5}
              className="stroke-muted-foreground opacity-60"
            />
          ),
        )}
        {strokes.map((stroke, i) =>
          i < drawn ? (
            <DrawnStroke
              key={`ink-${stroke.d}`}
              stroke={stroke}
              animate={animate}
            />
          ) : null,
        )}
        {showPending
          ? strokes.map((stroke, i) =>
              i >= drawn && i !== active ? (
                <StartDot
                  key={`pending-${stroke.d}`}
                  stroke={stroke}
                  number={i + 1}
                  active={false}
                />
              ) : null,
            )
          : null}
        {activeStroke && !onTap && active !== null ? (
          <StartDot stroke={activeStroke} number={active + 1} active />
        ) : null}
      </g>
      {activeStroke && onTap && active !== null ? (
        <TapDot
          stroke={activeStroke}
          number={active + 1}
          onTap={onTap}
          marker={tapMarker}
        />
      ) : null}
    </svg>
  );
}

function TapDot({
  stroke,
  number,
  onTap,
  marker,
}: {
  stroke: Stroke;
  number: number;
  onTap: () => void;
  marker?: Record<string, string>;
}) {
  const [cx, cy] = badgePoint(stroke);
  return (
    // SVG has no <button>; a focusable group with the button role is the
    // accessible equivalent inside a drawing.
    // biome-ignore lint/a11y/useSemanticElements: see above
    <g
      role="button"
      tabIndex={0}
      aria-label={`Chạm chấm số ${number} để vẽ nét ${number}`}
      className="cursor-pointer outline-none focus-visible:[&_circle]:stroke-ring"
      onClick={onTap}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onTap();
      }}
      {...marker}
    >
      <circle
        {...decorative}
        cx={cx}
        cy={cy}
        r={HIT_RADIUS}
        className="fill-transparent"
      />
      <circle
        {...decorative}
        cx={cx}
        cy={cy}
        r={RING_RADIUS}
        className="fill-none stroke-primary [stroke-width:3]"
      />
      <g {...decorative}>
        <StartDot stroke={stroke} number={number} active />
      </g>
    </g>
  );
}
