// Short sound clips (the correct-answer jingle, the owl's voice lines),
// played through HTMLAudioElement. Web Audio is silenced by the ringer switch
// on iPhone and iPad; a media element in a "playback" audio session is not.
// A clip that fails to load or play is skipped without an error.

const UNLOCK_EVENTS = ["pointerdown", "touchend", "keydown"] as const;

const clips = new Map<string, HTMLAudioElement>();
// Clips already asked to load. Loading again would reset an element, which
// cuts off a clip that is playing: every screen under a child's profile
// preloads when it mounts, and a link's press sounds just as the next
// screen mounts.
const loaded = new Set<HTMLAudioElement>();
// Clips asked to play for real, each with what ends its play; an unlock in
// flight leaves them playing.
const playing = new Map<HTMLAudioElement, () => void>();

// Safari 17+ lets a page pick an audio session; "playback" keeps sound on
// when the ringer switch is on silent.
function setPlaybackSession(): void {
  const session = (navigator as { audioSession?: { type: string } })
    .audioSession;
  if (session) session.type = "playback";
}

function clip(url: string): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  let element = clips.get(url);
  if (!element) {
    element = new Audio(url);
    element.preload = "auto";
    clips.set(url, element);
  }
  return element;
}

// `play()` as a promise: older engines return nothing from it, and some
// throw instead of rejecting.
function start(element: HTMLAudioElement): Promise<void> {
  try {
    return Promise.resolve(element.play());
  } catch (error) {
    return Promise.reject(error);
  }
}

export function resetAudioForTesting(): void {
  clips.clear();
  playing.clear();
  loaded.clear();
}

// Starts loading clips ahead of time so the first play is not delayed. A clip
// is loaded once; asking again (the next screen mounting) leaves it alone,
// so a press sound still playing is never cut off.
export function preloadSounds(urls: readonly string[]): void {
  for (const url of urls) {
    const element = clip(url);
    if (!element || loaded.has(element)) continue;
    loaded.add(element);
    element.load();
  }
}

// iOS lets a media element play on its own later only after it has played
// inside a user gesture once. Call from a tap handler: every preloaded clip
// plays muted for an instant and is rewound.
export function unlockAudio(): void {
  setPlaybackSession();
  for (const element of clips.values()) {
    if (playing.has(element)) continue;
    element.muted = true;
    start(element)
      .then(() => {
        if (playing.has(element)) return;
        element.pause();
        element.currentTime = 0;
      })
      .catch(() => undefined)
      .finally(() => {
        element.muted = false;
      });
  }
}

// Unlocks audio on the next tap or key press anywhere, so a clip that plays
// after an await is not lost. Returns the cleanup.
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

// Plays a clip from its start. Resolves once it has ended or was stopped, or
// at once when it cannot play (missing file, no audio support, blocked by
// the browser).
export function playSound(url: string): Promise<void> {
  const element = clip(url);
  if (!element) return Promise.resolve();
  setPlaybackSession();
  playing.get(element)?.();
  return new Promise((resolve) => {
    const events = ["ended", "error"] as const;
    const done = () => {
      if (playing.get(element) === done) playing.delete(element);
      for (const type of events) element.removeEventListener(type, done);
      resolve();
    };
    for (const type of events) element.addEventListener(type, done);
    playing.set(element, done);
    element.muted = false;
    element.currentTime = 0;
    start(element).catch(done);
  });
}

// The sequence playing now; a newer one stops it.
let sequence = 0;

// Stops every clip playing and cancels what a sequence still has to play.
function stopAll(): void {
  sequence++;
  for (const [element, done] of [...playing]) {
    done();
    element.pause();
  }
}

// Plays clips one after another (a tone, then the owl's line). Starting a
// new sequence stops the clip of the one before, so quick taps never pile
// voices on top of each other. The first clip starts right away, inside the
// caller's tap.
export async function playSequence(urls: readonly string[]): Promise<void> {
  stopAll();
  const own = sequence;
  for (const url of urls) {
    if (own !== sequence) return;
    await playSound(url);
  }
}
