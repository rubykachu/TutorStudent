// @vitest-environment node
import { execFileSync } from "node:child_process";
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
import {
  autoCols,
  DEFAULT_SHEET_OPTIONS,
  ffmpegAvailable,
  labelLines,
  listImages,
  planSheets,
  type SheetImage,
  sheetName,
  writeSheets,
} from "../../scripts/lib/contact-sheet";

const phone = (n: number): SheetImage[] =>
  Array.from({ length: n }, (_, i) => ({
    file: `${i}.png`,
    width: 780,
    height: 1688,
  }));
const landscape = (n: number): SheetImage[] =>
  Array.from({ length: n }, (_, i) => ({
    file: `${i}.png`,
    width: 2360,
    height: 1640,
  }));

describe("planSheets", () => {
  it("keeps every sheet inside the size limit", () => {
    for (const images of [phone(30), landscape(30)]) {
      const plan = planSheets(images);
      for (const sheet of plan.sheets) {
        expect(sheet.width).toBeLessThanOrEqual(DEFAULT_SHEET_OPTIONS.maxWidth);
        expect(sheet.height).toBeLessThanOrEqual(
          DEFAULT_SHEET_OPTIONS.maxHeight,
        );
      }
    }
  });

  it("splits a long list into sheets and keeps every file once, in order", () => {
    const images = phone(30);
    const plan = planSheets(images);
    expect(plan.sheets.length).toBeGreaterThan(1);
    expect(plan.sheets.flatMap((s) => s.tiles.map((t) => t.file))).toEqual(
      images.map((i) => i.file),
    );
  });

  it("puts tiles on a grid without overlap", () => {
    const plan = planSheets(landscape(20));
    for (const sheet of plan.sheets) {
      const cell = plan.tileWidth;
      for (const [i, a] of sheet.tiles.entries()) {
        expect(a.x + cell).toBeLessThanOrEqual(sheet.width);
        expect(a.y).toBeLessThan(sheet.height);
        for (const b of sheet.tiles.slice(i + 1)) {
          const apartX = Math.abs(a.x - b.x) >= cell;
          const apartY = Math.abs(a.y - b.y) >= plan.tileHeight;
          expect(apartX || apartY).toBe(true);
        }
      }
    }
  });

  it("makes few tiles larger and never upscales a small image", () => {
    const few = planSheets(landscape(2));
    expect(few.cols).toBe(2);
    expect(few.sheets).toHaveLength(1);
    const small = planSheets([{ file: "a.png", width: 300, height: 400 }]);
    expect(small.tileWidth).toBe(300);
  });

  it("honours cols and rejects a bad one", () => {
    expect(
      planSheets(phone(10), { ...DEFAULT_SHEET_OPTIONS, cols: 2 }).cols,
    ).toBe(2);
    expect(() =>
      planSheets(phone(3), { ...DEFAULT_SHEET_OPTIONS, cols: 0 }),
    ).toThrow(/cols/);
    expect(() => planSheets([])).toThrow(/No images/);
  });

  it("picks more columns for tall shots", () => {
    expect(autoCols(phone(1))).toBe(4);
    expect(autoCols(landscape(1))).toBe(3);
  });
});

describe("labelLines", () => {
  it("prints the file name without extension, wrapped at a dash", () => {
    expect(labelLines("a/005-s1-block.png", 400)).toEqual(["005-s1-block"]);
    const lines = labelLines(
      "a/009-s1-06-exercise-kt-phan-tu-hop-but-wrong1.png",
      300,
    );
    expect(lines.join("")).toBe("009-s1-06-exercise-kt-phan-tu-hop-but-wrong1");
    expect(lines.every((l) => l.length <= 30)).toBe(true);
  });

  it("shortens a name that does not fit in two lines, keeping both ends", () => {
    const lines = labelLines(`${"x".repeat(200)}-end.png`, 300);
    expect(lines).toHaveLength(2);
    expect(lines.join("")).toContain("…");
    expect(lines.join("").endsWith("-end")).toBe(true);
  });
});

describe("listImages", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), "sheet-list-"));
    for (const name of [
      "10-a.png",
      "2-a.png",
      "b-ipad.png",
      "b-phone.png",
      "notes.txt",
      "sheet-01.png",
      "sheet-s2-01.png",
      "mine-01.png",
    ]) {
      writeFileSync(path.join(dir, name), "x");
    }
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const names = (files: string[]) => files.map((f) => path.basename(f));

  it("lists a directory's images in natural order, without sheets", () => {
    expect(names(listImages([dir], path.join(dir, "mine")))).toEqual([
      "2-a.png",
      "10-a.png",
      "b-ipad.png",
      "b-phone.png",
    ]);
  });

  it("matches a pattern in the last path part", () => {
    expect(names(listImages([path.join(dir, "*-ipad*.png")]))).toEqual([
      "b-ipad.png",
    ]);
  });

  it("fails on a missing path", () => {
    expect(() => listImages([path.join(dir, "nope")])).toThrow(/No such/);
  });
});

describe("sheetName", () => {
  it("numbers sheets from 01", () => {
    expect(sheetName("out/sheet", 0)).toBe("out/sheet-01.png");
    expect(sheetName("out/sheet", 11)).toBe("out/sheet-12.png");
  });
});

describe.skipIf(!ffmpegAvailable())("writeSheets", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), "sheet-render-"));
    mkdirSync(path.join(dir, "in"));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  function shot(name: string, size: string) {
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      `color=c=white:s=${size}`,
      "-frames:v",
      "1",
      path.join(dir, "in", name),
    ]);
  }

  it("renders every planned sheet, and replaces earlier ones", async () => {
    for (let i = 0; i < 9; i++) shot(`${i}.png`, "390x844");
    shot("wide.png", "820x600");
    const files = listImages([path.join(dir, "in")]);
    const stem = path.join(dir, "out", "sheet");
    const written = await writeSheets(files, stem);
    expect(written).toEqual([sheetName(stem, 0), sheetName(stem, 1)]);
    expect(written.every((f) => existsSync(f))).toBe(true);
    const again = await writeSheets(files.slice(0, 2), stem);
    expect(again).toEqual([sheetName(stem, 0)]);
    expect(existsSync(sheetName(stem, 1))).toBe(false);
  });
});
