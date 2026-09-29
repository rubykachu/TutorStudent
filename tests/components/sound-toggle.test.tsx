import "fake-indexeddb/auto";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SoundToggle } from "@/components/sound-toggle";
import {
  appDb,
  readSoundEnabled,
  resetAppDbForTesting,
} from "@/progress/hooks";

vi.mock("@/lib/sound", () => ({ playTing: vi.fn(), unlockAudio: vi.fn() }));
const sound = await import("@/lib/sound");

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  vi.clearAllMocks();
});

describe("SoundToggle", () => {
  it("turns the ting off and on again for this child, saved in Dexie", async () => {
    render(<SoundToggle childId="kid-1" />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Tắt âm thanh" }),
    );
    const turnOn = await screen.findByRole("button", { name: "Bật âm thanh" });
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(false);
    expect(await readSoundEnabled(appDb(), "kid-2")).toBe(true);
    expect(sound.playTing).not.toHaveBeenCalled();

    fireEvent.click(turnOn);
    await screen.findByRole("button", { name: "Tắt âm thanh" });
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(true);
    // Turning sound on unlocks audio in the tap and plays a sample ting.
    expect(sound.unlockAudio).toHaveBeenCalledTimes(1);
    expect(sound.playTing).toHaveBeenCalledTimes(1);
  });

  it("is a 48px round button", async () => {
    render(<SoundToggle childId="kid-1" />);
    expect(
      await screen.findByRole("button", { name: "Tắt âm thanh" }),
    ).toHaveClass("size-12");
  });
});
