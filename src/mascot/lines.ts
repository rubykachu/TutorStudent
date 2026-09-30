// Everything the owl says in its speech bubble beside an exercise, in one
// place. Each line is one short, calm sentence (at most 10 words) the child
// reads at a glance; the first wrong check stays silent on purpose.

export const OWL_LINES = {
  // Second wrong check, with a hint visual to look at.
  hintVisual: "Xem hình gợi ý nhé!",
  // Second wrong check without a hint visual: the hinted parts are marked
  // more boldly instead.
  hintMarks: "Nhìn phần được đánh dấu nhé!",
  // Third wrong check, with a solution visual.
  solutionVisual: "Xem lời giải rồi tự làm lại nhé.",
  // Third wrong check without a solution visual: the answer card shows the
  // correct answer.
  reveal: "Đáp án đây, bạn tự làm lại nhé.",
} as const;

// Praise on a correct answer; one is picked per attempt so the owl does not
// repeat itself word for word from one exercise to the next.
export const OWL_PRAISE = [
  "Đúng rồi, giỏi quá!",
  "Chính xác! Bạn làm tốt lắm.",
  "Tuyệt vời, đúng rồi!",
  "Đúng rồi! Cứ thế nhé.",
  "Hay lắm, bạn làm đúng rồi!",
] as const;

export const OWL_LINE_MAX_WORDS = 10;
