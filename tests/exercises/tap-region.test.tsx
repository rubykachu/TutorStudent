import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Hints, TapRegionExercise } from "@/schema/content";
import Shapes from "@/visuals/_fixture/shapes";
import { NO_HINTS } from "./helpers";
import {
  checkAnswer,
  checkButton,
  feedbackVisual,
  next,
  renderExercise,
  revealed,
  startRetype,
  VISUAL_HINTS,
} from "./render";

const NAMES = {
  circle: "Hình tròn",
  square: "Hình vuông",
  triangle: "Hình tam giác",
} as const;
type RegionId = keyof typeof NAMES;

function tapRegionExercise(hints: Hints = NO_HINTS): TapRegionExercise {
  return {
    id: "test.ex.cham-hinh",
    type: "tapRegion",
    cardIds: [],
    prompt: [{ type: "note", text: "Chạm vào hình tròn." }],
    visualId: "fixture.visual.shapes",
    answer: ["circle"],
    hints,
    difficulty: 1,
  };
}

// The visual loads lazily, so the first query waits for it.
async function renderTapRegion(hints: Hints = NO_HINTS) {
  const exercise = tapRegionExercise(hints);
  const view = renderExercise(exercise);
  await screen.findByRole("button", { name: NAMES.circle });
  return view;
}

function region(id: RegionId): Element {
  return screen.getByRole("button", { name: NAMES[id] });
}

function tap(id: RegionId) {
  fireEvent.click(region(id));
}

describe("TapRegionAnswer", () => {
  it("turns the registry's regions into toggles with an enlarged hit ring", async () => {
    await renderTapRegion();
    expect(
      screen.getByRole("group", { name: /Một hình tròn/ }),
    ).toBeInTheDocument();
    const circle = region("circle");
    expect(circle).toHaveAttribute("data-region", "circle");
    expect(circle).toHaveClass("stroke-transparent");
    expect(Number(circle.getAttribute("stroke-width"))).toBeGreaterThan(0);

    tap("circle");
    expect(circle).toHaveAttribute("aria-pressed", "true");
    expect(circle).toHaveClass("stroke-foreground");
    tap("circle");
    expect(circle).toHaveAttribute("aria-pressed", "false");
    expect(checkButton()).toBeDisabled();

    fireEvent.keyDown(circle, { key: " " });
    expect(circle).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(circle, { key: "a" });
    expect(circle).toHaveAttribute("aria-pressed", "true");
  });

  it("accepts the right regions and locks them", async () => {
    const { frame, onDone } = await renderTapRegion();
    tap("circle");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(region("square")).toHaveAttribute("aria-disabled", "true");
    tap("square");
    expect(region("square")).toHaveAttribute("aria-pressed", "false");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: true,
      wrongCount: 0,
    });
  });

  it("lets go of an extra region and rings it, then reveals", async () => {
    const { frame, onDone, container } = await renderTapRegion();
    tap("square");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(region("square")).toHaveAttribute("data-highlighted");
    expect(region("square")).toHaveClass("stroke-highlight");
    expect(region("square")).toHaveAttribute("aria-pressed", "false");
    expect(region("circle")).not.toHaveAttribute("data-highlighted");
    expect(checkButton()).toBeDisabled();

    tap("square");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(region("square")).toHaveAttribute("data-highlighted");

    tap("square");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(revealed(container)).not.toBeNull();
    expect(region("circle")).toHaveAttribute("data-revealed");
    expect(region("circle")).toHaveAttribute("aria-pressed", "true");
    expect(region("circle")).toHaveClass("stroke-correct");
    expect(region("square")).toHaveAttribute("aria-pressed", "false");

    startRetype();
    expect(revealed(container)).toBeNull();
    expect(region("circle")).toHaveAttribute("aria-pressed", "false");
    tap("circle");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 3,
    });
  });

  it("colours an authored region hint with its concept", async () => {
    await renderTapRegion({
      highlight: [
        { target: "option", id: "circle", conceptId: "test.concept.nhan-vat" },
      ],
    });
    tap("triangle");
    checkAnswer();
    expect(region("circle")).toHaveClass("stroke-concept-pink");
  });

  it("plays hint and solution visuals instead of the fallbacks", async () => {
    const { frame, container } = await renderTapRegion(VISUAL_HINTS);
    tap("triangle");
    checkAnswer();
    tap("triangle");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(feedbackVisual(container, "fixture.visual.dot-grid")).not.toBeNull();
    expect(region("triangle")).not.toHaveAttribute("data-highlight-strong");
    tap("triangle");
    checkAnswer();
    expect(
      feedbackVisual(container, "fixture.visual.bead-merge"),
    ).not.toBeNull();
    expect(revealed(container)).toBeNull();
    // Let go after the last check too; the solution visual shows the answer.
    expect(region("triangle")).toHaveAttribute("aria-pressed", "false");
  });

  it("draws the same visual as a static image outside an exercise", () => {
    render(<Shapes />);
    expect(screen.getByRole("img", { name: /Một hình tròn/ })).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
