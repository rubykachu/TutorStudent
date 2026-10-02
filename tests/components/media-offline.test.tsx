import "fake-indexeddb/auto";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StickerSheet } from "@/app/(child)/sticker-sheet";
import { VideoPlayer } from "@/components/blocks/video-player";
import { VideoPreload } from "@/components/blocks/video-preload";
import { NarrationPlayer, useNarration } from "@/learn/narration";
import { clearPreloaded, takePreloaded } from "@/lib/media-download";
import { resetNetworkStatusForTesting } from "@/lib/network-status";
import { appDb, resetAppDbForTesting, setSoundEnabled } from "@/progress/hooks";
import type { LessonSummary, Video } from "@/schema/content";

vi.mock("@/lib/sound", () => ({
  preloadSounds: vi.fn(),
  warmSounds: vi.fn(),
  stopMusic: vi.fn(),
  playMusic: vi.fn(() => new Promise<void>(() => undefined)),
}));

const VIDEO_URL = "/media/video/fixture/gioi-thieu.mp4";
const VIDEO: Video = {
  id: "fixture.video.gioi-thieu",
  lessonId: "fixture",
  url: "video/fixture/gioi-thieu.mp4",
  vttUrl: "video/fixture/gioi-thieu.vtt",
  posterUrl: "video/fixture/gioi-thieu.jpg",
  durationSec: 60,
  clips: [],
  voice: { engine: "local", voiceName: "Hải Đăng", model: "vieneu" },
};
const NARRATION = {
  audioUrl: "narration/fixture/overview.m4a",
  vttUrl: "narration/fixture/overview.vtt",
};

function setOnLine(value: boolean) {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(value);
}

async function goOnline() {
  setOnLine(true);
  await act(async () => {
    window.dispatchEvent(new Event("online"));
  });
}

const fileResponse = () =>
  new Response(new Uint8Array(4), {
    headers: { "Content-Type": "video/mp4", "Content-Length": "4" },
  });

beforeEach(() => {
  clearPreloaded();
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
});

afterEach(async () => {
  cleanup();
  resetNetworkStatusForTesting();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await appDb().delete();
  resetAppDbForTesting();
});

describe("video player offline", () => {
  it("says it needs the network, with no play button and no percentage, when the browser is offline", () => {
    setOnLine(false);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );
    render(<VideoPlayer video={VIDEO} />);
    expect(screen.getByText("Cần mạng để xem video")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Phát video" })).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("says it too when a download fails with a network error while the browser says online", async () => {
    const fetchMock = vi.fn(() =>
      Promise.reject(new TypeError("Failed to fetch")),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<VideoPlayer video={VIDEO} preload="auto" />);
    expect(await screen.findByText("Cần mạng để xem video")).toBeVisible();
    expect(screen.queryByText(/Thử lại/)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("keeps the plain retry card for a server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("no", { status: 500 }))),
    );
    render(<VideoPlayer video={VIDEO} preload="auto" />);
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    expect(await screen.findByText("Thử lại")).toBeVisible();
    expect(screen.queryByText("Cần mạng để xem video")).toBeNull();
  });

  it.each([
    ["the online event", () => goOnline()],
    [
      "the page becoming visible",
      async () => {
        await act(async () => {
          document.dispatchEvent(new Event("visibilitychange"));
        });
      },
    ],
  ])("starts the download again on %s", async (_name, recover) => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockImplementation(() => Promise.resolve(fileResponse()));
    vi.stubGlobal("fetch", fetchMock);
    render(<VideoPlayer video={VIDEO} preload="auto" />);
    await screen.findByText("Cần mạng để xem video");
    await recover();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByText("Cần mạng để xem video")).toBeNull(),
    );
    expect(screen.getByRole("button", { name: "Phát video" })).toBeVisible();
  });

  it("starts the download again on a tap of the state (wifi without internet)", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockImplementation(() => Promise.resolve(fileResponse()));
    vi.stubGlobal("fetch", fetchMock);
    render(<VideoPlayer video={VIDEO} preload="auto" />);
    fireEvent.click(await screen.findByText("Cần mạng để xem video"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByText("Cần mạng để xem video")).toBeNull(),
    );
  });
});

describe("video preload offline", () => {
  it("does not fetch while offline and fetches when the network is back", async () => {
    setOnLine(false);
    const fetchMock = vi.fn(() => Promise.resolve(fileResponse()));
    vi.stubGlobal("fetch", fetchMock);
    render(<VideoPreload video={VIDEO} />);
    expect(fetchMock).not.toHaveBeenCalled();
    await goOnline();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(takePreloaded(VIDEO_URL)).toBeDefined());
  });

  it("marks the network offline when its download fails with a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );
    render(
      <>
        <VideoPreload video={VIDEO} />
        <VideoPlayer video={VIDEO} />
      </>,
    );
    expect(await screen.findByText("Cần mạng để xem video")).toBeVisible();
  });
});

function Narrated() {
  const state = useNarration(NARRATION, 0);
  return <NarrationPlayer state={state} />;
}

describe("narration offline", () => {
  it("says it needs the network, with no percentage, when the browser is offline", () => {
    setOnLine(false);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );
    render(<Narrated />);
    expect(screen.getByText("Cần mạng để nghe đọc bài")).toBeVisible();
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("says it too when the download fails with a network error while the browser says online", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );
    render(<Narrated />);
    expect(await screen.findByText("Cần mạng để nghe đọc bài")).toBeVisible();
    expect(screen.queryByText(/Thử lại/)).toBeNull();
  });

  it("fetches again when the network is back and waits for a tap to play", async () => {
    let audioCalls = 0;
    const fetchMock = vi.fn((url: string) => {
      if (url.endsWith(".vtt")) return Promise.resolve(new Response(""));
      audioCalls++;
      if (audioCalls === 1) {
        return Promise.reject(new TypeError("Failed to fetch"));
      }
      return Promise.resolve(
        new Response(new Uint8Array(4), {
          headers: { "Content-Type": "audio/mp4", "Content-Length": "4" },
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<Narrated />);
    await screen.findByText("Cần mạng để nghe đọc bài");
    await goOnline();
    await waitFor(() =>
      expect(screen.queryByText("Cần mạng để nghe đọc bài")).toBeNull(),
    );
    // Back online the file is in memory, but nothing plays by itself.
    await waitFor(() =>
      expect(container.querySelector("audio")?.getAttribute("src")).toBe(
        "blob:test",
      ),
    );
    expect(
      container
        .querySelector("[data-overview-narration]")
        ?.getAttribute("data-overview-narration"),
    ).toBe("paused");
  });

  it("tries again on a tap of the state", async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn((url: string) => {
      calls.push(url);
      if (calls.filter((u) => !u.endsWith(".vtt")).length === 1) {
        return Promise.reject(new TypeError("Failed to fetch"));
      }
      return Promise.resolve(
        url.endsWith(".vtt")
          ? new Response("")
          : new Response(new Uint8Array(4), {
              headers: { "Content-Type": "audio/mp4", "Content-Length": "4" },
            }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Narrated />);
    fireEvent.click(await screen.findByText("Cần mạng để nghe đọc bài"));
    await waitFor(() =>
      expect(screen.queryByText("Cần mạng để nghe đọc bài")).toBeNull(),
    );
  });
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

describe("song button offline", () => {
  async function sheet() {
    await setSoundEnabled("kid", true);
    return render(
      <StickerSheet
        childId="kid"
        lesson={lesson}
        fill={{ done: 1, total: 1 }}
        earned
        onClose={vi.fn()}
      />,
    );
  }

  it("says it needs the network and is disabled while offline, then works when the network is back", async () => {
    setOnLine(false);
    await sheet();
    expect(
      await screen.findByText("Cần mạng để nghe nhạc"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Nghe nhạc/ })).toBeDisabled();
    await goOnline();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Nghe nhạc/ })).toBeEnabled(),
    );
    expect(screen.queryByText("Cần mạng để nghe nhạc")).toBeNull();
  });

  it("does not say it while online", async () => {
    await sheet();
    await screen.findByRole("button", { name: /Nghe nhạc/ });
    expect(screen.queryByText("Cần mạng để nghe nhạc")).toBeNull();
  });
});
