import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { VideoPlayer } from "@/components/blocks/video-player";
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

describe("video block", () => {
  it("shows a placeholder while the lesson has no such video", () => {
    const { container } = render(
      <BlockView block={{ type: "video", videoId: "fixture.video.chua-co" }} />,
    );
    expect(container.querySelector("[data-video-missing]")).not.toBeNull();
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
