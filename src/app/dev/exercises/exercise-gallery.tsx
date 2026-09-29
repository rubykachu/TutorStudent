"use client";

import { useMemo, useState } from "react";
import { BigButton } from "@/components/big-button";
import {
  hasAnswerComponent,
  renderAnswer,
  renderStep,
} from "@/exercises/answers";
import { ExerciseFrame } from "@/exercises/exercise-frame";
import type { ExerciseOutcome } from "@/exercises/machine";
import { OpenEndedRunner } from "@/exercises/open-ended/open-ended-runner";
import type {
  BasicExercise,
  Concept,
  Exercise,
  OpenEndedExercise,
} from "@/schema/content";

type ExerciseGalleryProps = {
  exercises: readonly Exercise[];
  concepts: readonly Concept[];
};

function withAnswerUi(exercise: Exercise): exercise is BasicExercise {
  return exercise.type !== "openEnded" && hasAnswerComponent(exercise.type);
}

export function ExerciseGallery({ exercises, concepts }: ExerciseGalleryProps) {
  const conceptById = useMemo(
    () => new Map(concepts.map((concept) => [concept.id, concept])),
    [concepts],
  );

  return (
    <ol className="mt-8 flex flex-col gap-12">
      {exercises.map((exercise) => (
        <li
          key={exercise.id}
          className="flex flex-col gap-4"
          data-exercise={exercise.id}
          data-exercise-type={exercise.type}
        >
          <h2 className="break-all text-caption text-muted-foreground">
            {exercise.type} · {exercise.id}
          </h2>
          {exercise.type === "openEnded" ? (
            <OpenEndedCard exercise={exercise} concepts={conceptById} />
          ) : withAnswerUi(exercise) ? (
            <ExerciseCard exercise={exercise} concepts={conceptById} />
          ) : (
            <p className="rounded-xl border-2 border-dashed border-border p-4 text-muted-foreground">
              chưa có giao diện
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

function ExerciseCard({
  exercise,
  concepts,
}: {
  exercise: BasicExercise;
  concepts: ReadonlyMap<string, Concept>;
}) {
  // Bumping the round remounts the frame so the exercise can be tried again.
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState<ExerciseOutcome | null>(null);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card md:p-6">
      <ExerciseFrame
        key={round}
        exercise={exercise}
        concepts={concepts}
        onDone={setOutcome}
      >
        {(slot) => renderAnswer(exercise, slot)}
      </ExerciseFrame>
      {outcome && (
        <>
          <p className="text-caption text-muted-foreground" data-outcome>
            {outcome.firstTryCorrect
              ? "Đúng ngay lần đầu."
              : `Xong sau ${outcome.wrongCount} lần sai.`}
          </p>
          <BigButton
            variant="secondary"
            onClick={() => {
              setOutcome(null);
              setRound(round + 1);
            }}
          >
            Làm lại
          </BigButton>
        </>
      )}
    </div>
  );
}

function OpenEndedCard({
  exercise,
  concepts,
}: {
  exercise: OpenEndedExercise;
  concepts: ReadonlyMap<string, Concept>;
}) {
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card md:p-6">
      <OpenEndedRunner
        key={round}
        exercise={exercise}
        concepts={concepts}
        renderStep={renderStep}
        onDone={() => setDone(true)}
      />
      {done && (
        <BigButton
          variant="secondary"
          onClick={() => {
            setDone(false);
            setRound(round + 1);
          }}
        >
          Làm lại
        </BigButton>
      )}
    </div>
  );
}
