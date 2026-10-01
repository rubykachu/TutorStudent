import type { TtsEngineName } from "./tts";

// The narrator voices a lesson may use, in one place. A lesson picks one id
// in `video/projects/<lessonId>/media.json`; its videos are read by the
// voice's `video` entry and its overview narration by its `narration` entry
// (video/lib/lesson-media.ts). Both are the same gender.
//
// `preset` is what the engine calls the voice; it is part of the audio cache
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
  // Reads every video of the lesson (local VieNeu, on this machine).
  video: EngineVoice;
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
  female: "Sulafat",
} as const satisfies Record<VoiceGender, string>;

export const VOICES = {
  "hai-dang": {
    gender: "male",
    character: "calm male, northern accent",
    video: { engine: "local", preset: "Hải Đăng" },
    narration: { engine: "gemini", preset: GEMINI_NARRATORS.male },
  },
  "my-duyen": {
    gender: "female",
    character: "warm female, southern accent",
    video: { engine: "local", preset: "Mỹ Duyên" },
    narration: { engine: "gemini", preset: GEMINI_NARRATORS.female },
  },
} as const satisfies Record<string, VoiceSpec>;

export type VoiceId = keyof typeof VOICES;
export const VOICE_IDS = Object.keys(VOICES) as [VoiceId, ...VoiceId[]];

export function voiceSpec(id: VoiceId): VoiceSpec {
  return VOICES[id];
}
