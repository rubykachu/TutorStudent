"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";

// Hints are drawn in the colour of the concept they point at, and in this
// neutral concept colour when they name none. They are never painted with the
// highlight fill (`--color-highlight`), which means "currently selected".
export const HINT_FALLBACK_COLOR: ConceptColor = "slate";

type HighlightProps = {
  active: boolean;
  // Colour of the ring drawn around the content.
  color?: ConceptColor;
  // The second hint level, when there is no hint visual, marks the same parts
  // more boldly instead: a thicker ring with a dark outline.
  strong?: boolean;
  children: ReactNode;
  className?: string;
};

// Marks any element without changing its layout: the ring sits behind the
// content, so turning it on never moves anything.
export function Highlight({
  active,
  color = HINT_FALLBACK_COLOR,
  strong = false,
  children,
  className = "",
}: HighlightProps) {
  const transition = useVisualTransition();
  const { border } = CONCEPT_CLASSES[color];
  const paint = strong
    ? `-inset-2 border-4 ${border} outline-2 outline-foreground`
    : `-inset-1 border-3 ${border}`;
  return (
    <span
      className={`relative isolate inline-flex ${className}`}
      data-highlighted={active || undefined}
      data-highlight-strong={(active && strong) || undefined}
    >
      <motion.span
        {...decorative}
        aria-hidden
        // Paints a little past its content on purpose; layout checks skip it.
        data-halo
        className={`pointer-events-none absolute -z-10 rounded-sm ${paint}`}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
        transition={transition}
      />
      {children}
    </span>
  );
}
