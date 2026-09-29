import { REVIEW_RECENT_MINUTES, REVIEW_SESSION_SIZE } from "@/lib/config";
import type { ReviewItem } from "@/srs/select";

// One on-demand review session as a queue. A card missed on its rated
// question comes back once at the end, with another exercise when the card
// has one, to teach it again; that second ask is never rated. After any
// missed question the card's recap is shown until the child moves on.

export type SessionItem = ReviewItem & { reask: boolean };

// The recap on screen: the queue position that was just missed and its card.
export type SessionRecap = { at: number; cardId: string };

export type ReviewSession = {
  items: readonly SessionItem[];
  // Index of the item being asked; equals `items.length` once finished.
  current: number;
  // Set after a missed question, cleared by `closeRecap`; an answer that was
  // right the first time moves straight on.
  recap: SessionRecap | null;
};

export function startSession(picks: readonly ReviewItem[]): ReviewSession {
  return {
    items: picks.map((pick) => ({ ...pick, reask: false })),
    current: 0,
    recap: null,
  };
}

export function closeRecap(session: ReviewSession): ReviewSession {
  return { ...session, recap: null };
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

// Questions answered so far, re-asks included: the count shown when the
// session ends, so it matches the questions the child just went through.
export function answeredCount(session: ReviewSession): number {
  return Math.min(session.current, session.items.length);
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

// Moves past the current item. Any miss opens the card's recap; a rated miss
// also queues the card once more at the end, asked with a different exercise
// from `exerciseIdsByCard` if possible.
export function answerCurrent(
  session: ReviewSession,
  firstTryCorrect: boolean,
  exerciseIdsByCard: ReadonlyMap<string, readonly string[]>,
  random: () => number = Math.random,
): ReviewSession {
  const item = currentItem(session);
  if (!item) return session;
  const next: ReviewSession = {
    ...session,
    current: session.current + 1,
    recap: firstTryCorrect
      ? null
      : { at: session.current, cardId: item.cardId },
  };
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

const MINUTE_MS = 60 * 1000;

// Exercises answered in the last `minutes` before `now`, for `selectReview`
// to avoid, so review right after a section does not repeat its practice.
export function recentExerciseIds(
  attempts: readonly { exerciseId: string; at: string }[],
  now: Date,
  minutes: number = REVIEW_RECENT_MINUTES,
): string[] {
  const since = now.getTime() - minutes * MINUTE_MS;
  return attempts
    .filter((attempt) => new Date(attempt.at).getTime() >= since)
    .map((attempt) => attempt.exerciseId);
}
