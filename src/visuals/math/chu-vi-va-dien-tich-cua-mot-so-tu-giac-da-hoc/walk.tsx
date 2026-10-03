"use client";

import { RotateCcw, StepForward } from "lucide-react";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { VisualProps } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative } from "@/visuals/shared/markers";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import type { Pt } from "@/visuals/shared/plane/figure-spec";
import { glide, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./controls";
import { type WalkSpec, walkCorners, walkFigure, walkSum } from "./models";

// A walk once round a shape: "Đi tiếp" sends the marker along the next side,
// which shows its length; the sum of the sides walked so far is written
// under the picture. State { k }: the number of sides walked.

const MARKER_RADIUS = 10;

export function Walk({
  spec,
  onStateChange,
  shownState,
  disabled = false,
  params,
}: VisualProps & { spec: WalkSpec }) {
  const reducedMotion = usePrefersReducedMotion();
  const [own, setOwn] = useState(0);
  const sides = spec.sides.length;
  const k = shownState?.k ?? own;
  const locked = disabled || shownState !== undefined;
  const finished = k >= sides;

  function go(next: number) {
    setOwn(next);
    onStateChange?.({ k: next });
  }
  const { shown } = useGuidedGoal({
    met: finished,
    guided: isLessonScreen(params),
    reveal: () => go(sides),
  });

  const names = walkCorners(spec);
  const figure = walkFigure(spec, k);
  const marker = spec.figure.pts[names[k % sides] as string] as Pt;
  const sum = walkSum(spec, k);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md">
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing with a marker is a group of its parts */}
        <svg
          viewBox={`0 0 ${figure.w} ${figure.h}`}
          role="group"
          aria-label={figure.label}
          className="h-auto max-h-72 w-full"
        >
          <FigureLayers spec={figure} />
          <g
            {...decorative}
            style={{
              transform: `translate(${marker[0]}px, ${marker[1]}px)`,
              transition: glide(reducedMotion),
            }}
          >
            <circle
              r={MARKER_RADIUS}
              className="fill-concept-amber stroke-foreground"
              strokeWidth={2.5}
            />
          </g>
        </svg>
      </div>
      <p
        className="min-h-8 text-center font-heading text-block font-semibold"
        aria-live="polite"
      >
        {sum === "" ? "Bấm Đi tiếp để bắt đầu đi." : sum}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={locked || finished}
          onClick={() => go(k + 1)}
        >
          <StepForward aria-hidden className="size-5" />
          Đi tiếp
        </button>
        <button
          type="button"
          className={SECONDARY_BUTTON}
          disabled={locked || k === 0}
          onClick={() => go(0)}
        >
          <RotateCcw aria-hidden className="size-5" />
          Đi lại
        </button>
      </div>
      {finished && !shown && <DoneLine>{spec.closing}</DoneLine>}
      {finished && shown && <ShownLine>{spec.closing}</ShownLine>}
    </div>
  );
}
