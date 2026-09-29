"use client";

import { BigButton } from "@/components/big-button";
import type { WritingCheck } from "@/progress/db";

type RubricChecklistProps = {
  text: string;
  checks: readonly WritingCheck[];
  onToggle: (index: number) => void;
  onEdit: () => void;
  onFinish: () => void;
  // After "Hoàn thành" the checklist stays visible but can no longer change.
  finished: boolean;
};

// The child reads their writing back and ticks what it already does; there is
// no score, so every criterion can stay unticked without penalty.
export function RubricChecklist({
  text,
  checks,
  onToggle,
  onEdit,
  onFinish,
  finished,
}: RubricChecklistProps) {
  return (
    <section className="flex flex-col gap-6" data-rubric>
      <div className="whitespace-pre-wrap rounded-xl border-2 border-border bg-surface p-4 text-passage md:p-6 md:text-passage-lg">
        {text}
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-heading text-block md:text-block-lg">
          Bài của em đã làm được gì?
        </legend>
        {checks.map((check, index) => (
          <label
            // Rubric lines are fixed content and may repeat, so position is
            // their identity.
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={index}
            className="flex min-h-touch cursor-pointer items-center gap-4 rounded-lg border-2 border-border bg-surface p-3 has-checked:border-correct has-checked:bg-correct-soft"
          >
            <input
              type="checkbox"
              checked={check.met}
              disabled={finished}
              onChange={() => onToggle(index)}
              className="size-8 shrink-0 accent-correct"
            />
            <span>{check.criterion}</span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-3 md:flex-row">
        <BigButton variant="secondary" disabled={finished} onClick={onEdit}>
          Sửa bài
        </BigButton>
        <BigButton disabled={finished} onClick={onFinish}>
          Hoàn thành
        </BigButton>
      </div>
    </section>
  );
}
