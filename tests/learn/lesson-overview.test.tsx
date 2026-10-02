import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
    await waitFor(() => expect(play).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(container.querySelector("[data-word-reading]")).toHaveTextContent(
        "này",
      ),
    );
  });

  describe("loading the narration", () => {
    const NARRATED: LessonOverview = {
      ...OVERVIEW,
      narration: {
        audioUrl: "narration/phep-nhan/overview.m4a",
        vttUrl: "narration/phep-nhan/overview.vtt",
      },
    };

    // The audio file as a download the test feeds chunk by chunk; the
    // captions answer at once.
    function stubNarrationFetch(total: number | null, failFirst = false) {
      let controller!: ReadableStreamDefaultController<Uint8Array>;
      let failed = !failFirst;
      const fetchMock = vi.fn(async (url: string) => {
        if (url.endsWith(".vtt")) return new Response("WEBVTT\n");
        if (!failed) {
          failed = true;
          throw new TypeError("network");
        }
        const headers: Record<string, string> = {};
        if (total !== null) headers["Content-Length"] = String(total);
        return new Response(
          new ReadableStream<Uint8Array>({
            start(c) {
              controller = c;
            },
          }),
          { headers },
        );
      });
      vi.stubGlobal("fetch", fetchMock);
      const settle = () =>
        act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
      return {
        fetchMock,
        push: async (bytes: number) => {
          controller.enqueue(new Uint8Array(bytes));
          await settle();
        },
        finish: async () => {
          controller.close();
          await settle();
        },
      };
    }

    beforeEach(() => {
      URL.createObjectURL = vi.fn(() => "blob:narration");
      URL.revokeObjectURL = vi.fn();
      vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
        this: HTMLMediaElement,
      ) {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      });
    });

    it("fetches nothing until the tap, then shows the real percentage and plays from memory", async () => {
      const download = stubNarrationFetch(400);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      expect(audio.hasAttribute("src")).toBe(false);
      expect(download.fetchMock.mock.calls.map((call) => call[0])).toEqual([
        "/media/narration/phep-nhan/overview.vtt",
      ]);

      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      await download.push(100);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "25",
      );
      expect(
        container.querySelector("[data-narration-label]"),
      ).toHaveTextContent("Đang tải… 25%");
      expect(
        screen.getByRole("button", { name: "Dừng tải" }),
      ).toBeInTheDocument();
      expect(audio.hasAttribute("src")).toBe(false);

      await download.push(300);
      await download.finish();
      await waitFor(() =>
        expect(audio.getAttribute("src")).toBe("blob:narration"),
      );
      await waitFor(() =>
        expect(
          container.querySelector("[data-overview-narration]"),
        ).toHaveAttribute("data-overview-narration", "playing"),
      );
      expect(screen.queryByRole("progressbar")).toBeNull();
    });

    it("shows the buffered share when the file's length is unknown and the audio stalls", async () => {
      const download = stubNarrationFetch(null);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      await waitFor(() =>
        expect(audio.getAttribute("src")).toBe(
          "/media/narration/phep-nhan/overview.m4a",
        ),
      );
      expect(download.fetchMock).toHaveBeenCalledTimes(2);
      Object.defineProperty(audio, "duration", {
        value: 20,
        configurable: true,
      });
      Object.defineProperty(audio, "buffered", {
        value: { length: 1, start: () => 0, end: () => 5 },
        configurable: true,
      });
      fireEvent.waiting(audio);
      expect(
        container.querySelector("[data-narration-label]"),
      ).toHaveTextContent("Đang tải… 25%");
      fireEvent.playing(audio);
      expect(screen.queryByRole("progressbar")).toBeNull();
    });

    it("offers 'Thử lại' when the download fails", async () => {
      const download = stubNarrationFetch(10, true);
      renderOverview(NARRATED);
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Bạn thử lại nhé",
      );
      fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
      await download.push(10);
      await download.finish();
      await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    });
  });
});
