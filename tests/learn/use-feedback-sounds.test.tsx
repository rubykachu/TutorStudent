import "fake-indexeddb/auto";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SPOKEN_PRAISE_EVERY,
  useFeedbackSounds,
} from "@/learn/use-feedback-sounds";
import { JINGLE_ID, soundUrl } from "@/lib/sound-manifest";
import { ENCOURAGE_LINES, PRAISE_VOICE_LINES } from "@/mascot/lines";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";

vi.mock("@/lib/sound", () => ({
  playSound: vi.fn(async () => undefined),
  preloadSounds: vi.fn(),
  installAudioUnlock: vi.fn(() => () => undefined),
}));
const sound = await import("@/lib/sound");

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  vi.clearAllMocks();
});

const praise = PRAISE_VOICE_LINES[0] as (typeof PRAISE_VOICE_LINES)[number];
const encourage = ENCOURAGE_LINES[0] as (typeof ENCOURAGE_LINES)[number];

async function flush() {
  for (let i = 0; i < 3; i++) await Promise.resolve();
}

describe("useFeedbackSounds", () => {
  it("plays the jingle on every correct answer and the spoken praise every few", async () => {
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await waitFor(() => expect(result.current).toBeDefined());
    expect(sound.installAudioUnlock).toHaveBeenCalled();
    expect(sound.preloadSounds).toHaveBeenCalledWith(
      expect.arrayContaining([soundUrl(JINGLE_ID), soundUrl(praise.id)]),
    );

    for (let i = 0; i < SPOKEN_PRAISE_EVERY; i++) {
      result.current?.correct(praise);
      await flush();
    }
    const played = vi.mocked(sound.playSound).mock.calls.map(([url]) => url);
    expect(played.filter((url) => url === soundUrl(JINGLE_ID))).toHaveLength(
      SPOKEN_PRAISE_EVERY,
    );
    expect(played.filter((url) => url === soundUrl(praise.id))).toHaveLength(1);
    expect(played.at(-1)).toBe(soundUrl(praise.id));
  });

  it("speaks the encouraging line it is given", async () => {
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await waitFor(() => expect(result.current).toBeDefined());
    result.current?.encourage(encourage);
    expect(sound.playSound).toHaveBeenCalledWith(soundUrl(encourage.id));
  });

  it("gives no sounds while this child has sound off", async () => {
    await setSoundEnabled("kid-1", false);
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await flush();
    await waitFor(() => expect(result.current).toBeUndefined());
    expect(sound.installAudioUnlock).not.toHaveBeenCalled();
    expect(sound.preloadSounds).not.toHaveBeenCalled();
  });
});
