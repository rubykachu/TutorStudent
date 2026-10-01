import { geminiEngine } from "./gemini";
import { localEngine } from "./local";
import type { TtsEngine } from "./types";

// Engines a voice may name (video/voices.ts). `local` reads the videos;
// `gemini` reads the lesson overview narrations. Another engine implements
// `TtsEngine` and is added here.
export const TTS_ENGINES = ["local", "gemini"] as const;
export type TtsEngineName = (typeof TTS_ENGINES)[number];

const ENGINES: Record<TtsEngineName, TtsEngine> = {
  local: localEngine,
  gemini: geminiEngine,
};

export function ttsEngine(name: TtsEngineName): TtsEngine {
  return ENGINES[name];
}
