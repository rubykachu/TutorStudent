import { describe, expect, it, vi } from "vitest";
import { holdsSilentClip, playFromTap } from "@/lib/play-from-tap";

function audioElement() {
  const element = document.createElement("audio");
  element.play = vi.fn(() => Promise.resolve());
  element.pause = vi.fn();
  return element;
}

describe("playFromTap", () => {
  it("plays a ready element right away and reports a refusal", async () => {
    const element = audioElement();
    element.src = "blob:ready";
    element.play = vi.fn(() => Promise.reject(new Error("no")));
    const refused = vi.fn();
    playFromTap(element, true, refused);
    expect(element.play).toHaveBeenCalledOnce();
    await Promise.resolve();
    await Promise.resolve();
    expect(refused).toHaveBeenCalledOnce();
  });

  it("unlocks an element without a file by starting and stopping a silent clip", () => {
    const element = audioElement();
    const refused = vi.fn();
    playFromTap(element, false, refused);
    expect(holdsSilentClip(element)).toBe(true);
    expect(element.play).toHaveBeenCalledOnce();
    expect(element.pause).toHaveBeenCalledOnce();
    expect(refused).not.toHaveBeenCalled();
  });

  it("serves a well-formed 8-bit mono WAV that is all silence", () => {
    const element = audioElement();
    playFromTap(element, false, vi.fn());
    const uri = element.getAttribute("src") ?? "";
    const bytes = Uint8Array.from(atob(uri.split(",")[1] ?? ""), (c) =>
      c.charCodeAt(0),
    );
    const text = (from: number, to: number) =>
      String.fromCharCode(...bytes.slice(from, to));
    expect(text(0, 4)).toBe("RIFF");
    expect(text(8, 16)).toBe("WAVEfmt ");
    expect(text(36, 40)).toBe("data");
    const view = new DataView(bytes.buffer);
    expect(view.getUint32(4, true)).toBe(bytes.length - 8);
    expect(view.getUint32(40, true)).toBe(bytes.length - 44);
    expect(bytes.slice(44).every((b) => b === 0x80)).toBe(true);
  });

  it("never replaces a real file with the silent clip", () => {
    const element = audioElement();
    element.src = "blob:real";
    playFromTap(element, false, vi.fn());
    expect(element.getAttribute("src")).toBe("blob:real");
    expect(element.play).not.toHaveBeenCalled();
  });
});
