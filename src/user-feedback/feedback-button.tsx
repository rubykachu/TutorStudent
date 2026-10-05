"use client";

import { MessageCircleHeart } from "lucide-react";
import { useCallback, useState } from "react";
import type { FeedbackContext } from "./context";
import { FeedbackSheet } from "./feedback-sheet";
import type { FeedbackReason } from "./schema";

// What a screen's report is about, so "Đã gửi" holds per item: the item, or
// the step, or the screen.
function contextKey(context: FeedbackContext): string {
  return [context.section, context.item ?? context.step ?? context.screen].join(
    "|",
  );
}

// Every narration, video or song playing on the page stops when the sheet
// opens; nothing starts them again (the child taps play).
function pauseMedia() {
  for (const media of document.querySelectorAll<HTMLMediaElement>(
    "audio, video",
  )) {
    if (!media.paused) media.pause();
  }
}

// "Góp ý" in the top row of a lesson screen: an icon button (its word shows
// from the md breakpoint up) that opens the feedback sheet. The reasons sent
// stay marked while this screen is open.
export function FeedbackButton({ context }: { context: FeedbackContext }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<ReadonlyMap<string, Set<FeedbackReason>>>(
    new Map(),
  );
  const key = contextKey(context);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        aria-label="Góp ý về bài này"
        data-feedback-button
        onClick={() => {
          pauseMedia();
          setOpen(true);
        }}
        className="flex min-h-touch min-w-touch shrink-0 items-center justify-center gap-1 rounded-full text-muted-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:px-3"
      >
        <MessageCircleHeart aria-hidden className="size-6" />
        <span aria-hidden className="hidden font-semibold md:inline">
          Góp ý
        </span>
      </button>
      {open && (
        <FeedbackSheet
          context={context}
          sent={sent.get(key) ?? new Set()}
          onSent={(reason) =>
            setSent((current) => {
              const next = new Map(current);
              next.set(key, new Set([...(current.get(key) ?? []), reason]));
              return next;
            })
          }
          onClose={close}
        />
      )}
    </>
  );
}
