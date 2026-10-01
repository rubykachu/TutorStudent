import { ChevronRight, RotateCcw } from "lucide-react";
import { bigButtonClassName } from "@/components/big-button";

export type CheckpointOverlayProps = {
  // Position of this stop among the video's stops, from 0.
  index: number;
  total: number;
  onContinue: () => void;
  onReplay: () => void;
};

// Drawn over the picture while a video waits at a checkpoint: the child
// decides when to go on ("Tiếp") or to see the last part again. Compact, two
// buttons side by side, so it fits a phone-sized picture; every button keeps
// the touch height.
export function CheckpointOverlay({
  index,
  total,
  onContinue,
  onReplay,
}: CheckpointOverlayProps) {
  return (
    <div
      data-video-checkpoint
      role="group"
      aria-label="Dừng lại một chút"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-foreground/80 p-3 md:gap-5 md:p-6"
    >
      <p className="flex flex-col items-center text-center font-heading font-bold text-surface text-block md:text-block-lg">
        Dừng lại một chút
        <span className="font-sans font-semibold text-caption text-surface/80">
          {`Đoạn ${index + 1}/${total}`}
        </span>
      </p>
      <div className="grid w-full max-w-lg grid-cols-2 gap-3">
        <button
          type="button"
          data-checkpoint-replay
          onClick={onReplay}
          className={bigButtonClassName(
            "secondary",
            "h-12 px-3 text-caption md:h-16 md:px-6 md:text-body-lg",
          )}
        >
          <RotateCcw aria-hidden className="size-5 shrink-0 md:size-6" />
          Xem lại đoạn này
        </button>
        <button
          type="button"
          data-checkpoint-continue
          onClick={onContinue}
          className={bigButtonClassName(
            "primary",
            "h-12 px-3 text-body md:h-16 md:px-6 md:text-body-lg",
          )}
        >
          Tiếp
          <ChevronRight aria-hidden className="size-6 shrink-0" />
        </button>
      </div>
    </div>
  );
}
