import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VISUAL_STEP_MS } from "@/lib/config";
// The lesson-visual skill's starting point for explainers. Importing it here
// also puts it under `pnpm typecheck`, which does not cover .claude/.
import Explainer from "../../.claude/skills/lesson-visual/templates/visual";

describe("lesson-visual explainer template", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows rows still to come dimmed with '?', then their result", () => {
    render(<Explainer />);
    expect(screen.getByText("= ?").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByText("= 8")).toBeNull();
    for (let step = 0; step < 2; step++) {
      act(() => {
        vi.advanceTimersByTime(VISUAL_STEP_MS);
      });
    }
    expect(screen.getByText("= 8")).toBeInTheDocument();
    expect(screen.queryByText("= ?")).toBeNull();
  });
});
