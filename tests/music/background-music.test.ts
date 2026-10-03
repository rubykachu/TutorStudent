import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BackgroundMusic,
  CROSSFADE_S,
  DUCK_FADE_S,
  DUCK_LEVEL,
  FADE_IN_S,
  FADE_OUT_S,
  type MusicEngine,
  type MusicVoice,
  OUTER_GRACE_MS,
  shuffledOrder,
} from "@/music/background-music";

const URLS = ["/a.m4a", "/b.m4a", "/c.m4a"];
const DURATION = 20;

type FakeVoice = MusicVoice & {
  url: string;
  calls: string[];
  end: () => void;
  at: number;
};

function fakeEngine(options: { fail?: boolean } = {}) {
  const voices: FakeVoice[] = [];
  let awake = 0;
  const engine: MusicEngine = {
    keepAwake: () => {
      awake++;
      return () => {
        awake--;
      };
    },
    async load(url) {
      if (options.fail) return null;
      let ended: () => void = () => undefined;
      const voice: FakeVoice = {
        url,
        calls: [],
        at: 0,
        duration: DURATION,
        start(offset, level, fade) {
          voice.at = offset;
          voice.calls.push(`start ${offset} ${level} ${fade}`);
        },
        setLevel(level, fade) {
          voice.calls.push(`level ${level} ${fade}`);
        },
        stop(fade) {
          voice.calls.push(`stop ${fade}`);
        },
        position: () => voice.at,
        onEnded(listener) {
          ended = listener;
        },
        end: () => ended(),
      };
      voices.push(voice);
      return voice;
    },
  };
  return { engine, voices, awake: () => awake };
}

// Lets the pending loads land.
const settle = () => vi.advanceTimersByTimeAsync(0);

function ready(music: BackgroundMusic) {
  music.setEnabled(true);
  music.unlock();
  return music.claimOuterScreen();
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("shuffledOrder", () => {
  it("plays every track once per round and never starts with the last one", () => {
    let seed = 1;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 200; i++) {
      const order = shuffledOrder(URLS, "/b.m4a", random);
      expect([...order].sort()).toEqual([...URLS].sort());
      expect(order[0]).not.toBe("/b.m4a");
    }
  });

  it("keeps a single track playable", () => {
    expect(shuffledOrder(["/a.m4a"], "/a.m4a", () => 0)).toEqual(["/a.m4a"]);
  });
});

describe("BackgroundMusic", () => {
  it("waits for the first tap, an outer screen and the switch", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    music.setEnabled(true);
    music.claimOuterScreen();
    await settle();
    expect(voices).toHaveLength(0);
    music.unlock();
    await settle();
    expect(voices).toHaveLength(1);
    expect(music.isPlaying()).toBe(true);
  });

  it("stays silent with the switch off or on a learning screen", async () => {
    const { engine, voices } = fakeEngine();
    const off = new BackgroundMusic(engine, () => URLS);
    off.unlock();
    off.claimOuterScreen();
    await settle();
    const learning = new BackgroundMusic(engine, () => URLS);
    learning.setEnabled(true);
    learning.unlock();
    await settle();
    expect(voices).toHaveLength(0);
  });

  it("fades in over FADE_IN_S and out over FADE_OUT_S when the screen leaves", async () => {
    const { engine, voices, awake } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    const leave = ready(music);
    await settle();
    expect(voices[0]?.calls).toEqual([`start 0 1 ${FADE_IN_S}`]);
    expect(awake()).toBe(1);
    leave();
    // Still playing during the grace, in case another outer screen claims.
    expect(music.isPlaying()).toBe(true);
    await vi.advanceTimersByTimeAsync(OUTER_GRACE_MS);
    expect(voices[0]?.calls.at(-1)).toBe(`stop ${FADE_OUT_S}`);
    expect(music.isPlaying()).toBe(false);
    expect(awake()).toBe(0);
  });

  it("keeps playing from one outer screen to the next", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    const leaveHome = ready(music);
    await settle();
    leaveHome();
    music.claimOuterScreen();
    await vi.advanceTimersByTimeAsync(OUTER_GRACE_MS * 2);
    expect(voices).toHaveLength(1);
    expect(voices[0]?.calls.some((c) => c.startsWith("stop"))).toBe(false);
  });

  it("resumes the same track where it stopped", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    const leave = ready(music);
    await settle();
    const first = voices[0] as FakeVoice;
    first.at = 7;
    leave();
    await vi.advanceTimersByTimeAsync(OUTER_GRACE_MS);
    music.claimOuterScreen();
    await settle();
    expect(voices[1]?.url).toBe(first.url);
    expect(voices[1]?.calls[0]).toBe(`start 7 1 ${FADE_IN_S}`);
  });

  it("crossfades into the next track, never the same one twice in a row", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    for (let i = 0; i < 12; i++) {
      await vi.advanceTimersByTimeAsync((DURATION - CROSSFADE_S) * 1000);
    }
    expect(voices.length).toBeGreaterThanOrEqual(12);
    for (let i = 1; i < voices.length; i++) {
      expect(voices[i]?.url).not.toBe(voices[i - 1]?.url);
      expect(voices[i - 1]?.calls.at(-1)).toBe(`stop ${CROSSFADE_S}`);
      expect(voices[i]?.calls[0]).toBe(`start 0 1 ${CROSSFADE_S}`);
    }
    // Each round of three plays every track once.
    expect(new Set(voices.slice(0, 3).map((v) => v.url)).size).toBe(3);
  });

  it("moves on when a track ends by itself", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    voices[0]?.end();
    await settle();
    expect(voices).toHaveLength(2);
    expect(voices[1]?.url).not.toBe(voices[0]?.url);
  });

  it("falls silent while narration, a video or a song plays, then resumes", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    const release = music.hold("silence");
    expect(voices[0]?.calls.at(-1)).toBe(`stop ${FADE_OUT_S}`);
    expect(music.isPlaying()).toBe(false);
    release();
    await settle();
    expect(music.isPlaying()).toBe(true);
    expect(voices[1]?.calls[0]).toMatch(new RegExp(` ${FADE_IN_S}$`));
  });

  it("ducks under a celebration and comes back after it", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    const release = music.hold("duck");
    expect(voices[0]?.calls.at(-1)).toBe(`level ${DUCK_LEVEL} ${DUCK_FADE_S}`);
    release();
    expect(voices[0]?.calls.at(-1)).toBe(`level 1 ${DUCK_FADE_S}`);
    expect(music.isPlaying()).toBe(true);
  });

  it("starts ducked when a celebration is already playing", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    music.hold("duck");
    ready(music);
    await settle();
    expect(voices[0]?.calls[0]).toBe(`start 0 ${DUCK_LEVEL} ${FADE_IN_S}`);
  });

  it("stops in the background and resumes on return", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    music.setVisible(false);
    expect(music.isPlaying()).toBe(false);
    music.setVisible(true);
    await settle();
    expect(voices).toHaveLength(2);
    expect(music.isPlaying()).toBe(true);
  });

  it("stops when the switch is turned off", async () => {
    const { engine } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    ready(music);
    await settle();
    music.setEnabled(false);
    expect(music.isPlaying()).toBe(false);
  });

  it("drops a track that finished loading after the screen left", async () => {
    const { engine, voices } = fakeEngine();
    const music = new BackgroundMusic(engine, () => URLS);
    const leave = ready(music);
    leave();
    await vi.advanceTimersByTimeAsync(OUTER_GRACE_MS);
    expect(voices.every((v) => v.calls.length === 0)).toBe(true);
    expect(music.isPlaying()).toBe(false);
  });

  it("gives up quietly when a track cannot load (offline), until the next screen", async () => {
    const failing = fakeEngine({ fail: true });
    const load = vi.spyOn(failing.engine, "load");
    const music = new BackgroundMusic(failing.engine, () => URLS);
    ready(music);
    await settle();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(load).toHaveBeenCalledTimes(1);
    expect(music.isPlaying()).toBe(false);
    music.claimOuterScreen();
    await settle();
    expect(load).toHaveBeenCalledTimes(2);
  });
});
