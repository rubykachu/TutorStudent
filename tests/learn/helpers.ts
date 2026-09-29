import { indexLesson, type LessonIndex } from "@/content";
import type {
  ChoiceExercise,
  Lesson,
  OpenEndedExercise,
  TapRegionExercise,
} from "@/schema/content";

// A small lesson for the section player: one note block and one formula, a
// check, two practice choices (one on each card) and a recap.
export const LESSON_ID = "learn";
export const SECTION_ID = `${LESSON_ID}.section.one`;
export const CARD_A = `${LESSON_ID}.card.a`;
export const CARD_B = `${LESSON_ID}.card.b`;

export function choice(
  name: string,
  cardIds: string[],
  question = `Câu ${name}`,
): ChoiceExercise {
  return {
    id: `${LESSON_ID}.ex.${name}`,
    type: "choice",
    cardIds,
    prompt: [{ type: "note", text: question }],
    hints: { highlight: [] },
    difficulty: 1,
    options: [
      { id: "a", content: { type: "text", text: "Đúng" } },
      { id: "b", content: { type: "text", text: "Sai" } },
    ],
    answer: ["a"],
    multiple: false,
  };
}

export const tapRegion: TapRegionExercise = {
  id: `${LESSON_ID}.ex.cham`,
  type: "tapRegion",
  cardIds: [CARD_A],
  prompt: [{ type: "note", text: "Chạm hình tròn" }],
  hints: { highlight: [] },
  difficulty: 1,
  visualId: "fixture.visual.shapes",
  answer: ["circle"],
};

export const openEnded: OpenEndedExercise = {
  id: `${LESSON_ID}.ex.viet`,
  type: "openEnded",
  cardIds: [],
  prompt: [{ type: "note", text: "Viết về bạn" }],
  hints: { highlight: [] },
  difficulty: 2,
  steps: [choice("buoc", [CARD_B], "Bước một")],
  writing: { starter: "Bạn em", rubric: ["Có tên bạn"] },
};

export function learnLesson(overrides: Partial<Lesson> = {}): Lesson {
  const recap = { type: "formula", tex: "2 \\cdot 3 = 6" } as const;
  return {
    id: LESSON_ID,
    subject: "math",
    series: "kntt",
    grade: 6,
    order: 1,
    title: "Bài học thử",
    sourceRef: "tr. 1",
    status: "published",
    concepts: [],
    sections: [
      {
        id: SECTION_ID,
        title: "Phần một",
        sourceRef: "tr. 1",
        minutes: 5,
        blocks: [
          { type: "note", text: "Khối thứ nhất" },
          { type: "note", text: "Khối thứ hai" },
        ],
        checkIds: [`${LESSON_ID}.ex.kiem-tra`],
        practiceIds: [`${LESSON_ID}.ex.luyen-a`, `${LESSON_ID}.ex.luyen-b`],
        recap: { type: "formula", tex: "\\text{Nhắc lại}" },
      },
    ],
    cards: [CARD_A, CARD_B].map((id) => ({
      id,
      sourceRef: "tr. 1",
      conceptIds: [],
      recap,
    })),
    exercises: [
      choice("kiem-tra", [], "Câu kiểm tra"),
      choice("luyen-a", [CARD_A], "Câu luyện A"),
      choice("luyen-b", [CARD_B], "Câu luyện B"),
      tapRegion,
      openEnded,
    ],
    sticker: { name: "Ngôi sao", visualId: "fixture.visual.star-sticker" },
    ...overrides,
  };
}

export function learnIndex(overrides: Partial<Lesson> = {}): LessonIndex {
  return indexLesson(learnLesson(overrides));
}
