import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { VideoPlayer } from "@/components/blocks/video-player";
import { VideoPreload } from "@/components/blocks/video-preload";
import { CardClip } from "@/learn/card-clip";
import { clearPreloaded, storePreloaded } from "@/lib/media-download";
import type { Video } from "@/schema/content";

const VIDEO_URL = "/media/video/fixture/gioi-thieu.mp4";

// A download the test feeds chunk by chunk.
function controlledDownload(totalBytes: number | null) {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });
  const headers: Record<string, string> = { "Content-Type": "video/mp4" };
  if (totalBytes !== null) headers["Content-Length"] = String(totalBytes);
  return {
    response: new Response(body, { headers }),
    push: async (bytes: number) => {
      controller.enqueue(new Uint8Array(bytes));
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
    finish: async () => {
      controller.close();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
  };
}

const created: string[] = [];
const revoked: string[] = [];

beforeEach(() => {
  clearPreloaded();
  URL.createObjectURL = vi.fn(() => {
    const url = `blob:test-${created.length}`;
    created.push(url);
    return url;
  });
  URL.revokeObjectURL = vi.fn((url: string) => {
    revoked.push(url);
  });
});

afterEach(() => {
  created.length = 0;
  revoked.length = 0;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const VIDEO: Video = {
  id: "fixture.video.gioi-thieu",
  lessonId: "fixture",
  url: "video/fixture/gioi-thieu.mp4",
  vttUrl: "video/fixture/gioi-thieu.vtt",
  posterUrl: "video/fixture/gioi-thieu.jpg",
  durationSec: 60,
  clips: [
    { id: "mo-dau", start: 4, end: 20, cardIds: ["fixture.card.nhan-lap"] },
  ],
  voice: { engine: "local", voiceName: "Hải Đăng", model: "vieneu" },
};

function videoElement(container: HTMLElement): HTMLVideoElement {
  const video = container.querySelector("video");
  if (!video) throw new Error("no video element");
  return video;
}

describe("VideoPlayer", () => {
  it("waits for the child: no autoplay, a big play button, inline on iPad", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    expect(video.autoplay).toBe(false);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.controls).toBe(false);
    expect(screen.getByRole("button", { name: "Phát video" })).toBeVisible();
    // Nothing is fetched until the child asks (or the screen is the video's).
    expect(video.hasAttribute("src")).toBe(false);
    expect(video.getAttribute("poster")).toBe(
      "/media/video/fixture/gioi-thieu.jpg",
    );
  });

  it("loads Vietnamese captions and shows them by default", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const track = container.querySelector("track");
    expect(track?.getAttribute("src")).toBe(
      "/media/video/fixture/gioi-thieu.vtt",
    );
    expect(track?.getAttribute("srclang")).toBe("vi");
    const toggle = screen.getByRole("button", { name: "Phụ đề: bật" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Phụ đề: tắt" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows native controls once playback starts", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    fireEvent.play(video);
    expect(video.controls).toBe(true);
    expect(screen.queryByRole("button", { name: "Phát video" })).toBeNull();
  });

  it("downloads at once when the screen is the video's, and only on the tap otherwise", () => {
    const fetchMock = vi.fn(
      (_url: string) => new Promise<Response>(() => undefined),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { unmount } = render(<VideoPlayer video={VIDEO} />);
    expect(fetchMock).not.toHaveBeenCalled();
    unmount();
    render(<VideoPlayer video={VIDEO} preload="auto" />);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(VIDEO_URL);
    // The download is invisible until the child taps play.
    expect(screen.getByRole("button", { name: "Phát video" })).toBeVisible();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("shows the real percentage from the tap until the file is here, then plays from memory", async () => {
    const download = controlledDownload(1000);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => download.response),
    );
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    const play = vi.fn(() => Promise.resolve());
    video.play = play;

    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    expect(screen.queryByRole("button", { name: "Phát video" })).toBeNull();
    // Before the first byte: not a bare spinner, but a card with its words.
    await waitFor(() =>
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuetext",
        "Đang tải… 0%",
      ),
    );
    await download.push(450);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "45",
    );
    expect(
      container.querySelector("[data-media-loading-text]"),
    ).toHaveTextContent("Đang tải… 45%");
    expect(play).not.toHaveBeenCalled();
    expect(video.hasAttribute("src")).toBe(false);

    await download.push(550);
    await download.finish();
    await waitFor(() => expect(video.getAttribute("src")).toBe("blob:test-0"));
    await waitFor(() => expect(play).toHaveBeenCalledOnce());
    fireEvent.playing(video);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("shows the loading card again on a stall, with what the element has buffered when it streams the file itself", async () => {
    // No Content-Length: the percentage cannot come from the download.
    const download = controlledDownload(null);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => download.response),
    );
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    video.play = vi.fn(() => Promise.resolve());
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    await waitFor(() => expect(video.getAttribute("src")).toBe(VIDEO_URL));
    fireEvent.playing(video);
    expect(screen.queryByRole("progressbar")).toBeNull();

    Object.defineProperty(video, "duration", { value: 60, configurable: true });
    Object.defineProperty(video, "currentTime", {
      value: 10,
      configurable: true,
    });
    Object.defineProperty(video, "buffered", {
      value: { length: 1, start: () => 0, end: () => 24 },
      configurable: true,
    });
    fireEvent.waiting(video);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Đang tải… 40%",
    );
    fireEvent.stalled(video);
    fireEvent.playing(video);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("says so kindly when the download fails and tries again on 'Thử lại'", async () => {
    const download = controlledDownload(100);
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("network"))
      .mockImplementation(async () => download.response);
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    video.play = vi.fn(() => Promise.resolve());
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Bạn thử lại nhé",
    );
    expect(screen.queryByRole("progressbar")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await download.push(100);
    await download.finish();
    await waitFor(() => expect(video.getAttribute("src")).toBe("blob:test-0"));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("gives the play button back when the browser refuses to play", async () => {
    const download = controlledDownload(10);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => download.response),
    );
    const { container } = render(<VideoPlayer video={VIDEO} />);
    videoElement(container).play = vi.fn(() => Promise.reject(new Error("no")));
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    await download.push(10);
    await download.finish();
    expect(
      await screen.findByRole("button", { name: "Phát video" }),
    ).toBeVisible();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("takes the file the next-screen preload already fetched, with no new request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    storePreloaded(VIDEO_URL, new Blob(["x"]));
    const { container } = render(<VideoPlayer video={VIDEO} preload="auto" />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(videoElement(container).getAttribute("src")).toBe("blob:test-0");
  });

  it("frees the in-memory file when the player goes away", async () => {
    const download = controlledDownload(10);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => download.response),
    );
    const { container, unmount } = render(
      <VideoPlayer video={VIDEO} preload="auto" />,
    );
    await download.push(10);
    await download.finish();
    await waitFor(() =>
      expect(videoElement(container).getAttribute("src")).toBe("blob:test-0"),
    );
    unmount();
    expect(revoked).toContain("blob:test-0");
  });

  it("plays a clip from its start and stops at its end", () => {
    const [clip] = VIDEO.clips;
    const { container } = render(<VideoPlayer video={VIDEO} clip={clip} />);
    const video = videoElement(container);
    video.currentTime = 30;
    fireEvent.play(video);
    expect(video.currentTime).toBe(4);
    let paused = false;
    video.pause = () => {
      paused = true;
    };
    video.currentTime = 20;
    fireEvent.timeUpdate(video);
    expect(paused).toBe(true);
  });
});

describe("playing through", () => {
  it("never pauses by itself, wherever playback goes", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const element = videoElement(container);
    element.pause = vi.fn();
    fireEvent.play(element);
    for (const time of [3, 10, 25, 59]) {
      element.currentTime = time;
      fireEvent.timeUpdate(element);
    }
    expect(element.pause).not.toHaveBeenCalled();
    expect(container.querySelector("[data-video-checkpoint-veil]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
    // Only the native controls and the caption switch remain.
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("keeps the caption inside the video card, and drops it when switched off", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const card = container.querySelector("[data-block=video] > div");
    const caption = container.querySelector("[data-video-caption]");
    expect(caption?.parentElement).toBe(card);
    fireEvent.click(screen.getByRole("button", { name: "Phụ đề: bật" }));
    expect(container.querySelector("[data-video-caption]")).toBeNull();
  });
});

describe("video block", () => {
  it("shows a placeholder while the lesson has no such video", () => {
    const { container } = render(
      <BlockView block={{ type: "video", videoId: "fixture.video.chua-co" }} />,
    );
    expect(container.querySelector("[data-video-missing]")).not.toBeNull();
  });

  it("fetches the video of the screen the child is on ahead of the tap", () => {
    const fetchMock = vi.fn(
      (_url: string) => new Promise<Response>(() => undefined),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(
      <BlockView
        block={{ type: "video", videoId: VIDEO.id }}
        videos={[VIDEO]}
      />,
    );
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("plays the listed video", () => {
    const { container } = render(
      <BlockView
        block={{ type: "video", videoId: VIDEO.id }}
        videos={[VIDEO]}
      />,
    );
    expect(
      container.querySelector(`[data-video="${VIDEO.id}"]`),
    ).not.toBeNull();
  });
});

describe("VideoPreload", () => {
  it("fetches the video unseen, keeps it in memory for the player, and stops when the screen is left", async () => {
    const download = controlledDownload(4);
    const fetchMock = vi.fn(async (_url: string) => download.response);
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<VideoPreload video={VIDEO} />);
    expect(container.querySelector("video")).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(VIDEO_URL);
    await download.push(4);
    await download.finish();
    const player = render(<VideoPlayer video={VIDEO} preload="auto" />);
    await waitFor(() =>
      expect(videoElement(player.container).getAttribute("src")).toBe(
        "blob:test-0",
      ),
    );
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("aborts an unfinished download on leaving and keeps nothing", async () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        return controlledDownload(10).response;
      }),
    );
    const { unmount } = render(<VideoPreload video={VIDEO} />);
    await act(async () => {
      await Promise.resolve();
    });
    unmount();
    expect(signal?.aborted).toBe(true);
    expect(created).toEqual([]);
  });
});

describe("CardClip", () => {
  it("offers the card's clip on request only", () => {
    const { container } = render(
      <CardClip lesson={{ videos: [VIDEO] }} cardId="fixture.card.nhan-lap" />,
    );
    expect(container.querySelector("video")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Xem lại đoạn video" }));
    expect(videoElement(container).hasAttribute("src")).toBe(false);
  });

  it("shows nothing for a card without a clip", () => {
    const { container } = render(
      <CardClip lesson={{ videos: [VIDEO] }} cardId="fixture.card.khac" />,
    );
    expect(container.innerHTML).toBe("");
  });
});
