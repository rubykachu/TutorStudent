"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { Sticker } from "@/components/sticker";
import { stickerFill } from "@/learn/next-step";
import type { FeedbackSounds } from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { SectionProgressRecord } from "@/progress/db";
import type { LessonSummary } from "@/schema/content";
import { StickerSheet } from "./sticker-sheet";

type StickerStripProps = {
  lessons: readonly LessonSummary[];
  earnedLessonIds: ReadonlySet<string>;
  sections: readonly Pick<
    SectionProgressRecord,
    "lessonId" | "sectionId" | "state"
  >[];
  // Sounds of a tap; absent while the child has sound off.
  sounds?: FeedbackSounds;
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
  sounds,
}: StickerStripProps) {
  const reducedMotion = usePrefersReducedMotion();
  // The sticker whose sheet is open, and which sticker last played its
  // tap animation (a counter, so tapping the same one again replays it).
  const [openId, setOpenId] = useState<string | null>(null);
  const [tapped, setTapped] = useState<{ id: string; count: number } | null>(
    null,
  );
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
  const openLesson = stickers.find(({ lesson }) => lesson.id === openId);
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
        {stickers.map(({ lesson, earned, fill }) => {
          const animating = tapped?.id === lesson.id;
          return (
            <li key={lesson.id} data-sticker-lesson={lesson.id}>
              <button
                type="button"
                data-sticker-open={lesson.id}
                // Plays its jingle or tap; see ButtonSounds.
                data-own-sound
                aria-haspopup="dialog"
                aria-label={`${lesson.sticker.name}, xem chi tiết`}
                onClick={() => {
                  setTapped({
                    id: lesson.id,
                    count: (tapped?.id === lesson.id ? tapped.count : 0) + 1,
                  });
                  if (earned) sounds?.play([JINGLE_ID]);
                  else sounds?.tap();
                  setOpenId(lesson.id);
                }}
                className="relative flex w-full flex-col items-center gap-2 rounded-lg text-center motion-safe:transition-transform motion-safe:active:scale-95"
              >
                <motion.span
                  // A new key restarts the bounce on every tap.
                  key={animating ? tapped.count : 0}
                  className="flex"
                  animate={
                    animating && !reducedMotion
                      ? { scale: [1, 1.25, 0.94, 1], rotate: [0, -8, 8, 0] }
                      : undefined
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Sticker
                    visualId={lesson.sticker.visualId}
                    name={lesson.sticker.name}
                    done={fill.done}
                    total={fill.total}
                    className="size-20 tall:size-24"
                  />
                </motion.span>
                {animating && earned && !reducedMotion && (
                  <ConfettiBurst key={tapped.count} />
                )}
                <span
                  className={`break-words text-caption ${earned ? "font-semibold" : "text-muted-foreground"}`}
                >
                  {lesson.sticker.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {openLesson && (
        <StickerSheet
          lesson={openLesson.lesson}
          fill={openLesson.fill}
          earned={openLesson.earned}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
