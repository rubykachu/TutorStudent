import "fake-indexeddb/auto";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFeedbackSounds } from "@/learn/use-feedback-sounds";
import {
  allSoundUrls,
  JINGLE_ID,
  OOPS_ID,
  soundUrl,
} from "@/lib/sound-manifest";
import { PRAISE_LINES } from "@/mascot/lines";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";

vi.mock("@/lib/sound", () => ({
  playSequence: vi.fn(async () => undefined),
  preloadSounds: vi.fn(),
  installAudioUnlock: vi.fn(() => () => undefined),
}));
const sound = await import("@/lib/sound");

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  vi.clearAllMocks();
});

const praise = PRAISE_LINES[0] as (typeof PRAISE_LINES)[number];

async function flush() {
  for (let i = 0; i < 3; i++) await Promise.resolve();
}

describe("useFeedbackSounds", () => {
  it("preloads every clip and plays a cue as one sequence", async () => {
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await waitFor(() => expect(result.current).toBeDefined());
    expect(sound.installAudioUnlock).toHaveBeenCalled();
    expect(sound.preloadSounds).toHaveBeenCalledWith(allSoundUrls());

    result.current?.play([JINGLE_ID, praise.id]);
    result.current?.play([OOPS_ID]);
    expect(vi.mocked(sound.playSequence).mock.calls).toEqual([
      [[soundUrl(JINGLE_ID), soundUrl(praise.id)]],
      [[soundUrl(OOPS_ID)]],
    ]);
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
