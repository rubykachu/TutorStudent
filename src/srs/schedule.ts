import {
  type Card,
  createEmptyCard,
  fsrs,
  generatorParameters,
  type State,
} from "ts-fsrs";
import { FSRS_ENABLE_SHORT_TERM, FSRS_REQUEST_RETENTION } from "@/lib/config";
import type { ReviewRating } from "@/srs/rate";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// FSRS memory state of one card, stored JSON-safe (ISO timestamps) so it can
// be exported and synced as-is. A state exists only once a card was rated.
export type SrsState = {
  due: string;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: State;
  lastReviewAt: string;
};

const scheduler = fsrs(
  generatorParameters({
    request_retention: FSRS_REQUEST_RETENTION,
    enable_short_term: FSRS_ENABLE_SHORT_TERM,
  }),
);

function toCard(state: SrsState): Card {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    // Deprecated in ts-fsrs; it derives elapsed time from last_review instead.
    elapsed_days: 0,
    scheduled_days: state.scheduledDays,
    learning_steps: state.learningSteps,
    reps: state.reps,
    lapses: state.lapses,
    state: state.state,
    last_review: new Date(state.lastReviewAt),
  };
}

function fromCard(card: Card, reviewedAt: Date): SrsState {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReviewAt: reviewedAt.toISOString(),
  };
}

// No state yet means this rating is the card's first encounter.
export function applyRating(
  state: SrsState | undefined,
  rating: ReviewRating,
  now: Date,
): SrsState {
  const card = state ? toCard(state) : createEmptyCard(now);
  return fromCard(scheduler.next(card, now, rating).card, now);
}

// ts-fsrs's own retrievability floors elapsed time to whole days, which would
// tie a card missed ten minutes ago with one answered correctly; reviews are
// on demand and often same-day, so elapsed time is kept fractional here.
export function retrievability(state: SrsState, now: Date): number {
  const elapsedDays = Math.max(
    (now.getTime() - Date.parse(state.lastReviewAt)) / MS_PER_DAY,
    0,
  );
  return scheduler.forgetting_curve(elapsedDays, state.stability);
}
