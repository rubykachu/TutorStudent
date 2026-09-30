import type { Lesson } from "@/schema/content";
import { type Finding, findingCollector, type LintInput } from "./types";

// A card is opened by exactly one practice exercise in a section; its other
// exercises stay in the review bank, so a review session has questions the
// child has not just answered.

// Cards trained by a top-level exercise, its openEnded steps included.
export function trainedCards(lesson: Lesson, exerciseId: string): Set<string> {
  const exercise = lesson.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return new Set();
  const steps = exercise.type === "openEnded" ? exercise.steps : [];
  return new Set([exercise, ...steps].flatMap((e) => e.cardIds));
}

export function lintPractice(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "practice");
  const { lesson } = input;
  const practiceByCard = new Map<string, string[]>();
  for (const id of lesson.sections.flatMap((s) => s.practiceIds)) {
    for (const cardId of trainedCards(lesson, id)) {
      practiceByCard.set(cardId, [...(practiceByCard.get(cardId) ?? []), id]);
    }
  }
  lesson.cards.forEach((card, i) => {
    const practice = practiceByCard.get(card.id) ?? [];
    if (practice.length > 1) {
      report(
        ["cards", i],
        `Card "${card.id}" has ${practice.length} practice exercises (${practice.join(", ")}); keep one in practiceIds and leave the others to the review bank`,
      );
    }
  });
  return findings;
}
