import type { ReactNode } from "react";
import { SoundToggle } from "@/components/sound-toggle";

// The top row of a child page: its way back on the left and the sound
// switch at the right end, where the lesson players keep it too.
export function PageTopBar({
  childId,
  children,
}: {
  childId: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2" data-page-top-bar>
      {children}
      <SoundToggle childId={childId} />
    </div>
  );
}
