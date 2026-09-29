"use client";

import { ChevronRight, CircleCheck, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useLayoutEffect, useMemo, useState } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import { SectionStepper } from "@/components/section-stepper";
import { Sticker } from "@/components/sticker";
import type { LessonIndex } from "@/content";
import { renderAnswer, renderStep } from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import {
  type OpenEndedResult,
  OpenEndedRunner,
} from "@/exercises/open-ended/open-ended-runner";
import { BlockStage } from "@/learn/block-stage";
import { DoneScreen } from "@/learn/done-screen";
import {
  resumeStepIndex,
  type SectionStep,
  sectionSteps,
} from "@/learn/section-steps";
import { useCorrectSound } from "@/learn/use-correct-sound";
import { lessonPath, sectionPath } from "@/lib/routes";
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

type SectionPlayerProps = {
  db: TutorDb;
  index: LessonIndex;
  section: Section;
  scope: ChildScope;
  // Where the child left off; the section start when it was never opened.
  initialPosition: SectionPosition;
};

const EXERCISE_LABELS = { check: "Kiểm tra nhanh", practice: "Luyện tập" };

// A finished section and how many sections of its lesson are done with it.
type Finished = SectionCompletion & { doneCount: number };

// Plays one section: explanation blocks one at a time ("Tiếp"), the
// comprehension checks (graded, never rated), the practice exercises (rated;
// they open the cards for review) and the recap. Every move is saved, so
// leaving and coming back resumes on the same item.
export function SectionPlayer({
  db,
  index,
  section,
  scope,
  initialPosition,
}: SectionPlayerProps) {
  const { lesson } = index;
  const steps = useMemo(() => sectionSteps(section, index), [section, index]);
  const [stepIndex, setStepIndex] = useState(() =>
    resumeStepIndex(steps, initialPosition),
  );
  const [completion, setCompletion] = useState<Finished | null>(null);
  const [saving, setSaving] = useState(false);
  const step = steps[stepIndex];
  const { familyId, childId } = scope;
  const { phase, index: itemIndex } = step.position;
  const onCorrect = useCorrectSound(childId);

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
        context,
        firstTryCorrect: outcome.firstTryCorrect,
        wrongCount: outcome.wrongCount,
      },
      at,
    );

  if (completion) {
    return (
      <>
        <PlayerHeader lessonId={lesson.id} />
        <SectionDone
          lesson={lesson}
          section={section}
          completion={completion}
        />
      </>
    );
  }

  return (
    <>
      <PlayerHeader
        lessonId={lesson.id}
        progress={{ current: stepIndex, total: steps.length }}
      />
      <h1 className="text-block font-semibold md:text-block-lg">
        {section.title}
      </h1>
      <StepView
        key={`${step.position.phase}-${step.position.index}`}
        step={step}
        index={index}
        saving={saving}
        onCorrect={onCorrect}
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
    </>
  );
}

function PlayerHeader({
  lessonId,
  progress,
}: {
  lessonId: string;
  progress?: { current: number; total: number };
}) {
  return (
    <header className="flex items-center gap-4">
      <Link
        href={lessonPath(lessonId)}
        aria-label="Về trang bài"
        className="-ml-2 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground"
      >
        <X aria-hidden className="size-7" />
      </Link>
      {progress && (
        <SectionStepper total={progress.total} current={progress.current} />
      )}
    </header>
  );
}

type StepViewProps = {
  step: SectionStep;
  index: LessonIndex;
  saving: boolean;
  onCorrect: (() => void) | undefined;
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
  saving,
  onCorrect,
  onNext,
  onExerciseDone,
  onOpenEndedDone,
}: StepViewProps) {
  const { lesson, conceptById } = index;
  switch (step.kind) {
    case "block":
      return (
        <div className="flex flex-1 flex-col" data-section-step="block">
          <BlockStage block={step.block} videos={lesson.videos} />
          <BottomBar>
            <BigButton onClick={onNext}>
              Tiếp
              <ChevronRight aria-hidden className="size-6" />
            </BigButton>
          </BottomBar>
        </div>
      );
    case "recap":
      return (
        <div className="flex flex-1 flex-col" data-section-step="recap">
          <BlockStage
            block={step.recap}
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
          <p className="text-caption font-semibold text-muted-foreground">
            {EXERCISE_LABELS[context]}
          </p>
          {exercise.type === "openEnded" ? (
            <OpenEndedRunner
              exercise={exercise}
              renderStep={renderStep}
              concepts={conceptById}
              onCorrect={onCorrect}
              onDone={(result) => onOpenEndedDone(exercise, context, result)}
            />
          ) : (
            <ExerciseFrame
              exercise={exercise}
              concepts={conceptById}
              onCorrect={onCorrect}
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
  if (completion.lessonDone) {
    return (
      <DoneScreen
        stepAttr={{ name: "data-section-step", value: "sticker" }}
        title="Giỏi quá!"
        art={
          <motion.div
            className="w-48 md:w-64"
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }
            }
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={
              reducedMotion
                ? { duration: 0.3 }
                : { type: "spring", stiffness: 260, damping: 12 }
            }
          >
            <Sticker
              visualId={lesson.sticker.visualId}
              name={lesson.sticker.name}
              earned
            />
          </motion.div>
        }
        actions={
          <Link href={lessonPath(lesson.id)} className={bigButtonClassName()}>
            Về bài
          </Link>
        }
      >
        <p>{`Bạn học xong cả bài và nhận sticker “${lesson.sticker.name}”.`}</p>
      </DoneScreen>
    );
  }
  const total = lesson.sections.length;
  const left = total - completion.doneCount;
  return (
    <DoneScreen
      stepAttr={{ name: "data-section-step", value: "section-done" }}
      title="Xong phần này!"
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
      <p className="max-w-lg">{`Bạn vừa học xong “${section.title}”. Giỏi lắm!`}</p>
      <div
        className="flex w-full max-w-lg items-center gap-4 rounded-lg bg-surface p-4 text-left shadow-card md:p-6"
        data-sections-done={completion.doneCount}
      >
        <Sticker
          visualId={lesson.sticker.visualId}
          name={lesson.sticker.name}
          earned={false}
          className="size-16 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-semibold">
            {`Xong ${completion.doneCount}/${total} phần — thêm ${left} phần là có sticker`}
          </p>
          <SectionDots total={total} done={completion.doneCount} />
        </div>
      </div>
    </DoneScreen>
  );
}

// Finished sections of the lesson as a row of ticks: no percentages.
function SectionDots({ total, done }: { total: number; done: number }) {
  return (
    <div aria-hidden className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          // Dots only mark position.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className={`flex size-6 items-center justify-center rounded-full ${
            i < done ? "bg-correct text-primary-foreground" : "bg-muted"
          }`}
        >
          {i < done && <CircleCheck className="size-4" />}
        </span>
      ))}
    </div>
  );
}
