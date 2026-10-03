import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  buildStickerEntries,
  latestEarned,
  StickerShelf,
  shelfLayout,
  stickerCollectionCaption,
} from "@/app/(child)/sticker-shelf";
import { CELEBRATION_IDS } from "@/lib/sound-manifest";
import type { LessonSummary } from "@/schema/content";

function lesson(id: string, name: string): LessonSummary {
  return {
    id,
    subject: "math",
    series: "kntt",
    order: 1,
    title: id,
    sourceRef: "SGK",
    sections: [1, 2, 3].map((n) => ({
      id: `${id}.section.${n}`,
      title: `Phần ${n}`,
      minutes: 5,
    })),
    cardCount: 1,
    hasOverview: false,
    sticker: { name, visualId: "fixture.visual.star-sticker" },
  };
}

// `count` lessons "l01".."lNN", each with its own sticker name.
function manyLessons(count: number): LessonSummary[] {
  return Array.from({ length: count }, (_, i) => {
    const id = `l${String(i + 1).padStart(2, "0")}`;
    return lesson(id, `Danh hiệu ${i + 1}`);
  });
}

// The first `count` lessons earned, one minute apart, later lessons later.
function earnedRecords(count: number) {
  return manyLessons(count).map((l, i) => ({
    lessonId: l.id,
    at: `2026-02-01T10:${String(i).padStart(2, "0")}:00.000Z`,
  }));
}

function shelf(
  lessons: LessonSummary[],
  stickers: { lessonId: string; at: string }[] = [],
  sections: {
    lessonId: string;
    sectionId: string;
    state: "done" | "in_progress";
  }[] = [],
) {
  return render(
    <StickerShelf
      childId="kid-1"
      lessons={lessons}
      stickers={stickers}
      sections={sections}
    />,
  );
}

const shelfTiles = () => document.querySelectorAll("[data-shelf-sticker]");
const shelfIds = () =>
  [...shelfTiles()].map((tile) => tile.getAttribute("data-shelf-sticker"));

// Makes the viewport match the given min-width queries (rem), as a wider
// screen does; jsdom matches none, which is the narrowest layout.
function viewportMatches(...queries: string[]) {
  const original = window.matchMedia;
  window.matchMedia = (query: string) =>
    ({
      matches: queries.includes(query),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList;
  return () => {
    window.matchMedia = original;
  };
}

describe("sticker shelf entries", () => {
  it("colours each sticker by the sections done, full once earned", () => {
    const entries = buildStickerEntries(
      [lesson("a", "Sao"), lesson("b", "Trăng"), lesson("c", "Mây")],
      [{ lessonId: "c", at: "2026-02-01T00:00:00.000Z" }],
      [
        { lessonId: "a", sectionId: "a.section.1", state: "done" },
        { lessonId: "a", sectionId: "a.section.2", state: "done" },
        { lessonId: "a", sectionId: "a.section.3", state: "in_progress" },
        { lessonId: "b", sectionId: "b.section.1", state: "in_progress" },
      ],
    );
    expect(entries.map((e) => e.fill)).toEqual([
      { done: 2, total: 3 },
      { done: 0, total: 3 },
      { done: 3, total: 3 },
    ]);
    expect(entries.map((e) => e.earned)).toEqual([false, false, true]);
  });

  it("lists the earned stickers latest first", () => {
    const lessons = manyLessons(3);
    const entries = buildStickerEntries(
      lessons,
      [
        { lessonId: "l01", at: "2026-03-01T00:00:00.000Z" },
        { lessonId: "l03", at: "2026-01-01T00:00:00.000Z" },
        { lessonId: "l02", at: "2026-02-01T00:00:00.000Z" },
      ],
      [],
    );
    expect(latestEarned(entries).map((e) => e.lesson.id)).toEqual([
      "l01",
      "l02",
      "l03",
    ]);
  });

  it("lays out the earned stickers first, latest first, then those part coloured, then the rest", () => {
    const lessons = manyLessons(6);
    const entries = buildStickerEntries(
      lessons,
      [
        { lessonId: "l04", at: "2026-02-01T00:00:00.000Z" },
        { lessonId: "l02", at: "2026-03-01T00:00:00.000Z" },
      ],
      [{ lessonId: "l06", sectionId: "l06.section.1", state: "done" }],
    );
    const { tiles, more } = shelfLayout(entries, 6);
    expect(tiles.map((t) => t.lesson.id)).toEqual([
      "l02",
      "l04",
      "l06",
      "l01",
      "l03",
      "l05",
    ]);
    expect(more).toBe(0);
  });

  it("ends a full layout with a +k tile that counts the stickers left out", () => {
    const entries = buildStickerEntries(manyLessons(9), earnedRecords(9), []);
    const { tiles, more } = shelfLayout(entries, 6);
    expect(tiles).toHaveLength(5);
    expect(more).toBe(4);
    expect(shelfLayout(entries.slice(0, 6), 6).more).toBe(0);
  });

  it.each([
    [[{ done: 0, total: 3 }], "Học xong một bài là có sticker"],
    [
      [
        { done: 1, total: 3 },
        { done: 0, total: 2 },
      ],
      "Đã có 0/2 sticker · 1 đang tô màu",
    ],
    [
      [
        { done: 3, total: 3 },
        { done: 0, total: 2 },
      ],
      "Đã có 1/2 sticker",
    ],
  ])(
    "counts earned stickers and mentions those being coloured (%o)",
    (fills, text) => {
      expect(stickerCollectionCaption(fills)).toBe(text);
    },
  );
});

describe("StickerShelf", () => {
  it("counts earned out of all under the title and shows the earned ones in colour first", () => {
    shelf(manyLessons(5), earnedRecords(2));
    expect(
      screen.getByRole("heading", { name: "Danh hiệu của bạn" }),
    ).toBeInTheDocument();
    expect(document.querySelector("[data-shelf-count]")).toHaveTextContent(
      "Đã nhận 2/5",
    );
    // Latest first, then the stickers still to win: the grid is never empty.
    expect(shelfIds()).toEqual(["l02", "l01", "l03", "l04", "l05"]);
    expect(
      document.querySelectorAll(
        '[data-shelf-sticker] [data-sticker-earned="true"]',
      ),
    ).toHaveLength(2);
    expect(document.querySelector("[data-shelf-more]")).toBeNull();
    expect(document.querySelector("[data-shelf-open-all]")).toBeNull();
  });

  it("shows grey stickers, not an empty state, when none is earned", () => {
    shelf(
      [lesson("a", "Sao"), lesson("b", "Trăng")],
      [],
      [{ lessonId: "b", sectionId: "b.section.1", state: "done" }],
    );
    expect(document.querySelector("[data-shelf-count]")).toHaveTextContent(
      "Đã nhận 0/2",
    );
    // The part coloured one leads.
    expect(shelfIds()).toEqual(["b", "a"]);
    expect(
      screen.getByRole("img", { name: "Sticker Trăng, đã tô 1/3 phần" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Sticker Sao, chưa nhận" }),
    ).toBeInTheDocument();
  });

  it("keeps two rows with 30 earned: the latest ones and a +k tile", () => {
    shelf(manyLessons(34), earnedRecords(30));
    // Narrowest layout: 3 columns, 2 rows.
    expect(shelfTiles()).toHaveLength(5);
    expect(shelfIds()[0]).toBe("l30");
    expect(shelfIds()[4]).toBe("l26");
    expect(
      screen.getByRole("button", { name: "Xem thêm 29 danh hiệu" }),
    ).toHaveTextContent("+29");
    expect(document.querySelector("[data-shelf-count]")).toHaveTextContent(
      "Đã nhận 30/34",
    );
    expect(document.querySelectorAll("[data-shelf-grid] > li")).toHaveLength(6);
    // The full grid of every sticker is not on the page itself.
    expect(document.querySelectorAll("[data-sticker-lesson]")).toHaveLength(0);
  });

  it.each([
    [["(min-width: 40rem)"], 4],
    [["(min-width: 40rem)", "(min-width: 48rem)"], 5],
  ])("holds at most two rows at wider screens (%o)", (queries, columns) => {
    const restore = viewportMatches("(min-width: 0px)", ...queries);
    try {
      shelf(manyLessons(34), earnedRecords(30));
      const grid = document.querySelector("[data-shelf-grid]") as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe(
        `repeat(${columns}, minmax(0, 1fr))`,
      );
      expect(grid.children).toHaveLength(columns * 2);
      expect(document.querySelector("[data-shelf-more]")).toHaveTextContent(
        `+${34 - (columns * 2 - 1)}`,
      );
    } finally {
      restore();
    }
  });

  it("is the same size with 0, 3 and 30 earned stickers", () => {
    const counts = [0, 3, 30].map((earned) => {
      const { unmount } = shelf(manyLessons(34), earnedRecords(earned));
      const cells = document.querySelectorAll("[data-shelf-grid] > li").length;
      unmount();
      return cells;
    });
    expect(counts).toEqual([6, 6, 6]);
  });

  it("renders nothing without lessons", () => {
    const { container } = shelf([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the whole collection with every sticker, locked and part coloured too", () => {
    shelf(
      [lesson("a", "Sao"), lesson("b", "Trăng"), lesson("c", "Mây")],
      [{ lessonId: "c", at: "2026-02-01T00:00:00.000Z" }],
      [
        { lessonId: "a", sectionId: "a.section.1", state: "done" },
        { lessonId: "a", sectionId: "a.section.2", state: "done" },
      ],
    );
    // All three fit the grid, so the collection is only needed with more.
    expect(screen.queryByRole("button", { name: /Xem tất cả/ })).toBeNull();
  });

  it("opens the collection from the header button and from +k, and goes back to it after a sticker's sheet", () => {
    shelf(manyLessons(10), earnedRecords(8));
    fireEvent.click(screen.getByRole("button", { name: /Xem tất cả/ }));
    let dialog = screen.getByRole("dialog", { name: "Danh hiệu của bạn" });
    expect(within(dialog).getByText("Đã có 8/10 sticker")).toBeInTheDocument();
    expect(dialog.querySelectorAll("[data-sticker-lesson]")).toHaveLength(10);
    expect(
      within(dialog).getByRole("img", {
        name: "Sticker Danh hiệu 10, chưa nhận",
      }),
    ).toHaveAttribute("data-sticker-fill", "0/3");
    fireEvent.click(
      within(dialog).getByRole("button", { name: /^Danh hiệu 10,/ }),
    );
    expect(
      screen.getByRole("dialog", { name: "Sticker Danh hiệu 10" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    dialog = screen.getByRole("dialog", { name: "Danh hiệu của bạn" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Xem thêm/ }));
    expect(
      screen.getByRole("dialog", { name: "Danh hiệu của bạn" }),
    ).toBeInTheDocument();
  });

  it("opens its sheets beside the card, not inside it (the card is a stacking context that would keep a sheet under the cards after it)", () => {
    shelf(manyLessons(10), earnedRecords(8));
    fireEvent.click(screen.getByRole("button", { name: /Xem tất cả/ }));
    const card = document.querySelector("[data-sticker-shelf]");
    expect(card).toHaveClass("isolate");
    expect(card?.contains(screen.getByRole("dialog"))).toBe(false);
  });

  it("has touch targets of at least 48px on its buttons", () => {
    shelf(manyLessons(10), earnedRecords(8));
    expect(
      screen.getByRole("button", { name: /Xem tất cả/ }).className,
    ).toContain("min-h-touch");
    // A tile fills a cell at least 100px wide and holds a 72px picture.
    for (const tile of shelfTiles()) {
      expect(tile.className).toContain("w-full");
      expect(tile.querySelector("[data-sticker-earned]")?.className).toContain(
        "size-18",
      );
    }
  });

  it("has no music box, only the sticker sheet's own button", () => {
    shelf(manyLessons(3), earnedRecords(1));
    expect(document.body.textContent).not.toMatch(/Hộp nhạc/i);
    expect(document.querySelector("[data-music-button]")).toBeNull();
  });
});

describe("StickerShelf detail", () => {
  const sections = [
    { lessonId: "a", sectionId: "a.section.1", state: "done" as const },
    { lessonId: "a", sectionId: "a.section.2", state: "done" as const },
  ];
  function shelfOf(earned: string[] = []) {
    const sounds = {
      play: vi.fn(),
      tap: vi.fn(),
      button: vi.fn(),
      leave: vi.fn(),
    };
    render(
      <StickerShelf
        childId="kid-1"
        lessons={[
          { ...lesson("a", "Sao"), number: 4, title: "Phép cộng" },
          lesson("b", "Trăng"),
        ]}
        stickers={earned.map((lessonId) => ({
          lessonId,
          at: "2026-02-01T00:00:00.000Z",
        }))}
        sections={sections}
        sounds={sounds}
      />,
    );
    return sounds;
  }

  it("opens a sheet with name, lesson, progress, how to earn and a link to the lesson", () => {
    shelfOf();
    fireEvent.click(screen.getByRole("button", { name: /^Sao/ }));
    const sheet = screen.getByRole("dialog", { name: "Sticker Sao" });
    expect(sheet).toHaveAttribute("data-sticker-earned", "false");
    expect(sheet).toHaveTextContent("Bài 4: Phép cộng");
    expect(sheet).toHaveTextContent("Xong 2/3 phần");
    expect(sheet).toHaveTextContent("Học xong bài “Bài 4: Phép cộng” để nhận.");
    expect(screen.getByRole("link", { name: "Mở bài học" })).toHaveAttribute(
      "href",
      "/lessons/a",
    );
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape and shows an earned sticker as received", () => {
    shelfOf(["a"]);
    fireEvent.click(screen.getByRole("button", { name: /^Sao/ }));
    expect(screen.getByText("Đã nhận sticker này")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("plays a celebration clip for an earned sticker and a click for a locked one, with sparkle only on the earned", () => {
    const sounds = shelfOf(["a"]);
    fireEvent.click(screen.getByRole("button", { name: /^Sao/ }));
    // Only the celebration: the owl's congratulation is for earning the
    // sticker.
    expect(sounds.play).toHaveBeenCalledTimes(1);
    expect(CELEBRATION_IDS as readonly string[]).toContain(
      sounds.play.mock.calls[0]?.[0][0],
    );
    expect(sounds.play.mock.calls[0]?.[0]).toHaveLength(1);
    // The confetti bursts over the sheet, not under its backdrop.
    const backdrop = document.querySelector("[data-sticker-sheet-backdrop]");
    expect(backdrop?.querySelector("[data-confetti]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    fireEvent.click(screen.getByRole("button", { name: /^Trăng/ }));
    expect(sounds.tap).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[data-confetti]")).toBeNull();
  });

  it("shows no confetti under reduced motion, and none for a sticker not yet earned", () => {
    const original = window.matchMedia;
    window.matchMedia = (query: string) =>
      ({
        matches: true,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList;
    try {
      const sounds = shelfOf(["a"]);
      fireEvent.click(screen.getByRole("button", { name: /^Sao/ }));
      expect(document.querySelector("[data-confetti]")).toBeNull();
      expect(CELEBRATION_IDS as readonly string[]).toContain(
        sounds.play.mock.calls[0]?.[0][0],
      );
    } finally {
      window.matchMedia = original;
    }
  });
});
