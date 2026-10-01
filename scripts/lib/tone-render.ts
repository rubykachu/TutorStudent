import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { ffmpeg } from "../../video/lib/audio";
import {
  type FileSpec,
  MASTERING,
  type ToneSpec,
  toneExpression,
} from "./sound-spec";

// Measuring, mastering and synthesising the app's tones, shared by `pnpm
// sounds:build` and any script that auditions a tone.

export type Loudness = { lufs: number; peakDb: number };

// EBU R128 loudness and true peak of a file. A clip shorter than the
// meter's 400 ms window is measured looped, which reads the loudness of the
// clip itself.
export function measure(file: string): Loudness {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-stream_loop",
      "7",
      "-i",
      file,
      "-af",
      "ebur128=peak=true",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  const summary = result.stderr.slice(result.stderr.lastIndexOf("Summary:"));
  const lufs = Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]);
  const peakDb = Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
  if (result.status !== 0 || !Number.isFinite(lufs)) {
    throw new Error(`Could not measure ${file}:\n${result.stderr.slice(-800)}`);
  }
  return { lufs, peakDb: Number.isFinite(peakDb) ? peakDb : -70 };
}

// Brings a clip to `lufs` with one fixed gain (no compression or limiting,
// which is what distorts short clips), lowered if the true peak would pass
// MASTERING.truePeakDb, then encodes it in the delivery format and measures
// the delivered file.
export function master(input: string, lufs: number, file: string): Loudness {
  const before = measure(input);
  const gain = Math.min(
    lufs - before.lufs,
    MASTERING.truePeakDb - before.peakDb,
  );
  ffmpeg([
    "-i",
    input,
    "-af",
    `volume=${gain.toFixed(2)}dB`,
    "-ar",
    String(MASTERING.sampleRate),
    "-ac",
    String(MASTERING.channels),
    "-c:a",
    MASTERING.codec,
    "-b:a",
    MASTERING.bitrate,
    "-movflags",
    "+faststart",
    file,
  ]);
  const after = measure(file);
  if (after.peakDb >= MASTERING.maxPeakDb) {
    throw new Error(
      `${file} peaks at ${after.peakDb} dBFS, over ${MASTERING.maxPeakDb}`,
    );
  }
  return {
    lufs: Math.round(after.lufs * 10) / 10,
    peakDb: Math.round(after.peakDb * 10) / 10,
  };
}

const TRIM_SILENCE =
  "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02";

// Prepares an imported clip as a mono wav in `raw`: leading silence cut and a
// fade-out when the spec asks, then masters it into `file`.
export function renderFile(
  spec: FileSpec,
  input: string,
  raw: string,
  file: string,
): Loudness {
  mkdirSync(path.dirname(raw), { recursive: true });
  const filters = [
    ...(spec.trimSilence ? [TRIM_SILENCE] : []),
    // The fade is applied to the reversed clip, so it needs no duration.
    ...(spec.fadeOutS > 0
      ? ["areverse", `afade=t=in:d=${spec.fadeOutS}`, "areverse"]
      : []),
  ];
  ffmpeg([
    "-i",
    input,
    "-ac",
    "1",
    ...(filters.length > 0 ? ["-af", filters.join(",")] : []),
    "-c:a",
    "pcm_s16le",
    raw,
  ]);
  return master(raw, spec.lufs, file);
}

// Synthesises a tone into `raw` (a wav kept for inspection) and masters it
// into `file`.
export function renderTone(
  spec: ToneSpec,
  raw: string,
  file: string,
): Loudness {
  mkdirSync(path.dirname(raw), { recursive: true });
  ffmpeg([
    "-f",
    "lavfi",
    "-i",
    `aevalsrc='${toneExpression(spec)}':s=${MASTERING.sampleRate}:d=${spec.durationS}`,
    "-af",
    `afade=t=out:st=${spec.durationS - spec.fadeOutS}:d=${spec.fadeOutS}`,
    "-c:a",
    "pcm_s16le",
    raw,
  ]);
  return master(raw, spec.lufs, file);
}
