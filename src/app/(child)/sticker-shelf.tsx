"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { PanelArt } from "@/components/panel-art";
import { Sheet } from "@/components/sheet";
import { Sticker } from "@/components/sticker";
import { stickerFill } from "@/learn/next-step";
import type { FeedbackSounds } from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { SectionProgressRecord, StickerRecord } from "@/progress/db";
import type { LessonSummary } from "@/schema/content";
import { StickerSheet } from "./sticker-sheet";

// Columns of the shelf's grid by viewport width, narrowest first: the shelf
// is two rows of them, so the grid never grows however many stickers the
// child has won over the year. The last entry whose query matches wins.
const SHELF_ROWS = 2;
const SHELF_COLUMNS: readonly { query: string; columns: number }[] = [
  { query: "(min-width: 0px)", columns: 3 },
  { query: "(min-width: 40rem)", columns: 4 },
  { query: "(min-width: 48rem)", columns: 5 },
];

function subscribeToColumns(onChange: () => void): () => void {
  const lists = SHELF_COLUMNS.map((c) => window.matchMedia(c.query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function currentColumns(): number {
  let columns = SHELF_COLUMNS[0]?.columns ?? 3;
  for (const c of SHELF_COLUMNS) {
    if (window.matchMedia(c.query).matches) columns = c.columns;
  }
  return columns;
}

function useShelfColumns(): number {
  return useSyncExternalStore(
    subscribeToColumns,
    currentColumns,
    () => SHELF_COLUMNS[0]?.columns ?? 3,
  );
}

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

// The stickers to show in `capacity` grid cells: the earned ones, latest
// first, then the rest (part coloured ones first, then lesson order), so the
// grid never looks empty. When they do not all fit, the last cell is a "+k"
// tile for the collection, and `more` counts the stickers it stands for.
export function shelfLayout(
  entries: readonly StickerEntry[],
  capacity: number,
): { tiles: StickerEntry[]; more: number } {
  const share = ({ fill }: StickerEntry) =>
    fill.total > 0 ? fill.done / fill.total : 0;
  const waiting = entries
    .filter((entry) => !entry.earned)
    .sort((a, b) => share(b) - share(a));
  const ordered = [...latestEarned(entries), ...waiting];
  if (ordered.length <= capacity) return { tiles: ordered, more: 0 };
  const tiles = ordered.slice(0, capacity - 1);
  return { tiles, more: ordered.length - tiles.length };
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

// One sticker as a button: its picture and its name (which wraps, never cut
// short; it always has room for two lines, so every tile is as tall as the
// next).
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
        className={`min-h-[2lh] break-words text-caption leading-tight ${earned ? "font-semibold" : "text-muted-foreground"}`}
      >
        {lesson.sticker.name}
      </span>
    </button>
  );
}

type StickerShelfProps = {
  childId: string;
  lessons: readonly LessonSummary[];
  stickers: readonly Pick<StickerRecord, "lessonId" | "at">[];
  sections: readonly Pick<
    SectionProgressRecord,
    "lessonId" | "sectionId" | "state"
  >[];
  // Sounds of a tap; absent while the child has sound off.
  sounds?: FeedbackSounds;
};

// The child's stickers (their titles) on top of the home screen: a grid of
// two rows at most, the earned ones latest first and then the ones still to
// win as grey or part coloured silhouettes, so it is never empty. Past two
// rows the last cell is "+k" and "Xem tất cả" opens the whole collection, so
// the lessons below never move down as stickers pile up. Tapping a sticker
// opens its detail sheet.
export function StickerShelf({
  childId,
  lessons,
  stickers,
  sections,
  sounds,
}: StickerShelfProps) {
  const columns = useShelfColumns();
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
  const earnedCount = entries.filter((entry) => entry.earned).length;
  const { tiles, more } = shelfLayout(entries, columns * SHELF_ROWS);
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
    <>
      <section
        aria-labelledby="sticker-shelf-title"
        data-sticker-shelf
        className="relative isolate flex flex-col gap-3 overflow-hidden rounded-lg bg-surface p-3 shadow-card md:p-4"
      >
        <PanelArt />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <h2
              id="sticker-shelf-title"
              className="text-block font-semibold md:text-block-lg"
            >
              Danh hiệu của bạn
            </h2>
            <p data-shelf-count className="text-caption text-muted-foreground">
              {`Đã nhận ${earnedCount}/${entries.length}`}
            </p>
          </div>
          {more > 0 && (
            <button
              type="button"
              data-shelf-open-all
              aria-haspopup="dialog"
              onClick={() => setCollectionOpen(true)}
              className="flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-muted pr-2 pl-3 text-caption font-semibold motion-safe:transition-transform motion-safe:active:scale-[0.97]"
            >
              Xem tất cả
              <ChevronRight aria-hidden className="size-5" />
            </button>
          )}
        </div>
        <ul
          data-shelf-grid
          className="grid gap-x-2 gap-y-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {tiles.map((entry) => (
            <li key={entry.lesson.id}>
              <StickerTile
                entry={entry}
                dataAttr="data-shelf-sticker"
                pictureClassName="size-18"
                className="w-full gap-1 p-1"
                taps={taps(entry)}
                onOpen={() => open(entry)}
              />
            </li>
          ))}
          {more > 0 && (
            <li>
              <button
                type="button"
                data-shelf-more
                aria-haspopup="dialog"
                aria-label={`Xem thêm ${more} danh hiệu`}
                onClick={() => setCollectionOpen(true)}
                className="flex w-full flex-col items-center gap-1 rounded-lg p-1 text-center motion-safe:transition-transform motion-safe:active:scale-95"
              >
                <span className="flex size-18 items-center justify-center rounded-full bg-muted text-block font-bold">
                  {`+${more}`}
                </span>
                <span className="min-h-[2lh] text-caption leading-tight text-muted-foreground">
                  xem tất cả
                </span>
              </button>
            </li>
          )}
        </ul>
      </section>
      {/* The sheets sit beside the card, not in it: the card is its own
          stacking context (for its sky), which would keep a sheet under the
          cards that follow. */}
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
          childId={childId}
          lesson={openEntry.lesson}
          fill={openEntry.fill}
          earned={openEntry.earned}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}
