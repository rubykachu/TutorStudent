"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";

// A 5 × 5 board: the child taps cells to place or remove dots and tries to
// arrange them into a filled square.
const SIZE = 5;
const CELLS = Array.from({ length: SIZE * SIZE }, (_, i) => i);

function rowOf(cell: number): number {
  return Math.floor(cell / SIZE);
}

function columnOf(cell: number): number {
  return cell % SIZE;
}

// Size of the smallest box around the dots, which is what the square check
// reads; an empty board has a 0 × 0 box.
function stateOf(dots: ReadonlySet<number>): VisualState {
  if (dots.size === 0) return { count: 0, width: 0, height: 0 };
  const rows = [...dots].map(rowOf);
  const columns = [...dots].map(columnOf);
  return {
    count: dots.size,
    width: Math.max(...columns) - Math.min(...columns) + 1,
    height: Math.max(...rows) - Math.min(...rows) + 1,
  };
}

// A shown state carries only counts, so it is drawn as a block in the corner.
function dotsOf(state: VisualState): ReadonlySet<number> {
  const width = state.width ?? 0;
  const height = state.height ?? 0;
  return new Set(
    CELLS.filter((cell) => rowOf(cell) < height && columnOf(cell) < width),
  );
}

export default function DotSquare({
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const [ownDots, setOwnDots] = useState<ReadonlySet<number>>(new Set());
  const dots = shownState ? dotsOf(shownState) : ownDots;
  const locked = disabled || shownState !== undefined;

  function toggle(cell: number) {
    const next = new Set(ownDots);
    if (next.has(cell)) next.delete(cell);
    else next.add(cell);
    setOwnDots(next);
    onStateChange?.(stateOf(next));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Older engines ignore grid display on a fieldset, so the grid is an
          inner div. */}
      <fieldset aria-label="Bảng chấm năm hàng, năm cột">
        <div className="grid grid-cols-5 gap-3">
          {CELLS.map((cell) => {
            const filled = dots.has(cell);
            return (
              <button
                key={cell}
                type="button"
                aria-label={`Hàng ${rowOf(cell) + 1}, cột ${columnOf(cell) + 1}`}
                aria-pressed={filled}
                disabled={locked}
                data-cell={cell}
                onClick={() => toggle(cell)}
                className="inline-flex size-touch items-center justify-center rounded-sm border-2 border-border bg-surface disabled:cursor-default motion-safe:transition-transform motion-safe:active:scale-97"
              >
                {filled ? (
                  <ConceptMark color="blue" className="size-8" />
                ) : (
                  <svg aria-hidden viewBox="0 0 24 24" className="size-8">
                    <ConceptShape
                      color="blue"
                      variant="outline"
                      cx={12}
                      cy={12}
                      r={6}
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>
      <p aria-live="polite" className="text-muted-foreground">
        {`${dots.size} chấm`}
      </p>
    </div>
  );
}
