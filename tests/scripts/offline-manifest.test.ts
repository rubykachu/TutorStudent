// @vitest-environment node
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fileHash } from "@/offline/precache-node";
import {
  PRECACHE_LIST_FILE,
  type PrecacheListFile,
  writePrecacheList,
} from "../../scripts/lib/offline-manifest";

let root: string;

function put(rel: string, text = "x") {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text);
}

const sources = {
  pagePaths: ["/", "/lessons/a"],
  lessonIds: ["a"],
  tipLessonIds: ["a"],
  soundUrls: ["/sounds/tap.m4a?v=0123456789ab"],
};

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "offline-manifest-"));
  put("public/content/index.json", "{}");
  put("public/content/a.json", '{"id":"a"}');
  put("public/content/a.tips.json", '{"lessonId":"a"}');
  put("public/sounds/tap.m4a", "tap");
  put("public/brand/icon-192.png", "png");
  put("public/brand/share.png", "share");
  put("public/maps/world.json", "map");
  put("public/.DS_Store", "junk");
  put("public/media/video/a/v.mp4", "video");
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("writePrecacheList", () => {
  it("writes the list with hashes as revisions", () => {
    const { file } = writePrecacheList({
      rootDir: root,
      buildId: "B1",
      sources,
      mediaBaseUrl: "",
    });
    expect(file).toBe(path.join(root, PRECACHE_LIST_FILE));
    const written = JSON.parse(readFileSync(file, "utf8")) as PrecacheListFile;
    expect(written.buildId).toBe("B1");
    const byUrl = new Map(written.entries.map((e) => [e.url, e.revision]));
    expect(byUrl.get("/content/a.json")).toBe(
      fileHash(Buffer.from('{"id":"a"}')),
    );
    expect(byUrl.get("/maps/world.json")).toBe(fileHash(Buffer.from("map")));
    expect(byUrl.get("/lessons/a")).toBe("B1");
    expect(byUrl.get("/sounds/tap.m4a?v=0123456789ab")).toBeNull();
    expect(byUrl.has("/brand/share.png")).toBe(false);
    expect(byUrl.has("/media/video/a/v.mp4")).toBe(false);
    expect([...byUrl.keys()].some((u) => u.includes(".DS_Store"))).toBe(false);
  });

  it("fails with the lesson id when a served lesson has no emitted file", () => {
    expect(() =>
      writePrecacheList({
        rootDir: root,
        buildId: "B1",
        sources: { ...sources, lessonIds: ["a", "missing"] },
        mediaBaseUrl: "",
      }),
    ).toThrow("missing");
  });

  it("fails above the budget with the total", () => {
    put("public/maps/huge.bin", "x".repeat(60 * 1024 * 1024));
    expect(() =>
      writePrecacheList({
        rootDir: root,
        buildId: "B1",
        sources,
        mediaBaseUrl: "",
      }),
    ).toThrow(/over the budget/);
  });
});
