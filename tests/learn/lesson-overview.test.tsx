import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OVERVIEW_GOALS_LEAD } from "@/content/overview";
import { LessonOverviewView } from "@/learn/lesson-overview";
import { karaokeCueText } from "@/lib/karaoke-vtt";
import type { LessonOverview } from "@/schema/content";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const OVERVIEW: LessonOverview = {
  hook: { text: "Mẹ mua hai túi kẹo." },
  summary: "Bài này nói về phép nhân.",
  goals: ["biết phép nhân", "tính nhanh"],
  whyItMatters: "Phép nhân giúp bạn đếm nhanh.",
};

function renderOverview(overview = OVERVIEW, onStart = vi.fn()) {
  const view = render(
    <LessonOverviewView
      lesson={{ title: "Phép nhân", overview }}
      startLabel="Bắt đầu học"
      onStart={onStart}
    />,
  );
  return { ...view, onStart };
}

describe("LessonOverviewView", () => {
  it("shows the hook, summary, goals as a checklist and why it matters", () => {
    const { container } = renderOverview();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Phép nhân",
    );
    expect(
      container.querySelector('[data-overview-part="hook"]'),
    ).toHaveTextContent("Mẹ mua hai túi kẹo.");
    expect(
      container.querySelector('[data-overview-part="goals"] h2'),
    ).toHaveTextContent(OVERVIEW_GOALS_LEAD);
    expect(
      [...container.querySelectorAll("[data-overview-goal]")].map(
        (li) => li.textContent,
      ),
    ).toEqual(["biết phép nhân", "tính nhanh"]);
    expect(
      container.querySelector('[data-overview-part="why"]'),
    ).toHaveTextContent("Phép nhân giúp bạn đếm nhanh.");
  });

  it("starts the lesson from its one main button", () => {
    const { onStart } = renderOverview();
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu học" }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("offers nothing to listen to when it has no narration", () => {
    const { container } = renderOverview();
    expect(container.querySelector("[data-overview-narration]")).toBeNull();
    expect(container.querySelector("audio")).toBeNull();
  });

  it("plays the narration on request and lights up the word being said", async () => {
    const words = [
      "Mẹ mua hai túi kẹo.",
      "Bài này nói về phép nhân.",
      OVERVIEW_GOALS_LEAD,
      "biết phép nhân",
      "tính nhanh",
      "Phép nhân giúp bạn đếm nhanh.",
    ]
      .join(" ")
      .split(" ")
      .map((text, i) => ({ text, start: i }));
    const vtt = `WEBVTT\n\n1\n00:00:00.000 --> 00:01:00.000\n${karaokeCueText(words)}\n`;
    const fetchMock = vi.fn(async () => new Response(vtt));
    vi.stubGlobal("fetch", fetchMock);
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      });
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockReturnValue(true);

    const { container } = renderOverview({
      ...OVERVIEW,
      narration: {
        audioUrl: "narration/phep-nhan/overview.m4a",
        vttUrl: "narration/phep-nhan/overview.vtt",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/media/narration/phep-nhan/overview.vtt",
    );
    // Nothing plays or lights up on its own.
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("[data-word-reading]")).toBeNull();

    const audio = container.querySelector("audio") as HTMLAudioElement;
    vi.spyOn(audio, "currentTime", "get").mockReturnValue(6.5);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
    expect(play).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(container.querySelector("[data-word-reading]")).toHaveTextContent(
        "này",
      ),
    );
  });
});
