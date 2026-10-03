import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVATARS, type AvatarId } from "@/components/avatar";
import {
  AVATAR_CLIP_IDS,
  allSoundUrls,
  BACKGROUND_MUSIC_IDS,
  BUTTON_ID,
  backgroundMusicUrls,
  CELEBRATION_IDS,
  JINGLE_ID,
  LEAVE_ID,
  LESSON_END_ID,
  offlineSoundUrls,
  pickCelebration,
  type SoundManifest,
  soundUrl,
  TAP_ID,
  WRONG_ID,
} from "@/lib/sound-manifest";
import { VOICE_LINES } from "@/mascot/lines";
import { SONGS } from "@/music/songs";
import manifest from "../../public/sounds/manifest.json";
import {
  BACKGROUND_MUSIC_LUFS,
  FILES,
  fileSource,
  MASTERING,
  TONES,
  toneSource,
  VOICE_ENGINE,
  voiceLineSource,
} from "../../scripts/lib/sound-spec";

// The avatars whose sound is a recorded effect; the others are spoken lines.
const RECORDED_AVATARS: AvatarId[] = ["cat", "chick", "spider", "racecar"];

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
    expect(Object.keys(TONES).sort()).toEqual([BUTTON_ID, TAP_ID].sort());
    for (const [id, spec] of Object.entries(TONES)) {
      const entry = entries.get(id);
      expect(entry?.kind).toBe("tone");
      expect(entry?.sha256).toBe(sha256(toneSource(spec)));
      expect(onDisk(entry?.file ?? "")).toBe(true);
    }
  });

  it("has every imported clip made from its current source file and settings", () => {
    expect(Object.keys(FILES).sort()).toEqual(
      [
        JINGLE_ID,
        LESSON_END_ID,
        WRONG_ID,
        LEAVE_ID,
        ...CELEBRATION_IDS,
        ...BACKGROUND_MUSIC_IDS,
        ...RECORDED_AVATARS.map((id) => AVATAR_CLIP_IDS[id]),
        ...SONGS.map((s) => s.id),
      ].sort(),
    );
    for (const [id, spec] of Object.entries(FILES)) {
      const entry = entries.get(id);
      expect(entry?.kind, id).toBe("file");
      expect(entry?.source, id).toBe(spec.source);
      expect(entry?.sha256, id).toBe(sha256(fileSource(spec)));
      expect(onDisk(entry?.file ?? ""), id).toBe(true);
      expect(Boolean(entry?.music), id).toBe(spec.music);
      expect(Boolean(entry?.background), id).toBe(Boolean(spec.background));
    }
  });

  it("makes the correct answer from the downloaded chime, as loud as a voice line", () => {
    const entry = entries.get(JINGLE_ID);
    expect(entry?.kind).toBe("file");
    expect(entry?.source).toBe("correct-choice.mp3");
    expect(Math.abs((entry?.lufs ?? 0) - MASTERING.voiceLufs)).toBeLessThan(1);
    expect(allSoundUrls().slice(0, 3)).toContain(soundUrl(JINGLE_ID));
  });

  it("plays the background music at one quiet loudness, never preloaded but stored offline", () => {
    for (const id of BACKGROUND_MUSIC_IDS) {
      const entry = entries.get(id);
      expect(entry?.background, id).toBe(true);
      expect(entry?.music, id).toBeUndefined();
      expect(
        Math.abs((entry?.lufs ?? 0) - BACKGROUND_MUSIC_LUFS),
        id,
      ).toBeLessThanOrEqual(1);
      expect(allSoundUrls()).not.toContain(soundUrl(id));
      expect(offlineSoundUrls()).toContain(soundUrl(id));
    }
    // 25-35% of the UI sounds' amplitude.
    const share = 10 ** ((BACKGROUND_MUSIC_LUFS - MASTERING.voiceLufs) / 20);
    expect(share).toBeGreaterThanOrEqual(0.25);
    expect(share).toBeLessThanOrEqual(0.35);
    expect(backgroundMusicUrls()).toEqual(
      BACKGROUND_MUSIC_IDS.map((id) => soundUrl(id)),
    );
  });

  it("celebrates with one of the two win clips, preloaded like every short clip", () => {
    expect(pickCelebration(() => 0)).toBe(CELEBRATION_IDS[0]);
    expect(pickCelebration(() => 0.999)).toBe(CELEBRATION_IDS[1]);
    for (const id of CELEBRATION_IDS) {
      expect(entries.get(id)?.kind, id).toBe("file");
      expect(allSoundUrls()).toContain(soundUrl(id));
    }
  });

  it("names the source and licence of every downloaded clip", () => {
    for (const id of [JINGLE_ID, ...CELEBRATION_IDS, ...BACKGROUND_MUSIC_IDS]) {
      const credit = FILES[id]?.credit;
      expect(credit?.url, id).toMatch(/^https:\/\/pixabay\.com\//);
      expect(credit?.license, id).toBe("Pixabay Content License");
    }
  });

  it("makes every song quieter than a voice line and preloads none", () => {
    for (const song of SONGS) {
      const entry = entries.get(song.id);
      expect(entry?.music, song.id).toBe(true);
      expect(entry?.lufs, song.id).toBeLessThan(MASTERING.voiceLufs - 3);
      expect(allSoundUrls()).not.toContain(soundUrl(song.id));
      expect(offlineSoundUrls()).not.toContain(soundUrl(song.id));
    }
    expect(allSoundUrls()).toContain(soundUrl(LESSON_END_ID));
  });

  it("lists the tap and the button press first, so they decode first", () => {
    expect(allSoundUrls().slice(0, 2)).toEqual([
      soundUrl(TAP_ID),
      soundUrl(BUTTON_ID),
    ]);
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

  it("gives every avatar its own clip, short and credited when downloaded", () => {
    const ids = AVATARS.map((a) => AVATAR_CLIP_IDS[a.id]);
    expect(new Set(ids).size).toBe(AVATARS.length);
    expect(Object.keys(AVATAR_CLIP_IDS).sort()).toEqual(
      AVATARS.map((a) => a.id).sort(),
    );
    for (const avatar of AVATARS) {
      const id = AVATAR_CLIP_IDS[avatar.id];
      const entry = entries.get(id);
      expect(entry, id).toBeDefined();
      expect(onDisk(entry?.file ?? ""), id).toBe(true);
      expect(allSoundUrls(), id).toContain(soundUrl(id));
      const recorded = RECORDED_AVATARS.includes(avatar.id);
      expect(entry?.kind, id).toBe(recorded ? "file" : "voice");
      if (recorded) {
        const credit = FILES[id]?.credit;
        expect(credit?.url, id).toMatch(/^https:\/\//);
        expect(credit?.license, id).toBeTruthy();
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
    expect(soundUrl(JINGLE_ID)).toMatch(
      /^\/sounds\/correct-jingle\.m4a\?v=[0-9a-f]{12}$/,
    );
    // The URL carries the clip's hash, so a year of caching never serves an
    // outdated clip.
    expect(soundUrl(JINGLE_ID)).toContain(
      entries.get(JINGLE_ID)?.sha256.slice(0, 12),
    );
    expect(soundUrl("no-such-clip")).toBeUndefined();
  });
});
