"use client";

import {
  BookOpen,
  Lock,
  Music,
  Square,
  VolumeX,
  WifiOff,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BigButton, bigButtonClassName } from "@/components/big-button";
import {
  LoopingConfetti,
  LoopingMotion,
} from "@/components/looping-celebration";
import { PanelArt } from "@/components/panel-art";
import { Sticker } from "@/components/sticker";
import { lessonHeading, lessonPlacement } from "@/lib/lesson-label";
import { lessonPath } from "@/lib/routes";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { SONGS } from "@/music/songs";
import { useMusicPlayer } from "@/music/use-music-player";
import type { LessonSummary } from "@/schema/content";

type StickerSheetProps = {
  childId: string;
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

// The button that plays a random song, and stops it on a second press. The
// sound switch rules it: with sound off it is disabled and says why.
function MusicButton({ childId }: { childId: string }) {
  const { enabled, playingId, toggle, offline, recheck } = useMusicPlayer(
    childId,
    SONGS,
  );
  const playing = playingId !== null;
  const needsNetwork = enabled && offline && !playing;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <BigButton
        variant="secondary"
        data-music-button
        aria-pressed={playing}
        disabled={!enabled || needsNetwork}
        onClick={toggle}
        // The song is the sound; no button press on top of it.
        data-own-sound
      >
        {playing ? (
          <Square aria-hidden className="size-5 fill-current" />
        ) : (
          <Music aria-hidden className="size-6" />
        )}
        {playing ? "Dừng nhạc" : "Nghe nhạc"}
      </BigButton>
      {needsNetwork && (
        <button
          type="button"
          onClick={recheck}
          data-music-offline
          className="flex min-h-touch items-center gap-2 text-caption text-muted-foreground"
        >
          <WifiOff aria-hidden className="size-5 shrink-0" />
          Cần mạng để nghe nhạc
        </button>
      )}
      {!enabled && (
        <p
          data-music-muted
          className="flex items-center gap-2 text-caption text-muted-foreground"
        >
          <VolumeX aria-hidden className="size-5 shrink-0" />
          Bật loa ở góc màn hình để nghe nhạc.
        </p>
      )}
    </div>
  );
}

// A sheet with everything about one sticker: its picture (a silhouette
// while not earned), name, lesson, progress, how to earn it, a button that
// plays a random song and a button to open the lesson. The sheet loops its
// effect while it is open (still under reduced motion): an earned sticker
// bounces and bursts with confetti every few seconds, to a jingle; one not
// earned yet only rocks gently, to the soft tap, with no confetti.
export function StickerSheet({
  childId,
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
          className="relative isolate flex max-h-full w-full flex-col overflow-hidden rounded-t-xl bg-surface shadow-card md:rounded-xl"
        >
          <PanelArt />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 flex size-12 items-center justify-center rounded-full text-muted-foreground"
          >
            <X aria-hidden className="size-7" />
          </button>
          <div className="flex min-h-0 flex-col items-center gap-4 overflow-y-auto p-6 text-center">
            <motion.div
              className="w-40 md:w-48"
              initial={reducedMotion ? false : { scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 12 }}
            >
              <LoopingMotion kind={earned ? "bounce" : "float"}>
                {stickerPicture}
              </LoopingMotion>
            </motion.div>
            <h2 className="font-heading font-bold text-title md:text-title-lg">
              {lesson.sticker.name}
            </h2>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{lesson.title}</p>
              {placement && (
                <p className="text-caption text-muted-foreground">
                  {placement}
                </p>
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
            <MusicButton childId={childId} />
            <Link
              href={lessonPath(lesson.id)}
              className={bigButtonClassName("primary")}
            >
              <BookOpen aria-hidden className="size-6" />
              {earned ? "Xem bài học" : "Mở bài học"}
            </Link>
          </div>
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
