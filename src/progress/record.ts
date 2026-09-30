import { newId } from "@/lib/id";
import { vnDayKey } from "@/lib/time";
import {
  type AttemptContext,
  type AttemptRecord,
  awardSticker,
  type ChildScope,
  markActivityDay,
  SECTION_START,
  type SectionPosition,
  type TutorDb,
} from "@/progress/db";
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
// A skipped question was not answered, so it says nothing about the card.
function isRated(context: AttemptContext): boolean {
  return context === "practice" || context === "review";
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

export type SectionRef = { lessonId: string; sectionId: string };

// Moves the child's place in a section. Going through a finished section
// again keeps it finished.
export async function saveSectionPosition(
  db: TutorDb,
  scope: ChildScope,
  ref: SectionRef,
  position: SectionPosition,
  now: Date,
): Promise<void> {
  const { familyId, childId } = scope;
  await db.transaction("rw", db.sectionProgress, async () => {
    const previous = await db.sectionProgress.get([
      familyId,
      childId,
      ref.sectionId,
    ]);
    await db.sectionProgress.put({
      familyId,
      childId,
      ...ref,
      state: previous?.state === "done" ? "done" : "in_progress",
      position,
      updatedAt: now.toISOString(),
    });
  });
}

export type SectionCompletion = {
  lessonDone: boolean;
  // The first section not done yet, in lesson order (sections are never
  // locked, so it may come before this one); null once the lesson is done.
  nextSectionId: string | null;
};

// Marks a section done and rewinds it, so opening it again starts from the
// first block. Once every section of the lesson is done the lesson's sticker
// is awarded.
export async function completeSection(
  db: TutorDb,
  scope: ChildScope,
  ref: SectionRef,
  lessonSectionIds: readonly string[],
  now: Date,
): Promise<SectionCompletion> {
  const { familyId, childId } = scope;
  return db.transaction("rw", db.sectionProgress, db.stickers, async () => {
    await db.sectionProgress.put({
      familyId,
      childId,
      ...ref,
      state: "done",
      position: SECTION_START,
      updatedAt: now.toISOString(),
    });
    const records = await db.sectionProgress
      .where("[familyId+childId+lessonId]")
      .equals([familyId, childId, ref.lessonId])
      .toArray();
    const done = new Set(
      records.filter((r) => r.state === "done").map((r) => r.sectionId),
    );
    const open = lessonSectionIds.filter((id) => !done.has(id));
    if (open.length === 0) {
      await awardSticker(db, scope, ref.lessonId, now);
      return { lessonDone: true, nextSectionId: null };
    }
    return { lessonDone: false, nextSectionId: open[0] ?? null };
  });
}
