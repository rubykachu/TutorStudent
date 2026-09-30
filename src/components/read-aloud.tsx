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

// The speaker button every read-aloud text shares.
export function ReadAloudButton({
  state,
  className = "",
}: {
  state: ReadAloudState;
  className?: string;
}) {
  if (!state.available) return null;
  const reading = state.reading !== null;
  const Icon = reading ? Square : Volume2;
  return (
    <button
      type="button"
      data-read-aloud={reading ? "reading" : "idle"}
      aria-pressed={reading}
      onClick={state.toggle}
      className={`inline-flex min-h-touch shrink-0 items-center gap-2 rounded-full border-2 border-border bg-surface px-4 font-semibold text-body text-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none ${className}`}
    >
      <Icon
        aria-hidden
        className={`size-6 ${reading ? "fill-current" : ""}`}
        strokeWidth={2.25}
      />
      {reading ? "Dừng đọc" : "Nghe đọc"}
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

// Lesson prose with a "Nghe đọc" button above it: the sentence being read
// is lit up as the voice reaches it.
export function ReadAloudText({ text }: { text: string }) {
  const parts = speechSentences(text);
  const state = useReadAloud(parts);
  return (
    <>
      <ReadAloudButton state={state} />
      <p>
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
