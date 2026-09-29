import { REVIEW_SESSION_SIZE } from "@/lib/config";
import type { ReviewItem } from "@/srs/select";

// One on-demand review session as a queue. A card missed on its rated
// question comes back once at the end, with another exercise when the card
// has one, to teach it again; that second ask is never rated.

export type SessionItem = ReviewItem & { reask: boolean };

export type ReviewSession = {
  items: readonly SessionItem[];
  // Index of the item being asked; equals `items.length` once finished.
  current: number;
};

export function startSession(picks: readonly ReviewItem[]): ReviewSession {
  return {
    items: picks.map((pick) => ({ ...pick, reask: false })),
    current: 0,
  };
}

export function currentItem(session: ReviewSession): SessionItem | undefined {
  return session.items[session.current];
}

export function isFinished(session: ReviewSession): boolean {
  return session.current >= session.items.length;
}

// Only the first ask of a card shapes its memory state.
export function isRated(item: SessionItem): boolean {
  return !item.reask;
}

// Rated questions asked so far: the count shown when the session ends.
export function ratedCount(session: ReviewSession): number {
  return session.items.slice(0, session.current).filter((item) => isRated(item))
    .length;
}

function pickExercise(
  pool: readonly string[],
  used: string,
  random: () => number,
): string {
  const others = pool.filter((id) => id !== used);
  if (others.length === 0) return used;
  return others[Math.floor(random() * others.length)] ?? used;
}

// Moves past the current item. A rated miss queues the card once more at the
// end, asked with a different exercise from `exerciseIdsByCard` if possible.
export function answerCurrent(
  session: ReviewSession,
  firstTryCorrect: boolean,
  exerciseIdsByCard: ReadonlyMap<string, readonly string[]>,
  random: () => number = Math.random,
): ReviewSession {
  const item = currentItem(session);
  if (!item) return session;
  const next = { ...session, current: session.current + 1 };
  if (firstTryCorrect || !isRated(item)) return next;
  const pool = exerciseIdsByCard.get(item.cardId) ?? [];
  const reask: SessionItem = {
    cardId: item.cardId,
    exerciseId: pickExercise(pool, item.exerciseId, random),
    reask: true,
  };
  return { ...next, items: [...session.items, reask] };
}

// Exercises of the most recent review of a lesson, for `selectReview` to
// avoid. A session rates at most REVIEW_SESSION_SIZE answers, so the last
// that many review answers cover it.
export function lastReviewExerciseIds(
  reviewAttempts: readonly { exerciseId: string }[],
  size: number = REVIEW_SESSION_SIZE,
): string[] {
  return reviewAttempts.slice(-size).map((attempt) => attempt.exerciseId);
}
