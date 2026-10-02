import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GradesScreen } from "@/app/(child)/grades/grades-screen";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  appDb,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  setActiveProfile,
} from "@/progress/hooks";
import type { ContentIndex } from "@/schema/content";

const replace = vi.hoisted(() => vi.fn());
const gradesVisible = vi.hoisted(() => ({ list: [6] as number[] }));
vi.mock("@/lib/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/config")>()),
  get VISIBLE_GRADES() {
    return gradesVisible.list;
  },
}));

// Shows every grade, as when the owner publishes more than grade 6.
const ALL_GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

function indexWithGrades(open: number[]): ContentIndex {
  return {
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
        series: [6, 7, 8].map((grade) => ({
          id: `g${grade}`,
          name: `Lớp ${grade}`,
          grade,
        })),
        defaultSeries: "g6",
      },
    ],
    lessons: open.map((grade) => ({
      id: `m${grade}`,
      subject: "math",
      series: `g${grade}`,
      order: 1,
      title: `Bài ${grade}`,
      sourceRef: "SGK",
      sections: [{ id: `m${grade}.section.1`, title: "Phần 1", minutes: 5 }],
      cardCount: 1,
      hasOverview: false,
      sticker: { name: "Sao", visualId: "fixture.visual.star-sticker" },
    })),
  };
}

async function openGradesOf(grade: number, open: number[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(indexWithGrades(open)))),
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
  render(<GradesScreen />);
  await screen.findByRole("heading", { name: "Chọn lớp" });
  await waitFor(() =>
    expect(document.querySelectorAll("[data-grade]")).toHaveLength(
      gradesVisible.list.length,
    ),
  );
}

beforeEach(() => {
  replace.mockClear();
  gradesVisible.list = ALL_GRADES;
});

afterEach(async () => {
  gradesVisible.list = [6];
  vi.unstubAllGlobals();
  resetContentIndexForTesting();
  await appDb().delete();
  resetAppDbForTesting();
});

describe("GradesScreen", () => {
  it("shows twelve grades and opens only the one that has lessons", async () => {
    await openGradesOf(6, [6]);
    const tiles = [...document.querySelectorAll("[data-grade]")];
    expect(tiles.map((t) => t.getAttribute("data-grade"))).toEqual(
      Array.from({ length: 12 }, (_, i) => String(i + 1)),
    );
    const enabled = tiles.filter((t) => !t.hasAttribute("data-locked"));
    expect(enabled.map((t) => t.getAttribute("data-grade"))).toEqual(["6"]);
    expect(enabled[0]?.tagName).toBe("BUTTON");
    expect(enabled[0]).toHaveAttribute("aria-pressed", "true");
    for (const tile of tiles.filter((t) => t.hasAttribute("data-locked"))) {
      expect(tile.tagName).not.toBe("BUTTON");
      expect(tile).toHaveTextContent("Sắp ra mắt");
    }
    expect(screen.getAllByText("Sắp ra mắt")).toHaveLength(11);
  });

  it("goes home on tapping the current grade without changing the profile", async () => {
    await openGradesOf(6, [6]);
    fireEvent.click(document.querySelector('[data-grade="6"]') as Element);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect((await appDb().profiles.get("kid-1"))?.grade).toBe(6);
  });

  it("saves another open grade on the profile and goes home", async () => {
    await openGradesOf(6, [6, 7]);
    const seven = document.querySelector('[data-grade="7"]') as Element;
    expect(seven.tagName).toBe("BUTTON");
    expect(seven).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(seven);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect((await appDb().profiles.get("kid-1"))?.grade).toBe(7);
  });

  it("does nothing on a locked grade", async () => {
    await openGradesOf(6, [6]);
    fireEvent.click(document.querySelector('[data-grade="9"]') as Element);
    expect(replace).not.toHaveBeenCalled();
    expect((await appDb().profiles.get("kid-1"))?.grade).toBe(6);
  });
});

describe("GradesScreen with one visible grade", () => {
  it("lists only that grade, which stays tappable", async () => {
    gradesVisible.list = [6];
    await openGradesOf(6, [6, 7]);
    const tiles = [...document.querySelectorAll("[data-grade]")];
    expect(tiles.map((t) => t.getAttribute("data-grade"))).toEqual(["6"]);
    fireEvent.click(tiles[0] as Element);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
  });
});
