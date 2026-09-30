import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  JINGLE_ID,
  type SoundManifest,
  soundUrl,
  VOICE_LINE_VOICE,
  voiceLineSource,
} from "@/lib/sound-manifest";
import { VOICE_LINES } from "@/mascot/lines";
import manifest from "../../public/sounds/manifest.json";
import { JINGLE } from "../../scripts/lib/jingle";

const sha256 = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const entries = new Map(
  (manifest as SoundManifest).entries.map((e) => [e.id, e]),
);
const onDisk = (file: string) =>
  existsSync(path.join(process.cwd(), "public", "sounds", file));

// A line edited without `pnpm sounds:build` would speak old words; these
// fail until the clips are made again.
describe("sound manifest", () => {
  it("has an up-to-date clip for every voice line", () => {
    for (const line of VOICE_LINES) {
      const entry = entries.get(line.id);
      expect(entry, line.id).toBeDefined();
      expect(entry?.text).toBe(line.text);
      expect(entry?.voice).toBe(VOICE_LINE_VOICE);
      expect(entry?.sha256).toBe(
        sha256(voiceLineSource(line.text, VOICE_LINE_VOICE)),
      );
      expect(onDisk(entry?.file ?? ""), entry?.file).toBe(true);
    }
  });

  it("has the jingle made from the current settings", () => {
    const entry = entries.get(JINGLE_ID);
    expect(entry?.sha256).toBe(sha256(JSON.stringify(JINGLE)));
    expect(onDisk(entry?.file ?? "")).toBe(true);
  });

  it("lists nothing else and gives clips URLs under /sounds", () => {
    expect([...entries.keys()].sort()).toEqual(
      [JINGLE_ID, ...VOICE_LINES.map((l) => l.id)].sort(),
    );
    expect(soundUrl(JINGLE_ID)).toBe("/sounds/correct-jingle.m4a");
    expect(soundUrl("no-such-clip")).toBeUndefined();
  });
});
