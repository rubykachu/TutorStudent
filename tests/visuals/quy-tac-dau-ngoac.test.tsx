import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/quy-tac-dau-ngoac/catalog";
import { FlipTry } from "@/visuals/math/quy-tac-dau-ngoac/flip-try";
import {
  bracketFree,
  bracketTerms,
  goalMask,
  LESSON_SLUG,
  maskState,
  type Piece,
  stateMask,
  sumValue,
} from "@/visuals/math/quy-tac-dau-ngoac/logic";

const term = (value: number): Piece => ({ kind: "term", value });
const group = (lead: "+" | "-" | "", ...terms: number[]): Piece => ({
  kind: "group",
  lead,
  terms,
});

describe("goalMask", () => {
  it("marks exactly the terms of the brackets with a minus before them", () => {
    const pieces = [
      term(5),
      group("-", 3, -8),
      group("+", 6, -2),
      group("-", 1, 4),
    ];
    expect(goalMask(pieces)).toBe(0b110011);
    expect(bracketTerms(pieces)).toHaveLength(6);
  });

  it("leaves a bracket at the start of the sum, and a plus bracket, unchanged", () => {
    expect(goalMask([group("", 7, -10), group("+", 4)])).toBe(0);
  });
});

describe("bracketFree", () => {
  it("keeps loose terms and negates the changed bracket terms", () => {
    const pieces = [term(10), group("-", 3, -5, 2)];
    expect(bracketFree(pieces, 0)).toEqual([10, 3, -5, 2]);
    expect(bracketFree(pieces, 0b111)).toEqual([10, -3, 5, -2]);
  });

  it("gives the value of the bracketed sum when the goal signs are changed", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "flipTry") continue;
      const free = bracketFree(spec.pieces, goalMask(spec.pieces));
      expect(
        free.reduce((a, b) => a + b, 0),
        key,
      ).toBe(sumValue(spec.pieces));
    }
  });
});

describe("state helpers", () => {
  it("round-trips a mask through the keys f0, f1, …", () => {
    expect(maskState(0b101, 3)).toEqual({ f0: 1, f1: 0, f2: 1 });
    expect(stateMask({ f0: 1, f1: 0, f2: 1 }, 3)).toBe(0b101);
    expect(stateMask({}, 3)).toBe(0);
  });
});

describe("the lesson", () => {
  const lesson = JSON.parse(
    readFileSync(`content/math/kntt/${LESSON_SLUG}/lesson.json`, "utf8"),
  ) as {
    exercises: {
      type: string;
      visualId?: string;
      params?: Record<string, number>;
    }[];
  };
  const keyOf = (id: string) => id.slice(`${LESSON_SLUG}.visual.`.length);

  it("asks each sign-change exercise for exactly the goal of its picture", () => {
    for (const exercise of lesson.exercises) {
      if (exercise.type !== "manipulate" || !exercise.visualId) continue;
      const spec = VISUAL_SPECS[keyOf(exercise.visualId)];
      if (spec?.kind !== "flipTry") continue;
      const size = bracketTerms(spec.pieces).length;
      expect(exercise.params, exercise.visualId).toEqual(
        maskState(goalMask(spec.pieces), size),
      );
    }
  });

  it("asks each pick exercise for the chips and no other", () => {
    for (const exercise of lesson.exercises) {
      if (exercise.type !== "manipulate" || !exercise.visualId) continue;
      const spec = VISUAL_SPECS[keyOf(exercise.visualId)];
      if (spec?.kind !== "chips") continue;
      expect(
        Object.keys(exercise.params ?? {}).sort(),
        exercise.visualId,
      ).toEqual(spec.items.map((_, i) => `i${i}`).sort());
    }
  });
});

describe("FlipTry", () => {
  const spec = {
    label: "Bỏ ngoặc",
    pieces: [term(10), group("-", 3, 4)],
  } as const;

  it("reports the opening state at once", () => {
    const onStateChange = vi.fn();
    render(
      <FlipTry
        spec={spec}
        params={{ f0: 1, f1: 1 }}
        onStateChange={onStateChange}
      />,
    );
    expect(onStateChange).toHaveBeenCalledWith({ f0: 0, f1: 0 });
  });

  it("changes the sign of a term when it is tapped and writes the sum without brackets", () => {
    const onStateChange = vi.fn();
    render(
      <FlipTry
        spec={spec}
        params={{ f0: 1, f1: 1 }}
        onStateChange={onStateChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Số hạng \+3/ }));
    expect(onStateChange).toHaveBeenLastCalledWith({ f0: 1, f1: 0 });
    expect(screen.getByText("Đã đổi dấu 1 số hạng")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("10−3+4");
  });

  it("shows the state it is given and locks", () => {
    render(
      <FlipTry
        spec={spec}
        params={{ f0: 1, f1: 1 }}
        shownState={{ f0: 1, f1: 1 }}
      />,
    );
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
    expect(screen.getByRole("status")).toHaveTextContent("10−3−4");
  });

  it("does not say whether an exercise answer is right", () => {
    render(
      <FlipTry
        spec={spec}
        params={{ f0: 1, f1: 1 }}
        shownState={{ f0: 1, f1: 1 }}
      />,
    );
    expect(screen.queryByText(/Xong rồi/)).toBeNull();
  });
});
