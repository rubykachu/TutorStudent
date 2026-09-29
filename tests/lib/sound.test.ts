import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  installAudioUnlock,
  playTing,
  resetAudioForTesting,
  unlockAudio,
} from "@/lib/sound";

// jsdom has no WebAudio; this records what the sound code asks for.
class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  state: AudioContextState = "suspended";
  currentTime = 1;
  sampleRate = 44_100;
  destination = {};
  resume = vi.fn(async () => {
    this.state = "running";
  });
  oscillators: { frequency: number; start: number; stop: number }[] = [];
  buffersPlayed = 0;

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createOscillator() {
    const record = { frequency: 0, start: 0, stop: 0 };
    this.oscillators.push(record);
    return {
      type: "",
      frequency: {
        setValueAtTime: (hz: number) => {
          record.frequency = hz;
        },
      },
      connect: vi.fn(),
      start: (at: number) => {
        record.start = at;
      },
      stop: (at: number) => {
        record.stop = at;
      },
    };
  }

  createBuffer() {
    return {};
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: () => {
        this.buffersPlayed++;
      },
    };
  }
}

beforeEach(() => {
  FakeAudioContext.instances = [];
  vi.stubGlobal("AudioContext", FakeAudioContext);
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetAudioForTesting();
});

describe("sound", () => {
  it("plays a short two-note bell and resumes suspended audio", () => {
    playTing();
    const [ctx] = FakeAudioContext.instances;
    expect(ctx?.resume).toHaveBeenCalled();
    expect(ctx?.oscillators.map((o) => o.frequency)).toEqual([1318.5, 1975.5]);
    for (const o of ctx?.oscillators ?? []) {
      expect(o.start).toBe(1);
      expect(o.stop).toBeLessThanOrEqual(1.6);
    }
  });

  it("reuses one audio context", () => {
    playTing();
    playTing();
    expect(FakeAudioContext.instances).toHaveLength(1);
  });

  it("unlocks audio on the first gesture only", () => {
    const remove = installAudioUnlock();
    window.dispatchEvent(new Event("pointerdown"));
    window.dispatchEvent(new Event("pointerdown"));
    const [ctx] = FakeAudioContext.instances;
    expect(ctx?.buffersPlayed).toBe(1);
    expect(ctx?.resume).toHaveBeenCalledTimes(1);
    remove();
  });

  it("does nothing where WebAudio is missing", () => {
    vi.stubGlobal("AudioContext", undefined);
    expect(() => {
      unlockAudio();
      playTing();
    }).not.toThrow();
  });
});
