"use client";

import { Fragment, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";
import { Glyph } from "./glyphs";

function gapKey(index: number): string {
  return `g${index}`;
}

// A row of numbers with a tappable gap between neighbours: tapping a gap puts
// a ";" in it, tapping again takes it out. Reports { g0, g1, … }, each 1 when
// its gap holds a ";". On a lesson screen the goal is a ";" in every gap: once
// the last one is placed the row locks and says so, and "Tiếp" waits until
// then or "Xem cách làm", which places them all.
export function SemicolonGaps({
  count,
  first,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { count: number; first: number }) {
  const gaps = count - 1;
  const guided = isLessonScreen(params);
  const [own, setOwn] = useState<VisualState>({});
  const shown = shownState !== undefined;
  const state = shownState ?? own;
  const complete = Array.from(
    { length: gaps },
    (_, i) => state[gapKey(i)] === 1,
  ).every(Boolean);
  const { shown: revealed } = useGuidedGoal({
    met: complete,
    guided,
    reveal: () =>
      setOwn(
        Object.fromEntries(
          Array.from({ length: gaps }, (_, i) => [gapKey(i), 1]),
        ),
      ),
  });
  const locked = disabled || shown || (guided && complete);

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
    <div className="flex w-full flex-col items-center gap-3">
      <fieldset className="m-0 flex w-full min-w-0 items-center justify-center gap-0.5 border-0 p-0">
        <legend className="sr-only">{`Tập hợp ${count} số từ ${first}, giữa hai số cạnh nhau có một ô trống`}</legend>
        <Glyph name="ngoac-nhon-mo" sizeClass="h-14" />
        {Array.from({ length: count }, (_, i) => (
          <Fragment key={gapKey(i)}>
            <span
              className={`px-0.5 font-heading text-title font-bold tabular-nums md:text-title-lg ${CONCEPT_CLASSES.amber.text}`}
            >
              {first + i}
            </span>
            {i < gaps ? (
              <GapButton
                between={[first + i, first + i + 1]}
                filled={state[gapKey(i)] === 1}
                disabled={locked}
                marker={stateSet(gapKey(i), 1 - (state[gapKey(i)] ?? 0))}
                onToggle={() => toggle(i)}
              />
            ) : null}
          </Fragment>
        ))}
        <Glyph name="ngoac-nhon-dong" sizeClass="h-14" />
      </fieldset>
      {guided && complete && !revealed && (
        <DoneLine data-gaps-done>
          Đúng rồi! Giữa hai số cạnh nhau đều có dấu chấm phẩy.
        </DoneLine>
      )}
      {guided && revealed && (
        <ShownLine data-gaps-shown>
          Mỗi ô trống giữa hai số đều có dấu chấm phẩy.
        </ShownLine>
      )}
    </div>
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
