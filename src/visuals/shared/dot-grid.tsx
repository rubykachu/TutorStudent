"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ConceptColor } from "@/schema/content";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";

const CELL = 40;
const DOT_RADIUS = CELL / 3;
// Leaves a gap between neighbouring halos so they never merge into a blob.
const HALO_RADIUS = CELL * 0.46;

type DotGridProps = {
  rows: number;
  columns: number;
  // Spoken description of what the grid shows.
  label: string;
  color?: ConceptColor;
  // Cells after this many (row by row) are empty slots; defaults to all filled.
  filled?: number;
  // Cell indices (row by row) to mark with a highlight halo.
  highlighted?: readonly number[];
  className?: string;
};

function center(index: number, columns: number) {
  return {
    cx: (index % columns) * CELL + CELL / 2,
    cy: Math.floor(index / columns) * CELL + CELL / 2,
  };
}

export function DotGrid({
  rows,
  columns,
  label,
  color = "blue",
  filled = rows * columns,
  highlighted = [],
  className = "h-auto w-full max-w-60",
}: DotGridProps) {
  const transition = useVisualTransition();
  const cells = Array.from({ length: rows * columns }, (_, i) => i);
  const highlightedSet = new Set(highlighted);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${columns * CELL} ${rows * CELL}`}
      className={className}
    >
      {cells.map((i) => (
        <motion.circle
          {...decorative}
          key={`halo-${i}`}
          {...center(i, columns)}
          r={HALO_RADIUS}
          className="fill-highlight"
          initial={false}
          animate={{ opacity: highlightedSet.has(i) ? 1 : 0 }}
          transition={transition}
        />
      ))}
      {cells
        .filter((i) => i >= filled)
        .map((i) => (
          <ConceptShape
            key={`slot-${i}`}
            color={color}
            variant="outline"
            {...center(i, columns)}
            r={DOT_RADIUS}
          />
        ))}
      {/* Dots present on first render appear at once; only added ones grow in. */}
      <AnimatePresence initial={false}>
        {cells
          .filter((i) => i < filled)
          .map((i) => (
            <motion.g
              key={`dot-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={transition}
            >
              <ConceptShape
                color={color}
                {...center(i, columns)}
                r={DOT_RADIUS}
              />
            </motion.g>
          ))}
      </AnimatePresence>
    </svg>
  );
}
