import "fake-indexeddb/auto";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { lessonContentUrl } from "@/content";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { setNowForTesting } from "@/lib/time";
import {
  ACTIVE_PROFILE_KEY,
  awardSticker,
  DEVICE_SCOPE,
  markActivityDay,
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
  readSoundEnabled,
  requestContentIndex,
  requestLesson,
  resetAppDbForTesting,
  resetContentIndexForTesting,
  resetLessonsForTesting,
  setActiveProfile,
  setSoundEnabled,
  useActiveProfile,
  useChildProgress,
  useContentIndex,
  useLesson,
  useLessonProgress,
  useProfiles,
  useSoundEnabled,
} from "@/progress/hooks";
import { recordAttempt, saveSectionPosition } from "@/progress/record";
import type { ContentIndex, Subject } from "@/schema/content";
import { learnLesson } from "../learn/helpers";

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
  resetLessonsForTesting();
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
  it("reads one child's attempts, sections, stickers and study days", async () => {
    const scope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
    const section = {
      ...scope,
      sectionId: "powers.section.one",
      lessonId: "powers",
      state: "done" as const,
      position: { phase: "practice" as const, index: 1 },
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
        activityDays: [],
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

    await act(() => markActivityDay(appDb(), scope, "2026-03-02"));
    await waitFor(() =>
      expect(result.current?.activityDays).toEqual(["2026-03-02"]),
    );
  });
});

describe("sound setting", () => {
  it("is on by default and kept per child once turned off", async () => {
    const { result } = renderHook(() => useSoundEnabled("kid-1"));
    await waitFor(() => expect(result.current).toBe(true));

    await act(() => setSoundEnabled("kid-1", false));
    await waitFor(() => expect(result.current).toBe(false));
    expect(await readSoundEnabled(appDb(), "kid-2")).toBe(true);

    await act(() => setSoundEnabled("kid-1", true));
    await waitFor(() => expect(result.current).toBe(true));
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

describe("lesson progress", () => {
  it("reads one child's sections, card states, sticker and review answers of a lesson", async () => {
    const scope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
    const at = new Date("2026-03-02T01:00:00Z");
    const db = appDb();
    await saveSectionPosition(
      db,
      scope,
      { lessonId: "powers", sectionId: "powers.section.one" },
      { phase: "check", index: 0 },
      at,
    );
    const answer = {
      ...scope,
      lessonId: "powers",
      exerciseId: "powers.ex.one",
      cardIds: ["powers.card.a"],
      firstTryCorrect: false,
      wrongCount: 1,
    };
    await recordAttempt(db, { ...answer, context: "practice" }, at);
    const review = await recordAttempt(
      db,
      { ...answer, context: "review" },
      at,
    );
    await recordAttempt(
      db,
      {
        ...answer,
        lessonId: "roots",
        cardIds: ["roots.card.a"],
        context: "review",
      },
      at,
    );
    await awardSticker(db, scope, "powers", at);

    const { result } = renderHook(() => useLessonProgress("kid-1", "powers"));
    await waitFor(() => expect(result.current).toBeDefined());
    expect(result.current?.sections.map((s) => s.sectionId)).toEqual([
      "powers.section.one",
    ]);
    expect(result.current?.cardStates.map((s) => s.cardId)).toEqual([
      "powers.card.a",
    ]);
    expect(result.current?.sticker?.lessonId).toBe("powers");
    expect(result.current?.reviewAttempts).toEqual([review]);
  });
});

describe("useLesson", () => {
  const lesson = learnLesson();

  it("fetches, validates and indexes a lesson once", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify(lesson), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const first = renderHook(() => useLesson(lesson.id));
    expect(first.result.current).toEqual({ status: "loading" });
    await waitFor(() => expect(first.result.current.status).toBe("ready"));
    const state = first.result.current;
    expect(state.status === "ready" && state.index.lesson.id).toBe(lesson.id);

    renderHook(() => useLesson(lesson.id));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(lessonContentUrl(lesson.id));
  });

  it("reports failures and retries on request", async () => {
    const fetchMock = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(new Response("{}", { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(lesson)));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useLesson(lesson.id));
    await waitFor(() => expect(result.current).toEqual({ status: "error" }));
    act(() => requestLesson(lesson.id));
    await waitFor(() => expect(result.current.status).toBe("ready"));
  });
});
