"use client";

import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Formula } from "@/components/blocks/formula";
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

const BUTTON =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-body text-primary-foreground disabled:opacity-50 motion-safe:transition-transform motion-safe:active:scale-97 md:min-h-16 md:text-body-lg";

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
  // A tapText answer area renders the prompt's passages as tappable
  // sentences, so the prompt leaves them out and hints on sentences (`part`
  // targets) are handed to the answer area with its own elements.
  const passageInAnswer = exercise.type === "tapText";
  const answerHighlight = passageInAnswer
    ? new Map([...view.highlights.parts, ...view.highlights.options])
    : view.highlights.options;

  return (
    <section
      className="flex w-full flex-col gap-6"
      data-phase={state.phase}
      data-tier={tier}
      data-mascot={view.mascot}
    >
      <div className="flex flex-col gap-4">
        {exercise.prompt.map((block, index) =>
          passageInAnswer && block.type === "passage" ? null : (
            <PromptBlock
              // Prompt blocks have no ids; their order is fixed content.
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={index}
              block={block}
              blockHighlight={view.highlights.blocks.get(index)}
              parts={view.highlights.parts}
            />
          ),
        )}
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
              highlight: answerHighlight,
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

      <FrameButton
        phase={state.phase}
        canCheck={machine.canCheck}
        onCheck={machine.check}
        onRetype={machine.startRetype}
        onNext={() => onDone(machine.finish())}
      />
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
  if (phase === "done") return null;
  if (phase === "correct") {
    return (
      <button type="button" className={BUTTON} onClick={onNext}>
        Tiếp
        <ChevronRight aria-hidden className="size-6" />
      </button>
    );
  }
  if (phase === "wrong3") {
    return (
      <button type="button" className={BUTTON} onClick={onRetype}>
        <RotateCcw aria-hidden className="size-6" />
        Tự làm lại
      </button>
    );
  }
  return (
    <button
      type="button"
      className={BUTTON}
      disabled={!canCheck}
      onClick={onCheck}
    >
      Kiểm tra
    </button>
  );
}

type PromptBlockProps = {
  block: Block;
  blockHighlight: HighlightSpec | undefined;
  parts: FeedbackHighlights["parts"];
};

// Minimal prompt rendering for exercises; lesson blocks get a full renderer
// of their own, which can replace this one.
function PromptBlock({ block, blockHighlight, parts }: PromptBlockProps) {
  return (
    <Highlight
      active={blockHighlight !== undefined}
      color={blockHighlight?.color}
      strong={blockHighlight?.strong}
      className="w-full flex-col"
    >
      <PromptContent block={block} parts={parts} />
    </Highlight>
  );
}

function PromptContent({
  block,
  parts,
}: {
  block: Block;
  parts: FeedbackHighlights["parts"];
}) {
  switch (block.type) {
    case "note":
      return <p>{block.text}</p>;
    case "formula":
      return (
        <Formula
          tex={block.tex}
          highlight={[...parts].map(([id, spec]) => ({
            id,
            strong: spec.strong,
          }))}
        />
      );
    case "visual":
      return (
        <figure className="flex w-full flex-col items-center gap-2">
          <RegistryVisual id={block.visualId} />
          {block.caption && (
            <figcaption className="text-caption text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "passage":
      return (
        <div className="flex flex-col gap-3 text-passage md:text-passage-lg">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.sentences[0]?.id}>
              {paragraph.sentences.map((sentence) => {
                const spec = parts.get(sentence.id);
                return (
                  <Highlight
                    key={sentence.id}
                    active={spec !== undefined}
                    color={spec?.color}
                    strong={spec?.strong}
                    className="mr-1"
                  >
                    {sentence.text}
                  </Highlight>
                );
              })}
            </p>
          ))}
          {block.source && (
            <p className="text-caption text-muted-foreground">{block.source}</p>
          )}
        </div>
      );
    case "image":
      return (
        // Content images come from the media bucket with unknown dimensions,
        // which next/image cannot lay out without extra config.
        // biome-ignore lint/performance/noImgElement: see above
        <img
          src={block.src}
          alt={block.alt}
          className="max-w-full rounded-lg"
        />
      );
    case "video":
      // Exercises are answered on the spot; video clips belong to the lesson
      // flow between blocks, so an exercise prompt does not play them.
      return null;
  }
}
