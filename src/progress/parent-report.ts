import type { AnyExercise, LessonIndex } from "@/content";
import {
  FORGETTING_THRESHOLD,
  PARENT_RECENT_DAYS,
  PARENT_TOP_COUNT,
  PARENT_WRONG_WINDOW_DAYS,
  STUDY_ATTEMPT_FLOOR_SECONDS,
  STUDY_GAP_MAX_MINUTES,
} from "@/lib/config";
import { dayNumber, vnDayKey, weekdayOfDay } from "@/lib/time";
import type {
  AttemptRecord,
  SectionProgressRecord,
  StickerRecord,
} from "@/progress/db";
import type { Card, LessonSummary } from "@/schema/content";
import { retrievability } from "@/srs/schedule";
import type { LessonCardState } from "@/srs/select";

// Pure summaries of one child's progress for the parent page.

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_DAY = 24 * 60 * MS_PER_MINUTE;

// ---------------------------------------------------------------------------
// Study time

// Study time is estimated from answer timestamps, the only activity that is
// logged with a time. Within one Vietnam day, answers are taken in order and
// each answer is credited with the time since the previous one when that gap
// is at most STUDY_GAP_MAX_MINUTES (the child was working on it); a longer
// gap is a break and credits nothing. Every answer is credited at least
// STUDY_ATTEMPT_FLOOR_SECONDS, which covers the first answer of a day or after
// a break, whose own time is unknown. Reading explanation blocks before the
// first answer is not seen, so the estimate leans low rather than high.
export function studySecondsByDay(
  attempts: readonly Pick<AttemptRecord, "at">[],
): Map<string, number> {
  const byDay = new Map<string, number[]>();
  for (const { at } of attempts) {
    const time = Date.parse(at);
    const day = vnDayKey(new Date(time));
    const list = byDay.get(day) ?? [];
    list.push(time);
    byDay.set(day, list);
  }
  const gapMaxMs = STUDY_GAP_MAX_MINUTES * MS_PER_MINUTE;
  const floorMs = STUDY_ATTEMPT_FLOOR_SECONDS * MS_PER_SECOND;
  const seconds = new Map<string, number>();
  for (const [day, times] of byDay) {
    times.sort((a, b) => a - b);
    let totalMs = 0;
    times.forEach((time, i) => {
      const previous = times[i - 1];
      const gap =
        previous === undefined ? Number.POSITIVE_INFINITY : time - previous;
      totalMs += Math.max(gap <= gapMaxMs ? gap : 0, floorMs);
    });
    seconds.set(day, totalMs / MS_PER_SECOND);
  }
  return seconds;
}

// Whole minutes to show; any study at all shows as at least one minute.
export function displayMinutes(seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.max(1, Math.round(seconds / 60));
}

// The day key of a day number from `dayNumber`.
export function dayKeyOf(day: number): string {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

export type DayStudy = {
  day: string;
  // Monday = 0 … Sunday = 6.
  weekday: number;
  minutes: number;
};

// The last `count` Vietnam days, oldest first, ending with `today`.
export function recentStudyDays(
  attempts: readonly Pick<AttemptRecord, "at">[],
  today: string,
  count: number = PARENT_RECENT_DAYS,
): DayStudy[] {
  const seconds = studySecondsByDay(attempts);
  const last = dayNumber(today);
  return Array.from({ length: count }, (_, i) => {
    const number = last - (count - 1 - i);
    const day = dayKeyOf(number);
    return {
      day,
      weekday: weekdayOfDay(number),
      minutes: displayMinutes(seconds.get(day) ?? 0),
    };
  });
}

// ---------------------------------------------------------------------------
// Content lookups

// Global content ids read `<lesson-slug>.<kind>.<name>`, so the lesson of an
// exercise or card is known without loading any lesson.
export function lessonIdOfContentId(id: string): string {
  return id.split(".")[0] ?? id;
}

// Everything the child has touched points at a lesson; those are the lessons
// the parent page loads to name cards, questions and writings.
export function touchedLessonIds(records: {
  attempts: readonly Pick<AttemptRecord, "lessonId">[];
  cardStates: readonly Pick<LessonCardState, "lessonId">[];
  writings: readonly { exerciseId: string }[];
}): string[] {
  const ids = new Set<string>([
    ...records.attempts.map((a) => a.lessonId),
    ...records.cardStates.map((s) => s.lessonId),
    ...records.writings.map((w) => lessonIdOfContentId(w.exerciseId)),
  ]);
  return [...ids].sort();
}

export function shorten(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  // Cut at a word boundary unless that would drop most of the text.
  const kept = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut;
  return `${kept.replace(/[\s,.;:]+$/, "")}…`;
}

export const PROMPT_SUMMARY_LENGTH = 90;

export type PromptSummary = {
  // Words of the question: its notes and reading passage, shortened.
  text: string;
  // The first formula of the question, shown rendered next to the words.
  tex: string | null;
};

export function promptSummary(
  exercise: Pick<AnyExercise, "prompt">,
  maxLength: number = PROMPT_SUMMARY_LENGTH,
): PromptSummary {
  const words: string[] = [];
  let tex: string | null = null;
  for (const block of exercise.prompt) {
    if (block.type === "note") words.push(block.text);
    if (block.type === "passage") {
      for (const paragraph of block.paragraphs) {
        for (const sentence of paragraph.sentences) words.push(sentence.text);
      }
    }
    if (block.type === "image") words.push(block.alt);
    if (block.type === "formula" && tex === null) tex = block.tex;
  }
  return { text: shorten(words.join(" "), maxLength), tex };
}

// What a card is about, in the lesson's own words: its concept names.
export function cardConceptNames(card: Card, index: LessonIndex): string[] {
  return card.conceptIds.flatMap((id) => {
    const concept = index.conceptById.get(id);
    return concept ? [concept.name] : [];
  });
}

// ---------------------------------------------------------------------------
// Cards the child is forgetting

export type ForgettingCard = {
  cardId: string;
  lessonId: string;
  // Predicted chance of recalling the card now, 0–1.
  recall: number;
  card: Card;
  index: LessonIndex;
};

// Opened cards the child is starting to forget (below the same threshold the
// lesson page uses), lowest recall first. A card just learned is not "hay
// quên", so listing it would mislead the parent. Cards whose lesson is not
// loaded or that edited content no longer has are skipped.
export function topForgettingCards(
  states: readonly LessonCardState[],
  lessons: ReadonlyMap<string, LessonIndex>,
  now: Date,
  count: number = PARENT_TOP_COUNT,
): ForgettingCard[] {
  return states
    .flatMap((state) => {
      const index = lessons.get(state.lessonId);
      const card = index?.cardById.get(state.cardId);
      if (!index || !card) return [];
      return [
        {
          cardId: state.cardId,
          lessonId: state.lessonId,
          recall: retrievability(state, now),
          card,
          index,
        },
      ];
    })
    .filter((item) => item.recall < FORGETTING_THRESHOLD)
    .sort((a, b) => a.recall - b.recall || a.cardId.localeCompare(b.cardId))
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Questions the child often gets wrong

export type WrongExercise = {
  exerciseId: string;
  lessonId: string;
  // Wrong checks summed over the window's answers.
  wrongCount: number;
  // Answers in the window that were not right on the first try.
  misses: number;
  lastAt: string;
};

// Questions missed in the last `windowDays`, most wrong checks first; ties
// go to the question missed more often, then the one missed most recently.
export function topWrongExercises(
  attempts: readonly Pick<
    AttemptRecord,
    "exerciseId" | "lessonId" | "firstTryCorrect" | "wrongCount" | "at"
  >[],
  now: Date,
  windowDays: number = PARENT_WRONG_WINDOW_DAYS,
  count: number = PARENT_TOP_COUNT,
): WrongExercise[] {
  const since = now.getTime() - windowDays * MS_PER_DAY;
  const byExercise = new Map<string, WrongExercise>();
  for (const attempt of attempts) {
    if (attempt.firstTryCorrect && attempt.wrongCount === 0) continue;
    if (Date.parse(attempt.at) < since) continue;
    const entry = byExercise.get(attempt.exerciseId) ?? {
      exerciseId: attempt.exerciseId,
      lessonId: attempt.lessonId,
      wrongCount: 0,
      misses: 0,
      lastAt: attempt.at,
    };
    entry.wrongCount += attempt.wrongCount;
    entry.misses += 1;
    if (attempt.at > entry.lastAt) entry.lastAt = attempt.at;
    byExercise.set(attempt.exerciseId, entry);
  }
  return [...byExercise.values()]
    .sort(
      (a, b) =>
        b.wrongCount - a.wrongCount ||
        b.misses - a.misses ||
        b.lastAt.localeCompare(a.lastAt),
    )
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Lessons

export type LessonSections = {
  lesson: LessonSummary;
  done: number;
  total: number;
  sticker: boolean;
};

// Finished sections per lesson. A sticker means every section was finished,
// even if section records were later lost, so it counts them all as done.
export function lessonSections(
  lessons: readonly LessonSummary[],
  sections: readonly Pick<SectionProgressRecord, "sectionId" | "state">[],
  stickers: readonly Pick<StickerRecord, "lessonId">[],
): LessonSections[] {
  const done = new Set(
    sections.filter((s) => s.state === "done").map((s) => s.sectionId),
  );
  const earned = new Set(stickers.map((s) => s.lessonId));
  return lessons.map((lesson) => {
    const total = lesson.sections.length;
    const sticker = earned.has(lesson.id);
    return {
      lesson,
      total,
      sticker,
      done: sticker
        ? total
        : lesson.sections.filter((s) => done.has(s.id)).length,
    };
  });
}
