"use client";

import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { VISUAL_STEP_MS } from "@/lib/config";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  STEP_ATTR,
  STEP_COUNT_ATTR,
  STEP_NEXT_ATTR,
  STEP_PLAYER_ATTR,
} from "@/visuals/shared/markers";

type StepPlayerProps = {
  // Number of discrete steps; the visual renders step 0 … steps - 1.
  steps: number;
  // Spoken name of the animation as a whole.
  label: string;
  children: (step: number) => ReactNode;
  stepMs?: number;
};

const BUTTON =
  "inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg px-4 font-semibold motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-50";
const PRIMARY_BUTTON = `${BUTTON} bg-primary text-primary-foreground`;
const SECONDARY_BUTTON = `${BUTTON} border-2 border-border bg-surface text-foreground`;
// Outlined rather than filled, so stepping through a visual never looks like
// the bottom bar's filled "Tiếp" button.
const STEP_BUTTON = `${BUTTON} border-2 border-primary bg-surface text-primary`;

// Drives an explainer visual through its steps. It plays on its own, and the
// child can pause or replay it; with reduced motion it never moves by itself
// and advances only when the child taps "Bước tiếp", named and drawn apart
// from the bottom bar's "Tiếp" that leaves the screen. Once the last step is
// on screen only "Xem lại" is left: a "Phát" there would read as if there
// were more to play.
export function StepPlayer({
  steps,
  label,
  children,
  stepMs = VISUAL_STEP_MS,
}: StepPlayerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const last = steps - 1;
  const atEnd = step >= last;

  useEffect(() => {
    if (reducedMotion || !playing || step >= last) return;
    const timer = setTimeout(() => setStep(step + 1), stepMs);
    return () => clearTimeout(timer);
  }, [reducedMotion, playing, step, last, stepMs]);

  function replay() {
    setStep(0);
    setPlaying(true);
  }

  return (
    <figure
      aria-label={label}
      className="flex w-full flex-col items-center gap-4"
      {...{
        [STEP_PLAYER_ATTR]: "",
        [STEP_ATTR]: step,
        [STEP_COUNT_ATTR]: steps,
      }}
    >
      <div className="flex w-full justify-center">{children(step)}</div>
      <p className="sr-only" aria-live="polite">
        {`Bước ${step + 1} trên ${steps}`}
      </p>
      <div className="flex gap-3">
        {atEnd ? null : reducedMotion ? (
          <button
            type="button"
            className={STEP_BUTTON}
            aria-label="Bước tiếp"
            onClick={() => setStep((s) => Math.min(s + 1, last))}
            {...{ [STEP_NEXT_ATTR]: "" }}
          >
            <StepForward aria-hidden className="size-5" />
            Bước tiếp
          </button>
        ) : (
          <button
            type="button"
            className={PRIMARY_BUTTON}
            aria-label={playing ? "Tạm dừng" : "Phát"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <Pause aria-hidden className="size-5" />
            ) : (
              <Play aria-hidden className="size-5" />
            )}
            {playing ? "Tạm dừng" : "Phát"}
          </button>
        )}
        <button
          type="button"
          className={SECONDARY_BUTTON}
          aria-label="Xem lại từ đầu"
          disabled={step === 0}
          onClick={replay}
        >
          <RotateCcw aria-hidden className="size-5" />
          Xem lại
        </button>
      </div>
    </figure>
  );
}
