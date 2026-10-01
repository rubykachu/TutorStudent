"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Resting height of each bar (share of full height) and how long its cycle
// takes; different lengths keep the bars out of step like a real equalizer.
const BARS = [
  { rest: 0.5, duration: 0.7 },
  { rest: 0.9, duration: 0.55 },
  { rest: 0.35, duration: 0.85 },
] as const;

// Equalizer bars beside a song that is playing. They dance (scaleY only, so
// nothing reflows) while mounted and stand at fixed heights under reduced
// motion. Decoration: the song's pressed state already tells a screen reader
// it is playing.
export function PlayingBars() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <span
      aria-hidden
      data-playing-bars={reducedMotion ? "static" : "dancing"}
      className="flex h-6 shrink-0 items-end gap-1"
    >
      {BARS.map((bar, i) => (
        <motion.span
          // The bars never reorder.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className="h-full w-1.5 origin-bottom rounded-full bg-concept-violet"
          style={{ scaleY: bar.rest }}
          animate={
            reducedMotion
              ? undefined
              : { scaleY: [bar.rest, 1, 0.25, 0.8, bar.rest] }
          }
          transition={{
            duration: bar.duration * 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </span>
  );
}
