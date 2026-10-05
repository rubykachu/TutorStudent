"use client";

import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { SectionStepper } from "@/components/section-stepper";
import { SoundToggle } from "@/components/sound-toggle";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { lessonPath } from "@/lib/routes";
import type { FeedbackContext } from "@/user-feedback/context";
import { FeedbackButton } from "@/user-feedback/feedback-button";

type PlayerHeaderProps = {
  lessonId: string;
  // The child whose sound setting the header's switch shows.
  childId: string;
  // Dots for the position in the section or review; none on an end screen.
  progress?: {
    current: number;
    total: number;
    // Names of the dots and a jump to one already reached; see
    // `SectionStepper`.
    labels?: readonly string[];
    reached?: number;
    onSelect?: (index: number) => void;
  };
  // Goes to the previous screen; absent on the first one. The button keeps
  // its room even then, so the dots never shift when it appears.
  onBack?: () => void;
  // What a report from the "Góp ý" button is about: the screen shown.
  feedback?: FeedbackContext;
};

// Top row of the section and review players: leave the lesson (×), go back
// one screen ("Quay lại"), the position dots and, at the right end, "Góp ý"
// and the sound switch. Leaving plays the goodbye clip.
export function PlayerHeader({
  lessonId,
  childId,
  progress,
  onBack,
  feedback,
}: PlayerHeaderProps) {
  const sounds = useFeedbackSoundsContext();
  return (
    <header className="flex items-center gap-2 md:gap-4">
      <Link
        href={lessonPath(lessonId)}
        aria-label="Về trang bài"
        // Says goodbye instead of the plain button press.
        data-own-sound
        onClick={() => sounds?.leave()}
        className="-ml-2 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground"
      >
        <X aria-hidden className="size-7" />
      </Link>
      {progress && (
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          // Hidden, not removed, on the first screen: see `onBack`.
          aria-hidden={!onBack || undefined}
          data-back
          className={`flex min-h-touch shrink-0 items-center gap-1 rounded-full border-2 border-border bg-surface pr-4 pl-2 font-semibold text-foreground motion-safe:transition-transform motion-safe:active:scale-97 ${onBack ? "" : "invisible"}`}
        >
          <ChevronLeft aria-hidden className="size-6" />
          Quay lại
        </button>
      )}
      {progress && <SectionStepper {...progress} />}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {feedback && <FeedbackButton context={feedback} />}
        <SoundToggle childId={childId} />
      </div>
    </header>
  );
}
