"use client";

import { Check } from "lucide-react";
import { useMemo } from "react";
import {
  AnswerHighlight,
  surfaceFor,
  WRONG_TONE,
} from "@/exercises/answer-highlight";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { ChoiceInput } from "@/exercises/input";
import { ItemContent } from "@/exercises/item-content";
import { toggleId } from "@/exercises/selection";
import { seededShuffle } from "@/exercises/shuffle";
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

export function ChoiceAnswer({ exercise, slot }: ChoiceAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal, seed } = slot;
  const options = useMemo(
    () => seededShuffle(exercise.options, seed),
    [exercise.options, seed],
  );
  const long = longOptions(exercise.options);
  const selected = reveal ? exercise.answer : (value?.selected ?? []);

  function toggle(id: string) {
    const next = nextSelection(exercise, value?.selected ?? [], id);
    onChange(next.length === 0 ? null : { type: "choice", selected: next });
  }

  return (
    <fieldset className="flex flex-col gap-4" data-reveal={reveal || undefined}>
      {/* Told up front so the child knows whether one tap is enough. */}
      <legend className="mb-4 text-caption text-muted-foreground">
        {exercise.multiple ? "Chọn tất cả đáp án đúng" : "Chọn một đáp án"}
      </legend>
      <div
        className={`grid gap-3 ${long ? "" : SHORT_OPTION_COLUMNS}`}
        data-long-options={long || undefined}
      >
        {options.map((option) => {
          const spec = highlight.get(option.id);
          const on = selected.includes(option.id);
          const missed = !on && wrong.has(option.id);
          return (
            <AnswerHighlight key={option.id} spec={spec} className="w-full">
              <button
                type="button"
                aria-pressed={on}
                disabled={disabled}
                data-option={option.id}
                data-wrong={missed || undefined}
                onClick={() => toggle(option.id)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-lg px-4 py-3 text-left motion-safe:transition-transform motion-safe:active:scale-97 ${
                  on
                    ? reveal
                      ? "border-3 border-correct bg-correct-soft"
                      : `border-3 border-primary ${surfaceFor(spec)}`
                    : missed
                      ? WRONG_TONE
                      : `border-2 border-border ${surfaceFor(spec)}`
                }`}
              >
                <Marker multiple={exercise.multiple} on={on} reveal={reveal} />
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
}: {
  multiple: boolean;
  on: boolean;
  reveal: boolean;
}) {
  const shape = multiple ? "rounded-sm" : "rounded-full";
  const fill = on
    ? reveal
      ? "border-correct bg-correct text-primary-foreground"
      : "border-primary bg-primary text-primary-foreground"
    : "border-muted-foreground bg-surface";
  return (
    <span
      aria-hidden
      className={`flex size-7 shrink-0 items-center justify-center border-2 ${shape} ${fill}`}
    >
      {on && <Check className="size-5" strokeWidth={3} />}
    </span>
  );
}
