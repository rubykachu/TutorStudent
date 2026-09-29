import { useEffect } from "react";
import { installAudioUnlock, playTing } from "@/lib/sound";
import { useSoundEnabled } from "@/progress/hooks";

// The `onCorrect` handler for exercise frames: the "ting", unless this child
// turned sound off. While sound is on, the first tap anywhere unlocks audio.
export function useCorrectSound(childId: string): (() => void) | undefined {
  const enabled = useSoundEnabled(childId) === true;
  useEffect(() => (enabled ? installAudioUnlock() : undefined), [enabled]);
  return enabled ? playTing : undefined;
}
