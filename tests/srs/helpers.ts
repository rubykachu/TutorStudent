import { indexLesson, type LessonIndex } from "@/content";
import type { ChoiceExercise, Lesson } from "@/schema/content";

export const LESSON_ID = "powers";

export function cardId(name: string): string {
  return `${LESSON_ID}.card.${name}`;
}

export function exId(name: string): string {
  return `${LESSON_ID}.ex.${name}`;
}

function choice(id: string, cardIds: string[]): ChoiceExercise {
  return {
    id,
    type: "choice",
    cardIds,
    prompt: [{ type: "note", text: "Question" }],
    hints: { highlight: [] },
    difficulty: 1,
    options: [
      { id: "a", content: { type: "text", text: "A" } },
      { id: "b", content: { type: "text", text: "B" } },
    ],
    answer: ["a"],
    multiple: false,
  };
}

// A minimal lesson whose cards (by name) are trained by the listed exercises
// (by name), so tests state the card -> exercises index directly.
export function lessonIndex(
  exercisesByCard: Record<string, string[]>,
): LessonIndex {
  const cardsByExercise = new Map<string, string[]>();
  for (const [card, exercises] of Object.entries(exercisesByCard)) {
    for (const ex of exercises) {
      cardsByExercise.set(ex, [
        ...(cardsByExercise.get(ex) ?? []),
        cardId(card),
      ]);
    }
  }
  const recap = { type: "formula", tex: "x" } as const;
  const lesson: Lesson = {
    id: LESSON_ID,
    subject: "math",
    series: "kntt",
    grade: 6,
    order: 1,
    title: "Powers",
    sourceRef: "p. 1",
    status: "published",
    concepts: [],
    sections: [
      {
        id: `${LESSON_ID}.section.one`,
        title: "One",
        sourceRef: "p. 1",
        minutes: 8,
        blocks: [{ type: "note", text: "Read" }],
        checkIds: [],
        practiceIds: [],
        recap,
      },
    ],
    cards: Object.keys(exercisesByCard).map((name) => ({
      id: cardId(name),
      sourceRef: "p. 1",
      conceptIds: [],
      recap,
    })),
    exercises: [...cardsByExercise].map(([ex, ids]) => choice(exId(ex), ids)),
    sticker: { name: "Star", visualId: `${LESSON_ID}.visual.star` },
  };
  return indexLesson(lesson);
}
