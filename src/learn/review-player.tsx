"use client";

import { ChevronRight, CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { BlockView } from "@/components/blocks/block-view";
import { BottomBar } from "@/components/bottom-bar";
import { SectionStepper } from "@/components/section-stepper";
import { findExercise, type LessonIndex } from "@/content";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import { CARD_RECAP_MS } from "@/lib/config";
import { lessonPath } from "@/lib/routes";
import { now } from "@/lib/time";
import type { ChildScope, TutorDb } from "@/progress/db";
import { readLessonProgress } from "@/progress/hooks";
import { recordAttempt } from "@/progress/record";
import type { BasicExercise } from "@/schema/content";
import { selectReview } from "@/srs/select";
import {
  answerCurrent,
  currentItem,
  isRated,
  lastReviewExerciseIds,
  type ReviewSession,
  ratedCount,
  startSession,
} from "@/srs/session";

type ReviewPlayerProps = {
  db: TutorDb;
  index: LessonIndex;
  scope: ChildScope;
  // Starts a fresh session ("Ôn tiếp").
  onAgain: () => void;
  // Returns a number in [0, 1); injected so tests are deterministic.
  random?: () => number;
};

// Open-ended tasks carry no cards, so review only ever meets basic exercises.
function basicExercise(
  index: LessonIndex,
  exerciseId: string,
): BasicExercise | undefined {
  const exercise = findExercise(index, exerciseId);
  return exercise && exercise.type !== "openEnded" ? exercise : undefined;
}

// One on-demand review session of a lesson: the cards closest to being
// forgotten, each asked with one exercise (rated), its recap shown briefly
// after the answer, and missed cards asked again once at the end (not rated).
export function ReviewPlayer({
  db,
  index,
  scope,
  onAgain,
  random = Math.random,
}: ReviewPlayerProps) {
  const { lesson } = index;
  const [session, setSession] = useState<ReviewSession | null>(null);
  // Queue position whose card recap is showing.
  const [recapAt, setRecapAt] = useState<number | null>(null);

  // Cards are chosen once, from the memory states at the moment the session
  // starts; ratings given during the session must not reshuffle it.
  useEffect(() => {
    let live = true;
    readLessonProgress(db, scope.childId, lesson.id).then((progress) => {
      if (!live) return;
      const picks = selectReview({
        now: now(),
        lessonId: lesson.id,
        states: progress.cardStates,
        index,
        lastUsedExerciseIds: lastReviewExerciseIds(progress.reviewAttempts),
        random,
      }).filter((pick) => basicExercise(index, pick.exerciseId));
      setSession(startSession(picks));
    });
    return () => {
      live = false;
    };
  }, [db, scope.childId, lesson.id, index, random]);

  useEffect(() => {
    if (recapAt === null) return;
    const timer = setTimeout(() => setRecapAt(null), CARD_RECAP_MS);
    return () => clearTimeout(timer);
  }, [recapAt]);

  if (!session) return null;

  const item = currentItem(session);
  const header = (
    <header className="flex items-center gap-4">
      <Link
        href={lessonPath(lesson.id)}
        aria-label="Về trang bài"
        className="-ml-2 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground"
      >
        <X aria-hidden className="size-7" />
      </Link>
      {session.items.length > 0 && (item || recapAt !== null) && (
        <SectionStepper
          total={session.items.length}
          current={recapAt ?? session.current}
        />
      )}
    </header>
  );

  if (recapAt !== null) {
    const card = index.cardById.get(session.items[recapAt]?.cardId ?? "");
    const skip = () => setRecapAt(null);
    return (
      <>
        {header}
        {/* Tapping anywhere skips the recap; the button is the keyboard path. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: see above */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: see above */}
        <div
          className="flex flex-1 flex-col gap-6"
          data-review-step="recap"
          onClick={skip}
        >
          <h1 className="text-block font-semibold md:text-block-lg">
            Nhớ nhé!
          </h1>
          {card && (
            <div className="flex flex-col items-center rounded-xl bg-surface p-4 shadow-card md:p-8">
              <BlockView block={card.recap} />
            </div>
          )}
          <BottomBar>
            <BigButton onClick={skip}>
              Tiếp
              <ChevronRight aria-hidden className="size-6" />
            </BigButton>
          </BottomBar>
        </div>
      </>
    );
  }

  if (!item) {
    const rated = ratedCount(session);
    return (
      <>
        {header}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
          data-review-step="end"
        >
          <CircleCheck aria-hidden className="size-20 text-correct" />
          <h1 className="text-title font-bold md:text-title-lg">
            {rated > 0 ? `Ôn xong ${rated} thẻ!` : "Chưa có thẻ nào để ôn"}
          </h1>
          {rated === 0 && <p>Học một phần của bài trước rồi ôn nhé.</p>}
          <BottomBar>
            {rated > 0 && <BigButton onClick={onAgain}>Ôn tiếp</BigButton>}
            <Link
              href={lessonPath(lesson.id)}
              className={bigButtonClassName(
                rated > 0 ? "secondary" : "primary",
              )}
            >
              Về bài
            </Link>
          </BottomBar>
        </div>
      </>
    );
  }

  const exercise = basicExercise(index, item.exerciseId);
  if (!exercise) return null;

  const finish = async (outcome: ExerciseOutcome) => {
    if (isRated(item)) {
      await recordAttempt(
        db,
        {
          ...scope,
          lessonId: lesson.id,
          exerciseId: exercise.id,
          cardIds: exercise.cardIds,
          context: "review",
          firstTryCorrect: outcome.firstTryCorrect,
          wrongCount: outcome.wrongCount,
        },
        now(),
      );
    }
    setRecapAt(session.current);
    setSession(
      answerCurrent(
        session,
        outcome.firstTryCorrect,
        index.exerciseIdsByCard,
        random,
      ),
    );
  };

  return (
    <>
      {header}
      <div
        className="flex flex-1 flex-col gap-4"
        data-review-step="exercise"
        data-card={item.cardId}
        data-reask={item.reask || undefined}
        data-exercise={exercise.id}
        data-exercise-type={exercise.type}
      >
        <p className="text-caption font-semibold text-muted-foreground">
          {item.reask ? "Hỏi lại" : "Ôn bài"}
        </p>
        <ExerciseFrame
          // The same exercise can come back as a re-ask; each ask starts fresh.
          key={session.current}
          exercise={exercise}
          concepts={index.conceptById}
          onDone={finish}
        >
          {(slot) => renderAnswer(exercise, slot)}
        </ExerciseFrame>
      </div>
    </>
  );
}
