"use client";

import { Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RichText } from "@/components/rich-text";
import { readAloud, speechSentences, useVietnameseVoice } from "@/lib/speech";

export type ReadAloudState = {
  // False while the device has no Vietnamese voice: nothing is offered.
  available: boolean;
  // Index into the read parts of the one being read, null when idle.
  reading: number | null;
  toggle: () => void;
};

// Reads `parts` (usually sentences) aloud one after another and reports the
// one being read. Reading stops when the owner unmounts, e.g. on the next
// screen or another page.
export function useReadAloud(parts: readonly string[]): ReadAloudState {
  const voice = useVietnameseVoice();
  const [reading, setReading] = useState<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  useEffect(() => () => stopRef.current?.(), []);
  const toggle = () => {
    if (!voice) return;
    if (stopRef.current && reading !== null) {
      stopRef.current();
      stopRef.current = null;
      return;
    }
    stopRef.current = readAloud(parts, { voice, onSentence: setReading });
  };
  return { available: Boolean(voice), reading, toggle };
}

// Where a text puts its read-aloud button: `labelled` is a "Nghe đọc" pill on
// a line of its own above the text; `compact` is a round speaker icon at the
// start of the text's first line, with the text wrapping beside it, for
// places short of height such as an exercise prompt above its answer card.
export type ReadAloudLayout = "labelled" | "compact";

// Keeps a compact button to the side of the first lines of the text it sits in.
export const COMPACT_READ_ALOUD_CLASS = "float-left mr-3";

// The speaker button every read-aloud text shares.
export function ReadAloudButton({
  state,
  layout = "labelled",
  className = "",
}: {
  state: ReadAloudState;
  layout?: ReadAloudLayout;
  className?: string;
}) {
  if (!state.available) return null;
  const reading = state.reading !== null;
  const Icon = reading ? Square : Volume2;
  const label = reading ? "Dừng đọc" : "Nghe đọc";
  const compact = layout === "compact";
  return (
    <button
      type="button"
      data-read-aloud={reading ? "reading" : "idle"}
      data-read-aloud-layout={layout}
      aria-pressed={reading}
      aria-label={compact ? label : undefined}
      onClick={state.toggle}
      className={`inline-flex shrink-0 items-center rounded-full border-2 border-border bg-surface font-semibold text-body text-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none ${compact ? `size-touch justify-center ${COMPACT_READ_ALOUD_CLASS}` : "min-h-touch gap-2 px-4"} ${className}`}
    >
      <Icon
        aria-hidden
        className={`size-6 ${reading ? "fill-current" : ""}`}
        strokeWidth={2.25}
      />
      {!compact && label}
    </button>
  );
}

// A sentence drawn with the reading background while it is read aloud.
export function ReadAloudSentence({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  return (
    <span
      data-reading={active || undefined}
      className={`box-decoration-clone rounded-sm motion-safe:transition-colors motion-safe:duration-150 ${active ? "bg-reading" : ""}`}
    >
      <RichText text={text} />
    </span>
  );
}

// Lesson prose with a read-aloud button (above it, or compact at its start):
// the sentence being read is lit up as the voice reaches it.
export function ReadAloudText({
  text,
  layout = "labelled",
}: {
  text: string;
  layout?: ReadAloudLayout;
}) {
  const parts = speechSentences(text);
  const state = useReadAloud(parts);
  const button = <ReadAloudButton state={state} layout={layout} />;
  return (
    <>
      {layout === "labelled" && button}
      <p>
        {layout === "compact" && button}
        {parts.map((sentence, i) => (
          // Sentences of a fixed text never reorder.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <span key={i}>
            {i > 0 && " "}
            <ReadAloudSentence text={sentence} active={state.reading === i} />
          </span>
        ))}
      </p>
    </>
  );
}
