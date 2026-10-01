"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { stateSet } from "@/visuals/shared/markers";

const CHIP =
  "inline-flex min-h-touch min-w-touch items-center justify-center gap-1 rounded-xl border-2 px-4 font-heading text-block font-bold disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-97";

// What a pick screen draws: the chips, which of them are right (indices) and
// the closing line.
export type ChipsSpec = {
  items: readonly string[];
  wants?: readonly number[];
  done?: string;
};

// Numbers (or short sums) the child taps to pick. State is one key per chip,
// { i0, i1, … }, with 1 = picked. With `wants` (the lesson screen) it shows
// progress and ends on `done` once exactly those chips are picked; in an
// exercise the validator decides and nothing is revealed.
export function Chips({
  items,
  wants,
  done,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & {
  items: readonly string[];
  wants?: readonly number[];
  done?: string;
}) {
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const picked = (i: number) => (state[`i${i}`] ?? 0) === 1;
  const count = items.filter((_, i) => picked(i)).length;
  const finished =
    wants !== undefined &&
    count === wants.length &&
    wants.every((i) => picked(i));

  function toggle(index: number) {
    const next: VisualState = Object.fromEntries(
      items.map((_, i) => [
        `i${i}`,
        i === index ? 1 - (own[`i${i}`] ?? 0) : (own[`i${i}`] ?? 0),
      ]),
    );
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, i) => {
          const on = picked(i);
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: chips never reorder
              key={i}
              type="button"
              className={`${CHIP} ${on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground bg-surface text-foreground"}`}
              aria-pressed={on}
              disabled={locked}
              onClick={() => toggle(i)}
              {...stateSet(`i${i}`, on ? 0 : 1)}
            >
              {on && <Check aria-hidden className="size-5" />}
              {item}
            </button>
          );
        })}
      </div>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {wants ? `Đã chọn ${count}/${wants.length}` : `Đã chọn ${count}`}
      </p>
      {finished && done && (
        <p className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          <Check aria-hidden className="size-5" />
          {done}
        </p>
      )}
    </div>
  );
}
