import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  allSoundUrls,
  BUTTON_ID,
  JINGLE_ID,
  LEAVE_ID,
  LESSON_END_ID,
  type SoundManifest,
  soundUrl,
  TAP_ID,
  WRONG_ID,
} from "@/lib/sound-manifest";
import { VOICE_LINES } from "@/mascot/lines";
import { SONGS } from "@/music/songs";
import manifest from "../../public/sounds/manifest.json";
import {
  FILES,
  fileSource,
  MASTERING,
  TONES,
  toneSource,
  VOICE_ENGINE,
  voiceLineSource,
} from "../../scripts/lib/sound-spec";

const sha256 = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const entries = new Map(
  (manifest as SoundManifest).entries.map((e) => [e.id, e]),
);
const onDisk = (file: string) =>
  existsSync(path.join(process.cwd(), "public", "sounds", file));

// A line edited without `pnpm sounds:build` would speak old words (or the
// bubble would show a line with no voice); these fail until the clips are
// made again.
describe("sound manifest", () => {
  it("has one up-to-date, exactly heard clip for every voice line", () => {
    for (const line of VOICE_LINES) {
      const entry = entries.get(line.id);
      expect(entry, line.id).toBeDefined();
      expect(entry?.kind).toBe("voice");
      expect(entry?.text).toBe(line.text);
      expect(entry?.engine).toEqual(VOICE_ENGINE);
      expect(entry?.sha256).toBe(sha256(voiceLineSource(line.text)));
      expect(entry?.match, line.id).toBe(1);
      expect(onDisk(entry?.file ?? ""), entry?.file).toBe(true);
    }
    expect(new Set(VOICE_LINES.map((l) => l.id)).size).toBe(VOICE_LINES.length);
  });

  it("has every tone made from its current settings", () => {
    expect(Object.keys(TONES).sort()).toEqual(
      [BUTTON_ID, JINGLE_ID, TAP_ID].sort(),
    );
    for (const [id, spec] of Object.entries(TONES)) {
      const entry = entries.get(id);
      expect(entry?.kind).toBe("tone");
      expect(entry?.sha256).toBe(sha256(toneSource(spec)));
      expect(onDisk(entry?.file ?? "")).toBe(true);
    }
  });

  it("has every imported clip made from its current source file and settings", () => {
    expect(Object.keys(FILES).sort()).toEqual(
      [LESSON_END_ID, WRONG_ID, LEAVE_ID, ...SONGS.map((s) => s.id)].sort(),
    );
    for (const [id, spec] of Object.entries(FILES)) {
      const entry = entries.get(id);
      expect(entry?.kind, id).toBe("file");
      expect(entry?.source, id).toBe(spec.source);
      expect(entry?.sha256, id).toBe(sha256(fileSource(spec)));
      expect(onDisk(entry?.file ?? ""), id).toBe(true);
      expect(Boolean(entry?.music), id).toBe(spec.music);
    }
  });

  it("makes every song quieter than a voice line and preloads none", () => {
    for (const song of SONGS) {
      const entry = entries.get(song.id);
      expect(entry?.music, song.id).toBe(true);
      expect(entry?.lufs, song.id).toBeLessThan(MASTERING.voiceLufs - 3);
      expect(allSoundUrls()).not.toContain(soundUrl(song.id));
    }
    expect(allSoundUrls()).toContain(soundUrl(LESSON_END_ID));
  });

  it("keeps every clip at one loudness and clear of clipping", () => {
    for (const entry of entries.values()) {
      expect(entry.peakDb, entry.id).toBeLessThan(MASTERING.maxPeakDb);
      if (entry.kind === "voice") {
        expect(
          Math.abs(entry.lufs - MASTERING.voiceLufs),
          entry.id,
        ).toBeLessThanOrEqual(1.5);
      }
    }
  });

  it("lists nothing else and gives clips URLs under /sounds", () => {
    expect([...entries.keys()].sort()).toEqual(
      [
        ...Object.keys(TONES),
        ...Object.keys(FILES),
        ...VOICE_LINES.map((l) => l.id),
      ].sort(),
    );
    expect(soundUrl(JINGLE_ID)).toBe("/sounds/correct-jingle.m4a");
    expect(soundUrl("no-such-clip")).toBeUndefined();
  });
});
