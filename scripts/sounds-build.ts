import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  JINGLE_ID,
  type SoundEntry,
  type SoundManifest,
  VOICE_LINE_VOICE,
  voiceLineSource,
} from "@/lib/sound-manifest";
import { VOICE_LINES } from "@/mascot/lines";
import { MATCH_THRESHOLD, RENDER, VIDEO_DIR } from "../video/config";
import { ffmpeg } from "../video/lib/audio";
import { narrate } from "../video/lib/narrate";
import type { VideoScript } from "../video/lib/script";
import { ttsEngine } from "../video/tts";
import { JINGLE, jingleExpression } from "./lib/jingle";

// Usage: pnpm sounds:build
// Makes the app's own clips into public/sounds/ and records them in
// public/sounds/manifest.json: the correct-answer jingle (ffmpeg, from
// scripts/lib/jingle.ts) and every owl voice line in src/mascot/lines.ts,
// spoken by the local TTS voice, checked sentence by sentence with Whisper
// and slowed like lesson narration. Only clips whose source changed are
// made again; clips of lines that no longer exist are deleted.

const OUT_DIR = path.join(process.cwd(), "public", "sounds");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
// Synthesised takes, cached by the pipeline so a rerun reuses them.
const TAKES_DIR = path.join(VIDEO_DIR, ".cache", "sounds");
const AAC_BITRATE = "64k";

const sha256 = (text: string) =>
  createHash("sha256").update(text).digest("hex");

function readManifest(): Map<string, SoundEntry> {
  if (!existsSync(MANIFEST)) return new Map();
  const manifest: SoundManifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  return new Map(manifest.entries.map((e) => [e.id, e]));
}

function upToDate(entry: SoundEntry | undefined, hash: string): boolean {
  return entry?.sha256 === hash && existsSync(path.join(OUT_DIR, entry.file));
}

function buildJingle(file: string): void {
  ffmpeg([
    "-f",
    "lavfi",
    "-i",
    `aevalsrc='${jingleExpression()}':s=${JINGLE.sampleRate}:d=${JINGLE.durationS}`,
    "-af",
    `afade=t=out:st=${JINGLE.durationS - JINGLE.fadeOutS}:d=${JINGLE.fadeOutS}`,
    "-ac",
    "1",
    "-c:a",
    "aac",
    "-b:a",
    AAC_BITRATE,
    "-movflags",
    "+faststart",
    file,
  ]);
}

function encodeVoice(wav: string, file: string): void {
  ffmpeg([
    "-i",
    wav,
    "-af",
    RENDER.loudness,
    "-ar",
    String(JINGLE.sampleRate),
    "-ac",
    "1",
    "-c:a",
    "aac",
    "-b:a",
    AAC_BITRATE,
    "-movflags",
    "+faststart",
    file,
  ]);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const previous = readManifest();
  const entries: SoundEntry[] = [];

  const jingleHash = sha256(JSON.stringify(JINGLE));
  const jingleEntry = {
    id: JINGLE_ID,
    file: `${JINGLE_ID}.m4a`,
    sha256: jingleHash,
  };
  if (!upToDate(previous.get(JINGLE_ID), jingleHash)) {
    buildJingle(path.join(OUT_DIR, jingleEntry.file));
    console.log(`sounds: made ${jingleEntry.file}`);
  }
  entries.push(jingleEntry);

  const lines = VOICE_LINES.map((line) => ({
    ...line,
    hash: sha256(voiceLineSource(line.text, VOICE_LINE_VOICE)),
    file: `${line.id}.m4a`,
  }));
  const stale = lines.filter((l) => !upToDate(previous.get(l.id), l.hash));
  const made = new Map<string, number>();
  if (stale.length > 0) {
    const script: VideoScript = {
      title: "Owl voice lines",
      engine: "local",
      voice: VOICE_LINE_VOICE,
      poster: { scene: stale[0]?.id ?? "", at: 0 },
      scenes: stale.map((l) => ({ id: l.id, sentences: [{ text: l.text }] })),
      clips: [],
    };
    const takes = await narrate(script, ttsEngine("local"), TAKES_DIR);
    takes.forEach((take, i) => {
      const line = stale[i];
      if (!line) return;
      encodeVoice(take.file, path.join(OUT_DIR, line.file));
      made.set(line.id, Math.round(take.matchRate * 1000) / 1000);
      console.log(
        `sounds: made ${line.file}, match ${(take.matchRate * 100).toFixed(1)}% (heard "${take.transcript}")`,
      );
      if (take.matchRate < MATCH_THRESHOLD) {
        console.warn(
          `sounds: listen to ${line.file}; Whisper heard it differently`,
        );
      }
    });
  }
  for (const line of lines) {
    entries.push({
      id: line.id,
      file: line.file,
      sha256: line.hash,
      text: line.text,
      voice: VOICE_LINE_VOICE,
      match: made.get(line.id) ?? previous.get(line.id)?.match,
    });
  }

  const kept = new Set(entries.map((e) => e.id));
  for (const [id, entry] of previous) {
    if (kept.has(id)) continue;
    rmSync(path.join(OUT_DIR, entry.file), { force: true });
    console.log(`sounds: removed ${entry.file}`);
  }
  const manifest: SoundManifest = { entries };
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
