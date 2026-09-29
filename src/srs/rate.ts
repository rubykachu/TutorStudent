import { Rating } from "ts-fsrs";

// Only two grades are used: a child cannot judge "hard" vs "easy" reliably,
// and a correct answer reached through hints still means it was not recalled.
export type ReviewRating = Rating.Good | Rating.Again;

export function rate(firstTryCorrect: boolean): ReviewRating {
  return firstTryCorrect ? Rating.Good : Rating.Again;
}
