"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useVisualTransition } from "./motion";

// Opacity of a row that is still to come, dim enough to read as "not yet".
const PENDING_OPACITY = 0.35;

// Rows still to come keep their space, so later steps of an explainer never
// push the earlier rows around. With a `placeholder` (the row with "?" where
// its result will be) the row shows dimmed, so the child sees what is coming
// instead of a blank gap; without one it is hidden, from screen readers too.
export function Reveal({
  shown,
  children,
  placeholder,
  className = "",
}: {
  shown: boolean;
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
}) {
  const transition = useVisualTransition();
  const pending = !shown && placeholder !== undefined;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : pending ? PENDING_OPACITY : 0 }}
      transition={transition}
      aria-hidden={pending || undefined}
      className={`${shown || pending ? "" : "invisible"} ${className}`}
    >
      {pending ? placeholder : children}
    </motion.div>
  );
}
