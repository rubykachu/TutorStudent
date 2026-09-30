import { JINGLE_ID, OOPS_ID, TAP_ID } from "@/lib/sound-manifest";

// Everything `pnpm sounds:build` makes its clips from, in one place. A clip's
// manifest hash covers the settings that shape it, so editing a number here
// remakes exactly the clips it changes.

// Every clip leaves the build in this one format and at this loudness, so no
// clip sounds louder, duller or clipped next to another.
export const MASTERING = {
  sampleRate: 44_100,
  channels: 1,
  codec: "aac",
  bitrate: "96k",
  // Integrated loudness (EBU R128) of a voice line.
  voiceLufs: -16,
  // Highest true peak allowed before encoding; the encoded file must stay
  // under `maxPeakDb`.
  truePeakDb: -2,
  maxPeakDb: -1,
  // Silence kept before and after a voice line once its own is trimmed.
  voicePadS: 0.05,
} as const;

// The voice of every owl line: Gemini text-to-speech, a warm voice at a calm
// pace of its own. It replaced the local VieNeu voice, whose lines had to be
// slowed by time-stretching and some of which sounded distorted. All lines
// are spoken in one request, one per paragraph, so they share one delivery.
// The text is sent alone: a style instruction in the prompt gets read aloud.
export const VOICE_ENGINE = {
  name: "gemini",
  model: "gemini-3.1-flash-tts-preview",
  voice: "Sulafat",
} as const;

export type VoiceEngine = typeof VOICE_ENGINE;

// A tone synthesised by ffmpeg: soft bell notes, each rising quickly and
// dying away, plus an optional high flicker on top.
export type ToneSpec = {
  durationS: number;
  // [frequency Hz, start s]
  notes: readonly (readonly [number, number])[];
  noteLevel: number;
  // Share of the octave overtone that makes each note ring like a bell.
  overtone: number;
  // Per second; larger dies away faster.
  noteDecay: number;
  attack: number;
  sparkle?: {
    hz: number;
    rateHz: number;
    startS: number;
    level: number;
    decay: number;
  };
  fadeOutS: number;
  // Integrated loudness the tone is brought to.
  lufs: number;
};

export const TONES: Record<string, ToneSpec> = {
  // Choosing an option, chip or region: one short, soft wooden click (a
  // mid note that dies away in a few hundredths of a second), quieter than
  // the voice so a run of taps never tires the ear.
  [TAP_ID]: {
    durationS: 0.12,
    notes: [[880, 0]],
    noteLevel: 0.5,
    overtone: 0.5,
    noteDecay: 55,
    attack: 1500,
    fadeOutS: 0.04,
    lufs: MASTERING.voiceLufs - 6,
  },
  // A correct answer: a bright rising arpeggio (C6 E6 G6 C7), then a quiet
  // shimmer.
  [JINGLE_ID]: {
    durationS: 0.8,
    notes: [
      [1046.5, 0],
      [1318.5, 0.08],
      [1568, 0.16],
      [2093, 0.24],
    ],
    noteLevel: 0.35,
    overtone: 0.3,
    noteDecay: 7,
    attack: 250,
    sparkle: { hz: 6272, rateHz: 22, startS: 0.28, level: 0.08, decay: 6 },
    fadeOutS: 0.15,
    lufs: MASTERING.voiceLufs,
  },
  // A wrong answer after the first: two low, round notes falling a minor
  // third (G4 E4), quieter than the voice so it never scolds.
  [OOPS_ID]: {
    durationS: 0.45,
    notes: [
      [392, 0],
      [329.6, 0.13],
    ],
    noteLevel: 0.35,
    overtone: 0.12,
    noteDecay: 9,
    attack: 120,
    fadeOutS: 0.1,
    lufs: MASTERING.voiceLufs - 4,
  },
};

// An ffmpeg `aevalsrc` expression for a tone's samples.
export function toneExpression(spec: ToneSpec): string {
  const tone = (hz: number, start: number) => {
    const t = `(t-${start})`;
    return `if(gte(t,${start}),${spec.noteLevel}*(1-exp(-${spec.attack}*${t}))*exp(-${spec.noteDecay}*${t})*(sin(2*PI*${hz}*${t})+${spec.overtone}*sin(4*PI*${hz}*${t})),0)`;
  };
  const parts = spec.notes.map(([hz, start]) => tone(hz, start));
  const s = spec.sparkle;
  if (s) {
    const t = `(t-${s.startS})`;
    parts.push(
      `if(gte(t,${s.startS}),${s.level}*exp(-${s.decay}*${t})*(0.5+0.5*sin(2*PI*${s.rateHz}*${t}))*sin(2*PI*${s.hz}*t),0)`,
    );
  }
  return parts.join("+");
}

// What a clip's manifest hash covers.
export function toneSource(spec: ToneSpec): string {
  return JSON.stringify([spec, MASTERING]);
}

export function voiceLineSource(text: string): string {
  return JSON.stringify([text, VOICE_ENGINE, MASTERING]);
}
