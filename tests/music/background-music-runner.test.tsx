import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicToggle } from "@/components/music-toggle";
import { BackgroundMusicSetting } from "@/components/parent/background-music-setting";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  BackgroundMusicRunner,
  OuterScreenMusic,
} from "@/music/background-music-runner";
import {
  appDb,
  readBackgroundMusicAllowed,
  readBackgroundMusicEnabled,
  resetAppDbForTesting,
  setActiveProfile,
  setBackgroundMusicEnabled,
  setSoundEnabled,
} from "@/progress/hooks";

const controller = vi.hoisted(() => ({
  setEnabled: vi.fn(),
  unlock: vi.fn(),
  setVisible: vi.fn(),
  release: vi.fn(),
  hold: vi.fn(),
  claimOuterScreen: vi.fn(),
}));
vi.mock("@/music/background-music", () => ({
  backgroundMusic: () => controller,
}));
vi.mock("@/lib/sound", () => ({ unlockAudio: vi.fn() }));
const sound = await import("@/lib/sound");

beforeEach(() => {
  controller.hold.mockImplementation(() => controller.release);
  controller.claimOuterScreen.mockImplementation(() => controller.release);
});
afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  vi.clearAllMocks();
});

describe("the music setting", () => {
  it("is on until turned off, per device, and off while the child has sound off", async () => {
    const db = appDb();
    expect(await readBackgroundMusicEnabled(db)).toBe(true);
    expect(await readBackgroundMusicAllowed(db)).toBe(true);
    await db.profiles.put({
      id: "kid",
      familyId: LOCAL_FAMILY_ID,
      name: "Bé",
      avatar: "cat",
      grade: 6,
      series: {},
      createdAt: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-10-01T00:00:00.000Z",
    });
    await setActiveProfile("kid");
    await setSoundEnabled("kid", false);
    expect(await readBackgroundMusicAllowed(db)).toBe(false);
    await setSoundEnabled("kid", true);
    await setBackgroundMusicEnabled(false);
    expect(await readBackgroundMusicAllowed(db)).toBe(false);
  });

  it("is switched by the home toggle and the parent page", async () => {
    render(
      <>
        <MusicToggle />
        <BackgroundMusicSetting />
      </>,
    );
    const toggle = await screen.findByRole("button", { name: "Nhạc nền" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);
    await waitFor(() =>
      expect(toggle).toHaveAttribute("aria-pressed", "false"),
    );
    expect(await readBackgroundMusicEnabled(appDb())).toBe(false);
    expect(screen.getByText("Đang tắt")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Bật nhạc nền/ }));
    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "true"));
  });
});

describe("BackgroundMusicRunner", () => {
  it("enables the music and unlocks it on the first tap", async () => {
    const view = render(<BackgroundMusicRunner />);
    await waitFor(() =>
      expect(controller.setEnabled).toHaveBeenCalledWith(true),
    );
    expect(controller.unlock).not.toHaveBeenCalled();
    fireEvent.pointerDown(document.body);
    expect(sound.unlockAudio).toHaveBeenCalled();
    expect(controller.unlock).toHaveBeenCalled();
    view.unmount();
    expect(controller.setEnabled).toHaveBeenLastCalledWith(false);
  });

  it("silences the music while a narration or video element plays", async () => {
    render(<BackgroundMusicRunner />);
    await waitFor(() =>
      expect(controller.setEnabled).toHaveBeenCalledWith(true),
    );
    const audio = document.createElement("audio");
    document.body.append(audio);
    audio.dispatchEvent(new Event("play"));
    expect(controller.hold).toHaveBeenCalledWith("silence");
    audio.dispatchEvent(new Event("play"));
    expect(controller.hold).toHaveBeenCalledTimes(1);
    audio.dispatchEvent(new Event("pause"));
    expect(controller.release).toHaveBeenCalledTimes(1);
    audio.remove();
  });

  it("stops in the background", async () => {
    render(<BackgroundMusicRunner />);
    await waitFor(() =>
      expect(controller.setEnabled).toHaveBeenCalledWith(true),
    );
    window.dispatchEvent(new Event("pagehide"));
    expect(controller.setVisible).toHaveBeenLastCalledWith(false);
    window.dispatchEvent(new Event("pageshow"));
    expect(controller.setVisible).toHaveBeenLastCalledWith(true);
  });

  it("stays off when the switch is off", async () => {
    await setBackgroundMusicEnabled(false);
    render(<BackgroundMusicRunner />);
    await waitFor(() =>
      expect(controller.setEnabled).toHaveBeenCalledWith(false),
    );
    fireEvent.pointerDown(document.body);
    expect(controller.unlock).not.toHaveBeenCalled();
  });
});

describe("OuterScreenMusic", () => {
  it("claims the music while the outer screen shows", () => {
    const view = render(<OuterScreenMusic />);
    expect(controller.claimOuterScreen).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(controller.release).toHaveBeenCalledTimes(1);
  });
});
