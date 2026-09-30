import manifest from "../../public/sounds/manifest.json";

// The app's own sound clips (the correct-answer jingle and the owl's voice
// lines) live in public/sounds/ with a committed manifest,
// public/sounds/manifest.json, written by `pnpm sounds:build`. Each entry
// records the sha256 of what the clip was made from, so the build remakes
// only clips whose source changed and a test catches a line edited without
// a rebuild.

export type SoundEntry = {
  id: string;
  // File name inside public/sounds/.
  file: string;
  // sha256 hex of `voiceLineSource` (voice lines) or of the jingle's
  // generator settings (scripts/lib/jingle.ts).
  sha256: string;
  text?: string;
  voice?: string;
  // How closely Whisper's transcript of the clip matched `text` (0–1).
  match?: number;
};

export type SoundManifest = { entries: SoundEntry[] };

export const SOUNDS_DIR_URL = "/sounds";
export const JINGLE_ID = "correct-jingle";
// Every voice line is spoken by this voice of the local TTS engine.
export const VOICE_LINE_VOICE = "Hải Đăng";

// What a voice line's hash covers: its words and the voice saying them.
export function voiceLineSource(text: string, voice: string): string {
  return JSON.stringify([text, voice]);
}

const byId = new Map(
  (manifest as SoundManifest).entries.map((entry) => [entry.id, entry]),
);

// URL of a clip by id, or undefined when the manifest has no such clip.
export function soundUrl(id: string): string | undefined {
  const entry = byId.get(id);
  return entry && `${SOUNDS_DIR_URL}/${entry.file}`;
}
