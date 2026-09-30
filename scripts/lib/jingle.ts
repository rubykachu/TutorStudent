// The correct-answer jingle, synthesised by ffmpeg from these numbers: a
// bright rising arpeggio (C6 E6 G6 C7) of soft bell tones, then a quiet
// shimmer on top. Editing a number changes the jingle's hash in
// public/sounds/manifest.json, so `pnpm sounds:build` makes it again.

export const JINGLE = {
  durationS: 0.8,
  sampleRate: 44_100,
  // [frequency Hz, start s]
  notes: [
    [1046.5, 0],
    [1318.5, 0.08],
    [1568, 0.16],
    [2093, 0.24],
  ],
  noteLevel: 0.35,
  // Share of the octave overtone that makes each note ring like a bell.
  overtone: 0.3,
  // Per second; larger dies away faster.
  noteDecay: 7,
  attack: 250,
  // A high tone flickering at `sparkleRateHz`, from `sparkleStartS`.
  sparkleHz: 6272,
  sparkleRateHz: 22,
  sparkleStartS: 0.28,
  sparkleLevel: 0.08,
  sparkleDecay: 6,
  fadeOutS: 0.15,
} as const;

// An ffmpeg `aevalsrc` expression for the jingle's samples.
export function jingleExpression(): string {
  const j = JINGLE;
  const tone = (hz: number, start: number) => {
    const t = `(t-${start})`;
    return `if(gte(t,${start}),${j.noteLevel}*(1-exp(-${j.attack}*${t}))*exp(-${j.noteDecay}*${t})*(sin(2*PI*${hz}*${t})+${j.overtone}*sin(4*PI*${hz}*${t})),0)`;
  };
  const s = `(t-${j.sparkleStartS})`;
  const sparkle = `if(gte(t,${j.sparkleStartS}),${j.sparkleLevel}*exp(-${j.sparkleDecay}*${s})*(0.5+0.5*sin(2*PI*${j.sparkleRateHz}*${s}))*sin(2*PI*${j.sparkleHz}*t),0)`;
  return [...j.notes.map(([hz, start]) => tone(hz, start)), sparkle].join("+");
}
