import "fake-indexeddb/auto";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import {
  ACTIVE_PROFILE_KEY,
  awardSticker,
  DEVICE_SCOPE,
  putProfile,
  putSectionProgress,
  setSetting,
} from "@/progress/db";
import {
  appDb,
  buildProfile,
  CONTENT_INDEX_URL,
  createProfile,
  readChildProgress,
  requestContentIndex,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  setActiveProfile,
  useActiveProfile,
  useChildProgress,
  useContentIndex,
  useProfiles,
} from "@/progress/hooks";
import type { ContentIndex, Subject } from "@/schema/content";

const subjects: Subject[] = [
  {
    id: "math",
    name: "Toán",
    color: "math",
    series: [{ id: "kntt", name: "Kết nối" }],
    defaultSeries: "kntt",
  },
  {
    id: "literature",
    name: "Ngữ văn",
    color: "literature",
    series: [{ id: "ctst", name: "Chân trời" }],
    defaultSeries: "ctst",
  },
];

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
  resetContentIndexForTesting();
  setNowForTesting(null);
  vi.unstubAllGlobals();
});

describe("buildProfile", () => {
  it("trims the name and starts every subject on its default series", () => {
    const profile = buildProfile(
      { name: "  Bé Na ", avatar: "fox" },
      subjects,
      new Date("2026-03-01T02:00:00Z"),
    );
    expect(profile).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{32}$/),
      familyId: LOCAL_FAMILY_ID,
      name: "Bé Na",
      avatar: "fox",
      series: { math: "kntt", literature: "ctst" },
      createdAt: "2026-03-01T02:00:00.000Z",
    });
  });
});

describe("profiles and the active child", () => {
  it("starts with no profiles and no active child", async () => {
    const profiles = renderHook(() => useProfiles());
    const active = renderHook(() => useActiveProfile());
    expect(active.result.current).toEqual({ status: "loading" });
    await waitFor(() => expect(profiles.result.current).toEqual([]));
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "none" }),
    );
  });

  it("creates a profile, selects it and lets another be picked", async () => {
    setNowForTesting(() => new Date("2026-03-01T02:00:00Z"));
    const profiles = renderHook(() => useProfiles());
    const active = renderHook(() => useActiveProfile());

    let na = await act(() =>
      createProfile({ name: "Bé Na", avatar: "cat" }, subjects),
    );
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "ready", profile: na }),
    );

    setNowForTesting(() => new Date("2026-03-02T02:00:00Z"));
    const bin = await act(() =>
      createProfile({ name: "Bin", avatar: "bear" }, subjects),
    );
    await waitFor(() =>
      expect(profiles.result.current?.map((p) => p.name)).toEqual([
        "Bé Na",
        "Bin",
      ]),
    );
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "ready", profile: bin }),
    );

    await act(() => setActiveProfile(na.id));
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "ready", profile: na }),
    );

    na = { ...na, name: "Na" };
    await act(() => putProfile(appDb(), na));
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "ready", profile: na }),
    );

    await act(() => setActiveProfile(null));
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "none" }),
    );
  });

  it("ignores a remembered id whose profile is gone or from another family", async () => {
    await setSetting(appDb(), DEVICE_SCOPE, ACTIVE_PROFILE_KEY, "missing");
    const active = renderHook(() => useActiveProfile());
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "none" }),
    );

    const stranger = {
      ...buildProfile({ name: "Cam", avatar: "fox" }, subjects, new Date()),
      familyId: "other",
    };
    await act(async () => {
      await putProfile(appDb(), stranger);
      await setActiveProfile(stranger.id);
    });
    await waitFor(() =>
      expect(active.result.current).toEqual({ status: "none" }),
    );
  });
});

describe("child progress", () => {
  it("reads one child's attempts, sections and stickers", async () => {
    const scope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
    const section = {
      ...scope,
      sectionId: "powers.section.one",
      lessonId: "powers",
      state: "done" as const,
      blockIndex: 3,
      updatedAt: "2026-03-02T01:00:00.000Z",
    };
    await putSectionProgress(appDb(), section);
    await putSectionProgress(appDb(), { ...section, childId: "kid-2" });

    const { result } = renderHook(() => useChildProgress("kid-1"));
    await waitFor(() =>
      expect(result.current).toEqual({
        attempts: [],
        sections: [section],
        stickers: [],
      }),
    );

    await act(() =>
      awardSticker(appDb(), scope, "powers", new Date("2026-03-02T02:00:00Z")),
    );
    await waitFor(() =>
      expect(result.current?.stickers.map((s) => s.lessonId)).toEqual([
        "powers",
      ]),
    );
    expect((await readChildProgress(appDb(), "kid-2")).sections).toHaveLength(
      1,
    );
  });
});

describe("useContentIndex", () => {
  const index: ContentIndex = { subjects, lessons: [] };

  function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status });
  }

  it("fetches and validates the index once for every screen", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(index));
    vi.stubGlobal("fetch", fetchMock);

    const first = renderHook(() => useContentIndex());
    expect(first.result.current).toEqual({ status: "loading" });
    await waitFor(() =>
      expect(first.result.current).toEqual({ status: "ready", index }),
    );

    const second = renderHook(() => useContentIndex());
    expect(second.result.current).toEqual({ status: "ready", index });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(CONTENT_INDEX_URL);
  });

  it("reports failures and retries on request", async () => {
    const fetchMock = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(jsonResponse({}, 404))
      .mockResolvedValueOnce(jsonResponse({ subjects: "nope" }))
      .mockResolvedValueOnce(jsonResponse(index));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useContentIndex());
    await waitFor(() => expect(result.current).toEqual({ status: "error" }));

    act(requestContentIndex);
    await waitFor(() => expect(result.current).toEqual({ status: "error" }));

    act(requestContentIndex);
    await waitFor(() =>
      expect(result.current).toEqual({ status: "ready", index }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
