import "fake-indexeddb/auto";
import { render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "@/app/(child)/home-screen";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  appDb,
  resetAppDbForTesting,
  setActiveProfile,
} from "@/progress/hooks";

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

  it("shows the music box chip, not the streak chip", async () => {
    await openHomeOf("racecar");
    const greeting = await screen.findByRole("region", { name: "Bạn cú" });
    await waitFor(() =>
      expect(
        within(greeting).getByRole("button", { name: /Hộp nhạc/ }),
      ).toBeInTheDocument(),
    );
    expect(document.querySelector("[data-streak]")).toBeNull();
    expect(screen.queryByText(/ngày nghỉ/)).toBeNull();
  });
});
