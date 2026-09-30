import { existsSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { loadSubjects } from "@/content/load";
import { LessonIdSchema } from "@/schema/content";
import {
  importPages,
  missingPopplerTools,
  POPPLER_INSTALL,
  parsePageRange,
  RENDER_DPI,
  SOURCES_DIR,
} from "./lib/pdf-pages";

// Usage: sources-import <pdf> --pages X-Y --subject <id> --series <id>
//          --slug <slug> [--offset <n>] [--force]
// Renders the printed pages X-Y of a textbook PDF to
// sources/<subject>/<slug>/p<page>.png at RENDER_DPI, plus p<page>.txt when
// the page has a text layer. --offset is the PDF page index minus the printed
// page number (front matter), so file names match the pages sourceRef cites.
// Refuses to overwrite existing files without --force. Subject and series
// must be listed in content/subjects.json.
const USAGE =
  "Usage: pnpm sources:import <pdf> --pages X-Y --subject <id> --series <id> --slug <slug> [--offset <n>] [--force]";

function fail(message: string, code = 1): never {
  console.error(`sources:import: ${message}`);
  process.exit(code);
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    pages: { type: "string" },
    subject: { type: "string" },
    series: { type: "string" },
    slug: { type: "string" },
    offset: { type: "string", default: "0" },
    force: { type: "boolean", default: false },
  },
});
const pdf = positionals[0];
const { pages, subject, series, slug } = values;
if (!pdf || !pages || !subject || !series || !slug) {
  console.error(USAGE);
  process.exit(2);
}

const missing = missingPopplerTools();
if (missing.length > 0) {
  fail(
    `${missing.join(", ")} not found (poppler). Install it, then run this again:\n  ${POPPLER_INSTALL}`,
    2,
  );
}
if (!existsSync(pdf)) fail(`no file at ${pdf}`, 2);
if (!LessonIdSchema.safeParse(slug).success) {
  fail(`--slug "${slug}" must be kebab-case (a-z, 0-9, -)`, 2);
}
const known = loadSubjects().find((s) => s.id === subject);
if (!known) {
  const ids = loadSubjects().map((s) => s.id);
  fail(`--subject "${subject}" is not one of ${ids.join(", ")}`, 2);
}
if (!known.series.some((s) => s.id === series)) {
  fail(
    `--series "${series}" is not a ${subject} series in content/subjects.json (${known.series.map((s) => s.id).join(", ")}); add it there first`,
    2,
  );
}
const offset = Number(values.offset);
if (!Number.isInteger(offset))
  fail(`--offset "${values.offset}" is not a whole number`, 2);

const outDir = path.join(SOURCES_DIR, subject, slug);
let imported: ReturnType<typeof importPages>;
try {
  imported = importPages({
    pdf,
    pages: parsePageRange(pages),
    offset,
    outDir,
    force: values.force,
  });
} catch (error) {
  fail((error as Error).message);
}

for (const page of imported) {
  const text = page.text ? `, ${path.basename(page.text)}` : ", no text layer";
  console.log(
    `  p${page.page} (PDF page ${page.pdfPage}): ${path.basename(page.image)}${text}`,
  );
}
const withText = imported.filter((p) => p.text).length;
console.log(
  `sources:import: ${imported.length} pages at ${RENDER_DPI} dpi into ${path.relative(process.cwd(), outDir)} (${series}), ${withText} with a text layer`,
);
