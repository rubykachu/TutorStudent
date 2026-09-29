"use client";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import { SectionStepper } from "@/components/section-stepper";
import { findExercise, type LessonIndex } from "@/content";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import { BlockStage } from "@/learn/block-stage";
import { DoneScreen } from "@/learn/done-screen";
import { useCorrectSound } from "@/learn/use-correct-sound";
import { lessonPath } from "@/lib/routes";
import { now } from "@/lib/time";
import { type ChildScope, listAttempts, type TutorDb } from "@/progress/db";
import { readLessonProgress } from "@/progress/hooks";
import { recordAttempt } from "@/progress/record";
import type { BasicExercise, RecapBlock } from "@/schema/content";
import { selectReview } from "@/srs/select";
import {
  answerCurrent,
  closeRecap,
  currentItem,
  isRated,
  lastReviewExerciseIds,
  type ReviewSession,
  ratedCount,
  recentExerciseIds,
  startSession,
} from "@/srs/session";
import { findVisual } from "@/visuals/registry";

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

// Starts loading a recap's visual while its question is still on screen, so
// the recap is drawn at once if the answer is missed.
function preloadRecap(recap: RecapBlock | undefined): void {
  if (recap?.type !== "visual") return;
  // A failed preload is not an error yet: the recap loads again when drawn.
  findVisual(recap.visualId)
    ?.load()
    .catch(() => undefined);
}

// One on-demand review session of a lesson: the cards closest to being
// forgotten, each asked with one exercise (rated), missed cards asked again
// once at the end (not rated). After a missed question the card's recap stays
// on screen until the child taps "Tiếp"; a right answer moves straight on.
export function ReviewPlayer({
  db,
  index,
  scope,
  onAgain,
  random = Math.random,
}: ReviewPlayerProps) {
  const { lesson } = index;
  const { familyId, childId } = scope;
  const [session, setSession] = useState<ReviewSession | null>(null);
  const onCorrect = useCorrectSound(childId);

  // Cards are chosen once, from the memory states at the moment the session
  // starts; ratings given during the session must not reshuffle it.
  useEffect(() => {
    let live = true;
    Promise.all([
      readLessonProgress(db, childId, lesson.id),
      listAttempts(db, { familyId, childId }),
    ]).then(([progress, attempts]) => {
      if (!live) return;
      const at = now();
      const picks = selectReview({
        now: at,
        lessonId: lesson.id,
        states: progress.cardStates,
        index,
        lastUsedExerciseIds: lastReviewExerciseIds(progress.reviewAttempts),
        recentExerciseIds: recentExerciseIds(attempts, at),
        random,
      }).filter((pick) => basicExercise(index, pick.exerciseId));
      setSession(startSession(picks));
    });
    return () => {
      live = false;
    };
  }, [db, familyId, childId, lesson.id, index, random]);

  const item = session ? currentItem(session) : undefined;
  const upcomingRecap = item && index.cardById.get(item.cardId)?.recap;
  useEffect(() => preloadRecap(upcomingRecap), [upcomingRecap]);

  if (!session) return null;

  const { recap } = session;
  const header = (
    <header className="flex items-center gap-4">
      <Link
        href={lessonPath(lesson.id)}
        aria-label="Về trang bài"
        className="-ml-2 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground"
      >
        <X aria-hidden className="size-7" />
      </Link>
      {session.items.length > 0 && (item || recap) && (
        <SectionStepper
          total={session.items.length}
          current={recap?.at ?? session.current}
        />
      )}
    </header>
  );

  if (recap) {
    const card = index.cardById.get(recap.cardId);
    return (
      <>
        {header}
        <div className="flex flex-1 flex-col" data-review-step="recap">
          {card && (
            <BlockStage
              block={card.recap}
              recap
              heading={
                <h1 className="text-block font-semibold md:text-block-lg">
                  Nhớ nhé!
                </h1>
              }
            />
          )}
          <BottomBar>
            <BigButton onClick={() => setSession(closeRecap(session))}>
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
        <DoneScreen
          stepAttr={{ name: "data-review-step", value: "end" }}
          owl={rated > 0 ? "happy" : "idle"}
          title={rated > 0 ? `Ôn xong ${rated} thẻ!` : "Chưa có thẻ nào để ôn"}
          actions={
            <>
              {rated > 0 && <BigButton onClick={onAgain}>Ôn tiếp</BigButton>}
              <Link
                href={lessonPath(lesson.id)}
                className={bigButtonClassName(
                  rated > 0 ? "secondary" : "primary",
                )}
              >
                Về bài
              </Link>
            </>
          }
        >
          <p className="max-w-md">
            {rated > 0
              ? `Bạn vừa ôn lại bài “${lesson.title}”. Giỏi lắm!`
              : "Học một phần của bài trước rồi ôn nhé."}
          </p>
        </DoneScreen>
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
          onCorrect={onCorrect}
          onDone={finish}
        >
          {(slot) => renderAnswer(exercise, slot)}
        </ExerciseFrame>
      </div>
    </>
  );
}
