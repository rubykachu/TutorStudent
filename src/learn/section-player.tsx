"use client";

import { ChevronRight, CircleCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import { LoopingMotion } from "@/components/looping-celebration";
import { RichText } from "@/components/rich-text";
import { Sticker } from "@/components/sticker";
import type { LessonIndex } from "@/content";
import { renderAnswer, renderStep } from "@/exercises/answers";
import {
  ExerciseFrame,
  type FeedbackSounds,
  PromptBlock,
} from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import {
  type OpenEndedResult,
  OpenEndedRunner,
} from "@/exercises/open-ended/open-ended-runner";
import { BlockStage } from "@/learn/block-stage";
import { DoneScreen } from "@/learn/done-screen";
import { LessonProgressCard } from "@/learn/lesson-progress-card";
import { PlayerHeader } from "@/learn/player-header";
import { ScreenBadge } from "@/learn/screen-badge";
import {
  resumeStepIndex,
  type SectionStep,
  sectionSteps,
  stepLabels,
} from "@/learn/section-steps";
import { StickerEarnedCelebration } from "@/learn/sticker-celebration";
import { useFeedbackSounds } from "@/learn/use-feedback-sounds";
import { usePlayOnce } from "@/learn/use-play-once";
import { ButtonSounds, FeedbackSoundsProvider } from "@/lib/feedback-sounds";
import { sectionHeading } from "@/lib/lesson-label";
import { introPath, lessonPath, sectionPath } from "@/lib/routes";
import { LESSON_END_ID } from "@/lib/sound-manifest";
import { now } from "@/lib/time";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  type ChildScope,
  getSectionProgress,
  type SectionPosition,
  type TutorDb,
} from "@/progress/db";
import {
  completeSection,
  recordAttempt,
  type SectionCompletion,
  saveSectionPosition,
} from "@/progress/record";
import { saveOpenEndedWriting } from "@/progress/writing";
import type { Lesson, OpenEndedExercise, Section } from "@/schema/content";
import { preloadVisuals, visualIdsIn } from "@/visuals/registry-visual";
import {
  GuidedStepProvider,
  useGuidedHold,
} from "@/visuals/shared/guided-step";

type SectionPlayerProps = {
  db: TutorDb;
  index: LessonIndex;
  section: Section;
  scope: ChildScope;
  // Where the child left off; the section start when it was never opened.
  initialPosition: SectionPosition;
};

// A finished section and how many sections of its lesson are done with it.
type Finished = SectionCompletion & {
  doneCount: number;
};

// The finish fanfare of a section.
const SECTION_DONE_CUE: readonly string[] = [LESSON_END_ID];

// Plays one section: explanation blocks one at a time ("Tiếp"), the
// comprehension checks (graded, never rated), the practice exercises (rated;
// they open the cards for review) and the recap. Every move is saved, so
// leaving and coming back resumes on the same item. "Quay lại" shows earlier
// screens again without leaving the one the child is on: an exercise already
// finished comes back finished (its answer shown, nothing to check or rate),
// and an exercise in progress keeps its answer and its wrong checks.
const NO_EXERCISE_PROPS = {
  sounds: undefined,
  onExerciseDone: () => undefined,
  onOpenEndedDone: () => undefined,
};
export function SectionPlayer({
  db,
  index,
  section,
  scope,
  initialPosition,
}: SectionPlayerProps) {
  const { lesson } = index;
  const steps = useMemo(() => sectionSteps(section, index), [section, index]);
  const labels = useMemo(() => stepLabels(steps), [steps]);
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(() =>
    resumeStepIndex(steps, initialPosition),
  );
  // An earlier screen shown again, or null while the child is on the step
  // they reached (`stepIndex`), which alone is saved as their position.
  const [viewing, setViewing] = useState<number | null>(null);
  const [completion, setCompletion] = useState<Finished | null>(null);
  const [saving, setSaving] = useState(false);
  const step = steps[stepIndex];
  const { familyId, childId } = scope;
  const { phase, index: itemIndex } = step.position;
  const sounds = useFeedbackSounds(childId);

  // Fetches what the child may see next while this screen is read: the hint
  // and solution visuals of this exercise, the next screen, and the sticker
  // after the last one, so none of them waits behind a placeholder.
  useEffect(() => {
    const next = steps[stepIndex + 1];
    preloadVisuals(visualIdsIn([steps[stepIndex], next ?? lesson.sticker]));
  }, [steps, stepIndex, lesson.sticker]);

  // Saving on every step change also marks the section started on first open.
  // A layout effect starts the save during commit, before the step can be
  // tapped: Dexie runs write transactions in start order, so a quick "Xong
  // phần" can never be overwritten by the save of the step it finished.
  useLayoutEffect(() => {
    saveSectionPosition(
      db,
      { familyId, childId },
      { lessonId: lesson.id, sectionId: section.id },
      { phase, index: itemIndex },
      now(),
    );
  }, [db, familyId, childId, lesson.id, section.id, phase, itemIndex]);

  const back = () => setViewing((viewing ?? stepIndex) - 1);
  const forward = () =>
    setViewing(
      viewing !== null && viewing + 1 < stepIndex ? viewing + 1 : null,
    );

  const advance = async () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
      return;
    }
    setSaving(true);
    const sectionIds = lesson.sections.map((s) => s.id);
    const result = await completeSection(
      db,
      scope,
      { lessonId: lesson.id, sectionId: section.id },
      sectionIds,
      now(),
    );
    const records = await getSectionProgress(db, scope, lesson.id);
    const done = new Set(
      records.filter((r) => r.state === "done").map((r) => r.sectionId),
    );
    setCompletion({
      ...result,
      doneCount: sectionIds.filter((id) => done.has(id)).length,
    });
  };

  const record = (
    exerciseId: string,
    cardIds: readonly string[],
    context: "check" | "practice",
    outcome: ExerciseOutcome,
    at: Date,
  ) =>
    recordAttempt(
      db,
      {
        ...scope,
        lessonId: lesson.id,
        exerciseId,
        cardIds,
        context: outcome.skipped ? "skipped" : context,
        firstTryCorrect: outcome.firstTryCorrect,
        wrongCount: outcome.wrongCount,
      },
      at,
    );

  if (completion) {
    return (
      <FeedbackSoundsProvider sounds={sounds}>
        <ButtonSounds>
          <PlayerHeader lessonId={lesson.id} childId={childId} />
          <SectionDone
            lesson={lesson}
            section={section}
            completion={completion}
          />
        </ButtonSounds>
      </FeedbackSoundsProvider>
    );
  }

  const shown = viewing ?? stepIndex;
  // From the first screen "Quay lại" leads to the lesson's introduction
  // when it has one.
  const backToIntro = lesson.overview
    ? () => router.push(introPath(lesson.id))
    : undefined;
  const liveStep = (
    <StepView
      key={`${step.position.phase}-${step.position.index}`}
      step={step}
      index={index}
      finished={false}
      saving={saving}
      sounds={sounds}
      onNext={advance}
      onExerciseDone={async (exerciseId, cardIds, context, outcome) => {
        await record(exerciseId, cardIds, context, outcome, now());
        await advance();
      }}
      onOpenEndedDone={async (exercise, context, result) => {
        const at = now();
        // The open-ended task itself carries no cards; its graded steps may,
        // and those answers count like any other exercise of this phase.
        for (const [i, outcome] of result.steps.entries()) {
          const inner = exercise.steps[i];
          if (inner && inner.cardIds.length > 0) {
            await record(inner.id, inner.cardIds, context, outcome, at);
          }
        }
        await saveOpenEndedWriting(db, scope, exercise.id, result, at);
        await advance();
      }}
    />
  );
  const viewedStep = viewing === null ? undefined : steps[viewing];

  return (
    <FeedbackSoundsProvider sounds={sounds}>
      <ButtonSounds>
        <PlayerHeader
          lessonId={lesson.id}
          childId={childId}
          progress={{
            current: shown,
            total: steps.length,
            labels,
            reached: stepIndex,
            // The dot of the screen the child is on returns from a look back.
            onSelect: (i) => setViewing(i >= stepIndex ? null : i),
          }}
          onBack={shown > 0 ? back : backToIntro}
        />
        <h1 className="text-block font-semibold md:text-block-lg">
          <RichText
            text={sectionHeading(
              lesson.sections.indexOf(section),
              section.title,
            )}
          />
        </h1>
        {viewedStep && (
          <StepView
            key={`viewed-${viewing}`}
            step={viewedStep}
            index={index}
            // Every step before the one reached was finished to get past it.
            finished
            saving={false}
            onNext={forward}
            {...NO_EXERCISE_PROPS}
          />
        )}
        {/* An exercise in progress stays mounted while an earlier screen is
        shown, so coming back finds the answer and the wrong checks as they
        were; any other screen is simply drawn again. */}
        {(viewedStep === undefined || step.kind === "exercise") && (
          <div
            hidden={viewedStep !== undefined}
            // No box of its own while shown, so the step stays a direct part of
            // the page's column layout.
            className={viewedStep === undefined ? "contents" : undefined}
            data-live-step
          >
            {liveStep}
          </div>
        )}
      </ButtonSounds>
    </FeedbackSoundsProvider>
  );
}

type StepViewProps = {
  step: SectionStep;
  index: LessonIndex;
  // Shown again through "Quay lại": an exercise comes back finished.
  finished: boolean;
  saving: boolean;
  sounds: FeedbackSounds | undefined;
  onNext: () => void;
  onExerciseDone: (
    exerciseId: string,
    cardIds: readonly string[],
    context: "check" | "practice",
    outcome: ExerciseOutcome,
  ) => void;
  onOpenEndedDone: (
    exercise: OpenEndedExercise,
    context: "check" | "practice",
    result: OpenEndedResult,
  ) => void;
};

function StepView({
  step,
  index,
  finished,
  saving,
  sounds,
  onNext,
  onExerciseDone,
  onOpenEndedDone,
}: StepViewProps) {
  const { lesson, conceptById } = index;
  switch (step.kind) {
    case "block":
      return (
        <div className="flex flex-1 flex-col gap-4" data-section-step="block">
          <ScreenBadge kind="theory" />
          {/* A guided screen's "Tiếp" waits until the child did the task
            (or asked to see how); a screen looked at again never waits. */}
          <GuidedStepProvider enabled={!finished}>
            <BlockStage block={step.block} videos={lesson.videos} />
            <BottomBar>
              <NextButton onClick={onNext} />
            </BottomBar>
          </GuidedStepProvider>
        </div>
      );
    case "recap":
      return (
        <div className="flex flex-1 flex-col gap-4" data-section-step="recap">
          <ScreenBadge kind="theory" />
          <BlockStage
            block={step.recap}
            recap
            heading={
              <h2 className="text-block font-semibold md:text-block-lg">
                Nhớ nhé!
              </h2>
            }
          />
          <BottomBar>
            <BigButton onClick={onNext} disabled={saving}>
              <CircleCheck aria-hidden className="size-6" />
              Xong phần
            </BigButton>
          </BottomBar>
        </div>
      );
    case "exercise": {
      const { exercise, context } = step;
      return (
        <div
          className="flex flex-1 flex-col gap-4"
          data-section-step="exercise"
          data-exercise={exercise.id}
          data-exercise-type={exercise.type}
          data-context={context}
        >
          <ScreenBadge kind={context} />
          {finished ? (
            <>
              {exercise.type === "openEnded" ? (
                <FinishedOpenEnded exercise={exercise} />
              ) : (
                <ExerciseFrame
                  exercise={exercise}
                  concepts={conceptById}
                  finished
                  onDone={() => undefined}
                >
                  {(slot) => renderAnswer(exercise, slot)}
                </ExerciseFrame>
              )}
              <BottomBar>
                <BigButton onClick={onNext}>
                  Tiếp
                  <ChevronRight aria-hidden className="size-6" />
                </BigButton>
              </BottomBar>
            </>
          ) : exercise.type === "openEnded" ? (
            <OpenEndedRunner
              exercise={exercise}
              renderStep={renderStep}
              concepts={conceptById}
              sounds={sounds}
              skippable
              onDone={(result) => onOpenEndedDone(exercise, context, result)}
            />
          ) : (
            <ExerciseFrame
              exercise={exercise}
              concepts={conceptById}
              sounds={sounds}
              skippable
              onDone={(outcome) =>
                onExerciseDone(exercise.id, exercise.cardIds, context, outcome)
              }
            >
              {(slot) => renderAnswer(exercise, slot)}
            </ExerciseFrame>
          )}
        </div>
      );
    }
  }
}

// "Tiếp" of a theory screen, off while a guided task on it is unfinished.
function NextButton({ onClick }: { onClick: () => void }) {
  const held = useGuidedHold();
  return (
    <BigButton onClick={onClick} disabled={held}>
      Tiếp
      <ChevronRight aria-hidden className="size-6" />
    </BigButton>
  );
}

const NO_PARTS = new Map();

// An open-ended task shown again after it was handed in: its prompt and a
// note that it is done; the writing itself is kept with the child's progress.
function FinishedOpenEnded({ exercise }: { exercise: OpenEndedExercise }) {
  return (
    <div className="flex flex-col gap-4" data-open-ended data-stage="finished">
      {exercise.prompt.map((block, i) => (
        <PromptBlock
          // Prompt blocks have no ids; their order is fixed content.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          block={block}
          blockHighlight={undefined}
          parts={NO_PARTS}
        />
      ))}
      <p className="flex items-center gap-2 rounded-xl border-3 border-correct bg-correct-soft p-4 font-semibold">
        <CircleCheck aria-hidden className="size-7 shrink-0 text-correct" />
        Bạn đã làm xong bài này.
      </p>
    </div>
  );
}

// Plays the finish fanfare of a section once, as the screen appears.
function SectionDoneSound() {
  usePlayOnce(SECTION_DONE_CUE);
  return null;
}

function SectionDone({
  lesson,
  section,
  completion,
}: {
  lesson: Lesson;
  section: Section;
  completion: Finished;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const total = lesson.sections.length;
  if (completion.lessonDone) {
    return (
      <DoneScreen
        stepAttr={{ name: "data-section-step", value: "sticker" }}
        title="Giỏi quá!"
        art={
          // The confetti sits beside the springing sticker, not in it, so it
          // is not scaled with it.
          <div className="relative">
            <motion.div
              className="w-48 md:w-64"
              initial={
                reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }
              }
              animate={
                reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              transition={
                reducedMotion
                  ? { duration: 0.3 }
                  : { type: "spring", stiffness: 260, damping: 12 }
              }
            >
              <LoopingMotion>
                <Sticker
                  visualId={lesson.sticker.visualId}
                  name={lesson.sticker.name}
                  done={total}
                  total={total}
                />
              </LoopingMotion>
            </motion.div>
            <StickerEarnedCelebration />
          </div>
        }
        actions={
          <Link href={lessonPath(lesson.id)} className={bigButtonClassName()}>
            Về bài
          </Link>
        }
      >
        {/* The sticker name on its own line, so "sticker" never ends a line
            alone and a long name wraps as a whole. */}
        <div className="flex max-w-lg flex-col gap-1 text-balance">
          <p>Bạn học xong cả bài và nhận được sticker</p>
          <p className="font-heading text-block font-bold md:text-block-lg">
            {`“${lesson.sticker.name}”`}
          </p>
        </div>
      </DoneScreen>
    );
  }
  return (
    <DoneScreen
      stepAttr={{ name: "data-section-step", value: "section-done" }}
      title="Xong phần này!"
      celebrate
      actions={
        <>
          {completion.nextSectionId && (
            <Link
              href={sectionPath(lesson.id, completion.nextSectionId)}
              className={bigButtonClassName()}
            >
              Học phần tiếp
              <ChevronRight aria-hidden className="size-6" />
            </Link>
          )}
          <Link
            href={lessonPath(lesson.id)}
            className={bigButtonClassName("secondary")}
          >
            Về bài
          </Link>
        </>
      }
    >
      <SectionDoneSound />
      <p className="max-w-2xl text-balance">{`Bạn vừa học xong “${section.title}”. Giỏi lắm!`}</p>
      <LessonProgressCard lesson={lesson} done={completion.doneCount} />
    </DoneScreen>
  );
}
