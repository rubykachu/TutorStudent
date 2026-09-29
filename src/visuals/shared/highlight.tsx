"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";

export type HighlightColor = ConceptColor | "highlight";

type HighlightProps = {
  active: boolean;
  // A concept colour draws a ring; "highlight" fills the background, as the
  // first hint level does.
  color?: HighlightColor;
  children: ReactNode;
  className?: string;
};

// Marks any element without changing its layout: the ring sits behind the
// content, so turning it on never moves anything.
export function Highlight({
  active,
  color = "highlight",
  children,
  className = "",
}: HighlightProps) {
  const transition = useVisualTransition();
  const paint =
    color === "highlight"
      ? "bg-highlight"
      : `border-3 ${CONCEPT_CLASSES[color].border}`;
  return (
    <span
      className={`relative isolate inline-flex ${className}`}
      data-highlighted={active || undefined}
    >
      <motion.span
        {...decorative}
        aria-hidden
        className={`pointer-events-none absolute -inset-1 -z-10 rounded-sm ${paint}`}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
        transition={transition}
      />
      {children}
    </span>
  );
}
