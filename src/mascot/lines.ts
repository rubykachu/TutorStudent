import type { AvatarId } from "@/components/avatar";

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

// Said once, with the confetti, when the child finishes a lesson and earns its
// sticker (not when they reopen a sticker they already have).
export const STICKER_EARNED_LINE: VoiceLine = {
  id: "sticker-earned",
  text: "Chúc mừng bạn! Bạn vừa nhận được một sticker mới!",
};

// Said when the child taps the owl on the home screen: a playful hoot.
export const OWL_TAP_LINE: VoiceLine = { id: "owl-tap", text: "Cú cú!" };

// The sound of each profile avatar, played when the child picks it in the
// profile form and when they tap it on the home screen: a short playful
// onomatopoeia of the animal, the web shot of the spider hero or the engine
// of the race car. The one place that maps an avatar id to its clip.
export const AVATAR_LINES: Readonly<Record<AvatarId, VoiceLine>> = {
  cat: { id: "avatar-cat", text: "Mèo mèo!" },
  bear: { id: "avatar-bear", text: "Gừ gừ!" },
  rabbit: { id: "avatar-rabbit", text: "Cụt cụt!" },
  fox: { id: "avatar-fox", text: "Hí hí!" },
  panda: { id: "avatar-panda", text: "Măm măm!" },
  chick: { id: "avatar-chick", text: "Chiếp chiếp!" },
  spider: { id: "avatar-spider", text: "Phóc phóc!" },
  racecar: { id: "avatar-racecar", text: "Brum brum!" },
};

// Every line the owl can say, each with its own clip.
export const VOICE_LINES: readonly VoiceLine[] = [
  ...ENCOURAGE_LINES,
  ...Object.values(OWL_LINES),
  ...PRAISE_LINES,
  STICKER_EARNED_LINE,
  OWL_TAP_LINE,
  ...Object.values(AVATAR_LINES),
];

export const OWL_LINE_MAX_WORDS = 10;
