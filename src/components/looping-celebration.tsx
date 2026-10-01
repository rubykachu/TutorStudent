"use client";

import {
  motion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { hashSeed } from "@/exercises/shuffle";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// The gap between two celebration beats: gentle, varied, never a strobe.
const BEAT_MIN_MS = 2500;
const BEAT_SPREAD_MS = 1500;

// How long the beat after `beat` waits, in [2.5 s, 4 s). Derived from the beat
// number so a run is the same on every render and in tests.
export function beatDelayMs(beat: number): number {
  return BEAT_MIN_MS + (hashSeed(`beat:${beat}`) % BEAT_SPREAD_MS);
}

// The number of the current celebration beat: 0 as the screen opens, then one
// more every few seconds while the caller is mounted. Stays at 0, with no
// timer at all, under reduced motion. Beats only drive visuals; sounds belong
// to the caller and play once.
export function useCelebrationBeat(): number {
  const reducedMotion = usePrefersReducedMotion();
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setBeat(beat + 1), beatDelayMs(beat));
    return () => clearTimeout(timer);
  }, [beat, reducedMotion]);
  return beat;
}

// Confetti that bursts as the screen opens and again at every beat while it is
// mounted, each time from a slightly different spot in other colours. One
// burst at a time (a new one replaces the last, which has long finished), so
// the particle count stays capped. Nothing under reduced motion.
export function LoopingConfetti() {
  const reducedMotion = usePrefersReducedMotion();
  const beat = useCelebrationBeat();
  if (reducedMotion) return null;
  return <ConfettiBurst key={beat} variant={beat} />;
}

type LoopKind = "bounce" | "float";

const LOOPS: Record<
  LoopKind,
  { animate: TargetAndTransition; transition: Transition }
> = {
  // A small hop with a squash, for a sticker: rests between hops.
  bounce: {
    animate: { y: [0, -10, 0, -4, 0], scale: [1, 1.04, 1, 1.015, 1] },
    transition: {
      duration: 1.4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1.2,
    },
  },
  // A slow rock, for a picture that should look alive rather than jump.
  float: {
    animate: { rotate: [-2, 2, -2], y: [0, -4, 0] },
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },
};

// Wraps its child in a gentle endless loop (transform only) for as long as it
// is mounted. Under reduced motion the child stays still.
export function LoopingMotion({
  kind = "bounce",
  className,
  children,
}: {
  kind?: LoopKind;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  const loop = LOOPS[kind];
  return (
    <motion.div
      data-looping={kind}
      className={className}
      animate={loop.animate}
      transition={loop.transition}
    >
      {children}
    </motion.div>
  );
}
