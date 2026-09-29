import { Play } from "lucide-react";
import Link from "next/link";
import { SUBJECT_STYLES } from "@/components/subject-style";
import type { ContinueTarget } from "@/learn/next-step";
import { sectionPath } from "@/lib/routes";
import type { Subject } from "@/schema/content";

type ContinueCardProps = { target: ContinueTarget; subject: Subject };

// The home screen's main action: one tap straight into the next section to
// study, instead of subject → lesson → section.
export function ContinueCard({ target, subject }: ContinueCardProps) {
  const { lesson, sectionIndex, started } = target;
  const section = lesson.sections[sectionIndex];
  if (!section) return null;
  const style = SUBJECT_STYLES[subject.color];
  const Icon = style.icon;
  const label = started ? "Học tiếp" : "Bắt đầu học";
  return (
    <Link
      href={sectionPath(lesson.id, section.id)}
      data-continue={section.id}
      aria-label={`${label}: ${lesson.title}, phần ${sectionIndex + 1}: ${section.title}`}
      className={`${style.border} flex min-h-28 items-center gap-4 rounded-lg border-3 bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:gap-5 md:p-6 tall:min-h-36`}
    >
      <span
        className={`${style.bg} hidden size-14 shrink-0 items-center justify-center rounded-full text-primary-foreground sm:flex tall:size-18`}
      >
        <Icon aria-hidden className="size-8 tall:size-10" strokeWidth={2.25} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span
          className={`${style.bg} rounded-full px-3 py-0.5 text-caption font-semibold text-primary-foreground`}
        >
          {label}
        </span>
        <span className="font-heading text-block font-bold md:text-block-lg">
          {lesson.title}
        </span>
        <span className="text-muted-foreground">
          {`Phần ${sectionIndex + 1}: ${section.title}`}
        </span>
      </div>
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card md:size-16"
      >
        <Play className="ml-1 size-7 fill-current" />
      </span>
    </Link>
  );
}
