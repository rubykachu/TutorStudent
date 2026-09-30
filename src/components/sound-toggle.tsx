"use client";

import { Volume2, VolumeX } from "lucide-react";
import { playSound, preloadSounds, unlockAudio } from "@/lib/sound";
import { JINGLE_ID, soundUrl } from "@/lib/sound-manifest";
import { setSoundEnabled, useSoundEnabled } from "@/progress/hooks";

// Turns the feedback sounds (jingle and the owl's voice) on or off for one
// child. A quiet text button: parents look for it, children should not be
// drawn to it.
export function SoundToggle({ childId }: { childId: string }) {
  const enabled = useSoundEnabled(childId);
  if (enabled === undefined) return null;
  const Icon = enabled ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      aria-pressed={enabled}
      data-sound={enabled ? "on" : "off"}
      className="flex h-12 shrink-0 items-center gap-2 rounded-full px-3 text-caption font-semibold text-muted-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
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
      <Icon aria-hidden className="size-5" />
      {enabled ? "Âm thanh: bật" : "Âm thanh: tắt"}
    </button>
  );
}
