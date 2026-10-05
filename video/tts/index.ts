import { geminiEngine } from "./gemini";
import { localEngine } from "./local";
import { omnivoiceEngine } from "./omnivoice";
import type { TtsEngine } from "./types";

// Engines a voice may name (video/voices.ts). `omnivoice` reads new videos
// and an overview narration when Gemini is out of quota; `local` (VieNeu)
// keeps reading the videos whose script.json names it; `gemini` reads the
// lesson overview narrations. Another engine implements `TtsEngine` and is
// added here.
export const TTS_ENGINES = ["local", "omnivoice", "gemini"] as const;
export type TtsEngineName = (typeof TTS_ENGINES)[number];

const ENGINES: Record<TtsEngineName, TtsEngine> = {
  local: localEngine,
  omnivoice: omnivoiceEngine,
  gemini: geminiEngine,
};

export function ttsEngine(name: TtsEngineName): TtsEngine {
  return ENGINES[name];
}
