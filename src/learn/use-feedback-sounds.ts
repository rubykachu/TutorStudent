import { useEffect, useMemo, useRef } from "react";
import type { FeedbackSounds } from "@/exercises/exercise-frame";
import { installAudioUnlock, playSound, preloadSounds } from "@/lib/sound";
import { JINGLE_ID, soundUrl } from "@/lib/sound-manifest";
import { VOICE_LINES, type VoiceLine } from "@/mascot/lines";
import { useSoundEnabled } from "@/progress/hooks";

// Every this many correct answers in a session, the owl also says its praise
// out loud after the jingle; saying it every time would soon grate.
export const SPOKEN_PRAISE_EVERY = 3;

function play(id: string): Promise<void> {
  const url = soundUrl(id);
  return url ? playSound(url) : Promise.resolve();
}

// The feedback sounds of one player session (a section or a review), or
// undefined while the first read is in flight or this child turned sound
// off. While sound is on, every clip is preloaded and the first tap anywhere
// unlocks audio.
export function useFeedbackSounds(childId: string): FeedbackSounds | undefined {
  const enabled = useSoundEnabled(childId) === true;
  const correctCount = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;
    preloadSounds(
      [JINGLE_ID, ...VOICE_LINES.map((line) => line.id)].flatMap(
        (id) => soundUrl(id) ?? [],
      ),
    );
    return installAudioUnlock();
  }, [enabled]);

  return useMemo(
    () =>
      enabled
        ? {
            correct(praise: VoiceLine) {
              correctCount.current += 1;
              const spoken = correctCount.current % SPOKEN_PRAISE_EVERY === 0;
              void play(JINGLE_ID).then(() =>
                spoken ? play(praise.id) : undefined,
              );
            },
            encourage(line: VoiceLine) {
              void play(line.id);
            },
          }
        : undefined,
    [enabled],
  );
}
