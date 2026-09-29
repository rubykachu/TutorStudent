"use client";

import { Check, ChevronRight, RotateCcw } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BigButton } from "@/components/big-button";
import { BlockView } from "@/components/blocks/block-view";
import { BottomBar } from "@/components/bottom-bar";
import {
  type FeedbackHighlights,
  feedbackView,
  type HighlightSpec,
} from "@/exercises/feedback";
import type { InputFor } from "@/exercises/input";
import {
  type ExerciseOutcome,
  type MachineState,
  useExerciseMachine,
} from "@/exercises/machine";
import { attemptSeed } from "@/exercises/shuffle";
import { newId } from "@/lib/id";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { MascotExpression } from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";
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
  // Answer-area elements the last check found wrong; draw them with
  // `WRONG_TONE`, never with the highlight colour.
  wrong: ReadonlySet<string>;
  // A hint or solution visual is showing next to the answer. A bulky input
  // control (the number pad) may give up its place to it by wrapping itself
  // in `COLLAPSED_INPUT_CLASS`.
  feedbackVisual: boolean;
  // Show the correct answer in place (third wrong check, no solution visual).
  reveal: boolean;
  // Seed for `seededShuffle` of the answer items: the same for the whole
  // attempt, retype included, and new for every attempt.
  seed: string;
};

type ExerciseFrameProps<E extends BasicExercise> = {
  exercise: E;
  // Colours `hints.highlight` targets that name a concept.
  concepts?: ReadonlyMap<string, Concept>;
  onDone: (outcome: ExerciseOutcome) => void;
  // Draws the mascot at the answer card; the exercise-size owl unless replaced.
  renderMascot?: (expression: MascotExpression) => ReactNode;
  // Runs inside the tap that got the answer accepted, so a sound may start
  // there (iOS only lets audio start from a user gesture).
  onCorrect?: () => void;
  children: (slot: AnswerSlotProps<InputFor<E["type"]>>) => ReactNode;
};

// Two-column exercise layout on a wide landscape screen (iPad landscape):
// prompt and feedback visual on the left, answer on the right. Everywhere
// else the frame stacks prompt, answer and feedback visual in one column.
// Tailwind needs the variant spelled out in each class, so every class below
// written with `lg:landscape:` belongs to this one layout.

// Hides a collapsed input control where the frame stacks its parts, so the
// feedback visual takes its place without scrolling; the two-column layout
// has room for both and keeps it.
export const COLLAPSED_INPUT_CLASS = "hidden lg:landscape:block";

// A lesson visual loads on first use and grows after it mounts; the frame
// keeps it in view while it settles, then leaves scrolling to the child.
const FOLLOW_VISUAL_MS = 1500;

function renderExerciseOwl(expression: MascotExpression): ReactNode {
  return <Owl expression={expression} size="exercise" />;
}

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
// so that every attempt mounts a new frame: each mount starts from a fresh
// state and a fresh arrangement of the answer items.
export function ExerciseFrame<E extends BasicExercise>({
  exercise,
  concepts,
  onDone,
  renderMascot = renderExerciseOwl,
  onCorrect,
  children,
}: ExerciseFrameProps<E>) {
  const machine = useExerciseMachine(exercise);
  // Made on the client after mount, never during a server render, so the
  // server HTML and hydration agree. Kept here and not in the answer
  // component, which remounts for a retype of the same attempt. A layout
  // effect sets it before the first paint on the client, and only once, as
  // Strict Mode runs mount effects twice.
  const [nonce, setNonce] = useState<string | null>(null);
  useLayoutEffect(() => setNonce((kept) => kept ?? newId()), []);
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

  // What the child must see after a wrong check: the feedback visual, the
  // answer area while it shows the revealed answer, and the answer area again
  // once "Tự làm lại" gives the input back.
  const visualRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const visualKey = view.visualId && `${tier}:${view.visualId}`;
  const answerKey = view.reveal
    ? "reveal"
    : state.phase === "retype"
      ? "retype"
      : null;
  const inViewKey = visualKey ?? answerKey;
  useEffect(() => {
    if (inViewKey === null) return;
    const target =
      inViewKey === visualKey ? visualRef.current : answerRef.current;
    if (!target) return;
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    // `nearest` leaves an element already on screen alone; the document's
    // scroll-padding keeps it above the sticky bottom bar.
    const bringIntoView = () =>
      target.scrollIntoView?.({ block: "nearest", behavior });
    bringIntoView();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(bringIntoView);
    observer.observe(target);
    const stop = setTimeout(() => observer.disconnect(), FOLLOW_VISUAL_MS);
    return () => {
      observer.disconnect();
      clearTimeout(stop);
    };
  }, [inViewKey, visualKey, reducedMotion]);

  return (
    <section
      className="flex w-full flex-1 flex-col gap-6"
      data-phase={state.phase}
      data-tier={tier}
      data-mascot={view.mascot}
    >
      <div
        className="grid gap-6 lg:landscape:grid-cols-2 lg:landscape:grid-rows-[auto_1fr] lg:landscape:items-start lg:landscape:gap-x-8"
        data-exercise-layout
      >
        <div className="flex min-w-0 flex-col gap-4 lg:landscape:col-start-1 lg:landscape:row-start-1">
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

        {/* A phone, and the answer column of the two-column layout, are too
          narrow to give up a column to the mascot, so it perches on the
          top-right corner of the answer card there (the card's taller top
          padding keeps it off the answer); on a stacked tablet layout it
          stands beside the card. */}
        <div
          className="relative mt-4 flex min-w-0 items-start gap-4 md:mt-0 lg:landscape:col-start-2 lg:landscape:row-span-2 lg:landscape:row-start-1"
          data-answer-column
        >
          <div
            ref={answerRef}
            className={`relative min-w-0 flex-1 self-stretch rounded-xl px-4 pt-8 pb-4 md:p-6 lg:landscape:px-4 lg:landscape:pt-10 lg:landscape:pb-4 ${TONE_CLASSES[tone]} ${shaking ? "animate-shake" : ""}`}
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
                className="absolute top-1 left-3 size-7 text-correct md:top-3 md:right-3 md:left-auto md:size-8 lg:landscape:top-1 lg:landscape:right-auto lg:landscape:left-3"
                strokeWidth={3}
              />
            )}
            {/* A retype starts from a fresh answer component, not an edited one. */}
            <div key={state.phase === "retype" ? "retype" : "first"}>
              {nonce !== null &&
                children({
                  value: state.input,
                  onChange: machine.setInput,
                  disabled: accepted || state.phase === "wrong3",
                  highlight: answerHighlight,
                  wrong: view.wrong,
                  feedbackVisual: view.visualId !== undefined,
                  reveal: view.reveal,
                  seed: attemptSeed(exercise.id, nonce),
                })}
            </div>
          </div>
          {/* Decoration only: it never takes a tap meant for the answer. */}
          <div
            className="pointer-events-none absolute -top-8 right-3 md:static md:shrink-0 lg:landscape:absolute lg:landscape:-top-10 lg:landscape:right-3"
            data-mascot-slot
          >
            {renderMascot(view.mascot)}
          </div>
        </div>

        {view.visualId && (
          <div
            ref={visualRef}
            className="min-w-0 lg:landscape:col-start-1 lg:landscape:row-start-2"
            data-feedback-visual={view.visualId}
          >
            {/* Keyed by tier too, so a visual used for both hint and solution
              plays again from the start at the third wrong check. */}
            <RegistryVisual key={visualKey} id={view.visualId} />
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      {state.phase !== "done" && (
        <BottomBar>
          <FrameButton
            phase={state.phase}
            canCheck={machine.canCheck}
            onCheck={() => {
              if (machine.check()) onCorrect?.();
            }}
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
