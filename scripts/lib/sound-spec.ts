import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  AVATAR_CLIP_IDS,
  BACKGROUND_MUSIC_IDS,
  BUTTON_ID,
  CELEBRATION_IDS,
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
// dying away.
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
  // Background music of the outer screens (`src/music/background-music.ts`):
  // never preloaded as a short clip, but stored by the offline worker.
  background?: true;
  // Keep only the first `clipS` seconds (after the silence is cut), faded
  // out by `fadeOutS`; omitted keeps the whole clip.
  clipS?: number;
  // Where a downloaded clip comes from and under what terms it may be used.
  credit?: { title: string; author?: string; url: string; license: string };
};

export const ASSETS_SOUNDS_DIR = path.join(process.cwd(), "assets", "sounds");

// Songs are quieter than the owl's voice, so they never drown it out or tire
// the ear; iOS ignores a media element's volume, so the loudness is set here.
const MUSIC_LUFS = MASTERING.voiceLufs - 6;

// Background music sits well under the UI sounds (10 LU below a voice line,
// about 30% of its amplitude), so it never covers a tap, the owl or a
// celebration. The tracks are brought to this one loudness so none of them
// stands out in the playlist.
export const BACKGROUND_MUSIC_LUFS = MASTERING.voiceLufs - 10;

// Pixabay Content License: free for any use, no attribution needed
// (https://pixabay.com/service/license-summary/). The page of a clip is named
// by its slug and id, which the downloaded file name carries.
const PIXABAY = (title: string, author: string, slug: string) => ({
  title,
  author,
  url: `https://pixabay.com/sound-effects/${slug}/`,
  license: "Pixabay Content License",
});

const MIXKIT = (title: string, id: number) => ({
  title,
  url: `https://assets.mixkit.co/active_storage/sfx/${id}/${id}.wav`,
  license: "Mixkit Sound Effects Free License",
});

export const FILES: Record<string, FileSpec> = {
  // A correct answer: a short bright chime, as loud as a voice line.
  [JINGLE_ID]: {
    source: "correct-choice.mp3",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.05,
    music: false,
    credit: {
      title: "Correct choice",
      url: "https://pixabay.com/sound-effects/search/correct%20choice/",
      license: "Pixabay Content License",
    },
  },
  // The celebration of a won sticker, one of the two at random; as loud as
  // a voice line, like the finish fanfare.
  [CELEBRATION_IDS[0]]: {
    source:
      "win-peekaboolabcreative-11l-victory_sound_with_t-1749487402950-357606.mp3",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.1,
    music: false,
    credit: PIXABAY(
      "Victory sound",
      "peekaboolabcreative",
      "11l-victory_sound_with_t-1749487402950-357606",
    ),
  },
  [CELEBRATION_IDS[1]]: {
    source: "win-pw23check-winning-218995.mp3",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.2,
    music: false,
    credit: PIXABAY("Winning", "pw23check", "winning-218995"),
  },
  // The background music of the outer screens, played as a shuffled
  // playlist.
  [BACKGROUND_MUSIC_IDS[0]]: {
    source: "bg-grand_project-kids-guitar-logo-470219.mp3",
    lufs: BACKGROUND_MUSIC_LUFS,
    trimSilence: true,
    fadeOutS: 0.4,
    music: false,
    background: true,
    credit: PIXABAY(
      "Kids guitar logo",
      "grand_project",
      "kids-guitar-logo-470219",
    ),
  },
  [BACKGROUND_MUSIC_IDS[1]]: {
    source: "bg-openmindaudio-cartoon-good-vibes-intro-sunny-spark-497372.mp3",
    lufs: BACKGROUND_MUSIC_LUFS,
    trimSilence: true,
    fadeOutS: 0.4,
    music: false,
    background: true,
    credit: PIXABAY(
      "Cartoon good vibes intro (Sunny Spark)",
      "openmindaudio",
      "cartoon-good-vibes-intro-sunny-spark-497372",
    ),
  },
  [BACKGROUND_MUSIC_IDS[2]]: {
    source: "bg-zec53-quirky-funny-positive-whistle-ending-30-sec-481086.mp3",
    lufs: BACKGROUND_MUSIC_LUFS,
    trimSilence: true,
    fadeOutS: 0.4,
    music: false,
    background: true,
    credit: PIXABAY(
      "Quirky funny positive whistle ending",
      "zec53",
      "quirky-funny-positive-whistle-ending-30-sec-481086",
    ),
  },
  // A section is finished: a short, bright fanfare, as loud as the correct
  // jingle.
  [LESSON_END_ID]: {
    source: "lesson-complete.mp3",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0,
    music: false,
  },
  // A wrong answer after the first: a soft buzz, quieter than the voice so
  // it never scolds.
  [WRONG_ID]: {
    source: "answer-wrong.mp3",
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
  // The avatars' recorded sound effects, short and cheerful, brought to the
  // loudness of a voice line. All from Mixkit (free for any use, no
  // attribution needed: https://mixkit.co/license/#sfxFree).
  [AVATAR_CLIP_IDS.cat]: {
    source: "mixkit-cartoon-little-cat-meow.wav",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.1,
    music: false,
    credit: MIXKIT("Cartoon little cat meow", 91),
  },
  [AVATAR_CLIP_IDS.chick]: {
    source: "mixkit-little-bird-calling-chirp.wav",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.1,
    music: false,
    credit: MIXKIT("Little bird calling chirp", 23),
  },
  // The spider hero's web shot.
  [AVATAR_CLIP_IDS.spider]: {
    source: "mixkit-fast-small-sweep-transition.wav",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    fadeOutS: 0.1,
    music: false,
    credit: MIXKIT("Fast small sweep transition", 166),
  },
  // The race car's engine, cut to its first second and a half.
  [AVATAR_CLIP_IDS.racecar]: {
    source: "mixkit-car-engine-start.wav",
    lufs: MASTERING.voiceLufs,
    trimSilence: true,
    clipS: 1.5,
    fadeOutS: 0.25,
    music: false,
    credit: MIXKIT("Car engine start", 1566),
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
