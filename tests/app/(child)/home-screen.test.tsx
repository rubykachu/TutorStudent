import "fake-indexeddb/auto";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "@/app/(child)/home-screen";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";
import { OWL_TAP_LINE } from "@/mascot/lines";
import {
  appDb,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  setActiveProfile,
  setSoundEnabled,
} from "@/progress/hooks";
import type { ContentIndex, LessonSummary } from "@/schema/content";

const playSequence = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@/lib/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/sound")>()),
  playSequence,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

beforeEach(() => {
  // The content index is not what these tests are about.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 404 })),
  );
});

afterEach(async () => {
  playSequence.mockClear();
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
    series: {},
    createdAt: "2026-01-01T00:00:00.000Z",
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
      heading.parentElement?.querySelector('[data-avatar="spider"]'),
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
        series: [{ id: "kntt", name: "Kết nối" }],
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
