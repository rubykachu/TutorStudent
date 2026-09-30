import { BookOpen, Pencil, RefreshCw } from "lucide-react";
import type { ComponentType } from "react";

// What kind of screen the child is on, so a screen that explains is never
// taken for a question: a label on top of every screen of the players.
export type ScreenKind = "theory" | "check" | "practice" | "review" | "reask";

type Badge = {
  label: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  className: string;
};

const BADGES: Record<ScreenKind, Badge> = {
  theory: {
    label: "Lý thuyết",
    Icon: BookOpen,
    className: "bg-primary/10 text-primary",
  },
  check: {
    label: "Bài tập · Kiểm tra nhanh",
    Icon: Pencil,
    className: "bg-highlight text-foreground",
  },
  practice: {
    label: "Bài tập · Luyện tập",
    Icon: Pencil,
    className: "bg-highlight text-foreground",
  },
  review: {
    label: "Ôn tập",
    Icon: RefreshCw,
    className: "bg-concept-violet/10 text-concept-violet",
  },
  reask: {
    label: "Ôn tập · Hỏi lại",
    Icon: RefreshCw,
    className: "bg-concept-violet/10 text-concept-violet",
  },
};

export function screenBadgeLabel(kind: ScreenKind): string {
  return BADGES[kind].label;
}

export function ScreenBadge({ kind }: { kind: ScreenKind }) {
  const { label, Icon, className } = BADGES[kind];
  return (
    <p
      data-screen-kind={kind}
      className={`flex w-fit items-center gap-2 rounded-full px-3 py-1 font-semibold text-caption ${className}`}
    >
      <Icon aria-hidden className="size-4" />
      {label}
    </p>
  );
}
