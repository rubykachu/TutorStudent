import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import type { SoundEntry, SoundManifest } from "@/lib/sound-manifest";
import { VOICE_LINES } from "@/mascot/lines";
import { transcribe } from "../video/asr/whisper";
import { VIDEO_DIR } from "../video/config";
import { ffmpeg, probeDuration } from "../video/lib/audio";
import { matchRate } from "../video/lib/text";
import { synthesizeGemini } from "../video/tts/gemini";
import {
  ASSETS_SOUNDS_DIR,
  FILES,
  fileSource,
  MASTERING,
  TONES,
  toneSource,
  VOICE_ENGINE,
  voiceLineSource,
} from "./lib/sound-spec";
import { master, renderFile, renderTone } from "./lib/tone-render";

// Usage: pnpm sounds:build
// Makes the app's own clips into public/sounds/ and records them in
// public/sounds/manifest.json: the tones (taps and the correct-answer
// jingle), synthesised by ffmpeg, the clips imported from assets/sounds/
// (finish, wrong answer, leaving, the music box songs) and every owl voice
// line in
// src/mascot/lines.ts, spoken by VOICE_ENGINE and checked with Whisper. All
// of them are brought to one loudness and encoded in one format (MASTERING
// in scripts/lib/sound-spec.ts). Only clips whose source changed are made
// again; clips of lines that no longer exist are deleted. Synthesised takes
// are cached, so remastering never asks the voice again.

const OUT_DIR = path.join(process.cwd(), "public", "sounds");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
const TAKES_DIR = path.join(VIDEO_DIR, ".cache", "sounds");
// Lines whose transcript is not exact are spoken again, at most this many
// rounds in all; the closest take is kept and flagged.
const MAX_TAKES = 4;

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

// The words as compared with Whisper's transcript: lower case, tone marks
// kept, punctuation and spacing dropped.
function spokenForm(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function lineMatch(text: string, transcript: string): number {
  if (spokenForm(text) === spokenForm(transcript)) return 1;
  return Math.min(0.999, Math.round(matchRate(text, transcript) * 1000) / 1000);
}

type Take = { file: string; transcript: string; match: number };

const TRIM =
  "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02";

// Cuts `from`–`to` seconds of `input`, trims the silence around the words
// and pads MASTERING.voicePadS on both sides.
function cutLine(input: string, from: number, to: number, out: string): void {
  const pad = MASTERING.voicePadS;
  ffmpeg([
    "-i",
    input,
    "-ss",
    from.toFixed(3),
    "-to",
    to.toFixed(3),
    "-af",
    `${TRIM},areverse,${TRIM},areverse,adelay=${pad * 1000},apad=pad_dur=${pad}`,
    "-c:a",
    "pcm_s16le",
    out,
  ]);
}

// Silences in a file, as [start, end] seconds.
function silences(file: string): [number, number][] {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      file,
      "-af",
      "silencedetect=noise=-40dB:d=0.2",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  const starts = [...result.stderr.matchAll(/silence_start: (-?[\d.]+)/g)];
  const ends = [...result.stderr.matchAll(/silence_end: ([\d.]+)/g)];
  return starts.map((m, i) => [
    Math.max(0, Number(m[1])),
    Number(ends[i]?.[1] ?? Number.POSITIVE_INFINITY),
  ]);
}

// Where to cut a take of `count` lines read one after another: in the middle
// of the count - 1 longest pauses inside it. The voice pauses far longer
// between lines than at a comma, and Whisper checks every cut line anyway.
function cutPoints(file: string, count: number): number[] {
  const duration = probeDuration(file);
  const inner = silences(file).filter(
    ([start, end]) => start > 0.05 && end < duration - 0.05,
  );
  return inner
    .sort((a, b) => b[1] - b[0] - (a[1] - a[0]))
    .slice(0, count - 1)
    .map(([start, end]) => (start + end) / 2)
    .sort((a, b) => a - b);
}

// One request speaks every line in `texts`, one per paragraph, so all lines
// share one voice and one delivery and the daily request limit is spent
// once; the take is then cut into one file per line and each is checked
// with Whisper.
async function batchTakes(
  texts: readonly string[],
  round: number,
): Promise<Take[]> {
  const stamp = sha256(JSON.stringify([texts, VOICE_ENGINE])).slice(0, 12);
  const raw = path.join(TAKES_DIR, `batch-${stamp}.take${round}.wav`);
  await synthesizeGemini(VOICE_ENGINE, texts.join("\n\n"), raw);
  const cuts = cutPoints(raw, texts.length);
  if (cuts.length !== texts.length - 1) {
    throw new Error(`Could not find ${texts.length} lines in ${raw}`);
  }
  const bounds = [0, ...cuts, probeDuration(raw)];
  const files = texts.map((_, i) => {
    const out = path.join(TAKES_DIR, `batch-${stamp}.take${round}.${i}.wav`);
    cutLine(raw, bounds[i] as number, bounds[i + 1] as number, out);
    return out;
  });
  const heard = await transcribe(files);
  return texts.map((text, i) => {
    const file = files[i] as string;
    const transcript = heard.get(file)?.text ?? "";
    const match = lineMatch(text, transcript);
    console.log(
      `sounds: "${text}" take ${round}: heard "${transcript}"${match === 1 ? "" : ` (${match})`}`,
    );
    return { file, transcript, match };
  });
}

function takeKey(text: string): string {
  return sha256(JSON.stringify([text, VOICE_ENGINE])).slice(0, 16);
}

// The best take of every line: cached from an earlier run, else spoken and
// checked until it is exact or MAX_TAKES rounds are spent, keeping the
// closest one.
async function voiceTakes(
  texts: readonly string[],
): Promise<Map<string, Take>> {
  mkdirSync(TAKES_DIR, { recursive: true });
  const best = new Map<string, Take>();
  const cached = (text: string) => ({
    wav: path.join(TAKES_DIR, `${takeKey(text)}.wav`),
    json: path.join(TAKES_DIR, `${takeKey(text)}.json`),
  });
  for (const text of texts) {
    const { wav, json } = cached(text);
    if (existsSync(wav) && existsSync(json)) {
      best.set(text, { ...JSON.parse(readFileSync(json, "utf8")), file: wav });
    }
  }
  const fresh = new Set<string>();
  for (let round = 1; round <= MAX_TAKES; round++) {
    const pending = texts.filter((t) => (best.get(t)?.match ?? 0) < 1);
    if (pending.length === 0) break;
    const takes = await batchTakes(pending, round);
    takes.forEach((take, i) => {
      const text = pending[i] as string;
      if (take.match > (best.get(text)?.match ?? -1)) {
        best.set(text, take);
        fresh.add(text);
      }
    });
  }
  for (const text of fresh) {
    const take = best.get(text) as Take;
    const { wav, json } = cached(text);
    copyFileSync(take.file, wav);
    writeFileSync(
      json,
      `${JSON.stringify({ transcript: take.transcript, match: take.match })}\n`,
    );
    best.set(text, { ...take, file: wav });
  }
  return best;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const previous = readManifest();
  const entries: SoundEntry[] = [];

  for (const [id, spec] of Object.entries(TONES)) {
    const hash = sha256(toneSource(spec));
    const file = `${id}.m4a`;
    const old = previous.get(id);
    if (old && upToDate(old, hash)) {
      entries.push(old);
      continue;
    }
    const loudness = renderTone(
      spec,
      path.join(TAKES_DIR, `${id}.wav`),
      path.join(OUT_DIR, file),
    );
    console.log(`sounds: made ${file} (${loudness.lufs} LUFS)`);
    entries.push({ id, file, kind: "tone", sha256: hash, ...loudness });
  }

  for (const [id, spec] of Object.entries(FILES)) {
    const hash = sha256(fileSource(spec));
    const file = `${id}.m4a`;
    const old = previous.get(id);
    if (old && upToDate(old, hash)) {
      entries.push(old);
      continue;
    }
    const loudness = renderFile(
      spec,
      path.join(ASSETS_SOUNDS_DIR, spec.source),
      path.join(TAKES_DIR, `${id}.wav`),
      path.join(OUT_DIR, file),
    );
    console.log(`sounds: made ${file} (${loudness.lufs} LUFS)`);
    entries.push({
      id,
      file,
      kind: "file",
      sha256: hash,
      source: spec.source,
      ...(spec.music ? { music: true as const } : {}),
      ...loudness,
    });
  }

  const flagged: string[] = [];
  const hashOf = (text: string) => sha256(voiceLineSource(text));
  const stale = VOICE_LINES.filter(
    (line) => !upToDate(previous.get(line.id), hashOf(line.text)),
  );
  const takes = await voiceTakes(stale.map((line) => line.text));
  for (const line of VOICE_LINES) {
    const hash = hashOf(line.text);
    const file = `${line.id}.m4a`;
    const take = takes.get(line.text);
    const old = previous.get(line.id);
    if (!take && old) {
      entries.push(old);
      continue;
    }
    if (!take) throw new Error(`No take for "${line.text}"`);
    const loudness = master(
      take.file,
      MASTERING.voiceLufs,
      path.join(OUT_DIR, file),
    );
    console.log(`sounds: made ${file} (${loudness.lufs} LUFS)`);
    if (take.match < 1) flagged.push(file);
    entries.push({
      id: line.id,
      file,
      kind: "voice",
      sha256: hash,
      text: line.text,
      engine: { ...VOICE_ENGINE },
      match: take.match,
      ...loudness,
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
  if (flagged.length > 0) {
    console.warn(
      `sounds: Whisper heard these differently; listen, then delete their takes in ${TAKES_DIR} to try again: ${flagged.join(", ")}`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
