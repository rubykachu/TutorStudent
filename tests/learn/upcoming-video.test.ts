import { describe, expect, it } from "vitest";
import type { SectionStep } from "@/learn/section-steps";
import { upcomingVideo } from "@/learn/upcoming-video";
import type { SectionBlock, Video } from "@/schema/content";

const video = (id: string) => ({ id }) as Video;
const VIDEOS = [video("l.video.a"), video("l.video.b")];

const note: SectionBlock = { type: "note", text: "Một câu." };
const videoBlock = (videoId: string): SectionBlock => ({
  type: "video",
  videoId,
});
const block = (b: SectionBlock, index: number): SectionStep => ({
  kind: "block",
  position: { phase: "blocks", index },
  block: b,
});

describe("upcomingVideo", () => {
  it("picks the video of the next screen while the child reads the one before", () => {
    const steps = [block(note, 0), block(videoBlock("l.video.a"), 1)];
    expect(upcomingVideo(steps, 0, VIDEOS)?.id).toBe("l.video.a");
  });

  it("picks nothing when the child is already on a video screen: one video loads at a time", () => {
    const steps = [
      block(videoBlock("l.video.a"), 0),
      block(videoBlock("l.video.b"), 1),
    ];
    expect(upcomingVideo(steps, 0, VIDEOS)).toBeUndefined();
  });

  it("looks one screen ahead only, and drops it once the child passed it", () => {
    const steps = [
      block(note, 0),
      block(note, 1),
      block(videoBlock("l.video.a"), 2),
      block(note, 3),
    ];
    expect(upcomingVideo(steps, 0, VIDEOS)).toBeUndefined();
    expect(upcomingVideo(steps, 1, VIDEOS)?.id).toBe("l.video.a");
    expect(upcomingVideo(steps, 3, VIDEOS)).toBeUndefined();
  });

  it("picks nothing for a video the lesson does not list yet, or no next screen", () => {
    const steps = [block(note, 0), block(videoBlock("l.video.c"), 1)];
    expect(upcomingVideo(steps, 0, VIDEOS)).toBeUndefined();
    expect(upcomingVideo(steps, 1, VIDEOS)).toBeUndefined();
  });
});
