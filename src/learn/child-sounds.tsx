"use client";

import type { ReactNode } from "react";
import { useFeedbackSounds } from "@/learn/use-feedback-sounds";
import { ButtonSounds, FeedbackSoundsProvider } from "@/lib/feedback-sounds";

// Sounds of a child's screen outside the players (home, subject, lesson
// page): the child's sound setting, reachable by every control under it, and
// the soft press of every button and link.
export function ChildSounds({
  childId,
  children,
}: {
  childId: string;
  children: ReactNode;
}) {
  const sounds = useFeedbackSounds(childId);
  return (
    <FeedbackSoundsProvider sounds={sounds}>
      <ButtonSounds>{children}</ButtonSounds>
    </FeedbackSoundsProvider>
  );
}
