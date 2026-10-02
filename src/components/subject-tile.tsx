import { Clock, Lock } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { subjectStyle } from "@/components/subject-style";
import { SubjectTileArt } from "@/components/subject-tile-art";
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
    // The count sits inside the ring and its unit just below, so neither
    // touches the ring's stroke.
    <div
      role="img"
      aria-label={`Xong ${done} trên ${total} phần`}
      className="flex shrink-0 flex-col items-center gap-1"
    >
      <div className="relative size-20 tall:size-24">
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
        {/* Two short lines, so a three-digit count never touches the ring. */}
        <span
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center font-semibold leading-none"
        >
          <span className="text-block">{done}</span>
          <span className="text-caption">/{total}</span>
        </span>
      </div>
      <span aria-hidden className="text-caption leading-none">
        phần
      </span>
    </div>
  );
}

// The lines under the subject name, as short parts shown one per line.
export function subjectSubtitle(status: SubjectStatus): string[] {
  switch (status.kind) {
    case "empty":
      return ["Sắp ra mắt"];
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

// One subject alone is not three columns with two empty: its tile is a single
// full-width row (icon, text, ring) on every width, with no subgrid.
export function subjectTileLayout(count: number): {
  grid: string;
  cell: string;
  solo: boolean;
} {
  return count === 1
    ? { grid: "grid gap-4", cell: "", solo: true }
    : { grid: SUBJECT_TILE_GRID, cell: SUBJECT_TILE_CELL, solo: false };
}

type SubjectTileProps = {
  subject: Subject;
  progress: SubjectProgress;
  status: SubjectStatus;
  // Days since the subject was last studied, when long enough to nudge.
  nudgeDays: number | null;
  href: string;
  // The only tile on the screen: laid out as one wide row, see subjectTileLayout.
  solo?: boolean;
};

export function SubjectTile({
  subject,
  progress,
  status,
  nudgeDays,
  href,
  solo = false,
}: SubjectTileProps) {
  const style = subjectStyle(subject);
  const Icon = style.icon;
  const subtitle = subjectSubtitle(status);
  // A subject with no published lesson is locked: the tile shows a lock and
  // does not lead anywhere, so there is no empty page to land on.
  const locked = status.kind === "empty";
  // One row on phones (icon, text, ring); on tablets the text drops below
  // the icon and ring so three tiles fit side by side.
  const layout = solo
    ? "relative isolate grid h-full overflow-hidden min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-4 md:min-h-36 md:gap-6 md:p-6"
    : "relative isolate grid h-full overflow-hidden min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-4 md:row-span-5 md:grid-cols-[auto_1fr] md:grid-rows-subgrid md:gap-y-0 md:p-5 tall:p-6";
  // Classes of the tablet layout that shares grid rows with its neighbours;
  // a solo tile keeps the phone row.
  const tablet = (classes: string) => (solo ? "" : classes);
  const content = (
    <>
      {!locked && <SubjectTileArt color={subject.color} />}
      <span
        className={`order-1 flex size-14 items-center justify-center rounded-full ${tablet("md:col-start-1 md:row-start-1 tall:size-20")} ${
          locked ? `bg-muted ${style.text}` : "bg-primary-foreground/20"
        }`}
      >
        <Icon aria-hidden className="size-8 tall:size-11" strokeWidth={2.25} />
      </span>
      <div
        className={`order-3 justify-self-end ${tablet("md:col-start-2 md:row-start-1")}`}
      >
        {locked ? (
          <span
            data-lock
            className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground tall:size-14"
          >
            <Lock
              aria-hidden
              className="size-6 tall:size-7"
              strokeWidth={2.25}
            />
          </span>
        ) : (
          progress.total > 0 && <ProgressRing {...progress} />
        )}
      </div>
      <div
        className={`order-2 flex min-w-0 flex-col items-start gap-2 ${tablet("md:contents")}`}
      >
        <h2
          className={`text-block font-bold ${
            solo
              ? "md:text-title"
              : "md:col-span-2 md:row-start-3 md:mt-4 md:self-end md:text-block-lg tall:text-title-lg"
          }`}
        >
          {subject.name}
        </h2>
        <p
          className={`text-caption ${tablet("md:col-span-2 md:row-start-4 md:mt-1 md:self-start")}`}
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
          <p
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface px-3 py-1 text-caption font-semibold text-foreground ${tablet("md:col-span-2 md:row-start-5 md:mt-2 md:justify-self-start")}`}
          >
            <Clock aria-hidden className="size-4 shrink-0" />
            {nudgeDays} ngày chưa học
          </p>
        )}
      </div>
    </>
  );
  if (locked) {
    return (
      <div
        data-subject={subject.id}
        data-locked
        className={`${layout} border-2 border-border bg-surface text-foreground`}
      >
        {content}
      </div>
    );
  }
  return (
    <Link
      href={href}
      data-subject={subject.id}
      className={`${layout} ${style.bg} text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none`}
    >
      {content}
    </Link>
  );
}
