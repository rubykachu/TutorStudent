import { Circle, CircleCheck, CircleDot, type LucideIcon } from "lucide-react";
import type { SectionState } from "@/progress/db";

// Each state pairs its colour with an icon so it never relies on colour alone.
const STATE_BADGES: Record<
  SectionState,
  { label: string; icon: LucideIcon; className: string }
> = {
  not_started: {
    label: "Chưa học",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "Đang học",
    icon: CircleDot,
    className: "bg-muted text-foreground",
  },
  done: {
    label: "Xong",
    icon: CircleCheck,
    className: "bg-correct-soft text-correct-soft-foreground",
  },
};

// Progress of a lesson or section: not started, in progress or done.
export function StateBadge({ state }: { state: SectionState }) {
  const badge = STATE_BADGES[state];
  const Icon = badge.icon;
  return (
    <span
      data-state={state}
      className={`${badge.className} inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-caption font-semibold`}
    >
      <Icon aria-hidden className="size-5" />
      {badge.label}
    </span>
  );
}
