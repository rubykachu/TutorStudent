import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { BasicExercise } from "@/schema/content";
import { choiceExercise } from "./helpers";
import { checkAnswer, next, tap } from "./render";

function frame(
  exercise: BasicExercise,
  props: { skippable?: boolean; finished?: boolean } = {},
) {
  const onDone = vi.fn();
  const view = render(
    <ExerciseFrame exercise={exercise} onDone={onDone} {...props}>
      {(slot) => renderAnswer(exercise, slot)}
    </ExerciseFrame>,
  );
  return { onDone, container: view.container };
}

const EXPLAINED: BasicExercise = {
  ...choiceExercise(["a"]),
  explain: {
    text: "Hai nhân bảy bằng mười bốn.",
    tex: "14 = 2 \\cdot 7",
    wrong: [{ optionId: "b", text: "Mười bốn không chia hết cho b." }],
  },
};

describe("explanation panel", () => {
  it("stays hidden until the child has answered", () => {
    frame(EXPLAINED);
    expect(screen.queryByRole("heading", { name: "Giải thích" })).toBeNull();
    tap("b");
    checkAnswer();
    expect(screen.queryByRole("heading", { name: "Giải thích" })).toBeNull();
  });

  it("shows after a correct answer, with Tiếp still there", () => {
    const { onDone } = frame(EXPLAINED);
    tap("a");
    checkAnswer();
    const panel = screen.getByRole("region", { name: "Giải thích" });
    expect(within(panel).getByText(/Hai nhân bảy/)).toBeVisible();
    next();
    expect(onDone).toHaveBeenCalled();
  });

  it("puts a wrong option's reason next to that option", () => {
    frame(EXPLAINED);
    tap("a");
    checkAnswer();
    const reason = screen.getByText(/không chia hết cho b/);
    expect(reason.closest("li")).toHaveTextContent("b");
  });

  it("shows after the third wrong check, then again once retyped", () => {
    frame(EXPLAINED);
    for (let i = 0; i < 3; i++) {
      tap("c");
      checkAnswer();
    }
    expect(screen.getByRole("heading", { name: "Giải thích" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Tự làm lại" }));
    expect(screen.queryByRole("heading", { name: "Giải thích" })).toBeNull();
    tap("a");
    checkAnswer();
    expect(screen.getByRole("heading", { name: "Giải thích" })).toBeVisible();
  });

  it("shows after a skip with the answer revealed, and Tiếp reports a skip", () => {
    const { onDone, container } = frame(EXPLAINED, { skippable: true });
    tap("Bỏ qua");
    expect(onDone).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Giải thích" })).toBeVisible();
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
    next();
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 0,
      skipped: true,
    });
  });

  it("shows the explanation of an exercise the child already finished", () => {
    frame(EXPLAINED, { finished: true });
    expect(screen.getByRole("heading", { name: "Giải thích" })).toBeVisible();
  });

  it("falls back to the accepted answer for an exercise without explain", () => {
    frame(choiceExercise(["a"]));
    tap("a");
    checkAnswer();
    const panel = screen.getByRole("region", { name: "Lời giải" });
    expect(panel).toHaveTextContent("Đáp án:");
    expect(panel).toHaveAttribute("data-explanation", "derived");
  });
});
