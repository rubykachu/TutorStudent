"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { stateSet } from "@/visuals/shared/markers";

const CARD =
  "inline-flex min-h-touch items-center justify-center rounded-xl border-2 px-4 text-body font-semibold disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-97";

// Candidates as cards under a dashed teal box: tapping a card puts the item in
// the box, tapping an item in the box takes it out. State is one key per
// candidate, { i0, i1, … }, with 1 = inside the box.
export function PickItems({
  items,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { items: readonly string[] }) {
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const inside = (i: number) => (state[`i${i}`] ?? 0) === 1;

  function set(index: number, value: number) {
    const next: VisualState = Object.fromEntries(
      items.map((_, i) => [`i${i}`, i === index ? value : (own[`i${i}`] ?? 0)]),
    );
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <fieldset className="min-h-24 min-w-0 rounded-2xl border-2 border-muted-foreground border-dashed bg-muted p-3">
        <legend className="sr-only">Hộp bút</legend>
        <p className="mb-2 font-heading text-block font-bold">hộp bút</p>
        <div className="flex flex-wrap gap-2">
          {items.map(
            (item, i) =>
              inside(i) && (
                <button
                  key={item}
                  type="button"
                  className={`${CARD} border-concept-amber bg-surface text-concept-amber`}
                  aria-label={`Lấy ${item} ra khỏi hộp`}
                  disabled={locked}
                  onClick={() => set(i, 0)}
                  {...stateSet(`i${i}`, 0)}
                >
                  {item}
                </button>
              ),
          )}
        </div>
      </fieldset>
      <div className="flex min-h-touch flex-wrap gap-2">
        {items.map(
          (item, i) =>
            !inside(i) && (
              <button
                key={item}
                type="button"
                className={`${CARD} border-muted-foreground bg-surface text-foreground`}
                aria-label={`Bỏ ${item} vào hộp`}
                disabled={locked}
                onClick={() => set(i, 1)}
                {...stateSet(`i${i}`, 1)}
              >
                {item}
              </button>
            ),
        )}
      </div>
    </div>
  );
}
