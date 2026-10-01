"use client";

import { useEffect, useRef } from "react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { STICKER_EARNED_LINE } from "@/mascot/lines";

// The happy jingle, then the owl congratulating the child on the new sticker.
export const STICKER_EARNED_CUE: readonly string[] = [
  JINGLE_ID,
  STICKER_EARNED_LINE.id,
];

// The moment a lesson's sticker is won: confetti from the centre of its
// positioned parent, and the jingle with the owl's congratulation. Plays once
// when it appears. Silent with sound off (no sounds in context) and without
// confetti under reduced motion.
export function StickerEarnedCelebration() {
  const sounds = useFeedbackSoundsContext();
  const reducedMotion = usePrefersReducedMotion();
  const played = useRef(false);
  useEffect(() => {
    if (played.current || !sounds) return;
    played.current = true;
    sounds.play(STICKER_EARNED_CUE);
  }, [sounds]);
  return reducedMotion ? null : <ConfettiBurst />;
}
