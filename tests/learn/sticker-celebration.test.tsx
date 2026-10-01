import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  STICKER_EARNED_CUE,
  StickerEarnedCelebration,
} from "@/learn/sticker-celebration";
import {
  type FeedbackSounds,
  FeedbackSoundsProvider,
} from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import { STICKER_EARNED_LINE } from "@/mascot/lines";

const original = window.matchMedia;
afterEach(() => {
  window.matchMedia = original;
});

function preferReducedMotion() {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList;
}

function renderCelebration(sounds?: { play: FeedbackSounds["play"] }) {
  const full = sounds && { play: sounds.play, tap: vi.fn(), button: vi.fn() };
  return render(
    <FeedbackSoundsProvider sounds={full}>
      <StickerEarnedCelebration />
    </FeedbackSoundsProvider>,
  );
}

describe("StickerEarnedCelebration", () => {
  it("bursts confetti and plays the jingle then the owl's congratulation, once", () => {
    const play = vi.fn();
    const view = renderCelebration({ play });
    expect(view.container.querySelector("[data-confetti]")).not.toBeNull();
    expect(play).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledWith([JINGLE_ID, STICKER_EARNED_LINE.id]);
    expect(STICKER_EARNED_CUE).toEqual([JINGLE_ID, STICKER_EARNED_LINE.id]);
    view.rerender(
      <FeedbackSoundsProvider sounds={{ play, tap: vi.fn(), button: vi.fn() }}>
        <StickerEarnedCelebration />
      </FeedbackSoundsProvider>,
    );
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("stays silent while the child has sound off, but still celebrates", () => {
    const view = renderCelebration(undefined);
    expect(view.container.querySelector("[data-confetti]")).not.toBeNull();
  });

  it("drops the confetti under reduced motion and keeps the voice", () => {
    preferReducedMotion();
    const play = vi.fn();
    const view = renderCelebration({ play });
    expect(view.container.querySelector("[data-confetti]")).toBeNull();
    expect(play).toHaveBeenCalledTimes(1);
  });
});
