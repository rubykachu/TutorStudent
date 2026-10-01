"use client";

import { Lock, Music, Play, Square, VolumeX } from "lucide-react";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { Sheet } from "@/components/sheet";
import { SONGS, type Song, sectionsToUnlock, unlockedCount } from "./songs";
import { useMusicPlayer } from "./use-music-player";

// "Hộp nhạc · 2 bài": the line of the home chip, and of the sheet.
export function musicBoxCaption(doneSections: number): string {
  const count = unlockedCount(doneSections);
  return count === 0 ? "Hộp nhạc" : `Hộp nhạc · ${count} bài`;
}

// How a locked song opens: the sections still to finish.
export function unlockHint(position: number, doneSections: number): string {
  const left = sectionsToUnlock(position) - doneSections;
  return `Học xong thêm ${left} phần để mở`;
}

type SongRowProps = {
  song: Song;
  position: number;
  doneSections: number;
  isNew: boolean;
  playing: boolean;
  soundOn: boolean;
  onToggle: () => void;
};

function SongRow({
  song,
  position,
  doneSections,
  isNew,
  playing,
  soundOn,
  onToggle,
}: SongRowProps) {
  const unlocked = position < unlockedCount(doneSections);
  if (!unlocked) {
    return (
      <li
        data-song={song.id}
        data-song-state="locked"
        className="flex min-h-16 items-center gap-3 rounded-lg border-2 border-border bg-muted p-3 text-muted-foreground"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
          <Lock aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold">{song.title}</span>
          <span className="text-caption">
            {unlockHint(position, doneSections)}
          </span>
        </div>
      </li>
    );
  }
  return (
    <li data-song={song.id} data-song-state={playing ? "playing" : "ready"}>
      <button
        type="button"
        disabled={!soundOn}
        aria-pressed={playing}
        aria-label={song.title}
        onClick={onToggle}
        // The song is the sound; no button press on top of it.
        data-own-sound
        className="flex min-h-16 w-full items-center gap-3 rounded-lg border-2 border-border bg-surface p-3 text-left disabled:text-muted-foreground motion-safe:transition-transform motion-safe:active:scale-[0.97]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-concept-violet text-primary-foreground">
          {playing ? (
            <Square aria-hidden className="size-4 fill-current" />
          ) : (
            <Play aria-hidden className="size-5 fill-current" />
          )}
        </span>
        <span className="min-w-0 flex-1 font-semibold">{song.title}</span>
        {isNew && (
          <span className="rounded-full bg-concept-violet px-3 py-0.5 text-caption font-semibold text-primary-foreground">
            Mới
          </span>
        )}
      </button>
    </li>
  );
}

type MusicBoxSheetProps = {
  childId: string;
  doneSections: number;
  // Songs to mark "Mới" (the ones the child has just won).
  newSongIds?: readonly string[];
  onClose: () => void;
};

// The songs the child has won, to play and stop one at a time, and the ones
// still locked with how to open them. Closing the sheet stops the song.
export function MusicBoxSheet({
  childId,
  doneSections,
  newSongIds = [],
  onClose,
}: MusicBoxSheetProps) {
  const { enabled, playingId, toggle } = useMusicPlayer(childId, SONGS);
  return (
    <Sheet label="Hộp nhạc" onClose={onClose}>
      <h2
        data-music-box-title
        className="pr-12 font-heading font-bold text-title md:text-title-lg"
      >
        Hộp nhạc
      </h2>
      <p className="text-muted-foreground">
        Học xong các phần để mở thêm bài nhạc nhé.
      </p>
      {!enabled && (
        <p
          data-music-muted
          className="flex items-center gap-2 rounded-lg bg-retry-soft p-3 text-retry-soft-foreground"
        >
          <VolumeX aria-hidden className="size-6 shrink-0" />
          Bật loa ở góc màn hình để nghe nhạc.
        </p>
      )}
      <ul className="flex flex-col gap-3" data-music-songs>
        {SONGS.map((song, position) => (
          <SongRow
            key={song.id}
            song={song}
            position={position}
            doneSections={doneSections}
            isNew={newSongIds.includes(song.id)}
            playing={playingId === song.id}
            soundOn={enabled}
            onToggle={() => toggle(song)}
          />
        ))}
      </ul>
    </Sheet>
  );
}

// The home chip: opens the music box.
export function MusicBoxChip({
  childId,
  doneSections,
}: {
  childId: string;
  doneSections: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        data-music-box-open
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex min-h-touch items-center gap-3 rounded-3xl bg-concept-violet/10 py-1 pr-5 pl-1.5 font-semibold motion-safe:transition-transform motion-safe:active:scale-[0.97]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
          <Music aria-hidden className="size-6 text-concept-violet" />
        </span>
        {musicBoxCaption(doneSections)}
      </button>
      {open && (
        <MusicBoxSheet
          childId={childId}
          doneSections={doneSections}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// Shown on the section-done screen when finishing the section won songs: a
// reward card with a button to open the music box.
export function MusicReward({
  childId,
  doneSections,
  songs,
}: {
  childId: string;
  doneSections: number;
  songs: readonly Song[];
}) {
  const [open, setOpen] = useState(false);
  if (songs.length === 0) return null;
  return (
    <>
      <div
        data-music-reward
        className="flex w-full max-w-lg flex-col items-center gap-3 rounded-lg bg-concept-violet/10 p-4"
      >
        <p className="font-semibold">
          {songs.length === 1
            ? `Bạn mở được bài nhạc mới: “${songs[0]?.title}”`
            : `Bạn mở được ${songs.length} bài nhạc mới`}
        </p>
        <BigButton variant="secondary" onClick={() => setOpen(true)}>
          <Music aria-hidden className="size-6 text-concept-violet" />
          Mở hộp nhạc
        </BigButton>
      </div>
      {open && (
        <MusicBoxSheet
          childId={childId}
          doneSections={doneSections}
          newSongIds={songs.map((song) => song.id)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
