import { CircleCheck } from "lucide-react";
import { Sticker } from "@/components/sticker";
import type { Lesson } from "@/schema/content";

type LessonProgressCardProps = {
  lesson: Pick<Lesson, "sticker"> & { sections: readonly unknown[] };
  // Sections of the lesson done so far (all of them once the sticker is won).
  done: number;
};

// How far a lesson is, shown on the closing screens of a section and of a
// review: the lesson sticker coloured by the share of sections done, "Xong
// d/n phần", what is left before the sticker, and a row of ticks. No
// percentages.
export function LessonProgressCard({ lesson, done }: LessonProgressCardProps) {
  const total = lesson.sections.length;
  const left = Math.max(total - done, 0);
  return (
    <div
      className="flex w-full max-w-lg items-center gap-4 rounded-lg bg-surface p-4 text-left shadow-card md:p-6"
      data-sections-done={done}
    >
      <Sticker
        visualId={lesson.sticker.visualId}
        name={lesson.sticker.name}
        done={done}
        total={total}
        className="size-16 shrink-0 md:size-20"
      />
      <div className="flex min-w-0 flex-col gap-2">
        {/* Two short lines instead of one long one, and "có sticker" held
            together, so no line ever ends on a lone word. */}
        <p className="font-semibold">{`Xong ${done}/${total} phần`}</p>
        <p className="text-balance">
          {left > 0
            ? `Còn ${left} phần nữa là có sticker`
            : "Bạn đã có sticker của bài"}
        </p>
        <SectionDots total={total} done={done} />
      </div>
    </div>
  );
}

// Finished sections of the lesson as a row of ticks.
function SectionDots({ total, done }: { total: number; done: number }) {
  return (
    <div aria-hidden className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          // Dots only mark position.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className={`flex size-6 items-center justify-center rounded-full ${
            i < done ? "bg-correct text-primary-foreground" : "bg-muted"
          }`}
        >
          {i < done && <CircleCheck className="size-4" />}
        </span>
      ))}
    </div>
  );
}
