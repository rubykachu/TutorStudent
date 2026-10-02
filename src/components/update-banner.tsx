import { RefreshCw } from "lucide-react";

// "A new build is ready": one line at the top of a screen outside the lesson
// players. No close cross: it stays until the child uses it or a safe moment
// applies the update by itself.
export function UpdateBanner({ onTap }: { onTap: () => void }) {
  return (
    <div
      className="mx-auto w-full max-w-[720px] px-4 pt-2 md:px-6"
      data-update-banner
    >
      <button
        type="button"
        onClick={onTap}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-surface px-4 text-body font-semibold text-primary select-none active:scale-[0.97] motion-reduce:transition-none"
      >
        <RefreshCw aria-hidden className="size-5" />
        Có bài mới, tải lại
      </button>
    </div>
  );
}
