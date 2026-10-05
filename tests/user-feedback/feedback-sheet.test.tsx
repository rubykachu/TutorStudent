import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FEEDBACK_THANKS_CLOSE_MS } from "@/lib/config";
import { lessonFeedbackContext } from "@/user-feedback/context";
import { FeedbackButton } from "@/user-feedback/feedback-button";
import { FeedbackSheet } from "@/user-feedback/feedback-sheet";
import type { FeedbackRequest } from "@/user-feedback/schema";
import { learnLesson } from "../learn/helpers";

const { sendFeedback } = vi.hoisted(() => ({
  sendFeedback: vi.fn((_report: unknown) => Promise.resolve()),
}));
vi.mock("@/user-feedback/client", () => ({ sendFeedback }));

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/use-reduced-motion", () => ({
  usePrefersReducedMotion: () => reduced.value,
}));

const context = lessonFeedbackContext(learnLesson(), "lesson");

beforeEach(() => {
  sendFeedback.mockClear();
  reduced.value = false;
});
afterEach(() => vi.useRealTimers());

const chip = (label: RegExp) => screen.getByRole("button", { name: label });

describe("FeedbackSheet", () => {
  it("shows five chips in order and sends one tap as the child", async () => {
    const onSent = vi.fn();
    render(
      <FeedbackSheet
        context={context}
        sent={new Set()}
        onSent={onSent}
        onClose={() => {}}
      />,
    );
    expect(
      screen.getByRole("dialog", { name: "Góp ý về bài này" }),
    ).toBeTruthy();
    const labels = [...document.querySelectorAll("[data-feedback-reason]")].map(
      (b) => b.textContent,
    );
    expect(labels).toEqual([
      "Khó hiểu",
      "Sai nội dung hoặc đáp án",
      "Hình hoặc video bị lỗi",
      "Dài quá, chán",
      "Hay, mình thích",
    ]);
    await act(async () => fireEvent.click(chip(/Khó hiểu/)));
    const report = sendFeedback.mock.calls[0]?.[0] as FeedbackRequest;
    expect(report).toMatchObject({
      ...context,
      reason: "kho-hieu",
      source: "be",
    });
    expect(report).not.toHaveProperty("note");
    expect(report.id).toMatch(/^[0-9a-f]{32}$/);
    expect(onSent).toHaveBeenCalledWith("kho-hieu");
    expect(screen.getByRole("status").textContent).toBe(
      "Cảm ơn bạn! Cú đã ghi lại rồi.",
    );
    expect(document.activeElement?.textContent).toBe("Học tiếp");
  });

  it("thanks the child even when the device could not keep the report", async () => {
    render(
      <FeedbackSheet
        context={context}
        sent={new Set()}
        onSent={() => {}}
        onClose={() => {}}
        send={() => Promise.reject(new Error("db"))}
      />,
    );
    await act(async () => fireEvent.click(chip(/Dài quá/)));
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("closes the thank-you after 5 s, not under reduced motion", async () => {
    vi.useFakeTimers();
    for (const motionReduced of [false, true]) {
      reduced.value = motionReduced;
      const onClose = vi.fn();
      const { unmount } = render(
        <FeedbackSheet
          context={context}
          sent={new Set()}
          onSent={() => {}}
          onClose={onClose}
        />,
      );
      await act(async () => fireEvent.click(chip(/Hay, mình thích/)));
      act(() => vi.advanceTimersByTime(FEEDBACK_THANKS_CLOSE_MS - 1));
      expect(onClose).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(1));
      expect(onClose).toHaveBeenCalledTimes(motionReduced ? 0 : 1);
      unmount();
    }
  });
});

describe("FeedbackButton", () => {
  it("marks a sent reason for the same item and keeps it open for another", async () => {
    const other = {
      ...context,
      item: "learn.ex.luyen-a",
      screen: "exercise" as const,
    };
    const { rerender } = render(<FeedbackButton context={context} />);
    fireEvent.click(screen.getByRole("button", { name: "Góp ý về bài này" }));
    await act(async () => fireEvent.click(chip(/Khó hiểu/)));
    fireEvent.click(screen.getByRole("button", { name: "Học tiếp" }));
    fireEvent.click(screen.getByRole("button", { name: "Góp ý về bài này" }));
    expect((chip(/Khó hiểu/) as HTMLButtonElement).disabled).toBe(true);
    expect(chip(/Khó hiểu/).textContent).toContain("Đã gửi");
    expect((chip(/Dài quá/) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    rerender(<FeedbackButton context={other} />);
    fireEvent.click(screen.getByRole("button", { name: "Góp ý về bài này" }));
    expect((chip(/Khó hiểu/) as HTMLButtonElement).disabled).toBe(false);
  });

  it("pauses playing media when it opens and does not resume it", () => {
    const video = document.createElement("video");
    document.body.append(video);
    Object.defineProperty(video, "paused", {
      value: false,
      configurable: true,
    });
    const pause = vi.spyOn(video, "pause").mockImplementation(() => {});
    const play = vi
      .spyOn(video, "play")
      .mockImplementation(() => Promise.resolve());
    render(<FeedbackButton context={context} />);
    fireEvent.click(screen.getByRole("button", { name: "Góp ý về bài này" }));
    expect(pause).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(play).not.toHaveBeenCalled();
    video.remove();
  });
});
