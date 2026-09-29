import { newId } from "@/lib/id";
import { vnDayKey } from "@/lib/time";
import type {
  AttemptContext,
  AttemptRecord,
  ChildScope,
  TutorDb,
} from "@/progress/db";
import { markActivityDay } from "@/progress/db";
import { rate } from "@/srs/rate";
import { applyRating } from "@/srs/schedule";

export type AttemptInput = ChildScope & {
  exerciseId: string;
  lessonId: string;
  cardIds: readonly string[];
  firstTryCorrect: boolean;
  wrongCount: number;
  context: AttemptContext;
};

// Comprehension checks only confirm the child followed the explanation; they
// come before the card is practiced, so they must not shape its memory state.
function isRated(context: AttemptContext): boolean {
  return context !== "check";
}

// Logs the answer, updates the memory state of every card the exercise trains
// (the first rated answer "opens" a card for review) and marks today as a
// study day, all in one transaction so a crash never leaves them out of step.
export async function recordAttempt(
  db: TutorDb,
  input: AttemptInput,
  now: Date,
): Promise<AttemptRecord> {
  const { familyId, childId, lessonId } = input;
  const attempt: AttemptRecord = {
    id: newId(),
    familyId,
    childId,
    exerciseId: input.exerciseId,
    lessonId,
    cardIds: [...input.cardIds],
    firstTryCorrect: input.firstTryCorrect,
    wrongCount: input.wrongCount,
    at: now.toISOString(),
    context: input.context,
  };

  await db.transaction(
    "rw",
    [db.attempts, db.cardStates, db.activityDays],
    async () => {
      await db.attempts.add(attempt);
      if (isRated(input.context)) {
        const rating = rate(input.firstTryCorrect);
        for (const cardId of attempt.cardIds) {
          const previous = await db.cardStates.get([familyId, childId, cardId]);
          await db.cardStates.put({
            ...applyRating(previous, rating, now),
            familyId,
            childId,
            cardId,
            lessonId,
          });
        }
      }
      await markActivityDay(db, { familyId, childId }, vnDayKey(now));
    },
  );
  return attempt;
}
