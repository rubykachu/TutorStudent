import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type AnswerSlotProps,
  ExerciseFrame,
} from "@/exercises/exercise-frame";
import type { ChoiceInput } from "@/exercises/input";
import type { ChoiceExercise, Concept, Hints } from "@/schema/content";
import { Highlight } from "@/visuals/shared/highlight";
import { choiceExercise } from "./helpers";

// Minimal answer component built only against the slot contract.
function TestChoice({
  exercise,
  slot,
}: {
  exercise: ChoiceExercise;
  slot: AnswerSlotProps<ChoiceInput>;
}) {
  lastSlot = slot;
  const selected = slot.reveal ? exercise.answer : (slot.value?.selected ?? []);
  return (
    <div data-reveal={slot.reveal || undefined}>
      {exercise.options.map(({ id }) => {
        const spec = slot.highlight.get(id);
        return (
          <Highlight
            key={id}
            active={spec !== undefined}
            color={spec?.color}
            strong={spec?.strong}
          >
            <button
              type="button"
              aria-pressed={selected.includes(id)}
              disabled={slot.disabled}
              data-option={id}
              data-wrong={slot.wrong.has(id) || undefined}
              onClick={() => slot.onChange({ type: "choice", selected: [id] })}
            >
              {`Đáp án ${id}`}
            </button>
          </Highlight>
        );
      })}
    </div>
  );
}

const CONCEPTS: ReadonlyMap<string, Concept> = new Map([
  [
    "test.concept.co-so",
    { id: "test.concept.co-so", name: "Cơ số", color: "blue" },
  ],
]);

function renderFrame(hints: Hints) {
  const exercise: ChoiceExercise = {
    ...choiceExercise(["a"], hints),
    prompt: [
      { type: "note", text: "Chọn cách viết đúng." },
      { type: "formula", tex: "\\htmlId{co-so}{2}^{3}" },
    ],
  };
  const onDone = vi.fn();
  const onCorrect = vi.fn();
  const view = render(
    <ExerciseFrame
      exercise={exercise}
      concepts={CONCEPTS}
      onDone={onDone}
      onCorrect={onCorrect}
      renderMascot={(expression) => (
        <span data-testid="mascot">{expression}</span>
      )}
    >
      {(slot) => <TestChoice exercise={exercise} slot={slot} />}
    </ExerciseFrame>,
  );
  const frame = view.container.querySelector("section");
  if (!frame) throw new Error("frame missing");
  return { frame, onDone, onCorrect, container: view.container };
}

function choose(id: string) {
  fireEvent.click(screen.getByRole("button", { name: `Đáp án ${id}` }));
}

function checkAnswer() {
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
}

function answerArea(container: HTMLElement) {
  const area = container.querySelector("[data-answer-area]");
  if (!area) throw new Error("answer area missing");
  return area;
}

// React listens for the prefixed name in jsdom, which has no AnimationEvent.
function endAnimation(el: Element) {
  for (const name of ["animationend", "webkitAnimationEnd"]) {
    fireEvent(el, new Event(name, { bubbles: true }));
  }
}

function option(id: string) {
  return screen.getByRole("button", { name: `Đáp án ${id}` });
}

// The last slot the frame handed to the answer component.
let lastSlot: AnswerSlotProps<ChoiceInput> | undefined;
function slotOf<K extends keyof AnswerSlotProps<ChoiceInput>>(key: K) {
  if (!lastSlot) throw new Error("no slot yet");
  return lastSlot[key];
}

function optionHighlight(id: string) {
  return screen
    .getByRole("button", { name: `Đáp án ${id}` })
    .closest("[data-highlighted]");
}

const HINTS_FALLBACK: Hints = {
  highlight: [
    { target: "block", index: 0 },
    { target: "part", id: "co-so", conceptId: "test.concept.co-so" },
  ],
};

const HINTS_WITH_VISUALS: Hints = {
  highlight: [],
  hintVisualId: "fixture.visual.dot-grid",
  solutionVisualId: "fixture.visual.bead-merge",
};

describe("ExerciseFrame", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("accepts a first-try answer and reports it", () => {
    const { frame, onDone, container } = renderFrame(HINTS_FALLBACK);
    expect(screen.getByRole("button", { name: "Kiểm tra" })).toBeDisabled();
    expect(answerArea(container)).toHaveAttribute("data-tone", "idle");

    choose("a");
    expect(answerArea(container)).toHaveAttribute("data-tone", "selected");
    checkAnswer();

    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(answerArea(container)).toHaveAttribute("data-tone", "correct");
    expect(answerArea(container).querySelector(".lucide-check")).not.toBeNull();
    expect(screen.getByTestId("mascot")).toHaveTextContent("happy");
    expect(frame).toHaveAttribute("data-mascot", "happy");
    expect(screen.getByRole("button", { name: "Đáp án b" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Tiếp/ }));
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: true,
      wrongCount: 0,
    });
    expect(frame).toHaveAttribute("data-phase", "done");
    expect(screen.queryByRole("button", { name: /Tiếp/ })).toBeNull();
  });

  it("walks the three tiers with fallbacks when there are no visuals", () => {
    const { frame, onDone, container } = renderFrame(HINTS_FALLBACK);

    choose("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(answerArea(container)).toHaveAttribute("data-tone", "retry");
    expect(answerArea(container)).toHaveClass("animate-shake");
    // The graded mistake is handed over as wrong (and let go), never lit up
    // with the highlight colour; only the authored targets light up.
    expect(option("b")).toHaveAttribute("data-wrong");
    expect(option("b")).toHaveAttribute("aria-pressed", "false");
    expect(optionHighlight("b")).toBeNull();
    expect(optionHighlight("a")).toBeNull();
    expect(
      screen.getByText("Chọn cách viết đúng.").closest("[data-highlighted]"),
    ).not.toBeNull();
    const part = container.querySelector("#co-so");
    expect(part).toHaveAttribute("data-highlighted");
    expect(frame).toHaveAttribute("data-mascot", "idle");
    // No yellow at the first tier: the answer card gets the orange dashed
    // border, a hinted part its concept's outline, and a hinted block that
    // names no concept the neutral slate ring.
    expect(answerArea(container)).toHaveClass("border-dashed", "border-retry");
    expect(part).toHaveClass("outline-3", "outline-concept-blue");
    const blockRing = screen
      .getByText("Chọn cách viết đúng.")
      .closest("[data-highlighted]")
      ?.querySelector("[data-halo]");
    expect(blockRing).toHaveClass("border-concept-slate");
    expect(frame.querySelector('[class*="highlight"]')).toBeNull();

    choose("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(container.querySelector("[data-feedback-visual]")).toBeNull();
    expect(
      screen.getByText("Chọn cách viết đúng.").closest("[data-highlighted]"),
    ).toHaveAttribute("data-highlight-strong");
    expect(part).toHaveClass("outline-5");
    expect(frame.querySelector('[class*="highlight"]')).toBeNull();
    expect(frame).toHaveAttribute("data-mascot", "hint");

    choose("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(frame).toHaveAttribute("data-mascot", "cheer");
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Đáp án a" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Đáp án a" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Kiểm tra" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    expect(frame).toHaveAttribute("data-phase", "retype");
    expect(container.querySelector("[data-reveal]")).toBeNull();
    expect(screen.getByRole("button", { name: "Đáp án a" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Kiểm tra" })).toBeDisabled();

    choose("a");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    fireEvent.click(screen.getByRole("button", { name: /Tiếp/ }));
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 3,
    });
  });

  it("plays the hint and solution visuals when the exercise has them", async () => {
    const { frame, container } = renderFrame(HINTS_WITH_VISUALS);

    choose("b");
    checkAnswer();
    expect(container.querySelector("[data-feedback-visual]")).toBeNull();
    expect(slotOf("feedbackVisual")).toBe(false);

    choose("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(
      container.querySelector(
        '[data-feedback-visual="fixture.visual.dot-grid"]',
      ),
    ).not.toBeNull();
    // The answer component is told, so a bulky input can give up its place.
    expect(slotOf("feedbackVisual")).toBe(true);

    choose("b");
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(
      container.querySelector(
        '[data-feedback-visual="fixture.visual.bead-merge"]',
      ),
    ).not.toBeNull();
    expect(
      await screen.findByRole("figure", {
        name: "Nhân hai luỹ thừa cùng cơ số",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-reveal]")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    expect(container.querySelector("[data-feedback-visual]")).toBeNull();
    choose("a");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
  });

  it("nudges again when a retype is wrong", () => {
    const { frame } = renderFrame(HINTS_FALLBACK);
    for (let i = 0; i < 3; i++) {
      choose("b");
      checkAnswer();
    }
    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    choose("c");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "retype");
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(option("c")).toHaveAttribute("data-wrong");
  });

  it("does not shake with reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = (query: string) => ({
      ...original(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    });
    try {
      const { container } = renderFrame(HINTS_FALLBACK);
      choose("b");
      checkAnswer();
      expect(answerArea(container)).toHaveAttribute("data-tone", "retry");
      expect(answerArea(container)).not.toHaveClass("animate-shake");
    } finally {
      window.matchMedia = original;
    }
  });

  it("calls onCorrect in the tap that gets the answer accepted", () => {
    const { onCorrect } = renderFrame(HINTS_FALLBACK);
    choose("b");
    checkAnswer();
    expect(onCorrect).not.toHaveBeenCalled();
    choose("b");
    choose("a");
    checkAnswer();
    expect(onCorrect).toHaveBeenCalledTimes(1);
  });

  it("perches the owl on the answer card: 56px on a phone, 72px on a tablet", () => {
    const exercise = choiceExercise(["a"], HINTS_FALLBACK);
    const { container } = render(
      <ExerciseFrame exercise={exercise} onDone={vi.fn()}>
        {(slot) => <TestChoice exercise={exercise} slot={slot} />}
      </ExerciseFrame>,
    );
    const owl = container.querySelector("svg[data-mascot]");
    expect(owl).toHaveAttribute("data-mascot", "idle");
    expect(owl).toHaveClass("size-14", "md:size-18");
    // Absolute on the card's corner at every size, never taking a tap, so
    // the card keeps the full width.
    expect(owl?.parentElement).toHaveClass("pointer-events-none", "absolute");
    expect(owl?.parentElement?.className).not.toMatch(/\bmd:static\b/);
    choose("a");
    checkAnswer();
    expect(container.querySelector("svg[data-mascot]")).toHaveAttribute(
      "data-mascot",
      "happy",
    );
  });

  it("brings the feedback visual, then the revealed answer, into view", () => {
    const calls: [Element, ScrollIntoViewOptions | undefined][] = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (
      this: Element,
      options?: boolean | ScrollIntoViewOptions,
    ) {
      calls.push([this, typeof options === "object" ? options : undefined]);
    };
    try {
      const { container } = renderFrame(HINTS_WITH_VISUALS);
      choose("b");
      checkAnswer();
      expect(calls).toEqual([]);
      choose("b");
      checkAnswer();
      const visual = container.querySelector("[data-feedback-visual]");
      expect(calls.at(-1)).toEqual([
        visual,
        { block: "nearest", behavior: "smooth" },
      ]);
      // In the two-column layout the visual sits in the prompt's column.
      expect(visual).toHaveClass(
        "lg:landscape:col-start-1",
        "lg:landscape:row-start-2",
      );
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });

  it("jumps instead of gliding under reduced motion, and shows the reveal", () => {
    const calls: [Element, ScrollIntoViewOptions | undefined][] = [];
    const original = Element.prototype.scrollIntoView;
    const originalMatch = window.matchMedia;
    Element.prototype.scrollIntoView = function (
      this: Element,
      options?: boolean | ScrollIntoViewOptions,
    ) {
      calls.push([this, typeof options === "object" ? options : undefined]);
    };
    window.matchMedia = (query: string) => ({
      ...originalMatch(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    });
    try {
      const { container } = renderFrame(HINTS_FALLBACK);
      for (let i = 0; i < 3; i++) {
        choose("b");
        checkAnswer();
      }
      expect(calls.at(-1)).toEqual([
        answerArea(container),
        { block: "nearest", behavior: "auto" },
      ]);
    } finally {
      Element.prototype.scrollIntoView = original;
      window.matchMedia = originalMatch;
    }
  });

  it("lifts an answer area that ends under the bottom bar, keeping the prompt on screen", () => {
    const scrollBy = vi.fn();
    const originalScrollBy = window.scrollBy;
    const originalRect = Element.prototype.getBoundingClientRect;
    window.scrollBy = scrollBy as typeof window.scrollBy;
    // Frame starts 100px down the page; the answer ends 40px below the bar.
    const tops: Record<string, [number, number]> = {
      "section[data-phase]": [100, 900],
      "[data-answer-area]": [300, 740],
      "[data-bottom-bar]": [700, 800],
    };
    Element.prototype.getBoundingClientRect = function (this: Element) {
      const hit = Object.entries(tops).find(([sel]) => this.matches(sel));
      const [top, bottom] = hit?.[1] ?? [0, 0];
      return {
        top,
        bottom,
        left: 0,
        right: 0,
        width: 0,
        height: bottom - top,
        x: 0,
        y: top,
        toJSON: () => ({}),
      };
    };
    try {
      renderFrame(HINTS_FALLBACK);
      expect(scrollBy).toHaveBeenCalledWith({ top: 40, behavior: "auto" });

      scrollBy.mockClear();
      tops["[data-answer-area]"] = [300, 950];
      renderFrame(HINTS_FALLBACK);
      // Never further than the frame's own top.
      expect(scrollBy).toHaveBeenCalledWith({ top: 100, behavior: "auto" });
    } finally {
      window.scrollBy = originalScrollBy;
      Element.prototype.getBoundingClientRect = originalRect;
    }
  });

  it("shakes again on the next wrong check once the shake ended", () => {
    const { container } = renderFrame(HINTS_FALLBACK);
    choose("b");
    checkAnswer();
    endAnimation(answerArea(container));
    expect(answerArea(container)).not.toHaveClass("animate-shake");
    choose("b");
    checkAnswer();
    expect(answerArea(container)).toHaveClass("animate-shake");
  });
});
