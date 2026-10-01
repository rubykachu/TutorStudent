"use client";

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
} from "react";

// Sounds of the feedback, supplied by the player (absent while the child has
// sound off). Called inside the tap on "Kiểm tra", so audio may start there
// (iOS only lets audio start from a user gesture), with the clip ids of
// `feedbackCue` to play one after another.
export type FeedbackSounds = {
  play: (clipIds: readonly string[]) => void;
  // The soft click of choosing an option, chip or region. Plays alongside
  // anything already sounding instead of cutting it off.
  tap: () => void;
  // The softer press of a button or a link that leads somewhere.
  button: () => void;
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

// `data-own-sound` marks a control or an area whose controls make their own
// sound, or none on purpose (an answer's options, an interactive visual, the
// sound switch, a sticker), so `ButtonSounds` leaves them alone.
const OWN_SOUND_SELECTOR = "[data-own-sound]";

// Every button and link under it plays the soft button press when tapped:
// one rule for the whole screen instead of a call in each control, so a new
// button can never be left silent. Skips disabled controls and anything
// inside a `data-own-sound` area. Silent with sound off.
export function ButtonSounds({ children }: { children: ReactNode }) {
  const sounds = useContext(FeedbackSoundsContext);
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!sounds || !(event.target instanceof Element)) return;
    const control = event.target.closest("a[href], button, [role='button']");
    if (!control || !event.currentTarget.contains(control)) return;
    if (control.matches(":disabled, [aria-disabled='true']")) return;
    if (control.closest(OWN_SOUND_SELECTOR)) return;
    sounds.button();
  };
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: listens to clicks of the buttons inside, adds no control of its own.
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard activation of a button fires this click too.
    <div className="contents" onClick={onClick}>
      {children}
    </div>
  );
}
