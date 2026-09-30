"use client";

import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { formatInteger } from "@/lib/number-format";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { decorative, stateStep, stateStepper } from "@/visuals/shared/markers";
import {
  BOARD_SIZE,
  boardState,
  factorsOn,
  grainsOn,
  SQUARE_COUNT,
} from "./grains";
import { FactorCount, FactorRow, MATH_LINE } from "./parts";

const CELL = 20;
const BOARD = BOARD_SIZE * CELL;
const ZOOM = 160;
const ZOOM_INNER = 136;
// Up to square 7 (64 grains) every grain is drawn; later squares show a heap.
const LAST_DRAWN_SQUARE = 7;
// A grain count this long no longer fits one line at the title size.
const LONG_NUMBER_CHARS = 9;
// Rows of the heap drawn for squares with too many grains to draw one by one.
const HEAP_ROWS = [1, 3, 5, 7, 9];
const MAX_GRAIN_CELL = 40;

type Grain = { x: number; y: number; size: number };

// Grains of a square laid out in a near-square block: 1, 2×1, 2×2, 4×2 …
function grainGrid(count: number): Grain[] {
  const columns = 2 ** Math.ceil(Math.log2(count) / 2);
  const rows = count / columns;
  const size = Math.min(MAX_GRAIN_CELL, ZOOM_INNER / Math.max(columns, rows));
  const left = (ZOOM - columns * size) / 2;
  const top = (ZOOM - rows * size) / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: left + (i % columns) * size + size / 2,
    y: top + Math.floor(i / columns) * size + size / 2,
    size,
  }));
}

function grainHeap(): Grain[] {
  const size = ZOOM_INNER / Math.max(...HEAP_ROWS);
  const top = ZOOM - (ZOOM - ZOOM_INNER) / 2 - HEAP_ROWS.length * size;
  return HEAP_ROWS.flatMap((width, row) => {
    const left = (ZOOM - width * size) / 2;
    return Array.from({ length: width }, (_, i) => ({
      x: left + i * size + size / 2,
      y: top + row * size + size / 2,
      size,
    }));
  });
}

function GrainShape({ x, y, size }: Grain) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={size * 0.36}
      ry={size * 0.22}
      transform={`rotate(-30 ${x} ${y})`}
      className="fill-concept-amber"
    />
  );
}

export function Board({ square }: { square: number }) {
  const cells = Array.from({ length: SQUARE_COUNT }, (_, i) => i);
  const current = square - 1;
  return (
    <svg
      role="img"
      aria-label={`Bàn cờ 64 ô, đang xem ô thứ ${square}`}
      viewBox={`-2 -2 ${BOARD + 4} ${BOARD + 4}`}
      className="h-auto w-36 md:w-52"
    >
      {cells.map((i) => {
        const row = Math.floor(i / BOARD_SIZE);
        const column = i % BOARD_SIZE;
        const dark = (row + column) % 2 === 1;
        return (
          <g key={i} {...decorative}>
            <rect
              x={column * CELL}
              y={row * CELL}
              width={CELL}
              height={CELL}
              className={dark ? "fill-muted-foreground/30" : "fill-muted"}
            />
            {i < current && (
              <circle
                cx={column * CELL + CELL / 2}
                cy={row * CELL + CELL / 2}
                r={3}
                className="fill-concept-amber"
              />
            )}
          </g>
        );
      })}
      <rect
        {...decorative}
        x={(current % BOARD_SIZE) * CELL}
        y={Math.floor(current / BOARD_SIZE) * CELL}
        width={CELL}
        height={CELL}
        rx={2}
        className="fill-highlight stroke-foreground"
        strokeWidth={2.5}
      />
    </svg>
  );
}

function Zoom({ square }: { square: number }) {
  const drawn = square <= LAST_DRAWN_SQUARE;
  const grains = drawn ? grainGrid(Number(grainsOn(square))) : grainHeap();
  return (
    <svg
      role="img"
      aria-label={
        drawn
          ? `Ô thứ ${square} phóng to, có ${grainsOn(square)} hạt thóc`
          : `Ô thứ ${square} phóng to, một đống thóc rất lớn`
      }
      viewBox={`0 0 ${ZOOM} ${ZOOM}`}
      className="h-auto w-36 md:w-52"
    >
      <rect
        {...decorative}
        x={1.5}
        y={1.5}
        width={ZOOM - 3}
        height={ZOOM - 3}
        rx={12}
        className="fill-highlight/40 stroke-foreground"
        strokeWidth={2.5}
      />
      {grains.map((grain, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: grains are laid out by position
        <GrainShape key={i} {...grain} />
      ))}
    </svg>
  );
}

// The opening story of the lesson: the child walks the chessboard square by
// square and sees the grains double, together with the product of 2s that
// counts them.
export default function BanCo({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [ownSquare, setOwnSquare] = useState(1);
  const square = shownState?.square ?? ownSquare;
  const locked = disabled || shownState !== undefined;
  const factors = factorsOn(square);
  const grains = formatInteger(grainsOn(square));

  function go(next: number) {
    setOwnSquare(next);
    onStateChange?.(boardState(next));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="font-heading text-block font-semibold md:text-block-lg">
        {`Ô thứ ${square}`}
      </p>
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <Board square={square} />
        <Zoom square={square} />
      </div>
      <div className="flex flex-col items-center gap-1" aria-live="polite">
        <p className={MATH_LINE}>
          {factors >= 2 && <FactorRow base={2} count={factors} />}
          {/* "=" stays with the number when the line wraps. */}
          <span
            className={`whitespace-nowrap ${grains.length > LONG_NUMBER_CHARS ? "text-block md:text-title" : ""}`}
          >
            {factors >= 2 ? `= ${grains} hạt` : `${grains} hạt`}
          </span>
        </p>
        {/* Square n holds n − 1 factors 2: the first square has none. */}
        {square >= 2 && (
          <FactorCount count={factors} working={`${square} − 1 =`} />
        )}
      </div>
      <div
        className="flex flex-wrap justify-center gap-2 md:gap-3"
        {...stateStepper("square", square)}
      >
        {/* Icon only, so all three buttons fit one row on a phone. */}
        <button
          type="button"
          className={`${ACTION_BUTTON} w-touch px-0`}
          aria-label="Ô trước"
          {...stateStep("square", "down")}
          disabled={locked || square === 1}
          onClick={() => go(square - 1)}
        >
          <ChevronLeft aria-hidden className="size-6" />
        </button>
        <button
          type="button"
          className={ACTION_BUTTON}
          disabled={locked || square === SQUARE_COUNT}
          onClick={() => go(square + 1)}
          {...stateStep("square", "up")}
        >
          Ô sau
          <ChevronRight aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          className={ACTION_BUTTON}
          disabled={locked || square === SQUARE_COUNT}
          onClick={() => go(SQUARE_COUNT)}
        >
          Ô cuối
          <ChevronsRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
