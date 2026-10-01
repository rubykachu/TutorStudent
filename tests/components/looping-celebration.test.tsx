import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  beatDelayMs,
  LoopingConfetti,
  LoopingMotion,
} from "@/components/looping-celebration";
import { StickerEarnedCelebration } from "@/learn/sticker-celebration";
import { FeedbackSoundsProvider } from "@/lib/feedback-sounds";

const original = window.matchMedia;

function preferReducedMotion() {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList;
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = original;
});

function variant(container: HTMLElement): string | null | undefined {
  return container
    .querySelector("[data-confetti]")
    ?.getAttribute("data-confetti-variant");
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("beatDelayMs", () => {
  it("stays between 2.5 and 4 seconds and varies from beat to beat", () => {
    const delays = Array.from({ length: 30 }, (_, beat) => beatDelayMs(beat));
    for (const delay of delays) {
      expect(delay).toBeGreaterThanOrEqual(2500);
      expect(delay).toBeLessThan(4000);
    }
    expect(new Set(delays).size).toBeGreaterThan(5);
  });
});

describe("LoopingConfetti", () => {
  it("bursts as it opens and again after each gap while mounted", () => {
    const { container } = render(<LoopingConfetti />);
    expect(variant(container)).toBe("0");
    // Nothing new before the shortest gap.
    advance(2400);
    expect(variant(container)).toBe("0");
    advance(beatDelayMs(0));
    expect(variant(container)).toBe("1");
    advance(beatDelayMs(1));
    expect(variant(container)).toBe("2");
    // One burst at a time: the particle count never grows.
    expect(container.querySelectorAll("[data-confetti]")).toHaveLength(1);
  });

  it("stops its timer when unmounted", () => {
    const { unmount } = render(<LoopingConfetti />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("draws nothing and sets no timer under reduced motion", () => {
    preferReducedMotion();
    const { container } = render(<LoopingConfetti />);
    expect(container.querySelector("[data-confetti]")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("never takes a tap", () => {
    const { container } = render(<LoopingConfetti />);
    expect(container.querySelector("[data-confetti]")?.className).toContain(
      "pointer-events-none",
    );
  });
});

describe("StickerEarnedCelebration sounds", () => {
  it("plays its cue once however many bursts follow", () => {
    const play = vi.fn();
    const { container } = render(
      <FeedbackSoundsProvider
        sounds={{ play, tap: vi.fn(), button: vi.fn(), leave: vi.fn() }}
      >
        <StickerEarnedCelebration />
      </FeedbackSoundsProvider>,
    );
    advance(beatDelayMs(0));
    advance(beatDelayMs(1));
    advance(beatDelayMs(2));
    expect(variant(container)).toBe("3");
    expect(play).toHaveBeenCalledTimes(1);
  });
});

describe("LoopingMotion", () => {
  it("loops while motion is allowed", () => {
    const { container } = render(<LoopingMotion>x</LoopingMotion>);
    expect(container.querySelector("[data-looping='bounce']")).not.toBeNull();
  });

  it("holds still under reduced motion", () => {
    preferReducedMotion();
    const { container } = render(<LoopingMotion>x</LoopingMotion>);
    expect(container.querySelector("[data-looping]")).toBeNull();
  });
});
