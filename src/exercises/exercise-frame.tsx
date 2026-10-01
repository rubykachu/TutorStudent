"use client";

import {
  Check,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  SkipForward,
} from "lucide-react";
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
import { ConfettiBurst } from "@/components/confetti-burst";
import { resolveExplanation } from "@/exercises/explanation";
import { ExplanationPanel } from "@/exercises/explanation-panel";
import {
  type FeedbackHighlights,
  feedbackCue,
  feedbackView,
  type HighlightSpec,
} from "@/exercises/feedback";
import type { InputFor } from "@/exercises/input";
import {
  type ExerciseOutcome,
  type MachineState,
  skippedOutcome,
  useExerciseMachine,
} from "@/exercises/machine";
import { attemptSeed } from "@/exercises/shuffle";
import type { FeedbackSounds } from "@/lib/feedback-sounds";
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

export type { FeedbackSounds };

type ExerciseFrameProps<E extends BasicExercise> = {
  exercise: E;
  // Colours `hints.highlight` targets that name a concept.
  concepts?: ReadonlyMap<string, Concept>;
  onDone: (outcome: ExerciseOutcome) => void;
  // Draws the mascot at the answer card; the exercise-size owl unless replaced.
  renderMascot?: (expression: MascotExpression) => ReactNode;
  sounds?: FeedbackSounds;
  // Offers "Bỏ qua" until the answer is accepted: moves on with a skipped
  // outcome (see `skippedOutcome`), for a question that is too hard or that
  // the child does not want to do.
  skippable?: boolean;
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
//
// The two columns also need the frame itself to be wide enough: a 26rem
// prompt column, the gap and a 22rem answer column (container query on the
// frame, so a narrower frame, such as one inside a gallery, keeps one
// column). The prompt column is never narrower than 26rem, so a question
// reads in whole phrases rather than a word per line. A prompt that needs
// more room than that, a reading passage or a long question, keeps the
// one-column layout on landscape too, running the full width above the
// answer. Every class here carries the same variants: a column position
// without the column template would add an implicit column.
const TWO_COLUMNS = {
  grid: "lg:landscape:@min-[50rem]:grid-cols-[minmax(26rem,1fr)_minmax(0,1fr)] lg:landscape:@min-[50rem]:grid-rows-[auto_1fr] lg:landscape:@min-[50rem]:items-start lg:landscape:@min-[50rem]:gap-x-8",
  prompt:
    "lg:landscape:@min-[50rem]:col-start-1 lg:landscape:@min-[50rem]:row-start-1",
  answer:
    "lg:landscape:@min-[50rem]:col-start-2 lg:landscape:@min-[50rem]:row-span-2 lg:landscape:@min-[50rem]:row-start-1 lg:landscape:@min-[50rem]:mt-10",
  visual:
    "lg:landscape:@min-[50rem]:col-start-1 lg:landscape:@min-[50rem]:row-start-2",
} as const;
const ONE_COLUMN: Record<keyof typeof TWO_COLUMNS, string> = {
  grid: "",
  prompt: "",
  answer: "",
  visual: "",
};
// Question text longer than this (about five lines of the prompt column)
// takes the full width.
const LONG_PROMPT_CHARS = 200;

export function promptNeedsFullWidth(exercise: BasicExercise): boolean {
  const noteChars = exercise.prompt.reduce(
    (sum, block) => sum + (block.type === "note" ? block.text.length : 0),
    0,
  );
  return (
    exercise.prompt.some((block) => block.type === "passage") ||
    noteChars > LONG_PROMPT_CHARS
  );
}

// Hides a collapsed input control where the frame stacks its parts, so the
// feedback visual takes its place without scrolling; the two-column layout
// has room for both and keeps it.
export const COLLAPSED_INPUT_CLASS = "hidden lg:landscape:block";

// A lesson visual loads on first use and grows after it mounts; the frame
// keeps it in view while it settles, then leaves scrolling to the child.
const FOLLOW_VISUAL_MS = 1500;
// Space kept above the explanation panel when the page is lifted to show it.
const EXPLANATION_TOP_GAP_PX = 16;

function renderExerciseOwl(expression: MascotExpression): ReactNode {
  return <Owl expression={expression} size="exercise" />;
}

type Tone = "idle" | "selected" | "retry" | "correct";

const TONE_CLASSES: Record<Tone, string> = {
  // Every tone has the same border width, so content never shifts when the
  // card turns from idle to selected.
  idle: "border-3 border-border bg-surface",
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

// Shared frame for every basic exercise type: prompt, answer slot, the
// "Kiểm tra" button and the three feedback tiers with their fallbacks. Key it
// so that every attempt mounts a new frame: each mount starts from a fresh
// state and a fresh arrangement of the answer items.
export function ExerciseFrame<E extends BasicExercise>({
  exercise,
  concepts,
  onDone,
  renderMascot = renderExerciseOwl,
  sounds,
  skippable = false,
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
  // The child chose "Bỏ qua": the answer is shown like after a third wrong
  // check, with the explanation, and "Tiếp" moves on with a skipped outcome.
  const [skipped, setSkipped] = useState(false);
  const { state } = machine;
  const tier = skipped ? 3 : machine.tier;
  // A replay is a new attempt: new arrangement, new praise.
  const seed =
    nonce === null
      ? exercise.id
      : attemptSeed(
          exercise.id,
          state.replays === 0 ? nonce : `${nonce}.${state.replays}`,
        );
  const feedback = feedbackView(
    exercise,
    skipped ? { ...state, phase: "wrong3" } : state,
    concepts,
    seed,
  );
  // After "Bỏ qua" the owl stays silent: its lines for a wrong check ("bạn tự
  // làm lại nhé") would not fit a child who chose to move on.
  const view = finished
    ? { ...feedback, reveal: true, speech: undefined }
    : skipped
      ? { ...feedback, speech: undefined }
      : feedback;
  const reducedMotion = usePrefersReducedMotion();
  // Wrong checks whose shake already finished; a newer wrong check shakes.
  const [shaken, setShaken] = useState(0);
  // A confetti burst over the answer card once it is accepted, unless the
  // child prefers reduced motion (the owl's happy pose still shows).
  const [celebrating, setCelebrating] = useState(false);
  const shaking =
    !reducedMotion && !skipped && tier > 0 && state.wrongCount > shaken;
  const accepted = state.phase === "correct" || state.phase === "done";
  // The answer is on screen and the child has nothing left to enter.
  const answered = accepted || state.phase === "wrong3" || skipped;
  const explanation = answered ? resolveExplanation(exercise) : null;
  const explanationRef = useRef<HTMLDivElement>(null);
  const tone = toneOf(state, tier, machine.canCheck);
  // What the live region announces: the owl's line, so screen readers hear
  // exactly what the bubble shows.
  const status = view.speech?.text ?? "";
  // A tapText answer area renders the prompt's passages as tappable
  // sentences, so the prompt leaves them out and hints on sentences (`part`
  // targets) are handed to the answer area with its own elements.
  const passageInAnswer = exercise.type === "tapText";
  const columns = promptNeedsFullWidth(exercise) ? ONE_COLUMN : TWO_COLUMNS;
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

  // A tall prompt (a question and a passage) can push the answer area under
  // the sticky bottom bar on a phone, or on a landscape tablet where a
  // passage runs the full width above the answer, leaving options the child
  // must tap half hidden behind it. Once
  // the answer is on screen, the page scrolls just enough to lift the whole
  // answer area, every option included, above the bar. The answer card
  // comes first: the prompt's top may leave the screen (the child scrolls
  // back to reread it), but the card's own top, with the owl and its
  // bubble, never does, so a card taller than the screen shows from its
  // start. A prompt visual that grows after it loads is followed for a
  // moment, like the feedback visual above, and so is the owl's bubble
  // that appears above the answer after each check and pushes it down.
  const frameRef = useRef<HTMLElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  // Changes when the answer area first shows, after each wrong check and
  // when it is accepted, each time restarting the follow window.
  const liftKey =
    nonce === null ? null : accepted ? "accepted" : `answer-${tier}`;
  useEffect(() => {
    const frame = frameRef.current;
    const column = columnRef.current;
    const answer = answerRef.current;
    if (liftKey === null || !frame || !column || !answer) return;
    const liftAnswer = () => {
      const bar = frame.querySelector("[data-bottom-bar]");
      const barTop = bar?.getBoundingClientRect().top ?? window.innerHeight;
      const hidden = answer.getBoundingClientRect().bottom - barTop;
      // The owl perches above the card and may reach higher than the column.
      const owl = column.querySelector("[data-mascot-slot]");
      const room = Math.min(
        column.getBoundingClientRect().top,
        owl?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
      );
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

  // The explanation is read before "Tiếp", and its visual (steps, buttons)
  // loads and grows after it appears. Lift the page so the whole panel sits
  // above the bar, but never so far that the panel's top leaves the screen
  // (a panel taller than the screen shows from its start). Followed while the
  // visual settles, like the lift of the answer card above; `scrollBy` with
  // `auto` so a smooth scroll in progress is not cut short.
  const showsExplanation = explanation !== null;
  useEffect(() => {
    const frame = frameRef.current;
    const panel = explanationRef.current;
    if (!showsExplanation || !frame || !panel) return;
    const liftExplanation = () => {
      const bar = frame.querySelector("[data-bottom-bar]");
      const barTop = bar?.getBoundingClientRect().top ?? window.innerHeight;
      const box = panel.getBoundingClientRect();
      const lift = Math.min(
        box.bottom - barTop,
        box.top - EXPLANATION_TOP_GAP_PX,
      );
      if (lift > 0) window.scrollBy({ top: lift, behavior: "auto" });
    };
    liftExplanation();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(liftExplanation);
    observer.observe(panel);
    const stop = setTimeout(() => observer.disconnect(), FOLLOW_VISUAL_MS);
    return () => {
      observer.disconnect();
      clearTimeout(stop);
    };
  }, [showsExplanation]);

  return (
    <section
      ref={frameRef}
      className="@container flex w-full flex-1 flex-col gap-6"
      data-phase={state.phase}
      data-finished={finished || undefined}
      data-tier={tier}
      data-mascot={view.mascot}
    >
      <div
        className={`grid gap-6 ${columns.grid}`}
        data-exercise-layout={columns === TWO_COLUMNS ? "columns" : "stacked"}
      >
        <div className={`flex min-w-0 flex-col gap-4 ${columns.prompt}`}>
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
          ref={columnRef}
          className={`relative mt-4 min-w-0 md:mt-6 ${columns.answer}`}
          data-answer-column
        >
          {view.speech && (
            <div
              className="flex justify-end pr-19 pb-2 md:pr-24"
              data-mascot-speech-row
            >
              <SpeechBubble text={view.speech.text} />
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
              {celebrating && !reducedMotion && <ConfettiBurst />}
              {accepted && (
                <Check
                  aria-hidden
                  className="absolute top-1 left-3 size-7 text-correct md:top-2 md:left-4 md:size-8"
                  strokeWidth={3}
                />
              )}
              {/* A retype or a replay starts from a fresh answer component,
                not an edited one. The key changes only then, never when an
                answer is accepted: a remount then would redraw an interactive
                visual, which keeps its own state, back at its start. */}
              <div
                key={`${state.replays}:${state.retypes}`}
                // Options and chips click with the choice sound; see
                // ButtonSounds.
                data-own-sound
              >
                {nonce !== null &&
                  children({
                    value: state.input,
                    onChange: machine.setInput,
                    disabled: accepted || state.phase === "wrong3" || skipped,
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
            className={`min-w-0 ${columns.visual} ${inputWanted ? COLLAPSED_INPUT_CLASS : ""}`}
            data-feedback-visual={view.visualId}
          >
            {/* Keyed by tier too, so a visual used for both hint and solution
              plays again from the start at the third wrong check. */}
            <RegistryVisual key={visualKey} id={view.visualId} />
          </div>
        )}
      </div>

      {explanation && (
        <div ref={explanationRef} data-explanation-slot>
          <ExplanationPanel
            explanation={explanation}
            shownVisualId={view.visualId}
          />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      {(state.phase !== "done" || skipped) && (
        <BottomBar>
          <FrameButton
            phase={state.phase}
            skipped={skipped}
            canCheck={machine.canCheck}
            onCheck={() => {
              const next = machine.check();
              if (!next) return;
              if (next.phase === "correct") setCelebrating(true);
              sounds?.play(feedbackCue(exercise, next, seed));
            }}
            onRetype={machine.startRetype}
            onReplay={() => {
              machine.replay();
              setCelebrating(false);
              setShaken(0);
              setInputWantedFor(null);
            }}
            onNext={() =>
              onDone(
                skipped ? skippedOutcome(state.wrongCount) : machine.finish(),
              )
            }
            onSkip={skippable ? () => setSkipped(true) : undefined}
          />
        </BottomBar>
      )}
    </section>
  );
}

type FrameButtonProps = {
  phase: MachineState<unknown>["phase"];
  // The answer was shown after "Bỏ qua": only "Tiếp" is left.
  skipped: boolean;
  canCheck: boolean;
  onCheck: () => void;
  onRetype: () => void;
  onReplay: () => void;
  onNext: () => void;
  onSkip: (() => void) | undefined;
};

function FrameButton({
  phase,
  skipped,
  canCheck,
  onCheck,
  onRetype,
  onReplay,
  onNext,
  onSkip,
}: FrameButtonProps) {
  if (skipped) {
    return (
      <BigButton onClick={onNext}>
        Tiếp
        <ChevronRight aria-hidden className="size-6" />
      </BigButton>
    );
  }
  if (phase === "correct") {
    // Practice, not a test: the child may play an accepted exercise again,
    // unrated, before moving on.
    return (
      <div className="grid grid-cols-2 gap-3">
        <BigButton variant="secondary" onClick={onReplay} data-replay>
          <RotateCcw aria-hidden className="size-6" />
          Làm lại
        </BigButton>
        <BigButton onClick={onNext}>
          Tiếp
          <ChevronRight aria-hidden className="size-6" />
        </BigButton>
      </div>
    );
  }
  const main =
    phase === "wrong3" ? (
      <BigButton onClick={onRetype}>
        <RotateCcw aria-hidden className="size-6" />
        Tự làm lại
      </BigButton>
    ) : (
      <BigButton disabled={!canCheck} onClick={onCheck}>
        Kiểm tra
      </BigButton>
    );
  if (!onSkip) return main;
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <BigButton
        variant="secondary"
        onClick={onSkip}
        data-skip
        className="px-5 text-muted-foreground"
      >
        <SkipForward aria-hidden className="size-6" />
        Bỏ qua
      </BigButton>
      {main}
    </div>
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
