// The app's sound clips. Short clips (the tap, the button press, the correct
// jingle, the owl's voice lines) are fetched and decoded once into
// AudioBuffers and played through one shared AudioContext, fire and forget:
// starting a buffer costs a few microseconds on the main thread, where seeking
// and playing a media element on iPhone takes tens of milliseconds and stalls
// the tap that asked for it. Long clips (the songs) go through one reused
// media element, loaded from memory so they start at once.
//
// Nothing here ever makes a caller wait: `play*` return a promise that
// resolves when the clip has ended, was stopped or cannot play, and callers
// that act on a tap simply do not await it. A clip that fails to load or play
// is skipped without an error.

const UNLOCK_EVENTS = ["pointerdown", "touchend", "keydown"] as const;

// Decoded audio is float32 PCM (4 bytes a sample): decoding stops at this
// much, and a clip past it plays through the media element instead.
export const MAX_DECODED_BYTES = 16 * 1024 * 1024;
// Clips fetched and decoded at once, so decoding never crowds out a tap.
const DECODE_CONCURRENCY = 2;
// A sound asked for while the context was suspended or its clip was still
// decoding is dropped after this long: a tap sound that arrives late is worse
// than none.
const STALE_MS = 1500;
// With nothing sounding (no clip and no background music) for this long, the
// shared context is suspended so the audio hardware sleeps; the next tap
// resumes it.
export const IDLE_SUSPEND_MS = 15_000;
// A silent clip that unlocks the shared media element inside the first tap.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

const noop = () => undefined;

// What stops a clip that is playing; calling it ends the clip's promise.
type Playback = { stop: () => void };

let context: AudioContext | null = null;
// Urls declared short (`preloadSounds`): decoded, never streamed.
const shortUrls = new Set<string>();
const pending: string[] = [];
const buffers = new Map<string, AudioBuffer>();
const decoding = new Map<string, Promise<void>>();
// Clips that could not be fetched or decoded, or did not fit under the cap.
const unbuffered = new Set<string>();
let decodedBytes = 0;
let primed = false;

const active = new Set<Playback>();
// The sequence playing now; a newer one stops it.
let sequence = 0;

let element: HTMLAudioElement | null = null;
// The playback that owns the shared media element, if any.
let elementEnd: (() => void) | null = null;
let elementSrc = "";
let elementUnlocked = false;
// Long clips held in memory as compressed blobs, by url.
const blobs = new Map<string, string>();
const blobsLoading = new Set<string>();

let song: Playback | null = null;

// Holders that keep the context running while silent of clips (the
// background music while it plays).
let awake = 0;
let idleTimer: ReturnType<typeof setTimeout> | undefined;

// Safari 17+ lets a page pick an audio session; "playback" keeps sound on
// when the ringer switch is on silent, for the media element and Web Audio.
function setPlaybackSession(): void {
  const session = (navigator as { audioSession?: { type: string } })
    .audioSession;
  if (session) session.type = "playback";
}

function audioContext(): AudioContext | null {
  if (context) return context;
  if (typeof window === "undefined") return null;
  const Context =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Context) return null;
  try {
    context = new Context({ latencyHint: "interactive" });
  } catch {
    return null;
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  return context;
}

// A page in the background plays nothing and holds no audio hardware: every
// clip stops and the context suspends. The next tap resumes it.
function onVisibilityChange(): void {
  if (document.visibilityState !== "hidden") return;
  stopAll();
  void context?.suspend().catch(noop);
}

// Suspends the context once nothing has sounded for IDLE_SUSPEND_MS.
function scheduleIdleSuspend(): void {
  clearTimeout(idleTimer);
  idleTimer = undefined;
  if (!context || active.size > 0 || awake > 0) return;
  idleTimer = setTimeout(() => {
    idleTimer = undefined;
    if (context?.state === "running" && active.size === 0 && awake === 0) {
      void context.suspend().catch(noop);
    }
  }, IDLE_SUSPEND_MS);
}

// The shared context, created if needed (null without Web Audio). For the
// background music, which plays through the same context as every clip.
export function sharedAudioContext(): AudioContext | null {
  return audioContext();
}

// Keeps the shared context from its idle suspension while held; returns the
// release.
export function keepAudioAwake(): () => void {
  awake++;
  clearTimeout(idleTimer);
  idleTimer = undefined;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    awake--;
    scheduleIdleSuspend();
  };
}

function resumeContext(ctx: AudioContext): Promise<void> {
  return ctx.resume().catch(noop);
}

// `play()` as a promise: older engines return nothing from it, and some
// throw instead of rejecting.
function start(media: HTMLMediaElement): Promise<void> {
  try {
    return Promise.resolve(media.play());
  } catch (error) {
    return Promise.reject(error);
  }
}

export function resetAudioForTesting(): void {
  stopAll();
  document.removeEventListener("visibilitychange", onVisibilityChange);
  context = null;
  shortUrls.clear();
  pending.length = 0;
  buffers.clear();
  decoding.clear();
  unbuffered.clear();
  decodedBytes = 0;
  primed = false;
  sequence = 0;
  element = null;
  elementEnd = null;
  elementSrc = "";
  elementUnlocked = false;
  for (const blob of blobs.values()) URL.revokeObjectURL(blob);
  blobs.clear();
  blobsLoading.clear();
  song = null;
  awake = 0;
  clearTimeout(idleTimer);
  idleTimer = undefined;
}

// Fetches and decodes one short clip into a buffer, once. Never rejects: a
// clip that fails stays out of `buffers` and plays through the media element.
function decode(url: string): Promise<void> {
  const known = decoding.get(url);
  if (known) return known;
  const ctx = context;
  if (!ctx || buffers.has(url) || unbuffered.has(url)) return Promise.resolve();
  const job = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      const bytes = buffer.length * buffer.numberOfChannels * 4;
      if (decodedBytes + bytes > MAX_DECODED_BYTES) {
        unbuffered.add(url);
        return;
      }
      decodedBytes += bytes;
      buffers.set(url, buffer);
    } catch {
      unbuffered.add(url);
    } finally {
      decoding.delete(url);
    }
  })();
  decoding.set(url, job);
  return job;
}

// Decodes the declared clips in order, a few at a time, once the context
// exists (after the first tap).
function pump(): void {
  if (!context) return;
  while (decoding.size < DECODE_CONCURRENCY) {
    const url = pending.shift();
    if (url === undefined) return;
    if (buffers.has(url) || unbuffered.has(url) || decoding.has(url)) continue;
    void decode(url).then(pump);
  }
}

// Declares short clips, in the order they matter. They are fetched and
// decoded once, a few at a time, after the first tap; asking again for a clip
// already declared does nothing, so each screen can declare what it uses.
export function preloadSounds(urls: readonly string[]): void {
  for (const url of urls) {
    if (shortUrls.has(url)) continue;
    shortUrls.add(url);
    pending.push(url);
  }
  pump();
}

// Fetches long clips (songs) into memory, still compressed, so the shared
// media element starts one at once from a blob instead of waiting on the
// network. Asking again for a clip does nothing.
export function warmSounds(urls: readonly string[]): void {
  if (typeof fetch === "undefined") return;
  for (const url of urls) {
    if (blobs.has(url) || blobsLoading.has(url)) continue;
    blobsLoading.add(url);
    fetch(url)
      .then((response) => (response.ok ? response.blob() : undefined))
      .then((blob) => {
        if (blob) blobs.set(url, URL.createObjectURL(blob));
      })
      .catch(noop)
      .finally(() => blobsLoading.delete(url));
  }
}

// Lets the shared media element play later without a tap: iOS allows that
// only for an element that has played inside a tap once.
function unlockElement(): void {
  if (elementUnlocked || elementEnd || typeof Audio === "undefined") return;
  elementUnlocked = true;
  const media = sharedElement();
  media.muted = true;
  media.src = SILENT_WAV;
  elementSrc = SILENT_WAV;
  start(media)
    .then(() => {
      if (!elementEnd) media.pause();
    })
    .catch(() => {
      elementUnlocked = false;
    })
    .finally(() => {
      media.muted = false;
    });
}

// Plays one silent sample: older iOS starts audio only from a sound played
// inside a tap.
function prime(ctx: AudioContext): void {
  if (primed) return;
  primed = true;
  const source = ctx.createBufferSource();
  source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  source.connect(ctx.destination);
  source.start();
}

// Creates the shared context (or resumes it after the page was in the
// background) and starts decoding. Call from a tap handler: iOS starts audio
// only inside a tap.
export function unlockAudio(): void {
  setPlaybackSession();
  const ctx = audioContext();
  if (ctx) {
    if (ctx.state !== "running") void resumeContext(ctx);
    prime(ctx);
  }
  unlockElement();
  pump();
  scheduleIdleSuspend();
}

// Unlocks audio on every tap or key press anywhere while installed, so a
// clip that plays later (the voice line after a jingle) is not lost and a
// context suspended in the background wakes at the next tap. Returns the
// cleanup.
export function installAudioUnlock(): () => void {
  const options = { capture: true, passive: true };
  for (const type of UNLOCK_EVENTS)
    window.addEventListener(type, unlockAudio, options);
  return () => {
    for (const type of UNLOCK_EVENTS)
      window.removeEventListener(type, unlockAudio, options);
  };
}

// Registers a playback. `run` starts the sound and returns what halts it; it
// gets `end` (to call when the sound is over) and `live` (false once the
// playback ended or was stopped, for work that finishes later).
function begin(
  run: (end: () => void, live: () => boolean) => (() => void) | undefined,
): { playback: Playback; finished: Promise<void> } {
  let ended = false;
  let halt: (() => void) | undefined;
  let end = noop;
  const finished = new Promise<void>((resolve) => {
    end = () => {
      if (ended) return;
      ended = true;
      active.delete(playback);
      scheduleIdleSuspend();
      resolve();
    };
  });
  const playback: Playback = {
    stop() {
      if (ended) return;
      halt?.();
      end();
    },
  };
  active.add(playback);
  clearTimeout(idleTimer);
  idleTimer = undefined;
  try {
    halt = run(end, () => !ended);
  } catch {
    end();
  }
  return { playback, finished };
}

// Starts a decoded clip. While the context is suspended it resumes first, and
// a clip whose turn came too late is dropped.
function playBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  end: () => void,
  live: () => boolean,
): () => void {
  const asked = performance.now();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.onended = () => {
    source.disconnect();
    end();
  };
  if (ctx.state === "running") {
    source.start();
  } else {
    void resumeContext(ctx).then(() => {
      if (!live()) return;
      if (ctx.state === "running" && performance.now() - asked < STALE_MS) {
        source.start();
      } else {
        end();
      }
    });
  }
  return () => {
    source.onended = null;
    try {
      source.stop();
    } catch {
      // Never started, or already over.
    }
    source.disconnect();
  };
}

function sharedElement(): HTMLAudioElement {
  element ??= new Audio();
  return element;
}

// Plays a clip through the one shared media element, which another clip
// takes over. Used for songs, and for any clip that could not be decoded.
function playElement(url: string, end: () => void): (() => void) | undefined {
  if (typeof Audio === "undefined") {
    end();
    return undefined;
  }
  elementEnd?.();
  const media = sharedElement();
  const events = ["ended", "error"] as const;
  const release = () => {
    if (elementEnd === done) elementEnd = null;
    for (const type of events) media.removeEventListener(type, done);
  };
  function done() {
    release();
    end();
  }
  elementEnd = done;
  for (const type of events) media.addEventListener(type, done);
  const src = blobs.get(url) ?? url;
  if (elementSrc === src) {
    media.currentTime = 0;
  } else {
    media.src = src;
    elementSrc = src;
  }
  media.muted = false;
  start(media).catch(done);
  return () => {
    release();
    media.pause();
  };
}

// Plays a clip from its start, alongside anything already sounding. Returns
// at once; the promise resolves once the clip has ended or was stopped, or at
// once when it cannot play (missing file, no audio support, blocked by the
// browser). A tap handler must not await it.
export function playSound(url: string): Promise<void> {
  setPlaybackSession();
  return begin((end, live) => {
    const ctx = audioContext();
    const buffer = buffers.get(url);
    if (ctx && buffer) return playBuffer(ctx, buffer, end, live);
    if (!ctx || !shortUrls.has(url) || unbuffered.has(url)) {
      return playElement(url, end);
    }
    // A short clip still decoding (the first tap, before the decode of the
    // clips ahead of it finished): play it the moment it is ready.
    const asked = performance.now();
    let halt: (() => void) | undefined;
    void decode(url).then(() => {
      if (!live() || performance.now() - asked > STALE_MS) return end();
      const decoded = buffers.get(url);
      halt = decoded
        ? playBuffer(ctx, decoded, end, live)
        : playElement(url, end);
    });
    return () => halt?.();
  }).finished;
}

// Stops every clip playing and cancels what a sequence still has to play.
function stopAll(): void {
  sequence++;
  for (const playback of [...active]) playback.stop();
}

// Plays clips one after another (a tone, then the owl's line). Starting a
// new sequence stops the clip of the one before, so quick taps never pile
// voices on top of each other. The first clip starts right away, inside the
// caller's tap; the rest follow without the caller waiting.
export async function playSequence(urls: readonly string[]): Promise<void> {
  stopAll();
  const own = sequence;
  for (const url of urls) {
    if (own !== sequence) return;
    await playSound(url);
  }
}

// Stops the song, if one is playing.
export function stopMusic(): void {
  song?.stop();
  song = null;
}

// Plays a song from its start, alone: anything playing stops first (a voice
// line, another song), and a later sequence stops the song in turn. Resolves
// when the song ended or was stopped. A song is never decoded: it plays
// through the shared media element.
export function playMusic(url: string): Promise<void> {
  setPlaybackSession();
  stopAll();
  const { playback, finished } = begin((end) => playElement(url, end));
  song = playback;
  return finished.then(() => {
    if (song === playback) song = null;
  });
}
