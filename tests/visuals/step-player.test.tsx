import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VISUAL_STEP_MS } from "@/lib/config";
import { StepPlayer } from "@/visuals/shared/step-player";

const REDUCED = "(prefers-reduced-motion: reduce)";

function stubMatchMedia(matching: string | null) {
  const original = window.matchMedia;
  window.matchMedia = (query: string) => ({
    ...original(query),
    matches: query === matching,
  });
  return () => {
    window.matchMedia = original;
  };
}

function renderPlayer() {
  return render(
    <StepPlayer steps={3} label="Hoạt hình thử">
      {(step) => <p>{`Cảnh ${step + 1}`}</p>}
    </StepPlayer>,
  );
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("StepPlayer", () => {
  let restore: () => void = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    restore();
    vi.useRealTimers();
  });

  describe("with motion allowed", () => {
    beforeEach(() => {
      restore = stubMatchMedia(null);
    });

    it("advances on its own and stops at the last step", () => {
      renderPlayer();
      expect(screen.getByText("Cảnh 1")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Bước tiếp" })).toBeNull();

      advance(VISUAL_STEP_MS);
      expect(screen.getByText("Cảnh 2")).toBeInTheDocument();
      advance(VISUAL_STEP_MS);
      expect(screen.getByText("Cảnh 3")).toBeInTheDocument();
      advance(VISUAL_STEP_MS * 5);
      expect(screen.getByText("Cảnh 3")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Phát" })).toBeInTheDocument();
    });

    it("pauses, resumes and replays", () => {
      renderPlayer();
      fireEvent.click(screen.getByRole("button", { name: "Tạm dừng" }));
      advance(VISUAL_STEP_MS * 3);
      expect(screen.getByText("Cảnh 1")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Phát" }));
      advance(VISUAL_STEP_MS);
      expect(screen.getByText("Cảnh 2")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Xem lại từ đầu" }));
      expect(screen.getByText("Cảnh 1")).toBeInTheDocument();
      advance(VISUAL_STEP_MS);
      expect(screen.getByText("Cảnh 2")).toBeInTheDocument();
    });
  });

  describe("with reduced motion", () => {
    beforeEach(() => {
      restore = stubMatchMedia(REDUCED);
    });

    it("never advances by itself and steps on each tap of Bước tiếp", () => {
      renderPlayer();
      advance(VISUAL_STEP_MS * 5);
      expect(screen.getByText("Cảnh 1")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Phát" })).toBeNull();

      const next = screen.getByRole("button", { name: "Bước tiếp" });
      fireEvent.click(next);
      expect(screen.getByText("Cảnh 2")).toBeInTheDocument();
      advance(VISUAL_STEP_MS * 5);
      expect(screen.getByText("Cảnh 2")).toBeInTheDocument();

      fireEvent.click(next);
      expect(screen.getByText("Cảnh 3")).toBeInTheDocument();
      expect(next).toBeDisabled();
    });
  });

  it("labels every control in Vietnamese with a touch-sized target", () => {
    restore = stubMatchMedia(null);
    renderPlayer();
    for (const button of screen.getAllByRole("button")) {
      expect(button.getAttribute("aria-label")).toMatch(/\S/);
      expect(button.className).toContain("min-h-touch");
      expect(button.className).toContain("min-w-touch");
    }
  });
});
