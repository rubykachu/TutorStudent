import { Clock } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { SUBJECT_STYLES } from "@/components/subject-style";
import type { SubjectProgress, SubjectStatus } from "@/learn/next-step";
import type { Subject } from "@/schema/content";

const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Sections finished out of every section of the subject's lessons, as a ring
// with a count of parts rather than a percentage (the child UI shows no
// scores). It fills as each section is done, like the stickers.
function ProgressRing({ done, total }: SubjectProgress) {
  const filled = total === 0 ? 0 : done / total;
  return (
    <div
      role="img"
      aria-label={`Xong ${done} trên ${total} phần`}
      className="relative size-16 shrink-0 tall:size-20"
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
      <span
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center text-caption leading-none font-semibold"
      >
        <span>
          {done}/{total}
        </span>
        <span className="mt-0.5 font-normal">phần</span>
      </span>
    </div>
  );
}

// The lines under the subject name, as short parts shown one per line.
export function subjectSubtitle(status: SubjectStatus): string[] {
  switch (status.kind) {
    case "empty":
      return ["Sắp có bài"];
    case "new":
      return [`${status.total} bài`, "Chưa học"];
    case "learning":
      return [`${status.total} bài`, `Đang học phần ${status.sectionNumber}`];
    case "progress":
      return [`Xong ${status.done}/${status.total} bài`];
  }
}

// On tablets the tiles sit side by side and share five grid rows through
// subgrid (icon and ring, free space, name, subtitle, nudge), so names and
// subtitles line up across tiles whatever their text length. The list holding
// the tiles uses SUBJECT_TILE_GRID and each item SUBJECT_TILE_CELL.
export const SUBJECT_TILE_GRID =
  "grid gap-4 md:grid-cols-3 md:grid-rows-[auto_minmax(1rem,1fr)_auto_auto_auto] md:gap-y-0 tall:grid-rows-[auto_minmax(4rem,1fr)_auto_auto_auto]";
export const SUBJECT_TILE_CELL =
  "md:row-span-5 md:grid md:grid-cols-1 md:grid-rows-subgrid";

type SubjectTileProps = {
  subject: Subject;
  progress: SubjectProgress;
  status: SubjectStatus;
  // Days since the subject was last studied, when long enough to nudge.
  nudgeDays: number | null;
  href: string;
};

export function SubjectTile({
  subject,
  progress,
  status,
  nudgeDays,
  href,
}: SubjectTileProps) {
  const style = SUBJECT_STYLES[subject.color];
  const Icon = style.icon;
  const subtitle = subjectSubtitle(status);
  return (
    <Link
      href={href}
      data-subject={subject.id}
      // One row on phones (icon, text, ring); on tablets the text drops below
      // the icon and ring so three tiles fit side by side.
      className={`${style.bg} grid h-full min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-4 text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:row-span-5 md:grid-cols-[auto_1fr] md:grid-rows-subgrid md:gap-y-0 md:p-5 tall:p-6`}
    >
      <span className="order-1 flex size-14 items-center justify-center rounded-full bg-primary-foreground/20 md:col-start-1 md:row-start-1 tall:size-20">
        <Icon aria-hidden className="size-8 tall:size-11" strokeWidth={2.25} />
      </span>
      <div className="order-3 justify-self-end md:col-start-2 md:row-start-1">
        {progress.total > 0 && <ProgressRing {...progress} />}
      </div>
      <div className="order-2 flex min-w-0 flex-col items-start gap-2 md:contents">
        <h2 className="text-block font-bold md:col-span-2 md:row-start-3 md:mt-4 md:self-end md:text-block-lg tall:text-title-lg">
          {subject.name}
        </h2>
        <p
          className="text-caption md:col-span-2 md:row-start-4 md:mt-1 md:self-start"
          data-subject-status={status.kind}
        >
          {subtitle.map((part, i) => (
            // Each part on its own line, so a narrow tile never breaks inside
            // one or leaves a dangling separator; screen readers hear " · ".
            <Fragment key={part}>
              {i > 0 && <span className="sr-only"> · </span>}
              <span className="block whitespace-nowrap">{part}</span>
            </Fragment>
          ))}
        </p>
        {nudgeDays !== null && (
          <p className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface px-3 py-1 text-caption font-semibold text-foreground md:col-span-2 md:row-start-5 md:mt-2 md:justify-self-start">
            <Clock aria-hidden className="size-4 shrink-0" />
            {nudgeDays} ngày chưa học
          </p>
        )}
      </div>
    </Link>
  );
}
