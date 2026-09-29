"use client";

import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { type ReactNode, useState } from "react";
import { BigButton } from "@/components/big-button";
import { BlockView } from "@/components/blocks/block-view";
import { BottomBar } from "@/components/bottom-bar";
import {
  type FeedbackHighlights,
  feedbackView,
  type HighlightSpec,
  type MascotExpression,
} from "@/exercises/feedback";
import type { InputFor } from "@/exercises/input";
import {
  type ExerciseOutcome,
  type MachineState,
  useExerciseMachine,
} from "@/exercises/machine";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { BasicExercise, Block, Concept } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";
import { Highlight } from "@/visuals/shared/highlight";

// Contract between the frame and the answer component of each exercise type.
export type AnswerSlotProps<I> = {
  // Controlled: the frame owns the input and clears it before a retype.
  value: I | null;
  // Report `null` (or an empty input) while nothing is entered.
  onChange: (input: I | null) => void;
  // True while the answer is being shown or after it is accepted.
  disabled: boolean;
  // Answer-area element id -> how to light it up; wrap it in `Highlight`.
  highlight: ReadonlyMap<string, HighlightSpec>;
  // Show the correct answer in place (third wrong check, no solution visual).
  reveal: boolean;
};

type ExerciseFrameProps<E extends BasicExercise> = {
  exercise: E;
  // Colours `hints.highlight` targets that name a concept.
  concepts?: ReadonlyMap<string, Concept>;
  onDone: (outcome: ExerciseOutcome) => void;
  renderMascot?: (expression: MascotExpression) => ReactNode;
  children: (slot: AnswerSlotProps<InputFor<E["type"]>>) => ReactNode;
};

type Tone = "idle" | "selected" | "retry" | "correct";

const TONE_CLASSES: Record<Tone, string> = {
  idle: "border-2 border-border bg-surface",
  selected: "border-3 border-primary bg-surface",
  retry: "border-3 border-retry bg-retry-soft",
  correct: "border-3 border-correct bg-correct-soft",
};

function toneOf(
  state: MachineState<unknown>,
  tier: number,
  filled: boolean,
): Tone {
  if (state.phase === "correct" || state.phase === "done") return "correct";
  if (tier > 0) return "retry";
  return filled ? "selected" : "idle";
}

function statusText(
  state: MachineState<unknown>,
  tier: number,
  reveal: boolean,
): string {
  if (state.phase === "correct" || state.phase === "done") return "Đúng rồi!";
  if (reveal) return "Đây là đáp án. Em tự làm lại nhé.";
  if (state.phase === "wrong3") return "Xem lời giải rồi tự làm lại nhé.";
  return tier > 0 ? "Thử lại nhé." : "";
}

// Shared frame for every basic exercise type: prompt, answer slot, the
// "Kiểm tra" button and the three feedback tiers with their fallbacks. Key it
// by exercise id so each exercise starts from a fresh state.
export function ExerciseFrame<E extends BasicExercise>({
  exercise,
  concepts,
  onDone,
  renderMascot,
  children,
}: ExerciseFrameProps<E>) {
  const machine = useExerciseMachine(exercise);
  const { state, tier } = machine;
  const view = feedbackView(exercise, state, concepts);
  const reducedMotion = usePrefersReducedMotion();
  // Wrong checks whose shake already finished; a newer wrong check shakes.
  const [shaken, setShaken] = useState(0);
  const shaking = !reducedMotion && tier > 0 && state.wrongCount > shaken;
  const accepted = state.phase === "correct" || state.phase === "done";
  const tone = toneOf(state, tier, machine.canCheck);
  const status = statusText(state, tier, view.reveal);

  return (
    <section
      className="flex w-full flex-1 flex-col gap-6"
      data-phase={state.phase}
      data-tier={tier}
      data-mascot={view.mascot}
    >
      <div className="flex flex-col gap-4">
        {exercise.prompt.map((block, index) => (
          <PromptBlock
            // Prompt blocks have no ids; their order is fixed content.
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={index}
            block={block}
            blockHighlight={view.highlights.blocks.get(index)}
            parts={view.highlights.parts}
          />
        ))}
      </div>

      <div className="flex items-start gap-4">
        <div
          className={`relative flex-1 rounded-xl p-4 md:p-6 ${TONE_CLASSES[tone]} ${shaking ? "animate-shake" : ""}`}
          data-answer-area
          data-tone={tone}
          data-shaking={shaking || undefined}
          onAnimationEnd={(event) => {
            // Animations inside the answer component bubble up here too.
            if (event.target === event.currentTarget)
              setShaken(state.wrongCount);
          }}
        >
          {accepted && (
            <Check
              aria-hidden
              className="absolute top-3 right-3 size-8 text-correct"
              strokeWidth={3}
            />
          )}
          {/* A retype starts from a fresh answer component, not an edited one. */}
          <div key={state.phase === "retype" ? "retype" : "first"}>
            {children({
              value: state.input,
              onChange: machine.setInput,
              disabled: accepted || state.phase === "wrong3",
              highlight: view.highlights.options,
              reveal: view.reveal,
            })}
          </div>
        </div>
        {renderMascot?.(view.mascot)}
      </div>

      {view.visualId && (
        <div data-feedback-visual={view.visualId}>
          <RegistryVisual key={view.visualId} id={view.visualId} />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      {state.phase !== "done" && (
        <BottomBar>
          <FrameButton
            phase={state.phase}
            canCheck={machine.canCheck}
            onCheck={machine.check}
            onRetype={machine.startRetype}
            onNext={() => onDone(machine.finish())}
          />
        </BottomBar>
      )}
    </section>
  );
}

type FrameButtonProps = {
  phase: MachineState<unknown>["phase"];
  canCheck: boolean;
  onCheck: () => void;
  onRetype: () => void;
  onNext: () => void;
};

function FrameButton({
  phase,
  canCheck,
  onCheck,
  onRetype,
  onNext,
}: FrameButtonProps) {
  if (phase === "correct") {
    return (
      <BigButton onClick={onNext}>
        Tiếp
        <ChevronRight aria-hidden className="size-6" />
      </BigButton>
    );
  }
  if (phase === "wrong3") {
    return (
      <BigButton onClick={onRetype}>
        <RotateCcw aria-hidden className="size-6" />
        Tự làm lại
      </BigButton>
    );
  }
  return (
    <BigButton disabled={!canCheck} onClick={onCheck}>
      Kiểm tra
    </BigButton>
  );
}

type PromptBlockProps = {
  block: Block;
  blockHighlight: HighlightSpec | undefined;
  parts: FeedbackHighlights["parts"];
};

// A prompt block inside the frame: the shared block renderer, lit up as a
// whole when a hint targets the block.
export function PromptBlock({
  block,
  blockHighlight,
  parts,
}: PromptBlockProps) {
  return (
    <Highlight
      active={blockHighlight !== undefined}
      color={blockHighlight?.color}
      strong={blockHighlight?.strong}
      className="w-full flex-col"
    >
      <BlockView block={block} parts={parts} />
    </Highlight>
  );
}
