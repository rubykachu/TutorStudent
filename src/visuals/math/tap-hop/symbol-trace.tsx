"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";
import { GLYPHS, TRACE_GLYPH, type TraceSymbol } from "./glyphs";
import { StrokeFigure } from "./stroke-figure";

const MARKS: Readonly<Record<TraceSymbol, string>> = {
  "ngoac-mo": "{",
  "ngoac-dong": "}",
  "cham-phay": ";",
  thuoc: "∈",
  "khong-thuoc": "∉",
};

// The child draws a mark by tapping its start dots in order: only the next dot
// answers, and tapping it draws that stroke. Reports { n } strokes drawn. On a
// lesson screen "Tiếp" waits until every stroke is drawn, or "Xem cách làm"
// draws the rest.
export function SymbolTrace({
  symbol,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { symbol: TraceSymbol }) {
  const total = GLYPHS[TRACE_GLYPH[symbol]].strokes.length;
  const [own, setOwn] = useState(0);
  const shown = shownState !== undefined;
  const n = Math.min(shownState?.n ?? own, total);
  const locked = disabled || shown;
  const guided = isLessonScreen(params);
  const complete = n >= total;
  const { shown: revealed } = useGuidedGoal({
    met: complete,
    guided,
    reveal: () => setOwn(total),
  });

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
      {guided && complete && !revealed && (
        <DoneLine
          data-trace-done
        >{`Đúng rồi! Em đã vẽ xong kí hiệu ${MARKS[symbol]}.`}</DoneLine>
      )}
      {guided && revealed && (
        <ShownLine
          data-trace-shown
        >{`Kí hiệu ${MARKS[symbol]} đã vẽ đủ các nét.`}</ShownLine>
      )}
    </div>
  );
}
