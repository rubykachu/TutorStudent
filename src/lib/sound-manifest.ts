import type { AvatarId } from "@/components/avatar";
import manifest from "../../public/sounds/manifest.json";

// The app's own sound clips (tones, imported clips and the owl's voice lines)
// live in public/sounds/ with a committed
// manifest, public/sounds/manifest.json, written by `pnpm sounds:build`
// from scripts/lib/sound-spec.ts. There is one clip per id, used everywhere
// the line is said. Each entry records the sha256 of what the clip was made
// from, so the build remakes only clips whose source changed and a test
// catches a line edited without a rebuild.

export type SoundEntry = {
  id: string;
  // File name inside public/sounds/.
  file: string;
  kind: "tone" | "voice" | "file";
  // sha256 hex of the clip's source (`toneSource` / `voiceLineSource` /
  // `fileSource`).
  sha256: string;
  // Voice lines: the words, and the text-to-speech engine that spoke them.
  text?: string;
  engine?: { name: string; model: string; voice: string };
  // Voice lines: 1 when Whisper's transcript of the clip equals `text`
  // (case and punctuation aside, tone marks included), else how close it
  // came (0–1).
  match?: number;
  // Imported clips: the file in assets/sounds/ it was made from, and whether
  // it is music (played only on request, so never preloaded).
  source?: string;
  music?: true;
  // Imported clips: background music of the outer screens (played by
  // `src/music/background-music.ts`, never preloaded, stored offline).
  background?: true;
  // Measured on the delivered file: integrated loudness (LUFS) and true
  // peak (dBFS).
  lufs: number;
  peakDb: number;
};

export type SoundManifest = { entries: SoundEntry[] };

export const SOUNDS_DIR_URL = "/sounds";
// A correct answer.
export const JINGLE_ID = "correct-jingle";
// The click of choosing an option, chip or region.
export const TAP_ID = "tap";
// The press of a button or a link that leads somewhere ("Kiểm tra",
// "Quay lại", a subject tile): softer and rounder than the choice click.
export const BUTTON_ID = "button";
// A wrong answer after the first one of an attempt.
export const WRONG_ID = "wrong-answer";
// A section is finished, and the first part of the sticker celebration.
export const LESSON_END_ID = "lesson-end";
// Leaving a section or review with the "×" control.
export const LEAVE_ID = "leave";
// The celebration of a won sticker: one of these at random each time
// (`pickCelebration`).
export const CELEBRATION_IDS = ["win-victory", "win-winning"] as const;
// The background music of the outer screens, played as a shuffled playlist.
export const BACKGROUND_MUSIC_IDS = [
  "bg-kids-guitar",
  "bg-sunny-spark",
  "bg-whistle",
] as const;

// A random celebration clip id. `random` is injectable for tests.
export function pickCelebration(random: () => number = Math.random): string {
  const index = Math.min(
    CELEBRATION_IDS.length - 1,
    Math.floor(random() * CELEBRATION_IDS.length),
  );
  return CELEBRATION_IDS[index] as string;
}

export function isCelebration(id: string): boolean {
  return (CELEBRATION_IDS as readonly string[]).includes(id);
}

// The clip of each profile avatar, played when the child picks the avatar and
// when they tap it on the home screen: the one place that maps an avatar id
// to a clip id. A clip is defined where it is made: a recorded effect in
// `FILES` and a spoken onomatopoeia in `AVATAR_LINES`
// (scripts/lib/sound-spec.ts, src/mascot/lines.ts).
export const AVATAR_CLIP_IDS = {
  cat: "avatar-cat",
  bear: "avatar-bear",
  rabbit: "avatar-rabbit",
  fox: "avatar-fox",
  panda: "avatar-panda",
  chick: "avatar-chick",
  spider: "avatar-spider",
  racecar: "avatar-racecar",
} as const satisfies Record<AvatarId, string>;

const byId = new Map(
  (manifest as SoundManifest).entries.map((entry) => [entry.id, entry]),
);

function clipUrl(entry: SoundEntry): string {
  // The clip's hash in the query makes the URL change with the clip, which
  // is what lets `/sounds/*` be cached for a year (`next.config.ts`).
  return `${SOUNDS_DIR_URL}/${entry.file}?v=${entry.sha256.slice(0, 12)}`;
}

// URL of a clip by id, or undefined when the manifest has no such clip.
export function soundUrl(id: string): string | undefined {
  const entry = byId.get(id);
  return entry && clipUrl(entry);
}

// The clips a tap makes sound with, decoded first so the first taps of a
// session find them ready.
const FIRST_IDS = [TAP_ID, BUTTON_ID, JINGLE_ID, LEAVE_ID];

// Every clip played in answer to what the child does, for preloading, the
// most used first. Music is left out: a song is fetched when the child asks
// for it, and background music is decoded by its own player.
export function allSoundUrls(): string[] {
  const entries = [...byId.values()].filter(
    (entry) => !entry.music && !entry.background,
  );
  const rank = (entry: SoundEntry) => {
    const first = FIRST_IDS.indexOf(entry.id);
    return first < 0 ? FIRST_IDS.length : first;
  };
  return entries.sort((a, b) => rank(a) - rank(b)).map(clipUrl);
}

// The background music tracks, in `BACKGROUND_MUSIC_IDS` order; a track
// missing from the manifest is left out.
export function backgroundMusicUrls(): string[] {
  return BACKGROUND_MUSIC_IDS.flatMap((id) => soundUrl(id) ?? []);
}

// Every clip the offline worker stores: the short clips and the background
// music, never the songs.
export function offlineSoundUrls(): string[] {
  return [...allSoundUrls(), ...backgroundMusicUrls()];
}
