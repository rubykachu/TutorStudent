"use client";

import { Check } from "lucide-react";
import { Fragment } from "react";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { TapTextInput } from "@/exercises/input";
import { toggleId, wrongPicks } from "@/exercises/selection";
import { useTapSound } from "@/lib/feedback-sounds";
import type { TapTextExercise } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";

export type TapTextAnswerProps = {
  exercise: TapTextExercise;
  slot: AnswerSlotProps<TapTextInput>;
};

// Sentences of every passage block in the prompt, which the frame leaves for
// this answer area to render so they can be tapped.
function passageParagraphs(exercise: TapTextExercise) {
  return exercise.prompt.flatMap((block) =>
    block.type === "passage" ? block.paragraphs : [],
  );
}

// A hint mark is an underline in the concept's colour, because a selected
// sentence already uses the highlight background. A chosen sentence the last check found wrong gets
// a dashed orange underline instead, and stays chosen.
function markClass(mark: HighlightSpec | undefined, wrong: boolean): string {
  if (!mark) {
    return wrong
      ? "underline decoration-dashed decoration-retry decoration-3 underline-offset-8"
      : "";
  }
  const color = CONCEPT_CLASSES[mark.color].decoration;
  const width = mark.strong ? "decoration-6" : "decoration-3";
  return `underline underline-offset-8 ${width} ${color}`;
}

type SentenceProps = {
  id: string;
  text: string;
  selected: boolean;
  revealed: boolean;
  mark: HighlightSpec | undefined;
  wrong: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
};

function Sentence({
  id,
  text,
  selected,
  revealed,
  mark,
  wrong,
  disabled,
  onToggle,
}: SentenceProps) {
  const toggle = () => {
    if (!disabled) onToggle(id);
  };
  // Vertical padding extends the tap box past the line box; cloned decoration
  // keeps the background and padding on every line a long sentence wraps to.
  const paint = selected ? "bg-highlight" : "bg-muted";
  return (
    // A <button> cannot wrap across lines inside running text, so the
    // sentence is an inline element with the button role.
    // biome-ignore lint/a11y/useSemanticElements: see above
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      data-sentence={id}
      data-selected={selected || undefined}
      data-revealed={revealed || undefined}
      data-highlighted={mark !== undefined || undefined}
      data-highlight-strong={mark?.strong || undefined}
      data-wrong={wrong || undefined}
      className={`rounded-sm px-1 py-1 box-decoration-clone ${paint} ${markClass(mark, wrong)} ${disabled ? "" : "cursor-pointer"}`}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
      }}
    >
      {revealed && (
        <Check
          aria-hidden
          strokeWidth={3}
          className="mr-1 inline-block size-5 align-middle text-correct"
        />
      )}
      {text}
    </span>
  );
}

// The passage as tappable sentences: a tap selects or clears a whole sentence.
export function TapTextAnswer({ exercise, slot }: TapTextAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal } = slot;
  const own = value?.selected ?? [];
  const selected = new Set(reveal ? exercise.answer : own);
  const answer = new Set(exercise.answer);
  const wrongChosen = reveal ? new Set<string>() : wrongPicks(wrong, own);

  const playTap = useTapSound();

  function toggle(id: string) {
    playTap();
    const next = toggleId(own, id);
    onChange(next.length > 0 ? { type: "tapText", selected: next } : null);
  }

  return (
    <fieldset
      aria-label="Chạm vào câu để chọn"
      className="flex flex-col gap-3 text-passage leading-tap md:text-passage-lg"
      data-reveal={reveal || undefined}
    >
      {passageParagraphs(exercise).map((paragraph) => (
        <p key={paragraph.sentences[0]?.id}>
          {paragraph.sentences.map((sentence, index) => (
            <Fragment key={sentence.id}>
              {index > 0 && " "}
              <Sentence
                id={sentence.id}
                text={sentence.text}
                selected={selected.has(sentence.id)}
                revealed={reveal && answer.has(sentence.id)}
                mark={highlight.get(sentence.id)}
                wrong={wrongChosen.has(sentence.id)}
                disabled={disabled}
                onToggle={toggle}
              />
            </Fragment>
          ))}
        </p>
      ))}
    </fieldset>
  );
}
