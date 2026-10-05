import type { ReactNode } from "react";
import { SoundToggle } from "@/components/sound-toggle";
import type { FeedbackContext } from "@/user-feedback/context";
import { FeedbackButton } from "@/user-feedback/feedback-button";

// The top row of a child page: its way back on the left and the sound
// switch at the right end, where the lesson players keep it too. A lesson's
// pages pass `feedback` for the "Góp ý" button beside the switch.
export function PageTopBar({
  childId,
  children,
  feedback,
}: {
  childId: string;
  children: ReactNode;
  feedback?: FeedbackContext;
}) {
  return (
    <div className="flex items-center justify-between gap-2" data-page-top-bar>
      {children}
      <div className="flex shrink-0 items-center gap-2">
        {feedback && <FeedbackButton context={feedback} />}
        <SoundToggle childId={childId} />
      </div>
    </div>
  );
}
