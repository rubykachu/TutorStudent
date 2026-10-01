// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  contentTypeFor,
  listMediaLessons,
  md5,
  parseUploadArgs,
  runMediaUpload,
  selectLessonFiles,
} from "../../scripts/lib/media-upload";
import { R2_BUCKET } from "../../scripts/lib/release-config";
import type { Exec } from "../../scripts/lib/run";

let root: string;

function touch(rel: string, content = "x") {
  const file = path.join(root, "public/media", rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "media-upload-"));
  touch("video/a/one.mp4");
  touch("video/a/one.vtt");
  touch("video/a/one.jpg");
  touch("narration/a/overview.m4a");
  touch("narration/a/overview.vtt");
  touch("video/b/two.mp4");
  touch("narration/fixture/overview.m4a");
  touch("video/a/.DS_Store");
});

describe("parseUploadArgs", () => {
  it("takes lesson names and flags", () => {
    expect(parseUploadArgs(["a", "b", "--dry-run"])).toEqual({
      lessons: ["a", "b"],
      all: false,
      dryRun: true,
    });
    expect(parseUploadArgs(["--all"])).toEqual({
      lessons: [],
      all: true,
      dryRun: false,
    });
  });

  it("rejects no target, both targets and unknown flags", () => {
    expect(() => parseUploadArgs([])).toThrow(/at least one lesson/);
    expect(() => parseUploadArgs(["a", "--all"])).toThrow(/not both/);
    expect(() => parseUploadArgs(["a", "--force"])).toThrow();
  });
});

describe("contentTypeFor", () => {
  it("maps every media extension", () => {
    expect(contentTypeFor("x/a.mp4")).toBe("video/mp4");
    expect(contentTypeFor("x/a.vtt")).toBe("text/vtt");
    expect(contentTypeFor("x/a.jpg")).toBe("image/jpeg");
    expect(contentTypeFor("x/a.m4a")).toBe("audio/mp4");
    expect(contentTypeFor("x/A.MP4")).toBe("video/mp4");
  });

  it("refuses an unknown extension instead of guessing", () => {
    expect(() => contentTypeFor("x/a.wav")).toThrow(/No Content-Type/);
  });
});

describe("selecting files", () => {
  it("takes video and narration of that lesson only, keyed by media path", () => {
    const items = selectLessonFiles(root, "a");
    expect(items.map((i) => i.key)).toEqual([
      "video/a/one.jpg",
      "video/a/one.mp4",
      "video/a/one.vtt",
      "narration/a/overview.m4a",
      "narration/a/overview.vtt",
    ]);
    expect(items.find((i) => i.key.endsWith(".vtt"))?.contentType).toBe(
      "text/vtt",
    );
  });

  it("lists lessons without the fixture", () => {
    expect(listMediaLessons(root)).toEqual(["a", "b"]);
  });

  it("fails on a lesson without media or the fixture", () => {
    expect(() => selectLessonFiles(root, "missing")).toThrow(/No media/);
    expect(() => selectLessonFiles(root, "fixture")).toThrow(/never uploaded/);
  });
});

describe("runMediaUpload", () => {
  const ok = { status: 0, stdout: "", stderr: "" };
  let lines: string[];
  let exec: ReturnType<typeof vi.fn<Exec>>;
  const log = (line: string) => lines.push(line);

  beforeEach(() => {
    lines = [];
    exec = vi.fn<Exec>(() => ok);
  });

  it("dry run lists files and runs no command", async () => {
    const code = await runMediaUpload(["b", "--dry-run"], { root, exec, log });
    expect(code).toBe(0);
    expect(exec).not.toHaveBeenCalled();
    expect(lines.join("\n")).toContain(
      "would upload video/b/two.mp4 (video/mp4",
    );
    expect(lines.at(-1)).toContain("1 to upload, 0 already identical");
  });

  it("puts each file with its Content-Type to the one bucket", async () => {
    const code = await runMediaUpload(["b"], { root, exec, log });
    expect(code).toBe(0);
    expect(exec).toHaveBeenCalledTimes(1);
    const command = exec.mock.calls[0]?.[0] as string[];
    expect(command.slice(0, 7)).toEqual([
      "npx",
      "wrangler",
      "r2",
      "object",
      "put",
      `${R2_BUCKET}/video/b/two.mp4`,
      "--file",
    ]);
    expect(command).toContain("--remote");
    expect(command[command.indexOf("--content-type") + 1]).toBe("video/mp4");
  });

  it("skips files whose remote ETag equals the local MD5", async () => {
    const same = md5(path.join(root, "public/media/video/a/one.mp4"));
    const head = async (key: string) =>
      key === "video/a/one.mp4" ? { etag: same } : null;
    await runMediaUpload(["a"], { root, exec, head, log });
    const uploaded = exec.mock.calls.map(
      (call) => (call[0] as string[])[5] as string,
    );
    expect(uploaded).not.toContain(`${R2_BUCKET}/video/a/one.mp4`);
    expect(uploaded).toHaveLength(4);
    expect(lines).toContain("same    video/a/one.mp4");
  });

  it("--all covers every lesson but the fixture", async () => {
    await runMediaUpload(["--all"], { root, exec, log });
    expect(exec).toHaveBeenCalledTimes(6);
  });

  it("returns 1 when a put fails and 2 on bad arguments", async () => {
    exec.mockReturnValue({ status: 1, stdout: "", stderr: "denied" });
    expect(await runMediaUpload(["b"], { root, exec, log })).toBe(1);
    expect(lines.join("\n")).toContain("FAILED  video/b/two.mp4: denied");
    expect(await runMediaUpload([], { root, exec, log })).toBe(2);
    expect(await runMediaUpload(["nope"], { root, exec, log })).toBe(2);
  });
});
