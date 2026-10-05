"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type SpeechBubbleProps = {
  text: string;
  className?: string;
  // The side the owl sits on, where the tail points.
  owlSide?: "left" | "right";
};

// One short line the owl says, in a calm bubble whose tail points at the owl
// beside it (on its right unless `owlSide` says otherwise). The same text is announced by the page's live region, so
// the bubble itself is hidden from screen readers; it never takes a tap.
// A new line fades in once (keyed by its text); under reduced motion it just
// appears.
export function SpeechBubble({
  text,
  className = "",
  owlSide = "right",
}: SpeechBubbleProps) {
  const reducedMotion = usePrefersReducedMotion();
  const left = owlSide === "left";
  return (
    <motion.p
      key={text}
      aria-hidden
      data-mascot-speech
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
      style={{ originX: left ? 0 : 1, originY: 1 }}
      className={`pointer-events-none relative w-fit max-w-full rounded-lg border-2 border-mascot-shade bg-surface px-4 py-2 font-semibold text-body text-foreground shadow-card md:text-body-lg ${className}`}
    >
      {text}
      {/* Tail: a small square turned 45°, sharing the bubble's border on its
        two outer sides so it reads as part of the bubble. */}
      <span
        className={`absolute bottom-3 size-3 rotate-45 bg-surface border-mascot-shade ${
          left
            ? "-left-[7px] border-b-2 border-l-2"
            : "-right-[7px] border-t-2 border-r-2"
        }`}
      />
    </motion.p>
  );
}
