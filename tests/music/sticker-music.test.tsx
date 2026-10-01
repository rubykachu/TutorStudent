import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StickerSheet } from "@/app/(child)/sticker-sheet";
import { soundUrl } from "@/lib/sound-manifest";
import { pickSong, SONGS } from "@/music/songs";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";
import type { LessonSummary } from "@/schema/content";

// A song stays "playing" until the test ends it.
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

const lesson: LessonSummary = {
  id: "a",
  subject: "math",
  series: "kntt",
  order: 1,
  title: "Phép cộng",
  sourceRef: "SGK",
  sections: [{ id: "a.section.1", title: "Phần 1", minutes: 5 }],
  cardCount: 1,
  hasOverview: false,
  sticker: { name: "Sao", visualId: "fixture.visual.star-sticker" },
};

function sheet(earned: boolean) {
  return render(
    <StickerSheet
      childId="kid"
      lesson={lesson}
      fill={{ done: earned ? 1 : 0, total: 1 }}
      earned={earned}
      onClose={vi.fn()}
    />,
  );
}

const songUrls = SONGS.map((song) => soundUrl(song.id));

async function musicButton() {
  const button = await screen.findByRole("button", { name: /nhạc/ });
  await waitFor(() => expect(button).toBeEnabled());
  return button;
}

describe("pickSong", () => {
  it("picks at random from the list", () => {
    expect(pickSong(SONGS, null, () => 0)).toBe(SONGS[0]);
    expect(pickSong(SONGS, null, () => 0.99)).toBe(SONGS.at(-1));
  });

  it("never repeats the song just heard while there is another", () => {
    for (const last of SONGS) {
      for (const r of [0, 0.4, 0.99]) {
        expect(pickSong(SONGS, last.id, () => r)?.id).not.toBe(last.id);
      }
    }
    const [only] = SONGS;
    expect(pickSong(only ? [only] : [], only?.id ?? null)).toBe(only);
  });

  it("ships songs whose clips exist and are not preloaded", () => {
    expect(SONGS.length).toBeGreaterThan(1);
    for (const url of songUrls) expect(url).toBeDefined();
  });
});

describe("the sticker sheet's music button", () => {
  it("plays a random song and stops it on a second press", async () => {
    sheet(true);
    const button = await musicButton();
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(sound.playMusic).toHaveBeenCalledTimes(1);
    expect(songUrls).toContain(vi.mocked(sound.playMusic).mock.calls[0]?.[0]);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Dừng nhạc");

    fireEvent.click(button);
    expect(sound.stopMusic).toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("Nghe nhạc");
  });

  it("is there for a sticker not earned yet too", async () => {
    sheet(false);
    expect(await musicButton()).toBeInTheDocument();
  });

  it("plays a different song each time", async () => {
    sheet(true);
    const button = await musicButton();
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    const [first, second] = vi
      .mocked(sound.playMusic)
      .mock.calls.map((call) => call[0]);
    expect(first).not.toBe(second);
  });

  it("goes back to ready when the song ends by itself", async () => {
    sheet(true);
    const button = await musicButton();
    fireEvent.click(button);
    const url = vi.mocked(sound.playMusic).mock.calls[0]?.[0] ?? "";
    ends.get(url)?.();
    await waitFor(() =>
      expect(button).toHaveAttribute("aria-pressed", "false"),
    );
  });

  it("cannot play with sound off, and says how to turn it on", async () => {
    await setSoundEnabled("kid", false);
    sheet(true);
    await waitFor(() =>
      expect(document.querySelector("[data-music-muted]")).not.toBeNull(),
    );
    const button = screen.getByRole("button", { name: /Nghe nhạc/ });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(sound.playMusic).not.toHaveBeenCalled();
  });

  it("stops the song when the sheet closes", async () => {
    const view = sheet(true);
    fireEvent.click(await musicButton());
    vi.mocked(sound.stopMusic).mockClear();
    view.unmount();
    expect(sound.stopMusic).toHaveBeenCalled();
  });

  it("leaves the press sound out, since the song is the sound", async () => {
    sheet(true);
    expect(await musicButton()).toHaveAttribute("data-own-sound");
  });
});

describe("the sticker sheet's effects", () => {
  it("bounces with confetti when earned, and only rocks gently when not", () => {
    const earned = sheet(true);
    expect(document.querySelector("[data-looping='bounce']")).not.toBeNull();
    expect(document.querySelector("[data-confetti]")).not.toBeNull();
    earned.unmount();
    sheet(false);
    expect(document.querySelector("[data-looping='float']")).not.toBeNull();
    expect(document.querySelector("[data-looping='bounce']")).toBeNull();
    expect(document.querySelector("[data-confetti]")).toBeNull();
  });
});
