import { localEngine } from "./local";
import type { TtsEngine } from "./types";

// Engines a video script may name. `local` is the default and the only one
// so far; another engine implements `TtsEngine` and is added here.
export const TTS_ENGINES = ["local"] as const;
export type TtsEngineName = (typeof TTS_ENGINES)[number];

const ENGINES: Record<TtsEngineName, TtsEngine> = { local: localEngine };

export function ttsEngine(name: TtsEngineName): TtsEngine {
  return ENGINES[name];
}
