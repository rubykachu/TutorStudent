import { useEffect, useState } from "react";
import { playMusic, preloadSounds, stopMusic } from "@/lib/sound";
import { soundUrl } from "@/lib/sound-manifest";
import { useSoundEnabled } from "@/progress/hooks";
import type { Song } from "./songs";

// Plays the music box's songs for one child: one at a time, only while the
// child's sound is on, and never past the screen that asked (the song stops
// when the component unmounts, when sound is turned off, or when a voice
// starts).
export function useMusicPlayer(childId: string, songs: readonly Song[]) {
  const enabled = useSoundEnabled(childId) === true;
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (enabled) {
      preloadSounds(songs.flatMap((song) => soundUrl(song.id) ?? []));
      return undefined;
    }
    stopMusic();
    setPlayingId(null);
    return undefined;
  }, [enabled, songs]);

  useEffect(() => stopMusic, []);

  function toggle(song: Song): void {
    if (!enabled) return;
    if (playingId === song.id) {
      stopMusic();
      setPlayingId(null);
      return;
    }
    const url = soundUrl(song.id);
    if (!url) return;
    setPlayingId(song.id);
    void playMusic(url).then(() =>
      setPlayingId((current) => (current === song.id ? null : current)),
    );
  }

  return { enabled, playingId, toggle };
}
