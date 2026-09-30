import { useEffect, useMemo } from "react";
import type { FeedbackSounds } from "@/exercises/exercise-frame";
import { installAudioUnlock, playSequence, preloadSounds } from "@/lib/sound";
import { allSoundUrls, soundUrl } from "@/lib/sound-manifest";
import { useSoundEnabled } from "@/progress/hooks";

// The feedback sounds of one player session (a section or a review), or
// undefined while the first read is in flight or this child turned sound
// off. While sound is on, every clip is preloaded and the first tap anywhere
// unlocks audio.
export function useFeedbackSounds(childId: string): FeedbackSounds | undefined {
  const enabled = useSoundEnabled(childId) === true;

  useEffect(() => {
    if (!enabled) return undefined;
    preloadSounds(allSoundUrls());
    return installAudioUnlock();
  }, [enabled]);

  return useMemo(
    () =>
      enabled
        ? {
            play(clipIds) {
              void playSequence(clipIds.flatMap((id) => soundUrl(id) ?? []));
            },
          }
        : undefined,
    [enabled],
  );
}
