import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  StickerEarnedCelebration,
  stickerEarnedCue,
} from "@/learn/sticker-celebration";
import {
  type FeedbackSounds,
  FeedbackSoundsProvider,
} from "@/lib/feedback-sounds";
import { CELEBRATION_IDS } from "@/lib/sound-manifest";
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
  const full = sounds && {
    play: sounds.play,
    tap: vi.fn(),
    button: vi.fn(),
    leave: vi.fn(),
  };
  return render(
    <FeedbackSoundsProvider sounds={full}>
      <StickerEarnedCelebration />
    </FeedbackSoundsProvider>,
  );
}

describe("StickerEarnedCelebration", () => {
  it("picks either celebration clip, then the owl's congratulation", () => {
    expect(stickerEarnedCue(() => 0)).toEqual([
      CELEBRATION_IDS[0],
      STICKER_EARNED_LINE.id,
    ]);
    expect(stickerEarnedCue(() => 0.99)).toEqual([
      CELEBRATION_IDS[1],
      STICKER_EARNED_LINE.id,
    ]);
  });

  it("bursts confetti and plays a celebration then the owl's congratulation, once", () => {
    const play = vi.fn();
    const view = renderCelebration({ play });
    expect(view.container.querySelector("[data-confetti]")).not.toBeNull();
    expect(play).toHaveBeenCalledTimes(1);
    const [cue] = play.mock.calls[0] as [string[]];
    expect(CELEBRATION_IDS).toContain(cue[0]);
    expect(cue.slice(1)).toEqual([STICKER_EARNED_LINE.id]);
    view.rerender(
      <FeedbackSoundsProvider
        sounds={{ play, tap: vi.fn(), button: vi.fn(), leave: vi.fn() }}
      >
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
