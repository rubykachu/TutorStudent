import "fake-indexeddb/auto";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SoundToggle } from "@/components/sound-toggle";
import { PlayerHeader } from "@/learn/player-header";
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

    const toggle = await screen.findByRole("button", { name: "Âm thanh" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);
    const turnOn = await screen.findByRole("button", {
      name: "Âm thanh",
      pressed: false,
    });
    expect(turnOn).toHaveAttribute("title", "Âm thanh: tắt");
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(false);
    expect(await readSoundEnabled(appDb(), "kid-2")).toBe(true);
    expect(sound.playSound).not.toHaveBeenCalled();

    fireEvent.click(turnOn);
    await screen.findByRole("button", { name: "Âm thanh", pressed: true });
    expect(await readSoundEnabled(appDb(), "kid-1")).toBe(true);
    // Turning sound on unlocks audio in the tap and plays the jingle.
    expect(sound.unlockAudio).toHaveBeenCalledTimes(1);
    expect(sound.playSound).toHaveBeenCalledWith(soundUrl(JINGLE_ID));
  });

  it("is a 48px round button", async () => {
    render(<SoundToggle childId="kid-1" />);
    expect(await screen.findByRole("button", { name: "Âm thanh" })).toHaveClass(
      "size-12",
    );
  });

  it("sits at the right end of the lesson player header", async () => {
    render(<PlayerHeader lessonId="fixture" childId="kid-1" />);
    const toggle = await screen.findByRole("button", { name: "Âm thanh" });
    expect(toggle.closest("header")).not.toBeNull();
    expect(toggle.closest("header")?.lastElementChild).toContainElement(toggle);
  });
});
