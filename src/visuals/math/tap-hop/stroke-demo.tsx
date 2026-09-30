"use client";

import { StepPlayer } from "@/visuals/shared/step-player";
import { GLYPHS, TRACE_GLYPH, type TraceSymbol } from "./glyphs";
import { StrokeFigure } from "./stroke-figure";

// Explainer: a mark written one stroke per step, each new stroke drawn along
// its path from a numbered start dot, earlier strokes staying on the paper and
// later ones shown as a dotted guide.
export function StrokeDemo({ symbol }: { symbol: TraceSymbol }) {
  const glyph = GLYPHS[TRACE_GLYPH[symbol]];
  return (
    <StepPlayer
      steps={glyph.strokes.length}
      label={`${glyph.label}: vẽ từng nét`}
    >
      {(step) => (
        <div className="flex flex-col items-center gap-2">
          <StrokeFigure
            symbol={symbol}
            drawn={step + 1}
            active={step}
            showPending={false}
            animate
          />
          <p className="font-heading text-block font-bold md:text-block-lg">
            {`Nét ${step + 1}`}
          </p>
        </div>
      )}
    </StepPlayer>
  );
}
