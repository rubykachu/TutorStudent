"use client";

import { Check, ListChecks } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnswerHighlight, WRONG_PICK_TONE } from "@/exercises/answer-highlight";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { ChoiceInput } from "@/exercises/input";
import { ItemContent } from "@/exercises/item-content";
import { toggleId, wrongPicks } from "@/exercises/selection";
import { seededShuffle } from "@/exercises/shuffle";
import { useTapSound } from "@/lib/feedback-sounds";
import type { ChoiceExercise } from "@/schema/content";

type ChoiceAnswerProps = {
  exercise: ChoiceExercise;
  slot: AnswerSlotProps<ChoiceInput>;
};

function nextSelection(
  exercise: ChoiceExercise,
  selected: readonly string[],
  id: string,
): string[] {
  return exercise.multiple ? toggleId(selected, id) : [id];
}

// Short options sit side by side in as many columns as fit at least 16rem
// wide; a long one (a sentence, a sum of powers) gets a whole row, since a
// half-width column breaks it at every word or operator.
const SHORT_OPTION_COLUMNS =
  "grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]";
// Longest text, or longest formula counted without TeX commands and braces,
// that still reads on one line in a half-width column.
const MAX_SHORT_TEXT_CHARS = 24;
const MAX_SHORT_FORMULA_CHARS = 8;

function longOptions(options: ChoiceExercise["options"]): boolean {
  return options.some(({ content }) => {
    if (content.type === "text") {
      return content.text.length > MAX_SHORT_TEXT_CHARS;
    }
    if (content.type === "formula") {
      const shown = content.tex.replaceAll(/\\[a-zA-Z]+|[{}^_\s]/g, "");
      return shown.length > MAX_SHORT_FORMULA_CHARS;
    }
    return false;
  });
}

const NO_IDS: ReadonlySet<string> = new Set();

export function ChoiceAnswer({ exercise, slot }: ChoiceAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal, seed } = slot;
  const options = useMemo(
    () => seededShuffle(exercise.options, seed),
    [exercise.options, seed],
  );
  const gridRef = useRef<HTMLDivElement>(null);
  // Formula options never wrap, so a row of them that turns out wider than
  // its column (a long product in a narrow card) falls back to one per row.
  const [cramped, setCramped] = useState(false);
  const long = cramped || longOptions(exercise.options);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || long) return;
    const overflowing = [
      ...grid.querySelectorAll<HTMLElement>("[data-option]"),
    ].some((option) => option.scrollWidth > option.clientWidth + 1);
    if (overflowing) setCramped(true);
  }, [long]);
  // A new width (rotation) may fit the columns again: measure afresh.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === "undefined") return;
    let width = grid.clientWidth;
    const observer = new ResizeObserver(() => {
      if (grid.clientWidth === width) return;
      width = grid.clientWidth;
      setCramped(false);
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);
  const selected = reveal ? exercise.answer : (value?.selected ?? []);
  const wrongChosen = reveal ? NO_IDS : wrongPicks(wrong, selected);

  const playTap = useTapSound();

  function toggle(id: string) {
    playTap();
    const next = nextSelection(exercise, value?.selected ?? [], id);
    onChange(next.length === 0 ? null : { type: "choice", selected: next });
  }

  return (
    <fieldset
      className="flex flex-col gap-4"
      data-reveal={reveal || undefined}
      data-multiple={exercise.multiple || undefined}
    >
      {/* Told up front so the child knows whether one tap is enough; "pick
        several" is easy to miss, so it is written bolder, with the checkbox
        mark its options use. */}
      {exercise.multiple ? (
        <legend className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <ListChecks aria-hidden className="size-6 shrink-0 text-primary" />
          Chọn tất cả đáp án đúng
        </legend>
      ) : (
        <legend className="mb-4 text-caption text-muted-foreground">
          Chọn một đáp án
        </legend>
      )}
      <div
        ref={gridRef}
        className={`grid gap-3 ${long ? "" : SHORT_OPTION_COLUMNS}`}
        data-long-options={long || undefined}
      >
        {options.map((option) => {
          const spec = highlight.get(option.id);
          const on = selected.includes(option.id);
          const marked = wrongChosen.has(option.id);
          return (
            <AnswerHighlight key={option.id} spec={spec} className="w-full">
              <button
                type="button"
                aria-pressed={on}
                disabled={disabled}
                data-option={option.id}
                data-wrong={marked || undefined}
                onClick={() => toggle(option.id)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-lg px-4 py-3 text-left motion-safe:transition-transform motion-safe:active:scale-97 ${
                  marked
                    ? WRONG_PICK_TONE
                    : on
                      ? reveal
                        ? "border-3 border-correct bg-correct-soft"
                        : "border-3 border-primary bg-surface"
                      : "border-2 border-border bg-surface"
                }`}
              >
                <Marker
                  multiple={exercise.multiple}
                  on={on}
                  reveal={reveal}
                  wrong={marked}
                />
                <ItemContent content={option.content} />
              </button>
            </AnswerHighlight>
          );
        })}
      </div>
    </fieldset>
  );
}

// Round for "pick one", square for "pick several", with a tick when chosen,
// so the choice never rests on colour alone.
function Marker({
  multiple,
  on,
  reveal,
  wrong,
}: {
  multiple: boolean;
  on: boolean;
  reveal: boolean;
  wrong: boolean;
}) {
  const shape = multiple ? "rounded-sm" : "rounded-full";
  const fill = wrong
    ? "border-retry bg-retry text-primary-foreground"
    : on
      ? reveal
        ? "border-correct bg-correct text-primary-foreground"
        : "border-primary bg-primary text-primary-foreground"
      : "border-muted-foreground bg-surface";
  return (
    <span
      aria-hidden
      data-choice-marker={multiple ? "checkbox" : "radio"}
      className={`flex size-7 shrink-0 items-center justify-center border-2 ${shape} ${fill}`}
    >
      {on && <Check className="size-5" strokeWidth={3} />}
    </span>
  );
}
