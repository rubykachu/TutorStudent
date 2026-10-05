import "fake-indexeddb/auto";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRequiredProfile } from "@/app/(child)/use-required-profile";
import { isColdLaunch, markLaunched } from "@/lib/cold-launch";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  appDb,
  resetAppDbForTesting,
  setActiveProfile,
} from "@/progress/hooks";

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

afterEach(async () => {
  replace.mockClear();
  sessionStorage.clear();
  vi.restoreAllMocks();
  await appDb().delete();
  resetAppDbForTesting();
});

async function rememberChild() {
  await appDb().profiles.put({
    id: "kid-1",
    familyId: LOCAL_FAMILY_ID,
    name: "Bin",
    avatar: "fox",
    grade: 6,
    series: {},
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  await setActiveProfile("kid-1");
}

describe("cold launch", () => {
  it("is cold until the session is marked, which survives in sessionStorage", () => {
    expect(isColdLaunch()).toBe(true);
    markLaunched();
    expect(isColdLaunch()).toBe(false);
  });

  it("is never cold when sessionStorage is blocked, so nothing is in the way", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(isColdLaunch()).toBe(false);
  });
});

describe("useRequiredProfile", () => {
  it("shows a screen opened first by a link (a lesson) and marks the launch", async () => {
    await rememberChild();
    const { result } = renderHook(() => useRequiredProfile());
    await waitFor(() => expect(result.current?.id).toBe("kid-1"));
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(isColdLaunch()).toBe(false));
  });

  it("sends home to the picker on a cold launch, without marking it", async () => {
    await rememberChild();
    const { result } = renderHook(() =>
      useRequiredProfile({ pickOnColdLaunch: true }),
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profiles"));
    expect(result.current).toBeNull();
    expect(isColdLaunch()).toBe(true);
  });

  it("sends any screen to the picker when no child is chosen", async () => {
    renderHook(() => useRequiredProfile());
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profiles"));
  });
});
