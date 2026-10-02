"use client";

import { type RefObject, useEffect, useState } from "react";
import { BOTTOM_BAR_HEIGHT_VAR } from "@/components/bottom-bar";

// CSS variable holding the narration mini-player's height on <html> while it
// shows; globals.css turns it into the document's scroll-padding-top so the
// word being read is scrolled to below it, not under it.
export const MINI_PLAYER_HEIGHT_VAR = "--narration-mini-height";

// Everything that belongs to the narration's own controls (the player card,
// the mini-player, the follow button): touching one is not the child taking
// the scroll into their own hands.
export const NARRATION_CONTROL_ATTR = "data-narration-control";

// Keys that scroll the page.
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function insetPx(name: string): number {
  return (
    Number.parseFloat(document.documentElement.style.getPropertyValue(name)) ||
    0
  );
}

// True when a box lies wholly outside the part of the viewport the bars leave
// free: above `top`, or below `bottom`.
export function isOffscreen(
  rect: { top: number; bottom: number },
  top: number,
  bottom: number,
): boolean {
  return rect.bottom < top || rect.top > bottom;
}

type FollowOptions = {
  rootRef: RefObject<HTMLElement | null>;
  // Position of the word being said in the overview, -1 for none.
  reading: number;
  playing: boolean;
  reducedMotion: boolean;
};

export type Follow = {
  // The page scrolls to keep the spoken word on screen.
  following: boolean;
  // Following is off and the spoken word has left the screen: the child can
  // ask to be taken back to it.
  canResume: boolean;
  resume: () => void;
};

// The text being heard stays on screen: the page follows the highlighted word
// down, and the document's scroll-padding keeps it between the mini-player
// and the bottom bar. A wheel turn, a touch, a click or a scroll key by the
// child (not on the narration's own controls) stops the following, so the
// page never runs away from a finger; pressing play again, or "Theo dõi lời
// đọc", brings it back.
export function useFollowReading({
  rootRef,
  reading,
  playing,
  reducedMotion,
}: FollowOptions): Follow {
  const [following, setFollowing] = useState(true);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    if (playing) setFollowing(true);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const stop = (event: Event) => {
      const { target } = event;
      if (
        target instanceof Element &&
        target.closest(`[${NARRATION_CONTROL_ATTR}]`)
      ) {
        return;
      }
      setFollowing(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) stop(event);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  // Following: bring the spoken word on screen, now and with each new word.
  useEffect(() => {
    if (!following || reading < 0) return;
    rootRef.current?.querySelector("[data-word-reading]")?.scrollIntoView?.({
      block: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [following, reading, reducedMotion, rootRef]);

  // Not following: is the spoken word still on screen? Only when it is not
  // does "Theo dõi lời đọc" show, so a tap on the text never leaves a
  // button behind. It measures again with each new word.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `reading` is the trigger to measure the next word
  useEffect(() => {
    if (following || !playing) {
      setOffscreen(false);
      return;
    }
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const word = rootRef.current?.querySelector("[data-word-reading]");
        setOffscreen(
          word
            ? isOffscreen(
                word.getBoundingClientRect(),
                insetPx(MINI_PLAYER_HEIGHT_VAR),
                window.innerHeight - insetPx(BOTTOM_BAR_HEIGHT_VAR),
              )
            : false,
        );
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
    };
  }, [following, playing, reading, rootRef]);

  return {
    following,
    canResume: playing && !following && offscreen,
    resume: () => setFollowing(true),
  };
}
