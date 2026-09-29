import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Hints, TapTextExercise } from "@/schema/content";
import { NO_HINTS } from "./helpers";
import {
  checkAnswer,
  checkButton,
  feedbackVisual,
  highlightOf,
  next,
  renderExercise,
  revealed,
  startRetype,
  VISUAL_HINTS,
} from "./render";

const SENTENCES = {
  s1: "Lan bị ốm.",
  s2: "Minh chép bài giúp Lan.",
  s3: "Hai bạn cùng đi học.",
};

function tapTextExercise(hints: Hints = NO_HINTS): TapTextExercise {
  return {
    id: "test.ex.cham-cau",
    type: "tapText",
    cardIds: [],
    prompt: [
      {
        type: "passage",
        paragraphs: [
          {
            sentences: [
              { id: "s1", text: SENTENCES.s1 },
              { id: "s2", text: SENTENCES.s2 },
            ],
          },
          { sentences: [{ id: "s3", text: SENTENCES.s3 }] },
        ],
        annotations: [],
      },
      { type: "note", text: "Chạm vào câu kể việc Minh giúp bạn." },
    ],
    answer: ["s2"],
    hints,
    difficulty: 1,
  };
}

function renderTapText(hints: Hints = NO_HINTS) {
  const exercise = tapTextExercise(hints);
  return renderExercise(exercise);
}

function sentence(id: keyof typeof SENTENCES): HTMLElement {
  return screen.getByRole("button", { name: SENTENCES[id] });
}

function tap(id: keyof typeof SENTENCES) {
  fireEvent.click(sentence(id));
}

describe("TapTextAnswer", () => {
  it("shows the passage once, as tappable sentences in tap-mode spacing", () => {
    const { container } = renderTapText();
    expect(screen.getAllByText(SENTENCES.s1)).toHaveLength(1);
    const group = screen.getByRole("group", { name: "Chạm vào câu để chọn" });
    expect(group).toHaveClass("leading-tap");
    expect(group.querySelectorAll("p")).toHaveLength(2);
    // The note stays in the prompt, outside the answer area.
    const area = container.querySelector("[data-answer-area]");
    expect(area).not.toHaveTextContent("Chạm vào câu kể");
  });

  it("toggles whole sentences and accepts the right set", () => {
    const { frame, onDone } = renderTapText();
    tap("s1");
    expect(sentence("s1")).toHaveAttribute("aria-pressed", "true");
    expect(sentence("s1")).toHaveClass("bg-highlight");
    tap("s1");
    expect(sentence("s1")).toHaveAttribute("aria-pressed", "false");
    expect(checkButton()).toBeDisabled();

    fireEvent.keyDown(sentence("s2"), { key: "Enter" });
    expect(sentence("s2")).toHaveAttribute("aria-pressed", "true");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(sentence("s1")).toHaveAttribute("aria-disabled", "true");
    tap("s1");
    expect(sentence("s1")).toHaveAttribute("aria-pressed", "false");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: true,
      wrongCount: 0,
    });
  });

  it("marks only extra selections, then strong marks, then reveals", () => {
    const { frame, onDone, container } = renderTapText({
      highlight: [
        { target: "part", id: "s3", conceptId: "test.concept.nhan-vat" },
      ],
    });
    tap("s1");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(sentence("s1")).toHaveAttribute("data-highlighted");
    // The missed answer is never pointed at.
    expect(sentence("s2")).not.toHaveAttribute("data-highlighted");
    // An authored sentence hint reaches the answer area in its concept colour.
    expect(sentence("s3")).toHaveClass("decoration-concept-pink");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(sentence("s1")).toHaveAttribute("data-highlight-strong");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(revealed(container)).not.toBeNull();
    expect(sentence("s2")).toHaveAttribute("aria-pressed", "true");
    expect(sentence("s2")).toHaveAttribute("data-revealed");
    expect(sentence("s1")).toHaveAttribute("aria-pressed", "false");
    tap("s3");
    expect(sentence("s3")).toHaveAttribute("aria-pressed", "false");

    startRetype();
    expect(revealed(container)).toBeNull();
    expect(sentence("s2")).toHaveAttribute("aria-pressed", "false");
    tap("s2");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 3,
    });
  });

  it("plays hint and solution visuals instead of the fallbacks", () => {
    const { frame, container } = renderTapText(VISUAL_HINTS);
    tap("s3");
    checkAnswer();
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(feedbackVisual(container, "fixture.visual.dot-grid")).not.toBeNull();
    expect(sentence("s3")).not.toHaveAttribute("data-highlight-strong");
    checkAnswer();
    expect(
      feedbackVisual(container, "fixture.visual.bead-merge"),
    ).not.toBeNull();
    expect(revealed(container)).toBeNull();
    expect(sentence("s3")).toHaveAttribute("aria-pressed", "true");
    expect(highlightOf(sentence("s2"))).toBeNull();
  });
});
