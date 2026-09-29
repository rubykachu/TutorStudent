"use client";

import { useId } from "react";
import { BigButton } from "@/components/big-button";
import { hasOwnWriting, writingStats } from "@/exercises/open-ended/writing";

type WritingStepProps = {
  starter: string;
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
};

// Framed writing: the suggested opening is already in the box so the child
// only has to continue it, typing or with the iPad's dictation key.
export function WritingStep({
  starter,
  text,
  onChange,
  onSubmit,
}: WritingStepProps) {
  const fieldId = useId();
  const hintId = useId();
  const stats = writingStats(text);
  const ready = hasOwnWriting(text, starter);

  return (
    <section className="flex flex-col gap-4" data-writing-step>
      <p className="text-caption text-muted-foreground">
        Câu mở đầu gợi ý: <span className="text-foreground">{starter}</span>
      </p>
      <label
        htmlFor={fieldId}
        className="font-heading text-block md:text-block-lg"
      >
        Bài viết của em
      </label>
      <textarea
        id={fieldId}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hintId}
        lang="vi"
        spellCheck
        autoCapitalize="sentences"
        rows={8}
        className="min-h-64 w-full resize-y rounded-xl border-2 border-border bg-surface p-4 text-passage md:p-6 md:text-passage-lg"
      />
      <p id={hintId} className="text-caption text-muted-foreground">
        {`Em đã viết ${stats.sentences} câu, ${stats.words} chữ.`}
      </p>
      <BigButton disabled={!ready} onClick={onSubmit}>
        Xong
      </BigButton>
    </section>
  );
}
