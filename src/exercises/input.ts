import type { BasicExerciseType } from "@/schema/content";
import type { VisualState } from "@/visuals/registry";

// What each answer component reports while the child works. Every shape keeps
// raw text as typed so grading, not the UI, decides what counts as a number or
// a matching word.

export type ChoiceInput = {
  type: "choice";
  selected: readonly string[];
};

// Slots are named like the numeric `option` targets a hint can light up:
// "value", or "base" and "exponent" when the pad's power key is used.
export type NumericInput =
  | { type: "numeric"; kind: "value"; value: string }
  | { type: "numeric"; kind: "power"; base: string; exponent: string };

export type MatchInput = {
  type: "match";
  // Left item id -> right item id the child paired it with.
  pairs: Readonly<Record<string, string>>;
};

export type OrderInput = {
  type: "order";
  // Item ids in the order the child arranged them.
  order: readonly string[];
};

export type FillBlankInput = {
  type: "fillBlank";
  // Blank id -> text typed or word picked from the bank.
  blanks: Readonly<Record<string, string>>;
};

export type TapTextInput = {
  type: "tapText";
  selected: readonly string[];
};

export type TapRegionInput = {
  type: "tapRegion";
  selected: readonly string[];
};

export type ManipulateInput = {
  type: "manipulate";
  state: VisualState;
};

export type ExerciseInput =
  | ChoiceInput
  | NumericInput
  | MatchInput
  | OrderInput
  | FillBlankInput
  | TapTextInput
  | TapRegionInput
  | ManipulateInput;

export type InputFor<T extends BasicExerciseType> = Extract<
  ExerciseInput,
  { type: T }
>;

function blank(text: string): boolean {
  return text.trim() === "";
}

// "Kiểm tra" stays disabled while this is true, so a child cannot submit an
// untouched answer area and lose a try.
export function isInputEmpty(input: ExerciseInput): boolean {
  switch (input.type) {
    case "choice":
    case "tapText":
    case "tapRegion":
      return input.selected.length === 0;
    case "numeric":
      return input.kind === "value"
        ? blank(input.value)
        : blank(input.base) && blank(input.exponent);
    case "match":
      return Object.keys(input.pairs).length === 0;
    case "order":
      return input.order.length === 0;
    case "fillBlank":
      return Object.values(input.blanks).every(blank);
    case "manipulate":
      return Object.keys(input.state).length === 0;
  }
}
