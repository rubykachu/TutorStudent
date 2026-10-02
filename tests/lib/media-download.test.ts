import { describe, expect, it, vi } from "vitest";
import {
  bufferedFraction,
  clearPreloaded,
  downloadFraction,
  downloadMedia,
  percentLabel,
  storePreloaded,
  takePreloaded,
} from "@/lib/media-download";

function streamOf(chunks: number[], headers: Record<string, string>) {
  let i = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      const size = chunks[i++];
      if (size === undefined) controller.close();
      else controller.enqueue(new Uint8Array(size));
    },
  });
  return new Response(body, { headers });
}

describe("downloadFraction", () => {
  it("is the share received, clamped, and unknown without a total", () => {
    expect(downloadFraction({ receivedBytes: 45, totalBytes: 100 })).toBe(0.45);
    expect(downloadFraction({ receivedBytes: 150, totalBytes: 100 })).toBe(1);
    expect(downloadFraction({ receivedBytes: 10 })).toBeUndefined();
    expect(
      downloadFraction({ receivedBytes: 10, totalBytes: 0 }),
    ).toBeUndefined();
  });

  it("rounds to a whole percent for the child", () => {
    expect(percentLabel(0.456)).toBe(46);
  });
});

describe("bufferedFraction", () => {
  const ranges = (list: [number, number][]) => ({
    length: list.length,
    start: (i: number) => list[i]?.[0] ?? 0,
    end: (i: number) => list[i]?.[1] ?? 0,
  });

  it("is the end of the range holding the playhead over the duration", () => {
    expect(
      bufferedFraction({
        duration: 100,
        currentTime: 20,
        buffered: ranges([
          [0, 5],
          [18, 60],
        ]) as TimeRanges,
      }),
    ).toBe(0.6);
  });

  it("is unknown until the duration is", () => {
    expect(
      bufferedFraction({
        duration: Number.NaN,
        currentTime: 0,
        buffered: ranges([]) as TimeRanges,
      }),
    ).toBeUndefined();
  });
});

describe("downloadMedia", () => {
  it("reports bytes against Content-Length and returns the whole file", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        streamOf([30, 70], {
          "Content-Length": "100",
          "Content-Type": "video/mp4",
        }),
      ),
    );
    const seen: number[] = [];
    const result = await downloadMedia("/x.mp4", {
      onProgress: (p) => seen.push(p.receivedBytes),
    });
    expect(seen).toEqual([0, 30, 100]);
    expect(result.kind).toBe("blob");
    if (result.kind === "blob") {
      expect(result.blob.size).toBe(100);
      expect(result.blob.type).toBe("video/mp4");
    }
    vi.unstubAllGlobals();
  });

  it("hands the file back to the element when the length is unknown", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => streamOf([10], {})),
    );
    expect(await downloadMedia("/x.mp4", {})).toEqual({ kind: "direct" });
    vi.unstubAllGlobals();
  });

  it("fails on an HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("no", { status: 404 })),
    );
    await expect(downloadMedia("/x.mp4", {})).rejects.toThrow("HTTP 404");
    vi.unstubAllGlobals();
  });
});

describe("the preloaded slot", () => {
  it("holds one file, gives it once, and only to its own address", () => {
    clearPreloaded();
    storePreloaded("/a", new Blob(["a"]));
    storePreloaded("/b", new Blob(["b"]));
    expect(takePreloaded("/a")).toBeUndefined();
    expect(takePreloaded("/b")?.size).toBe(1);
    expect(takePreloaded("/b")).toBeUndefined();
  });
});
