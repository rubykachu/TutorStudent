import { spawnSync } from "node:child_process";
import { HYPERFRAMES, RENDER } from "../config";
import { ffmpeg } from "./audio";

// Renders the composition folder to a silent master with HyperFrames
// (headless Chrome seeking the GSAP timeline frame by frame). `--strict`
// fails the render on composition lint errors.
export function renderSite(site: string, output: string): void {
  const result = spawnSync(
    "npx",
    [
      "--yes",
      HYPERFRAMES,
      "render",
      site,
      "-o",
      output,
      "-q",
      "high",
      "-f",
      String(RENDER.fps),
      "--strict",
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0)
    throw new Error(`HyperFrames render failed (${result.status})`);
}

// The delivered file: H.264 720p with the narration as mono AAC, loudness
// normalised, moov atom first so playback starts before the download ends.
export function encodeVideo(
  master: string,
  narration: string,
  output: string,
  duration: number,
): void {
  ffmpeg([
    "-i",
    master,
    "-i",
    narration,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-t",
    String(duration),
    "-vf",
    `scale=${RENDER.width}:${RENDER.height}:flags=lanczos,format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    String(RENDER.crf),
    "-maxrate",
    RENDER.maxrate,
    "-bufsize",
    RENDER.bufsize,
    "-profile:v",
    "high",
    "-level",
    "3.1",
    "-g",
    String(RENDER.gop),
    "-af",
    RENDER.loudness,
    "-c:a",
    "aac",
    "-b:a",
    RENDER.audioBitrate,
    "-ar",
    "48000",
    "-ac",
    "1",
    "-movflags",
    "+faststart",
    output,
  ]);
}

export function extractPoster(video: string, at: number, output: string): void {
  ffmpeg([
    "-ss",
    String(at),
    "-i",
    video,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    output,
  ]);
}
