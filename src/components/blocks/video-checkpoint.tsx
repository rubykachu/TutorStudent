import { ChevronRight, Pause, RotateCcw } from "lucide-react";
import { BigButton } from "@/components/big-button";

// What the player shows while a video waits at a checkpoint: a veil over the
// picture saying it stopped, and, under the picture where there is room for
// big touch buttons, the child's two choices. Two pieces because the picture
// of a phone is too short to hold both buttons without squeezing their
// words.

// Drawn over the picture; it takes no touch.
export function CheckpointVeil() {
  return (
    <div
      aria-hidden
      data-video-checkpoint-veil
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-foreground/70"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-surface text-primary shadow-card md:size-20">
        <Pause aria-hidden className="size-8 fill-current md:size-10" />
      </span>
    </div>
  );
}

export type CheckpointControlsProps = {
  // Position of this stop among the video's stops, from 0.
  index: number;
  total: number;
  onContinue: () => void;
  onReplay: () => void;
};

// "Xem tiếp" goes on; "Xem lại đoạn này" plays the last part again. The child
// sets the pace, so nothing starts by itself. It is not worded "Tiếp", which
// is the section's own button at the bottom of the screen that leaves the
// video.
export function CheckpointControls({
  index,
  total,
  onContinue,
  onReplay,
}: CheckpointControlsProps) {
  return (
    <section
      data-video-checkpoint
      aria-label="Dừng lại một chút"
      className="mt-3 flex flex-col gap-3"
    >
      <p className="text-center font-semibold text-body">
        Dừng lại một chút
        <span className="ml-2 font-normal text-caption text-muted-foreground">
          {`Đoạn ${index + 1}/${total}`}
        </span>
      </p>
      <BigButton data-checkpoint-continue onClick={onContinue}>
        Xem tiếp
        <ChevronRight aria-hidden className="size-6" />
      </BigButton>
      <BigButton variant="secondary" data-checkpoint-replay onClick={onReplay}>
        <RotateCcw aria-hidden className="size-6" />
        Xem lại đoạn này
      </BigButton>
    </section>
  );
}
