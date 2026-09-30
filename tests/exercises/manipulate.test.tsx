import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Hints, ManipulateExercise } from "@/schema/content";
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
  const view = renderExercise(exercise);
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

    startRetype();
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
      squareExercise(VISUAL_HINTS),
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
    const { frame } = renderExercise(exercise);
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

  it("hands the exercise's params to the visual so it draws the task's numbers", async () => {
    const grid: ManipulateExercise = {
      ...squareExercise(),
      visualId: "phep-nhan-phep-chia.visual.xep-luoi",
      validatorId: "luoi",
      params: { rows: 3, cols: 5 },
    };
    renderExercise(grid);
    expect(
      await screen.findByText("Đề bài: 3 hàng, mỗi hàng 5 chấm"),
    ).toBeInTheDocument();
  });

  it("draws the plates and pile of a sharing task from its params", async () => {
    const share: ManipulateExercise = {
      ...squareExercise(),
      visualId: "phep-nhan-phep-chia.visual.chia-keo",
      validatorId: "chia",
      params: { total: 29, people: 6 },
    };
    renderExercise(share);
    expect(
      await screen.findByText("Đã xếp 0 cái, có 29 cái."),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /^6 bạn/ })).toBeInTheDocument();
  });

  it("draws the column of a multiplication task from its params", async () => {
    const column: ManipulateExercise = {
      ...squareExercise(),
      visualId: "phep-nhan-phep-chia.visual.nhan-cot",
      validatorId: "tich-cot",
      params: { a: 47, b: 13 },
    };
    renderExercise(column);
    expect(
      await screen.findByRole("img", { name: "Đặt tính 47 nhân 13" }),
    ).toBeInTheDocument();
  });
});
