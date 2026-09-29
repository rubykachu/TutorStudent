// @vitest-environment node
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONTENT_ROOT } from "./helpers";

// Runs the real scripts through tsx against a throwaway content root.
function run(script: string, ...args: string[]) {
  const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");
  const result = spawnSync(tsx, [path.join("scripts", script), ...args], {
    encoding: "utf8",
  });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

let root: string;
const realLessonFile = () =>
  path.join(root, "math", "kntt", "fixture", "lesson.json");
const lockFile = () => path.join(root, "ids.lock.json");

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "tutor-cli-"));
  cpSync(CONTENT_ROOT, root, { recursive: true });
  // The fixture copied outside _fixture/ acts as a real lesson for ids.lock.
  cpSync(path.join(root, "_fixture", "math"), path.join(root, "math"), {
    recursive: true,
  });
  rmSync(path.join(root, "_fixture"), { recursive: true });
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("content-check", () => {
  it("passes a valid root and prints stats", () => {
    const { code, out } = run("content-check.ts", "--root", root, "--stats");
    expect(code).toBe(0);
    expect(out).toContain("fixture (");
    expect(out).toContain(
      "2 sections, 3 cards, 12 exercises, 8 exercise types, 2 interactive visuals",
    );
  });

  it("exits non-zero and prints file and JSON path for each error", () => {
    const lesson = JSON.parse(readFileSync(realLessonFile(), "utf8"));
    lesson.cards[0].conceptIds = ["fixture.concept.khong-co"];
    writeFileSync(realLessonFile(), JSON.stringify(lesson));
    const { code, err } = run("content-check.ts", "--root", root);
    expect(code).toBe(1);
    expect(err).toMatch(
      /^error .*math\/kntt\/fixture\/lesson\.json \$\.cards\[0\]\.conceptIds\[0\]: Unknown concept/m,
    );
  });
});

describe("content-lock", () => {
  it("adds ids of real lessons, keeps existing ones and passes the check after", () => {
    writeFileSync(
      lockFile(),
      JSON.stringify({
        ids: ["fixture.card.cu"],
        retired: { "fixture.card.cu": "fixture.card.nhan-lap" },
      }),
    );
    const first = run("content-lock.ts", "--root", root);
    expect(first.code).toBe(0);
    const lock = JSON.parse(readFileSync(lockFile(), "utf8"));
    expect(lock.ids).toEqual(
      expect.arrayContaining([
        "fixture",
        "fixture.card.cu",
        "fixture.ex.chon-y-chinh",
      ]),
    );
    expect(lock.retired).toEqual({
      "fixture.card.cu": "fixture.card.nhan-lap",
    });

    const check = run("content-check.ts", "--root", root);
    expect(check.code).toBe(0);
    expect(check.out).toContain("0 errors, 0 warnings");

    expect(run("content-lock.ts", "--root", root).out).toContain("added 0 ids");
  });

  it("refuses to lock content that has errors", () => {
    writeFileSync(
      lockFile(),
      JSON.stringify({ ids: ["fixture.card.da-xoa"], retired: {} }),
    );
    const { code, err } = run("content-lock.ts", "--root", root);
    expect(code).toBe(1);
    expect(err).toContain("fix the errors above");
  });
});

// Each case spawns tsx several times, which is slow under coverage.
describe("content-hash", { timeout: 30_000 }, () => {
  it("prints the review hash and approves a clean lesson", () => {
    const printed = run("content-hash.ts", "fixture", "--root", root);
    expect(printed.code).toBe(0);
    const hash = printed.out.trim();
    expect(hash).toMatch(/^[0-9a-f]{64}$/);

    const approved = run(
      "content-hash.ts",
      "fixture",
      "--root",
      root,
      "--approve",
    );
    expect(approved.code).toBe(0);
    const lesson = JSON.parse(readFileSync(realLessonFile(), "utf8"));
    expect(lesson.status).toBe("published");
    expect(lesson.reviewedHash).toBe(hash);
    expect(Object.keys(lesson).indexOf("reviewedHash")).toBe(
      Object.keys(lesson).indexOf("status") + 1,
    );
    expect(run("content-check.ts", "--root", root).code).toBe(0);

    lesson.title = "Bài mẫu đã sửa";
    writeFileSync(realLessonFile(), JSON.stringify(lesson));
    const stale = run("content-check.ts", "--root", root);
    expect(stale.code).toBe(1);
    expect(stale.err).toMatch(/\$\.reviewedHash: .*\[review-hash\]/);
  });

  it("refuses to approve a lesson with lint errors", () => {
    const lesson = JSON.parse(readFileSync(realLessonFile(), "utf8"));
    lesson.sections[0].blocks[0].text = "Click vào đây.";
    writeFileSync(realLessonFile(), JSON.stringify(lesson));
    const { code, err } = run(
      "content-hash.ts",
      "fixture",
      "--root",
      root,
      "--approve",
    );
    expect(code).toBe(1);
    expect(err).toContain("[vietnamese]");
    expect(JSON.parse(readFileSync(realLessonFile(), "utf8")).status).toBe(
      "draft",
    );
  });

  it("fails for an unknown lesson", () => {
    expect(run("content-hash.ts", "khong-co", "--root", root).code).toBe(1);
  });
});
