import type { ReactNode } from "react";

// Holds the main "Tiếp" / "Kiểm tra" action in the thumb zone: pushed to the
// bottom of a flex-column screen and kept on screen while long content scrolls.
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      data-bottom-bar
      className="sticky bottom-0 z-10 mt-auto flex w-full flex-col self-stretch gap-3 bg-background pt-4 pb-4 md:pb-6"
    >
      {children}
    </div>
  );
}
