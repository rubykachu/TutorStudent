"use client";

import { Volume2, VolumeX } from "lucide-react";
import { playSound, preloadSounds, unlockAudio } from "@/lib/sound";
import { JINGLE_ID, soundUrl } from "@/lib/sound-manifest";
import { setSoundEnabled, useSoundEnabled } from "@/progress/hooks";

// Turns every app sound (the tones and the owl's voice) on or off for one
// child; the one setting is shared by every screen. A quiet round speaker
// icon, always at the right end of the screen's top row (the player header,
// the page headers), so it is found in the same place everywhere without
// drawing a child's eye.
export function SoundToggle({ childId }: { childId: string }) {
  const enabled = useSoundEnabled(childId);
  if (enabled === undefined) {
    // Keeps its room while the setting loads, so the row never shifts.
    return <span aria-hidden className="size-12 shrink-0" />;
  }
  const Icon = enabled ? Volume2 : VolumeX;
  const state = enabled ? "Âm thanh: bật" : "Âm thanh: tắt";
  return (
    <button
      type="button"
      aria-label="Âm thanh"
      aria-pressed={enabled}
      title={state}
      data-sound={enabled ? "on" : "off"}
      // Turning sound on plays the jingle; see ButtonSounds.
      data-own-sound
      className="-mr-2 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
      onClick={() => {
        if (!enabled) {
          // This tap is the gesture iOS needs; the jingle confirms sound is on.
          const jingle = soundUrl(JINGLE_ID);
          if (jingle) {
            preloadSounds([jingle]);
            unlockAudio();
            void playSound(jingle);
          }
        }
        void setSoundEnabled(childId, !enabled);
      }}
    >
      <Icon aria-hidden className="size-6" />
    </button>
  );
}
