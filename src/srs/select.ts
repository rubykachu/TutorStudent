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
  // Exercises the child answered moments ago in any context, e.g. the
  // section practice that just ended.
  recentExerciseIds?: Iterable<string>;
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

// Card -> exercises in the practice of the sections that open the card. These
// are the questions the child met while learning it; the rest of the card's
// exercises are its bank, which review prefers so it does not repeat lessons.
function sectionPracticeByCard(
  index: LessonIndex,
): Map<string, ReadonlySet<string>> {
  const byCard = new Map<string, Set<string>>();
  for (const section of index.lesson.sections) {
    const practice = new Set(section.practiceIds);
    for (const id of section.practiceIds) {
      const exercise = index.exerciseById.get(id)?.exercise;
      for (const cardId of exercise?.cardIds ?? []) {
        const set = byCard.get(cardId) ?? new Set<string>();
        for (const p of practice) set.add(p);
        byCard.set(cardId, set);
      }
    }
  }
  return byCard;
}

// Narrows `candidates` by each preference in turn, skipping a preference that
// would leave nothing, so a card is always asked with some exercise.
export function narrow(
  candidates: readonly string[],
  preferences: readonly ((id: string) => boolean)[],
): readonly string[] {
  let pool = candidates;
  for (const prefer of preferences) {
    const kept = pool.filter(prefer);
    if (kept.length > 0) pool = kept;
  }
  return pool;
}

// Lowest predicted recall first, so the cards closest to being forgotten are
// asked even when the session is cut at `size`.
export function selectReview(input: SelectReviewInput): ReviewItem[] {
  const {
    now,
    index,
    lastUsedExerciseIds = [],
    recentExerciseIds = [],
    size = REVIEW_SESSION_SIZE,
    random = Math.random,
  } = input;
  const ranked = openedCards(input)
    .map((state) => ({ state, recall: retrievability(state, now) }))
    .sort((a, b) => a.recall - b.recall);

  const lastUsed = new Set(lastUsedExerciseIds);
  const recent = new Set(recentExerciseIds);
  const practiceByCard = sectionPracticeByCard(index);
  const items: ReviewItem[] = [];
  const chosen = new Set<string>();
  for (const { state } of ranked) {
    if (items.length >= size) break;
    const candidates = index.exerciseIdsByCard.get(state.cardId) ?? [];
    const practice = practiceByCard.get(state.cardId) ?? new Set<string>();
    // Most important first: not already in this session (one exercise can
    // train several cards), not answered moments ago, not asked in the last
    // review, then a bank exercise over one from the section's practice.
    const pool = narrow(candidates, [
      (id) => !chosen.has(id),
      (id) => !recent.has(id),
      (id) => !lastUsed.has(id),
      (id) => !practice.has(id),
    ]);
    const exerciseId = pick(pool, random);
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

// Cards of the lesson the child has opened; review is offered once there is one.
export function countOpened(input: LessonScope): number {
  return openedCards(input).length;
}
