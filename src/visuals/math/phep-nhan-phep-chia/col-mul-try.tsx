"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { formatInteger } from "@/lib/number-format";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { planMultiplication, tryCells, tryShown } from "./col-mul-digits";
import { ColMulFigure, figureLabel } from "./col-mul-figure";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
// Rung sideways three times in 300ms, 6px each way (design system).
const SHAKE = { x: [0, -6, 6, -6, 6, -6, 0] };
const SHAKE_SECONDS = 0.3;

type Feedback = { tone: "right" | "wrong"; text: string; shakes: number };

const KEY =
  "inline-flex min-h-touch min-w-touch items-center justify-center rounded-lg border-2 border-border bg-surface font-heading text-block font-bold tabular-nums text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

// Hands-on column multiplication: the child fills every digit of the product,
// right to left, by pressing 0 to 9 for the glowing cell. A right digit stays
// on the paper together with the carry it makes; a wrong one rings the cell in
// the orange dashed "try again" ring, shakes the tip and changes nothing.
export function ColMulTry({
  a,
  b,
  onStateChange,
}: { a: number; b: number } & Pick<VisualProps, "onStateChange">) {
  const reducedMotion = usePrefersReducedMotion();
  const plan = planMultiplication(a, b);
  const cells = tryCells(plan);
  const [done, setDone] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | undefined>();

  const finished = done >= cells.length;
  const current = cells[done];

  function press(digit: number) {
    if (!current) return;
    if (digit !== current.digit) {
      setFeedback({
        tone: "wrong",
        text: current.tip,
        shakes: (feedback?.shakes ?? 0) + 1,
      });
      return;
    }
    setDone(done + 1);
    setFeedback({
      tone: "right",
      text: `Đúng rồi! ${current.after}`,
      shakes: feedback?.shakes ?? 0,
    });
    onStateChange?.({ done: done + 1 });
  }

  function restart() {
    setDone(0);
    setFeedback(undefined);
    onStateChange?.({ done: 0 });
  }

  const lit = new Set(current ? [current.id, ...current.inputs] : []);
  const wrong = feedback?.tone === "wrong" && current ? current.id : undefined;
  const ringed = new Set(wrong ? [wrong] : []);
  const shown = tryShown(cells, done);
  const closing = `Xong rồi! ${formatInteger(a)} · ${formatInteger(b)} = ${formatInteger(plan.product)}`;

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <ColMulFigure
        plan={plan}
        shown={shown}
        lit={wrong ? new Set() : lit}
        ringed={ringed}
        label={figureLabel(plan, finished)}
      />
      <p className="text-center text-body font-semibold" aria-live="polite">
        {finished ? closing : `Ô sáng: ${current?.prompt ?? ""}`}
      </p>
      <motion.p
        // A new key replays the shake for each wrong digit.
        key={feedback?.shakes ?? 0}
        initial={{ x: 0 }}
        animate={
          feedback?.tone === "wrong" && !reducedMotion ? SHAKE : { x: 0 }
        }
        transition={{ duration: SHAKE_SECONDS, ease: "easeInOut" }}
        className={`min-h-10 max-w-prose rounded-lg px-3 text-center text-body ${
          feedback?.tone === "wrong"
            ? "border-2 border-dashed border-retry bg-retry-soft text-retry-soft-foreground"
            : ""
        }`}
        aria-live="polite"
      >
        {feedback?.text}
      </motion.p>
      <fieldset className="grid w-full max-w-xl grid-cols-5 gap-2 md:grid-cols-10">
        <legend className="sr-only">Chữ số từ 0 đến 9</legend>
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            className={KEY}
            disabled={finished}
            aria-label={`Chữ số ${digit}`}
            onClick={() => press(digit)}
          >
            {digit}
          </button>
        ))}
      </fieldset>
      <div className="flex w-full max-w-xl items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {`Đã xong ${done}/${cells.length} ô`}
        </p>
        <button
          type="button"
          className={ACTION_BUTTON}
          disabled={done === 0}
          onClick={restart}
        >
          <RotateCcw aria-hidden className="size-5" />
          Làm lại
        </button>
      </div>
    </div>
  );
}
