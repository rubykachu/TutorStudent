import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BACKGROUND_MUSIC_IDS,
  CELEBRATION_IDS,
  soundUrl,
} from "@/lib/sound-manifest";
import {
  buildPrecacheEntries,
  checkBudget,
  isDenied,
  keepBuildFile,
  PRECACHE_BUDGET_BYTES,
  type PrecacheInput,
  STORED_MUSIC_BUDGET_BYTES,
} from "@/offline/precache";
import { appSources } from "@/offline/precache-node";

const BUILD = "20261002000000";

function input(overrides: Partial<PrecacheInput> = {}): PrecacheInput {
  return {
    pagePaths: ["/", "/lessons/a", "/lessons/a/review", "/lessons/a/tips"],
    lessons: [
      { id: "a", contentHash: "aaaaaaaaaaaa", tips: { hash: "tttttttttttt" } },
      { id: "b", contentHash: "bbbbbbbbbbbb", tips: null },
    ],
    contentIndex: { hash: "iiiiiiiiiiii", bytes: 100 },
    soundUrls: ["/sounds/tap.m4a?v=0123456789ab"],
    soundBytes: 50,
    publicFiles: [
      { path: "brand/icon-192.png", hash: "111111111111", bytes: 10 },
      { path: "maps/world.topo.json", hash: "222222222222", bytes: 20 },
      { path: "brand/share.png", hash: "333333333333", bytes: 30 },
      { path: ".DS_Store", hash: "444444444444", bytes: 1 },
      { path: "brand/.DS_Store", hash: "444444444444", bytes: 1 },
      { path: "media/video/a/v.mp4", hash: "555555555555", bytes: 9_000 },
      { path: "sounds/tap.m4a", hash: "666666666666", bytes: 9 },
      { path: "sounds/song.m4a", hash: "777777777777", bytes: 9 },
      { path: "content/stale-draft.json", hash: "888888888888", bytes: 9 },
    ],
    fileRoutes: ["/manifest.webmanifest", "/favicon.ico"],
    buildId: BUILD,
    mediaBaseUrl: "https://media.example.com",
    ...overrides,
  };
}

function urls(i: PrecacheInput = input()): string[] {
  return buildPrecacheEntries(i).entries.map((e) => e.url);
}

describe("buildPrecacheEntries", () => {
  it("holds every served lesson and its tips file when it has one", () => {
    const list = urls();
    expect(list).toContain("/content/a.json");
    expect(list).toContain("/content/a.tips.json");
    expect(list).toContain("/content/b.json");
    expect(list).not.toContain("/content/b.tips.json");
    expect(list).toContain("/content/index.json");
  });

  it("holds every page and its flight with the build id as revision", () => {
    const { entries } = buildPrecacheEntries(input());
    for (const page of input().pagePaths) {
      expect(entries.find((e) => e.url === page)?.revision).toBe(BUILD);
      expect(entries.find((e) => e.url === `${page}?_rsc`)?.revision).toBe(
        BUILD,
      );
    }
  });

  it("holds every sound url with no revision", () => {
    const { entries } = buildPrecacheEntries(input());
    expect(
      entries.find((e) => e.url === "/sounds/tap.m4a?v=0123456789ab"),
    ).toEqual({ url: "/sounds/tap.m4a?v=0123456789ab", revision: null });
  });

  it("holds public files by the generic rule, with their hash as revision", () => {
    const { entries } = buildPrecacheEntries(input());
    expect(entries.find((e) => e.url === "/maps/world.topo.json")).toEqual({
      url: "/maps/world.topo.json",
      revision: "222222222222",
    });
    expect(entries.find((e) => e.url === "/brand/icon-192.png")?.revision).toBe(
      "111111111111",
    );
  });

  it("holds the manifest and the favicon", () => {
    const list = urls();
    expect(list).toContain("/manifest.webmanifest");
    expect(list).toContain("/favicon.ico");
  });

  it("leaves out the share image, dotfiles, media, songs and stale content", () => {
    const list = urls();
    expect(list).not.toContain("/brand/share.png");
    expect(list.filter((u) => u.includes(".DS_Store"))).toEqual([]);
    expect(list.filter((u) => u.startsWith("/media/"))).toEqual([]);
    expect(list).not.toContain("/sounds/song.m4a");
    expect(list).not.toContain("/sounds/tap.m4a");
    expect(list).not.toContain("/content/stale-draft.json");
  });

  it("never holds /api, /media, /unlock or /dev", () => {
    for (const url of urls()) {
      for (const prefix of ["/api/", "/media/", "/unlock", "/dev/"]) {
        expect(url.startsWith(prefix)).toBe(false);
      }
    }
  });

  it.each(["/api/sync", "/unlock", "/dev/visuals", "/media/x.mp4"])(
    "fails when a page path is %s",
    (bad) => {
      expect(() => buildPrecacheEntries(input({ pagePaths: [bad] }))).toThrow(
        bad,
      );
    },
  );

  it("fails when an entry points at the media base URL", () => {
    expect(() =>
      buildPrecacheEntries(
        input({
          mediaBaseUrl: "/bucket",
          publicFiles: [{ path: "bucket/x.png", hash: "1", bytes: 1 }],
        }),
      ),
    ).toThrow("media base URL");
  });

  it("fails with the lesson id when an emitted file is missing", () => {
    expect(() =>
      buildPrecacheEntries(
        input({ lessons: [{ id: "gone", contentHash: null, tips: null }] }),
      ),
    ).toThrow("gone");
    expect(() =>
      buildPrecacheEntries(
        input({
          lessons: [{ id: "notips", contentHash: "x", tips: { hash: null } }],
        }),
      ),
    ).toThrow("notips");
  });

  it("fails when the content index is missing or a url appears twice", () => {
    expect(() => buildPrecacheEntries(input({ contentIndex: null }))).toThrow(
      "index.json",
    );
    expect(() =>
      buildPrecacheEntries(input({ pagePaths: ["/", "/"] })),
    ).toThrow("twice");
  });

  it("counts the bytes it knows", () => {
    // index 100 + sounds 50 + icon 10 + map 20 (share, media, dotfiles denied)
    expect(buildPrecacheEntries(input()).knownBytes).toBe(180);
  });
});

describe("PRECACHE_DENY", () => {
  it("denies folders and files by prefix or exact path", () => {
    expect(isDenied("media/video/a.mp4")).toBe(true);
    expect(isDenied("sounds/tap.m4a")).toBe(true);
    expect(isDenied("content/index.json")).toBe(true);
    expect(isDenied("brand/share.png")).toBe(true);
    expect(isDenied("brand/icon-192.png")).toBe(false);
    expect(isDenied("media-kit.png")).toBe(false);
  });
});

describe("keepBuildFile", () => {
  it("drops ttf and woff and keeps woff2, js and css", () => {
    expect(keepBuildFile("/_next/static/media/KaTeX_Main.ttf")).toBe(false);
    expect(keepBuildFile("/_next/static/media/KaTeX_Main.woff")).toBe(false);
    expect(keepBuildFile("/_next/static/media/KaTeX_Main.woff2")).toBe(true);
    expect(keepBuildFile("/_next/static/chunks/a.js")).toBe(true);
    expect(keepBuildFile("/_next/static/chunks/a.css?dpl=1")).toBe(true);
  });
});

describe("checkBudget", () => {
  it("passes at the budget and fails above it with the total", () => {
    expect(() => checkBudget(PRECACHE_BUDGET_BYTES)).not.toThrow();
    expect(() => checkBudget(PRECACHE_BUDGET_BYTES + 1)).toThrow(
      String(PRECACHE_BUDGET_BYTES + 1),
    );
  });
});

describe("the stored music", () => {
  const bytesOf = (url: string) =>
    statSync(path.join(process.cwd(), "public", url.split("?")[0] ?? "")).size;
  const urls = [...BACKGROUND_MUSIC_IDS, ...CELEBRATION_IDS].map(
    (id) => soundUrl(id) ?? "",
  );

  it("stores the background music and celebrations, so music plays offline", () => {
    const stored = appSources().soundUrls;
    for (const url of urls) expect(stored, url).toContain(url);
  });

  it("keeps the background music and celebrations under their budget", () => {
    const total = urls.reduce((sum, url) => sum + bytesOf(url), 0);
    expect(total).toBeLessThan(STORED_MUSIC_BUDGET_BYTES);
  });
});

describe("the pure module", () => {
  it("imports nothing from node:*", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/offline/precache.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/from\s+["']node:/);
    expect(source).not.toMatch(/require\(["']node:/);
  });
});
