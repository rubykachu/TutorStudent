import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { soundUrl } from "@/lib/sound-manifest";
import {
  MusicBoxChip,
  MusicBoxSheet,
  MusicReward,
  musicBoxCaption,
  unlockHint,
} from "@/music/music-box";
import { SONGS } from "@/music/songs";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";

// Each song stays "playing" until the test ends it.
const ends = new Map<string, () => void>();
vi.mock("@/lib/sound", () => ({
  preloadSounds: vi.fn(),
  stopMusic: vi.fn(),
  playMusic: vi.fn(
    (url: string) =>
      new Promise<void>((resolve) => {
        ends.set(url, resolve);
      }),
  ),
}));
const sound = await import("@/lib/sound");

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  ends.clear();
  vi.clearAllMocks();
});

const [FIRST, SECOND] = SONGS;

describe("music box", () => {
  it("captions the chip with how many songs are open", () => {
    expect(musicBoxCaption(0)).toBe("Hộp nhạc");
    expect(musicBoxCaption(1)).toBe("Hộp nhạc · 1 bài");
    expect(musicBoxCaption(7)).toBe("Hộp nhạc · 3 bài");
  });

  it("tells a locked song how many sections open it", () => {
    expect(unlockHint(1, 2)).toBe("Học xong thêm 2 phần để mở");
  });

  it("lists open songs to play and locked ones greyed with how to open them", () => {
    render(<MusicBoxSheet childId="kid" doneSections={1} onClose={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: FIRST?.title }),
    ).toBeInTheDocument();
    const locked = document.querySelector(`[data-song="${SECOND?.id}"]`);
    expect(locked).toHaveAttribute("data-song-state", "locked");
    expect(locked?.textContent).toContain("Học xong thêm 3 phần để mở");
    expect(screen.queryByRole("button", { name: SECOND?.title })).toBeNull();
  });

  it("plays one song at a time and stops it with a second tap", async () => {
    render(<MusicBoxSheet childId="kid" doneSections={7} onClose={vi.fn()} />);
    const first = await screen.findByRole("button", { name: FIRST?.title });
    await waitFor(() => expect(first).toBeEnabled());

    fireEvent.click(first);
    expect(sound.playMusic).toHaveBeenLastCalledWith(soundUrl(FIRST?.id ?? ""));
    expect(first).toHaveAttribute("aria-pressed", "true");

    const second = screen.getByRole("button", { name: SECOND?.title });
    fireEvent.click(second);
    expect(sound.playMusic).toHaveBeenLastCalledWith(
      soundUrl(SECOND?.id ?? ""),
    );
    expect(first).toHaveAttribute("aria-pressed", "false");
    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(
      document.querySelectorAll('[data-song-state="playing"]'),
    ).toHaveLength(1);

    fireEvent.click(second);
    expect(sound.stopMusic).toHaveBeenCalled();
    expect(second).toHaveAttribute("aria-pressed", "false");
  });

  it("goes back to ready when a song ends by itself", async () => {
    render(<MusicBoxSheet childId="kid" doneSections={1} onClose={vi.fn()} />);
    const first = await screen.findByRole("button", { name: FIRST?.title });
    await waitFor(() => expect(first).toBeEnabled());
    fireEvent.click(first);
    ends.get(soundUrl(FIRST?.id ?? "") ?? "")?.();
    await waitFor(() => expect(first).toHaveAttribute("aria-pressed", "false"));
  });

  it("cannot play with sound off, and says how to turn it on", async () => {
    await setSoundEnabled("kid", false);
    render(<MusicBoxSheet childId="kid" doneSections={7} onClose={vi.fn()} />);
    await waitFor(() =>
      expect(document.querySelector("[data-music-muted]")).not.toBeNull(),
    );
    const first = screen.getByRole("button", { name: FIRST?.title });
    expect(first).toBeDisabled();
    fireEvent.click(first);
    expect(sound.playMusic).not.toHaveBeenCalled();
    expect(sound.stopMusic).toHaveBeenCalled();
  });

  it("stops the song when the sheet closes (the screen is left)", async () => {
    const view = render(
      <MusicBoxSheet childId="kid" doneSections={1} onClose={vi.fn()} />,
    );
    const first = await screen.findByRole("button", { name: FIRST?.title });
    await waitFor(() => expect(first).toBeEnabled());
    fireEvent.click(first);
    vi.mocked(sound.stopMusic).mockClear();
    view.unmount();
    expect(sound.stopMusic).toHaveBeenCalled();
  });

  it("opens from the home chip and closes again", async () => {
    render(<MusicBoxChip childId="kid" doneSections={4} />);
    expect(screen.getByText("Hộp nhạc · 2 bài")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Hộp nhạc/ }));
    expect(
      screen.getByRole("dialog", { name: "Hộp nhạc" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("music reward", () => {
  it("shows nothing when no song was won", () => {
    const { container } = render(
      <MusicReward childId="kid" doneSections={2} songs={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("offers the new song and opens the box with it marked new", async () => {
    render(
      <MusicReward
        childId="kid"
        doneSections={1}
        songs={FIRST ? [FIRST] : []}
      />,
    );
    expect(screen.getByText(new RegExp(FIRST?.title ?? ""))).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Mở hộp nhạc" }));
    const row = document.querySelector(`[data-song="${FIRST?.id}"]`);
    expect(row?.textContent).toContain("Mới");
  });
});
