import { indexLesson } from "../index";
import { MIN_EXERCISES_PER_CARD } from "./config";
import { type Finding, findingCollector, type LintInput } from "./types";

// Every card needs enough exercises for review sessions to vary the question
// each time the card comes back.

export function lintCardExercises(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "card-exercises");
  const index = indexLesson(input.lesson);
  input.lesson.cards.forEach((card, i) => {
    const count = index.exerciseIdsByCard.get(card.id)?.length ?? 0;
    if (count < MIN_EXERCISES_PER_CARD) {
      report(
        ["cards", i],
        `Card "${card.id}" needs at least ${MIN_EXERCISES_PER_CARD} exercises, has ${count}`,
      );
    }
  });
  return findings;
}
