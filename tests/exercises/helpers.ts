import type {
  ChoiceExercise,
  FillBlankExercise,
  Hints,
  NumericExercise,
} from "@/schema/content";

export const NO_HINTS: Hints = { highlight: [] };

function base(name: string, hints: Hints) {
  return {
    id: `test.ex.${name}`,
    cardIds: [],
    prompt: [{ type: "note" as const, text: "Câu hỏi thử" }],
    hints,
    difficulty: 1,
  };
}

export function choiceExercise(
  answer: string[],
  hints: Hints = NO_HINTS,
): ChoiceExercise {
  return {
    ...base("chon", hints),
    type: "choice",
    options: ["a", "b", "c"].map((id) => ({
      id,
      content: { type: "text", text: id },
    })),
    answer,
    multiple: answer.length > 1,
  };
}

export function numericExercise(
  answer: NumericExercise["answer"],
  hints: Hints = NO_HINTS,
): NumericExercise {
  return { ...base("so", hints), type: "numeric", answer };
}

export function fillBlankExercise(
  accept: string[],
  hints: Hints = NO_HINTS,
): FillBlankExercise {
  return {
    ...base("dien", hints),
    type: "fillBlank",
    segments: [
      { type: "text", text: "Bạn tên là " },
      { type: "blank", id: "ten", accept },
      { type: "text", text: "." },
    ],
  };
}
