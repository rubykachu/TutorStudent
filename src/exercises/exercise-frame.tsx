"use client";

import { Check, ChevronRight, Lightbulb, RotateCcw } from "lucide-react";
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
import { SpeechBubble } from "@/mascot/speech-bubble";
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
  // The child asked for the collapsed input control back while the feedback
  // visual is showing; `wantInput` asks for it. Where the frame stacks its
  // parts the visual then folds into `feedbackStrip`, which the answer
  // component draws right above its input control, so the hint stays one
  // tap away instead of being pushed off the screen.
  inputWanted: boolean;
  wantInput: () => void;
  feedbackStrip: ReactNode;
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
  // An exercise the child already finished, shown again when they go back:
  // the correct answer in place, locked, with no bottom bar and no praise.
  finished?: boolean;
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
  // Dashed so "try again" never rests on colour alone.
  retry: "border-3 border-dashed border-retry bg-retry-soft",
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

// What the live region announces: the owl's line when it speaks, so screen
// readers hear exactly what the bubble shows. The first tier has no bubble,
// but a screen reader still needs to hear that the answer was not right.
function statusText(speech: string | undefined, tier: number): string {
  return speech ?? (tier > 0 ? "Thử lại nhé." : "");
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
  finished = false,
  children,
}: ExerciseFrameProps<E>) {
  const machine = useExerciseMachine(exercise, finished);
  // Made on the client after mount, never during a server render, so the
  // server HTML and hydration agree. Kept here and not in the answer
  // component, which remounts for a retype of the same attempt. A layout
  // effect sets it before the first paint on the client, and only once, as
  // Strict Mode runs mount effects twice.
  const [nonce, setNonce] = useState<string | null>(null);
  useLayoutEffect(() => setNonce((kept) => kept ?? newId()), []);
  const { state, tier } = machine;
  const seed = nonce === null ? exercise.id : attemptSeed(exercise.id, nonce);
  const feedback = feedbackView(exercise, state, concepts, seed);
  const view = finished
    ? { ...feedback, reveal: true, speech: undefined }
    : feedback;
  const reducedMotion = usePrefersReducedMotion();
  // Wrong checks whose shake already finished; a newer wrong check shakes.
  const [shaken, setShaken] = useState(0);
  const shaking = !reducedMotion && tier > 0 && state.wrongCount > shaken;
  const accepted = state.phase === "correct" || state.phase === "done";
  const tone = toneOf(state, tier, machine.canCheck);
  const status = statusText(view.speech, tier);
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
  // The feedback visual for which the child asked the input control back;
  // a newer visual (the next tier) shows in full again.
  const [inputWantedFor, setInputWantedFor] = useState<string | null>(null);
  const inputWanted =
    visualKey !== undefined && inputWantedFor === visualKey && !accepted;
  const answerKey = view.reveal
    ? "reveal"
    : state.phase === "retype" || inputWanted
      ? "answer"
      : null;
  const inViewKey = inputWanted ? answerKey : (visualKey ?? answerKey);
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

  const feedbackStrip = inputWanted ? (
    // Stacked layouts only: the two-column layout keeps the visual in view.
    <button
      type="button"
      data-hint-strip
      onClick={() => setInputWantedFor(null)}
      className="flex min-h-touch w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-surface px-4 text-primary font-semibold motion-safe:transition-transform motion-safe:active:scale-97 lg:landscape:hidden"
    >
      <Lightbulb aria-hidden className="size-6" />
      {state.phase === "wrong3" ? "Xem lời giải" : "Xem gợi ý"}
    </button>
  ) : null;

  // A tall prompt (two lines of text above a formula) can push the bottom of
  // the answer area under the sticky bottom bar on a short screen, where the
  // child would have to discover that the page scrolls to reach the last row
  // of keys or options. Once the answer is on screen, the page scrolls just
  // enough to lift it above the bar, but never so far that the prompt's top
  // leaves the screen. A prompt visual that grows after it loads is followed
  // for a moment, like the feedback visual above, and so is the praise bubble
  // that appears above the answer once it is accepted and pushes it down.
  const frameRef = useRef<HTMLElement>(null);
  // Changes when the answer area first shows and again when it is accepted,
  // each time restarting the follow window.
  const liftKey = nonce === null ? null : accepted ? "accepted" : "answer";
  useEffect(() => {
    const frame = frameRef.current;
    const answer = answerRef.current;
    if (liftKey === null || !frame || !answer) return;
    const liftAnswer = () => {
      const bar = frame.querySelector("[data-bottom-bar]");
      const barTop = bar?.getBoundingClientRect().top ?? window.innerHeight;
      const hidden = answer.getBoundingClientRect().bottom - barTop;
      const room = frame.getBoundingClientRect().top;
      const lift = Math.min(hidden, room);
      if (lift > 0) window.scrollBy({ top: lift, behavior: "auto" });
    };
    liftAnswer();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(liftAnswer);
    observer.observe(frame);
    const stop = setTimeout(() => observer.disconnect(), FOLLOW_VISUAL_MS);
    return () => {
      observer.disconnect();
      clearTimeout(stop);
    };
  }, [liftKey]);

  return (
    <section
      ref={frameRef}
      className="flex w-full flex-1 flex-col gap-6"
      data-phase={state.phase}
      data-finished={finished || undefined}
      data-tier={tier}
      data-mascot={view.mascot}
    >
      <div
        className="grid gap-6 lg:landscape:grid-cols-[2fr_3fr] lg:landscape:grid-rows-[auto_1fr] lg:landscape:items-start lg:landscape:gap-x-8"
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

        {/* The mascot perches on the top-right corner of the answer card at
          every size, so the card keeps the full width for its answer (a
          long product or a sentence with blanks stays on one line); the
          card's taller top padding keeps it off the answer, and the margin
          above the column keeps it off the prompt. When the owl speaks, its
          bubble takes a row of its own above the card, to the left of the
          owl's head, so it never covers the answer or a control. */}
        <div
          className="relative mt-4 min-w-0 md:mt-6 lg:landscape:col-start-2 lg:landscape:row-span-2 lg:landscape:row-start-1 lg:landscape:mt-10"
          data-answer-column
        >
          {view.speech && (
            <div
              className="flex justify-end pr-19 pb-2 md:pr-24"
              data-mascot-speech-row
            >
              <SpeechBubble text={view.speech} />
            </div>
          )}
          <div className="relative">
            <div
              ref={answerRef}
              className={`relative min-w-0 rounded-xl px-4 pt-8 pb-4 md:px-6 md:pt-12 md:pb-6 lg:landscape:px-5 lg:landscape:pt-11 lg:landscape:pb-5 ${TONE_CLASSES[tone]} ${shaking ? "animate-shake" : ""}`}
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
                  className="absolute top-1 left-3 size-7 text-correct md:top-2 md:left-4 md:size-8"
                  strokeWidth={3}
                />
              )}
              {/* A retype starts from a fresh answer component, not an edited
                one. The key changes only when a retype starts, never when an
                answer is accepted: a remount then would redraw an interactive
                visual, which keeps its own state, back at its start. */}
              <div key={state.retypes}>
                {nonce !== null &&
                  children({
                    value: state.input,
                    onChange: machine.setInput,
                    disabled: accepted || state.phase === "wrong3",
                    highlight: answerHighlight,
                    wrong: view.wrong,
                    feedbackVisual: view.visualId !== undefined,
                    inputWanted,
                    wantInput: () => setInputWantedFor(visualKey ?? null),
                    feedbackStrip,
                    reveal: view.reveal,
                    seed,
                  })}
              </div>
            </div>
            {/* Decoration only: it never takes a tap meant for the answer. */}
            <div
              className="pointer-events-none absolute -top-8 right-3 md:-top-10 md:right-4"
              data-mascot-slot
            >
              {renderMascot(view.mascot)}
            </div>
          </div>
        </div>

        {view.visualId && (
          <div
            ref={visualRef}
            className={`min-w-0 lg:landscape:col-start-1 lg:landscape:row-start-2 ${inputWanted ? COLLAPSED_INPUT_CLASS : ""}`}
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
