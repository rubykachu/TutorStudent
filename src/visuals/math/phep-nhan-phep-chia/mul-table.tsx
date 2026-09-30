"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import type { SpecOf } from "./catalog";
import { fmt, TIMES } from "./logic-nhan";
import { Legend } from "./parts-nhan";

// Width of the drawing; rows and columns share it, so a 9 x 9 table is about
// 40 units a cell and its 19-unit numbers stay above 16px on a phone.
const WIDTH = 400;
const MAX_CELL_HEIGHT = 64;
const GAP_TAP = 5;
const GAP_STATIC = 0.5;
const MARK_RADIUS = 5;

type TableSpec = { from: number; to: number };
type Mark = SpecOf<"mulTable">["mark"];

function inMark(mark: Mark | undefined, row: number, col: number): boolean {
  if (mark === undefined) return false;
  if (mark === "hard") return row >= 6 && col >= 6;
  return row === mark.row;
}

// Headers that carry the shape that goes with the violet band: a marked row
// only has its left header, the hard block has both.
function markedHeader(
  mark: Mark | undefined,
  n: number,
  side: "row" | "column",
): boolean {
  if (mark === undefined) return false;
  if (mark === "hard") return n >= 6;
  return side === "row" && n === mark.row;
}

// A table of products: header row and column of factors, one cell per pair.
// `tap` turns every product cell into a tappable region.
function Table({
  spec,
  mark,
  tap,
}: {
  spec: TableSpec;
  mark?: Mark;
  tap: boolean;
}) {
  const factors = Array.from(
    { length: spec.to - spec.from + 1 },
    (_, i) => spec.from + i,
  );
  const count = factors.length;
  const cellW = WIDTH / (count + 1);
  const cellH = Math.min(cellW, MAX_CELL_HEIGHT);
  const height = cellH * (count + 1);
  // A tappable cell names its pair ("6 · 7"), not the product the child is
  // looking for.
  const fontSize = tap ? 20 : count >= 8 ? 20 : 26;
  const gap = tap ? GAP_TAP : GAP_STATIC;
  const label = tap
    ? `Bảng nhân từ ${spec.from} đến ${spec.to}, chạm vào ô phép nhân`
    : `Bảng nhân từ ${spec.from} đến ${spec.to}`;

  function box(row: number, col: number) {
    return {
      x: col * cellW + gap,
      y: row * cellH + gap,
      width: cellW - 2 * gap,
      height: cellH - 2 * gap,
      rx: 4,
    };
  }

  const text = (row: number, col: number, content: string, cls: string) => (
    <text
      x={col * cellW + cellW / 2}
      y={row * cellH + cellH / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      className={`font-heading font-bold stroke-none ${cls}`}
    >
      {content}
    </text>
  );

  return (
    <RegionSvg
      label={label}
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full max-w-[22rem]"
    >
      {factors.map((n, i) => (
        <g key={`top-${n}`}>
          <rect {...decorative} {...box(0, i + 1)} className="fill-muted" />
          {text(0, i + 1, String(n), CONCEPT_CLASSES.blue.fill)}
          {markedHeader(mark, n, "column") && (
            <ConceptShape
              {...decorative}
              color="violet"
              cx={(i + 1) * cellW + MARK_RADIUS + 1}
              cy={MARK_RADIUS + 1}
              r={MARK_RADIUS}
            />
          )}
        </g>
      ))}
      {factors.map((n, i) => (
        <g key={`left-${n}`}>
          <rect {...decorative} {...box(i + 1, 0)} className="fill-muted" />
          {text(i + 1, 0, String(n), CONCEPT_CLASSES.blue.fill)}
          {markedHeader(mark, n, "row") && (
            <ConceptShape
              {...decorative}
              color="violet"
              cx={MARK_RADIUS + 1}
              cy={(i + 1) * cellH + MARK_RADIUS + 1}
              r={MARK_RADIUS}
            />
          )}
        </g>
      ))}
      {factors.flatMap((row, r) =>
        factors.map((col, c) => {
          const marked = inMark(mark, row, col);
          const fill = marked
            ? "fill-concept-violet/20"
            : tap
              ? "fill-muted"
              : "fill-surface";
          const cell = (
            <>
              <rect
                {...decorative}
                {...box(r + 1, c + 1)}
                className={`${fill} ${tap ? "" : "stroke-border"}`}
                strokeWidth={tap ? undefined : 1}
              />
              {text(
                r + 1,
                c + 1,
                tap ? `${row} ${TIMES} ${col}` : fmt(row * col),
                "fill-foreground",
              )}
            </>
          );
          return tap ? (
            <Region
              key={`r${row}c${col}`}
              id={`r${row}c${col}`}
              label={`${row} nhân ${col}`}
            >
              {cell}
            </Region>
          ) : (
            <g key={`r${row}c${col}`}>{cell}</g>
          );
        }),
      )}
    </RegionSvg>
  );
}

function markCaption(mark: Mark): string {
  return mark === "hard"
    ? "Phần khó: hai thừa số từ 6 đến 9"
    : `Hàng ${mark.row}: mỗi ô hơn ô trước ${mark.row}`;
}

export function MulTable({ spec }: { spec: SpecOf<"mulTable"> }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Table spec={spec} mark={spec.mark} tap={false} />
      <Legend
        items={[
          { color: "blue", name: "Thừa số" },
          { color: "violet", name: markCaption(spec.mark) },
        ]}
      />
    </div>
  );
}

export function MulTableTap({ spec }: { spec: SpecOf<"mulTableTap"> }) {
  return (
    <div className="flex w-full justify-center">
      <Table spec={spec} tap />
    </div>
  );
}
