// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  type CheckResult,
  checkContent,
  declaredIds,
  formatIssue,
  type RawContent,
} from "@/content/check";
import { computeTipsHash } from "@/content/lint/review-hash";
import { buildContentIndex, loadContent } from "@/content/load";
import { planLock } from "@/content/lock";
import { isTipsFileServed, lessonTips, sectionTips } from "@/content/tips";
import { TipsFileSchema } from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";
import {
  asRealLesson,
  fixtureContent,
  fixtureFile,
  lessonData,
  readSkeleton,
  writeContentRoot,
} from "./helpers";

function check(raw: RawContent): CheckResult {
  return checkContent(raw, visualRegistry);
}

function messages(result: CheckResult, rule?: string): string[] {
  return result.issues
    .filter((i) => (rule === undefined ? true : i.rule === rule))
    .filter((i) => i.severity === "error")
    .map((i) => formatIssue(i));
}

function tipsData(raw: RawContent) {
  const tips = fixtureFile(raw).tips;
  if (!tips) throw new Error("the fixture has a tips file");
  return tips.data as {
    status: string;
    reviewedHash?: string;
    lessonId: string;
    tips: { id: string; title: string; text: string; visualId?: string }[];
  };
}

// The tips file stays published with a matching hash after a mutation.
function rehash(raw: RawContent) {
  const data = tipsData(raw);
  data.reviewedHash = computeTipsHash(TipsFileSchema.parse(data));
}

describe("the fixture's tips", () => {
  it("passes content:check with a section tip and a tips file", () => {
    const result = check(fixtureContent());
    expect(result.issues).toEqual([]);
    const [fixture] = result.lessons;
    expect(fixture?.tips?.tips).toHaveLength(2);
    expect(fixture && sectionTips(fixture.lesson)).toHaveLength(1);
  });

  it("lists section tips first, then the file's, as plain tips", () => {
    const [fixture] = check(fixtureContent()).lessons;
    if (!fixture) throw new Error("no fixture");
    const tips = lessonTips(fixture.lesson, fixture.tips);
    expect(tips.map((t) => t.id)).toEqual([
      "fixture.tip.doc-cau-hoi",
      "fixture.tip.hieu-luy-thua",
      "fixture.tip.tranh-nhan-nham",
    ]);
    expect(tips.every((t) => !("type" in t))).toBe(true);
  });

  it("counts the tips of both sources in the lesson summary", () => {
    const content = loadContent({ includeFixture: true });
    const fixture = content.lessons.find((l) => l.fixture);
    expect(fixture?.tips).toHaveLength(3);
    const summary = buildContentIndex(content).lessons.find(
      (l) => l.id === "fixture",
    );
    expect(summary?.tipCount).toBe(3);
  });
});

describe("tips file", () => {
  it("serves a draft file only on request", () => {
    expect(isTipsFileServed({ status: "draft" }, false)).toBe(false);
    expect(isTipsFileServed({ status: "draft" }, true)).toBe(true);
    expect(isTipsFileServed({ status: "published" }, false)).toBe(true);
  });

  it("fails a published file edited after its review", () => {
    const raw = fixtureContent();
    tipsData(raw).tips[0].text = "Một câu khác hẳn.";
    expect(messages(check(raw), "tips")).toContainEqual(
      expect.stringContaining("Tips changed after their review"),
    );
  });

  it("fails a published file with no reviewedHash", () => {
    const raw = fixtureContent();
    delete tipsData(raw).reviewedHash;
    expect(messages(check(raw), "tips")).toContainEqual(
      expect.stringContaining("has no reviewedHash"),
    );
  });

  it("only warns about a draft file edited after its review", () => {
    const raw = fixtureContent();
    const data = tipsData(raw);
    data.status = "draft";
    data.tips[0].text = "Một câu khác hẳn.";
    const result = check(raw);
    expect(messages(result, "tips")).toEqual([]);
    expect(result.issues.some((i) => i.severity === "warning")).toBe(true);
  });

  it("never touches the lesson's own findings when only the file changes", () => {
    const raw = fixtureContent();
    tipsData(raw).tips[0].text = "Một câu khác hẳn.";
    rehash(raw);
    const lessonFile = fixtureFile(raw).file;
    expect(check(raw).issues.filter((i) => i.file === lessonFile)).toEqual([]);
  });

  it("rejects a tip of another lesson, a foreign id and a duplicate id", () => {
    const raw = fixtureContent();
    const data = tipsData(raw);
    data.lessonId = "khac";
    data.tips[0].id = "khac.tip.mot";
    data.tips[1].id = data.tips[0].id;
    rehash(raw);
    const found = messages(check(raw));
    expect(found).toContainEqual(
      expect.stringContaining('Expected lessonId "fixture"'),
    );
    expect(found).toContainEqual(
      expect.stringContaining('Id must start with "fixture."'),
    );
    expect(found).toContainEqual(expect.stringContaining("Duplicate id"));
  });

  it("rejects a tip that repeats the id of a tip block", () => {
    const raw = fixtureContent();
    tipsData(raw).tips[0].id = "fixture.tip.doc-cau-hoi";
    rehash(raw);
    expect(messages(check(raw))).toContainEqual(
      expect.stringContaining("also a tip block"),
    );
  });

  it("rejects a visual that is not in the registry", () => {
    const raw = fixtureContent();
    tipsData(raw).tips[0].visualId = "fixture.visual.khong-co";
    rehash(raw);
    expect(messages(check(raw))).toContainEqual(
      expect.stringContaining('Visual "fixture.visual.khong-co"'),
    );
  });

  it("holds tip text to the Vietnamese wording rules", () => {
    const raw = fixtureContent();
    tipsData(raw).tips[0].text = "Hello the world";
    rehash(raw);
    expect(messages(check(raw), "vietnamese").length).toBeGreaterThan(0);
  });

  it("keeps a tip to three sentences and a short title", () => {
    const raw = fixtureContent();
    const data = tipsData(raw);
    data.tips[0].text = "Một câu. Hai câu. Ba câu. Bốn câu.";
    data.tips[1].title = "Một hai ba bốn năm sáu bảy tám chín";
    rehash(raw);
    const found = messages(check(raw), "tips");
    expect(found).toContainEqual(expect.stringContaining("4 sentences"));
    expect(found).toContainEqual(expect.stringContaining("title has 9 words"));
  });

  it("applies the same shape to a tip block of a section", () => {
    const raw = fixtureContent();
    const blocks = lessonData(raw).sections[1]?.blocks as {
      type: string;
      text?: string;
    }[];
    const tip = blocks.find((b) => b.type === "tip");
    if (!tip) throw new Error("no tip block");
    tip.text = "Một câu. Hai câu. Ba câu. Bốn câu.";
    expect(messages(check(raw), "tips")).toContainEqual(
      expect.stringContaining("4 sentences"),
    );
  });
});

describe("tip ids", () => {
  it("are declared by the lesson, from blocks and from the file", () => {
    const [fixture] = check(fixtureContent()).lessons;
    if (!fixture) throw new Error("no fixture");
    const ids = declaredIds(fixture.lesson, fixture.tips).map((d) => d.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "fixture.tip.doc-cau-hoi",
        "fixture.tip.hieu-luy-thua",
      ]),
    );
    expect(declaredIds(fixture.lesson).map((d) => d.id)).not.toContain(
      "fixture.tip.hieu-luy-thua",
    );
  });

  it("are locked with the lesson", () => {
    const raw = asRealLesson(fixtureContent());
    const result = check(raw);
    const plan = planLock({
      lock: { ids: [] },
      lessons: result.lessons,
      issues: [],
      only: ["fixture"],
    });
    expect(plan.ids).toEqual(
      expect.arrayContaining([
        "fixture.tip.doc-cau-hoi",
        "fixture.tip.hieu-luy-thua",
        "fixture.tip.tranh-nhan-nham",
      ]),
    );
  });

  it("count a tips file error as the lesson's when locking", () => {
    const raw = asRealLesson(fixtureContent());
    tipsData(raw).tips[0].text = "Một câu khác hẳn.";
    const result = check(raw);
    const plan = planLock({
      lock: { ids: [] },
      lessons: result.lessons,
      issues: result.issues,
      only: ["fixture"],
    });
    expect(plan.errors.join("\n")).toContain("tips.json");
  });
});

describe("serving a tips file", () => {
  let root: string | undefined;
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
    root = undefined;
  });

  // A published lesson, as the skeleton, with a tips file of `status`.
  function lessonWithTips(status: "draft" | "published") {
    root = mkdtempSync(path.join(tmpdir(), "tutor-tips-"));
    const lesson = { ...readSkeleton(), status: "published" };
    const file = writeContentRoot(root, lesson);
    writeFileSync(
      path.join(path.dirname(file), "tips.json"),
      JSON.stringify({
        lessonId: "bai-moi",
        status,
        tips: [
          {
            id: "bai-moi.tip.mot",
            kind: "làm nhanh",
            title: "Một dạng bài",
            text: "Một câu ngắn.",
          },
        ],
      }),
    );
    return loadContent({ root, includeFixture: false });
  }

  it("lists a published file's tips with the lesson", () => {
    const [served] = lessonWithTips("published").lessons;
    expect(served?.tips.map((t) => t.id)).toEqual(["bai-moi.tip.mot"]);
  });

  it("keeps a draft file's tips off a published lesson", () => {
    const [served] = lessonWithTips("draft").lessons;
    expect(served?.lesson.id).toBe("bai-moi");
    expect(served?.tips).toEqual([]);
  });
});
