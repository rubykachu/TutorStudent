import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  installAudioUnlock,
  playSequence,
  playSound,
  preloadSounds,
  resetAudioForTesting,
  unlockAudio,
} from "@/lib/sound";

// jsdom does not play media; this records what the sound code asks for.
class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  static failPlay = false;
  src: string;
  preload = "";
  muted = false;
  currentTime = 0;
  paused = true;
  load = vi.fn();
  pause = vi.fn(() => {
    this.paused = true;
  });
  plays: { muted: boolean }[] = [];

  constructor(src: string) {
    super();
    this.src = src;
    FakeAudio.instances.push(this);
  }

  play() {
    this.plays.push({ muted: this.muted });
    if (FakeAudio.failPlay) return Promise.reject(new Error("blocked"));
    this.paused = false;
    return Promise.resolve();
  }
}

// Lets pending promise callbacks (then, catch, finally) run.
async function settle() {
  for (let i = 0; i < 5; i++) await Promise.resolve();
}

beforeEach(() => {
  FakeAudio.instances = [];
  FakeAudio.failPlay = false;
  vi.stubGlobal("Audio", FakeAudio);
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetAudioForTesting();
  delete (navigator as { audioSession?: unknown }).audioSession;
});

describe("sound", () => {
  it("plays a clip through one reused media element and resolves when it ends", async () => {
    const played = playSound("/sounds/a.m4a");
    const [audio] = FakeAudio.instances;
    expect(audio?.plays).toEqual([{ muted: false }]);
    audio?.dispatchEvent(new Event("ended"));
    await played;
    void playSound("/sounds/a.m4a");
    expect(FakeAudio.instances).toHaveLength(1);
  });

  it("resolves at once when a clip cannot play", async () => {
    FakeAudio.failPlay = true;
    await expect(playSound("/sounds/missing.m4a")).resolves.toBeUndefined();
  });

  it("does nothing where media elements are missing", async () => {
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
    void playSound("/sounds/a.m4a");
    expect(session.type).toBe("playback");
  });

  it("unlocks every preloaded clip, muted, on the first gesture only", async () => {
    preloadSounds(["/sounds/a.m4a", "/sounds/b.m4a"]);
    expect(FakeAudio.instances.map((a) => a.load.mock.calls.length)).toEqual([
      1, 1,
    ]);
    const remove = installAudioUnlock();
    window.dispatchEvent(new Event("pointerdown"));
    window.dispatchEvent(new Event("pointerdown"));
    await settle();
    for (const audio of FakeAudio.instances) {
      expect(audio.plays).toEqual([{ muted: true }]);
      expect(audio.pause).toHaveBeenCalledTimes(1);
      expect(audio.muted).toBe(false);
    }
    remove();
  });

  it("loads a clip once, so a later screen's preload never cuts it off while it plays", () => {
    preloadSounds(["/sounds/a.m4a"]);
    void playSound("/sounds/a.m4a");
    preloadSounds(["/sounds/a.m4a", "/sounds/b.m4a"]);
    const [a, b] = FakeAudio.instances;
    expect(a?.load).toHaveBeenCalledTimes(1);
    expect(b?.load).toHaveBeenCalledTimes(1);
  });

  it("leaves a clip playing that was asked to play during an unlock", async () => {
    preloadSounds(["/sounds/a.m4a"]);
    unlockAudio();
    void playSound("/sounds/a.m4a");
    await settle();
    expect(FakeAudio.instances[0]?.pause).not.toHaveBeenCalled();
  });

  it("plays a sequence one clip after another", async () => {
    const done = playSequence(["/sounds/tone.m4a", "/sounds/line.m4a"]);
    const [tone] = FakeAudio.instances;
    // The first clip starts at once, inside the caller's tap.
    expect(tone?.plays).toHaveLength(1);
    expect(FakeAudio.instances).toHaveLength(1);
    tone?.dispatchEvent(new Event("ended"));
    await settle();
    const line = FakeAudio.instances[1];
    expect(line?.plays).toHaveLength(1);
    line?.dispatchEvent(new Event("ended"));
    await done;
  });

  it("stops the sequence before when a new one starts", async () => {
    void playSequence(["/sounds/a.m4a", "/sounds/b.m4a"]);
    const [a] = FakeAudio.instances;
    void playSequence(["/sounds/c.m4a"]);
    expect(a?.pause).toHaveBeenCalled();
    await settle();
    // The stopped sequence never goes on to its second clip.
    expect(FakeAudio.instances.map((x) => x.src)).toEqual([
      "/sounds/a.m4a",
      "/sounds/c.m4a",
    ]);
  });
});
