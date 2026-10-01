// A text-to-speech engine the video pipeline can narrate with. Every video
// records the one voice it used (`Video.voice` in lesson.json).

export type VoiceInfo = { engine: string; voiceName: string; model: string };

export type SynthesisRequest = {
  text: string;
  // Absolute path of the WAV file to write.
  out: string;
};

export interface TtsEngine {
  // Share of the voice's own speed the narration is slowed to, for a grade-6
  // child who needs time to follow.
  tempo: number;
  // The engine can speak a whole narration in one request; the narration
  // build then cuts it into sentences (video/lib/narrate.ts).
  speaksWhole?: true;
  voice(voiceName: string): VoiceInfo;
  // Writes one WAV file per request. Synthesis samples, so asking again for
  // a sentence that failed the transcript check gives a different take.
  synthesize(
    voiceName: string,
    requests: readonly SynthesisRequest[],
  ): Promise<void>;
}
