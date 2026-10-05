import { readFileSync } from "node:fs";
import path from "node:path";
import {
  OMNI_PYTHON_BIN,
  OMNIVOICE_MODEL,
  OMNIVOICE_REVISION,
  TEMPO,
  VIDEO_DIR,
  VOICE_REFS_DIR,
} from "../config";
import { type PythonWorker, startPythonWorker } from "../lib/python";
import { VOICE_IDS, VOICES } from "../voices";
import type { TtsEngine } from "./types";

// OmniVoice (k2-fsa; code Apache-2.0, weights CC-BY-NC, so non-commercial use
// only) on this machine's GPU through PyTorch MPS in fp16; no network and no
// key. It has no named voices: each lesson voice is cloned from its reference
// recording in VOICE_REFS_DIR (a VieNeu take, Apache-2.0 output), so the
// voices keep their names. The model loads once per build in a worker that
// stays up until `close`.
const WORKER = path.join(VIDEO_DIR, "tts", "omnivoice_worker.py");

// OmniVoice can swallow the last syllable of a sentence that does not end in
// punctuation ("số nguyên dương" heard as "số nguyên dư"), so what it reads
// always ends in a full stop, question or exclamation mark. A trailing comma,
// colon, semicolon or dash becomes a full stop; closing quotes and brackets
// stay after the mark.
export function withFinalPunctuation(text: string): string {
  const match = /^([\s\S]*?)([”"’')\]]*)$/u.exec(text.trim());
  const body = (match?.[1] ?? "").replace(/[\s,;:–—-]+$/u, "");
  const closing = match?.[2] ?? "";
  return /[.!?…]$/u.test(body) ? `${body}${closing}` : `${body}.${closing}`;
}

// The reference a voice is cloned from: the lesson voice whose video voice is
// this OmniVoice preset (video/voices.ts).
function reference(voiceName: string): { audio: string; text: string } {
  const id = VOICE_IDS.find(
    (v) =>
      VOICES[v].video.engine === "omnivoice" &&
      VOICES[v].video.preset === voiceName,
  );
  if (!id) throw new Error(`No OmniVoice voice "${voiceName}" in voices.ts`);
  return {
    audio: path.join(VOICE_REFS_DIR, `${id}.flac`),
    text: readFileSync(path.join(VOICE_REFS_DIR, `${id}.txt`), "utf8").trim(),
  };
}

type Written = { out: string; seconds: number; synthSeconds: number };

let worker: PythonWorker | undefined;

export const omnivoiceEngine: TtsEngine = {
  tempo: TEMPO,
  voice: (voiceName) => ({
    engine: "omnivoice",
    voiceName,
    model: `OmniVoice ${OMNIVOICE_REVISION.slice(0, 7)}`,
  }),
  async synthesize(voiceName, requests) {
    if (requests.length === 0) return;
    const ref = reference(voiceName);
    worker ??= startPythonWorker(WORKER, OMNI_PYTHON_BIN);
    const written = await worker.run<Written>({
      model: OMNIVOICE_MODEL,
      revision: OMNIVOICE_REVISION,
      ref,
      items: requests.map((r) => ({
        text: withFinalPunctuation(r.text),
        out: r.out,
      })),
    });
    const audio = written.reduce((sum, w) => sum + w.seconds, 0);
    const spent = written.reduce((sum, w) => sum + w.synthSeconds, 0);
    console.log(
      `video: OmniVoice read ${written.length} sentence(s), ${audio.toFixed(1)} s of audio in ${spent.toFixed(1)} s (RTF ${(spent / audio).toFixed(2)})`,
    );
  },
  async close() {
    const running = worker;
    worker = undefined;
    await running?.close();
  },
};
