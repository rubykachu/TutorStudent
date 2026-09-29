import { Flame } from "lucide-react";
import type { Streak } from "@/progress/streak";

function restHint({ days, restDaysLeft }: Streak): string {
  if (days === 0) return "Học hôm nay nhé";
  return restDaysLeft > 0 ? `Còn ${restDaysLeft} ngày nghỉ` : "Hết ngày nghỉ";
}

// Days studied in a row, with the rest days left this week that keep the
// chain going. The flame stays grey until today is studied.
export function StreakFlame({ streak }: { streak: Streak }) {
  const lit = streak.studiedToday;
  return (
    <div
      className="flex min-h-touch items-center gap-3 rounded-full bg-streak-soft py-1 pr-4 pl-1.5"
      data-streak={streak.days}
      data-streak-lit={lit || undefined}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
        <Flame
          aria-hidden
          className={`size-6 ${lit ? "fill-streak text-streak" : "text-muted-foreground"}`}
          strokeWidth={2.25}
        />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="font-heading text-block font-bold leading-none">
          {streak.days} ngày
        </span>
        <span className="text-caption text-muted-foreground">
          {restHint(streak)}
        </span>
      </div>
    </div>
  );
}
