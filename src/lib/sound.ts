// The soft "ting" for a correct answer, synthesised with WebAudio so the app
// ships no audio file and it plays offline.

// Two sine partials a fifth apart (E6 + B6) read as a small bell.
const TING_PARTIALS: readonly (readonly [hz: number, level: number])[] = [
  [1318.5, 1],
  [1975.5, 0.35],
];
const TING_VOLUME = 0.18;
const TING_ATTACK_S = 0.008;
const TING_DECAY_S = 0.6;
// Exponential ramps cannot reach zero.
const SILENT = 0.0001;

const UNLOCK_EVENTS = ["pointerdown", "touchend", "keydown"] as const;

type AudioContextConstructor = new () => AudioContext;

let context: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (context) return context;
  if (typeof window === "undefined") return null;
  // Safari before 14.1 only has the prefixed constructor.
  const Ctor: AudioContextConstructor | undefined =
    window.AudioContext ??
    (window as { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

export function resetAudioForTesting(): void {
  context = null;
}

// iOS Safari keeps audio suspended until it is resumed, and something is
// played, inside a user gesture. Call from a tap handler.
export function unlockAudio(): void {
  const ctx = audioContext();
  if (!ctx) return;
  if (ctx.state !== "running") void ctx.resume();
  const source = ctx.createBufferSource();
  source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  source.connect(ctx.destination);
  source.start(0);
}

// Unlocks audio on the next tap or key press anywhere, so the first "ting"
// is not lost when it comes after an await. Returns the cleanup.
export function installAudioUnlock(): () => void {
  const remove = () => {
    for (const type of UNLOCK_EVENTS)
      window.removeEventListener(type, onGesture, true);
  };
  function onGesture() {
    unlockAudio();
    remove();
  }
  for (const type of UNLOCK_EVENTS)
    window.addEventListener(type, onGesture, true);
  return remove;
}

export function playTing(): void {
  const ctx = audioContext();
  if (!ctx) return;
  if (ctx.state !== "running") void ctx.resume();
  const start = ctx.currentTime;
  const end = start + TING_DECAY_S;
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(SILENT, start);
  envelope.gain.exponentialRampToValueAtTime(
    TING_VOLUME,
    start + TING_ATTACK_S,
  );
  envelope.gain.exponentialRampToValueAtTime(SILENT, end);
  envelope.connect(ctx.destination);
  for (const [hz, level] of TING_PARTIALS) {
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(hz, start);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, start);
    oscillator.connect(gain);
    gain.connect(envelope);
    oscillator.start(start);
    oscillator.stop(end);
  }
}
