import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  BUTTON_ID,
  JINGLE_ID,
  LEAVE_ID,
  LESSON_END_ID,
  TAP_ID,
  WRONG_ID,
} from "@/lib/sound-manifest";
import { SONGS } from "@/music/songs";
import { GEMINI_TTS_MODEL } from "../../video/tts/gemini";

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
  model: GEMINI_TTS_MODEL,
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
  // Per second; larger rises faster (the note reaches full level in about
  // 3 / attack seconds).
  attack: number;
  // Exponent of the rise: 1 starts at full slope, 2 starts flat, so the note
  // swells in without any edge. Default 1.
  attackPower?: number;
  // A pitch glide: each note starts `amount` (a share of its frequency,
  // negative below) away and settles on its pitch at `rate` per second,
  // like a drop landing.
  glide?: { amount: number; rate: number };
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
  // Pressing a button or a link: one round, soft note (D5) that swells in
  // over a few hundredths of a second, lands from a slight pitch glide like
  // a drop, and fades away with no edge. Nearly pure sine, so it stays clearly
  // gentler than the bright wooden click of choosing an answer.
  [BUTTON_ID]: {
    durationS: 0.34,
    notes: [[587.33, 0]],
    noteLevel: 0.45,
    overtone: 0.03,
    noteDecay: 16,
    attack: 70,
    attackPower: 2,
    glide: { amount: -0.1, rate: 30 },
    fadeOutS: 0.12,
    lufs: MASTERING.voiceLufs - 8,
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
};

// A clip made from a file in assets/sounds/ (copied into the repo so a build
// never depends on a download): mixed to mono, its leading silence cut, and
// brought to one loudness like every other clip.
export type FileSpec = {
  // File name inside assets/sounds/.
  source: string;
  // Integrated loudness the clip is brought to.
  lufs: number;
  // Cut the silence before the sound, so it starts the instant it is played.
  trimSilence: boolean;
  // A fade-out that ends the clip without a click; 0 for none.
  fadeOutS: number;
  // Played only when the child asks for it (a song), so never preloaded.
  music: boolean;
};

export const ASSETS_SOUNDS_DIR = path.join(process.cwd(), "assets", "sounds");

// Songs are quieter than the owl's voice, so they never drown it out or tire
// the ear; iOS ignores a media element's volume, so the loudness is set here.
const MUSIC_LUFS = MASTERING.voiceLufs - 6;

export const FILES: Record<string, FileSpec> = {
  // A section is finished: a short, bright fanfare, as loud as the correct
  // jingle.
  [LESSON_END_ID]: {
    source: "duolingo-end-of-lesson.mp3",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0,
    music: false,
  },
  // A wrong answer after the first: a soft buzz, quieter than the voice so
  // it never scolds.
  [WRONG_ID]: {
    source: "duolingo-incorrect.mp3",
    lufs: MASTERING.voiceLufs - 4,
    trimSilence: true,
    fadeOutS: 0,
    music: false,
  },
  // Leaving a section or review.
  [LEAVE_ID]: {
    source: "bye-bye-soundbible.mp3",
    lufs: MASTERING.voiceLufs - 2,
    trimSilence: true,
    fadeOutS: 0,
    music: false,
  },
  ...Object.fromEntries(
    SONGS.map((song) => [
      song.id,
      {
        source: song.source,
        lufs: MUSIC_LUFS,
        trimSilence: true,
        fadeOutS: 0.4,
        music: true,
      } satisfies FileSpec,
    ]),
  ),
};

// An ffmpeg `aevalsrc` expression for a tone's samples.
export function toneExpression(spec: ToneSpec): string {
  const tone = (hz: number, start: number) => {
    const t = `(t-${start})`;
    const g = spec.glide;
    // Elapsed time as the oscillator sees it: the integral of the gliding
    // frequency, divided by the note's frequency.
    const phase = g
      ? `(${t}+${g.amount}*(1-exp(-${g.rate}*${t}))/${g.rate})`
      : t;
    const rise = `(1-exp(-${spec.attack}*${t}))`;
    const swell = spec.attackPower ? `pow(${rise},${spec.attackPower})` : rise;
    return `if(gte(t,${start}),${spec.noteLevel}*${swell}*exp(-${spec.noteDecay}*${t})*(sin(2*PI*${hz}*${phase})+${spec.overtone}*sin(4*PI*${hz}*${phase})),0)`;
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

// What an imported clip's manifest hash covers: its settings and the bytes of
// its source file.
export function fileSource(spec: FileSpec): string {
  const bytes = readFileSync(path.join(ASSETS_SOUNDS_DIR, spec.source));
  return JSON.stringify([
    spec,
    createHash("sha256").update(bytes).digest("hex"),
    MASTERING,
  ]);
}
