import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import { PlayerHeader } from "@/learn/player-header";
import { FeedbackSoundsProvider } from "@/lib/feedback-sounds";
import type { BasicExercise } from "@/schema/content";
import {
  choiceExercise,
  fillBlankExercise,
  NO_HINTS,
  orderExercise,
} from "./helpers";
import { tap } from "./render";

function renderWith(
  exercise: BasicExercise,
  options: { skippable?: boolean } = {},
) {
  const onDone = vi.fn();
  const sounds = { play: vi.fn(), tap: vi.fn(), button: vi.fn() };
  render(
    <FeedbackSoundsProvider sounds={sounds}>
      <ExerciseFrame
        exercise={exercise}
        onDone={onDone}
        skippable={options.skippable}
      >
        {(slot) => renderAnswer(exercise, slot)}
      </ExerciseFrame>
    </FeedbackSoundsProvider>,
  );
  return { onDone, sounds };
}

describe("tap sound", () => {
  it("clicks when an option is chosen", () => {
    const { sounds } = renderWith(choiceExercise(["a"]));
    tap("b");
    expect(sounds.tap).toHaveBeenCalledTimes(1);
    tap("a");
    expect(sounds.tap).toHaveBeenCalledTimes(2);
    expect(sounds.play).not.toHaveBeenCalled();
  });

  it("clicks when a word of the bank and then a blank are tapped", () => {
    const { sounds } = renderWith(
      fillBlankExercise(["Lan"], NO_HINTS, ["Lan", "Minh"]),
    );
    tap("Lan");
    fireEvent.click(screen.getByRole("button", { name: /^Ô trống 1/ }));
    expect(sounds.tap).toHaveBeenCalledTimes(2);
  });

  it("is silent without a provider (sound off)", () => {
    const exercise = choiceExercise(["a"]);
    render(
      <ExerciseFrame exercise={exercise} onDone={vi.fn()}>
        {(slot) => renderAnswer(exercise, slot)}
      </ExerciseFrame>,
    );
    expect(() => tap("a")).not.toThrow();
  });
});

describe("skipping an exercise", () => {
  it("offers Bỏ qua only when the player allows it", () => {
    renderWith(choiceExercise(["a"]));
    expect(screen.queryByRole("button", { name: "Bỏ qua" })).toBeNull();
  });

  it("moves on with a skipped outcome and no grading", () => {
    const { onDone } = renderWith(choiceExercise(["a"]), { skippable: true });
    tap("b");
    tap("Kiểm tra");
    tap("Bỏ qua");
    expect(onDone).toHaveBeenCalledWith({
      firstTryCorrect: false,
      wrongCount: 1,
      skipped: true,
    });
  });

  it("is gone once the answer is accepted", () => {
    renderWith(choiceExercise(["a"]), { skippable: true });
    expect(screen.getByRole("button", { name: "Bỏ qua" })).toBeEnabled();
    tap("a");
    tap("Kiểm tra");
    expect(screen.queryByRole("button", { name: "Bỏ qua" })).toBeNull();
  });
});

describe("tap sound on ordering", () => {
  it("clicks when an item is picked up", () => {
    const { sounds } = renderWith(orderExercise(["x", "y", "z"]));
    tap("x");
    expect(sounds.tap).toHaveBeenCalledTimes(1);
  });
});

describe("button sound on action buttons", () => {
  it("plays the button press, not the choice click, on Kiểm tra and Bỏ qua", () => {
    const { sounds } = renderWith(choiceExercise(["a"]), { skippable: true });
    tap("b");
    fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
    expect(sounds.tap).toHaveBeenCalledTimes(1);
    expect(sounds.button).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /Bỏ qua/ }));
    expect(sounds.button).toHaveBeenCalledTimes(2);
  });

  it("plays the button press on Quay lại in the player header", () => {
    const sounds = { play: vi.fn(), tap: vi.fn(), button: vi.fn() };
    const onBack = vi.fn();
    render(
      <FeedbackSoundsProvider sounds={sounds}>
        <PlayerHeader
          lessonId="fixture"
          childId="child"
          progress={{ current: 1, total: 3 }}
          onBack={onBack}
        />
      </FeedbackSoundsProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Quay lại/ }));
    expect(sounds.button).toHaveBeenCalledTimes(1);
    expect(sounds.tap).not.toHaveBeenCalled();
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
