"use client";

import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import {
  AnswerHighlight,
  surfaceFor,
  WRONG_TONE,
} from "@/exercises/answer-highlight";
import { DRAG_ACCESSIBILITY, useDragSensors } from "@/exercises/drag";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import { ownValue } from "@/exercises/grade/result";
import type { FillBlankInput } from "@/exercises/input";
import { seededShuffle } from "@/exercises/shuffle";
import type { FillBlankExercise } from "@/schema/content";

type FillBlankAnswerProps = {
  exercise: FillBlankExercise;
  slot: AnswerSlotProps<FillBlankInput>;
};

type Blanks = Readonly<Record<string, string>>;

function revealedBlanks(exercise: FillBlankExercise): Blanks {
  const blanks: Record<string, string> = {};
  for (const segment of exercise.segments) {
    if (segment.type === "blank") blanks[segment.id] = segment.accept[0];
  }
  return blanks;
}

const CHIP_DRAG_PREFIX = "chip:";

export function FillBlankAnswer({ exercise, slot }: FillBlankAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal, seed } = slot;
  const blanks = reveal ? revealedBlanks(exercise) : (value?.blanks ?? {});
  // Bank index of the word tapped first, waiting for a blank to go into.
  const [picked, setPicked] = useState<number | null>(null);
  const sensors = useDragSensors();
  const { bank } = exercise;
  // Bank indexes in the order the chips are shown; a word may repeat, so two
  // chips with the same word count as looking the same.
  const chipOrder = useMemo(
    () =>
      bank
        ? seededShuffle(
            bank.map((_, index) => index),
            seed,
            { key: (index) => bank[index] },
          )
        : [],
    [bank, seed],
  );

  function setBlank(id: string, text: string) {
    const next = { ...(value?.blanks ?? {}), [id]: text };
    const empty = Object.values(next).every((t) => t.trim() === "");
    onChange(empty ? null : { type: "fillBlank", blanks: next });
  }

  let blankNumber = 0;
  const sentence = exercise.segments.map((segment, index) => {
    if (segment.type === "text") {
      // Segments have no ids; their order is fixed content.
      // biome-ignore lint/suspicious/noArrayIndexKey: static list
      return <span key={index}>{segment.text}</span>;
    }
    blankNumber += 1;
    const text = ownValue(blanks, segment.id) ?? "";
    const common = {
      id: segment.id,
      number: blankNumber,
      text,
      spec: highlight.get(segment.id),
      wrong: wrong.has(segment.id),
      disabled,
      reveal,
    };
    return bank ? (
      <BankBlank
        key={segment.id}
        {...common}
        onTap={() => {
          if (picked !== null) {
            setBlank(segment.id, bank[picked]);
            setPicked(null);
          } else if (text !== "") {
            setBlank(segment.id, "");
          }
        }}
      />
    ) : (
      <TypedBlank
        key={segment.id}
        {...common}
        onType={(typed) => setBlank(segment.id, typed)}
      />
    );
  });

  const body = (
    <p className="text-body leading-14 md:text-body-lg">{sentence}</p>
  );
  if (!bank) {
    return <div data-reveal={reveal || undefined}>{body}</div>;
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    const index = Number(String(active.id).slice(CHIP_DRAG_PREFIX.length));
    setBlank(String(over.id), bank?.[index] ?? "");
    setPicked(null);
  }

  return (
    <DndContext
      sensors={sensors}
      accessibility={DRAG_ACCESSIBILITY}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-6" data-reveal={reveal || undefined}>
        {body}
        <fieldset
          className="min-w-0 flex flex-wrap gap-3"
          aria-label="Chọn từ rồi chạm vào ô trống"
        >
          {chipOrder.map((index) => (
            <BankChip
              // Bank words may repeat, so the bank index is the identity.
              key={index}
              index={index}
              word={bank[index]}
              picked={picked === index}
              disabled={disabled}
              onTap={() => setPicked(picked === index ? null : index)}
            />
          ))}
        </fieldset>
      </div>
    </DndContext>
  );
}

type BlankProps = {
  id: string;
  number: number;
  text: string;
  spec: HighlightSpec | undefined;
  wrong: boolean;
  disabled: boolean;
  reveal: boolean;
};

function blankTone(
  text: string,
  reveal: boolean,
  wrong: boolean,
  spec?: HighlightSpec,
) {
  if (reveal) return "border-2 border-correct bg-correct-soft";
  if (wrong) return WRONG_TONE;
  return text === ""
    ? `border-2 border-dashed border-muted-foreground ${surfaceFor(spec)}`
    : `border-2 border-primary ${surfaceFor(spec)}`;
}

function BankBlank({
  id,
  number,
  text,
  spec,
  wrong,
  disabled,
  reveal,
  onTap,
}: BlankProps & { onTap: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <AnswerHighlight spec={spec} className="align-middle">
      <button
        ref={setNodeRef}
        type="button"
        aria-label={`Ô trống ${number}: ${text === "" ? "chưa điền" : text}`}
        disabled={disabled}
        data-blank={id}
        data-wrong={wrong || undefined}
        onClick={onTap}
        className={`inline-flex h-12 min-w-24 items-center justify-center rounded-sm px-3 font-semibold ${blankTone(text, reveal, wrong, spec)} ${isOver ? "outline-3 outline-primary" : ""}`}
      >
        {text}
      </button>
    </AnswerHighlight>
  );
}

function TypedBlank({
  id,
  number,
  text,
  spec,
  wrong,
  disabled,
  reveal,
  onType,
}: BlankProps & { onType: (text: string) => void }) {
  return (
    <AnswerHighlight spec={spec} className="align-middle">
      <label className="inline-flex items-center gap-1">
        <span className="text-caption text-muted-foreground">({number})</span>
        {/* Raw text with no reformatting, so IME composition (Vietnamese
            Telex/VNI) is never interrupted; grading normalises it later. */}
        <input
          type="text"
          lang="vi"
          aria-label={`Ô trống ${number}`}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          disabled={disabled}
          data-blank={id}
          data-wrong={wrong || undefined}
          value={text}
          onChange={(event) => onType(event.target.value)}
          className={`h-12 w-36 rounded-sm px-3 text-body md:text-body-lg ${blankTone(text, reveal, wrong, spec)}`}
        />
      </label>
    </AnswerHighlight>
  );
}

function BankChip({
  index,
  word,
  picked,
  disabled,
  onTap,
}: {
  index: number;
  word: string;
  picked: boolean;
  disabled: boolean;
  onTap: () => void;
}) {
  const { setNodeRef, listeners, transform, isDragging } = useDraggable({
    id: `${CHIP_DRAG_PREFIX}${index}`,
    disabled,
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      aria-pressed={picked}
      disabled={disabled}
      data-chip={word}
      onClick={onTap}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`inline-flex min-h-12 min-w-12 touch-none items-center justify-center rounded-full px-5 font-semibold select-none ${
        // A transition would make the chip lag behind the finger.
        isDragging
          ? "relative z-10 shadow-card"
          : "motion-safe:transition-transform motion-safe:active:scale-97"
      } ${
        picked
          ? "border-3 border-primary bg-primary text-primary-foreground"
          : "border-2 border-border bg-surface"
      }`}
    >
      {word}
    </button>
  );
}
