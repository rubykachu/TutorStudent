import type { SectionStep } from "@/learn/section-steps";
import type { Video } from "@/schema/content";

// The video of the screen after the one the child is on, to fetch ahead; none
// when the child is already on a video screen (its own player fetches it, and
// only one video loads at a time) or the next screen has none.
export function upcomingVideo(
  steps: readonly SectionStep[],
  stepIndex: number,
  videos: readonly Video[],
): Video | undefined {
  const isVideo = (step: SectionStep | undefined) =>
    step?.kind === "block" && step.block.type === "video";
  if (isVideo(steps[stepIndex])) return undefined;
  const next = steps[stepIndex + 1];
  if (next?.kind !== "block" || next.block.type !== "video") return undefined;
  const { videoId } = next.block;
  return videos.find((video) => video.id === videoId);
}
