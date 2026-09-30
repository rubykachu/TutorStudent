// @vitest-environment node
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  importPages,
  missingPopplerTools,
  parsePageRange,
} from "../../scripts/lib/pdf-pages";

// A PDF whose pages each draw a box; the pages listed in `withText` also
// write "Page <n>" in Helvetica, so they carry a text layer and the others
// look like scans.
function tinyPdf(pageCount: number, withText: number[]): Buffer {
  const objects: string[] = [];
  // Returns the object number (1-based) PDF references use.
  const add = (body: string) => objects.push(body);
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add(""); // page tree, filled in once the pages exist
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const kids: number[] = [];
  for (let n = 1; n <= pageCount; n++) {
    const draw = `0.5 g 20 20 100 60 re f${withText.includes(n) ? ` BT /F1 18 Tf 30 100 Td (Page ${n}) Tj ET` : ""}`;
    const stream = add(
      `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`,
    );
    kids.push(
      add(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 150] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${stream} 0 R >>`,
      ),
    );
  }
  objects[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${pageCount} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((body, i) => {
    const at = pdf.length;
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    return at;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const at of offsets) pdf += `${String(at).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

describe("parsePageRange", () => {
  it("reads a single page and a range", () => {
    expect(parsePageRange("7")).toEqual({ first: 7, last: 7 });
    expect(parsePageRange("12-15")).toEqual({ first: 12, last: 15 });
  });

  it.each(["", "0", "5-3", "a-b", "3-", "1,2"])("rejects %j", (text) => {
    expect(() => parsePageRange(text)).toThrow(/--pages/);
  });
});

const hasPoppler = missingPopplerTools().length === 0;

describe.skipIf(!hasPoppler)("importPages", () => {
  let dir: string;
  let pdf: string;
  let outDir: string;
  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "tutor-sources-"));
    pdf = path.join(dir, "book.pdf");
    outDir = path.join(dir, "out");
    writeFileSync(pdf, tinyPdf(4, [2, 3]));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const options = (
    pages: string,
    offset = 0,
    force = false,
    book: "sgk" | "sbt" = "sgk",
  ) => ({
    pdf,
    pages: parsePageRange(pages),
    offset,
    outDir,
    book,
    force,
  });

  it("renders printed pages with the offset and keeps the text layer when there is one", () => {
    // Printed pages 1-3 are PDF pages 2-4 (one cover page).
    const pages = importPages(options("1-3", 1));
    expect(pages.map((p) => [p.page, p.pdfPage])).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
    for (const page of [1, 2, 3]) {
      const png = readFileSync(path.join(outDir, `p${page}.png`));
      expect(png.subarray(1, 4).toString()).toBe("PNG");
      // 200 pt wide at 200 dpi is about 556 px.
      expect(png.readUInt32BE(16)).toBeGreaterThan(500);
    }
    expect(readFileSync(path.join(outDir, "p1.txt"), "utf8")).toContain(
      "Page 2",
    );
    expect(readFileSync(path.join(outDir, "p2.txt"), "utf8")).toContain(
      "Page 3",
    );
    expect(existsSync(path.join(outDir, "p3.txt"))).toBe(false);
    expect(pages[2]?.text).toBeUndefined();
  });

  it("names workbook pages apart from textbook pages", () => {
    importPages(options("2"));
    const [page] = importPages(options("2", 0, false, "sbt"));
    expect(page?.image).toBe(path.join(outDir, "sbt-p2.png"));
    expect(existsSync(path.join(outDir, "p2.png"))).toBe(true);
    expect(existsSync(path.join(outDir, "sbt-p2.txt"))).toBe(true);
  });

  it("refuses pages outside the PDF", () => {
    expect(() => importPages(options("4-5"))).toThrow(/outside the PDF's 1-4/);
    expect(() => importPages(options("1", -1))).toThrow(/outside/);
    expect(existsSync(outDir)).toBe(false);
  });

  it("never overwrites existing pages without force", () => {
    importPages(options("2"));
    const before = statSync(path.join(outDir, "p2.png")).mtimeMs;
    expect(() => importPages(options("1-2"))).toThrow(
      /would overwrite .*p2\.png.*--force/,
    );
    expect(existsSync(path.join(outDir, "p1.png"))).toBe(false);
    expect(statSync(path.join(outDir, "p2.png")).mtimeMs).toBe(before);
    expect(importPages(options("1-2", 0, true))).toHaveLength(2);
  });
});

describe("sources-import CLI", () => {
  function run(...args: string[]) {
    const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");
    const result = spawnSync(
      tsx,
      [path.join("scripts", "sources-import.ts"), ...args],
      { encoding: "utf8" },
    );
    return { code: result.status, err: result.stderr };
  }
  const args = (overrides: Record<string, string>) => {
    const all = {
      pages: "1",
      subject: "math",
      series: "kntt",
      slug: "bai-thu",
      ...overrides,
    };
    return Object.entries(all).flatMap(([k, v]) => [`--${k}`, v]);
  };

  it("prints usage when an option is missing", () => {
    const { code, err } = run("book.pdf", "--pages", "1");
    expect(code).toBe(2);
    expect(err).toContain("Usage: pnpm sources:import");
  });

  it.skipIf(!hasPoppler)(
    "checks subject, series and slug against content/",
    () => {
      const pdf = path.join(tmpdir(), `tutor-cli-${process.pid}.pdf`);
      writeFileSync(pdf, tinyPdf(1, []));
      try {
        expect(run(pdf, ...args({ subject: "history" })).err).toMatch(
          /--subject "history" is not one of math, literature, geography/,
        );
        expect(run(pdf, ...args({ series: "ctst" })).err).toMatch(
          /--series "ctst" is not a math series/,
        );
        expect(run(pdf, ...args({ slug: "Bài 1" })).err).toMatch(/kebab-case/);
      } finally {
        rmSync(pdf, { force: true });
      }
    },
  );
});
