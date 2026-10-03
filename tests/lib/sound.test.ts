import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  IDLE_SUSPEND_MS,
  installAudioUnlock,
  keepAudioAwake,
  MAX_DECODED_BYTES,
  playMusic,
  playSequence,
  playSound,
  preloadSounds,
  resetAudioForTesting,
  stopMusic,
  unlockAudio,
  warmSounds,
} from "@/lib/sound";

// jsdom has no Web Audio and does not play media; these record what the
// sound code asks for.
class FakeSource {
  buffer: { silent?: boolean } | null = null;
  onended: (() => void) | null = null;
  started = 0;
  stopped = 0;
  connect = vi.fn();
  disconnect = vi.fn();
  start() {
    this.started++;
  }
  stop() {
    this.stopped++;
  }
  // The clip played to its end.
  finish() {
    this.onended?.();
  }
}

class FakeContext {
  static instances: FakeContext[] = [];
  // Float32 samples of every decoded clip.
  static clipLength = 1000;
  state = "suspended";
  sampleRate = 44100;
  destination = {};
  sources: FakeSource[] = [];
  // The clips started, without the silent sample that primes the context.
  get started() {
    return this.sources.filter((s) => s.started && !s.buffer?.silent);
  }
  decoded = 0;
  resume = vi.fn(async () => {
    this.state = "running";
  });
  suspend = vi.fn(async () => {
    this.state = "suspended";
  });
  constructor() {
    FakeContext.instances.push(this);
  }
  createBuffer() {
    return { silent: true, length: 1, numberOfChannels: 1 };
  }
  createBufferSource() {
    const source = new FakeSource();
    this.sources.push(source);
    return source;
  }
  async decodeAudioData() {
    this.decoded++;
    return { length: FakeContext.clipLength, numberOfChannels: 1 };
  }
}

class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  src = "";
  muted = false;
  currentTime = 0;
  paused = true;
  pause = vi.fn(() => {
    this.paused = true;
  });
  plays: { src: string; muted: boolean }[] = [];
  constructor() {
    super();
    FakeAudio.instances.push(this);
  }
  play() {
    this.plays.push({ src: this.src, muted: this.muted });
    this.paused = false;
    return Promise.resolve();
  }
}

const okResponse = () => ({
  ok: true,
  arrayBuffer: async () => new ArrayBuffer(4),
  blob: async () => new Blob(["x"]),
});
const fetchMock = vi.fn(async (_url: string) => okResponse());

// Lets pending promise callbacks (fetch, decode, resume) run.
async function settle() {
  for (let i = 0; i < 20; i++) await Promise.resolve();
}

function context(): FakeContext {
  const [first] = FakeContext.instances;
  if (!first) throw new Error("no AudioContext was made");
  return first;
}

// Declares clips and taps once, so the context is made and they are decoded.
async function ready(urls: string[]) {
  preloadSounds(urls);
  unlockAudio();
  await settle();
}

// Sources of the clips the media element really played (not its silent
// unlock), in order.
function elementPlays(): string[] {
  return FakeAudio.instances.flatMap((audio) =>
    audio.plays.filter((p) => !p.muted).map((p) => p.src),
  );
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "visibilityState", {
    value: hidden ? "hidden" : "visible",
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  FakeContext.instances = [];
  FakeContext.clipLength = 1000;
  FakeAudio.instances = [];
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => okResponse());
  vi.stubGlobal("AudioContext", FakeContext);
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: () => "blob:x" }));
});

afterEach(() => {
  resetAudioForTesting();
  vi.unstubAllGlobals();
  setHidden(false);
  delete (navigator as { audioSession?: unknown }).audioSession;
});

describe("short clips (Web Audio)", () => {
  it("fetches and decodes nothing before the first tap, then each clip once", async () => {
    preloadSounds(["/sounds/a.m4a", "/sounds/b.m4a"]);
    await settle();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(FakeContext.instances).toHaveLength(0);

    unlockAudio();
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(context().decoded).toBe(2);

    // A later screen declares them again, and a second tap unlocks again.
    preloadSounds(["/sounds/a.m4a", "/sounds/b.m4a", "/sounds/c.m4a"]);
    unlockAudio();
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(context().decoded).toBe(3);
    expect(FakeContext.instances).toHaveLength(1);
  });

  it("decodes only a couple of clips at a time, in the order declared", async () => {
    let release: () => void = () => undefined;
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          const done = () =>
            resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) });
          const before = release;
          release = () => {
            before();
            done();
          };
        }) as never,
    );
    preloadSounds(["/sounds/1.m4a", "/sounds/2.m4a", "/sounds/3.m4a"]);
    unlockAudio();
    await settle();
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/sounds/1.m4a",
      "/sounds/2.m4a",
    ]);
    release();
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("starts a decoded clip at once and never makes the caller wait", async () => {
    await ready(["/sounds/tap.m4a"]);
    const ended = vi.fn();
    const promise = playSound("/sounds/tap.m4a").then(ended);
    // Started inside the call, before any promise settles: no await between
    // the tap and the sound, and no media element anywhere.
    const [source] = context().started;
    expect(source?.started).toBe(1);
    expect(elementPlays()).toEqual([]);
    await settle();
    expect(ended).not.toHaveBeenCalled();
    source?.finish();
    await promise;
    expect(ended).toHaveBeenCalled();
  });

  it("plays taps over each other", async () => {
    await ready(["/sounds/tap.m4a"]);
    void playSound("/sounds/tap.m4a");
    void playSound("/sounds/tap.m4a");
    const started = context().started;
    expect(started).toHaveLength(2);
    expect(started.every((s) => s.stopped === 0)).toBe(true);
  });

  it("plays a clip still decoding the moment it is ready, without blocking", async () => {
    preloadSounds(["/sounds/tap.m4a"]);
    unlockAudio();
    // Decoding has not finished: the sound waits for it, the caller does not.
    void playSound("/sounds/tap.m4a");
    expect(context().started).toHaveLength(0);
    await settle();
    expect(context().started).toHaveLength(1);
    expect(context().decoded).toBe(1);
    expect(elementPlays()).toEqual([]);
  });

  it("falls back to the media element for a clip that cannot be decoded", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false } as never);
    await ready(["/sounds/missing.m4a"]);
    void playSound("/sounds/missing.m4a");
    expect(elementPlays()).toEqual(["/sounds/missing.m4a"]);
  });

  it("stops decoding at the memory cap and plays the rest through the element", async () => {
    // Two clips fit; the third would pass the cap.
    FakeContext.clipLength = Math.floor(MAX_DECODED_BYTES / 4 / 2.5);
    const urls = ["/sounds/1.m4a", "/sounds/2.m4a", "/sounds/3.m4a"];
    await ready(urls);
    expect(context().decoded).toBe(3);
    for (const url of urls) void playSound(url);
    expect(context().started).toHaveLength(2);
    expect(elementPlays()).toEqual(["/sounds/3.m4a"]);
  });

  it("plays through the media element where Web Audio is missing", async () => {
    vi.stubGlobal("AudioContext", undefined);
    await ready(["/sounds/a.m4a"]);
    void playSound("/sounds/a.m4a");
    expect(elementPlays()).toEqual(["/sounds/a.m4a"]);
  });

  it("does nothing where neither exists, and resolves", async () => {
    vi.stubGlobal("AudioContext", undefined);
    vi.stubGlobal("Audio", undefined);
    await expect(playSound("/sounds/a.m4a")).resolves.toBeUndefined();
    expect(() => {
      preloadSounds(["/sounds/a.m4a"]);
      unlockAudio();
    }).not.toThrow();
  });

  it("asks for a playback audio session so the ringer switch does not mute it", () => {
    const session = { type: "auto" };
    Object.defineProperty(navigator, "audioSession", {
      value: session,
      configurable: true,
    });
    unlockAudio();
    expect(session.type).toBe("playback");
  });
});

describe("sequences", () => {
  const tone = "/sounds/tone.m4a";
  const line = "/sounds/line.m4a";

  it("starts the first clip inside the call and the next when it ends", async () => {
    await ready([tone, line]);
    const done = vi.fn();
    void playSequence([tone, line]).then(done);
    const started = () => context().started;
    expect(started()).toHaveLength(1);
    started()[0]?.finish();
    await settle();
    expect(started()).toHaveLength(2);
    expect(done).not.toHaveBeenCalled();
    started()[1]?.finish();
    await settle();
    expect(done).toHaveBeenCalled();
  });

  it("stops the sequence before when a new one starts, and its second clip never plays", async () => {
    await ready([tone, line, "/sounds/c.m4a"]);
    void playSequence([tone, line]);
    const first = context().started[0];
    void playSequence(["/sounds/c.m4a"]);
    expect(first?.stopped).toBe(1);
    await settle();
    const urls = context().started;
    expect(urls).toHaveLength(2);
  });

  it("leaves a tap alone when it only plays beside a clip, but a sequence stops it", async () => {
    await ready(["/sounds/tap.m4a", tone]);
    void playSound("/sounds/tap.m4a");
    const tap = context().started[0];
    expect(tap?.stopped).toBe(0);
    void playSequence([tone]);
    expect(tap?.stopped).toBe(1);
  });
});

describe("music", () => {
  const songA = "/sounds/song-a.m4a";
  const songB = "/sounds/song-b.m4a";

  it("plays a song through one shared media element and never decodes it", async () => {
    await ready(["/sounds/tap.m4a"]);
    const decodedBefore = context().decoded;
    const first = playMusic(songA);
    const second = playMusic(songB);
    expect(context().decoded).toBe(decodedBefore);
    // One element for every song: the second took it over.
    expect(FakeAudio.instances).toHaveLength(1);
    expect(elementPlays()).toEqual([songA, songB]);
    await first;
    FakeAudio.instances[0]?.dispatchEvent(new Event("ended"));
    await second;
  });

  it("is stopped by stopMusic and by a later sequence, and resolves", async () => {
    await ready(["/sounds/line.m4a"]);
    const first = playMusic(songA);
    stopMusic();
    await first;
    expect(FakeAudio.instances[0]?.pause).toHaveBeenCalled();

    const again = playMusic(songA);
    void playSequence(["/sounds/line.m4a"]);
    await again;
    // Once for the song stopped by hand, once more for the one a sequence stopped.
    const stops = FakeAudio.instances[0]?.pause.mock.calls.length ?? 0;
    expect(stops).toBeGreaterThanOrEqual(2);
    expect(elementPlays()).toEqual([songA, songA]);
  });

  it("stops a voice line that was speaking, and the rest of its sequence", async () => {
    await ready(["/sounds/tone.m4a", "/sounds/line.m4a"]);
    const spoken = playSequence(["/sounds/tone.m4a", "/sounds/line.m4a"]);
    const tone = context().started[0];
    void playMusic(songA);
    expect(tone?.stopped).toBe(1);
    await spoken;
    expect(context().started).toHaveLength(1);
  });

  it("starts a song from memory once warmed, fetching each song once", async () => {
    const create = vi.fn(() => "blob:song-a");
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: create }));
    warmSounds([songA]);
    warmSounds([songA]);
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    void playMusic(songA);
    expect(elementPlays()).toEqual(["blob:song-a"]);
  });
});

describe("unlock and the page in the background", () => {
  it("unlocks the shared media element once, with a muted silent clip", async () => {
    unlockAudio();
    unlockAudio();
    await settle();
    const [element] = FakeAudio.instances;
    expect(FakeAudio.instances).toHaveLength(1);
    expect(element?.plays).toEqual([
      { src: expect.stringContaining("data:audio/wav"), muted: true },
    ]);
    expect(element?.muted).toBe(false);
  });

  it("unlocks on every tap while installed, until removed", async () => {
    const remove = installAudioUnlock();
    window.dispatchEvent(new Event("pointerdown"));
    await settle();
    expect(context().resume).toHaveBeenCalledTimes(1);
    context().state = "suspended";
    window.dispatchEvent(new Event("touchend"));
    await settle();
    expect(context().resume).toHaveBeenCalledTimes(2);
    remove();
    context().state = "suspended";
    window.dispatchEvent(new Event("pointerdown"));
    await settle();
    expect(context().resume).toHaveBeenCalledTimes(2);
  });

  it("stops everything and suspends the context when the page is hidden", async () => {
    await ready(["/sounds/tone.m4a", "/sounds/line.m4a"]);
    void playSound("/sounds/tone.m4a");
    const sequence = playSequence(["/sounds/tone.m4a", "/sounds/line.m4a"]);
    const playing = context().started;
    setHidden(true);
    await sequence;
    expect(playing.every((s) => s.stopped === 1)).toBe(true);
    expect(context().suspend).toHaveBeenCalled();
    // The rest of the sequence never plays on coming back.
    setHidden(false);
    await settle();
    expect(context().started).toHaveLength(playing.length);
  });

  it("resumes on the next tap, and plays after the resume", async () => {
    await ready(["/sounds/tap.m4a"]);
    setHidden(true);
    setHidden(false);
    expect(context().state).toBe("suspended");
    void playSound("/sounds/tap.m4a");
    // Not started until the context runs, and the caller was not held up.
    expect(context().started).toHaveLength(0);
    await settle();
    expect(context().resume).toHaveBeenCalled();
    expect(context().started).toHaveLength(1);
  });

  it("drops a sound whose turn came too late", async () => {
    await ready(["/sounds/tap.m4a"]);
    setHidden(true);
    const real = performance.now.bind(performance);
    let late = 0;
    vi.spyOn(performance, "now").mockImplementation(() => real() + late);
    context().resume.mockImplementationOnce(async () => {
      late = 5000;
      context().state = "running";
    });
    await playSound("/sounds/tap.m4a");
    expect(context().started).toHaveLength(0);
    vi.restoreAllMocks();
  });

  it("suspends the context once nothing sounded for a while, unless kept awake", async () => {
    await ready(["/sounds/tap.m4a"]);
    vi.useFakeTimers();
    try {
      void playSound("/sounds/tap.m4a");
      await vi.advanceTimersByTimeAsync(IDLE_SUSPEND_MS * 2);
      // A clip still playing keeps it running.
      expect(context().suspend).not.toHaveBeenCalled();
      context().started[0]?.finish();
      const release = keepAudioAwake();
      await vi.advanceTimersByTimeAsync(IDLE_SUSPEND_MS * 2);
      expect(context().suspend).not.toHaveBeenCalled();
      release();
      await vi.advanceTimersByTimeAsync(IDLE_SUSPEND_MS);
      expect(context().suspend).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
