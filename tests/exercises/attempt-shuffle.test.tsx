import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import { shuffleRight } from "@/exercises/match/pairs";
import { attemptSeed, seededShuffle } from "@/exercises/shuffle";
import { newId } from "@/lib/id";
import type {
  BasicExercise,
  ChoiceExercise,
  FillBlankExercise,
  MatchExercise,
} from "@/schema/content";
import { NO_HINTS } from "./helpers";
import { checkAnswer, startRetype } from "./render";

// Attempt nonces come from `newId`; numbered ones make each attempt's
// arrangement predictable.
vi.mock("@/lib/id", () => ({ newId: vi.fn() }));

beforeEach(() => {
  let count = 0;
  vi.mocked(newId).mockImplementation(() => {
    count += 1;
    return `nonce-${count}`;
  });
});

function text(id: string) {
  return { id, content: { type: "text" as const, text: id } };
}

const base = {
  cardIds: [],
  prompt: [{ type: "note" as const, text: "Câu hỏi thử" }],
  hints: NO_HINTS,
  difficulty: 1,
};

const CHOICE: ChoiceExercise = {
  ...base,
  id: "test.ex.chon",
  type: "choice",
  options: ["a", "b", "c", "d"].map(text),
  answer: ["a"],
  multiple: false,
};

const MATCH: MatchExercise = {
  ...base,
  id: "test.ex.ghep",
  type: "match",
  left: ["l1", "l2", "l3"].map(text),
  right: ["r1", "r2", "r3", "rx"].map(text),
  pairs: [
    { left: "l1", right: "r1" },
    { left: "l2", right: "r2" },
    { left: "l3", right: "r3" },
  ],
};

const BANK = ["An", "Bình", "Chi", "Dũng"];
const FILL_BLANK: FillBlankExercise = {
  ...base,
  id: "test.ex.dien",
  type: "fillBlank",
  segments: [
    { type: "text", text: "Bạn tên là " },
    { type: "blank", id: "ten", accept: ["An"] },
  ],
  bank: BANK,
};

// A frame keyed by attempt, as the players and the dev gallery key theirs.
function renderAttempts(exercise: BasicExercise) {
  const frame = (attempt: number) => (
    <ExerciseFrame key={attempt} exercise={exercise} onDone={vi.fn()}>
      {(slot) => renderAnswer(exercise, slot)}
    </ExerciseFrame>
  );
  const view = render(frame(1));
  return { nextAttempt: () => view.rerender(frame(2)) };
}

function shown(selector: string, attribute: string): string[] {
  return [...document.querySelectorAll(selector)].map(
    (el) => el.getAttribute(attribute) ?? "",
  );
}

// Three wrong checks, the revealed answer, then the retype of one attempt:
// the arrangement must not move at any point.
function expectStableThroughTiers(
  read: () => string[],
  answerWrong: () => void,
) {
  const start = read();
  answerWrong();
  for (const tier of ["1", "2", "3"]) {
    checkAnswer();
    expect(document.querySelector("section")).toHaveAttribute(
      "data-tier",
      tier,
    );
    expect(read()).toEqual(start);
  }
  expect(document.querySelector("[data-reveal]")).not.toBeNull();
  startRetype();
  expect(document.querySelector("section")).toHaveAttribute(
    "data-phase",
    "retype",
  );
  expect(read()).toEqual(start);
}

describe("answer arrangement per attempt", () => {
  it("scrambles choice options once per attempt", () => {
    const options = () => shown("[data-option]", "data-option");
    const ids = CHOICE.options.map((option) => option.id);
    const expected = (nonce: string) =>
      seededShuffle(ids, attemptSeed(CHOICE.id, nonce));
    expect(expected("nonce-2")).not.toEqual(expected("nonce-1"));

    const { nextAttempt } = renderAttempts(CHOICE);
    expect(options()).toEqual(expected("nonce-1"));
    expect(options()).not.toEqual(ids);
    expectStableThroughTiers(options, () =>
      fireEvent.click(screen.getByRole("button", { name: "b" })),
    );

    nextAttempt();
    expect(options()).toEqual(expected("nonce-2"));
  });

  it("scrambles the right column of a match once per attempt, left kept", () => {
    const right = () => shown('[data-side="right"]', "data-item");
    const left = () => shown('[data-side="left"]', "data-item");
    const expected = (nonce: string) =>
      shuffleRight(MATCH, attemptSeed(MATCH.id, nonce)).map((item) => item.id);
    expect(expected("nonce-2")).not.toEqual(expected("nonce-1"));

    const { nextAttempt } = renderAttempts(MATCH);
    expect(left()).toEqual(["l1", "l2", "l3"]);
    expect(right()).toEqual(expected("nonce-1"));
    expectStableThroughTiers(right, () => {
      fireEvent.click(document.querySelector('[data-item="l1"]') as Element);
      fireEvent.click(document.querySelector('[data-item="rx"]') as Element);
    });

    nextAttempt();
    expect(left()).toEqual(["l1", "l2", "l3"]);
    expect(right()).toEqual(expected("nonce-2"));
  });

  it("scrambles the word bank once per attempt", () => {
    const chips = () => shown("[data-chip]", "data-chip");
    const expected = (nonce: string) =>
      seededShuffle(BANK, attemptSeed(FILL_BLANK.id, nonce));
    expect(expected("nonce-2")).not.toEqual(expected("nonce-1"));

    const { nextAttempt } = renderAttempts(FILL_BLANK);
    expect(chips()).toEqual(expected("nonce-1"));
    expectStableThroughTiers(chips, () => {
      fireEvent.click(screen.getByRole("button", { name: "Chi" }));
      fireEvent.click(screen.getByRole("button", { name: /^Ô trống 1/ }));
    });

    nextAttempt();
    expect(chips()).toEqual(expected("nonce-2"));
  });
});
