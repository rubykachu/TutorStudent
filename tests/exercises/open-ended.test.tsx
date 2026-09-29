import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  OpenEndedRunner,
  type StepRenderer,
} from "@/exercises/open-ended/open-ended-runner";
import { hasOwnWriting, writingStats } from "@/exercises/open-ended/writing";
import type { OpenEndedExercise } from "@/schema/content";
import { choiceExercise } from "./helpers";

const STARTER = "Có một lần, em đã giúp bạn";
const RUBRIC = [
  "Kể được việc em đã làm.",
  "Nói được bạn cảm thấy thế nào.",
  "Viết từ hai câu trở lên.",
];

function exercise(stepCount: number): OpenEndedExercise {
  const steps = Array.from({ length: stepCount }, (_, index) => ({
    ...choiceExercise(["a"]),
    id: `test.ex.buoc-${index + 1}`,
    prompt: [{ type: "note" as const, text: `Câu hỏi bước ${index + 1}` }],
  }));
  return {
    id: "test.ex.viet",
    type: "openEnded",
    cardIds: [],
    prompt: [{ type: "note", text: "Kể về một lần em giúp bạn." }],
    hints: { highlight: [] },
    difficulty: 2,
    steps,
    writing: { starter: STARTER, rubric: RUBRIC },
  };
}

// Stands in for the real answer components: one button per choice option.
const renderStep: StepRenderer = (step, slot) => {
  if (step.type !== "choice") throw new Error(`unexpected ${step.type}`);
  return (
    <div data-step-answer={step.id}>
      {step.options.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={slot.disabled}
          onClick={() =>
            slot.onChange({ type: "choice", selected: [option.id] })
          }
        >
          {`Chọn ${option.id}`}
        </button>
      ))}
    </div>
  );
};

function renderRunner(stepCount: number) {
  const onDone = vi.fn();
  const view = render(
    <OpenEndedRunner
      exercise={exercise(stepCount)}
      renderStep={renderStep}
      onDone={onDone}
    />,
  );
  const stage = () =>
    view.container
      .querySelector("[data-open-ended]")
      ?.getAttribute("data-stage");
  return { onDone, stage, container: view.container };
}

function answer(option: string) {
  fireEvent.click(screen.getByRole("button", { name: `Chọn ${option}` }));
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
}

function textarea(): HTMLTextAreaElement {
  return screen.getByLabelText("Bài viết của em");
}

describe("OpenEndedRunner", () => {
  it("runs the steps in order before the writing task", () => {
    const { stage, container } = renderRunner(2);
    expect(screen.getByText("Kể về một lần em giúp bạn.")).toBeInTheDocument();
    expect(stage()).toBe("steps");
    expect(screen.getByText("Câu hỏi bước 1")).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 2")).toBeInTheDocument();
    expect(screen.queryByText("Câu hỏi bước 2")).toBeNull();

    answer("a");
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    expect(screen.queryByText("Câu hỏi bước 1")).toBeNull();
    expect(screen.getByText("Câu hỏi bước 2")).toBeInTheDocument();
    expect(screen.getByText("Bước 2 trên 2")).toBeInTheDocument();
    // The second step starts from a fresh frame, not the accepted first one.
    expect(container.querySelector("section")).toHaveAttribute(
      "data-phase",
      "idle",
    );

    answer("a");
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    expect(stage()).toBe("writing");
    expect(textarea()).toHaveValue(STARTER);
  });

  it("goes straight to writing when there are no steps", () => {
    const { stage } = renderRunner(0);
    expect(stage()).toBe("writing");
    expect(screen.queryByRole("button", { name: "Kiểm tra" })).toBeNull();
  });

  it("needs the child's own words before the writing counts", () => {
    renderRunner(0);
    const done = screen.getByRole("button", { name: "Xong" });
    expect(screen.getByText(STARTER, { selector: "span" })).toBeInTheDocument();
    expect(done).toBeDisabled();

    fireEvent.change(textarea(), { target: { value: "   " } });
    expect(done).toBeDisabled();
    fireEvent.change(textarea(), { target: { value: `${STARTER}  ` } });
    expect(done).toBeDisabled();

    fireEvent.change(textarea(), {
      target: { value: `${STARTER} học bài. Bạn rất vui!` },
    });
    expect(done).toBeEnabled();
    expect(screen.getByText("Em đã viết 2 câu, 12 chữ.")).toBeInTheDocument();
  });

  it("lets the child tick the rubric, edit again and finish once", () => {
    const { onDone, stage } = renderRunner(1);
    fireEvent.click(screen.getByRole("button", { name: "Chọn b" }));
    fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
    answer("a");
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));

    const text = `${STARTER} chép bài khi bạn bị ốm.`;
    fireEvent.change(textarea(), { target: { value: `  ${text}\n` } });
    fireEvent.click(screen.getByRole("button", { name: "Xong" }));
    expect(stage()).toBe("checklist");
    expect(screen.getByText(text)).toBeInTheDocument();

    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(3);
    for (const box of boxes) expect(box).not.toBeChecked();
    fireEvent.click(screen.getByLabelText(RUBRIC[0] ?? ""));
    fireEvent.click(screen.getByLabelText(RUBRIC[2] ?? ""));
    fireEvent.click(screen.getByLabelText(RUBRIC[2] ?? ""));
    expect(screen.getByLabelText(RUBRIC[0] ?? "")).toBeChecked();
    expect(screen.getByLabelText(RUBRIC[2] ?? "")).not.toBeChecked();

    // Editing keeps both the text and the ticks.
    fireEvent.click(screen.getByRole("button", { name: "Sửa bài" }));
    expect(textarea()).toHaveValue(text);
    fireEvent.click(screen.getByRole("button", { name: "Xong" }));
    expect(screen.getByLabelText(RUBRIC[0] ?? "")).toBeChecked();

    const finish = screen.getByRole("button", { name: "Hoàn thành" });
    fireEvent.click(finish);
    fireEvent.click(finish);
    expect(stage()).toBe("finished");
    expect(finish).toBeDisabled();
    expect(screen.getByLabelText(RUBRIC[1] ?? "")).toBeDisabled();
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledWith({
      steps: [{ firstTryCorrect: false, wrongCount: 1 }],
      writing: {
        text,
        checks: [
          { criterion: RUBRIC[0], met: true },
          { criterion: RUBRIC[1], met: false },
          { criterion: RUBRIC[2], met: false },
        ],
      },
    });
  });
});

describe("writingStats", () => {
  it("counts sentences and space-separated words", () => {
    expect(writingStats("")).toEqual({ sentences: 0, words: 0 });
    expect(writingStats("  \n ")).toEqual({ sentences: 0, words: 0 });
    expect(writingStats("Em giúp bạn")).toEqual({ sentences: 1, words: 3 });
    expect(writingStats("Em giúp bạn. Bạn vui lắm!  Thật tốt…")).toEqual({
      sentences: 3,
      words: 8,
    });
    // A decimal comma or a dot inside a number does not end a sentence.
    expect(writingStats("Em có 2.5 cái bánh.")).toEqual({
      sentences: 1,
      words: 5,
    });
  });
});

describe("hasOwnWriting", () => {
  it("is true only once the text goes beyond the starter", () => {
    expect(hasOwnWriting("", STARTER)).toBe(false);
    expect(hasOwnWriting(` ${STARTER} `, STARTER)).toBe(false);
    expect(hasOwnWriting(`${STARTER} học bài.`, STARTER)).toBe(true);
    expect(hasOwnWriting("Em tự viết câu khác.", STARTER)).toBe(true);
  });
});
