import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { VideoPlayer } from "@/components/blocks/video-player";
import { VideoPreload } from "@/components/blocks/video-preload";
import { CardClip } from "@/learn/card-clip";
import type { Video } from "@/schema/content";

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
    expect(video.getAttribute("src")).toBe(
      "/media/video/fixture/gioi-thieu.mp4",
    );
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

  it("only fetches the first bytes until told the child is near", () => {
    const { container, rerender } = render(<VideoPlayer video={VIDEO} />);
    expect(videoElement(container).getAttribute("preload")).toBe("metadata");
    rerender(<VideoPlayer video={VIDEO} preload="auto" />);
    expect(videoElement(container).getAttribute("preload")).toBe("auto");
  });

  it("shows a spinner over the poster the moment play is tapped, until the first frame", () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    const video = videoElement(container);
    // Playback never starts by itself in jsdom: the picture is still the poster.
    video.play = vi.fn(() => new Promise<void>(() => undefined));
    expect(container.querySelector("[data-video-spinner]")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    expect(video.play).toHaveBeenCalled();
    expect(container.querySelector("[data-video-spinner]")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Phát video" })).toBeNull();
    fireEvent.playing(video);
    expect(container.querySelector("[data-video-spinner]")).toBeNull();
    // A stall while playing brings it back.
    fireEvent.waiting(video);
    expect(container.querySelector("[data-video-spinner]")).not.toBeNull();
  });

  it("gives the play button back when the browser refuses to play", async () => {
    const { container } = render(<VideoPlayer video={VIDEO} />);
    videoElement(container).play = vi.fn(() => Promise.reject(new Error("no")));
    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    expect(
      await screen.findByRole("button", { name: "Phát video" }),
    ).toBeVisible();
    expect(container.querySelector("[data-video-spinner]")).toBeNull();
  });

  it("plays a clip from its start and stops at its end", () => {
    const [clip] = VIDEO.clips;
    const { container } = render(<VideoPlayer video={VIDEO} clip={clip} />);
    const video = videoElement(container);
    expect(video.getAttribute("src")).toBe(
      "/media/video/fixture/gioi-thieu.mp4#t=4,20",
    );
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
    const { container } = render(
      <BlockView
        block={{ type: "video", videoId: VIDEO.id }}
        videos={[VIDEO]}
      />,
    );
    expect(videoElement(container).getAttribute("preload")).toBe("auto");
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
  it("fetches the video unseen, and stops the download when the screen is left", () => {
    const load = vi.spyOn(HTMLMediaElement.prototype, "load");
    const { container, unmount } = render(<VideoPreload video={VIDEO} />);
    const element = videoElement(container);
    expect(element.getAttribute("preload")).toBe("auto");
    expect(element.getAttribute("src")).toBe(
      "/media/video/fixture/gioi-thieu.mp4",
    );
    expect(element.hidden).toBe(true);
    expect(element.getAttribute("crossorigin")).toBe("anonymous");
    load.mockClear();
    unmount();
    expect(element.hasAttribute("src")).toBe(false);
    expect(load).toHaveBeenCalled();
    load.mockRestore();
  });
});

describe("CardClip", () => {
  it("offers the card's clip on request only", () => {
    const { container } = render(
      <CardClip lesson={{ videos: [VIDEO] }} cardId="fixture.card.nhan-lap" />,
    );
    expect(container.querySelector("video")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Xem lại đoạn video" }));
    expect(videoElement(container).getAttribute("src")).toContain("#t=4,20");
  });

  it("shows nothing for a card without a clip", () => {
    const { container } = render(
      <CardClip lesson={{ videos: [VIDEO] }} cardId="fixture.card.khac" />,
    );
    expect(container.innerHTML).toBe("");
  });
});
