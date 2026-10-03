"use client";

import { useState } from "react";
import { LoopingConfetti } from "@/components/looping-celebration";
import { usePlayOnce } from "@/learn/use-play-once";
import { pickCelebration } from "@/lib/sound-manifest";
import { STICKER_EARNED_LINE } from "@/mascot/lines";

// A celebration clip (one of the two at random), then the owl congratulating
// the child on the new sticker: one after the other, so two celebration
// sounds never overlap (the correct-answer jingle is left out, the
// celebration clip is the celebration). `random` is injectable for tests.
export function stickerEarnedCue(
  random: () => number = Math.random,
): readonly string[] {
  return [pickCelebration(random), STICKER_EARNED_LINE.id];
}

// The moment a lesson's sticker is won: confetti from the centre of its
// positioned parent, bursting again every few seconds while the screen is
// open, and the celebration with the owl's congratulation, played once when it
// appears. Silent with sound off (no sounds in context) and without confetti
// under reduced motion.
export function StickerEarnedCelebration() {
  // One pick per celebration, kept across renders.
  const [cue] = useState(() => stickerEarnedCue());
  usePlayOnce(cue);
  return <LoopingConfetti />;
}
