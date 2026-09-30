// Everything the owl says beside an exercise, in one place. Each line is one
// short, calm sentence (at most 10 words) the child reads at a glance. The
// owl always calls the child "bạn".
//
// Every line shown in the owl's bubble is also said out loud: `pnpm
// sounds:build` makes its clip from `text` into public/sounds/ under the same
// id (`soundUrl(id)`), so the bubble and the voice always say the same words.
// The id is kebab-case.
export type VoiceLine = { id: string; text: string };

// Second and third wrong checks.
export const OWL_LINES = {
  // Second wrong check, with a hint visual to look at.
  hintVisual: { id: "hint-visual", text: "Xem hình gợi ý nhé!" },
  // Second wrong check without a hint visual: the hinted parts are marked
  // more boldly instead.
  hintMarks: { id: "hint-marks", text: "Nhìn phần được đánh dấu nhé!" },
  // Third wrong check, with a solution visual.
  solutionVisual: {
    id: "solution-visual",
    text: "Xem lời giải rồi tự làm lại nhé.",
  },
  // Third wrong check without a solution visual: the answer card shows the
  // correct answer.
  reveal: { id: "reveal", text: "Đáp án đây, bạn tự làm lại nhé." },
} as const satisfies Record<string, VoiceLine>;

// First wrong check: one encouraging line per attempt.
export const ENCOURAGE_LINES: readonly VoiceLine[] = [
  { id: "encourage-lam-duoc", text: "Bạn làm được mà, cố lên!" },
  { id: "encourage-sap-dung", text: "Thử lại nhé, bạn sắp đúng rồi!" },
  { id: "encourage-binh-tinh", text: "Bình tĩnh nghĩ lại nhé, bạn giỏi mà!" },
  { id: "encourage-lan-nua", text: "Gần đúng rồi, thử thêm lần nữa nhé!" },
];

// Praise on a correct answer; one is picked per attempt so the owl does not
// repeat itself word for word from one exercise to the next.
export const PRAISE_LINES: readonly VoiceLine[] = [
  { id: "praise-gioi-qua", text: "Đúng rồi, giỏi quá!" },
  { id: "praise-chinh-xac", text: "Chính xác! Bạn làm tốt lắm." },
  { id: "praise-tuyet-voi", text: "Tuyệt vời, đúng rồi!" },
  { id: "praise-cu-the", text: "Đúng rồi! Cứ thế nhé." },
  { id: "praise-hay-lam", text: "Hay lắm, bạn làm đúng rồi!" },
];

// Every line the owl can say, each with its own clip.
export const VOICE_LINES: readonly VoiceLine[] = [
  ...ENCOURAGE_LINES,
  ...Object.values(OWL_LINES),
  ...PRAISE_LINES,
];

export const OWL_LINE_MAX_WORDS = 10;
