import path from "node:path";
import { VIDEO_DIR, WHISPER_MODEL } from "../config";
import { runPython } from "../lib/python";

const WORKER = path.join(VIDEO_DIR, "asr", "whisper_worker.py");

export type AsrWord = { word: string; start: number; end: number };
export type Transcript = { file: string; text: string; words: AsrWord[] };

// What each file really says, with the time of every word, by mlx-whisper
// on this machine.
export async function transcribe(
  files: readonly string[],
): Promise<Map<string, Transcript>> {
  if (files.length === 0) return new Map();
  const results = await runPython<Transcript>(WORKER, {
    model: WHISPER_MODEL,
    files,
  });
  return new Map(results.map((r) => [r.file, r]));
}
