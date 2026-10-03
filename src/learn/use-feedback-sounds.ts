import { useEffect, useMemo } from "react";
import type { FeedbackSounds } from "@/lib/feedback-sounds";
import {
  installAudioUnlock,
  playSequence,
  playSound,
  preloadSounds,
} from "@/lib/sound";
import {
  allSoundUrls,
  BUTTON_ID,
  isCelebration,
  LEAVE_ID,
  soundUrl,
  TAP_ID,
} from "@/lib/sound-manifest";
import { backgroundMusic } from "@/music/background-music";
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
              const urls = clipIds.flatMap((id) => soundUrl(id) ?? []);
              if (!clipIds.some(isCelebration)) {
                void playSequence(urls);
                return;
              }
              // The background music steps back while a celebration plays.
              const release = backgroundMusic().hold("duck");
              void playSequence(urls).then(release);
            },
            tap() {
              const url = soundUrl(TAP_ID);
              if (url) void playSound(url);
            },
            button() {
              const url = soundUrl(BUTTON_ID);
              if (url) void playSound(url);
            },
            leave() {
              const url = soundUrl(LEAVE_ID);
              if (url) void playSequence([url]);
            },
          }
        : undefined,
    [enabled],
  );
}
