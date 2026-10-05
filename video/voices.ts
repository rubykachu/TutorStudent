import type { TtsEngineName } from "./tts";

// The narrator voices a lesson may use, in one place. A lesson picks one id
// in `video/projects/<lessonId>/media.json`; its videos are read by the
// voice's video entry for the engine their script.json names (`video` for
// OmniVoice, `earlierVideo` for VieNeu) and its overview narration by its
// `narration` entry (video/lib/lesson-media.ts). All are the same gender.
//
// `preset` is what the engine calls the voice (for OmniVoice, the name of the
// voice cloned from the lesson voice's reference); with the engine it is part of the audio cache
// key and is recorded on each video (`Video.voice.voiceName`) and on each
// narration (`overview.narration.voice`), so changing a preset re-synthesizes
// every lesson that uses it.

export type VoiceGender = "male" | "female";

export type EngineVoice = { engine: TtsEngineName; preset: string };

export type VoiceSpec = {
  gender: VoiceGender;
  // What the voice sounds like, for choosing one per lesson
  // (.claude/skills/lesson-video/SKILL.md).
  character: string;
  // Reads new videos (OmniVoice, on this machine, cloned from
  // video/tts/refs/<voice id>.flac) and keeps the same preset name.
  video: EngineVoice;
  // Reads the videos whose script.json still names VieNeu (`local`): the
  // videos built before OmniVoice keep their cached takes and voice.
  earlierVideo: EngineVoice;
  // Reads the overview narration (Gemini). When Gemini's quota is used up the
  // narration build reads the whole narration with `video` instead, never
  // part of it with each.
  narration: EngineVoice;
};

// The Gemini prebuilt voice that narrates a lesson overview, by gender. Change
// a name here to change the narrator of every lesson of that gender; the
// narrations are then rebuilt with `pnpm narration:build <lesson>`.
export const GEMINI_NARRATORS = {
  male: "Achird",
  female: "Vindemiatrix",
} as const satisfies Record<VoiceGender, string>;

export const VOICES = {
  "hai-dang": {
    gender: "male",
    character: "calm male, northern accent",
    video: { engine: "omnivoice", preset: "Hải Đăng" },
    earlierVideo: { engine: "local", preset: "Hải Đăng" },
    narration: { engine: "gemini", preset: GEMINI_NARRATORS.male },
  },
  "my-duyen": {
    gender: "female",
    character: "warm female, southern accent",
    video: { engine: "omnivoice", preset: "Mỹ Duyên" },
    earlierVideo: { engine: "local", preset: "Mỹ Duyên" },
    narration: { engine: "gemini", preset: GEMINI_NARRATORS.female },
  },
} as const satisfies Record<string, VoiceSpec>;

export type VoiceId = keyof typeof VOICES;
export const VOICE_IDS = Object.keys(VOICES) as [VoiceId, ...VoiceId[]];

export function voiceSpec(id: VoiceId): VoiceSpec {
  return VOICES[id];
}

// Every voice that may read the lesson's videos or narration, current first.
export function videoVoices(spec: VoiceSpec): EngineVoice[] {
  return [spec.video, spec.earlierVideo];
}

// The voice that reads a video whose script.json names `engine`: the engine
// is chosen per video in its script, so a video built with VieNeu stays on
// VieNeu (and on its cached takes) until its script is switched.
export function videoVoice(
  spec: VoiceSpec,
  engine: TtsEngineName,
): EngineVoice | undefined {
  return videoVoices(spec).find((v) => v.engine === engine);
}
