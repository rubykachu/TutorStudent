// @vitest-environment node
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { visualRegistry } from "@/visuals/registry";
import { readSkeleton, writeContentRoot } from "./helpers";

// Runs the real scripts through tsx against a throwaway content root.
function run(script: string, ...args: string[]) {
  const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");
  const result = spawnSync(tsx, [path.join("scripts", script), ...args], {
    encoding: "utf8",
  });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

let root: string;
let lessonFile: string;
const lockFile = () => path.join(root, "ids.lock.json");
const readLesson = () => JSON.parse(readFileSync(lessonFile, "utf8"));

// A drawn visual of a real lesson, standing in for the skeleton's fixture
// placeholders so the lesson can be approved.
const REAL_VISUAL = Object.keys(visualRegistry).find(
  (id) => !id.startsWith("fixture.") && !visualRegistry[id]?.interactive,
);

function withoutPlaceholders(lesson: Record<string, unknown>) {
  return JSON.parse(
    JSON.stringify(lesson).replace(
      /"fixture\.visual\.[^"]+"/g,
      `"${REAL_VISUAL}"`,
    ),
  );
}

// The skeleton is the one real lesson (ids.lock applies to it); the fixture
// stays under _fixture/.
beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "tutor-cli-"));
  lessonFile = writeContentRoot(root, withoutPlaceholders(readSkeleton()));
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("content-check", () => {
  it("passes a valid root and prints stats, with spec criteria for real lessons", () => {
    const { code, out } = run("content-check.ts", "--root", root, "--stats");
    expect(code).toBe(0);
    const lines = out.split("\n");
    const fixture = lines.findIndex((line) => line.startsWith("fixture ("));
    expect(lines[fixture]).toContain(
      "2 sections, 3 cards, 13 exercises, 8 exercise types, 2 interactive visuals",
    );
    // The fixture is test content, not held to the lesson minimums.
    expect(lines[fixture + 1]).toMatch(/^bai-moi \(/);
    expect(lines[fixture + 1]).toContain(
      "1 sections, 1 cards, 4 exercises, 2 exercise types, 0 interactive visuals",
    );
    expect(lines).toContain("  FAIL sections: 1 (min 3)");
    expect(lines).toContain(
      "  PASS sections with a visual: 1 (min 1 = every section)",
    );
    expect(lines).toContain(
      "  FAIL interactive visuals: 0 (min 1 = ceil(1 sections / 3))",
    );
  });

  it("exits non-zero and prints file and JSON path for each error", () => {
    const lesson = readLesson();
    lesson.cards[0].conceptIds = ["bai-moi.concept.khong-co"];
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const { code, err } = run("content-check.ts", "--root", root);
    expect(code).toBe(1);
    expect(err).toMatch(
      /^error .*math\/kntt\/bai-moi\/lesson\.json \$\.cards\[0\]\.conceptIds\[0\]: Unknown concept/m,
    );
  });
});

describe("content-lock", () => {
  it("adds ids of real lessons, keeps existing ones and passes the check after", () => {
    writeFileSync(
      lockFile(),
      JSON.stringify({
        ids: ["bai-moi.card.cu"],
        retired: { "bai-moi.card.cu": "bai-moi.card.tich" },
      }),
    );
    const first = run("content-lock.ts", "--root", root);
    expect(first.code).toBe(0);
    const lock = JSON.parse(readFileSync(lockFile(), "utf8"));
    expect(lock.ids).toEqual(
      expect.arrayContaining([
        "bai-moi",
        "bai-moi.card.cu",
        "bai-moi.ex.chon-tich",
      ]),
    );
    expect(lock.ids.some((id: string) => id.startsWith("fixture"))).toBe(false);
    expect(lock.retired).toEqual({ "bai-moi.card.cu": "bai-moi.card.tich" });

    const check = run("content-check.ts", "--root", root);
    expect(check.code).toBe(0);
    expect(check.out).toContain("0 errors, 0 warnings");

    expect(run("content-lock.ts", "--root", root).out).toContain("added 0 ids");
  });

  // A second real lesson, a copy of the first under another id.
  function addLesson(id: string, patch: Record<string, unknown>) {
    const copy = JSON.parse(
      JSON.stringify(withoutPlaceholders(readSkeleton())).replaceAll(
        "bai-moi",
        id,
      ),
    );
    const dir = path.join(root, "math", "kntt", id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, "lesson.json"),
      JSON.stringify({ ...copy, order: 99, ...patch }),
    );
  }
  const lockedIds = () => JSON.parse(readFileSync(lockFile(), "utf8")).ids;
  const STALE = { status: "published", reviewedHash: "0".repeat(64) };

  it("locks only the named lessons", () => {
    addLesson("bai-khac", {});
    const { code } = run("content-lock.ts", "bai-khac", "--root", root);
    expect(code).toBe(0);
    expect(lockedIds()).toContain("bai-khac.ex.chon-tich");
    expect(lockedIds()).not.toContain("bai-moi.ex.chon-tich");
  });

  it("skips a lesson whose review is stale when locking every lesson", () => {
    addLesson("bai-cu", STALE);
    const { code, err, out } = run("content-lock.ts", "--root", root);
    expect(code).toBe(0);
    expect(err).toContain("skipped bai-cu");
    expect(out).toContain("added");
    expect(lockedIds()).toContain("bai-moi.ex.chon-tich");
    expect(lockedIds()).not.toContain("bai-cu.ex.chon-tich");
  });

  it("ignores errors of lessons it is not asked to lock, refuses its own", () => {
    addLesson("bai-cu", STALE);
    expect(run("content-lock.ts", "bai-moi", "--root", root).code).toBe(0);
    const named = run("content-lock.ts", "bai-cu", "--root", root);
    expect(named.code).toBe(1);
    expect(named.err).toContain("changed after its review");
  });

  it("refuses a lesson id that does not exist", () => {
    const { code, err } = run("content-lock.ts", "khong-co", "--root", root);
    expect(code).toBe(1);
    expect(err).toContain('no valid lesson "khong-co"');
  });

  it("refuses to lock content that has errors", () => {
    writeFileSync(
      lockFile(),
      JSON.stringify({ ids: ["bai-moi.card.da-xoa"], retired: {} }),
    );
    const { code, err } = run("content-lock.ts", "--root", root);
    expect(code).toBe(1);
    expect(err).toContain("fix the errors above");
  });
});

// Each case spawns tsx several times, which is slow under coverage.
describe("content-hash", { timeout: 30_000 }, () => {
  it("prints the review hash and approves a clean lesson", () => {
    const printed = run("content-hash.ts", "bai-moi", "--root", root);
    expect(printed.code).toBe(0);
    const hash = printed.out.trim();
    expect(hash).toMatch(/^[0-9a-f]{64}$/);

    const approved = run(
      "content-hash.ts",
      "bai-moi",
      "--root",
      root,
      "--approve",
    );
    expect(approved.code).toBe(0);
    const lesson = readLesson();
    expect(lesson.status).toBe("published");
    expect(lesson.reviewedHash).toBe(hash);
    expect(Object.keys(lesson).indexOf("reviewedHash")).toBe(
      Object.keys(lesson).indexOf("status") + 1,
    );
    expect(run("content-check.ts", "--root", root).code).toBe(0);

    lesson.title = "Bài mẫu đã sửa";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const stale = run("content-check.ts", "--root", root);
    expect(stale.code).toBe(1);
    expect(stale.err).toMatch(/\$\.reviewedHash: .*\[review-hash\]/);
  });

  it("refuses to approve a lesson with lint errors", () => {
    const lesson = readLesson();
    lesson.sections[0].blocks[1].children[0].text = "Click vào đây.";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const { code, err } = run(
      "content-hash.ts",
      "bai-moi",
      "--root",
      root,
      "--approve",
    );
    expect(code).toBe(1);
    expect(err).toContain("[vietnamese]");
    expect(readLesson().status).toBe("draft");
  });

  it("refuses to approve a lesson that still shows placeholder visuals", () => {
    writeFileSync(lessonFile, JSON.stringify(readSkeleton()));
    const { code, err } = run(
      "content-hash.ts",
      "bai-moi",
      "--root",
      root,
      "--approve",
    );
    expect(code).toBe(1);
    expect(err).toContain("[placeholder]");
    expect(readLesson().status).toBe("draft");
  });

  it("fails for an unknown lesson", () => {
    expect(run("content-hash.ts", "khong-co", "--root", root).code).toBe(1);
  });
});

describe("content-diff", { timeout: 30_000 }, () => {
  const git = (...args: string[]) =>
    spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], {
      cwd: root,
      encoding: "utf8",
    });
  const commit = (message: string) => {
    git("add", "-A");
    git("commit", "-q", "-m", message);
  };
  const reviewFile = () => path.join(path.dirname(lessonFile), "review.md");
  const writeReview = () =>
    writeFileSync(
      reviewFile(),
      "# Review\n\n- Kết luận: Chưa đạt\n\n## Nghiêm trọng\n",
    );

  beforeEach(() => {
    git("init", "-q");
    commit("draft");
  });

  it("diffs against the version recorded by --mark, found in git history", () => {
    writeReview();
    const marked = run("content-hash.ts", "bai-moi", "--root", root, "--mark");
    expect(marked.code).toBe(0);
    const hash = marked.out.split("\n")[0];
    const review = readFileSync(reviewFile(), "utf8").split("\n");
    expect(review[3]).toBe(
      `- Bản đã review: \`${hash}\` (\`pnpm content:diff\` so với bản này)`,
    );
    // Not committed yet: nothing changed since the review.
    expect(run("content-diff.ts", "bai-moi", "--root", root).out).toContain(
      "No change",
    );
    commit("review round 1");

    const lesson = readLesson();
    lesson.sections[0].recap.caption = "Câu nhớ mới.";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const { code, out } = run("content-diff.ts", "bai-moi", "--root", root);
    expect(code).toBe(0);
    expect(out).toContain(`changed section ${lesson.sections[0].id} recap`);
    expect(out).toContain("  + caption: Câu nhớ mới.");
    expect(out).toContain(`  ${lesson.sections[0].id} (`);
  });

  it("falls back to the last approved version and records it on approve", () => {
    writeReview();
    expect(
      run("content-hash.ts", "bai-moi", "--root", root, "--approve").code,
    ).toBe(0);
    expect(readFileSync(reviewFile(), "utf8")).toContain("- Bản đã review: `");
    rmSync(reviewFile());
    commit("approved");

    const lesson = readLesson();
    lesson.title = "Bài mẫu đã sửa";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const { out } = run("content-diff.ts", "bai-moi", "--root", root);
    expect(out).toContain("last approved version");
    expect(out).toContain("changed lesson\n  - title: ");
  });

  it("fails when the recorded version was never committed", () => {
    writeReview();
    const lesson = readLesson();
    lesson.title = "Bài mẫu vòng một";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    run("content-hash.ts", "bai-moi", "--root", root, "--mark");
    lesson.title = "Bài mẫu đã sửa";
    writeFileSync(lessonFile, JSON.stringify(lesson));
    const { code, err } = run("content-diff.ts", "bai-moi", "--root", root);
    expect(code).toBe(1);
    expect(err).toContain("commit lesson.json after each review round");
  });
});
