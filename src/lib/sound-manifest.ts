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
  // Imported clips: the file in assets/sounds/ it was made from.
  source?: string;
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

const byId = new Map(
  (manifest as SoundManifest).entries.map((entry) => [entry.id, entry]),
);

// URL of a clip by id, or undefined when the manifest has no such clip.
export function soundUrl(id: string): string | undefined {
  const entry = byId.get(id);
  return entry && `${SOUNDS_DIR_URL}/${entry.file}`;
}

// Every clip, for preloading.
export function allSoundUrls(): string[] {
  return [...byId.values()].map((entry) => `${SOUNDS_DIR_URL}/${entry.file}`);
}
