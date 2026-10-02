"use client";

import { StepPlayer } from "@/visuals/shared/step-player";
import { Figure } from "./figure";
import type { FigureSpec } from "./figure-spec";

// A figure that plays frame by frame: each frame is a complete drawing with a
// short caption, so a later frame never moves what an earlier one showed.

// The picture is capped so it, its caption and the buttons fit one frame.
const FIGURE_MAX_HEIGHT = 280;

export type StepsSpec = {
  label: string;
  frames: readonly { figure: FigureSpec; caption: string }[];
};

export function FigureSteps({ spec }: { spec: StepsSpec }) {
  return (
    <StepPlayer steps={spec.frames.length} label={spec.label}>
      {(step) => {
        const frame = spec.frames[Math.min(step, spec.frames.length - 1)];
        if (!frame) return null;
        return (
          <div className="flex w-full flex-col items-center gap-2">
            <Figure spec={frame.figure} maxHeight={FIGURE_MAX_HEIGHT} />
            <p className="min-h-14 text-center font-heading text-block font-semibold">
              {frame.caption}
            </p>
          </div>
        );
      }}
    </StepPlayer>
  );
}
