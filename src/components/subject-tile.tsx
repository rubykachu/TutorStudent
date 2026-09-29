import { Clock } from "lucide-react";
import Link from "next/link";
import { SUBJECT_STYLES } from "@/components/subject-style";
import type { SubjectProgress } from "@/progress/summary";
import type { Subject } from "@/schema/content";

const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Lessons finished out of lessons available, as a ring rather than a
// percentage (the child UI shows no scores).
function ProgressRing({ done, total }: SubjectProgress) {
  const filled = total === 0 ? 0 : done / total;
  return (
    <div
      role="img"
      aria-label={`Xong ${done} trên ${total} bài`}
      className="relative size-16 shrink-0"
    >
      <svg viewBox="0 0 56 56" className="size-full -rotate-90" aria-hidden>
        <circle
          cx={28}
          cy={28}
          r={RING_RADIUS}
          className="fill-none stroke-primary-foreground/30"
          strokeWidth={6}
        />
        <circle
          cx={28}
          cy={28}
          r={RING_RADIUS}
          className="fill-none stroke-primary-foreground"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - filled)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-caption font-semibold">
        {done}/{total}
      </span>
    </div>
  );
}

type SubjectTileProps = {
  subject: Subject;
  progress: SubjectProgress;
  // Days since the subject was last studied, when long enough to nudge.
  nudgeDays: number | null;
  href: string;
};

export function SubjectTile({
  subject,
  progress,
  nudgeDays,
  href,
}: SubjectTileProps) {
  const style = SUBJECT_STYLES[subject.color];
  const Icon = style.icon;
  return (
    <Link
      href={href}
      data-subject={subject.id}
      // One row on phones (icon, text, ring); on tablets the text drops below
      // the icon and ring so three tiles fit side by side.
      className={`${style.bg} grid h-full min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-4 text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:min-h-52 md:grid-cols-[auto_1fr] md:content-between md:p-5`}
    >
      <span className="order-1 flex size-14 items-center justify-center rounded-full bg-primary-foreground/20">
        <Icon aria-hidden className="size-8" strokeWidth={2.25} />
      </span>
      <div className="order-3 justify-self-end md:order-2">
        {progress.total > 0 && <ProgressRing {...progress} />}
      </div>
      <div className="order-2 flex min-w-0 flex-col items-start gap-2 md:order-3 md:col-span-2">
        <h2 className="text-block font-bold md:text-block-lg">
          {subject.name}
        </h2>
        {progress.total === 0 && <p className="text-caption">Sắp có bài</p>}
        {nudgeDays !== null && (
          <p className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface px-3 py-1 text-caption font-semibold text-foreground">
            <Clock aria-hidden className="size-4 shrink-0" />
            {nudgeDays} ngày chưa học
          </p>
        )}
      </div>
    </Link>
  );
}
