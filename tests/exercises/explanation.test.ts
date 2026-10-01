import { describe, expect, it } from "vitest";
import { resolveExplanation } from "@/exercises/explanation";
import { THOUSANDS_SEPARATOR } from "@/lib/number-format";
import type { BasicExercise } from "@/schema/content";
import {
  choiceExercise,
  fillBlankExercise,
  numericExercise,
  orderExercise,
} from "./helpers";

const SOLUTION = { highlight: [], solutionVisualId: "fixture.visual.dot-grid" };

describe("resolveExplanation", () => {
  it("returns the authored explanation, with the options a wrong reason names", () => {
    const exercise: BasicExercise = {
      ...choiceExercise(["a"]),
      explain: {
        text: "Vì 2 · 7 = 14.",
        tex: "14 = 2 \\cdot 7",
        wrong: [{ optionId: "b", text: "14 không chia hết cho b." }],
      },
    };
    expect(resolveExplanation(exercise)).toEqual({
      authored: true,
      text: "Vì 2 · 7 = 14.",
      tex: "14 = 2 \\cdot 7",
      visualId: undefined,
      wrong: [
        {
          content: { type: "text", text: "b" },
          text: "14 không chia hết cho b.",
        },
      ],
      answer: [],
    });
  });

  it("falls back to the accepted answers of a choice", () => {
    const resolved = resolveExplanation(choiceExercise(["a", "c"]));
    expect(resolved?.authored).toBe(false);
    expect(resolved?.answer).toEqual([
      [{ type: "text", text: "a" }],
      [{ type: "text", text: "c" }],
    ]);
  });

  it("writes a numeric answer with the thousands separator and unit", () => {
    const exercise = {
      ...numericExercise({ kind: "value", value: 1024 }),
      unit: "cm",
    };
    expect(resolveExplanation(exercise)?.answer).toEqual([
      [{ type: "text", text: `1${THOUSANDS_SEPARATOR}024 cm` }],
    ]);
    expect(
      resolveExplanation(numericExercise({ kind: "value", value: 2.5 }))
        ?.answer,
    ).toEqual([[{ type: "text", text: "2,5" }]]);
  });

  it("writes a negative answer with the minus sign", () => {
    expect(
      resolveExplanation(numericExercise({ kind: "value", value: -5 }))?.answer,
    ).toEqual([[{ type: "text", text: "−5" }]]);
    expect(
      resolveExplanation(
        numericExercise({ kind: "power", base: -2, exponent: 3 }),
      )?.answer,
    ).toEqual([[{ type: "formula", tex: "(-2)^{3}" }]]);
  });

  it("writes a power answer as a formula", () => {
    expect(
      resolveExplanation(
        numericExercise({ kind: "power", base: 3, exponent: 4 }),
      )?.answer,
    ).toEqual([[{ type: "formula", tex: "3^{4}" }]]);
  });

  it("lists blanks and ordered items", () => {
    expect(
      resolveExplanation(fillBlankExercise(["Lan", "lan"]))?.answer,
    ).toEqual([[{ type: "text", text: "Lan" }]]);
    expect(resolveExplanation(orderExercise(["x", "y"]))?.answer).toHaveLength(
      2,
    );
  });

  it("carries the solution visual of an exercise", () => {
    const resolved = resolveExplanation(
      numericExercise({ kind: "value", value: 4 }, SOLUTION),
    );
    expect(resolved?.visualId).toBe("fixture.visual.dot-grid");
  });

  it("has nothing to show when the answer is only revealed in place", () => {
    const exercise: BasicExercise = {
      id: "test.ex.vung",
      type: "tapRegion",
      cardIds: [],
      prompt: [{ type: "note", text: "Chạm" }],
      hints: { highlight: [] },
      difficulty: 1,
      visualId: "fixture.visual.dot-grid",
      answer: ["r"],
    };
    expect(resolveExplanation(exercise)).toBeNull();
  });
});
