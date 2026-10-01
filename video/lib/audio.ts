import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { TEMPO } from "../config";

// Narration audio is mono 16-bit PCM at 48 kHz from synthesis to the final
// mix; ffmpeg does the signal work and Node only lays sentences on a timeline.
export const SAMPLE_RATE = 48_000;

export function ffmpeg(args: readonly string[]): void {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    {
      encoding: "utf8",
    },
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg ${args.join(" ")} failed:\n${result.stderr}`);
  }
}

export function probeDuration(file: string): number {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  const seconds = Number(result.stdout.trim());
  if (result.status !== 0 || !Number.isFinite(seconds)) {
    throw new Error(`ffprobe could not read ${file}:\n${result.stderr}`);
  }
  return seconds;
}

// Trims the silence the voice leaves around a sentence (the timeline adds its
// own pauses) and slows it to `tempo` without changing the pitch.
const TRIM =
  "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04";

export function slowSentence(
  input: string,
  output: string,
  tempo: number = TEMPO,
): void {
  ffmpeg([
    "-i",
    input,
    "-af",
    `${TRIM},areverse,${TRIM},areverse,atempo=${tempo}`,
    "-ac",
    "1",
    "-ar",
    String(SAMPLE_RATE),
    "-c:a",
    "pcm_s16le",
    output,
  ]);
}

// The part of `input` from `from` to `to` seconds, as 16-bit PCM.
export function cutSegment(
  input: string,
  from: number,
  to: number,
  output: string,
): void {
  ffmpeg([
    "-i",
    input,
    "-ss",
    from.toFixed(3),
    "-to",
    to.toFixed(3),
    "-c:a",
    "pcm_s16le",
    output,
  ]);
}

function pcmData(file: string): Int16Array {
  const buffer = readFileSync(file);
  // Walk the RIFF chunks to the "data" chunk; ffmpeg may add a LIST chunk.
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === "data") {
      const bytes = buffer.subarray(offset + 8, offset + 8 + size);
      return new Int16Array(
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length),
      );
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error(`${file} has no PCM data chunk`);
}

function writeWav(file: string, samples: Int16Array): void {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + samples.byteLength, 4);
  header.write("WAVEfmt ", 8, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(samples.byteLength, 40);
  writeFileSync(file, Buffer.concat([header, Buffer.from(samples.buffer)]));
}

// The whole narration: every sentence file placed at its start time, in
// silence, `duration` seconds long.
export function layNarration(
  file: string,
  sentences: readonly { file: string; start: number }[],
  duration: number,
): void {
  const out = new Int16Array(Math.ceil(duration * SAMPLE_RATE));
  for (const sentence of sentences) {
    const pcm = pcmData(sentence.file);
    out.set(
      pcm.subarray(
        0,
        Math.max(0, out.length - Math.round(sentence.start * SAMPLE_RATE)),
      ),
      Math.round(sentence.start * SAMPLE_RATE),
    );
  }
  writeWav(file, out);
}
