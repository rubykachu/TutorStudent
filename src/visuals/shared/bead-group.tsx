"use client";

import { motion } from "motion/react";
import type { ConceptColor } from "@/schema/content";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";

const BEAD = 44;
const BEAD_RADIUS = 18;
const GROUP_GAP = 36;
const PADDING = 4;
const BAR_HEIGHT = 5;
const BAR_OFFSET = 8;

export type BeadGroupSpec = {
  color: ConceptColor;
  count: number;
  // Short label drawn on every bead of the group, e.g. the factor "2".
  text?: string;
};

type BeadGroupProps = {
  groups: readonly BeadGroupSpec[];
  // When true the groups slide together into one row, e.g. 2³ · 2² → 2⁵.
  merged: boolean;
  label: string;
  className?: string;
};

type Span = { from: number; to: number };

function barRect({ from, to }: Span, y: number) {
  return {
    x: from + BEAD / 2 - BEAD_RADIUS,
    y,
    width: to - from - BEAD + 2 * BEAD_RADIUS,
    height: BAR_HEIGHT,
    rx: BAR_HEIGHT / 2,
  };
}

export function BeadGroup({
  groups,
  merged,
  label,
  className = "h-auto w-full max-w-md",
}: BeadGroupProps) {
  const transition = useVisualTransition();
  const beads = groups.flatMap((group, groupIndex) =>
    Array.from({ length: group.count }, () => ({ ...group, groupIndex })),
  );
  const width = beads.length * BEAD + (groups.length - 1) * GROUP_GAP;
  const viewWidth = width + 2 * PADDING;
  const barY = PADDING + BEAD + BAR_OFFSET;
  const viewHeight = barY + BAR_HEIGHT + PADDING;
  const mergedStart = (viewWidth - beads.length * BEAD) / 2;

  // Beads are drawn at their merged position and shifted apart while split,
  // so merging animates only a transform.
  const mergedX = (k: number) => mergedStart + k * BEAD;
  const splitX = (k: number, groupIndex: number) =>
    PADDING + k * BEAD + groupIndex * GROUP_GAP;

  const groupSpans: Span[] = [];
  let first = 0;
  groups.forEach((group, groupIndex) => {
    groupSpans.push({
      from: splitX(first, groupIndex),
      to: splitX(first + group.count, groupIndex),
    });
    first += group.count;
  });
  const mergedSpan = { from: mergedX(0), to: mergedX(beads.length) };

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className={className}
    >
      {beads.map((bead, k) => (
        <motion.g
          // biome-ignore lint/suspicious/noArrayIndexKey: beads never reorder, position is the identity
          key={k}
          data-bead=""
          initial={false}
          animate={{ x: merged ? 0 : splitX(k, bead.groupIndex) - mergedX(k) }}
          transition={transition}
        >
          <ConceptShape
            {...(bead.text ? decorative : {})}
            color={bead.color}
            cx={mergedX(k) + BEAD / 2}
            cy={PADDING + BEAD / 2}
            r={BEAD_RADIUS}
          />
          {bead.text && (
            <text
              x={mergedX(k) + BEAD / 2}
              y={PADDING + BEAD / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={18}
              className="fill-primary-foreground font-heading font-bold"
            >
              {bead.text}
            </text>
          )}
        </motion.g>
      ))}
      {groupSpans.map((span, groupIndex) => (
        <motion.rect
          // biome-ignore lint/suspicious/noArrayIndexKey: groups never reorder
          key={groupIndex}
          data-group-bar=""
          {...barRect(span, barY)}
          className="fill-muted-foreground"
          initial={false}
          animate={{ opacity: merged ? 0 : 1 }}
          transition={transition}
        />
      ))}
      <motion.rect
        data-group-bar="merged"
        {...barRect(mergedSpan, barY)}
        className="fill-muted-foreground"
        initial={false}
        animate={{ opacity: merged ? 1 : 0 }}
        transition={transition}
      />
    </svg>
  );
}
