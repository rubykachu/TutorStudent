"use client";

import { type ReactNode, useState } from "react";
import {
  type AnswerSlotProps,
  ExerciseFrame,
  PromptBlock,
} from "@/exercises/exercise-frame";
import type {
  FeedbackHighlights,
  MascotExpression,
} from "@/exercises/feedback";
import type { ExerciseInput } from "@/exercises/input";
import type { ExerciseOutcome } from "@/exercises/machine";
import { RubricChecklist } from "@/exercises/open-ended/rubric-checklist";
import type { WritingResult } from "@/exercises/open-ended/writing";
import { WritingStep } from "@/exercises/open-ended/writing-step";
import type { WritingCheck } from "@/progress/db";
import type {
  BasicExercise,
  Concept,
  OpenEndedExercise,
} from "@/schema/content";

// Draws the answer component of one guided step inside its exercise frame.
export type StepRenderer = (
  exercise: BasicExercise,
  slot: AnswerSlotProps<ExerciseInput>,
) => ReactNode;

export type OpenEndedResult = {
  // One outcome per step, in the order of `exercise.steps`.
  steps: ExerciseOutcome[];
  writing: WritingResult;
};

type OpenEndedRunnerProps = {
  exercise: OpenEndedExercise;
  renderStep: StepRenderer;
  onDone: (result: OpenEndedResult) => void;
  concepts?: ReadonlyMap<string, Concept>;
  renderMascot?: (expression: MascotExpression) => ReactNode;
};

type Stage = "steps" | "writing" | "checklist" | "finished";

const NO_PARTS: FeedbackHighlights["parts"] = new Map();

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-3" data-step-dots>
      <span className="sr-only">{`Bước ${current + 1} trên ${total}`}</span>
      {Array.from({ length: total }, (_, index) => (
        <span
          // Dots only mark position.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={index}
          aria-hidden
          className={`size-3 rounded-full ${index <= current ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

// Runs an open-ended exercise: its auto-graded steps one after another, then
// the framed writing task and the rubric the child ticks themselves. Saving
// the result is left to the caller.
export function OpenEndedRunner({
  exercise,
  renderStep,
  onDone,
  concepts,
  renderMascot,
}: OpenEndedRunnerProps) {
  const [outcomes, setOutcomes] = useState<ExerciseOutcome[]>([]);
  const [stage, setStage] = useState<Stage>(
    exercise.steps.length === 0 ? "writing" : "steps",
  );
  const [text, setText] = useState(exercise.writing.starter);
  // Kept across "Sửa bài" so going back to edit does not clear the ticks.
  const [checks, setChecks] = useState<WritingCheck[]>(() =>
    exercise.writing.rubric.map((criterion) => ({ criterion, met: false })),
  );
  const step = exercise.steps[outcomes.length];

  const completeStep = (outcome: ExerciseOutcome) => {
    const next = [...outcomes, outcome];
    setOutcomes(next);
    if (next.length === exercise.steps.length) setStage("writing");
  };

  const submitWriting = () => {
    setText(text.trim());
    setStage("checklist");
  };

  const toggleCheck = (index: number) => {
    setChecks((previous) =>
      previous.map((check, i) =>
        i === index ? { ...check, met: !check.met } : check,
      ),
    );
  };

  const finish = () => {
    if (stage !== "checklist") return;
    setStage("finished");
    onDone({ steps: outcomes, writing: { text, checks } });
  };

  return (
    <div
      className="flex w-full flex-col gap-6"
      data-open-ended
      data-stage={stage}
    >
      <div className="flex flex-col gap-4">
        {exercise.prompt.map((block, index) => (
          <PromptBlock
            // Prompt blocks have no ids; their order is fixed content.
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={index}
            block={block}
            blockHighlight={undefined}
            parts={NO_PARTS}
          />
        ))}
      </div>

      {stage === "steps" && step && (
        <>
          <StepDots total={exercise.steps.length} current={outcomes.length} />
          <ExerciseFrame
            key={step.id}
            exercise={step}
            concepts={concepts}
            onDone={completeStep}
            renderMascot={renderMascot}
          >
            {(slot) => renderStep(step, slot)}
          </ExerciseFrame>
        </>
      )}

      {stage === "writing" && (
        <WritingStep
          starter={exercise.writing.starter}
          text={text}
          onChange={setText}
          onSubmit={submitWriting}
        />
      )}

      {(stage === "checklist" || stage === "finished") && (
        <RubricChecklist
          text={text}
          checks={checks}
          onToggle={toggleCheck}
          onEdit={() => setStage("writing")}
          onFinish={finish}
          finished={stage === "finished"}
        />
      )}
    </div>
  );
}
