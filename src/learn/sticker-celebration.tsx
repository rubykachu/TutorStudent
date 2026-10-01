"use client";

import { LoopingConfetti } from "@/components/looping-celebration";
import { usePlayOnce } from "@/learn/use-play-once";
import { LESSON_END_ID } from "@/lib/sound-manifest";
import { STICKER_EARNED_LINE } from "@/mascot/lines";

// The finish fanfare of a section, then the owl congratulating the child on
// the new sticker: one after the other, so two celebration sounds never
// overlap (the correct-answer jingle is left out, the fanfare is the
// celebration).
export const STICKER_EARNED_CUE: readonly string[] = [
  LESSON_END_ID,
  STICKER_EARNED_LINE.id,
];

// The moment a lesson's sticker is won: confetti from the centre of its
// positioned parent, bursting again every few seconds while the screen is
// open, and the fanfare with the owl's congratulation, played once when it
// appears. Silent with sound off (no sounds in context) and without confetti
// under reduced motion.
export function StickerEarnedCelebration() {
  usePlayOnce(STICKER_EARNED_CUE);
  return <LoopingConfetti />;
}
