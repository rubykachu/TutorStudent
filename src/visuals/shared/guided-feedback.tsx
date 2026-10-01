"use client";

import { Check } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { JINGLE_ID, WRONG_ID } from "@/lib/sound-manifest";
import type { VisualProps } from "@/visuals/registry";
import { useGuidedTask } from "@/visuals/shared/guided-step";

// What a guided "cùng làm" screen says and plays once the child is right, and
// the picking logic of the screens where the child chooses some of the
// candidates. The hold on "Tiếp" itself lives in `guided-step.tsx`.

// A visual that serves a lesson screen and an exercise judges only on the
// lesson screen: an exercise gets the task's `params` and never reveals
// whether the child is right (the frame does, after "Kiểm tra").
export function isLessonScreen(params: VisualProps["params"]): boolean {
  return params === undefined;
}

// The closing line of a screen the child did right: green, with a tick.
export function DoneLine({ children, ...rest }: ComponentProps<"p">) {
  return (
    <p
      {...rest}
      className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground"
    >
      <Check aria-hidden className="size-5" />
      {children}
    </p>
  );
}

// The line of a screen whose answer was shown by "Xem cách làm": neutral, it
// does not praise the child.
export function ShownLine({ children, ...rest }: ComponentProps<"p">) {
  return (
    <p
      {...rest}
      className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-semibold text-correct-soft-foreground"
    >
      {children}
    </p>
  );
}

// A guided task whose goal the child reaches by setting controls (steppers,
// buttons) or finishing a sequence: it holds the screen's "Tiếp" until `met`
// or until "Xem cách làm" runs `reveal`, and plays the jingle the moment the
// goal is reached by the child. Not guided (an exercise): nothing waits.
// Returns whether the answer was shown, so the screen can say it neutrally.
export function useGuidedGoal({
  met,
  guided,
  reveal,
}: {
  met: boolean;
  guided: boolean;
  reveal: () => void;
}): { shown: boolean } {
  const sounds = useFeedbackSoundsContext();
  const [shown, setShown] = useState(false);
  const wasMet = useRef(met);
  useEffect(() => {
    if (guided && met && !wasMet.current && !shown) sounds?.play([JINGLE_ID]);
    wasMet.current = met;
  }, [guided, met, shown, sounds]);
  function show() {
    setShown(true);
    reveal();
  }
  useGuidedTask(!guided || met || shown, show);
  return { shown };
}

export type PickVerdict = "none" | "wrong" | "right";

// Picking some of the candidates (indices 0 … size − 1). Without `wants` the
// pick is free (an exercise). With it, the screen is guided: at most
// `wants.length` are chosen (a new pick pushes out the oldest, so one wanted
// candidate means a pick replaces the previous one); once that many are
// chosen the pick is judged at once. Right: `accepted`, the jingle plays and
// "Tiếp" works. Wrong: the picks that are not wanted are `wrongPicks`, the
// wrong sound plays and nothing is revealed. "Xem cách làm" chooses `wants`.
// `isRight` decides a full pick; by default it is right when every wanted
// candidate is in it.
export function useGuidedPick({
  size,
  wants,
  isRight,
}: {
  size: number;
  wants?: readonly number[];
  isRight?: (picks: readonly number[]) => boolean;
}) {
  const sounds = useFeedbackSoundsContext();
  // Candidate indices in the order they were picked.
  const [picks, setPicks] = useState<readonly number[]>([]);
  const [shown, setShown] = useState(false);
  const limit = wants?.length;

  function judge(next: readonly number[]): PickVerdict {
    if (!wants || next.length !== wants.length) return "none";
    const right = isRight
      ? isRight(next)
      : wants.every((i) => next.includes(i));
    return right ? "right" : "wrong";
  }
  const verdict = shown ? "none" : judge(picks);
  const accepted = verdict === "right" || shown;
  const chosen = shown && wants ? wants : picks;
  const wrongPicks =
    verdict === "wrong" ? picks.filter((i) => !wants?.includes(i)) : [];

  // Toggles a candidate and returns the picks after it.
  function toggle(index: number): readonly number[] {
    const next = picks.includes(index)
      ? picks.filter((i) => i !== index)
      : [...picks, index].slice(-(limit ?? size));
    setPicks(next);
    const result = judge(next);
    if (result === "right") sounds?.play([JINGLE_ID]);
    if (result === "wrong") sounds?.play([WRONG_ID]);
    return next;
  }

  function show() {
    setShown(true);
    setPicks(wants ?? []);
  }
  useGuidedTask(wants === undefined || accepted, show);

  return { picks, shown, verdict, accepted, chosen, wrongPicks, toggle };
}
