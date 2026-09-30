"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { stateSet } from "@/visuals/shared/markers";
import { GLYPHS, TRACE_GLYPH, type TraceSymbol } from "./glyphs";
import { StrokeFigure } from "./stroke-figure";

// The child draws a mark by tapping its start dots in order: only the next dot
// answers, and tapping it draws that stroke. Reports { n } strokes drawn.
export function SymbolTrace({
  symbol,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { symbol: TraceSymbol }) {
  const total = GLYPHS[TRACE_GLYPH[symbol]].strokes.length;
  const [own, setOwn] = useState(0);
  const shown = shownState !== undefined;
  const n = Math.min(shownState?.n ?? own, total);
  const locked = disabled || shown;

  function setStrokes(next: number) {
    setOwn(next);
    onStateChange?.({ n: next });
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <StrokeFigure
        symbol={symbol}
        drawn={n}
        active={n < total ? n : null}
        showPending
        animate={!shown}
        onTap={locked || n >= total ? undefined : () => setStrokes(n + 1)}
        tapMarker={stateSet("n", n + 1)}
      />
      <button
        type="button"
        className={ACTION_BUTTON}
        disabled={locked || n === 0}
        onClick={() => setStrokes(0)}
        {...stateSet("n", 0)}
      >
        <RotateCcw aria-hidden className="size-5" />
        Vẽ lại
      </button>
    </div>
  );
}
