import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  buildStickerEntries,
  latestEarned,
  nextToEarn,
  SHELF_RECENT,
  StickerShelf,
  stickerCollectionCaption,
} from "@/app/(child)/sticker-shelf";
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
    <StickerShelf lessons={lessons} stickers={stickers} sections={sections} />,
  );
}

const shelfTiles = () => document.querySelectorAll("[data-shelf-sticker]");

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

  it("aims at the sticker coloured furthest, else the first one", () => {
    const lessons = [lesson("a", "A"), lesson("b", "B"), lesson("c", "C")];
    const none = buildStickerEntries(lessons, [], []);
    expect(nextToEarn(none)?.lesson.id).toBe("a");
    const started = buildStickerEntries(
      lessons,
      [{ lessonId: "a", at: "2026-01-01T00:00:00.000Z" }],
      [{ lessonId: "c", sectionId: "c.section.1", state: "done" }],
    );
    expect(nextToEarn(started)?.lesson.id).toBe("c");
    const all = buildStickerEntries(
      lessons,
      lessons.map((l) => ({ lessonId: l.id, at: "2026-01-01T00:00:00.000Z" })),
      [],
    );
    expect(nextToEarn(all)).toBeUndefined();
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
  it("counts earned out of all in the title and shows the earned ones in colour", () => {
    shelf(manyLessons(5), earnedRecords(2));
    expect(
      screen.getByRole("heading", { name: "Danh hiệu của bạn · 2/5" }),
    ).toBeInTheDocument();
    expect(shelfTiles()).toHaveLength(2);
    expect(
      document.querySelectorAll(
        '[data-shelf-sticker] [data-sticker-earned="true"]',
      ),
    ).toHaveLength(2);
    expect(document.querySelector("[data-shelf-empty]")).toBeNull();
    expect(document.querySelector("[data-shelf-more]")).toBeNull();
  });

  it("keeps its size with 30 stickers: only the latest few and a +k tile", () => {
    shelf(manyLessons(34), earnedRecords(30));
    expect(shelfTiles()).toHaveLength(SHELF_RECENT);
    // Latest first: the last earned lesson leads.
    expect(shelfTiles()[0]).toHaveAttribute("data-shelf-sticker", "l30");
    expect(shelfTiles()[SHELF_RECENT - 1]).toHaveAttribute(
      "data-shelf-sticker",
      `l${30 - SHELF_RECENT + 1}`,
    );
    expect(
      screen.getByRole("button", {
        name: `Xem thêm ${30 - SHELF_RECENT} danh hiệu`,
      }),
    ).toHaveTextContent(`+${30 - SHELF_RECENT}`);
    expect(
      screen.getByRole("heading", { name: "Danh hiệu của bạn · 30/34" }),
    ).toBeInTheDocument();
    // The old section of every sticker is gone from the page itself.
    expect(document.querySelectorAll("[data-sticker-lesson]")).toHaveLength(0);
  });

  it("has the same row with 7 as with 30 earned (one tile per shown sticker, plus +k)", () => {
    const { unmount } = shelf(manyLessons(40), earnedRecords(SHELF_RECENT));
    expect(shelfTiles()).toHaveLength(SHELF_RECENT);
    expect(document.querySelector("[data-shelf-more]")).toBeNull();
    unmount();
    shelf(manyLessons(40), earnedRecords(SHELF_RECENT + 1));
    expect(shelfTiles()).toHaveLength(SHELF_RECENT);
    expect(document.querySelector("[data-shelf-more]")).toHaveTextContent("+1");
  });

  it("says how to win the first one and shows the next sticker when none is earned", () => {
    shelf(
      [lesson("a", "Sao"), lesson("b", "Trăng")],
      [],
      [{ lessonId: "b", sectionId: "b.section.1", state: "done" }],
    );
    expect(
      screen.getByRole("heading", { name: "Danh hiệu của bạn · 0/2" }),
    ).toBeInTheDocument();
    const empty = document.querySelector("[data-shelf-empty]");
    expect(empty).toHaveTextContent(
      "Học xong một bài để nhận danh hiệu đầu tiên",
    );
    // The one to aim for is the one already part coloured.
    expect(empty).toHaveTextContent("“Trăng”");
    expect(
      within(empty as HTMLElement).getByRole("img", {
        name: "Sticker Trăng, đã tô 1/3 phần",
      }),
    ).toBeInTheDocument();
    expect(shelfTiles()).toHaveLength(1);
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
    fireEvent.click(screen.getByRole("button", { name: /Xem tất cả/ }));
    const dialog = screen.getByRole("dialog", { name: "Danh hiệu của bạn" });
    expect(
      within(dialog).getByText("Đã có 1/3 sticker · 1 đang tô màu"),
    ).toBeInTheDocument();
    expect(dialog.querySelectorAll("[data-sticker-lesson]")).toHaveLength(3);
    expect(
      within(dialog).getByRole("img", { name: "Sticker Sao, đã tô 2/3 phần" }),
    ).toHaveAttribute("data-sticker-fill", "2/3");
    expect(
      within(dialog).getByRole("img", { name: "Sticker Trăng, chưa nhận" }),
    ).toHaveAttribute("data-sticker-fill", "0/3");
    expect(
      within(dialog).getByRole("img", { name: "Sticker Mây" }),
    ).toHaveAttribute("data-sticker-earned", "true");
    fireEvent.click(within(dialog).getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the collection from +k too, and goes back to it after a sticker's sheet", () => {
    shelf(manyLessons(10), earnedRecords(8));
    fireEvent.click(
      screen.getByRole("button", { name: /Xem thêm 2 danh hiệu/ }),
    );
    const dialog = screen.getByRole("dialog", { name: "Danh hiệu của bạn" });
    fireEvent.click(
      within(dialog).getByRole("button", { name: /^Danh hiệu 10,/ }),
    );
    expect(
      screen.getByRole("dialog", { name: "Sticker Danh hiệu 10" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(
      screen.getByRole("dialog", { name: "Danh hiệu của bạn" }),
    ).toBeInTheDocument();
  });

  it("has touch targets of at least 48px on its buttons", () => {
    shelf(manyLessons(10), earnedRecords(8));
    const all = screen.getByRole("button", { name: /Xem tất cả/ });
    expect(all.className).toContain("min-h-touch");
    // A tile is 80px wide and holds a 56px picture, so it is above 48px.
    for (const tile of shelfTiles()) {
      expect(tile.className).toContain("w-20");
      expect(tile.querySelector("[data-sticker-earned]")?.className).toContain(
        "size-14",
      );
    }
  });

  it("never names the removed music box", () => {
    shelf(manyLessons(3), earnedRecords(1));
    expect(document.body.textContent).not.toMatch(/nhạc|Hộp nhạc/i);
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

  it("plays the jingle for an earned sticker and a click for a locked one, with sparkle only on the earned", () => {
    const sounds = shelfOf(["a"]);
    fireEvent.click(screen.getByRole("button", { name: /^Sao/ }));
    // Only the jingle: the owl's congratulation is for earning the sticker.
    expect(sounds.play).toHaveBeenCalledTimes(1);
    expect(sounds.play).toHaveBeenCalledWith(["correct-jingle"]);
    // The confetti bursts over the sheet, not under its backdrop.
    const backdrop = document.querySelector("[data-sticker-sheet-backdrop]");
    expect(backdrop?.querySelector("[data-confetti]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    // The locked sticker is in the collection, not on the shelf.
    fireEvent.click(screen.getByRole("button", { name: /Xem tất cả/ }));
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
      expect(sounds.play).toHaveBeenCalledWith(["correct-jingle"]);
    } finally {
      window.matchMedia = original;
    }
  });
});
