"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { VideoPlayer } from "@/components/blocks/video-player";
import { cardClip } from "@/content";
import type { Lesson } from "@/schema/content";

type CardClipProps = { lesson: Pick<Lesson, "videos">; cardId: string };

// Under a card's recap in review: a small, optional way back to the part of
// the lesson video that explains the card. Nothing shows when the card has
// no clip; the player opens only when the child asks for it.
export function CardClip({ lesson, cardId }: CardClipProps) {
  const [open, setOpen] = useState(false);
  const found = cardClip(lesson, cardId);
  if (!found) return null;
  if (open) {
    return (
      <div className="mx-auto w-full max-w-content" data-card-clip="open">
        <VideoPlayer video={found.video} clip={found.clip} />
      </div>
    );
  }
  return (
    <div className="flex justify-center" data-card-clip="closed">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold text-body text-foreground"
      >
        <Play aria-hidden className="size-5" />
        Xem lại đoạn video
      </button>
    </div>
  );
}
