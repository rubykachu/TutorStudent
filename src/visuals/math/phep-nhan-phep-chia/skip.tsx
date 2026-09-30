"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { fmt, landings } from "./logic-nhan";
import { Hole, Legend, MATH_LINE, Product, Tint } from "./parts-nhan";

type Spec = SpecOf<"skip">;

const WIDTH = 420;
const HEIGHT = 170;
const MARGIN = 26;
const LINE_Y = 112;
const ARC_HEIGHT = 38;
const LABEL_Y = LINE_Y - ARC_HEIGHT - 18;
const NUMBER_Y = LINE_Y + 40;
const MARK_RADIUS = 7;

function NumberLine({ spec, jumps }: { spec: Spec; jumps: number }) {
  const { step, hops, mode } = spec;
  const transition = useVisualTransition();
  const points = landings(step, hops);
  const scale = (WIDTH - 2 * MARGIN) / (step * hops);
  const x = (value: number) => MARGIN + value * scale;
  const hint = mode === "hint";
  return (
    <svg
      role="img"
      aria-label={`Trục số: ${hops} bước nhảy, mỗi bước ${step}, bắt đầu từ 0`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full max-w-xl"
    >
      <line
        {...decorative}
        x1={MARGIN - 10}
        x2={WIDTH - MARGIN + 10}
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
        fontSize={22}
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
      {points.slice(1).map((value, i) => {
        const shown = i < jumps;
        const last = i === hops - 1;
        const unknown = hint && last;
        const from = x(points[i] ?? 0);
        const to = x(value);
        const mid = (from + to) / 2;
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
                className="fill-none stroke-concept-blue"
                strokeWidth={3}
              />
              <text
                x={mid}
                y={LABEL_Y}
                textAnchor="middle"
                fontSize={20}
                className={`${CONCEPT_CLASSES.blue.fill} font-heading font-bold`}
              >
                {`+${step}`}
              </text>
            </motion.g>
            <motion.g {...fade}>
              <ConceptShape
                color="amber"
                variant={unknown ? "outline" : "filled"}
                cx={to}
                cy={LINE_Y}
                r={MARK_RADIUS}
              />
              <text
                x={to}
                y={NUMBER_Y}
                textAnchor="middle"
                fontSize={22}
                className={`${unknown ? "fill-muted-foreground" : CONCEPT_CLASSES.amber.fill} font-heading font-bold`}
              >
                {unknown ? "?" : fmt(value)}
              </text>
            </motion.g>
          </Fragment>
        );
      })}
    </svg>
  );
}

// The line under the line: jumps so far as a product. A hint stops at "?" on
// the last jump.
function JumpLine({ spec, jumps }: { spec: Spec; jumps: number }) {
  if (jumps === 0) {
    return <p className={MATH_LINE}>Bắt đầu từ 0</p>;
  }
  const unknown = spec.mode === "hint" && jumps === spec.hops;
  return (
    <p className={MATH_LINE}>
      <Product factors={[jumps, spec.step]} />
      <span className="whitespace-nowrap">
        {"= "}
        {unknown ? (
          <Hole />
        ) : (
          <Tint color="amber">{fmt(jumps * spec.step)}</Tint>
        )}
      </span>
    </p>
  );
}

function SkipView({ spec, jumps }: { spec: Spec; jumps: number }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <NumberLine spec={spec} jumps={jumps} />
      <div className="min-h-10" aria-live="polite">
        <JumpLine spec={spec} jumps={jumps} />
      </div>
      <Legend
        items={[
          { color: "blue", name: "Mỗi bước nhảy" },
          { color: "amber", name: "Nơi đáp" },
        ]}
      />
    </div>
  );
}

export function Skip({ spec }: { spec: Spec }) {
  const label = `Đếm cách từ 0: ${spec.hops} bước nhảy, mỗi bước ${spec.step}`;
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <SkipView spec={spec} jumps={spec.hops} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={spec.hops + 1} label={label}>
      {(step) => <SkipView spec={spec} jumps={step} />}
    </StepPlayer>
  );
}
