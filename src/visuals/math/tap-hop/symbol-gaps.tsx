"use client";

import { Fragment, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { stateSet } from "@/visuals/shared/markers";
import { Glyph } from "./glyphs";

function gapKey(index: number): string {
  return `g${index}`;
}

// A row of numbers with a tappable gap between neighbours: tapping a gap puts
// a ";" in it, tapping again takes it out. Reports { g0, g1, … }, each 1 when
// its gap holds a ";".
export function SemicolonGaps({
  count,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { count: number }) {
  const gaps = count - 1;
  const [own, setOwn] = useState<VisualState>({});
  const shown = shownState !== undefined;
  const state = shownState ?? own;
  const locked = disabled || shown;

  function toggle(index: number) {
    const next: VisualState = Object.fromEntries(
      Array.from({ length: gaps }, (_, i) => [
        gapKey(i),
        i === index ? 1 - (state[gapKey(i)] ?? 0) : (state[gapKey(i)] ?? 0),
      ]),
    );
    setOwn(next);
    onStateChange?.(next);
  }

  return (
    <fieldset className="m-0 flex w-full min-w-0 items-center justify-center gap-1 border-0 p-0">
      <legend className="sr-only">{`Dãy ${count} số, giữa hai số cạnh nhau có một ô trống`}</legend>
      {Array.from({ length: count }, (_, i) => (
        <Fragment key={gapKey(i)}>
          <span
            className={`px-1 font-heading text-title font-bold tabular-nums md:text-title-lg ${CONCEPT_CLASSES.amber.text}`}
          >
            {i + 1}
          </span>
          {i < gaps ? (
            <GapButton
              between={[i + 1, i + 2]}
              filled={state[gapKey(i)] === 1}
              disabled={locked}
              marker={stateSet(gapKey(i), 1 - (state[gapKey(i)] ?? 0))}
              onToggle={() => toggle(i)}
            />
          ) : null}
        </Fragment>
      ))}
    </fieldset>
  );
}

function GapButton({
  between,
  filled,
  disabled,
  marker,
  onToggle,
}: {
  between: readonly [number, number];
  filled: boolean;
  disabled: boolean;
  marker: Record<string, string>;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={filled}
      aria-label={`Ô trống giữa ${between[0]} và ${between[1]}`}
      disabled={disabled}
      onClick={onToggle}
      className={`flex h-14 min-w-12 items-center justify-center rounded-lg border-2 px-1 motion-safe:transition-transform motion-safe:active:scale-97 ${filled ? "border-solid border-foreground bg-highlight" : "border-dashed border-muted-foreground bg-surface"}`}
      {...marker}
    >
      {filled ? <Glyph name="cham-phay" sizeClass="h-10" /> : null}
    </button>
  );
}
