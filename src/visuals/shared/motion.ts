import type { Transition } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Block/scene transition from the design system (spring 300 / 30).
export const STEP_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Reduced motion jumps straight to the end state: no movement, no bounce.
export function useVisualTransition(): Transition {
  return usePrefersReducedMotion() ? { duration: 0 } : STEP_SPRING;
}
