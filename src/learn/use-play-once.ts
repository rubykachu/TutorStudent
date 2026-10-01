import { useEffect, useRef } from "react";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";

// Plays a cue (clip ids, one after another) once, when the component first
// has sounds to play with; nothing while the child has sound off.
export function usePlayOnce(cue: readonly string[]): void {
  const sounds = useFeedbackSoundsContext();
  const played = useRef(false);
  useEffect(() => {
    if (played.current || !sounds) return;
    played.current = true;
    sounds.play(cue);
  }, [sounds, cue]);
}
