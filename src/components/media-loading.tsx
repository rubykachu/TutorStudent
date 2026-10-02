import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { percentLabel } from "@/lib/media-download";
import { Owl } from "@/mascot/owl";

const RING_STROKE = 5;
const RING_RADIUS = 21;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
// Share of the ring drawn while the length is unknown: it turns, or under
// reduced motion stays put as a quarter.
const UNKNOWN_ARC = 0.25;

type ProgressRingProps = {
  // 0–1, or undefined while the total is unknown.
  fraction: number | undefined;
  className?: string;
  children?: ReactNode;
};

// A ring that fills as the file arrives, with its content (the owl) in the
// middle. `className` sets its size and position.
export function ProgressRing({
  fraction,
  className = "relative inline-flex size-24",
  children,
}: ProgressRingProps) {
  const known = fraction !== undefined;
  const drawn = known ? fraction : UNKNOWN_ARC;
  return (
    <span className={`shrink-0 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className={`absolute inset-0 size-full -rotate-90 ${known ? "" : "animate-spin motion-reduce:animate-none"}`}
      >
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE}
          className="stroke-muted"
        />
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - drawn)}
          className="stroke-primary"
          data-ring-arc
        />
      </svg>
      <span className="relative m-auto flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}

// What the child reads while the file arrives: the percentage when it is
// known, the amount received when only that is, and never a bare spinner.
export function loadingText(
  fraction: number | undefined,
  receivedBytes = 0,
): string {
  if (fraction !== undefined) return `Đang tải… ${percentLabel(fraction)}%`;
  if (receivedBytes > 0)
    return `Đang tải… ${Math.ceil(receivedBytes / 1024)} KB`;
  return "Đang tải…";
}

type MediaLoadingProps = {
  fraction: number | undefined;
  receivedBytes?: number;
  // Names what loads: "video" or "lời đọc".
  what: string;
};

// Over a video's picture: the owl inside a progress ring and the words.
export function MediaLoading({
  fraction,
  receivedBytes,
  what,
}: MediaLoadingProps) {
  const text = loadingText(fraction, receivedBytes);
  return (
    <span
      role="progressbar"
      aria-label={`Đang tải ${what}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={
        fraction === undefined ? undefined : percentLabel(fraction)
      }
      aria-valuetext={text}
      data-media-loading
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-foreground/35"
    >
      <ProgressRing
        fraction={fraction}
        className="relative inline-flex size-20 md:size-24"
      >
        <Owl expression="idle" size="exercise" />
      </ProgressRing>
      <span
        data-media-loading-text
        className="rounded-full bg-surface px-4 py-1 font-semibold text-caption text-foreground shadow-card"
      >
        {text}
      </span>
    </span>
  );
}

type MediaLoadErrorProps = {
  onRetry: () => void;
  className?: string;
};

// The download failed: a friendly line and one big button to try again.
export function MediaLoadError({
  onRetry,
  className = "",
}: MediaLoadErrorProps) {
  return (
    <span
      role="alert"
      data-media-error
      className={`flex flex-col items-center justify-center gap-2 text-center ${className}`}
    >
      <span className="font-semibold text-caption">
        Mạng đang yếu nên chưa tải được. Bạn thử lại nhé!
      </span>
      <button
        type="button"
        onClick={onRetry}
        data-media-retry
        className="inline-flex min-h-touch items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-card"
      >
        <RotateCw aria-hidden className="size-5" />
        Thử lại
      </button>
    </span>
  );
}
