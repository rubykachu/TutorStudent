import { useEffect, useRef, useState } from "react";
import { playMusic, stopMusic, warmSounds } from "@/lib/sound";
import { soundUrl } from "@/lib/sound-manifest";
import { useSoundEnabled } from "@/progress/hooks";
import { pickSong, type Song } from "./songs";

// Plays the songs for one child, one at a time and only while the child's
// sound is on. `toggle` starts a random song, or stops the one playing. The
// song never outlives the component: it stops when the component unmounts,
// when sound is turned off, or when a voice starts.
export function useMusicPlayer(childId: string, songs: readonly Song[]) {
  const enabled = useSoundEnabled(childId) === true;
  const [playingId, setPlayingId] = useState<string | null>(null);
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (enabled) {
      warmSounds(songs.flatMap((song) => soundUrl(song.id) ?? []));
      return undefined;
    }
    stopMusic();
    setPlayingId(null);
    return undefined;
  }, [enabled, songs]);

  useEffect(() => stopMusic, []);

  function toggle(): void {
    if (!enabled) return;
    if (playingId !== null) {
      stopMusic();
      setPlayingId(null);
      return;
    }
    const song = pickSong(songs, lastId.current);
    const url = song && soundUrl(song.id);
    if (!song || !url) return;
    lastId.current = song.id;
    setPlayingId(song.id);
    void playMusic(url).then(() =>
      setPlayingId((current) => (current === song.id ? null : current)),
    );
  }

  return { enabled, playingId, toggle };
}
