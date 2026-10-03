import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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

// The silent clip the tap unlocks the audio element with.
const SILENT_CLIP = /^data:audio\/wav/;

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
    // The owl beside the heading keeps gently moving.
    expect(container.querySelector("header [data-mascot-loop]")).not.toBeNull();
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
          // A server error: a network error says "Cần mạng" (see
          // `tests/components/media-offline.test.tsx`), not "Thử lại".
          return new Response("no", { status: 500 });
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

    it("fetches the audio as the screen opens and shows the real percentage in the player, before any tap", async () => {
      const download = stubNarrationFetch(400);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      expect(
        download.fetchMock.mock.calls.map((call) => call[0]).sort(),
      ).toEqual([
        "/media/narration/phep-nhan/overview.m4a",
        "/media/narration/phep-nhan/overview.vtt",
      ]);

      await download.push(100);
      expect(
        container.querySelector("[data-narration-label]"),
      ).toHaveTextContent("Đang tải… 25%");
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "25",
      );
      // Nobody tapped: the button still invites, nothing plays, no slim player.
      expect(
        screen.getByRole("button", { name: "Nghe giới thiệu" }),
      ).toBeInTheDocument();
      expect(container.querySelector("[data-narration-mini]")).toBeNull();
      expect(audio.hasAttribute("src")).toBe(false);

      await download.push(300);
      await download.finish();
      await waitFor(() =>
        expect(audio.getAttribute("src")).toBe("blob:narration"),
      );
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "paused");
    });

    it("keeps the percentage after a tap during the download and plays when it ends", async () => {
      const download = stubNarrationFetch(400);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      await download.push(100);
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      // The tap unlocked the element with the silent clip, nothing is playing.
      expect(audio.getAttribute("src")).toMatch(SILENT_CLIP);
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "paused");
      expect(
        screen.getByRole("button", { name: "Dừng tải" }),
      ).toBeInTheDocument();
      expect(
        container.querySelector("[data-narration-label]"),
      ).toHaveTextContent("Đang tải… 25%");

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
      expect(container.querySelector("audio")).toBe(audio);
    });

    it("plays inside the tap, on the same element, when the download is already done", async () => {
      const download = stubNarrationFetch(400);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      await download.push(400);
      await download.finish();
      await waitFor(() =>
        expect(audio.getAttribute("src")).toBe("blob:narration"),
      );
      const play = vi.mocked(HTMLMediaElement.prototype.play);
      play.mockClear();
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      // Called by the time the click returned, once, on the one element.
      expect(play).toHaveBeenCalledOnce();
      expect(play.mock.contexts[0]).toBe(audio);
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "playing");
    });

    it("brings the play button back, with no error, when play is refused after the download; the next tap plays at once", async () => {
      const download = stubNarrationFetch(400);
      const { container } = renderOverview(NARRATED);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      // The unlock inside the tap is allowed; the later play is not (the
      // gesture was lost).
      let afterAwait = false;
      const play = vi
        .mocked(HTMLMediaElement.prototype.play)
        .mockImplementation(async function (this: HTMLMediaElement) {
          if (afterAwait) {
            throw new DOMException("not allowed", "NotAllowedError");
          }
          this.dispatchEvent(new Event("play"));
        });
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      afterAwait = true;
      await download.push(400);
      await download.finish();
      await waitFor(() =>
        expect(audio.getAttribute("src")).toBe("blob:narration"),
      );
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Nghe giới thiệu" }),
        ).toBeInTheDocument(),
      );
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "paused");

      afterAwait = false;
      const fetches = download.fetchMock.mock.calls.length;
      const before = play.mock.calls.length;
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      expect(play.mock.calls.length).toBe(before + 1);
      expect(download.fetchMock.mock.calls.length).toBe(fetches);
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "playing");
    });

    it("stops the download and frees the audio when the screen is left", async () => {
      const download = stubNarrationFetch(400);
      const { unmount } = renderOverview(NARRATED);
      await download.push(400);
      await download.finish();
      await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledOnce());
      unmount();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:narration");
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

    it("stays quiet when the prefetch fails, and the tap tries again", async () => {
      const download = stubNarrationFetch(10, true);
      const { container } = renderOverview(NARRATED);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      // Nobody asked yet: no error card, the button still invites.
      expect(screen.queryByRole("alert")).toBeNull();
      expect(
        screen.getByRole("button", { name: "Nghe giới thiệu" }),
      ).toBeInTheDocument();
      const audioFetches = () =>
        download.fetchMock.mock.calls.filter((call) =>
          String(call[0]).endsWith(".m4a"),
        ).length;
      expect(audioFetches()).toBe(1);

      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      expect(audioFetches()).toBe(2);
      await download.push(10);
      await download.finish();
      await waitFor(() =>
        expect(
          container.querySelector("[data-overview-narration]"),
        ).toHaveAttribute("data-overview-narration", "playing"),
      );
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

  describe("keeping the narration reachable", () => {
    const NARRATED: LessonOverview = {
      ...OVERVIEW,
      narration: {
        audioUrl: "narration/phep-nhan/overview.m4a",
        vttUrl: "narration/phep-nhan/overview.vtt",
      },
    };
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

    // The player card reports how much of it is on screen.
    let reportRatio: (ratio: number) => void = () => undefined;

    beforeEach(() => {
      // No Content-Length: the element streams the audio itself.
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => new Response(vtt)),
      );
      Element.prototype.scrollIntoView = vi.fn();
      vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
        this: HTMLMediaElement,
      ) {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      });
      vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
        function (this: HTMLMediaElement) {
          this.dispatchEvent(new Event("pause"));
        },
      );
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(
            private readonly callback: (
              entries: Partial<IntersectionObserverEntry>[],
            ) => void,
          ) {
            reportRatio = (ratio) =>
              act(() => this.callback([{ intersectionRatio: ratio }]));
          }
          observe() {}
          disconnect() {}
        },
      );
    });

    async function startNarration() {
      const view = renderOverview(NARRATED);
      const audio = view.container.querySelector("audio") as HTMLAudioElement;
      vi.spyOn(audio, "currentTime", "get").mockReturnValue(6.5);
      await act(async () => {
        await Promise.resolve();
      });
      fireEvent.click(screen.getByRole("button", { name: "Nghe giới thiệu" }));
      await waitFor(() =>
        expect(
          view.container.querySelector("[data-overview-narration]"),
        ).toHaveAttribute("data-overview-narration", "playing"),
      );
      return view;
    }

    it("shows a slim player only once the card has scrolled away, and its close button pauses", async () => {
      const { container } = await startNarration();
      expect(container.querySelector("[data-narration-mini]")).toBeNull();

      reportRatio(0);
      const mini = container.querySelector(
        "[data-narration-mini]",
      ) as HTMLElement;
      expect(mini).not.toBeNull();
      expect(
        document.documentElement.style.getPropertyValue(
          "--narration-mini-height",
        ),
      ).toMatch(/px$/);

      // Pause and play stay reachable from it.
      fireEvent.click(within(mini).getByRole("button", { name: "Tạm dừng" }));
      await waitFor(() =>
        expect(
          within(mini).getByRole("button", { name: "Nghe tiếp" }),
        ).toBeInTheDocument(),
      );
      fireEvent.click(within(mini).getByRole("button", { name: "Nghe tiếp" }));
      await waitFor(() =>
        expect(
          within(mini).getByRole("button", { name: "Tạm dừng" }),
        ).toBeInTheDocument(),
      );

      fireEvent.click(
        within(mini).getByRole("button", { name: "Đóng trình nghe" }),
      );
      expect(container.querySelector("[data-narration-mini]")).toBeNull();
      expect(
        container.querySelector("[data-overview-narration]"),
      ).toHaveAttribute("data-overview-narration", "paused");
      expect(
        document.documentElement.style.getPropertyValue(
          "--narration-mini-height",
        ),
      ).toBe("");

      // Scrolling back to the card or playing again leaves it as it was.
      reportRatio(1);
      expect(container.querySelector("[data-narration-mini]")).toBeNull();
    });

    it("stops scrolling after the child touches the page and offers 'Theo dõi lời đọc'", async () => {
      const { container } = await startNarration();
      const scroll = Element.prototype.scrollIntoView as ReturnType<
        typeof vi.fn
      >;
      await waitFor(() => expect(scroll).toHaveBeenCalled());

      fireEvent.wheel(window);
      scroll.mockClear();
      // The word the narration is on moves out of sight.
      const word = container.querySelector(
        "[data-word-reading]",
      ) as HTMLElement;
      vi.spyOn(word, "getBoundingClientRect").mockReturnValue({
        top: 9000,
        bottom: 9030,
      } as DOMRect);
      fireEvent.scroll(window);
      const follow = await screen.findByRole("button", {
        name: "Theo dõi lời đọc",
      });
      expect(scroll).not.toHaveBeenCalled();

      fireEvent.click(follow);
      expect(scroll).toHaveBeenCalled();
      await waitFor(() =>
        expect(
          screen.queryByRole("button", { name: "Theo dõi lời đọc" }),
        ).toBeNull(),
      );
    });
  });
});
