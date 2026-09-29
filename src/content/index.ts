import type {
  BasicExercise,
  Card,
  Concept,
  Exercise,
  Lesson,
  LessonSummary,
  Section,
} from "@/schema/content";

// Pure lookups over parsed lessons; safe to import from browser code.

export type AnyExercise = Exercise | BasicExercise;

export type ExerciseEntry = {
  exercise: AnyExercise;
  // JSON path of the exercise inside lesson.json, for error reports.
  path: (string | number)[];
  // Set for openEnded steps: the openEnded exercise that contains the step.
  parentId?: string;
};

// Top-level exercises followed by openEnded steps, which are exercises in
// their own right (own id, own cards) and must never be skipped by lookups.
export function flattenExercises(lesson: Lesson): ExerciseEntry[] {
  const entries: ExerciseEntry[] = [];
  lesson.exercises.forEach((exercise, i) => {
    entries.push({ exercise, path: ["exercises", i] });
    if (exercise.type === "openEnded") {
      exercise.steps.forEach((step, j) => {
        entries.push({
          exercise: step,
          path: ["exercises", i, "steps", j],
          parentId: exercise.id,
        });
      });
    }
  });
  return entries;
}

export type LessonIndex = {
  lesson: Lesson;
  exerciseById: ReadonlyMap<string, ExerciseEntry>;
  cardById: ReadonlyMap<string, Card>;
  sectionById: ReadonlyMap<string, Section>;
  conceptById: ReadonlyMap<string, Concept>;
  // Card -> exercises that train it, in lesson order (steps included).
  exerciseIdsByCard: ReadonlyMap<string, readonly string[]>;
};

function byId<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function indexLesson(lesson: Lesson): LessonIndex {
  const entries = flattenExercises(lesson);
  const exerciseIdsByCard = new Map<string, string[]>();
  for (const { exercise } of entries) {
    for (const cardId of exercise.cardIds) {
      const list = exerciseIdsByCard.get(cardId) ?? [];
      list.push(exercise.id);
      exerciseIdsByCard.set(cardId, list);
    }
  }
  return {
    lesson,
    exerciseById: new Map(entries.map((entry) => [entry.exercise.id, entry])),
    cardById: byId(lesson.cards),
    sectionById: byId(lesson.sections),
    conceptById: byId(lesson.concepts),
    exerciseIdsByCard,
  };
}

// Ids left behind by edited content (e.g. in saved progress) resolve to
// nothing instead of throwing, so callers can skip them.
export function exercisesForCard(
  index: LessonIndex,
  cardId: string,
): AnyExercise[] {
  const ids = index.exerciseIdsByCard.get(cardId) ?? [];
  return ids.flatMap((id) => {
    const entry = index.exerciseById.get(id);
    return entry ? [entry.exercise] : [];
  });
}

export function findExercise(
  index: LessonIndex,
  exerciseId: string,
): AnyExercise | undefined {
  return index.exerciseById.get(exerciseId)?.exercise;
}

// Exercises answered in a section's practice phase. A practiced openEnded
// exercise also practices its steps, since the child answers them there.
export function practiceExerciseIds(lesson: Lesson): Set<string> {
  const ids = new Set(lesson.sections.flatMap((s) => s.practiceIds));
  for (const exercise of lesson.exercises) {
    if (exercise.type === "openEnded" && ids.has(exercise.id)) {
      for (const step of exercise.steps) ids.add(step.id);
    }
  }
  return ids;
}

// Fixture lessons exist for dev and E2E only; real lessons must pass review.
export function isServed(
  lesson: Pick<Lesson, "status">,
  fixture: boolean,
  includeFixture: boolean,
): boolean {
  return fixture ? includeFixture : lesson.status === "published";
}

export function summarizeLesson(lesson: Lesson): LessonSummary {
  return {
    id: lesson.id,
    subject: lesson.subject,
    series: lesson.series,
    order: lesson.order,
    title: lesson.title,
    sourceRef: lesson.sourceRef,
    sections: lesson.sections.map((s) => ({
      id: s.id,
      title: s.title,
      minutes: s.minutes,
    })),
    cardCount: lesson.cards.length,
  };
}

// Keeps only the exercises `keep` accepts in the card -> exercises lookup, so
// review never picks an exercise the app cannot show (e.g. a type whose
// answer UI does not exist yet). Other lookups stay complete.
export function withExercises(
  index: LessonIndex,
  keep: (exercise: AnyExercise) => boolean,
): LessonIndex {
  const exerciseIdsByCard = new Map<string, string[]>();
  for (const [cardId, ids] of index.exerciseIdsByCard) {
    const kept = ids.filter((id) => {
      const entry = index.exerciseById.get(id);
      return entry !== undefined && keep(entry.exercise);
    });
    if (kept.length > 0) exerciseIdsByCard.set(cardId, kept);
  }
  return { ...index, exerciseIdsByCard };
}

// Every served lesson is emitted whole as a static file at this URL.
export const CONTENT_BASE_URL = "/content";

export function lessonContentFile(lessonId: string): string {
  return `${lessonId}.json`;
}

export function lessonContentUrl(lessonId: string): string {
  return `${CONTENT_BASE_URL}/${lessonContentFile(lessonId)}`;
}
