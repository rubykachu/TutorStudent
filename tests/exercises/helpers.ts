import type {
  ChoiceExercise,
  FillBlankExercise,
  Hints,
  NumericExercise,
  OrderExercise,
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

// Without a bank the child types the word.
export function fillBlankExercise(
  accept: string[],
  hints: Hints = NO_HINTS,
  bank?: string[],
): FillBlankExercise {
  return {
    ...base("dien", hints),
    type: "fillBlank",
    segments: [
      { type: "text", text: "Bạn tên là " },
      { type: "blank", id: "ten", accept },
      { type: "text", text: "." },
    ],
    bank,
  };
}

// Items are listed in the correct order, as content authors them.
export function orderExercise(
  ids: string[],
  hints: Hints = NO_HINTS,
): OrderExercise {
  return {
    ...base("xep", hints),
    type: "order",
    items: ids.map((id) => ({ id, content: { type: "text", text: id } })),
  };
}
