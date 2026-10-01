import "fake-indexeddb/auto";
import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "@/app/(child)/home-screen";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  appDb,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  setActiveProfile,
} from "@/progress/hooks";
import type { ContentIndex, LessonSummary } from "@/schema/content";

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

describe("HomeScreen", () => {
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
    expect(within(greeting).queryByRole("button")).toBeNull();
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
      name: /Danh hiệu của bạn · 2\/8/,
    });
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

  it.each([0, 3, 30])(
    "keeps the shelf one row of at most six stickers with %i earned",
    async (earned) => {
      await openHomeWithStickers(34, earned);
      await screen.findByRole("heading", {
        name: `Danh hiệu của bạn · ${earned}/34`,
      });
      const tiles = document.querySelectorAll("[data-shelf-sticker]");
      expect(tiles).toHaveLength(Math.max(1, Math.min(earned, 6)));
      expect(document.querySelectorAll("[data-shelf-row] > li").length).toBe(
        earned === 0 ? 0 : Math.min(earned, 6) + (earned > 6 ? 1 : 0),
      );
      expect(document.querySelector("[data-shelf-empty]") !== null).toBe(
        earned === 0,
      );
    },
  );
});
