import { afterEach, describe, expect, it, vi } from "vitest";

async function mediaUrl(path: string): Promise<string> {
  vi.resetModules();
  return (await import("@/lib/media")).mediaUrl(path);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("mediaUrl", () => {
  it("serves from public/media when no media base is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "");
    expect(await mediaUrl("video/luy-thua/gioi-thieu.mp4")).toBe(
      "/media/video/luy-thua/gioi-thieu.mp4",
    );
  });

  it("points every kind of file at the media bucket once it is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://pub-abc123.r2.dev");
    for (const path of [
      "video/luy-thua/gioi-thieu.mp4",
      "video/luy-thua/gioi-thieu.vtt",
      "video/luy-thua/gioi-thieu.jpg",
      "narration/luy-thua/overview.m4a",
    ]) {
      expect(await mediaUrl(path)).toBe(`https://pub-abc123.r2.dev/${path}`);
    }
  });

  it("does not double the slash when the base ends with one", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://media.example.com//");
    expect(await mediaUrl("video/a/b.mp4")).toBe(
      "https://media.example.com/video/a/b.mp4",
    );
  });
});
