// The songs a child can play from a sticker's sheet: a random one per press.
// Music is a treat after learning, so it plays only on request there, never
// during exercises.
//
// Adding a song: copy its file into assets/sounds/, add one entry here, run
// `pnpm sounds:build` (it masters the clip, quieter than a voice line, into
// public/sounds/) and commit the result.

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

// A random song other than `lastId`, so pressing again never repeats the one
// just heard (unless it is the only one). `random` is injectable for tests.
export function pickSong(
  songs: readonly Song[],
  lastId: string | null,
  random: () => number = Math.random,
): Song | undefined {
  const pool = songs.length > 1 ? songs.filter((s) => s.id !== lastId) : songs;
  return pool[Math.floor(random() * pool.length)];
}
