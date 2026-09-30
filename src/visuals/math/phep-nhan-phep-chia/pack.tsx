"use client";

import { useMemo } from "react";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { Mode } from "./catalog";
import {
  DIVIDEND_COLOR,
  DIVISOR_COLOR,
  QUOTIENT_COLOR,
  REMAINDER_COLOR,
  Sentence,
  Term,
} from "./chia-parts";
import { fitGrid, gridPoints } from "./dot-layout";
import {
  capitalize,
  type PackGoal,
  type PackStep,
  packResult,
  packSteps,
} from "./pack-logic";

const WIDTH = 320;
const PAD = 4;
const FONT = 16;
const LABEL_H = 26;
const DOTS_H = 40;
const BOX_H = LABEL_H + DOTS_H + 8;
const BOX_GAP = 8;
const LABEL_CHAR_W = 9.6;
// Room a label needs besides its letters: padding, and the leftover's mark.
const LABEL_EXTRA_W = 34;
// Fewest columns at which a box still reads as a box.
const SHORT_LABEL_COLS = 3;
const MAX_COLS = 5;
// Above this many items per group a box shows only its count.
const MAX_DRAWN_PER_GROUP = 60;
const MAX_DOT_PITCH = 12;

type PackWords = { groupWord: string; itemWord: string };

type PackSpec = PackWords & { total: number; per: number; goal: PackGoal };

function Equation({ spec, shown }: { spec: PackSpec; shown: boolean }) {
  const { full, remainder } = packResult(spec.total, spec.per, spec.goal);
  const row = (q: number | undefined, r: number | undefined) => (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-heading text-body-lg font-bold md:text-title">
      <Term color={DIVIDEND_COLOR} value={spec.total} />
      <span>=</span>
      <Term color={DIVISOR_COLOR} value={spec.per} />
      <span>·</span>
      <Term color={QUOTIENT_COLOR} value={q} />
      <span>+</span>
      <Term color={REMAINDER_COLOR} value={r} />
    </p>
  );
  return (
    <Reveal shown={shown} placeholder={row(undefined, undefined)}>
      {row(full, remainder)}
    </Reveal>
  );
}

type PictureProps = PackSpec & { step: PackStep };

// Boxes of `per` items filled one after the other; the leftover, too few for
// a box, sits apart in a dashed pink one.
function PackPicture({
  total,
  per,
  goal,
  groupWord,
  itemWord,
  step,
}: PictureProps) {
  const { full, remainder } = packResult(total, per, goal);
  const cells = full + (remainder > 0 ? 1 : 0);
  const widestLabel = `${capitalize(groupWord)} ${cells}`.length;
  const cols = Math.max(
    Math.min(cells, SHORT_LABEL_COLS),
    Math.min(
      cells,
      MAX_COLS,
      Math.floor(
        WIDTH / (widestLabel * LABEL_CHAR_W + LABEL_EXTRA_W + BOX_GAP),
      ),
    ),
  );
  const rows = Math.ceil(cells / cols);
  const boxW = (WIDTH - 2 * PAD) / cols - BOX_GAP;
  // A label that does not fit its box shrinks to the group's number.
  const shortLabels = widestLabel * LABEL_CHAR_W + LABEL_EXTRA_W > boxW;
  const groupLabel = (n: number) =>
    shortLabels ? String(n) : `${capitalize(groupWord)} ${n}`;
  const height = rows * (BOX_H + BOX_GAP) + PAD;
  const itemsLeft = (items: number) => items <= MAX_DRAWN_PER_GROUP;

  const dotsIn = (count: number, cx: number, cy: number) => {
    const grid = fitGrid(count, boxW - 16, DOTS_H, MAX_DOT_PITCH);
    return {
      grid,
      points: gridPoints(count, cx, cy, grid),
      radius: Math.min(5, grid.pitch * 0.4),
    };
  };

  const decidedUp = step.decided && goal === "up";
  const words = `${groupWord}`;
  return (
    <svg
      role="img"
      aria-label={`${step.filled} ${words} đã đủ ${per} ${itemWord}${step.leftover && remainder > 0 ? `, còn ${remainder} ${itemWord} đặt riêng` : ""}`}
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: WIDTH * Math.max(0.95, Math.min(1.25, 200 / height)) }}
    >
      {Array.from({ length: cells }, (_, index) => {
        const isLeftover = index === full;
        const row = Math.floor(index / cols);
        const inRow = Math.min(cols, cells - row * cols);
        const col = index % cols;
        const x =
          PAD +
          (WIDTH - 2 * PAD - inRow * (boxW + BOX_GAP)) / 2 +
          col * (boxW + BOX_GAP) +
          BOX_GAP / 2;
        const y = PAD + row * (BOX_H + BOX_GAP);
        const cx = x + boxW / 2;
        const cy = y + LABEL_H + DOTS_H / 2 + 2;

        if (isLeftover) {
          if (!step.leftover) return null;
          const { points, radius } = dotsIn(remainder, cx, cy);
          const label = decidedUp ? groupLabel(cells) : "Dư";
          return (
            <g key="leftover">
              <rect
                {...decorative}
                x={x}
                y={y}
                width={boxW}
                height={BOX_H}
                rx={10}
                className="fill-none stroke-concept-pink"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <ConceptShape
                {...decorative}
                color="pink"
                cx={x + 14}
                cy={y + LABEL_H / 2 + 2}
                r={8}
              />
              <text
                x={x + 28}
                y={y + LABEL_H / 2 + 2}
                dominantBaseline="central"
                fontSize={FONT}
                fontWeight={600}
                className="fill-foreground"
              >
                {label}
              </text>
              {points.map((p) => (
                <ConceptShape
                  key={`${p.x}-${p.y}`}
                  color="pink"
                  cx={p.x}
                  cy={p.y}
                  r={radius + 1}
                />
              ))}
            </g>
          );
        }

        const filled = index < step.filled;
        const { points, radius } = dotsIn(per, cx, cy);
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: boxes never reorder
          <g key={index}>
            <rect
              {...decorative}
              x={x}
              y={y}
              width={boxW}
              height={BOX_H}
              rx={10}
              className={
                filled
                  ? "fill-muted stroke-muted-foreground"
                  : "fill-none stroke-border"
              }
              strokeWidth={2}
              strokeDasharray={filled ? undefined : "5 4"}
            />
            <text
              x={x + 10}
              y={y + LABEL_H / 2 + 2}
              dominantBaseline="central"
              fontSize={FONT}
              fontWeight={600}
              className={filled ? "fill-foreground" : "fill-muted-foreground"}
              opacity={filled ? 1 : 0.6}
            >
              {groupLabel(index + 1)}
            </text>
            {filled &&
              (itemsLeft(per) ? (
                points.map((p) => (
                  <circle
                    key={`${p.x}-${p.y}`}
                    cx={p.x}
                    cy={p.y}
                    r={radius}
                    className="fill-concept-blue"
                  />
                ))
              ) : (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={FONT + 2}
                  fontWeight={700}
                  className="fill-concept-blue"
                >
                  {per}
                </text>
              ))}
          </g>
        );
      })}
    </svg>
  );
}

type PackProps = PackSpec & { mode: Mode };

// `total` items packed into groups of `per`, group after group, then the
// leftover and the decision whether it needs a group of its own.
export default function Pack({
  total,
  per,
  goal,
  mode,
  groupWord,
  itemWord,
}: PackProps) {
  const spec = useMemo<PackSpec>(
    () => ({ total, per, goal, groupWord, itemWord }),
    [total, per, goal, groupWord, itemWord],
  );
  const steps = useMemo(
    () => packSteps(total, per, goal, mode, { groupWord, itemWord }),
    [total, per, goal, mode, groupWord, itemWord],
  );
  const name = `Xếp ${total} ${itemWord} vào các ${groupWord}, mỗi ${groupWord} ${per} ${itemWord}`;

  const draw = (index: number) => {
    const step = steps[index] ?? steps[steps.length - 1];
    if (!step) return null;
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <PackPicture {...spec} step={step} />
        <Sentence>{step.caption}</Sentence>
        <Equation spec={spec} shown={step.equation} />
      </div>
    );
  };

  if (mode === "still") {
    return <div className="flex w-full justify-center">{draw(0)}</div>;
  }
  return (
    <StepPlayer steps={steps.length} label={name}>
      {draw}
    </StepPlayer>
  );
}
