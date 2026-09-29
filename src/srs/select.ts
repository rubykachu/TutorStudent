import type { LessonIndex } from "@/content";
import { FORGETTING_THRESHOLD, REVIEW_SESSION_SIZE } from "@/lib/config";
import { retrievability, type SrsState } from "@/srs/schedule";

// A stored card state as selection sees it: which card, which lesson opened it.
export type LessonCardState = SrsState & { cardId: string; lessonId: string };

export type ReviewItem = { cardId: string; exerciseId: string };

type LessonScope = {
  now: Date;
  lessonId: string;
  states: readonly LessonCardState[];
  index: LessonIndex;
};

export type SelectReviewInput = LessonScope & {
  // Exercises asked in the previous review of this lesson.
  lastUsedExerciseIds?: Iterable<string>;
  size?: number;
  // Returns a number in [0, 1); injected so tests are deterministic.
  random?: () => number;
};

// Opened cards of the lesson that still exist in its content. States left
// behind by edited or retired content are skipped instead of failing review.
function openedCards({ lessonId, states, index }: LessonScope) {
  if (index.lesson.id !== lessonId) {
    throw new Error(
      `Index is for lesson "${index.lesson.id}", not "${lessonId}"`,
    );
  }
  return states.filter(
    (s) => s.lessonId === lessonId && index.cardById.has(s.cardId),
  );
}

function pick(
  ids: readonly string[],
  random: () => number,
): string | undefined {
  return ids[Math.floor(random() * ids.length)];
}

// Lowest predicted recall first, so the cards closest to being forgotten are
// asked even when the session is cut at `size`.
export function selectReview(input: SelectReviewInput): ReviewItem[] {
  const {
    now,
    index,
    lastUsedExerciseIds = [],
    size = REVIEW_SESSION_SIZE,
    random = Math.random,
  } = input;
  const ranked = openedCards(input)
    .map((state) => ({ state, recall: retrievability(state, now) }))
    .sort((a, b) => a.recall - b.recall);

  const lastUsed = new Set(lastUsedExerciseIds);
  const items: ReviewItem[] = [];
  const chosen = new Set<string>();
  for (const { state } of ranked) {
    if (items.length >= size) break;
    const candidates = index.exerciseIdsByCard.get(state.cardId) ?? [];
    // Prefer an exercise not seen last time and not already in this session
    // (one exercise can train several cards); relax only when nothing is left.
    const fresh = candidates.filter((id) => !lastUsed.has(id));
    const unseen = fresh.filter((id) => !chosen.has(id));
    const pool = [unseen, fresh, candidates].find((p) => p.length > 0);
    const exerciseId = pool && pick(pool, random);
    if (!exerciseId) continue;
    chosen.add(exerciseId);
    items.push({ cardId: state.cardId, exerciseId });
  }
  return items;
}

// Shown as a gentle nudge on the lesson card; it never gates review.
export function countForgetting(input: LessonScope): number {
  return openedCards(input).filter(
    (state) => retrievability(state, input.now) < FORGETTING_THRESHOLD,
  ).length;
}
