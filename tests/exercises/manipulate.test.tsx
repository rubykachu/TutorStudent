import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ManipulateAnswer } from "@/exercises/manipulate";
import type { Hints, ManipulateExercise } from "@/schema/content";
import {
  checkAnswer,
  checkButton,
  feedbackVisual,
  HINT_VISUALS,
  NO_HINTS,
  next,
  renderInFrame,
  retype,
  revealed,
} from "./frame-harness";

const BLOCK_HINT: Hints = { highlight: [{ target: "block", index: 0 }] };

function squareExercise(hints: Hints = NO_HINTS): ManipulateExercise {
  return {
    id: "test.ex.xep-hinh-vuong",
    type: "manipulate",
    cardIds: [],
    prompt: [{ type: "note", text: "Xếp bốn chấm thành hình vuông." }],
    visualId: "fixture.visual.dot-square",
    validatorId: "square-of",
    params: { n: 2 },
    hints,
    difficulty: 1,
  };
}

async function renderManipulate(exercise: ManipulateExercise) {
  const view = renderInFrame(exercise, (slot) => (
    <ManipulateAnswer exercise={exercise} {...slot} />
  ));
  await screen.findByRole("group", { name: /Bảng chấm/ });
  return view;
}

function cell(row: number, column: number): HTMLElement {
  return screen.getByRole("button", { name: `Hàng ${row}, cột ${column}` });
}

function place(cells: readonly (readonly [number, number])[]) {
  for (const [row, column] of cells) fireEvent.click(cell(row, column));
}

const SQUARE = [
  [2, 2],
  [2, 3],
  [3, 2],
  [3, 3],
] as const;
const ROW = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
] as const;

function pressedCells(): number {
  return screen
    .getAllByRole("button", { name: /^Hàng/ })
    .filter((b) => b.getAttribute("aria-pressed") === "true").length;
}

describe("ManipulateAnswer", () => {
  it("reports the visual's state and leaves the verdict to the frame", async () => {
    const { frame, onDone, container } = await renderManipulate(
      squareExercise(),
    );
    expect(checkButton()).toBeDisabled();
    place(SQUARE);
    // Nothing tells the child the square is done before "Kiểm tra".
    expect(frame).toHaveAttribute("data-phase", "answered");
    expect(container.querySelector("[data-answer-area]")).toHaveAttribute(
      "data-tone",
      "selected",
    );

    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    expect(cell(1, 1)).toBeDisabled();
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: true,
      wrongCount: 0,
    });
  });

  it("walks the tiers and reveals the solved state inside the visual", async () => {
    const { frame, onDone, container } = await renderManipulate(
      squareExercise(BLOCK_HINT),
    );
    place(ROW);

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "1");
    expect(
      screen
        .getByText("Xếp bốn chấm thành hình vuông.")
        .closest("[data-highlighted]"),
    ).not.toBeNull();

    // The child keeps working from the current board.
    fireEvent.click(cell(1, 4));
    expect(pressedCells()).toBe(3);
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(container.querySelector("[data-feedback-visual]")).toBeNull();

    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(revealed(container)).not.toBeNull();
    expect(pressedCells()).toBe(4);
    for (const [row, column] of [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
    ] as const) {
      expect(cell(row, column)).toHaveAttribute("aria-pressed", "true");
    }
    expect(cell(1, 3)).toHaveAttribute("aria-pressed", "false");
    expect(cell(1, 1)).toBeDisabled();

    retype();
    expect(revealed(container)).toBeNull();
    expect(pressedCells()).toBe(0);
    expect(checkButton()).toBeDisabled();
    place(SQUARE);
    checkAnswer();
    expect(frame).toHaveAttribute("data-phase", "correct");
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 3,
    });
  });

  it("plays hint and solution visuals and keeps the child's board", async () => {
    const { frame, container } = await renderManipulate(
      squareExercise(HINT_VISUALS),
    );
    place(ROW);
    checkAnswer();
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "2");
    expect(feedbackVisual(container, "fixture.visual.dot-grid")).not.toBeNull();
    checkAnswer();
    expect(
      feedbackVisual(container, "fixture.visual.bead-merge"),
    ).not.toBeNull();
    expect(revealed(container)).toBeNull();
    expect(cell(1, 4)).toHaveAttribute("aria-pressed", "true");
    expect(cell(1, 4)).toBeDisabled();
  });

  it("reveals a counted answer in the dot counter", async () => {
    const exercise: ManipulateExercise = {
      ...squareExercise(),
      visualId: "fixture.visual.dot-counter",
      validatorId: "count-equals",
      params: { count: 3 },
    };
    const { frame } = renderInFrame(exercise, (slot) => (
      <ManipulateAnswer exercise={exercise} {...slot} />
    ));
    const add = await screen.findByRole("button", { name: "Thêm một chấm" });
    fireEvent.click(add);
    checkAnswer();
    checkAnswer();
    checkAnswer();
    expect(frame).toHaveAttribute("data-tier", "3");
    expect(screen.getByRole("img", { name: "3 chấm" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Thêm một chấm" }),
    ).toBeDisabled();
  });
});
