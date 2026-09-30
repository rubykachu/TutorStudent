import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { PassageReader } from "@/components/passage-reader";
import { stopReading } from "@/lib/speech";
import type { PassageBlock } from "@/schema/content";
import { fakeVoice, installSpeech } from "../lib/speech-mock";

afterEach(() => {
  stopReading();
  vi.unstubAllGlobals();
});

const NOTE = {
  type: "note",
  text: "Cáo muốn kết bạn. Hoàng tử bé nhận lời.",
} as const;

describe("read-aloud button", () => {
  it("is hidden when the device has no Vietnamese voice", () => {
    installSpeech([fakeVoice("Samantha", "en-US")]);
    render(<BlockView block={NOTE} />);
    expect(screen.queryByRole("button", { name: "Nghe đọc" })).toBeNull();
  });

  it("is hidden without the Web Speech API", () => {
    render(<BlockView block={NOTE} />);
    expect(screen.queryByRole("button", { name: "Nghe đọc" })).toBeNull();
  });

  it("reads a note sentence by sentence, lighting up each one", () => {
    const speech = installSpeech([fakeVoice("Linh", "vi-VN")]);
    const { container } = render(<BlockView block={NOTE} />);
    fireEvent.click(screen.getByRole("button", { name: "Nghe đọc" }));
    expect(speech.spoken.map((u) => u.text)).toEqual([
      "Cáo muốn kết bạn.",
      "Hoàng tử bé nhận lời.",
    ]);
    act(() => speech.startNext());
    expect(container.querySelector("[data-reading]")).toHaveTextContent(
      "Cáo muốn kết bạn.",
    );
    expect(screen.getByRole("button", { name: "Dừng đọc" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Dừng đọc" }));
    expect(container.querySelector("[data-reading]")).toBeNull();
    expect(speech.synth.cancel).toHaveBeenCalled();
  });

  it("offers reading on a group's note too", () => {
    installSpeech([fakeVoice("Linh", "vi-VN")]);
    render(
      <BlockView
        block={{
          type: "group",
          children: [NOTE, { type: "formula", tex: "2" }],
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Nghe đọc" })).toBeVisible();
  });

  it("stops reading when the text leaves the screen", () => {
    const speech = installSpeech([fakeVoice("Linh", "vi-VN")]);
    const { unmount } = render(<BlockView block={NOTE} />);
    fireEvent.click(screen.getByRole("button", { name: "Nghe đọc" }));
    act(() => speech.startNext());
    speech.synth.cancel.mockClear();
    unmount();
    expect(speech.synth.cancel).toHaveBeenCalled();
  });
});

describe("passage read-aloud", () => {
  const PASSAGE: PassageBlock = {
    type: "passage",
    paragraphs: [
      { sentences: [{ id: "a", text: "Câu một." }] },
      { sentences: [{ id: "b", text: "Câu hai." }] },
    ],
    annotations: [],
  };

  it("reads the passage across paragraphs and marks the sentence read", () => {
    const speech = installSpeech([fakeVoice("Linh", "vi-VN")]);
    const { container } = render(<PassageReader passage={PASSAGE} />);
    fireEvent.click(screen.getByRole("button", { name: "Nghe đọc" }));
    act(() => {
      speech.startNext();
      speech.endCurrent();
      speech.startNext();
    });
    expect(container.querySelector('[data-sentence-id="b"]')).toHaveAttribute(
      "data-reading",
    );
  });

  it("is not offered while the passage is a tap exercise", () => {
    installSpeech([fakeVoice("Linh", "vi-VN")]);
    render(
      <PassageReader
        passage={PASSAGE}
        selectable
        selected={[]}
        onToggle={() => undefined}
      />,
    );
    expect(screen.queryByRole("button", { name: "Nghe đọc" })).toBeNull();
  });
});
