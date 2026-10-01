// The music box: songs the child unlocks by finishing sections. Music is a
// reward after learning, so it is played only from the music box and the
// section-done screen, never during exercises.
//
// Adding a song: copy its file into assets/sounds/, add one entry here, run
// `pnpm sounds:build` (it masters the clip, quieter than a voice line, into
// public/sounds/) and commit the result. The unlock rule below places it
// after the songs before it.

export type Song = {
  // Also the id of its clip in public/sounds/manifest.json.
  id: string;
  title: string;
  // File name inside assets/sounds/.
  source: string;
};

export const SONGS: readonly Song[] = [
  {
    id: "song-heng-yao-re",
    title: "Điệu nhảy Heng Yao Re",
    source: "heng-yao-re.mp3",
  },
  {
    id: "song-spiderman",
    title: "Nhạc Người Nhện",
    source: "spiderman-meme-song.mp3",
  },
  {
    id: "song-tieng-cuoi",
    title: "Tiếng cười vui nhộn",
    source: "funny-sound-that-will-make-you-to-laugh_1.mp3",
  },
];

// The first song opens when this many sections (of any lesson) are done...
export const FIRST_SONG_AFTER_SECTIONS = 1;
// ...and one more for every this many sections after that. With 3, the three
// songs open at 1, 4 and 7 finished sections: over the first two lessons,
// then the box stays complete.
export const SECTIONS_PER_EXTRA_SONG = 3;

// Finished sections a song needs, by its position in `SONGS`.
export function sectionsToUnlock(position: number): number {
  return FIRST_SONG_AFTER_SECTIONS + position * SECTIONS_PER_EXTRA_SONG;
}

// How many songs `doneSections` finished sections open (the first
// `unlockedCount` of `SONGS`).
export function unlockedCount(doneSections: number): number {
  let count = 0;
  while (count < SONGS.length && doneSections >= sectionsToUnlock(count)) {
    count++;
  }
  return count;
}

// Songs that opened between two counts of finished sections.
export function newlyUnlocked(before: number, after: number): readonly Song[] {
  return SONGS.slice(unlockedCount(before), unlockedCount(after));
}

// Finished sections across all lessons, which is all the unlock rule needs;
// the songs a child has are derived from it, so nothing else is stored.
export function countDoneSections(
  records: readonly { state: string }[],
): number {
  return records.filter((r) => r.state === "done").length;
}
