import "fake-indexeddb/auto";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SoundToggle } from "@/components/sound-toggle";
import { JINGLE_ID, soundUrl } from "@/lib/sound-manifest";
import {
  appDb,
  readSoundEnabled,
  resetAppDbForTesting,
} from "@/progress/hooks";

vi.mock("@/lib/sound", () => ({
  playSound: vi.fn(async () => undefined),
  preloadSounds: vi.fn(),
  unlockAudio: vi.fn(),
}));
const sound = await import("@/lib/sound");

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  vi.clearAllMocks();
});

describe("SoundToggle", () => {
  it("turns sound off and on again for this child, saved in Dexie", async () => {
    render(<SoundToggle childId="kid-1" />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Âm thanh: bật" }),
    );
    const turnOn = await screen.findByRole("button", { name: "Âm thanh: tắt" });
    expect(turnOn).toHaveAttribute("aria-pressed", "false");
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(false);
    expect(await readSoundEnabled(appDb(), "kid-2")).toBe(true);
    expect(sound.playSound).not.toHaveBeenCalled();

    fireEvent.click(turnOn);
    await screen.findByRole("button", { name: "Âm thanh: bật" });
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(true);
    // Turning sound on unlocks audio in the tap and plays the jingle.
    expect(sound.unlockAudio).toHaveBeenCalledTimes(1);
    expect(sound.playSound).toHaveBeenCalledWith(soundUrl(JINGLE_ID));
  });

  it("is a 48px tall button", async () => {
    render(<SoundToggle childId="kid-1" />);
    expect(
      await screen.findByRole("button", { name: "Âm thanh: bật" }),
    ).toHaveClass("h-12");
  });
});
