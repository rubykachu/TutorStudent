// A text-to-speech engine the video pipeline can narrate with. Every video
// records the one voice it used (`Video.voice` in lesson.json).

export type VoiceInfo = { engine: string; voiceName: string; model: string };

export type SynthesisRequest = {
  text: string;
  // Absolute path of the WAV file to write.
  out: string;
};

export interface TtsEngine {
  voice(voiceName: string): VoiceInfo;
  // Writes one WAV file per request. Synthesis samples, so asking again for
  // a sentence that failed the transcript check gives a different take.
  synthesize(
    voiceName: string,
    requests: readonly SynthesisRequest[],
  ): Promise<void>;
}
