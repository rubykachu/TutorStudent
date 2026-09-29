import { RegistryVisual } from "@/visuals/registry-visual";

type StickerProps = {
  visualId: string;
  name: string;
  // Not earned yet: a grey silhouette that shows what there is to win.
  earned: boolean;
  className?: string;
};

// A lesson's sticker, drawn by its registered visual.
export function Sticker({
  visualId,
  name,
  earned,
  className = "",
}: StickerProps) {
  return (
    <div
      role="img"
      aria-label={earned ? `Sticker ${name}` : `Sticker ${name}, chưa nhận`}
      data-sticker-earned={earned}
      className={`flex items-center justify-center ${earned ? "" : "opacity-40 grayscale"} ${className}`}
    >
      <div aria-hidden className="w-full">
        <RegistryVisual id={visualId} />
      </div>
    </div>
  );
}
