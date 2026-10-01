"use client";

import { BookOpen, Lock, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { bigButtonClassName } from "@/components/big-button";
import {
  LoopingConfetti,
  LoopingMotion,
} from "@/components/looping-celebration";
import { Sticker } from "@/components/sticker";
import { lessonHeading, lessonPlacement } from "@/lib/lesson-label";
import { lessonPath } from "@/lib/routes";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { LessonSummary } from "@/schema/content";

type StickerSheetProps = {
  lesson: LessonSummary;
  // Sections of the lesson done, out of `total`.
  fill: { done: number; total: number };
  earned: boolean;
  onClose: () => void;
};

// The line under the sticker's name: how far the child is.
export function stickerProgressLine(
  fill: { done: number; total: number },
  earned: boolean,
): string {
  if (earned) return "Đã nhận sticker này";
  return `Xong ${fill.done}/${fill.total} phần`;
}

// How to win it: finishing every section of the lesson.
export function stickerHowToEarn(
  lesson: Pick<LessonSummary, "title" | "number">,
  earned: boolean,
): string {
  const name = `“${lessonHeading(lesson)}”`;
  return earned
    ? `Bạn đã học xong cả bài ${name}.`
    : `Học xong bài ${name} để nhận.`;
}

// A sheet with everything about one sticker: its picture (a silhouette
// while not earned), name, lesson, progress, how to earn it and a button to
// open the lesson. An earned sticker bounces gently and bursts with confetti
// every few seconds while the sheet is open (still under reduced motion).
export function StickerSheet({
  lesson,
  fill,
  earned,
  onClose,
}: StickerSheetProps) {
  const reducedMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const placement = lessonPlacement(lesson);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stickerPicture = (
    <Sticker
      visualId={lesson.sticker.visualId}
      name={lesson.sticker.name}
      done={fill.done}
      total={fill.total}
    />
  );

  return (
    <div
      data-sticker-sheet-backdrop
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 md:items-center"
    >
      {/* Tapping outside the panel closes the sheet; Escape and the close
          button do the same for keyboards. */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 flex max-h-full w-full max-w-md">
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label={`Sticker ${lesson.sticker.name}`}
          data-sticker-sheet={lesson.id}
          data-sticker-earned={earned}
          initial={reducedMotion ? false : { y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="relative flex max-h-full w-full flex-col items-center gap-4 overflow-y-auto rounded-t-xl bg-surface p-6 text-center shadow-card md:rounded-xl"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 flex size-12 items-center justify-center rounded-full text-muted-foreground"
          >
            <X aria-hidden className="size-7" />
          </button>
          <motion.div
            className="w-40 md:w-48"
            initial={reducedMotion ? false : { scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 12 }}
          >
            {earned ? (
              <LoopingMotion>{stickerPicture}</LoopingMotion>
            ) : (
              stickerPicture
            )}
          </motion.div>
          <h2 className="font-heading font-bold text-title md:text-title-lg">
            {lesson.sticker.name}
          </h2>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{lesson.title}</p>
            {placement && (
              <p className="text-caption text-muted-foreground">{placement}</p>
            )}
          </div>
          <p
            data-sticker-progress
            className="rounded-full bg-muted px-4 py-1 font-semibold"
          >
            {stickerProgressLine(fill, earned)}
          </p>
          <p
            data-sticker-how
            className="flex max-w-prose items-start gap-2 text-balance"
          >
            {!earned && (
              <Lock
                aria-hidden
                className="mt-1 size-5 shrink-0 text-muted-foreground"
              />
            )}
            {stickerHowToEarn(lesson, earned)}
          </p>
          <Link
            href={lessonPath(lesson.id)}
            className={bigButtonClassName("primary", "mt-2")}
          >
            <BookOpen aria-hidden className="size-6" />
            {earned ? "Xem bài học" : "Mở bài học"}
          </Link>
        </motion.section>
        {/* The confetti of an earned sticker bursts from the picture. It sits
          beside the scrolling panel, not in it, so the panel does not clip it,
          and never takes a tap. */}
        {earned && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-6 h-40 md:h-48"
          >
            <LoopingConfetti />
          </div>
        )}
      </div>
    </div>
  );
}
