import path from "node:path";
import { TTS_TEMPERATURE, VIDEO_DIR } from "../config";
import { runPython } from "../lib/python";
import type { TtsEngine } from "./types";

// VieNeu-TTS v3 Turbo (Apache-2.0), on this machine's CPU through ONNX
// Runtime; no network and no key. Voices are the model's presets, e.g.
// "Hải Đăng".
const WORKER = path.join(VIDEO_DIR, "tts", "vieneu_worker.py");

export const localEngine: TtsEngine = {
  voice: (voiceName) => ({
    engine: "local",
    voiceName,
    model: "VieNeu-TTS v3 Turbo",
  }),
  async synthesize(voiceName, requests) {
    if (requests.length === 0) return;
    await runPython(WORKER, {
      voice: voiceName,
      items: requests.map((r) => ({ ...r, temperature: TTS_TEMPERATURE })),
    });
  },
};
