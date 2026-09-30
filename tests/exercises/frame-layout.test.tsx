import { describe, expect, it } from "vitest";
import { promptNeedsFullWidth } from "@/exercises/exercise-frame";
import type { ChoiceExercise, PassageBlock } from "@/schema/content";
import { choiceExercise } from "./helpers";
import { renderExercise } from "./render";

const PASSAGE: PassageBlock = {
  type: "passage",
  paragraphs: [
    {
      sentences: [
        {
          id: "s1",
          text: "– Lại đây chơi với mình đi – hoàng tử bé đề nghị nó.",
        },
        { id: "s2", text: "– Mình buồn quá…" },
      ],
    },
  ],
  annotations: [],
};

function withPrompt(prompt: ChoiceExercise["prompt"]): ChoiceExercise {
  return { ...choiceExercise(["a"]), prompt };
}

function layoutOf(container: HTMLElement) {
  const grid = container.querySelector("[data-exercise-layout]");
  if (!grid) throw new Error("layout missing");
  return grid;
}

describe("exercise layout on a landscape tablet", () => {
  it("puts a short question in a prompt column at least 26rem wide", () => {
    const { container } = renderExercise(
      withPrompt([{ type: "note", text: "Luỹ thừa này bằng tích nào?" }]),
    );
    const grid = layoutOf(container);
    expect(grid).toHaveAttribute("data-exercise-layout", "columns");
    expect(grid.className).toContain(
      "lg:landscape:@min-[50rem]:grid-cols-[minmax(26rem,1fr)_minmax(0,1fr)]",
    );
    expect(
      container.querySelector("[data-answer-column]")?.className,
    ).toContain("lg:landscape:@min-[50rem]:col-start-2");
  });

  it("gives a reading passage the full width above the answer", () => {
    const { container } = renderExercise(
      withPrompt([
        { type: "note", text: "Lúc gặp cáo, hoàng tử bé cảm thấy thế nào?" },
        PASSAGE,
      ]),
    );
    const grid = layoutOf(container);
    expect(grid).toHaveAttribute("data-exercise-layout", "stacked");
    expect(grid.className).not.toContain("lg:landscape:");
    expect(
      container.querySelector("[data-answer-column]")?.className,
    ).not.toContain("lg:landscape:");
  });

  it("gives a long question the full width too", () => {
    const long = "Đọc kĩ câu hỏi. ".repeat(20);
    expect(
      promptNeedsFullWidth(withPrompt([{ type: "note", text: long }])),
    ).toBe(true);
    expect(
      promptNeedsFullWidth(
        withPrompt([{ type: "note", text: "Chọn đáp án." }]),
      ),
    ).toBe(false);
    expect(promptNeedsFullWidth(withPrompt([PASSAGE]))).toBe(true);
  });
});
