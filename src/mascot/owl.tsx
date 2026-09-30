"use client";

import {
  motion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  MASCOT_SIZES,
  type MascotExpression,
  type MascotSize,
} from "@/mascot/expressions";

// The owl mascot: a flat SVG drawn on a 120×120 grid with a margin for raised
// wings, drawn from the mascot colour
// tokens. Each expression is a pose (body, wings, eyes) that Motion moves to
// in at most 600ms, animating only transform and opacity. Under reduced motion
// the owl jumps straight to the pose and never blinks.

// Each animated part: the moving keyframes and the pose they end on, which is
// also the whole pose under reduced motion.
type Move = { keyframes: TargetAndTransition; rest: TargetAndTransition };

type Pose = {
  body: Move;
  leftWing: Move;
  rightWing: Move;
  // Pupils follow what the owl looks at.
  pupils: TargetAndTransition;
  eyes: "open" | "smile";
  sparkles: boolean;
};

const STILL: Move = {
  keyframes: { rotate: 0, y: 0 },
  rest: { rotate: 0, y: 0 },
};

// Wing angles are measured from hanging straight down: positive lifts the
// left wing outward, negative lifts the right one.
const POSES: Record<MascotExpression, Pose> = {
  idle: {
    body: STILL,
    leftWing: STILL,
    rightWing: STILL,
    pupils: { x: 0, y: 0 },
    eyes: "open",
    sparkles: false,
  },
  happy: {
    body: { keyframes: { y: [0, -6, 0, -3, 0] }, rest: { y: 0 } },
    leftWing: {
      keyframes: { rotate: [0, 45, 15, 45, 25] },
      rest: { rotate: 25 },
    },
    rightWing: {
      keyframes: { rotate: [0, -45, -15, -45, -25] },
      rest: { rotate: -25 },
    },
    pupils: { x: 0, y: 0 },
    eyes: "smile",
    sparkles: false,
  },
  // Leans and tilts its head toward the hint visual, which shows below and
  // to the left of it (under the answer card, or in the left column of the
  // two-column layout), and points there with a wing: a little hop and two
  // jabs make the change noticeable at 56px. Eyes follow the wing.
  hint: {
    body: {
      keyframes: { rotate: [0, -13, -9], y: [0, -6, 0] },
      rest: { rotate: -9, y: 0 },
    },
    leftWing: {
      keyframes: { rotate: [0, 85, 50, 75, 55] },
      rest: { rotate: 55 },
    },
    rightWing: {
      keyframes: { rotate: [0, -20, -12] },
      rest: { rotate: -12 },
    },
    pupils: { x: -4, y: 3 },
    eyes: "open",
    sparkles: false,
  },
  cheer: {
    body: { keyframes: { y: [0, -8, 0, -4, 0] }, rest: { y: 0 } },
    leftWing: {
      keyframes: { rotate: [0, 135, 115] },
      rest: { rotate: 115 },
    },
    rightWing: {
      keyframes: { rotate: [0, -135, -115] },
      rest: { rotate: -115 },
    },
    pupils: { x: 0, y: -1 },
    eyes: "open",
    sparkles: false,
  },
  welcome: {
    body: { keyframes: { rotate: [0, 4, 0] }, rest: { rotate: 0 } },
    leftWing: STILL,
    rightWing: {
      keyframes: { rotate: [0, -140, -105, -140, -110, -130] },
      rest: { rotate: -130 },
    },
    pupils: { x: 0, y: 0 },
    eyes: "smile",
    sparkles: true,
  },
};

// Expression changes, wing flaps and waves: 600ms at most.
const POSE_TRANSITION: Transition = { duration: 0.6, ease: "easeOut" };
const INSTANT: Transition = { duration: 0 };
const BLINK_DELAY_MIN_S = 4;
const BLINK_DELAY_SPREAD_S = 2;

// A 4-point sparkle centred on (x, y).
function sparklePath(x: number, y: number, r: number): string {
  return `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
}

const SPARKLES = [
  { x: 15, y: 30, r: 7 },
  { x: 26, y: 12, r: 4.5 },
  { x: 8, y: 50, r: 3.5 },
];

const FEATHERS: readonly (readonly [x: number, y: number])[] = [
  [50, 81],
  [60, 81],
  [70, 81],
  [55, 89],
  [65, 89],
];

const LEFT_WING =
  "M32 62 C22 65 17 78 21 92 C27 91 33 83 35 73 C36 67 35 63 32 62 Z";
const RIGHT_WING =
  "M88 62 C98 65 103 78 99 92 C93 91 87 83 85 73 C84 67 85 63 88 62 Z";

type OwlProps = {
  expression: MascotExpression;
  size: MascotSize;
  className?: string;
};

export function Owl({ expression, size, className = "" }: OwlProps) {
  const reducedMotion = usePrefersReducedMotion();
  // Each owl blinks on its own rhythm so two on screen never blink together.
  const [blinkDelay] = useState(
    () => BLINK_DELAY_MIN_S + Math.random() * BLINK_DELAY_SPREAD_S,
  );
  const pose = POSES[expression];
  const move = (m: Move) => (reducedMotion ? m.rest : m.keyframes);
  const transition = reducedMotion ? INSTANT : POSE_TRANSITION;
  const blinking = !reducedMotion && pose.eyes === "open";

  return (
    <svg
      viewBox="-8 -8 136 136"
      aria-hidden
      data-mascot={expression}
      data-mascot-still={reducedMotion || undefined}
      className={`${MASCOT_SIZES[size]} shrink-0 ${className}`}
    >
      <motion.g
        animate={move(pose.body)}
        transition={transition}
        style={{ originX: 0.5, originY: 1 }}
      >
        {/* Feet sit behind the body so only the toes peek out. */}
        <g className="fill-mascot-beak">
          <ellipse cx={49} cy={106} rx={7} ry={4} />
          <ellipse cx={71} cy={106} rx={7} ry={4} />
        </g>
        {/* Ear tufts */}
        <g
          className="fill-mascot-shade stroke-mascot-shade"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          <path d="M34 38 L29 15 L51 26 Z" />
          <path d="M86 38 L91 15 L69 26 Z" />
        </g>
        <path
          d="M60 22 C84 22 95 40 95 64 C95 90 81 106 60 106 C39 106 25 90 25 64 C25 40 36 22 60 22 Z"
          className="fill-mascot-body"
        />
        {/* Belly with a staggered feather pattern (two rows, so it never
            reads as a second face) */}
        <ellipse
          cx={60}
          cy={88}
          rx={22}
          ry={16}
          className="fill-mascot-belly"
        />
        <g
          className="fill-none stroke-mascot-body"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {FEATHERS.map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 3} ${y} L${x} ${y + 3} L${x + 3} ${y}`}
            />
          ))}
        </g>
        {/* Face disc */}
        <g className="fill-mascot-belly">
          <circle cx={46} cy={52} r={17} />
          <circle cx={74} cy={52} r={17} />
        </g>
        <g className="fill-avatar-cheek" opacity={0.75}>
          <ellipse cx={36} cy={66} rx={5.5} ry={3.5} />
          <ellipse cx={84} cy={66} rx={5.5} ry={3.5} />
        </g>
        {pose.eyes === "open" ? (
          <motion.g
            data-mascot-eyes="open"
            animate={blinking ? { scaleY: [1, 1, 0.1, 1] } : { scaleY: 1 }}
            transition={
              blinking
                ? {
                    duration: 0.3,
                    times: [0, 0.3, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: blinkDelay,
                  }
                : INSTANT
            }
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <g className="fill-surface">
              <circle cx={46} cy={52} r={13} />
              <circle cx={74} cy={52} r={13} />
            </g>
            <motion.g animate={pose.pupils} transition={transition}>
              <g className="fill-foreground">
                <circle cx={47.5} cy={53} r={8.5} />
                <circle cx={72.5} cy={53} r={8.5} />
              </g>
              <g className="fill-surface">
                <circle cx={50.5} cy={49.5} r={3.2} />
                <circle cx={75.5} cy={49.5} r={3.2} />
                <circle cx={45} cy={57} r={1.5} />
                <circle cx={70} cy={57} r={1.5} />
              </g>
            </motion.g>
          </motion.g>
        ) : (
          <g
            data-mascot-eyes="smile"
            className="fill-none stroke-foreground"
            strokeWidth={5}
            strokeLinecap="round"
          >
            <path d="M37 56 Q46 44 55 56" />
            <path d="M65 56 Q74 44 83 56" />
          </g>
        )}
        <path
          d="M54 64 Q60 61 66 64 L61.5 72 Q60 74 58.5 72 Z"
          className="fill-mascot-beak stroke-mascot-beak"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <motion.path
          d={LEFT_WING}
          className="fill-mascot-shade"
          animate={move(pose.leftWing)}
          transition={transition}
          style={{ originX: 0.8, originY: 0 }}
        />
        <motion.path
          d={RIGHT_WING}
          className="fill-mascot-shade"
          animate={move(pose.rightWing)}
          transition={transition}
          style={{ originX: 0.2, originY: 0 }}
        />
      </motion.g>
      {pose.sparkles && (
        <motion.g
          data-mascot-sparkles
          className="fill-mascot-beak"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          {SPARKLES.map((s) => (
            <path key={`${s.x}-${s.y}`} d={sparklePath(s.x, s.y, s.r)} />
          ))}
        </motion.g>
      )}
    </svg>
  );
}
