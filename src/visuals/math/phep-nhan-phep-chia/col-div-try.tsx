"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { WRONG_ID } from "@/lib/sound-manifest";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import {
  DoneLine,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { DivisionEquation, Sentence } from "./chia-parts";
import { DivisionFigure } from "./division-figure";
import {
  buildFigure,
  type Division,
  type DivisionStep,
  digitsOf,
  divide,
  type Progress,
  progressEnd,
} from "./long-division";

// What the child works out for each quotient digit, in order.
const ASKED_PHASES = 3;
const DIGIT_KEYS = Array.from({ length: 10 }, (_, digit) => digit);
const SHAKE = { x: [0, -6, 6, -6, 6, 0] };
const SHAKE_TRANSITION = { duration: 0.3, ease: "easeInOut" } as const;

type Position = {
  step: number;
  // Phases of `step` finished: 0 divide, 1 multiply, 2 subtract.
  phase: number;
  // Digits of the current answer already typed.
  typed: number;
};

const START: Position = { step: 0, phase: 0, typed: 0 };

function expectedDigits(step: DivisionStep, phase: number): number[] {
  if (phase === 0) return digitsOf(step.quotientDigit);
  return digitsOf(phase === 1 ? step.product : step.remainder);
}

function prompt(division: Division, step: DivisionStep, phase: number) {
  const d = division.divisor;
  if (phase === 0) {
    return `Chia ${step.partial} cho ${d}. Chữ số của thương là mấy?`;
  }
  if (phase === 1) {
    return `Nhân ${step.quotientDigit} với ${d}. Tích là bao nhiêu?`;
  }
  return `Lấy ${step.partial} trừ ${step.product}. Hiệu là bao nhiêu?`;
}

function tip(division: Division, step: DivisionStep, phase: number) {
  const d = division.divisor;
  if (phase === 0) {
    return `Chưa đúng. Thử nhân số chia ${d} với từng chữ số, chọn tích lớn nhất không vượt quá ${step.partial}.`;
  }
  if (phase === 1) {
    return `Chưa đúng. Thử nhân số chia ${d} với chữ số ${step.quotientDigit} vừa tìm.`;
  }
  return `Chưa đúng. Thử lấy ${step.partial} trừ ${step.product}.`;
}

function slotKey(step: number, phase: number, typed: number): string {
  if (phase === 0) return `q${step}`;
  return `${phase === 1 ? "p" : "r"}${step}.${typed}`;
}

// Guided practice: for every quotient digit the child taps the digits of the
// quotient digit, then of the product, then of the difference. A right digit
// locks in; a wrong one rings the empty slot in orange, shakes it gently and
// gives a tip.
export default function ColDivTry({
  dividend,
  divisor,
  onStateChange,
}: { dividend: number; divisor: number } & Pick<VisualProps, "onStateChange">) {
  const division = useMemo(
    () => divide(dividend, divisor),
    [dividend, divisor],
  );
  const reducedMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState<Position>(START);
  const [wrong, setWrong] = useState(0);

  const m = division.steps.length;
  const total = ASKED_PHASES * m;
  const finished = position.step >= m;
  const done = position.step * ASKED_PHASES + position.phase;
  const current = division.steps[position.step];
  const sounds = useFeedbackSoundsContext();
  // "Tiếp" waits until every quotient digit is worked out, or "Xem cách làm"
  // works them all out.
  const { shown } = useGuidedGoal({
    met: finished,
    guided: true,
    reveal: () => {
      setPosition({ step: m, phase: 0, typed: 0 });
      setWrong(0);
      onStateChange?.({ done: total });
    },
  });

  function press(digit: number) {
    if (finished || !current) return;
    const expected = expectedDigits(current, position.phase);
    if (digit !== expected[position.typed]) {
      setWrong((n) => n + 1);
      sounds?.play([WRONG_ID]);
      return;
    }
    setWrong(0);
    const typed = position.typed + 1;
    if (typed < expected.length) {
      setPosition({ ...position, typed });
      return;
    }
    const next: Position =
      position.phase + 1 < ASKED_PHASES
        ? { step: position.step, phase: position.phase + 1, typed: 0 }
        : { step: position.step + 1, phase: 0, typed: 0 };
    setPosition(next);
    onStateChange?.({ done: next.step * ASKED_PHASES + next.phase });
  }

  function restart() {
    setPosition(START);
    setWrong(0);
    onStateChange?.({ done: 0 });
  }

  const progress: Progress = finished
    ? progressEnd(division)
    : {
        step: position.step,
        done: position.phase,
        typing: { count: position.typed },
      };
  const figure = buildFigure(division, progress);
  const wrongKeys = new Set(
    wrong > 0 && !finished
      ? [slotKey(position.step, position.phase, position.typed)]
      : [],
  );
  const message = finished
    ? ""
    : current
      ? wrong > 0
        ? tip(division, current, position.phase)
        : prompt(division, current, position.phase)
      : "";

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <motion.div
        key={wrong}
        className="flex w-full justify-center"
        initial={{ x: 0 }}
        animate={wrong > 0 && !reducedMotion ? SHAKE : { x: 0 }}
        transition={SHAKE_TRANSITION}
      >
        <DivisionFigure
          figure={figure}
          label={`Đặt tính ${dividend} chia ${divisor}, đang làm`}
          zoom={1}
          wrongKeys={wrongKeys}
          finalRemainderStep={finished ? m - 1 : undefined}
        />
      </motion.div>
      {finished ? (
        shown ? (
          <ShownLine data-col-div-shown>Đã hết chữ số để hạ.</ShownLine>
        ) : (
          <DoneLine data-col-div-done>Xong rồi! Hết chữ số để hạ.</DoneLine>
        )
      ) : (
        <Sentence tone={wrong > 0 ? "retry" : "neutral"}>{message}</Sentence>
      )}
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-caption" aria-live="polite">
          Đã xong {done}/{total} bước
        </p>
        <button
          type="button"
          onClick={restart}
          disabled={done === 0}
          className={`${ACTION_BUTTON} px-3`}
        >
          <RotateCcw aria-hidden className="size-5" />
          Làm lại
        </button>
      </div>
      {finished ? (
        <DivisionEquation
          dividend={dividend}
          divisor={divisor}
          quotient={division.quotient}
          remainder={division.remainder}
          withRemainder={division.remainder > 0}
        />
      ) : (
        <fieldset className="grid grid-cols-5 gap-2 md:grid-cols-10">
          <legend className="sr-only">Chọn chữ số</legend>
          {DIGIT_KEYS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => press(digit)}
              className="inline-flex size-touch items-center justify-center rounded-lg border-2 border-border bg-surface font-heading text-body-lg font-bold motion-safe:transition-transform motion-safe:active:scale-97"
            >
              {digit}
            </button>
          ))}
        </fieldset>
      )}
    </div>
  );
}
