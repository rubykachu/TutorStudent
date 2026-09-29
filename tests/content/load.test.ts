// @vitest-environment node
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildContentIndex,
  loadContent,
  loadSubjects,
  readContentRoot,
} from "@/content/load";
import { CONTENT_ROOT, fixtureContent, fixtureFile } from "./helpers";

let root: string;

// A throwaway content root: the committed subjects + fixture, plus one real
// lesson copied from the fixture whose status each test controls.
function writeRealLesson(status: "draft" | "published") {
  const lesson = structuredClone(fixtureFile(fixtureContent()).data) as Record<
    string,
    unknown
  >;
  const dir = path.join(root, "math", "kntt", "fixture");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "lesson.json"),
    JSON.stringify({ ...lesson, status }),
  );
}

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "tutor-content-"));
  cpSync(
    path.join(CONTENT_ROOT, "subjects.json"),
    path.join(root, "subjects.json"),
  );
  cpSync(
    path.join(CONTENT_ROOT, "ids.lock.json"),
    path.join(root, "ids.lock.json"),
  );
  cpSync(path.join(CONTENT_ROOT, "_fixture"), path.join(root, "_fixture"), {
    recursive: true,
  });
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("readContentRoot", () => {
  it("finds every lesson.json and marks the fixture", () => {
    writeRealLesson("draft");
    const raw = readContentRoot(root);
    expect(raw.lessons.map((l) => [l.dir.join("/"), l.fixture])).toEqual([
      ["_fixture/math/kntt/fixture", true],
      ["math/kntt/fixture", false],
    ]);
  });

  it("reports invalid JSON instead of throwing", () => {
    writeFileSync(path.join(root, "subjects.json"), "{ nope");
    const raw = readContentRoot(root);
    expect(raw.subjects.readError).toMatch(/^Invalid JSON/);
    expect(raw.subjects.data).toBeUndefined();
  });

  it("reports a missing file instead of throwing", () => {
    rmSync(path.join(root, "ids.lock.json"));
    expect(readContentRoot(root).lock.readError).toMatch(/^Cannot read file/);
  });
});

describe("loadContent", () => {
  it("returns published lessons and hides drafts", () => {
    writeRealLesson("published");
    const content = loadContent({ root, includeFixture: false });
    expect(content.subjects).toHaveLength(3);
    expect(content.lessons).toEqual([
      expect.objectContaining({ fixture: false }),
    ]);

    writeRealLesson("draft");
    expect(loadContent({ root, includeFixture: false }).lessons).toEqual([]);
  });

  it("includes the fixture only when asked", () => {
    expect(
      loadContent({ root, includeFixture: true }).lessons.map((l) => l.fixture),
    ).toEqual([true]);
    expect(loadContent({ root, includeFixture: false }).lessons).toEqual([]);
  });

  it("throws with the file and JSON path of a schema error", () => {
    writeFileSync(
      path.join(root, "subjects.json"),
      JSON.stringify({ subjects: [{ id: "math" }] }),
    );
    expect(() => loadContent({ root })).toThrow(
      /subjects\.json is invalid[\s\S]*\$\.subjects\[0\]\.name/,
    );
  });

  it("throws when a file cannot be parsed", () => {
    writeFileSync(path.join(root, "subjects.json"), "{ nope");
    expect(() => loadContent({ root })).toThrow(/subjects\.json: Invalid JSON/);
  });
});

describe("buildContentIndex", () => {
  it("lists only what the app may show, so drafts never reach the browser", () => {
    writeRealLesson("draft");
    const hidden = buildContentIndex(
      loadContent({ root, includeFixture: false }),
    );
    expect(hidden.subjects.map((s) => s.id)).toEqual([
      "math",
      "literature",
      "geography",
    ]);
    expect(hidden.lessons).toEqual([]);

    // The fixture is itself a draft; it appears only on explicit opt-in.
    const withFixture = buildContentIndex(
      loadContent({ root, includeFixture: true }),
    );
    expect(withFixture.lessons.map((l) => l.id)).toEqual(["fixture"]);

    writeRealLesson("published");
    const published = buildContentIndex(
      loadContent({ root, includeFixture: false }),
    );
    expect(published.lessons).toEqual([
      expect.objectContaining({ id: "fixture", subject: "math" }),
    ]);
  });

  it("hides the committed fixture from a default build", () => {
    const index = buildContentIndex(loadContent({ includeFixture: false }));
    expect(index.lessons.map((l) => l.id)).not.toContain("fixture");
  });
});

describe("loadSubjects", () => {
  it("reads the subjects without the lessons", () => {
    expect(loadSubjects(root).map((s) => s.defaultSeries)).toEqual([
      "kntt",
      "ctst",
      "kntt",
    ]);
  });
});
