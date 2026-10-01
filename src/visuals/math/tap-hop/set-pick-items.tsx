"use client";

import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  ShownLine,
  useGuidedPick,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";

const CARD =
  "inline-flex min-h-touch items-center justify-center rounded-xl border-2 px-4 text-body font-semibold disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-97";

const TONE = {
  inside: "border-concept-amber bg-surface text-concept-amber",
  outside: "border-muted-foreground bg-surface text-foreground",
  // A pick the last answer found wrong: dashed and orange; the child takes it
  // out again.
  wrong: "border-dashed border-retry bg-retry-soft text-retry-soft-foreground",
  right: "border-correct bg-correct text-primary-foreground",
} as const;

// Candidates as cards under a dashed teal box: tapping a card puts the item in
// the box, tapping an item in the box takes it out. State is one key per
// candidate, { i0, i1, … }, with 1 = inside the box.
//
// In an exercise (no `wants`) the validator decides and nothing is revealed.
// On a lesson screen (`wants`: the items that belong in the box) it is a
// guided step, judged the way `Chips` are: at most `wants.length` items fit
// in the box, the pick is judged as soon as the box holds that many, right
// turns the items green and shows `done`, wrong marks the items that do not
// belong and lets the child try again, and "Xem cách làm" shows the items.
export function PickItems({
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
  const { shown, verdict, accepted, chosen, wrongPicks, toggle } =
    useGuidedPick({ size: items.length, wants });
  const state: VisualState =
    shownState ??
    Object.fromEntries(
      items.map((_, i) => [`i${i}`, chosen.includes(i) ? 1 : 0]),
    );
  const locked = disabled || shownState !== undefined || accepted;
  const inside = (i: number) => (state[`i${i}`] ?? 0) === 1;
  const count = items.filter((_, i) => inside(i)).length;

  function set(index: number) {
    const next = toggle(index);
    onStateChange?.(
      Object.fromEntries(
        items.map((_, i) => [`i${i}`, next.includes(i) ? 1 : 0]),
      ),
    );
  }

  const insideTone = (i: number) =>
    accepted ? TONE.right : wrongPicks.includes(i) ? TONE.wrong : TONE.inside;

  return (
    <div
      className="flex w-full max-w-md flex-col gap-4"
      data-pick-verdict={wants ? (shown ? "shown" : verdict) : undefined}
    >
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
                  className={`${CARD} ${insideTone(i)}`}
                  aria-label={`Lấy ${item} ra khỏi hộp`}
                  disabled={locked}
                  data-wrong={wrongPicks.includes(i) || undefined}
                  onClick={() => set(i)}
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
                className={`${CARD} ${TONE.outside}`}
                aria-label={`Bỏ ${item} vào hộp`}
                disabled={locked}
                onClick={() => set(i)}
                {...stateSet(`i${i}`, 1)}
              >
                {item}
              </button>
            ),
        )}
      </div>
      {wants && (
        <p
          className={`text-center text-caption ${verdict === "wrong" ? "font-semibold text-retry-soft-foreground" : "text-muted-foreground"}`}
          aria-live="polite"
        >
          {verdict === "wrong"
            ? "Chưa đúng. Lấy món chưa phải ra khỏi hộp rồi thử lại nhé."
            : `Đã bỏ vào hộp ${count}/${wants.length}`}
        </p>
      )}
      {verdict === "right" && done && (
        <DoneLine data-pick-done>{done}</DoneLine>
      )}
      {shown && (
        <ShownLine data-pick-shown>Các món trong hộp là đáp án.</ShownLine>
      )}
    </div>
  );
}
