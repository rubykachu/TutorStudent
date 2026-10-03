// The background music of the outer screens (home, a subject's lessons, the
// lesson page, the grades and profile pickers): a few short tracks played as
// a shuffled playlist, quiet under the UI sounds, and silent wherever the
// child learns.
//
// One controller per page decides whether music sounds from a handful of
// inputs, each set by a different part of the app:
// - `setEnabled`: the device's music setting and the child's sound switch;
// - `claimOuterScreen`: an outer screen is showing (a learning screen, the
//   parent page and every other page never claim);
// - `unlock`: the first tap, the only moment iOS lets audio start;
// - `setVisible`: the page is in the foreground;
// - `hold("silence")`: narration, a video or a song is playing;
// - `hold("duck")`: a celebration is playing, so the music steps back.
// Music plays when all of them allow it, fading in when it starts and out
// when it must stop, and resumes where it stopped within the session.
//
// The tracks play through Web Audio only (decoded buffers on the app's one
// shared context), never through a media element: iOS then shows no Now
// Playing controls for them.

import { keepAudioAwake, sharedAudioContext } from "@/lib/sound";
import { backgroundMusicUrls } from "@/lib/sound-manifest";

// Seconds.
export const FADE_IN_S = 1;
export const FADE_OUT_S = 0.5;
// The next track starts this long before the one playing ends, while that
// one fades out.
export const CROSSFADE_S = 1.5;
// How far the music steps back while a celebration plays (share of its
// level); its level is set by its loudness in `scripts/lib/sound-spec.ts`.
export const DUCK_LEVEL = 0.3;
export const DUCK_FADE_S = 0.3;
// Leaving an outer screen stops the music only if no outer screen claims it
// again within this long, so moving between two outer screens never dips.
export const OUTER_GRACE_MS = 200;

// One playing copy of a track.
export type MusicVoice = {
  // Length of the track, seconds.
  duration: number;
  // Starts `offsetS` into the track, rising from silence to `level` over
  // `fadeS`.
  start(offsetS: number, level: number, fadeS: number): void;
  // Moves to `level` over `fadeS`.
  setLevel(level: number, fadeS: number): void;
  // Fades out over `fadeS`, then stops for good.
  stop(fadeS: number): void;
  // Seconds into the track.
  position(): number;
  // Called once when the track played to its end (not after `stop`).
  onEnded(listener: () => void): void;
};

// What plays the tracks; the Web Audio one is `webAudioMusicEngine`, tests
// pass a fake.
export type MusicEngine = {
  // A voice for the track at `url`, or null when it cannot be loaded or
  // decoded (offline without the file, no Web Audio).
  load(url: string): Promise<MusicVoice | null>;
  // Keeps the audio hardware awake while music plays; returns the release.
  keepAwake(): () => void;
};

export type HoldKind = "silence" | "duck";

// A new playing order of `ids`, never starting with `lastId` (the track
// heard last), so a track is never played twice in a row across rounds.
// `random` is injectable for tests.
export function shuffledOrder(
  ids: readonly string[],
  lastId: string | null,
  random: () => number = Math.random,
): string[] {
  const order = [...ids];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j] as string, order[i] as string];
  }
  if (order.length > 1 && order[0] === lastId) {
    const swap = 1 + Math.floor(random() * (order.length - 1));
    [order[0], order[swap]] = [order[swap] as string, order[0] as string];
  }
  return order;
}

type Timers = {
  setTimeout: (run: () => void, ms: number) => unknown;
  clearTimeout: (handle: unknown) => void;
};

const realTimers: Timers = {
  setTimeout: (run, ms) => setTimeout(run, ms),
  clearTimeout: (handle) =>
    clearTimeout(handle as ReturnType<typeof setTimeout>),
};

type Current = {
  url: string;
  voice: MusicVoice;
  crossfade: unknown;
  // The playlist round this voice belongs to (a stale load is dropped).
  generation: number;
};

export class BackgroundMusic {
  private enabled = false;
  private outer = 0;
  private unlocked = false;
  private visible = true;
  private readonly holds = new Map<symbol, HoldKind>();
  private order: string[] = [];
  private index = 0;
  private lastUrl: string | null = null;
  // Where the current track stopped, to resume it there.
  private resumeAt = 0;
  private current: Current | null = null;
  private generation = 0;
  private loading = false;
  private release: (() => void) | null = null;
  private graceTimer: unknown;
  // A track that failed to load stops the playlist until an input changes,
  // so an offline device never retries in a loop.
  private failed = false;

  constructor(
    private readonly engine: MusicEngine,
    private readonly urls: () => readonly string[],
    private readonly random: () => number = Math.random,
    private readonly timers: Timers = realTimers,
  ) {}

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    this.failed = false;
    this.update();
  }

  // Marks an outer screen as showing; returns the release, to call when it
  // leaves.
  claimOuterScreen(): () => void {
    this.outer++;
    this.failed = false;
    this.update();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.outer--;
      this.timers.clearTimeout(this.graceTimer);
      this.graceTimer = this.timers.setTimeout(
        () => this.update(),
        OUTER_GRACE_MS,
      );
    };
  }

  // Called from a tap: audio may start from now on.
  unlock(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    this.update();
  }

  setVisible(visible: boolean): void {
    if (this.visible === visible) return;
    this.visible = visible;
    this.update();
  }

  // Silences or ducks the music until the returned release is called.
  hold(kind: HoldKind): () => void {
    const key = Symbol(kind);
    this.holds.set(key, kind);
    this.update();
    return () => {
      if (!this.holds.delete(key)) return;
      this.update();
    };
  }

  isPlaying(): boolean {
    return this.current !== null;
  }

  // The url of the track playing now, if any.
  playingUrl(): string | null {
    return this.current?.url ?? null;
  }

  private shouldPlay(): boolean {
    return (
      this.enabled &&
      this.outer > 0 &&
      this.unlocked &&
      this.visible &&
      !this.failed &&
      ![...this.holds.values()].includes("silence")
    );
  }

  private level(): number {
    return [...this.holds.values()].includes("duck") ? DUCK_LEVEL : 1;
  }

  private update(): void {
    if (!this.shouldPlay()) {
      this.stopCurrent();
      return;
    }
    if (this.current) {
      this.current.voice.setLevel(this.level(), DUCK_FADE_S);
      return;
    }
    if (!this.loading) void this.startTrack(this.resumeAt, FADE_IN_S);
  }

  private nextUrl(): string | null {
    const urls = this.urls();
    if (urls.length === 0) return null;
    if (this.index >= this.order.length) {
      this.order = shuffledOrder(urls, this.lastUrl, this.random);
      this.index = 0;
    }
    return this.order[this.index] ?? null;
  }

  private advance(): void {
    this.index++;
    this.resumeAt = 0;
  }

  private async startTrack(offsetS: number, fadeS: number): Promise<void> {
    const url = this.nextUrl();
    if (!url) return;
    const generation = ++this.generation;
    this.loading = true;
    const voice = await this.engine.load(url);
    this.loading = false;
    if (generation !== this.generation) return;
    if (!voice) {
      this.failed = true;
      return;
    }
    if (!this.shouldPlay() || this.current) {
      // The screen changed while the track was loading.
      this.update();
      return;
    }
    const offset = offsetS < voice.duration - CROSSFADE_S ? offsetS : 0;
    this.lastUrl = url;
    this.release ??= this.engine.keepAwake();
    voice.start(offset, this.level(), fadeS);
    const current: Current = { url, voice, crossfade: undefined, generation };
    this.current = current;
    voice.onEnded(() => {
      if (this.current !== current) return;
      this.current = null;
      this.advance();
      this.update();
    });
    const untilCrossfade = Math.max(0, voice.duration - offset - CROSSFADE_S);
    current.crossfade = this.timers.setTimeout(
      () => this.crossfade(current),
      untilCrossfade * 1000,
    );
  }

  // The playing track fades out while the next one fades in.
  private crossfade(from: Current): void {
    if (this.current !== from) return;
    this.current = null;
    from.voice.stop(CROSSFADE_S);
    this.advance();
    if (this.shouldPlay()) void this.startTrack(0, CROSSFADE_S);
  }

  private stopCurrent(): void {
    // A load in flight is dropped when it lands.
    this.generation++;
    this.loading = false;
    const current = this.current;
    if (current) {
      this.current = null;
      this.timers.clearTimeout(current.crossfade);
      this.resumeAt = current.voice.position();
      current.voice.stop(FADE_OUT_S);
    }
    this.release?.();
    this.release = null;
  }
}

// --- Web Audio engine -------------------------------------------------------

// Decoded tracks kept at once (float PCM, about 5 MB per 30 s): the one
// playing and the next.
const KEEP_DECODED = 2;

// Plays tracks on `context()` (the app's shared context, null until the
// first tap). The compressed bytes of a track are kept once fetched, so a
// track decoded again later is not fetched again.
export function webAudioMusicEngine(
  context: () => AudioContext | null,
  keepAwake: () => () => void,
): MusicEngine {
  const bytes = new Map<string, ArrayBuffer>();
  const decoded = new Map<string, AudioBuffer>();

  async function buffer(ctx: AudioContext, url: string) {
    const known = decoded.get(url);
    if (known) {
      decoded.delete(url);
      decoded.set(url, known);
      return known;
    }
    let data = bytes.get(url);
    if (!data) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      data = await response.arrayBuffer();
      bytes.set(url, data);
    }
    // Decoding detaches the bytes it is given, so it gets a copy.
    const audio = await ctx.decodeAudioData(data.slice(0));
    decoded.set(url, audio);
    while (decoded.size > KEEP_DECODED) {
      const oldest = decoded.keys().next().value as string;
      decoded.delete(oldest);
    }
    return audio;
  }

  return {
    keepAwake,
    async load(url) {
      const ctx = context();
      if (!ctx) return null;
      let audio: AudioBuffer;
      try {
        audio = await buffer(ctx, url);
      } catch {
        return null;
      }
      return audioBufferVoice(ctx, audio);
    },
  };
}

function audioBufferVoice(ctx: AudioContext, audio: AudioBuffer): MusicVoice {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);
  const source = ctx.createBufferSource();
  source.buffer = audio;
  source.connect(gain);
  let startedAt = 0;
  let offset = 0;
  let stopped = false;
  let ended: (() => void) | null = null;

  const ramp = (level: number, fadeS: number) => {
    const now = ctx.currentTime;
    const param = gain.gain;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(level, now + Math.max(0.01, fadeS));
  };

  source.onended = () => {
    source.disconnect();
    gain.disconnect();
    if (!stopped) ended?.();
  };

  return {
    duration: audio.duration,
    start(offsetS, level, fadeS) {
      offset = offsetS;
      startedAt = ctx.currentTime;
      source.start(0, offsetS);
      ramp(level, fadeS);
    },
    setLevel: ramp,
    stop(fadeS) {
      if (stopped) return;
      stopped = true;
      ramp(0, fadeS);
      try {
        source.stop(ctx.currentTime + fadeS + 0.05);
      } catch {
        // Never started.
        source.disconnect();
        gain.disconnect();
      }
    },
    position() {
      return Math.min(audio.duration, offset + ctx.currentTime - startedAt);
    },
    onEnded(listener) {
      ended = listener;
    },
  };
}

// --- The page's one controller ---------------------------------------------

let instance: BackgroundMusic | null = null;

// The page's controller, on the app's shared audio context.
export function backgroundMusic(): BackgroundMusic {
  instance ??= new BackgroundMusic(
    // Wrapped, so the shared context is reached only when music plays.
    webAudioMusicEngine(
      () => sharedAudioContext(),
      () => keepAudioAwake(),
    ),
    backgroundMusicUrls,
  );
  return instance;
}

export function resetBackgroundMusicForTesting(): void {
  instance = null;
}
