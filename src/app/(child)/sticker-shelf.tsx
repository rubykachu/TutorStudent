"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { Sticker } from "@/components/sticker";
import { stickerFill } from "@/learn/next-step";
import type { FeedbackSounds } from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { SectionProgressRecord, StickerRecord } from "@/progress/db";
import type { LessonSummary } from "@/schema/content";
import { StickerSheet } from "./sticker-sheet";

// How many of the latest earned stickers the shelf shows. The shelf is one
// row of this fixed size however many stickers the child has won over the
// year; the rest wait behind "+k" and "Xem tất cả".
export const SHELF_RECENT = 6;

type Fill = { done: number; total: number };

export type StickerEntry = {
  lesson: LessonSummary;
  earned: boolean;
  // When it was earned; undefined while it is not.
  earnedAt?: string;
  fill: Fill;
};

// Every sticker the child can collect from the lessons they see, in lesson
// order: earned ones in colour, the rest as grey silhouettes partly coloured
// by the sections already done.
export function buildStickerEntries(
  lessons: readonly LessonSummary[],
  stickers: readonly Pick<StickerRecord, "lessonId" | "at">[],
  sections: readonly Pick<
    SectionProgressRecord,
    "lessonId" | "sectionId" | "state"
  >[],
): StickerEntry[] {
  const earnedAt = new Map(stickers.map((s) => [s.lessonId, s.at]));
  return lessons.map((lesson) => {
    const at = earnedAt.get(lesson.id);
    return {
      lesson,
      earned: at !== undefined,
      earnedAt: at,
      fill: stickerFill(
        lesson.sections,
        sections.filter((s) => s.lessonId === lesson.id),
        at !== undefined,
      ),
    };
  });
}

// The earned stickers, latest first.
export function latestEarned(entries: readonly StickerEntry[]): StickerEntry[] {
  return entries
    .filter((entry) => entry.earned)
    .sort((a, b) => (b.earnedAt ?? "").localeCompare(a.earnedAt ?? ""));
}

// The sticker to aim for: of those not earned, the one furthest coloured,
// the first in lesson order when none has been started.
export function nextToEarn(
  entries: readonly StickerEntry[],
): StickerEntry | undefined {
  const share = ({ fill }: StickerEntry) =>
    fill.total > 0 ? fill.done / fill.total : 0;
  let best: StickerEntry | undefined;
  for (const entry of entries) {
    if (!entry.earned && (!best || share(entry) > share(best))) best = entry;
  }
  return best;
}

// The line beside the collection's title: stickers fully earned, plus how
// many are partly coloured, so a half-filled sticker is acknowledged rather
// than looking uncounted.
export function stickerCollectionCaption(fills: readonly Fill[]): string {
  const earned = fills.filter((f) => f.total > 0 && f.done >= f.total).length;
  const colouring = fills.filter((f) => f.done > 0 && f.done < f.total).length;
  if (earned === 0 && colouring === 0) return "Học xong một bài là có sticker";
  const got = `Đã có ${earned}/${fills.length} sticker`;
  return colouring === 0 ? got : `${got} · ${colouring} đang tô màu`;
}

type StickerTileProps = {
  entry: StickerEntry;
  // Marks the tile for tests and screen checks; the shelf and the
  // collection use different ones.
  dataAttr: "data-shelf-sticker" | "data-sticker-lesson";
  pictureClassName: string;
  className: string;
  // Taps so far, 0 before the first: each one replays the bounce.
  taps: number;
  onOpen: () => void;
};

// One sticker as a button: its picture and its name (which wraps, never
// cut short).
function StickerTile({
  entry,
  dataAttr,
  pictureClassName,
  className,
  taps,
  onOpen,
}: StickerTileProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { lesson, earned, fill } = entry;
  return (
    <button
      type="button"
      {...{ [dataAttr]: lesson.id }}
      data-sticker-open={lesson.id}
      // Plays its jingle or tap; see ButtonSounds.
      data-own-sound
      aria-haspopup="dialog"
      aria-label={`${lesson.sticker.name}, xem chi tiết`}
      onClick={onOpen}
      className={`relative flex flex-col items-center rounded-lg text-center motion-safe:transition-transform motion-safe:active:scale-95 ${className}`}
    >
      <motion.span
        // A new key restarts the bounce on every tap.
        key={taps}
        className="flex"
        animate={
          taps > 0 && !reducedMotion
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
          className={pictureClassName}
        />
      </motion.span>
      <span
        className={`break-words text-caption leading-tight ${earned ? "font-semibold" : "text-muted-foreground"}`}
      >
        {lesson.sticker.name}
      </span>
    </button>
  );
}

type StickerShelfProps = {
  lessons: readonly LessonSummary[];
  stickers: readonly Pick<StickerRecord, "lessonId" | "at">[];
  sections: readonly Pick<
    SectionProgressRecord,
    "lessonId" | "sectionId" | "state"
  >[];
  // Sounds of a tap; absent while the child has sound off.
  sounds?: FeedbackSounds;
};

// Tile of the shelf: a fixed width, so a name wraps inside it.
const SHELF_TILE = "w-20 shrink-0 snap-start gap-1 p-1";
const SHELF_PICTURE = "size-14";

// The titles the child has earned, on top of the home screen: one row of a
// fixed size (the latest few stickers, scrolling sideways on a narrow screen,
// then "+k"), so the lessons below never move down as stickers pile up.
// "Xem tất cả" opens the whole collection, locked and in-progress stickers
// included. With none earned yet the row says so and shows the next one to
// win. Tapping a sticker opens its detail sheet.
export function StickerShelf({
  lessons,
  stickers,
  sections,
  sounds,
}: StickerShelfProps) {
  // The sticker whose sheet is open, and whether the collection is open
  // behind it (closing the sheet goes back there). `tapped` is the sticker
  // that last played its tap animation (a counter, so tapping the same one
  // again replays it).
  const [openId, setOpenId] = useState<string | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [tapped, setTapped] = useState<{ id: string; count: number } | null>(
    null,
  );
  if (lessons.length === 0) return null;
  const entries = buildStickerEntries(lessons, stickers, sections);
  const earned = latestEarned(entries);
  const shown = earned.slice(0, SHELF_RECENT);
  const more = earned.length - shown.length;
  const next = earned.length === 0 ? nextToEarn(entries) : undefined;
  const openEntry = entries.find(({ lesson }) => lesson.id === openId);

  const open = (entry: StickerEntry) => {
    setTapped({
      id: entry.lesson.id,
      count: (tapped?.id === entry.lesson.id ? tapped.count : 0) + 1,
    });
    if (entry.earned) sounds?.play([JINGLE_ID]);
    else sounds?.tap();
    setOpenId(entry.lesson.id);
  };
  const taps = (entry: StickerEntry) =>
    tapped?.id === entry.lesson.id ? tapped.count : 0;

  return (
    <section
      aria-labelledby="sticker-shelf-title"
      data-sticker-shelf
      className="flex flex-col gap-1 rounded-lg bg-surface p-3 shadow-card md:p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="sticker-shelf-title"
          className="text-block font-semibold md:text-block-lg"
        >
          {`Danh hiệu của bạn · ${earned.length}/${entries.length}`}
        </h2>
        <button
          type="button"
          data-shelf-open-all
          aria-haspopup="dialog"
          onClick={() => setCollectionOpen(true)}
          className="flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-muted pr-2 pl-4 text-caption font-semibold motion-safe:transition-transform motion-safe:active:scale-[0.97]"
        >
          Xem tất cả
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
      {next ? (
        <div data-shelf-empty className="flex items-center gap-3">
          <StickerTile
            entry={next}
            dataAttr="data-shelf-sticker"
            pictureClassName={SHELF_PICTURE}
            className={SHELF_TILE}
            taps={taps(next)}
            onOpen={() => open(next)}
          />
          <p className="min-w-0 flex-1 text-balance">
            Học xong một bài để nhận danh hiệu đầu tiên, như “
            {next.lesson.sticker.name}”.
          </p>
        </div>
      ) : (
        <ul
          data-shelf-row
          className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1"
        >
          {shown.map((entry) => (
            <li key={entry.lesson.id} className="flex">
              <StickerTile
                entry={entry}
                dataAttr="data-shelf-sticker"
                pictureClassName={SHELF_PICTURE}
                className={SHELF_TILE}
                taps={taps(entry)}
                onOpen={() => open(entry)}
              />
            </li>
          ))}
          {more > 0 && (
            <li className="flex">
              <button
                type="button"
                data-shelf-more
                aria-haspopup="dialog"
                aria-label={`Xem thêm ${more} danh hiệu`}
                onClick={() => setCollectionOpen(true)}
                className={`flex flex-col items-center rounded-lg text-center motion-safe:transition-transform motion-safe:active:scale-95 ${SHELF_TILE}`}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-muted text-block font-bold">
                  {`+${more}`}
                </span>
                <span className="text-caption leading-tight text-muted-foreground">
                  thêm
                </span>
              </button>
            </li>
          )}
        </ul>
      )}
      {collectionOpen && !openEntry && (
        <Sheet
          label="Danh hiệu của bạn"
          onClose={() => setCollectionOpen(false)}
        >
          <div className="flex flex-col gap-1 pr-12">
            <h2 className="font-heading font-bold text-title md:text-title-lg">
              Danh hiệu của bạn
            </h2>
            <p className="text-caption text-muted-foreground">
              {stickerCollectionCaption(entries.map((e) => e.fill))}
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-4">
            {entries.map((entry) => (
              <li key={entry.lesson.id}>
                <StickerTile
                  entry={entry}
                  dataAttr="data-sticker-lesson"
                  pictureClassName="size-20"
                  className="w-full gap-2"
                  taps={taps(entry)}
                  onOpen={() => open(entry)}
                />
              </li>
            ))}
          </ul>
        </Sheet>
      )}
      {openEntry && (
        <StickerSheet
          lesson={openEntry.lesson}
          fill={openEntry.fill}
          earned={openEntry.earned}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
