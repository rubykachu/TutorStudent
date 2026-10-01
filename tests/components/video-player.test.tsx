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

describe("checkpoints", () => {
  const WITH_STOPS: Video = {
    ...VIDEO,
    checkpoints: [
      { id: "cp-01", at: 10, from: 0 },
      { id: "cp-02", at: 25, from: 10 },
    ],
  };

  function setup(video: Video = WITH_STOPS, clip?: Video["clips"][number]) {
    const { container } = render(<VideoPlayer video={video} clip={clip} />);
    const element = videoElement(container);
    element.pause = vi.fn();
    element.play = vi.fn(() => Promise.resolve());
    fireEvent.play(element);
    return element;
  }
  const at = (element: HTMLVideoElement, time: number) => {
    element.currentTime = time;
    fireEvent.timeUpdate(element);
  };

  it("pauses where playback crosses a checkpoint and waits for the child", () => {
    const element = setup();
    at(element, 9);
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
    at(element, 10.2);
    expect(element.pause).toHaveBeenCalled();
    expect(element.currentTime).toBe(10);
    expect(screen.getByRole("button", { name: "Xem tiếp" })).toBeVisible();
    expect(screen.getByText("Đoạn 1/2")).toBeVisible();
  });

  it("goes on past the checkpoint with Xem tiếp, and stops at the next one", () => {
    const element = setup();
    at(element, 10.2);
    fireEvent.click(screen.getByRole("button", { name: "Xem tiếp" }));
    expect(element.play).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
    at(element, 10.4);
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
    at(element, 25.1);
    expect(screen.getByText("Đoạn 2/2")).toBeVisible();
  });

  it("restarts the part from its start with Xem lại đoạn này", () => {
    const element = setup();
    at(element, 10.2);
    at(element, 25.1);
    fireEvent.click(screen.getByRole("button", { name: /Xem lại đoạn này/ }));
    expect(element.currentTime).toBe(10);
    expect(element.play).toHaveBeenCalled();
    at(element, 25.2);
    expect(screen.getByText("Đoạn 2/2")).toBeVisible();
  });

  it("does not stop when the child seeks past a checkpoint", () => {
    const element = setup();
    element.currentTime = 30;
    fireEvent.seeking(element);
    fireEvent.seeked(element);
    at(element, 30.2);
    expect(element.pause).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
  });

  it("ignores checkpoints while a clip plays", () => {
    const element = setup(WITH_STOPS, { ...VIDEO.clips[0], end: 40 } as never);
    at(element, 10.2);
    expect(screen.queryByRole("button", { name: "Xem tiếp" })).toBeNull();
  });

  it("leaves a video without checkpoints alone", () => {
    const element = setup(VIDEO);
    at(element, 10.2);
    expect(element.pause).not.toHaveBeenCalled();
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
