import type { TtsEngineName } from "./tts";

// The narrator voices a lesson may use, in one place. A lesson picks one id
// in `video/projects/<lessonId>/media.json` and its overview narration and
// every video are read in that voice (video/lib/lesson-media.ts).
//
// `preset` is what the engine calls the voice; it is part of the audio cache
// key and is recorded on each video (`Video.voice.voiceName`), so changing a
// preset re-synthesizes every lesson that uses it.

export type VoiceGender = "male" | "female";

export type VoiceSpec = {
  engine: TtsEngineName;
  preset: string;
  gender: VoiceGender;
  // What the voice sounds like, for choosing one per lesson
  // (.claude/skills/lesson-video/SKILL.md).
  character: string;
};

export const VOICES = {
  "hai-dang": {
    engine: "local",
    preset: "Hải Đăng",
    gender: "male",
    character: "calm male, northern accent",
  },
  "my-duyen": {
    engine: "local",
    preset: "Mỹ Duyên",
    gender: "female",
    character: "warm female, southern accent",
  },
} as const satisfies Record<string, VoiceSpec>;

export type VoiceId = keyof typeof VOICES;
export const VOICE_IDS = Object.keys(VOICES) as [VoiceId, ...VoiceId[]];

export function voiceSpec(id: VoiceId): VoiceSpec {
  return VOICES[id];
}
