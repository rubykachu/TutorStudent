import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isOffscreen,
  NARRATION_CONTROL_ATTR,
  useFollowReading,
} from "@/learn/use-follow-reading";

const scrollIntoView = vi.fn();

beforeEach(() => {
  Element.prototype.scrollIntoView = scrollIntoView;
});

afterEach(() => {
  scrollIntoView.mockReset();
  document.documentElement.removeAttribute("style");
});

function Harness({ reading, playing }: { reading: number; playing: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const follow = useFollowReading({
    rootRef,
    reading,
    playing,
    reducedMotion: false,
  });
  return (
    <div ref={rootRef}>
      <p data-testid="text">
        {reading >= 0 && <span data-word-reading>word</span>}
      </p>
      <button type="button" {...{ [NARRATION_CONTROL_ATTR]: "" }}>
        control
      </button>
      <output data-following={String(follow.following)}>
        {follow.canResume ? "can resume" : "no resume"}
      </output>
      <button type="button" onClick={follow.resume}>
        resume
      </button>
    </div>
  );
}

const following = () =>
  document.querySelector("output")?.getAttribute("data-following");

describe("isOffscreen", () => {
  it("is true only for a box wholly above the top or below the bottom edge", () => {
    expect(isOffscreen({ top: 100, bottom: 130 }, 60, 400)).toBe(false);
    expect(isOffscreen({ top: 20, bottom: 50 }, 60, 400)).toBe(true);
    expect(isOffscreen({ top: 410, bottom: 440 }, 60, 400)).toBe(true);
    // Partly under the mini-player still counts as seen.
    expect(isOffscreen({ top: 40, bottom: 80 }, 60, 400)).toBe(false);
  });
});

describe("useFollowReading", () => {
  it("scrolls to the spoken word, again with each new word", () => {
    const { rerender } = render(<Harness reading={2} playing />);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      behavior: "smooth",
    });
    rerender(<Harness reading={3} playing />);
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["a wheel turn", () => fireEvent.wheel(window)],
    [
      "a touch or click",
      () => fireEvent.pointerDown(screen.getByTestId("text")),
    ],
    [
      "a scroll key",
      () => fireEvent.keyDown(document.body, { key: "ArrowDown" }),
    ],
  ])("stops following after %s by the child", (_name, act_) => {
    const { rerender } = render(<Harness reading={2} playing />);
    scrollIntoView.mockClear();
    act_();
    expect(following()).toBe("false");
    rerender(<Harness reading={3} playing />);
    rerender(<Harness reading={4} playing />);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("ignores other keys and the narration's own controls", () => {
    render(<Harness reading={2} playing />);
    fireEvent.keyDown(document.body, { key: "a" });
    fireEvent.pointerDown(screen.getByRole("button", { name: "control" }));
    expect(following()).toBe("true");
  });

  it("offers to resume only once the spoken word is off screen, and resumes on request", async () => {
    const { rerender } = render(<Harness reading={2} playing />);
    fireEvent.wheel(window);
    // Still in view: no button, whatever the child did.
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("no resume"),
    );
    const word = document.querySelector("[data-word-reading]") as HTMLElement;
    vi.spyOn(word, "getBoundingClientRect").mockReturnValue({
      top: 5000,
      bottom: 5030,
    } as DOMRect);
    // The next word is a new element in the same place of the page.
    rerender(<Harness reading={3} playing />);
    const next = document.querySelector("[data-word-reading]") as HTMLElement;
    vi.spyOn(next, "getBoundingClientRect").mockReturnValue({
      top: 5000,
      bottom: 5030,
    } as DOMRect);
    fireEvent.scroll(window);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("can resume"),
    );

    scrollIntoView.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "resume" }));
    expect(following()).toBe("true");
    expect(scrollIntoView).toHaveBeenCalledOnce();
  });

  it("follows again when the narration is played again", () => {
    const { rerender } = render(<Harness reading={2} playing />);
    fireEvent.wheel(window);
    expect(following()).toBe("false");
    rerender(<Harness reading={-1} playing={false} />);
    rerender(<Harness reading={0} playing />);
    expect(following()).toBe("true");
  });

  it("does not listen while nothing is playing", () => {
    render(<Harness reading={-1} playing={false} />);
    fireEvent.wheel(window);
    expect(following()).toBe("true");
  });
});
