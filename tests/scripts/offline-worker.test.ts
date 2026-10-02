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
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PRECACHE_BUDGET_BYTES } from "@/offline/precache";
import { PRECACHE_LIST_FILE } from "../../scripts/lib/offline-manifest";
import {
  buildWorker,
  pageBytes,
  readBuildFiles,
} from "../../scripts/lib/offline-worker";

let root: string;

function put(rel: string, text = "x") {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text);
}

function writeList(knownBytes = 10) {
  put(
    PRECACHE_LIST_FILE,
    JSON.stringify({
      buildId: "B1",
      knownBytes,
      entries: [
        { url: "/lessons/a", revision: "B1" },
        { url: "/content/a.json", revision: "h1" },
      ],
    }),
  );
}

beforeEach(() => {
  // The precaching worker is written only with offline support on.
  vi.stubEnv("NEXT_PUBLIC_OFFLINE_ENABLED", "1");
  vi.stubEnv("NEXT_PUBLIC_OFFLINE_KILL_SWITCH", "");
  root = mkdtempSync(path.join(os.tmpdir(), "offline-worker-"));
  put("tsconfig.json", "{}");
  put(".next/static/chunks/a.js", "aaaa");
  put(".next/static/css/b.css", "bb");
  put(".next/static/media/KaTeX.woff2", "w2");
  put(".next/static/media/KaTeX.woff", "w1");
  put(".next/static/media/KaTeX.ttf", "t");
  put(".next/static/chunks/a.js.map", "map");
  put(".next/static/.DS_Store", "junk");
  put(".next/server/app/lessons/a.html", "<html>12345</html>");
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true, force: true });
});

describe("readBuildFiles", () => {
  it("lists build files without revision, minus ttf, woff, maps and dotfiles", () => {
    const { entries, bytes } = readBuildFiles(path.join(root, ".next/static"));
    expect(entries.map((e) => e.url).sort()).toEqual([
      "/_next/static/chunks/a.js",
      "/_next/static/css/b.css",
      "/_next/static/media/KaTeX.woff2",
    ]);
    expect(entries.every((e) => e.revision === null)).toBe(true);
    expect(bytes).toBe(4 + 2 + 2);
  });
});

describe("pageBytes", () => {
  it("adds the size of the emitted html of the pages it finds", () => {
    expect(
      pageBytes(path.join(root, ".next"), ["/lessons/a", "/missing"]),
    ).toBe("<html>12345</html>".length);
  });
});

describe("buildWorker", () => {
  it("writes public/sw.js with the list and the build files injected", async () => {
    writeList();
    const result = await buildWorker({
      rootDir: root,
      distDir: ".next",
      mediaBaseUrl: "",
      source: path.join(process.cwd(), "src/offline/sw.ts"),
    });
    const script = readFileSync(path.join(root, "public/sw.js"), "utf8");
    expect(result.file).toBe(path.join(root, "public/sw.js"));
    expect(script).toContain("/_next/static/chunks/a.js");
    expect(script).toContain("/lessons/a");
    expect(script).toContain("offline-");
    // The server-only names must not be in a script every browser reads.
    // A worker has no `process`: evaluating one would fail.
    expect(script).not.toMatch(/process\.env/);
    expect(script).not.toContain("SESSION_SECRET");
    expect(script).not.toContain("FAMILY_CODES");
    expect(result.entries).toBe(2 + 3);
  });

  it("never holds the retiring code in a normal worker", async () => {
    writeList();
    await buildWorker({
      rootDir: root,
      distDir: ".next",
      source: path.join(process.cwd(), "src/offline/sw.ts"),
    });
    expect(readFileSync(path.join(root, "public/sw.js"), "utf8")).not.toContain(
      "unregister",
    );
  });

  it("writes the retiring worker, with no list, when the kill switch is on", async () => {
    // No list file and no build folder: the kill switch needs neither.
    const result = await buildWorker({
      rootDir: root,
      killSwitch: true,
      killSource: path.join(process.cwd(), "src/offline/sw-kill.ts"),
    });
    const script = readFileSync(path.join(root, "public/sw.js"), "utf8");
    expect(result.entries).toBe(0);
    expect(script).toContain("unregister");
    expect(script).toContain("skipWaiting");
    expect(script).not.toContain("/_next/static");
    expect(script).not.toMatch(/process\.env/);
  });

  it.each([
    ["offline support is off", { NEXT_PUBLIC_OFFLINE_ENABLED: "" }],
    ["the kill switch is on", { NEXT_PUBLIC_OFFLINE_KILL_SWITCH: "1" }],
  ])("writes the retiring worker by default when %s", async (_case, env) => {
    for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
    writeList();
    const result = await buildWorker({
      rootDir: root,
      distDir: ".next",
      source: path.join(process.cwd(), "src/offline/sw.ts"),
      killSource: path.join(process.cwd(), "src/offline/sw-kill.ts"),
    });
    const script = readFileSync(path.join(root, "public/sw.js"), "utf8");
    expect(result.entries).toBe(0);
    expect(script).toContain("unregister");
    expect(script).not.toContain("/_next/static");
    expect(script).not.toContain("/lessons/a");
  });

  it("fails when a module the worker imports reads process.env", async () => {
    put("bad.ts", "export const x = process.env.NEXT_PUBLIC_X;\nself.x = x;");
    await expect(
      buildWorker({
        rootDir: root,
        killSwitch: true,
        killSource: path.join(root, "bad.ts"),
      }),
    ).rejects.toThrow("process.env");
  });

  it("fails above the budget", async () => {
    writeList(PRECACHE_BUDGET_BYTES);
    await expect(
      buildWorker({
        rootDir: root,
        distDir: ".next",
        source: path.join(process.cwd(), "src/offline/sw.ts"),
      }),
    ).rejects.toThrow("over the budget");
  });

  it("asks for the manifest step when the list is missing", async () => {
    await expect(
      buildWorker({ rootDir: root, distDir: ".next" }),
    ).rejects.toThrow("offline-manifest");
  });
});
