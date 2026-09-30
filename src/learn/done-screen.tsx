"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BottomBar } from "@/components/bottom-bar";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { MascotExpression } from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";

type DoneScreenProps = {
  // Value of `data-section-step` / `data-review-step` tests and E2E look for.
  stepAttr: { name: "data-section-step" | "data-review-step"; value: string };
  title: string;
  // Drawn above the title; the owl in `owl` mood when left out.
  art?: ReactNode;
  owl?: MascotExpression;
  children?: ReactNode;
  actions: ReactNode;
};

// The closing screen of a section or a review: owl (or sticker), title and a
// few lines centred in the free height, actions in the bottom bar. The
// content settles in with a small spring, or a plain fade under reduced motion.
export function DoneScreen({
  stepAttr,
  title,
  art,
  owl = "happy",
  children,
  actions,
}: DoneScreenProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      className="flex flex-1 flex-col gap-4"
      {...{ [stepAttr.name]: stepAttr.value }}
    >
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-5 py-6 text-center"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={
          reducedMotion
            ? { duration: 0.3 }
            : { type: "spring", stiffness: 260, damping: 16 }
        }
      >
        {art ?? (
          // Home size, a little larger where a tall tablet leaves room.
          <Owl expression={owl} size="home" className="tall:size-36" />
        )}
        <h1 className="text-title font-bold md:text-title-lg">{title}</h1>
        {children}
      </motion.div>
      <BottomBar>{actions}</BottomBar>
    </div>
  );
}
