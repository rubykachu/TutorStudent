import "fake-indexeddb/auto";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "@/app/(child)/home-screen";
import { markLaunched } from "@/lib/cold-launch";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";
import { OWL_TAP_INVITE, OWL_TAP_LINE } from "@/mascot/lines";
import {
  backgroundMusic,
  resetBackgroundMusicForTesting,
} from "@/music/background-music";
import {
  appDb,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  setActiveProfile,
  setBackgroundMusicEnabled,
  setSoundEnabled,
} from "@/progress/hooks";
import type { ContentIndex, LessonSummary } from "@/schema/content";

const playSequence = vi.hoisted(() => vi.fn(async () => undefined));
const gradesVisible = vi.hoisted(() => ({ list: [6] as number[] }));
vi.mock("@/lib/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/config")>()),
  get VISIBLE_GRADES() {
    return gradesVisible.list;
  },
}));

const originalMatchMedia = window.matchMedia;

// Shows every grade, as when the owner publishes more than grade 6.
const ALL_GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

const unlockAudio = vi.hoisted(() => vi.fn());
vi.mock("@/lib/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/sound")>()),
  playSequence,
  unlockAudio,
}));

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

beforeEach(() => {
  // Most tests open home within a session (after the picker).
  markLaunched();
  // The content index is not what these tests are about.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 404 })),
  );
});

afterEach(async () => {
  gradesVisible.list = [6];
  playSequence.mockClear();
  unlockAudio.mockClear();
  replace.mockClear();
  sessionStorage.clear();
  resetBackgroundMusicForTesting();
  window.matchMedia = originalMatchMedia;
  vi.unstubAllGlobals();
  resetContentIndexForTesting();
  await appDb().delete();
  resetAppDbForTesting();
});

async function openHomeOf(avatar: string) {
  await appDb().profiles.put({
    id: "kid-1",
    familyId: LOCAL_FAMILY_ID,
    name: "Bin",
    avatar,
    grade: 6,
    series: {},
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  await setActiveProfile("kid-1");
  return render(<HomeScreen />);
}

// Sound is on by default, but the setting is read asynchronously.
async function soundIsOn() {
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Âm thanh" })).toHaveAttribute(
      "data-sound",
      "on",
    ),
  );
}

describe("HomeScreen", () => {
  it("keeps the profile button's name when it shows only the avatar on a phone", async () => {
    await openHomeOf("fox");
    const link = await screen.findByRole("link", { name: "Đổi hồ sơ" });
    // The word is for tablets and wider; a phone shows the avatar alone so
    // the greeting stays on one line.
    expect(link.querySelector("span.hidden.sm\\:inline")?.textContent).toBe(
      "Đổi hồ sơ",
    );
  });

  it("plays the owl's hoot and cheers when the owl is tapped", async () => {
    await openHomeOf("cat");
    await screen.findByRole("button", { name: "Chạm vào bạn cú" });
    expect(
      document.querySelector("[data-mascot]")?.getAttribute("data-mascot"),
    ).toBe("idle");
    await soundIsOn();
    // The owl reads the sound setting on its own; tap until it has.
    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: "Chạm vào bạn cú" }));
      expect(playSequence).toHaveBeenCalledWith([soundUrl(OWL_TAP_LINE.id)]);
    });
    await waitFor(() =>
      expect(
        document.querySelector("[data-mascot]")?.getAttribute("data-mascot"),
      ).toBe("cheer"),
    );
    // The owl loops gently while it waits.
    expect(document.querySelector("[data-mascot-loop]")).not.toBeNull();
  });

  it("plays the avatar's own sound when the child taps their avatar", async () => {
    await openHomeOf("racecar");
    await soundIsOn();
    fireEvent.click(
      await screen.findByRole("button", { name: "Nghe tiếng Xe đua" }),
    );
    expect(playSequence).toHaveBeenCalledWith([
      soundUrl(AVATAR_CLIP_IDS.racecar),
    ]);
  });

  it("is silent when the child turned sound off", async () => {
    await openHomeOf("cat");
    await setSoundEnabled("kid-1", false);
    const owl = await screen.findByRole("button", { name: "Chạm vào bạn cú" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Âm thanh" })).toHaveAttribute(
        "data-sound",
        "off",
      ),
    );
    fireEvent.click(owl);
    fireEvent.click(screen.getByRole("button", { name: "Nghe tiếng Mèo" }));
    expect(playSequence).not.toHaveBeenCalled();
  });

  it("shows the chosen avatar beside the greeting and in the profile button", async () => {
    await openHomeOf("spider");
    const heading = await screen.findByRole("heading", { name: "Chào Bin!" });
    expect(
      heading.closest("header")?.querySelector('[data-avatar="spider"]'),
    ).not.toBeNull();
    const switchLink = screen.getByRole("link", { name: "Đổi hồ sơ" });
    expect(switchLink.querySelector('[data-avatar="spider"]')).not.toBeNull();
    // The owl stays the mascot of the page.
    expect(
      await screen.findByRole("region", { name: "Bạn cú" }),
    ).toBeInTheDocument();
  });

  it("has no music box chip and no streak chip", async () => {
    await openHomeOf("racecar");
    const greeting = await screen.findByRole("region", { name: "Bạn cú" });
    // The owl's own tap button is the only control beside the greeting.
    expect(within(greeting).getAllByRole("button")).toHaveLength(1);
    expect(document.querySelector("[data-streak]")).toBeNull();
    expect(screen.queryByText(/ngày nghỉ/)).toBeNull();
    expect(document.body.textContent).not.toMatch(/nhạc/i);
  });
});

function summary(n: number): LessonSummary {
  const id = `math-${String(n).padStart(2, "0")}`;
  return {
    id,
    subject: "math",
    series: "kntt",
    order: n,
    title: `Bài ${n}`,
    sourceRef: "SGK",
    sections: [{ id: `${id}.section.1`, title: "Phần 1", minutes: 5 }],
    cardCount: 1,
    hasOverview: false,
    sticker: {
      name: `Danh hiệu ${n}`,
      visualId: "fixture.visual.star-sticker",
    },
  };
}

async function openHomeWithStickers(lessons: number, earned: number) {
  const index: ContentIndex = {
    subjects: [
      {
        id: "math",
        name: "Toán",
        color: "blue",
        icon: "calculator",
        language: "vi",
        rules: {
          checkExpr: false,
          verbatimPassage: false,
          requiresOpenEnded: false,
        },
        series: [{ id: "kntt", name: "Kết nối", grade: 6 }],
        defaultSeries: "kntt",
      },
    ],
    lessons: Array.from({ length: lessons }, (_, i) => summary(i + 1)),
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(index))),
  );
  await appDb().stickers.bulkPut(
    Array.from({ length: earned }, (_, i) => ({
      familyId: LOCAL_FAMILY_ID,
      childId: "kid-1",
      lessonId: summary(i + 1).id,
      at: `2026-02-01T10:${String(i).padStart(2, "0")}:00.000Z`,
    })),
  );
  return openHomeOf("fox");
}

describe("HomeScreen sticker shelf", () => {
  it("sits right under the owl, above the lessons, and has one shelf only", async () => {
    await openHomeWithStickers(8, 2);
    const shelf = await screen.findByRole("region", {
      name: "Danh hiệu của bạn",
    });
    expect(shelf).toHaveTextContent("Đã nhận 2/8");
    const owl = screen.getByRole("region", { name: "Bạn cú" });
    expect(owl.compareDocumentPosition(shelf)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    const subject = document.querySelector("[data-subject]");
    expect(subject).not.toBeNull();
    expect(
      shelf.compareDocumentPosition(subject as Element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(document.querySelectorAll("[data-sticker-shelf]")).toHaveLength(1);
    // The grid of every sticker is no longer on the page.
    expect(document.querySelectorAll("[data-sticker-lesson]")).toHaveLength(0);
  });

  it("ends with its own band of sky below the last content", async () => {
    await openHomeWithStickers(8, 2);
    await screen.findByRole("region", { name: "Danh hiệu của bạn" });
    const main = document.querySelector("main") as HTMLElement;
    const horizon = main.querySelector("[data-cosmos-horizon]");
    expect(horizon).not.toBeNull();
    expect(main.lastElementChild).toBe(horizon);
    expect(
      main
        .querySelector("[data-subject]")
        ?.compareDocumentPosition(horizon as Element),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("gives each subject tile its own cosmic scene", async () => {
    await openHomeWithStickers(8, 2);
    await screen.findByRole("region", { name: "Danh hiệu của bạn" });
    expect(
      document.querySelectorAll("[data-subject] [data-subject-art]"),
    ).toHaveLength(document.querySelectorAll("[data-subject]").length);
  });

  it.each([0, 3, 30])(
    "keeps the shelf at two rows of three (the narrowest layout) with %i earned",
    async (earned) => {
      await openHomeWithStickers(34, earned);
      const shelf = await screen.findByRole("region", {
        name: "Danh hiệu của bạn",
      });
      expect(shelf).toHaveTextContent(`Đã nhận ${earned}/34`);
      // Six cells: five stickers and the "+k" tile.
      expect(document.querySelectorAll("[data-shelf-grid] > li")).toHaveLength(
        6,
      );
      expect(document.querySelectorAll("[data-shelf-sticker]")).toHaveLength(5);
      expect(document.querySelector("[data-shelf-more]")).toHaveTextContent(
        "+29",
      );
      expect(document.querySelector("[data-shelf-empty]")).toBeNull();
    },
  );
});

function subjectOf(
  id: string,
  name: string,
  series: [string, number][],
): ContentIndex["subjects"][number] {
  return {
    id,
    name,
    color: "blue",
    icon: "calculator",
    language: "vi",
    rules: {
      checkExpr: false,
      verbatimPassage: false,
      requiresOpenEnded: false,
    },
    series: series.map(([sid, grade]) => ({ id: sid, name: sid, grade })),
    defaultSeries: series[0]?.[0] ?? "",
  };
}

// Five grade 6 subjects of which only math and literature have a lesson, and
// a grade 7 series of math with none.
function gradeSixIndex(): ContentIndex {
  const literature = {
    ...summary(1),
    id: "lit-01",
    subject: "literature",
    series: "ctst",
  };
  return {
    subjects: [
      subjectOf("math", "Toán", [
        ["kntt", 6],
        ["kntt-7", 7],
      ]),
      subjectOf("literature", "Ngữ văn", [["ctst", 6]]),
      subjectOf("geography", "Địa lí", [["kntt", 6]]),
      subjectOf("history", "Lịch sử", [["kntt", 6]]),
      subjectOf("science", "Khoa học tự nhiên", [["kntt", 6]]),
    ],
    lessons: [summary(1), literature],
  };
}

async function openHomeOfGrade(grade: number, index: ContentIndex) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(index))),
  );
  await appDb().profiles.put({
    id: "kid-1",
    familyId: LOCAL_FAMILY_ID,
    name: "Bin",
    avatar: "fox",
    grade,
    series: {},
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  await setActiveProfile("kid-1");
  return render(<HomeScreen />);
}

describe("HomeScreen grade and locked subjects", () => {
  beforeEach(() => {
    gradesVisible.list = ALL_GRADES;
  });

  it("shows the five subjects of grade 6, three of them locked and not tappable", async () => {
    await openHomeOfGrade(6, gradeSixIndex());
    await screen.findByText("Toán");
    const tiles = [...document.querySelectorAll("[data-subject]")];
    expect(tiles.map((t) => t.getAttribute("data-subject"))).toEqual([
      "math",
      "literature",
      "geography",
      "history",
      "science",
    ]);
    const locked = tiles.filter((t) => t.hasAttribute("data-locked"));
    expect(locked.map((t) => t.getAttribute("data-subject"))).toEqual([
      "geography",
      "history",
      "science",
    ]);
    for (const tile of locked) {
      expect(tile.tagName).not.toBe("A");
      expect(tile).toHaveTextContent("Sắp ra mắt");
    }
    for (const id of ["math", "literature"]) {
      const tile = document.querySelector(`[data-subject="${id}"]`);
      expect(tile?.tagName).toBe("A");
      expect(tile).not.toHaveAttribute("data-locked");
    }
  });

  it("names the grade in the header and links it to the grade screen", async () => {
    await openHomeOfGrade(6, gradeSixIndex());
    const chip = await screen.findByRole("link", { name: "Lớp 6, đổi lớp" });
    expect(chip).toHaveAttribute("href", "/grades");
    expect(chip).toHaveTextContent("Lớp 6");
  });

  it("shows the subjects of the child's grade, locked until they have a lesson", async () => {
    await openHomeOfGrade(7, gradeSixIndex());
    await screen.findByRole("link", { name: "Lớp 7, đổi lớp" });
    await waitFor(() =>
      expect(document.querySelector("[data-subject]")).not.toBeNull(),
    );
    const tiles = [...document.querySelectorAll("[data-subject]")];
    expect(tiles.map((t) => t.getAttribute("data-subject"))).toEqual(["math"]);
    expect(tiles[0]).toHaveAttribute("data-locked");
  });
});

describe("HomeScreen hidden subjects", () => {
  function onlyMathVisible(): ContentIndex {
    const index = gradeSixIndex();
    return {
      ...index,
      subjects: index.subjects.map((s) =>
        s.id === "math" ? s : { ...s, visible: false },
      ),
    };
  }

  it("lists no tile, locked or not, for a subject marked hidden, and keeps the lone tile a full-width row", async () => {
    await openHomeOfGrade(6, onlyMathVisible());
    await screen.findByText("Toán");
    const tiles = [...document.querySelectorAll("[data-subject]")];
    expect(tiles.map((t) => t.getAttribute("data-subject"))).toEqual(["math"]);
    expect(document.querySelector("[data-locked]")).toBeNull();
    expect(screen.queryByText("Ngữ văn")).toBeNull();
    // The solo layout has no three-column grid and no subgrid rows.
    expect(tiles[0]?.className).not.toContain("row-span-5");
    expect(tiles[0]?.closest("ul")?.className).not.toContain("grid-cols-3");
  });

  it("does not count a hidden subject's lessons in the sticker shelf or lead the child into them", async () => {
    await openHomeOfGrade(6, onlyMathVisible());
    await screen.findByText("Toán");
    expect(document.querySelector("[data-shelf-count]")).toHaveTextContent(
      "Đã nhận 0/1",
    );
    // The continue card leads to a math lesson, never the literature one.
    expect(
      document.querySelector("[data-continue]")?.getAttribute("href"),
    ).not.toContain("lit-01");
  });
});

describe("HomeScreen with one visible grade", () => {
  it("shows no grade chip, so the child never meets the grade screen", async () => {
    await openHomeOfGrade(6, gradeSixIndex());
    await screen.findByText("Toán");
    expect(screen.queryByRole("link", { name: /đổi lớp/ })).toBeNull();
    expect(document.querySelector("[data-grade-chip]")).toBeNull();
  });

  it("studies grade 6 for a profile saved with a hidden grade", async () => {
    await openHomeOfGrade(7, gradeSixIndex());
    await screen.findByText("Toán");
    const tile = document.querySelector('[data-subject="math"]');
    expect(tile).not.toBeNull();
    expect(tile).not.toHaveAttribute("data-locked");
    // The stored record keeps its own grade.
    expect((await appDb().profiles.get("kid-1"))?.grade).toBe(7);
  });
});

describe("HomeScreen on a cold launch", () => {
  it("sends a fresh launch to the picker even with a remembered child", async () => {
    sessionStorage.clear();
    await openHomeOf("fox");
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profiles"));
    expect(screen.queryByRole("heading", { name: "Chào Bin!" })).toBeNull();
  });

  it("stays home once the session has started (a reload, in-app navigation)", async () => {
    await openHomeOf("fox");
    expect(
      await screen.findByRole("heading", { name: "Chào Bin!" }),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("HomeScreen owl inviting the first tap", () => {
  const bubble = () => screen.queryByText(OWL_TAP_INVITE);
  const invite = () =>
    document
      .querySelector("[data-owl-invite]")
      ?.getAttribute("data-owl-invite");

  it("asks for a tap while audio is locked, wiggling, and the tap unlocks it at once", async () => {
    await openHomeOf("fox");
    expect(await screen.findByText(OWL_TAP_INVITE)).toBeInTheDocument();
    expect(invite()).toBe("wiggle");
    fireEvent.click(screen.getByRole("button", { name: "Chạm vào bạn cú" }));
    // Synchronously inside the tap.
    expect(unlockAudio).toHaveBeenCalledTimes(1);
    expect(backgroundMusic().isUnlocked()).toBe(true);
    await waitFor(() => expect(bubble()).toBeNull());
    expect(invite()).toBeUndefined();
  });

  it("hides the bubble after a first tap anywhere else", async () => {
    await openHomeOf("fox");
    await screen.findByText(OWL_TAP_INVITE);
    // What the page's tap listener does on any tap.
    act(() => backgroundMusic().unlock());
    await waitFor(() => expect(bubble()).toBeNull());
  });

  it("shows no bubble when audio is already unlocked", async () => {
    backgroundMusic().unlock();
    await openHomeOf("fox");
    await screen.findByRole("heading", { name: "Chào Bin!" });
    await screen.findByRole("button", { name: "Chạm vào bạn cú" });
    expect(bubble()).toBeNull();
  });

  it("does not wiggle under reduced motion", async () => {
    window.matchMedia = (query: string) =>
      ({
        matches: true,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList;
    await openHomeOf("fox");
    await screen.findByText(OWL_TAP_INVITE);
    expect(invite()).toBe("still");
  });

  it("shows no bubble when the music is off", async () => {
    await setBackgroundMusicEnabled(false);
    await openHomeOf("fox");
    await screen.findByRole("button", { name: "Chạm vào bạn cú" });
    await screen.findByRole("button", { name: "Âm thanh" });
    expect(bubble()).toBeNull();
  });

  it("shows no bubble and says nothing when the child turned sound off", async () => {
    await openHomeOf("fox");
    await setSoundEnabled("kid-1", false);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Âm thanh" })).toHaveAttribute(
        "data-sound",
        "off",
      ),
    );
    await waitFor(() => expect(bubble()).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Chạm vào bạn cú" }));
    expect(playSequence).not.toHaveBeenCalled();
  });
});
