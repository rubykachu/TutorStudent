import { RegistryVisual } from "@/visuals/registry-visual";

type StickerProps = {
  visualId: string;
  name: string;
  // Sections of the lesson done, out of `total`: the sticker fills with
  // colour from the bottom up as sections are finished, and is fully coloured
  // (earned) once `done` reaches `total`.
  done: number;
  total: number;
  className?: string;
};

// Share of the sticker drawn in colour, in [0, 1].
export function stickerFillRatio(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.max(done / total, 0), 1);
}

function label(name: string, done: number, total: number, ratio: number) {
  if (ratio >= 1) return `Sticker ${name}`;
  if (ratio <= 0) return `Sticker ${name}, chưa nhận`;
  return `Sticker ${name}, đã tô ${done}/${total} phần`;
}

// A lesson's sticker, drawn by its registered visual. Not earned yet, it is a
// grey silhouette that shows what there is to win; each finished section
// colours a further slice of it, bottom up, so progress is visible without
// numbers.
export function Sticker({
  visualId,
  name,
  done,
  total,
  className = "",
}: StickerProps) {
  const ratio = stickerFillRatio(done, total);
  const layer = "col-start-1 row-start-1 w-full";
  return (
    <div
      role="img"
      aria-label={label(name, done, total, ratio)}
      data-sticker-earned={ratio >= 1}
      data-sticker-fill={`${Math.min(done, total)}/${total}`}
      className={`flex items-center justify-center ${className}`}
    >
      <div aria-hidden className="grid w-full">
        {ratio < 1 && (
          <div className={`${layer} opacity-40 grayscale`}>
            <RegistryVisual id={visualId} />
          </div>
        )}
        {ratio > 0 && (
          <div
            className={layer}
            data-sticker-colour
            // The coloured copy is cut to its lower part: the rest shows the
            // grey silhouette underneath.
            style={
              ratio < 1
                ? { clipPath: `inset(${(1 - ratio) * 100}% 0 0 0)` }
                : undefined
            }
          >
            <RegistryVisual id={visualId} />
          </div>
        )}
      </div>
    </div>
  );
}
