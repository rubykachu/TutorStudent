"use client";

import { useEffect, useSyncExternalStore } from "react";
import { unlockAudio } from "@/lib/sound";
import { useBackgroundMusicAllowed } from "@/progress/hooks";
import { type BackgroundMusic, backgroundMusic } from "./background-music";

const GESTURE_EVENTS = ["pointerdown", "touchend", "keydown"] as const;
// A narration or video element that starts silences the music until it
// pauses or ends.
const MEDIA_START = ["play"] as const;
const MEDIA_STOP = ["pause", "ended", "emptied", "error"] as const;

// Feeds the page's background music controller everything it decides on
// besides the screen: the device's music switch and the child's sound
// switch, the first tap, the page going to the background and back, and any
// narration or video playing. Mounted once by the child layout; the parent
// page and every page outside it have none, so the music stops there.
export function BackgroundMusicRunner() {
  const allowed = useBackgroundMusicAllowed() === true;

  useEffect(() => {
    const music = backgroundMusic();
    music.setEnabled(allowed);
    if (!allowed) return undefined;
    const cleanups = [
      installGestureUnlock(),
      installVisibility(music),
      installMediaHolds(music),
    ];
    return () => {
      for (const cleanup of cleanups) cleanup();
      music.setEnabled(false);
    };
  }, [allowed]);

  return null;
}

// Unlocks the shared audio context and lets the background music start.
// Call it synchronously from a tap handler: iOS starts audio only there.
export function unlockAudioFromTap(): void {
  unlockAudio();
  backgroundMusic().unlock();
}

// iOS starts audio only inside a tap: the first one anywhere unlocks the
// shared context and lets the music start. Later taps resume a context that
// was suspended while the page was in the background or idle.
function installGestureUnlock(): () => void {
  const options = { capture: true, passive: true };
  const onGesture = unlockAudioFromTap;
  for (const type of GESTURE_EVENTS)
    window.addEventListener(type, onGesture, options);
  return () => {
    for (const type of GESTURE_EVENTS)
      window.removeEventListener(type, onGesture, options);
  };
}

function installVisibility(music: BackgroundMusic): () => void {
  const sync = () => music.setVisible(document.visibilityState !== "hidden");
  const hide = () => music.setVisible(false);
  sync();
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pagehide", hide);
  window.addEventListener("pageshow", sync);
  return () => {
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("pagehide", hide);
    window.removeEventListener("pageshow", sync);
  };
}

// Media events do not bubble, so they are caught on their way down. The
// app's own clips never reach here: they play through Web Audio or an
// element that is not in the document.
function installMediaHolds(music: BackgroundMusic): () => void {
  const holds = new Map<EventTarget, () => void>();
  const start = (event: Event) => {
    const media = event.target;
    if (!(media instanceof HTMLMediaElement) || holds.has(media)) return;
    holds.set(media, music.hold("silence"));
  };
  const stop = (event: Event) => {
    const release = holds.get(event.target as EventTarget);
    if (!release) return;
    holds.delete(event.target as EventTarget);
    release();
  };
  for (const media of document.querySelectorAll("audio, video")) {
    if (media instanceof HTMLMediaElement && !media.paused) {
      holds.set(media, music.hold("silence"));
    }
  }
  for (const type of MEDIA_START) document.addEventListener(type, start, true);
  for (const type of MEDIA_STOP) document.addEventListener(type, stop, true);
  return () => {
    for (const type of MEDIA_START)
      document.removeEventListener(type, start, true);
    for (const type of MEDIA_STOP)
      document.removeEventListener(type, stop, true);
    for (const release of holds.values()) release();
    holds.clear();
  };
}

// Claims the music for an outer screen while it is shown. Rendered by the
// outer screens only: home, a subject's lessons, the lesson page's list of
// parts, the grade and profile pickers.
export function OuterScreenMusic() {
  useEffect(() => backgroundMusic().claimOuterScreen(), []);
  return null;
}

// Whether a tap has let audio start in this page (the music then plays when
// it is allowed).
export function useAudioUnlocked(): boolean {
  return useSyncExternalStore(
    (onChange) => backgroundMusic().onUnlock(onChange),
    () => backgroundMusic().isUnlocked(),
    () => false,
  );
}
