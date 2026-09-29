"use client";

import { Volume2, VolumeX } from "lucide-react";
import { playTing, unlockAudio } from "@/lib/sound";
import { setSoundEnabled, useSoundEnabled } from "@/progress/hooks";

// Turns the "ting" for correct answers on or off for one child.
export function SoundToggle({ childId }: { childId: string }) {
  const enabled = useSoundEnabled(childId);
  if (enabled === undefined) return null;
  const Icon = enabled ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      aria-label={enabled ? "Tắt âm thanh" : "Bật âm thanh"}
      data-sound={enabled ? "on" : "off"}
      className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
      onClick={() => {
        if (!enabled) {
          // This tap is the gesture iOS needs; the ting confirms sound is on.
          unlockAudio();
          playTing();
        }
        void setSoundEnabled(childId, !enabled);
      }}
    >
      <Icon aria-hidden className="size-6" />
    </button>
  );
}
