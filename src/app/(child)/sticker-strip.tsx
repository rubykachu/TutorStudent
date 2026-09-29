import { Sticker } from "@/components/sticker";
import type { LessonSummary } from "@/schema/content";

type StickerStripProps = {
  lessons: readonly LessonSummary[];
  earnedLessonIds: ReadonlySet<string>;
};

// Every sticker the child can collect from the lessons they see: earned ones
// in colour, the rest as grey silhouettes that show what finishing a lesson
// brings.
export function StickerStrip({ lessons, earnedLessonIds }: StickerStripProps) {
  if (lessons.length === 0) return null;
  const earned = lessons.filter((l) => earnedLessonIds.has(l.id)).length;
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
          {earned === 0
            ? "Học xong một bài là có sticker"
            : `Đã có ${earned}/${lessons.length}`}
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {lessons.map((lesson) => {
          const has = earnedLessonIds.has(lesson.id);
          return (
            <li
              key={lesson.id}
              className="flex flex-col items-center gap-2 text-center"
              data-sticker-lesson={lesson.id}
            >
              <Sticker
                visualId={lesson.sticker.visualId}
                name={lesson.sticker.name}
                earned={has}
                className="size-20 tall:size-24"
              />
              <span
                className={`line-clamp-2 text-caption ${has ? "font-semibold" : "text-muted-foreground"}`}
              >
                {lesson.sticker.name}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
