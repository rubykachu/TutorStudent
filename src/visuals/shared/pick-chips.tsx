"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { JINGLE_ID, WRONG_ID } from "@/lib/sound-manifest";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { useGuidedTask } from "@/visuals/shared/guided-step";
import { stateSet } from "@/visuals/shared/markers";

const CHIP =
  "inline-flex min-h-touch min-w-touch items-center justify-center gap-1 rounded-xl border-2 px-4 font-heading text-block font-bold disabled:opacity-60 motion-safe:transition-transform motion-safe:active:scale-97";

// Groups of digits in a chip are joined by U+202F (the lesson-text rule), which
// the heading font draws almost as no gap, so "2 340" would read as "2340".
// Each separator becomes a gap as wide as KaTeX's thin space next to it; the
// character stays in the text, so the button's name is still the number.
const GROUP_SEPARATOR = "\u202f";

function SpacedNumber({ text }: { text: string }) {
  return text.split(GROUP_SEPARATOR).map((group, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: the groups of a number never reorder
    <span key={i}>
      {i > 0 && (
        <span className="inline-block w-[0.25em] whitespace-nowrap">
          {GROUP_SEPARATOR}
        </span>
      )}
      {group}
    </span>
  ));
}

// What a pick screen draws: the chips, which of them are right (indices) and
// the closing line.
export type ChipsSpec = {
  items: readonly string[];
  wants?: readonly number[];
  done?: string;
};

const CHIP_TONE = {
  off: "border-muted-foreground bg-surface text-foreground",
  on: "border-primary bg-primary text-primary-foreground",
  // A pick the last answer found wrong: dashed and orange, still ticked
  // because it is still chosen; the child taps it off.
  wrong: "border-dashed border-retry bg-retry-soft text-retry-soft-foreground",
  right: "border-correct bg-correct text-primary-foreground",
} as const;

type Verdict = "none" | "wrong" | "right";

// Numbers (or short sums) the child taps to pick. State is one key per chip,
// { i0, i1, … }, with 1 = picked.
//
// In an exercise (no `wants`) the validator decides and nothing is revealed.
// On a lesson screen (`wants`: the right chips) it is a guided step: at most
// `wants.length` chips are chosen (a new pick pushes out the oldest, so one
// wanted chip means a pick replaces the previous one); once that many are
// chosen the answer is judged at once. Right: the chips turn green, the
// jingle plays and `done` is shown, and the screen's "Tiếp" works. Wrong: the
// wrong picks are marked and the child tries again, with nothing revealed.
// "Xem cách làm" (in the player's bar) shows the chips to pick.
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
  const sounds = useFeedbackSoundsContext();
  // Chip indices in the order they were picked.
  const [picks, setPicks] = useState<readonly number[]>([]);
  const [shown, setShown] = useState(false);
  const limit = wants?.length;
  // Right once exactly the wanted chips are chosen, wrong when as many are
  // chosen but not those; nothing to say before that.
  function judge(next: readonly number[]): Verdict {
    if (!wants || next.length !== wants.length) return "none";
    return wants.every((i) => next.includes(i)) ? "right" : "wrong";
  }
  const verdict = shown ? "none" : judge(picks);
  const accepted = verdict === "right" || shown;

  const chosen = shown && wants ? wants : picks;
  const state: VisualState =
    shownState ??
    Object.fromEntries(
      items.map((_, i) => [`i${i}`, chosen.includes(i) ? 1 : 0]),
    );
  const locked = disabled || shownState !== undefined || accepted;
  const picked = (i: number) => (state[`i${i}`] ?? 0) === 1;
  const count = items.filter((_, i) => picked(i)).length;
  const wrongPicks =
    verdict === "wrong" ? picks.filter((i) => !wants?.includes(i)) : [];

  function toggle(index: number) {
    const next = picks.includes(index)
      ? picks.filter((i) => i !== index)
      : [...picks, index].slice(-(limit ?? items.length));
    setPicks(next);
    onStateChange?.(
      Object.fromEntries(
        items.map((_, i) => [`i${i}`, next.includes(i) ? 1 : 0]),
      ),
    );
    const result = judge(next);
    if (result === "right") sounds?.play([JINGLE_ID]);
    if (result === "wrong") sounds?.play([WRONG_ID]);
  }

  function show() {
    setShown(true);
    setPicks(wants ?? []);
  }
  useGuidedTask(wants === undefined || accepted, show);

  const tone = (i: number) =>
    (shown || verdict === "right") && picked(i)
      ? CHIP_TONE.right
      : wrongPicks.includes(i)
        ? CHIP_TONE.wrong
        : picked(i)
          ? CHIP_TONE.on
          : CHIP_TONE.off;

  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4"
      data-chips-verdict={shown ? "shown" : verdict}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, i) => {
          const on = picked(i);
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: chips never reorder
              key={i}
              type="button"
              className={`${CHIP} ${tone(i)}`}
              aria-pressed={on}
              disabled={locked}
              data-wrong={wrongPicks.includes(i) || undefined}
              onClick={() => toggle(i)}
              {...stateSet(`i${i}`, on ? 0 : 1)}
            >
              {on && <Check aria-hidden className="size-5" />}
              <SpacedNumber text={item} />
            </button>
          );
        })}
      </div>
      <p
        className={`text-center text-caption ${verdict === "wrong" ? "font-semibold text-retry-soft-foreground" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {verdict === "wrong"
          ? "Chưa đúng. Bỏ chọn số chưa phải rồi thử lại nhé."
          : wants
            ? `Đã chọn ${count}/${wants.length}`
            : `Đã chọn ${count}`}
      </p>
      {verdict === "right" && done && (
        <p
          data-chips-done
          className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground"
        >
          <Check aria-hidden className="size-5" />
          {done}
        </p>
      )}
      {shown && (
        <p
          data-chips-shown
          className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-semibold text-correct-soft-foreground"
        >
          Các số tô xanh là đáp án.
        </p>
      )}
    </div>
  );
}
