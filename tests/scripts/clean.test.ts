// @vitest-environment node
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clean } from "../../scripts/lib/clean";

let root: string;

function touch(rel: string, content = "x") {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function exists(rel: string) {
  return existsSync(path.join(root, rel));
}

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "clean-"));
  touch(".shots/walk/a.png");
  touch(".shots/dev.log");
  touch("coverage/index.html");
  touch("video/projects/l/v/renders/site/index.html");
  touch("video/projects/l/v/audio/s.wav");
  touch("video/projects/l/v/script.json");
  touch("video/.cache/narration/l/audio/s.wav");
  touch("content/subjects.json");
  touch(".next/BUILD_ID");
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("clean", () => {
  it("removes regenerable output and keeps authored files and caches", () => {
    clean({ root, deep: false });
    expect(exists(".shots")).toBe(true);
    expect(exists(".shots/walk")).toBe(false);
    expect(exists(".shots/dev.log")).toBe(false);
    expect(exists("coverage")).toBe(false);
    expect(exists("video/projects/l/v/renders")).toBe(false);
    expect(exists("video/projects/l/v/audio/s.wav")).toBe(true);
    expect(exists("video/projects/l/v/script.json")).toBe(true);
    expect(exists("video/.cache/narration/l/audio/s.wav")).toBe(true);
    expect(exists("content/subjects.json")).toBe(true);
    expect(exists(".next")).toBe(true);
  });

  it("removes .next only with deep", () => {
    clean({ root, deep: true });
    expect(exists(".next")).toBe(false);
  });

  it("keeps .next and logs while a dev server of this tree runs", () => {
    touch(".next/dev/lock", JSON.stringify({ pid: process.pid, port: 3001 }));
    const result = clean({ root, deep: true });
    expect(exists(".next/BUILD_ID")).toBe(true);
    expect(exists(".shots/dev.log")).toBe(true);
    expect(exists(".shots/walk")).toBe(false);
    expect(result.skipped.map((s) => s.path)).toEqual([
      ".shots/dev.log",
      ".next",
    ]);
  });

  it("ignores a stale lock", () => {
    touch(".next/dev/lock", JSON.stringify({ pid: 2 ** 22 + 1, port: 3001 }));
    clean({ root, deep: true });
    expect(exists(".next")).toBe(false);
  });
});
