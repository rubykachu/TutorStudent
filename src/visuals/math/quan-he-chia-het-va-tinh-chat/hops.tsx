"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { useVisualTransition } from "@/visuals/shared/motion";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { LegendItem, SpecOf } from "./catalog";
import { landings } from "./logic";

type Spec = SpecOf<"hops">;

const WIDTH = 420;
const HEIGHT = 175;
const MARGIN = 28;
const LINE_Y = 118;
const ARC_HEIGHT = 36;
const NUMBER_Y = LINE_Y + 40;
const FLAG_Y = 22;
const MARK_RADIUS = 7;

// Equal hops from 0 along a number line. With a `target` the picture asks
// whether a hop lands exactly on it (the target is the dividend, in blue);
// with a `range` the landings inside it are picked out and the two ends are
// flagged. Landings still to come show as a dimmed "?"; in "hint" without a
// target the last landing stays a "?".
function Line({ spec, jumps }: { spec: Spec; jumps: number }) {
  const { step, limit, target, range, mode } = spec;
  const transition = useVisualTransition();
  const points = landings(step, limit);
  const end = Math.max(limit, target ?? 0, range?.[1] ?? 0);
  const x = (value: number) => MARGIN + (value * (WIDTH - 2 * MARGIN)) / end;
  const hint = mode === "hint" && target === undefined;
  const stop = stopColor(spec);
  // A picture of multiples counts 0 among them (0 is a multiple of every
  // number); a test of one dividend or a range leaves 0 neutral.
  const zeroColor = target === undefined && range === undefined ? "blue" : null;
  const inRange = (v: number) =>
    range === undefined || (v > range[0] && v < range[1]);
  return (
    <svg
      role="img"
      aria-label={`Trục số: các bước nhảy ${step} từ 0${target === undefined ? "" : `, số cần xét ${target}`}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full max-w-xl"
    >
      <line
        {...decorative}
        x1={MARGIN - 12}
        x2={WIDTH - MARGIN + 12}
        y1={LINE_Y}
        y2={LINE_Y}
        className="stroke-muted-foreground"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <text
        x={x(0)}
        y={NUMBER_Y}
        textAnchor="middle"
        fontSize={20}
        className={`${zeroColor ? CONCEPT_CLASSES[zeroColor].fill : "fill-foreground"} font-heading font-bold`}
      >
        0
      </text>
      {zeroColor ? (
        <ConceptShape color={zeroColor} cx={x(0)} cy={LINE_Y} r={MARK_RADIUS} />
      ) : (
        <circle
          {...decorative}
          cx={x(0)}
          cy={LINE_Y}
          r={MARK_RADIUS - 1}
          className="fill-foreground"
        />
      )}
      {target !== undefined && (
        <g>
          <line
            {...decorative}
            x1={x(target)}
            x2={x(target)}
            y1={FLAG_Y + 42}
            y2={LINE_Y - 12}
            className="stroke-concept-blue"
            strokeWidth={3}
            strokeDasharray="5 5"
          />
          <ConceptShape
            color="blue"
            cx={x(target)}
            cy={FLAG_Y}
            r={MARK_RADIUS + 3}
          />
          <text
            x={x(target)}
            y={FLAG_Y + 34}
            textAnchor="middle"
            fontSize={20}
            className={`${CONCEPT_CLASSES.blue.fill} font-heading font-bold`}
          >
            {target}
          </text>
        </g>
      )}
      {range?.map((edge) => (
        <g key={edge}>
          <line
            {...decorative}
            x1={x(edge)}
            x2={x(edge)}
            y1={FLAG_Y + 42}
            y2={LINE_Y - 12}
            className="stroke-muted-foreground"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <text
            x={x(edge)}
            y={FLAG_Y + 34}
            textAnchor="middle"
            fontSize={20}
            className="fill-foreground font-heading font-bold"
          >
            {edge}
          </text>
        </g>
      ))}
      {points.map((value, i) => {
        const shown = i < jumps;
        const unknown = hint && i === points.length - 1;
        const from = x(points[i - 1] ?? 0);
        const to = x(value);
        const mid = (from + to) / 2;
        const picked = inRange(value);
        const color = picked ? stop : "slate";
        const fade = {
          initial: false,
          animate: { opacity: shown ? 1 : 0 },
          transition,
        } as const;
        return (
          <Fragment key={value}>
            <motion.g
              {...decorative}
              initial={false}
              animate={{ opacity: shown ? 0 : 1 }}
              transition={transition}
            >
              <ConceptShape
                color="slate"
                variant="outline"
                cx={to}
                cy={LINE_Y}
                r={MARK_RADIUS - 1}
              />
              <text
                x={to}
                y={NUMBER_Y}
                textAnchor="middle"
                fontSize={20}
                className="fill-muted-foreground font-heading font-bold"
              >
                ?
              </text>
            </motion.g>
            <motion.g {...decorative} {...fade}>
              <path
                d={`M ${from} ${LINE_Y - 4} Q ${mid} ${LINE_Y - 2 * ARC_HEIGHT - 4} ${to} ${LINE_Y - 4}`}
                className="fill-none stroke-concept-violet"
                strokeWidth={3}
              />
            </motion.g>
            <motion.g {...fade}>
              <ConceptShape
                color={color}
                variant={unknown ? "outline" : "filled"}
                cx={to}
                cy={LINE_Y}
                r={MARK_RADIUS}
                className={picked ? "" : "opacity-50"}
              />
              <text
                x={to}
                y={NUMBER_Y}
                textAnchor="middle"
                fontSize={20}
                className={`${unknown || !picked ? "fill-muted-foreground" : CONCEPT_CLASSES[stop].fill} font-heading font-bold`}
              >
                {unknown ? "?" : value}
              </text>
            </motion.g>
          </Fragment>
        );
      })}
    </svg>
  );
}

// Colour of the landings: blue (multiples) when the picture lists multiples,
// neutral when it only tests one dividend (which is blue then).
function stopColor(spec: Spec): "blue" | "slate" {
  return spec.target === undefined ? "blue" : "slate";
}

// The lines under the number line: the hops so far as a product; on the last
// step the verdict for a target (the two landings around it and the
// remainder, a hole in a hint), or the landings inside the range.
function Caption({ spec, jumps }: { spec: Spec; jumps: number }) {
  const { step, limit, target, range, mode } = spec;
  const points = landings(step, limit);
  const last = jumps >= points.length;
  if (jumps === 0) return <p className={MATH_LINE}>Bắt đầu từ 0</p>;
  if (last && target !== undefined) {
    const hit = target % step === 0;
    const below = Math.floor(target / step) * step;
    return hit ? (
      <p className={MATH_LINE}>
        <Tint color="blue">{target}</Tint>
        {" = "}
        <Tint color="violet">{step}</Tint>
        {" · "}
        <Tint color="amber">{target / step}</Tint>
      </p>
    ) : (
      <>
        <p className={MATH_LINE}>
          <Tint color="slate">{below}</Tint>
          {" < "}
          <Tint color="blue">{target}</Tint>
          {" < "}
          <Tint color="slate">{below + step}</Tint>
        </p>
        <p className={MATH_LINE}>
          <Tint color="blue">{target}</Tint>
          {" − "}
          <Tint color="slate">{below}</Tint>
          <span className="whitespace-nowrap">
            {"= "}
            {mode === "hint" ? (
              <Hole />
            ) : (
              <Tint color="pink">{target - below}</Tint>
            )}
          </span>
        </p>
      </>
    );
  }
  if (last && range !== undefined) {
    const picked = points.filter((v) => v > range[0] && v < range[1]);
    return (
      <p className={MATH_LINE}>
        {picked.map((v, i) => (
          <Fragment key={v}>
            {i > 0 && <span>;</span>}
            <Tint color="blue">{v}</Tint>
          </Fragment>
        ))}
      </p>
    );
  }
  const unknown = mode === "hint" && target === undefined && last;
  return (
    <p className={MATH_LINE}>
      <Tint color="violet">{step}</Tint>
      {" · "}
      <Tint color="amber">{jumps}</Tint>
      <span className="whitespace-nowrap">
        {"= "}
        {unknown ? <Hole /> : jumps * step}
      </span>
    </p>
  );
}

function HopsView({ spec, jumps }: { spec: Spec; jumps: number }) {
  const { target, range, step } = spec;
  const remainder = target !== undefined && target % step !== 0;
  const legend: LegendItem[] = [
    { color: "violet", name: "Một bước nhảy" },
    ...(target === undefined
      ? [
          {
            color: "blue" as const,
            name: range === undefined ? "Bội" : "Bội trong khoảng",
          },
        ]
      : [
          { color: "blue" as const, name: "Số bị chia" },
          { color: "slate" as const, name: "Chỗ dừng" },
        ]),
    ...(range === undefined
      ? []
      : [{ color: "slate" as const, name: "Ngoài khoảng" }]),
    ...(remainder ? [{ color: "pink" as const, name: "Số dư" }] : []),
  ];
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Line spec={spec} jumps={jumps} />
      <div
        className={remainder ? "min-h-[5.5rem]" : "min-h-10"}
        aria-live="polite"
      >
        <Caption spec={spec} jumps={jumps} />
      </div>
      <Legend items={legend} />
    </div>
  );
}

export function Hops({ spec }: { spec: Spec }) {
  const count = landings(spec.step, spec.limit).length;
  const label = `Nhảy từng bước ${spec.step} từ 0, ${count} bước nhảy`;
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <HopsView spec={spec} jumps={count} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={count + 1} label={label}>
      {(step) => <HopsView spec={spec} jumps={step} />}
    </StepPlayer>
  );
}
