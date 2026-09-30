"use client";

import { createContext, type ReactNode, useContext } from "react";

// Sounds of the feedback, supplied by the player (absent while the child has
// sound off). Called inside the tap on "Kiểm tra", so audio may start there
// (iOS only lets audio start from a user gesture), with the clip ids of
// `feedbackCue` to play one after another.
export type FeedbackSounds = {
  play: (clipIds: readonly string[]) => void;
  // The soft click of choosing an option, chip or region. Plays alongside
  // anything already sounding instead of cutting it off.
  tap: () => void;
};

const FeedbackSoundsContext = createContext<FeedbackSounds | undefined>(
  undefined,
);

// Makes a player's sounds reachable from every answer component and visual
// under it without passing them down each level.
export function FeedbackSoundsProvider({
  sounds,
  children,
}: {
  sounds: FeedbackSounds | undefined;
  children: ReactNode;
}) {
  return (
    <FeedbackSoundsContext value={sounds}>{children}</FeedbackSoundsContext>
  );
}

// The player's sounds, or undefined outside a player or with sound off.
export function useFeedbackSoundsContext(): FeedbackSounds | undefined {
  return useContext(FeedbackSoundsContext);
}

// Plays the click of a choice; does nothing when sound is off.
export function useTapSound(): () => void {
  const sounds = useContext(FeedbackSoundsContext);
  return () => sounds?.tap();
}
