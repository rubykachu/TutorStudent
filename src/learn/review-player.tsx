"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import { findExercise, type LessonIndex } from "@/content";
import { renderAnswer } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import { BlockStage } from "@/learn/block-stage";
import { CardClip } from "@/learn/card-clip";
import { DoneScreen } from "@/learn/done-screen";
import { LessonProgressCard } from "@/learn/lesson-progress-card";
import { stickerFill } from "@/learn/next-step";
import { PlayerHeader } from "@/learn/player-header";
import { useCorrectSound } from "@/learn/use-correct-sound";
import { lessonPath } from "@/lib/routes";
import { now } from "@/lib/time";
import { type ChildScope, listAttempts, type TutorDb } from "@/progress/db";
import { readLessonProgress } from "@/progress/hooks";
import { recordAttempt } from "@/progress/record";
import type { BasicExercise } from "@/schema/content";
import { selectReview } from "@/srs/select";
import {
  answerCurrent,
  answeredCount,
  closeRecap,
  currentItem,
  isRated,
  lastReviewExerciseIds,
  type ReviewSession,
  recentExerciseIds,
  sectionExerciseIds,
  startSession,
} from "@/srs/session";
import { preloadVisuals, visualIdsIn } from "@/visuals/registry-visual";

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
// forgotten, each asked with one exercise (rated), missed cards asked again
// once at the end (not rated). After a missed question the card's recap stays
// on screen until the child taps "Tiếp"; a right answer moves straight on.
// "Quay lại" shows the questions already answered, finished and locked, then
// "Tiếp" leads back to the screen the child was on.
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
  // Sections of the lesson done, for the progress shown when review ends;
  // reviewing never changes it, so it is read once with the cards.
  const [sectionsDone, setSectionsDone] = useState(0);
  // An answered question shown again, by queue position; null while the
  // child is on the current question or recap.
  const [viewing, setViewing] = useState<number | null>(null);
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
      const recent = recentExerciseIds(attempts, at);
      const picks = selectReview({
        now: at,
        lessonId: lesson.id,
        states: progress.cardStates,
        index,
        lastUsedExerciseIds: lastReviewExerciseIds(progress.reviewAttempts),
        recentExerciseIds: recent,
        random,
      }).filter((pick) => basicExercise(index, pick.exerciseId));
      setSectionsDone(
        stickerFill(
          lesson.sections,
          progress.sections,
          progress.sticker !== undefined,
        ).done,
      );
      // A re-ask avoids what the child met moments ago or while learning.
      setSession(
        startSession(picks, [
          ...recent,
          ...sectionExerciseIds(index.lesson.sections),
        ]),
      );
    });
    return () => {
      live = false;
    };
  }, [db, familyId, childId, lesson.id, lesson.sections, index, random]);

  const item = session ? currentItem(session) : undefined;
  // While a question is on screen, fetch the visuals of its hints, of the
  // card recap shown if it is missed, and of the next question.
  const upcoming = session?.items[session.current + 1];
  const upcomingVisuals = item
    ? visualIdsIn([
        findExercise(index, item.exerciseId),
        index.cardById.get(item.cardId)?.recap,
        upcoming && findExercise(index, upcoming.exerciseId),
      ]).join(" ")
    : "";
  useEffect(() => {
    if (upcomingVisuals) preloadVisuals(upcomingVisuals.split(" "));
  }, [upcomingVisuals]);

  if (!session) return null;

  const { recap } = session;
  // The recap belongs to the question just missed, so going back from it
  // starts at that question.
  const live = recap ? recap.at + 1 : session.current;
  const onScreen = viewing ?? recap?.at ?? session.current;
  const canGoBack =
    viewing !== null
      ? viewing > 0
      : (item !== undefined || recap !== null) && live > 0;
  const header = (
    <PlayerHeader
      lessonId={lesson.id}
      progress={
        session.items.length > 0 && (item || recap)
          ? { total: session.items.length, current: onScreen }
          : undefined
      }
      onBack={canGoBack ? () => setViewing((viewing ?? live) - 1) : undefined}
    />
  );
  const viewedItem = viewing === null ? undefined : session.items[viewing];
  const viewedExercise =
    viewedItem && basicExercise(index, viewedItem.exerciseId);
  const viewed = viewedExercise && viewedItem && (
    <div
      className="flex flex-1 flex-col gap-4"
      data-review-step="answered"
      data-exercise={viewedExercise.id}
      data-exercise-type={viewedExercise.type}
    >
      <p className="text-caption font-semibold text-muted-foreground">
        {viewedItem.reask ? "Hỏi lại" : "Ôn bài"}
      </p>
      <ExerciseFrame
        key={`answered-${viewing}`}
        exercise={viewedExercise}
        concepts={index.conceptById}
        finished
        onDone={() => undefined}
      >
        {(slot) => renderAnswer(viewedExercise, slot)}
      </ExerciseFrame>
      <BottomBar>
        <BigButton
          onClick={() =>
            setViewing(
              viewing !== null && viewing + 1 < live ? viewing + 1 : null,
            )
          }
        >
          Tiếp
          <ChevronRight aria-hidden className="size-6" />
        </BigButton>
      </BottomBar>
    </div>
  );

  if (viewed && recap) {
    return (
      <>
        {header}
        {viewed}
      </>
    );
  }

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
          <CardClip
            key={`${recap.cardId}-${recap.at}`}
            lesson={lesson}
            cardId={recap.cardId}
          />
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
    const answered = answeredCount(session);
    return (
      <>
        {header}
        <DoneScreen
          stepAttr={{ name: "data-review-step", value: "end" }}
          owl={answered > 0 ? "happy" : "idle"}
          title={answered > 0 ? "Ôn xong rồi!" : "Chưa có thẻ nào để ôn"}
          actions={
            <>
              {answered > 0 && <BigButton onClick={onAgain}>Ôn tiếp</BigButton>}
              <Link
                href={lessonPath(lesson.id)}
                className={bigButtonClassName(
                  answered > 0 ? "secondary" : "primary",
                )}
              >
                Về bài
              </Link>
            </>
          }
        >
          {answered > 0 ? (
            <>
              {/* Every question asked counts, re-asks included, so the
                  number matches what the child just went through. */}
              <p
                className="max-w-md text-balance"
                data-review-answered={answered}
              >
                {`Bạn vừa ôn ${answered} câu. Giỏi lắm!`}
              </p>
              <LessonProgressCard lesson={lesson} done={sectionsDone} />
            </>
          ) : (
            <p className="max-w-md text-balance">
              Học một phần của bài trước rồi ôn nhé.
            </p>
          )}
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
      {viewed}
      {/* Kept mounted while an answered question is shown, so the question
        in progress keeps its answer and wrong checks for the rating. */}
      <div
        hidden={viewed !== undefined}
        className={viewed === undefined ? "contents" : undefined}
        data-live-step
      >
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
      </div>
    </>
  );
}
