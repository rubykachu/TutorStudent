import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type AnswerSlotProps,
  ExerciseFrame,
} from "@/exercises/exercise-frame";
import { encouragementFor, praiseFor } from "@/exercises/feedback";
import type { ChoiceInput } from "@/exercises/input";
import { JINGLE_ID, OOPS_ID } from "@/lib/sound-manifest";
import {
  ENCOURAGE_LINES,
  OWL_LINE_MAX_WORDS,
  OWL_LINES,
  PRAISE_LINES,
  VOICE_LINES,
} from "@/mascot/lines";
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

// Stubs getBoundingClientRect: the first selector an element matches gives
// its [top, bottom]; the entries are read at call time, so a test may move them.
function mockRects(tops: Record<string, [number, number]>) {
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
}

function renderFrame(hints: Hints) {
  const exercise: ChoiceExercise = {
    ...choiceExercise(["a"], hints),
    prompt: [
      { type: "note", text: "Chọn cách viết đúng." },
      { type: "formula", tex: "\\htmlId{co-so}{2}^{3}" },
    ],
  };
  const onDone = vi.fn();
  const sounds = {
    play: vi.fn<(clipIds: readonly string[]) => void>(),
    tap: vi.fn<() => void>(),
    button: vi.fn<() => void>(),
  };
  const view = render(
    <ExerciseFrame
      exercise={exercise}
      concepts={CONCEPTS}
      onDone={onDone}
      sounds={sounds}
      renderMascot={(expression) => (
        <span data-testid="mascot">{expression}</span>
      )}
    >
      {(slot) => <TestChoice exercise={exercise} slot={slot} />}
    </ExerciseFrame>,
  );
  const frame = view.container.querySelector("section");
  if (!frame) throw new Error("frame missing");
  return { frame, onDone, sounds, container: view.container };
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

function bubble(container: HTMLElement) {
  return container.querySelector("[data-mascot-speech]");
}

function liveRegion(container: HTMLElement) {
  return container.querySelector('[aria-live="polite"]');
}

describe("ExerciseFrame owl speech", () => {
  it("encourages at tier one, then speaks the hint and reveal lines", () => {
    const { container } = renderFrame(HINTS_FALLBACK);
    expect(bubble(container)).toBeNull();

    choose("b");
    checkAnswer();
    const encouragement = bubble(container)?.textContent ?? "";
    expect(ENCOURAGE_LINES.map((l) => l.text)).toContain(encouragement);
    expect(liveRegion(container)).toHaveTextContent(encouragement);

    choose("b");
    checkAnswer();
    expect(bubble(container)).toHaveTextContent(OWL_LINES.hintMarks.text);
    expect(liveRegion(container)).toHaveTextContent(OWL_LINES.hintMarks.text);

    choose("b");
    checkAnswer();
    expect(bubble(container)).toHaveTextContent(OWL_LINES.reveal.text);
    expect(liveRegion(container)).toHaveTextContent(OWL_LINES.reveal.text);
    // Hidden from screen readers, which hear the live region instead.
    expect(bubble(container)).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    expect(bubble(container)).toBeNull();
    choose("a");
    checkAnswer();
    const praise = bubble(container)?.textContent ?? "";
    expect(PRAISE_LINES.map((l) => l.text)).toContain(praise);
    expect(liveRegion(container)).toHaveTextContent(praise);
  });

  it("points at the hint and solution visuals when there are some", () => {
    const { container } = renderFrame(HINTS_WITH_VISUALS);
    choose("b");
    checkAnswer();
    choose("b");
    checkAnswer();
    expect(bubble(container)).toHaveTextContent(OWL_LINES.hintVisual.text);
    choose("b");
    checkAnswer();
    expect(bubble(container)).toHaveTextContent(OWL_LINES.solutionVisual.text);
  });

  it("keeps every line short", () => {
    for (const { text } of VOICE_LINES) {
      expect(text.split(/\s+/).length).toBeLessThanOrEqual(OWL_LINE_MAX_WORDS);
    }
  });

  it("picks the same lines for the same attempt", () => {
    expect(ENCOURAGE_LINES).toContainEqual(encouragementFor("ex.a#1"));
    expect(encouragementFor("ex.a#1")).toEqual(encouragementFor("ex.a#1"));
    expect(praiseFor("ex.a#1")).toEqual(praiseFor("ex.a#1"));
  });

  it("varies the praise across attempts", () => {
    const picked = new Set(
      Array.from({ length: 40 }, (_, i) => praiseFor(`ex.${i}#nonce`)),
    );
    expect(picked.size).toBeGreaterThan(1);
    for (const line of picked) expect(PRAISE_LINES).toContainEqual(line);
  });
});

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
    expect(frame).toHaveAttribute("data-mascot", "cheer");
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
    expect(part).toHaveClass("outline-4");
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

  it("celebrates only the tap that gets the answer accepted", () => {
    const { container } = renderFrame(HINTS_FALLBACK);
    choose("b");
    checkAnswer();
    expect(container.querySelector("[data-confetti]")).toBeNull();
    choose("b");
    choose("a");
    checkAnswer();
    expect(container.querySelector("[data-confetti]")).toBeInTheDocument();
  });

  it("makes a sound on every check and voices every bubble line", () => {
    const { sounds, container } = renderFrame(HINTS_FALLBACK);
    const cue = () => sounds.play.mock.calls.at(-1)?.[0] ?? [];
    const spokenLine = () =>
      VOICE_LINES.find((line) => line.id === cue().at(-1));

    choose("b");
    checkAnswer();
    // First wrong check: the encouragement, as the bubble shows it.
    expect(cue()).toHaveLength(1);
    expect(ENCOURAGE_LINES).toContainEqual(spokenLine());
    expect(bubble(container)).toHaveTextContent(spokenLine()?.text ?? "");

    choose("b");
    checkAnswer();
    expect(cue()).toEqual([OOPS_ID, OWL_LINES.hintMarks.id]);
    choose("b");
    checkAnswer();
    expect(cue()).toEqual([OOPS_ID, OWL_LINES.reveal.id]);

    // A miss while entering the shown answer again: the tone alone, as the
    // owl says nothing then.
    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    choose("c");
    checkAnswer();
    expect(cue()).toEqual([OOPS_ID]);
    expect(bubble(container)).toBeNull();

    // Correct after wrong checks: the jingle, then the praise shown.
    choose("a");
    checkAnswer();
    expect(cue()[0]).toBe(JINGLE_ID);
    expect(PRAISE_LINES).toContainEqual(spokenLine());
    expect(bubble(container)).toHaveTextContent(spokenLine()?.text ?? "");
    expect(sounds.play).toHaveBeenCalledTimes(5);
  });

  it("lets the child play an accepted exercise again, unrated", () => {
    const { frame, onDone, sounds, container } = renderFrame(HINTS_FALLBACK);
    choose("b");
    checkAnswer();
    choose("a");
    checkAnswer();
    const firstSeed = lastSlot?.seed;
    expect(screen.getByRole("button", { name: /Tiếp/ })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));

    // A clean slate: nothing chosen, no feedback, a new arrangement.
    expect(frame).toHaveAttribute("data-phase", "idle");
    expect(frame).toHaveAttribute("data-tier", "0");
    expect(option("a")).toHaveAttribute("aria-pressed", "false");
    expect(bubble(container)).toBeNull();
    expect(container.querySelector("[data-confetti]")).toBeNull();
    expect(lastSlot?.seed).not.toBe(firstSeed);

    // Right on the first try this time, with the full celebration...
    choose("a");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(sounds.play.mock.calls.at(-1)?.[0][0]).toBe(JINGLE_ID);
    // ...but the outcome recorded is still that of the first play.
    fireEvent.click(screen.getByRole("button", { name: /Tiếp/ }));
    expect(onDone).toHaveBeenCalledOnce();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 1,
    });
  });

  it("celebrates without confetti under reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = (query: string) => ({
      ...original(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    });
    try {
      const { sounds, container } = renderFrame(HINTS_FALLBACK);
      choose("a");
      checkAnswer();
      expect(sounds.play).toHaveBeenCalledTimes(1);
      expect(container.querySelector("[data-confetti]")).toBeNull();
      expect(screen.getByTestId("mascot")).toHaveTextContent("happy");
    } finally {
      window.matchMedia = original;
    }
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
        "lg:landscape:@min-[50rem]:col-start-1",
        "lg:landscape:@min-[50rem]:row-start-2",
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

  it("lifts the whole answer area above the bottom bar, keeping the card's top on screen", () => {
    const scrollBy = vi.fn();
    const originalScrollBy = window.scrollBy;
    const originalRect = Element.prototype.getBoundingClientRect;
    window.scrollBy = scrollBy as typeof window.scrollBy;
    // The answer card's column starts 280px down the screen, the owl 16px
    // above it; the answer ends 40px below the bar.
    const tops: Record<string, [number, number]> = {
      "section[data-phase]": [100, 900],
      "[data-answer-column]": [280, 740],
      "[data-mascot-slot]": [264, 330],
      "[data-answer-area]": [300, 740],
      "[data-bottom-bar]": [700, 800],
    };
    mockRects(tops);
    try {
      renderFrame(HINTS_FALLBACK);
      expect(scrollBy).toHaveBeenCalledWith({ top: 40, behavior: "auto" });

      // A tall prompt: lifting the last option above the bar scrolls the
      // prompt's top off the screen, which is fine.
      scrollBy.mockClear();
      tops["[data-answer-area]"] = [300, 900];
      renderFrame(HINTS_FALLBACK);
      expect(scrollBy).toHaveBeenCalledWith({ top: 200, behavior: "auto" });

      // A card taller than the screen shows from its start, owl included.
      scrollBy.mockClear();
      tops["[data-answer-area]"] = [300, 1400];
      renderFrame(HINTS_FALLBACK);
      expect(scrollBy).toHaveBeenCalledWith({ top: 264, behavior: "auto" });
    } finally {
      window.scrollBy = originalScrollBy;
      Element.prototype.getBoundingClientRect = originalRect;
    }
  });

  it("lifts the answer again when the praise bubble pushes it under the bar", () => {
    const scrollBy = vi.fn();
    const originalScrollBy = window.scrollBy;
    const originalRect = Element.prototype.getBoundingClientRect;
    window.scrollBy = scrollBy as typeof window.scrollBy;
    const tops: Record<string, [number, number]> = {
      "section[data-phase]": [100, 700],
      "[data-answer-column]": [280, 690],
      "[data-mascot-slot]": [264, 330],
      "[data-answer-area]": [300, 690],
      "[data-bottom-bar]": [700, 800],
    };
    mockRects(tops);
    try {
      renderFrame(HINTS_FALLBACK);
      expect(scrollBy).not.toHaveBeenCalled();
      // The bubble above the answer adds 60px once the answer is accepted.
      tops["[data-answer-area]"] = [360, 750];
      choose("a");
      checkAnswer();
      expect(scrollBy).toHaveBeenCalledWith({ top: 50, behavior: "auto" });
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
