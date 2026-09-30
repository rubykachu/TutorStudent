import { Sticker } from "@/components/sticker";
import { stickerFill } from "@/learn/next-step";
import type { SectionProgressRecord } from "@/progress/db";
import type { LessonSummary } from "@/schema/content";

type StickerStripProps = {
  lessons: readonly LessonSummary[];
  earnedLessonIds: ReadonlySet<string>;
  sections: readonly Pick<
    SectionProgressRecord,
    "lessonId" | "sectionId" | "state"
  >[];
};

// Every sticker the child can collect from the lessons they see: earned ones
// in colour, the rest as grey silhouettes that show what finishing a lesson
// brings, partly coloured by the sections already done.
// The line beside the strip's title: stickers fully earned, plus how many are
// partly coloured, so a half-filled sticker is acknowledged rather than
// looking uncounted.
export function stickerStripCaption(
  fills: readonly { done: number; total: number }[],
): string {
  const earned = fills.filter((f) => f.total > 0 && f.done >= f.total).length;
  const colouring = fills.filter((f) => f.done > 0 && f.done < f.total).length;
  if (earned === 0 && colouring === 0) return "Học xong một bài là có sticker";
  const got = `Đã có ${earned}/${fills.length} sticker`;
  return colouring === 0 ? got : `${got} · ${colouring} đang tô màu`;
}

export function StickerStrip({
  lessons,
  earnedLessonIds,
  sections,
}: StickerStripProps) {
  if (lessons.length === 0) return null;
  const stickers = lessons.map((lesson) => ({
    lesson,
    earned: earnedLessonIds.has(lesson.id),
    fill: stickerFill(
      lesson.sections,
      sections.filter((s) => s.lessonId === lesson.id),
      earnedLessonIds.has(lesson.id),
    ),
  }));
  return (
    <section
      aria-labelledby="sticker-strip-title"
      className="flex flex-col gap-4 rounded-lg bg-surface p-4 shadow-card md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="sticker-strip-title"
          className="text-block font-semibold md:text-block-lg"
        >
          Sticker của bạn
        </h2>
        <p className="text-caption text-muted-foreground">
          {stickerStripCaption(stickers.map((s) => s.fill))}
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {stickers.map(({ lesson, earned, fill }) => (
          <li
            key={lesson.id}
            className="flex flex-col items-center gap-2 text-center"
            data-sticker-lesson={lesson.id}
          >
            <Sticker
              visualId={lesson.sticker.visualId}
              name={lesson.sticker.name}
              done={fill.done}
              total={fill.total}
              className="size-20 tall:size-24"
            />
            <span
              className={`line-clamp-2 text-caption ${earned ? "font-semibold" : "text-muted-foreground"}`}
            >
              {lesson.sticker.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
