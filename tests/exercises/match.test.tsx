import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  leftOf,
  pairItems,
  tapItem,
  unpairLeft,
} from "@/exercises/match/pairs";
import type { Hints, MatchExercise } from "@/schema/content";
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

function text(id: string, value: string) {
  return { id, content: { type: "text" as const, text: value } };
}

function matchExercise(hints: Hints = NO_HINTS): MatchExercise {
  return {
    id: "test.ex.ghep",
    type: "match",
    cardIds: [],
    prompt: [{ type: "note", text: "Nối phép nhân với kết quả." }],
    left: [text("hai-ba", "2 × 3"), text("hai-bon", "2 × 4")],
    // "nam" pairs with nothing: a distractor.
    right: [text("sau", "6"), text("tam", "8"), text("nam", "5")],
    pairs: [
      { left: "hai-ba", right: "sau" },
      { left: "hai-bon", right: "tam" },
    ],
    hints,
    difficulty: 1,
  };
}

function renderMatch(hints: Hints = NO_HINTS) {
  const exercise = matchExercise(hints);
  return renderExercise(exercise);
}

function item(id: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(`[data-item="${id}"]`);
  if (!el) throw new Error(`item ${id} missing`);
  return el;
}

function tap(id: string) {
  fireEvent.click(item(id));
}

function pair(left: string, right: string) {
  tap(left);
  tap(right);
}

// Number badge shown on an item; empty when it is not paired.
function badge(id: string): string {
  return item(id).querySelector("span")?.textContent ?? "";
}

describe("match pairs", () => {
  it("keeps pairs one-to-one when re-pairing", () => {
    const pairs = pairItems({ a: "x", b: "y" }, "a", "y");
    expect(pairs).toEqual({ a: "y" });
    expect(leftOf(pairs, "y")).toBe("a");
    expect(leftOf(pairs, "x")).toBeUndefined();
    expect(unpairLeft(pairs, "a")).toEqual({});
  });

  it("arms, re-arms, pairs from either side and splits an existing pair", () => {
    const left = { side: "left", id: "a" } as const;
    const right = { side: "right", id: "x" } as const;
    expect(tapItem({}, null, left)).toEqual({ pairs: {}, armed: left });
    expect(tapItem({}, left, left)).toEqual({ pairs: {}, armed: null });
    const other = { side: "left", id: "b" } as const;
    expect(tapItem({}, left, other)).toEqual({ pairs: {}, armed: other });
    expect(tapItem({}, right, left)).toEqual({
      pairs: { a: "x" },
      armed: null,
    });
    expect(tapItem({ a: "x" }, left, right)).toEqual({
      pairs: {},
      armed: null,
    });
  });

  it("treats prototype names as plain ids", () => {
    expect(
      tapItem(
        {},
        { side: "left", id: "constructor" },
        {
          side: "right",
          id: "x",
        },
      ).pairs,
    ).toEqual({ constructor: "x" });
  });
});

describe("MatchAnswer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pairs by tapping without any drag and accepts the right pairs", () => {
    const { frame, onDone } = renderMatch();
    expect(checkButton()).toBeDisabled();

    tap("hai-ba");
    expect(item("hai-ba")).toHaveAttribute("aria-pressed", "true");
    tap("sau");
    expect(item("hai-ba")).toHaveAttribute("aria-pressed", "false");
    expect(badge("hai-ba")).toBe("1");
    expect(badge("sau")).toBe("1");
    expect(item("sau")).toHaveTextContent("đã nối với mục 1");
    expect(checkButton()).toBeEnabled();

    // Right side first works too.
    pair("tam", "hai-bon");
    expect(badge("tam")).toBe("2");
    expect(badge("nam")).toBe("");

    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(item("sau")).toBeDisabled();
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: true,
      wrongCount: 0,
    });
  });

  it("moves a pair when an item is paired again and splits it on a repeat", () => {
    renderMatch();
    pair("hai-ba", "sau");
    pair("hai-bon", "sau");
    expect(badge("sau")).toBe("2");
    expect(badge("hai-ba")).toBe("");

    pair("hai-bon", "sau");
    expect(badge("sau")).toBe("");
    expect(checkButton()).toBeDisabled();
  });

  it("marks wrong pairs by id, then falls back to strong marks and a reveal", () => {
    const { frame, onDone, container } = renderMatch();
    pair("hai-ba", "nam");
    pair("hai-bon", "tam");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(highlightOf(item("hai-ba"))).not.toBeNull();
    expect(highlightOf(item("nam"))).not.toBeNull();
    // Never the right item the child should have chosen, nor correct pairs.
    expect(highlightOf(item("sau"))).toBeNull();
    expect(highlightOf(item("hai-bon"))).toBeNull();
    expect(highlightOf(item("tam"))).toBeNull();

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(container.querySelector("[data-feedback-visual]")).toBeNull();
    expect(highlightOf(item("nam"))).toHaveAttribute("data-highlight-strong");

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(revealed(container)).not.toBeNull();
    expect(badge("sau")).toBe("1");
    expect(badge("tam")).toBe("2");
    expect(badge("nam")).toBe("");
    expect(item("hai-ba")).toBeDisabled();

    startRetype();
    expect(revealed(container)).toBeNull();
    expect(badge("sau")).toBe("");
    expect(checkButton()).toBeDisabled();
    pair("hai-ba", "sau");
    pair("hai-bon", "tam");
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 3,
    });
  });

  it("plays hint and solution visuals instead of the fallbacks", () => {
    const { frame, container } = renderMatch(VISUAL_HINTS);
    pair("hai-ba", "tam");
    checkAnswer();
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(feedbackVisual(container, "fixture.visual.dot-grid")).not.toBeNull();
    expect(highlightOf(item("tam"))).not.toHaveAttribute(
      "data-highlight-strong",
    );
    checkAnswer();
    expect(
      feedbackVisual(container, "fixture.visual.bead-merge"),
    ).not.toBeNull();
    expect(revealed(container)).toBeNull();
    expect(badge("tam")).toBe("1");
  });

  it("lights an authored hint target in its concept colour", () => {
    renderMatch({
      highlight: [
        { target: "option", id: "sau", conceptId: "test.concept.nhan-vat" },
      ],
    });
    pair("hai-ba", "tam");
    checkAnswer();
    const wrapper = highlightOf(item("sau"));
    expect(wrapper?.querySelector(".border-concept-pink")).not.toBeNull();
  });

  it("pairs by dragging a left item onto a right item", () => {
    renderMatch();
    // jsdom has no layout: left items in a column at x 0, right items in a
    // column at x 300, one row every 60px, so the drop lands on "tam".
    const cells: Record<string, [number, number]> = {
      "hai-ba": [0, 0],
      "hai-bon": [0, 60],
      sau: [300, 0],
      tam: [300, 60],
      nam: [300, 120],
    };
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const [x, y] = cells[this.getAttribute("data-item") ?? ""] ?? [0, 0];
        return new DOMRect(x, y, 200, 50);
      },
    );
    const source = item("hai-bon");
    fireEvent.pointerDown(source, {
      isPrimary: true,
      button: 0,
      clientX: 100,
      clientY: 85,
    });
    fireEvent.pointerMove(document, { clientX: 150, clientY: 85 });
    fireEvent.pointerMove(document, { clientX: 400, clientY: 85 });
    fireEvent.pointerUp(document, { clientX: 400, clientY: 85 });

    expect(badge("tam")).toBe("2");
    expect(badge("hai-bon")).toBe("2");
    // The drag did not also arm the item it started on.
    expect(source).toHaveAttribute("aria-pressed", "false");
  });
});
