"use client";

import { Music } from "lucide-react";
import {
  setBackgroundMusicEnabled,
  useBackgroundMusicEnabled,
} from "@/progress/hooks";

// Turns the background music of the outer screens on or off on this device,
// apart from the sound switch (taps, the owl, celebrations). A round note
// icon beside the sound switch on the home screen, crossed out when off.
export function MusicToggle() {
  const enabled = useBackgroundMusicEnabled();
  if (enabled === undefined) {
    // Keeps its room while the setting loads, so the row never shifts.
    return <span aria-hidden className="size-12 shrink-0" />;
  }
  return (
    <button
      type="button"
      aria-label="Nhạc nền"
      aria-pressed={enabled}
      title={enabled ? "Nhạc nền: bật" : "Nhạc nền: tắt"}
      data-music-toggle={enabled ? "on" : "off"}
      className="relative flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
      onClick={() => void setBackgroundMusicEnabled(!enabled)}
    >
      <Music aria-hidden className="size-6" />
      {!enabled && (
        <span
          aria-hidden
          className="absolute h-0.5 w-7 rotate-45 rounded-full bg-current"
        />
      )}
    </button>
  );
}
