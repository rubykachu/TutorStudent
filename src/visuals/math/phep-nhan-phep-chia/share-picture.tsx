"use client";

import { motion } from "motion/react";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { fitGrid, gridPoints, plateColumns, rowPoints } from "./dot-layout";

const WIDTH = 320;
const PAD = 4;
const FONT = 18;
const POOL_PITCH = 19;
const POOL_COLS = 16;
const POOL_DOT = 6.5;
const POOL_LABEL_H = 28;
const MAX_PLATE_DIAMETER = 76;
const PLATE_GAP = 8;
const COUNT_H = 32;
// Dots drawn in one pile at most; the label still says the real count.
const MAX_POOL_DOTS = 32;
const MAX_DOT_PITCH = 14;

export type SharePictureProps = {
  people: number;
  // Items on every plate.
  perPlate: number;
  // Items still to deal (blue) or, when `apart`, the remainder set aside
  // (pink, tagged "Dư").
  pool: number;
  apart: boolean;
  // Most items the pool may ever show, so its height never changes.
  poolCapacity: number;
  label: string;
};

function Dot({ x, y, r }: { x: number; y: number; r: number }) {
  const transition = useVisualTransition();
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      className="fill-concept-blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    />
  );
}

// Plates in one or two rows with the items each holds and its count beneath,
// above them the pool of items still to deal.
export function SharePicture({
  people,
  perPlate,
  pool,
  apart,
  poolCapacity,
  label,
}: SharePictureProps) {
  const cols = plateColumns(people);
  const cellW = WIDTH / cols;
  const diameter = Math.min(MAX_PLATE_DIAMETER, cellW - PLATE_GAP);
  const radius = diameter / 2;
  const plateRows = Math.ceil(people / cols);
  const poolRows = Math.max(
    1,
    Math.ceil(Math.min(poolCapacity, MAX_POOL_DOTS) / POOL_COLS),
  );
  const poolH = POOL_LABEL_H + poolRows * POOL_PITCH + 14;
  const rowH = diameter + COUNT_H;
  const height = poolH + plateRows * rowH + PAD;

  const poolDots = rowPoints(
    Math.min(pool, MAX_POOL_DOTS),
    PAD + 4,
    POOL_LABEL_H,
    POOL_COLS,
    POOL_PITCH,
  );
  const grid = fitGrid(perPlate, radius * 1.5, radius * 1.5, MAX_DOT_PITCH);
  const dotRadius = Math.min(6, grid.pitch * 0.4);
  const poolWord = apart ? "Dư" : "Còn";
  const pileRows = Math.ceil(poolDots.length / POOL_COLS);
  const pileCols = Math.min(poolDots.length, POOL_COLS);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: WIDTH * Math.max(0.95, Math.min(1.25, 200 / height)) }}
    >
      <ConceptShape
        {...decorative}
        color={apart ? "pink" : "blue"}
        cx={PAD + 10}
        cy={14}
        r={9}
      />
      <text
        x={PAD + 26}
        y={14}
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={600}
        className="fill-foreground"
      >
        {`${poolWord} ${pool} cái`}
      </text>
      {apart && pool > 0 && (
        <rect
          {...decorative}
          x={PAD}
          y={POOL_LABEL_H - 3}
          width={pileCols * POOL_PITCH + 10}
          height={pileRows * POOL_PITCH + 6}
          rx={10}
          className="fill-none stroke-concept-pink"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
      )}
      {poolDots.map((p, i) =>
        apart ? (
          <ConceptShape
            key={`pool-${p.x}-${p.y}`}
            color="pink"
            cx={p.x}
            cy={p.y + 3}
            r={POOL_DOT + 1}
          />
        ) : (
          <circle
            // biome-ignore lint/suspicious/noArrayIndexKey: dots are interchangeable
            key={i}
            cx={p.x}
            cy={p.y + 3}
            r={POOL_DOT}
            className="fill-concept-blue"
          />
        ),
      )}
      {Array.from({ length: people }, (_, plate) => {
        const row = Math.floor(plate / cols);
        const inRow = Math.min(cols, people - row * cols);
        const col = plate % cols;
        const cx = (WIDTH - inRow * cellW) / 2 + (col + 0.5) * cellW;
        const cy = poolH + row * rowH + radius;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: plates never reorder
          <g key={plate}>
            <circle
              {...decorative}
              cx={cx}
              cy={cy}
              r={radius}
              className="fill-muted stroke-muted-foreground"
              strokeWidth={2}
            />
            {gridPoints(perPlate, cx, cy, grid).map((p, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: dots are interchangeable
              <Dot key={i} x={p.x} y={p.y} r={dotRadius} />
            ))}
            {perPlate > 0 && (
              <text
                x={cx}
                y={cy + radius + 15}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={FONT}
                fontWeight={700}
                className="fill-foreground"
              >
                {perPlate}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
