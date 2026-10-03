import "fake-indexeddb/auto";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFeedbackSounds } from "@/learn/use-feedback-sounds";
import {
  allSoundUrls,
  JINGLE_ID,
  LEAVE_ID,
  soundUrl,
  WRONG_ID,
} from "@/lib/sound-manifest";
import { PRAISE_LINES } from "@/mascot/lines";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";

vi.mock("@/lib/sound", () => ({
  playSequence: vi.fn(async () => undefined),
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
    result.current?.play([WRONG_ID]);
    expect(vi.mocked(sound.playSequence).mock.calls).toEqual([
      [[soundUrl(JINGLE_ID), soundUrl(praise.id)]],
      [[soundUrl(WRONG_ID)]],
    ]);
  });

  it("plays the goodbye as a sequence, so it stops a voice still speaking", async () => {
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await waitFor(() => expect(result.current).toBeDefined());
    result.current?.leave();
    expect(sound.playSequence).toHaveBeenCalledWith([soundUrl(LEAVE_ID)]);
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

describe("useFeedbackSounds and the background music", () => {
  it("ducks the music while a celebration plays, and only then", async () => {
    const { backgroundMusic } = await import("@/music/background-music");
    const { CELEBRATION_IDS } = await import("@/lib/sound-manifest");
    const release = vi.fn();
    const hold = vi.spyOn(backgroundMusic(), "hold").mockReturnValue(release);
    let finish: () => void = () => undefined;
    vi.mocked(sound.playSequence).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { result } = renderHook(() => useFeedbackSounds("kid-1"));
    await waitFor(() => expect(result.current).toBeDefined());
    result.current?.play([CELEBRATION_IDS[0]]);
    expect(hold).toHaveBeenCalledWith("duck");
    expect(release).not.toHaveBeenCalled();
    finish();
    await flush();
    expect(release).toHaveBeenCalledTimes(1);
    result.current?.play([JINGLE_ID]);
    expect(hold).toHaveBeenCalledTimes(1);
    hold.mockRestore();
  });
});
