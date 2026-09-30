import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

// Turns textbook PDF pages into the lesson sources the authoring skills read:
// sources/<subject>/<slug>/p<page>.png (the primary source, figures and all)
// and, when the PDF has a text layer, p<page>.txt next to it (auxiliary, for
// cross-checking verbatim transcription). Rendering uses poppler
// (pdfinfo, pdftoppm, pdftotext); macOS's own sips and qlmanage only render
// the first page of a PDF, so they cannot replace it.

export const SOURCES_DIR = path.join(process.cwd(), "sources");
export const RENDER_DPI = 200;
export const POPPLER_INSTALL = "brew install poppler";
const POPPLER_TOOLS = ["pdfinfo", "pdftoppm", "pdftotext"] as const;

export type PageRange = { first: number; last: number };

// Which book the pages come from. Workbook (sách bài tập) pages get their own
// file prefix, so a lesson can hold textbook and workbook pages with the same
// printed number; sourceRef cites them as "SBT tr.<n>".
export const BOOK_PREFIX = { sgk: "p", sbt: "sbt-p" } as const;
export type Book = keyof typeof BOOK_PREFIX;

// "12" or "12-15"; pages count from 1.
export function parsePageRange(text: string): PageRange {
  const match = /^(\d+)(?:-(\d+))?$/.exec(text.trim());
  if (!match) {
    throw new Error(`--pages "${text}" is not a page or a range like 12-15`);
  }
  const first = Number(match[1]);
  const last = Number(match[2] ?? match[1]);
  if (first < 1 || last < first) {
    throw new Error(`--pages "${text}" must go from page 1 up, low to high`);
  }
  return { first, last };
}

export function missingPopplerTools(): string[] {
  return POPPLER_TOOLS.filter(
    (tool) => spawnSync("which", [tool], { encoding: "utf8" }).status !== 0,
  );
}

function run(command: string, args: string[]): string {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed: ${(result.stderr || result.error?.message || "").trim()}`,
    );
  }
  return result.stdout;
}

export function pdfPageCount(pdf: string): number {
  const pages = /^Pages:\s+(\d+)/m.exec(run("pdfinfo", [pdf]))?.[1];
  if (pages === undefined)
    throw new Error(`pdfinfo found no page count in ${pdf}`);
  return Number(pages);
}

export type ImportOptions = {
  pdf: string;
  // Printed page numbers, the ones a lesson's sourceRef cites.
  pages: PageRange;
  // PDF page index minus printed page number (cover and front matter make it
  // positive): printed page 26 is PDF page 26 + offset.
  offset: number;
  outDir: string;
  book: Book;
  force: boolean;
};

export type ImportedPage = {
  page: number;
  pdfPage: number;
  image: string;
  // Absent when the PDF has no text layer on that page (a scan).
  text?: string;
};

// The files an import would write, so existing ones can be refused before
// anything is rendered.
export function plannedFiles(options: ImportOptions): string[] {
  const files: string[] = [];
  for (let page = options.pages.first; page <= options.pages.last; page++) {
    const base = path.join(
      options.outDir,
      `${BOOK_PREFIX[options.book]}${page}`,
    );
    files.push(`${base}.png`, `${base}.txt`);
  }
  return files;
}

export function importPages(options: ImportOptions): ImportedPage[] {
  const { pdf, pages, offset, outDir, book, force } = options;
  const count = pdfPageCount(pdf);
  if (pages.first + offset < 1 || pages.last + offset > count) {
    throw new Error(
      `pages ${pages.first}-${pages.last} with offset ${offset} are PDF pages ${pages.first + offset}-${pages.last + offset}, outside the PDF's 1-${count}`,
    );
  }
  const existing = plannedFiles(options).filter((file) => existsSync(file));
  if (existing.length > 0 && !force) {
    throw new Error(
      `would overwrite ${existing.map((f) => path.relative(process.cwd(), f)).join(", ")}; pass --force to replace them`,
    );
  }
  mkdirSync(outDir, { recursive: true });
  const imported: ImportedPage[] = [];
  for (let page = pages.first; page <= pages.last; page++) {
    const pdfPage = page + offset;
    const at = String(pdfPage);
    const base = path.join(outDir, `${BOOK_PREFIX[book]}${page}`);
    // pdftoppm appends ".png" to the prefix it is given.
    run("pdftoppm", [
      "-png",
      "-r",
      String(RENDER_DPI),
      "-f",
      at,
      "-l",
      at,
      "-singlefile",
      pdf,
      `${base}.render`,
    ]);
    renameSync(`${base}.render.png`, `${base}.png`);
    const text = run("pdftotext", [
      "-layout",
      "-enc",
      "UTF-8",
      "-f",
      at,
      "-l",
      at,
      pdf,
      "-",
    ]);
    const textFile = `${base}.txt`;
    if (text.trim().length > 0) {
      writeFileSync(textFile, text);
      imported.push({ page, pdfPage, image: `${base}.png`, text: textFile });
    } else {
      // A stale text file from an earlier import would no longer match.
      rmSync(textFile, { force: true });
      imported.push({ page, pdfPage, image: `${base}.png` });
    }
  }
  return imported;
}
