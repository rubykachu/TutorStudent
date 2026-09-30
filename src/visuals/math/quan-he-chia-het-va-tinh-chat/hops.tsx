"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { useVisualTransition } from "@/visuals/shared/motion";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
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
// whether a hop lands exactly on it; with a `range` the landings inside it
// are picked out. In "hint" the last landing shows as "?".
function Line({ spec, jumps }: { spec: Spec; jumps: number }) {
  const { step, limit, target, range, mode } = spec;
  const transition = useVisualTransition();
  const points = landings(step, limit);
  const end = Math.max(limit, target ?? 0);
  const x = (value: number) => MARGIN + (value * (WIDTH - 2 * MARGIN)) / end;
  const hint = mode === "hint";
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
        className="fill-foreground font-heading font-bold"
      >
        0
      </text>
      <circle
        {...decorative}
        cx={x(0)}
        cy={LINE_Y}
        r={MARK_RADIUS - 1}
        className="fill-foreground"
      />
      {target !== undefined && (
        <g>
          <line
            {...decorative}
            x1={x(target)}
            x2={x(target)}
            y1={FLAG_Y + 42}
            y2={LINE_Y - 12}
            className="stroke-concept-lime"
            strokeWidth={3}
            strokeDasharray="5 5"
          />
          <ConceptShape
            color="lime"
            cx={x(target)}
            cy={FLAG_Y}
            r={MARK_RADIUS + 3}
          />
          <text
            x={x(target)}
            y={FLAG_Y + 34}
            textAnchor="middle"
            fontSize={20}
            className={`${CONCEPT_CLASSES.lime.fill} font-heading font-bold`}
          >
            {target}
          </text>
        </g>
      )}
      {points.map((value, i) => {
        const shown = i < jumps;
        const unknown = hint && i === points.length - 1;
        const from = x(points[i - 1] ?? 0);
        const to = x(value);
        const mid = (from + to) / 2;
        const picked = inRange(value);
        const fade = {
          initial: false,
          animate: { opacity: shown ? 1 : 0 },
          transition,
        } as const;
        return (
          <Fragment key={value}>
            <motion.g {...decorative} {...fade}>
              <path
                d={`M ${from} ${LINE_Y - 4} Q ${mid} ${LINE_Y - 2 * ARC_HEIGHT - 4} ${to} ${LINE_Y - 4}`}
                className="fill-none stroke-concept-violet"
                strokeWidth={3}
              />
            </motion.g>
            <motion.g {...fade}>
              <ConceptShape
                color="blue"
                variant={unknown ? "outline" : "filled"}
                cx={to}
                cy={LINE_Y}
                r={MARK_RADIUS}
                className={picked ? "" : "opacity-40"}
              />
              <text
                x={to}
                y={NUMBER_Y}
                textAnchor="middle"
                fontSize={20}
                className={`${unknown ? "fill-muted-foreground" : picked ? CONCEPT_CLASSES.blue.fill : "fill-muted-foreground"} font-heading font-bold`}
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

// The line under the number line: the hops so far as a product; on the last
// step the verdict for a target, or the landings inside the range.
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
        <Tint color="lime">{target}</Tint>
        {" = "}
        <Tint color="violet">{step}</Tint>
        {" · "}
        <Tint color="amber">{target / step}</Tint>
      </p>
    ) : (
      <p className={MATH_LINE}>
        <Tint color="blue">{below}</Tint>
        {" < "}
        <Tint color="lime">{target}</Tint>
        {" < "}
        <Tint color="blue">{below + step}</Tint>
      </p>
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
  const unknown = mode === "hint" && last;
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
  const legend = [
    { color: "violet", name: "Một bước nhảy" },
    { color: "blue", name: "Chỗ dừng" },
    ...(spec.target === undefined
      ? []
      : ([{ color: "lime", name: "Số đang xét" }] as const)),
  ] as const;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Line spec={spec} jumps={jumps} />
      <div className="min-h-10" aria-live="polite">
        <Caption spec={spec} jumps={jumps} />
      </div>
      <Legend items={legend} />
    </div>
  );
}

export function Hops({ spec }: { spec: Spec }) {
  const count = landings(spec.step, spec.limit).length;
  const label = `Đếm cách ${spec.step} từ 0, ${count} bước nhảy`;
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
