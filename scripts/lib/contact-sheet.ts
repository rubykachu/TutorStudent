import { execFile, execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

// Tiles screenshots into contact sheets so a reader looks at one image
// instead of one file per shot. Each tile carries its file name; a sheet is
// capped in size so tiles stay legible, and a long list splits into sheets.

const run = promisify(execFile);

const IMAGE_EXTENSION = /\.(png|jpe?g|webp)$/i;
const BACKGROUND = "0x1f2937";
const LETTERBOX = "0x374151";
const FONT_CANDIDATES = [
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/System/Library/Fonts/Helvetica.ttc",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/TTF/DejaVuSans.ttf",
  "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
];
const FONT_SIZE = 15;
const CHAR_WIDTH = FONT_SIZE * 0.62;
const LABEL_LINES = 2;
const LABEL_HEIGHT = LABEL_LINES * (FONT_SIZE + 3) + 6;
const GAP = 8;
const INFO_PROBE_CHUNK = 16;

export type SheetImage = { file: string; width: number; height: number };

export type SheetOptions = {
  // Tiles across; "auto" picks from the shape of the images.
  cols: number | "auto";
  // Largest sheet in pixels. Readers downscale images past about 1600px, so
  // the defaults keep sheets near that size.
  maxWidth: number;
  maxHeight: number;
};

export const DEFAULT_SHEET_OPTIONS: SheetOptions = {
  cols: "auto",
  maxWidth: 1600,
  maxHeight: 1800,
};

export type Tile = { file: string; x: number; y: number };

export type Sheet = {
  width: number;
  height: number;
  tiles: Tile[];
};

export type SheetPlan = {
  // Size of the picture area of every tile; the label strip sits above it.
  tileWidth: number;
  tileHeight: number;
  cols: number;
  sheets: Sheet[];
};

// Tall phone shots get a fourth column; every other shape reads well in three.
export function autoCols(images: readonly SheetImage[]): number {
  const aspect = Math.max(...images.map((i) => i.height / i.width));
  return aspect > 1.8 ? 4 : 3;
}

export function planSheets(
  images: readonly SheetImage[],
  options: SheetOptions = DEFAULT_SHEET_OPTIONS,
): SheetPlan {
  if (images.length === 0) throw new Error("No images to tile");
  const wanted = options.cols === "auto" ? autoCols(images) : options.cols;
  if (!Number.isInteger(wanted) || wanted < 1) {
    throw new Error("cols must be a whole number of at least 1");
  }
  const cols = Math.min(wanted, images.length);
  const widest = Math.max(...images.map((i) => i.width));
  const tileWidth = Math.min(
    widest,
    Math.floor((options.maxWidth - GAP * (cols + 1)) / cols),
  );
  const maxAspect = Math.max(...images.map((i) => i.height / i.width));
  const tileHeight = Math.min(
    Math.ceil(tileWidth * maxAspect),
    options.maxHeight - LABEL_HEIGHT - 2 * GAP,
  );
  const cellHeight = LABEL_HEIGHT + tileHeight;
  const rows = Math.max(
    1,
    Math.floor((options.maxHeight - GAP) / (cellHeight + GAP)),
  );
  const perSheet = cols * rows;

  const sheets: Sheet[] = [];
  for (let start = 0; start < images.length; start += perSheet) {
    const batch = images.slice(start, start + perSheet);
    const batchRows = Math.ceil(batch.length / cols);
    sheets.push({
      width: GAP + cols * (tileWidth + GAP),
      height: GAP + batchRows * (cellHeight + GAP),
      tiles: batch.map((image, i) => ({
        file: image.file,
        x: GAP + (i % cols) * (tileWidth + GAP),
        y: GAP + Math.floor(i / cols) * (cellHeight + GAP),
      })),
    });
  }
  return { tileWidth, tileHeight, cols, sheets };
}

// Breaks after the last "-" in the second half of each line, else mid-word.
function wrap(text: string, perLine: number): string[] {
  const lines: string[] = [];
  let rest = text;
  while (rest.length > perLine) {
    const dash = rest.lastIndexOf("-", perLine - 1);
    const at = dash >= perLine / 2 ? dash + 1 : perLine;
    lines.push(rest.slice(0, at));
    rest = rest.slice(at);
  }
  lines.push(rest);
  return lines;
}

// The file name without extension, wrapped to the tile width. A name too long
// for the label drops its middle, keeping the number prefix and the ending.
export function labelLines(file: string, tileWidth: number): string[] {
  const name = path.basename(file).replace(IMAGE_EXTENSION, "");
  const perLine = Math.max(8, Math.floor((tileWidth - 12) / CHAR_WIDTH));
  const capacity = perLine * LABEL_LINES;
  const text =
    name.length <= capacity
      ? name
      : `${name.slice(0, Math.ceil((capacity - 1) / 2))}…${name.slice(-Math.floor((capacity - 1) / 2))}`;
  const lines = wrap(text, perLine);
  if (lines.length <= LABEL_LINES) return lines;
  return [text.slice(0, perLine), text.slice(perLine, capacity)];
}

const NATURAL = new Intl.Collator("en", { numeric: true });

export function sheetName(stem: string, index: number): string {
  return `${stem}-${String(index + 1).padStart(2, "0")}.png`;
}

// Every file named `sheet-…-NN.png` is a sheet this tool wrote; it is never
// tiled again.
const SHEET_FILE = /^sheet(-.*)?-\d{2}\.png$/;

function isSheetOf(file: string, stem: string): boolean {
  const dir = path.dirname(stem);
  return (
    path.dirname(file) === dir &&
    new RegExp(`^${escapeRegExp(path.basename(stem))}-\\d{2}\\.png$`).test(
      path.basename(file),
    )
  );
}

function escapeRegExp(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A directory (its images), a file, or a pattern whose `*` and `?` are in the
// last path part (`.shots/x/*-ipad*.png`). Result in natural file-name order
// (`2-a` before `10-a`), without sheets this tool wrote (`sheet-*-NN.png`, or `stem`'s own).
export function listImages(inputs: readonly string[], stem?: string): string[] {
  const files = new Set<string>();
  for (const input of inputs) {
    if (/[*?]/.test(path.basename(input))) {
      const dir = path.dirname(input);
      const pattern = new RegExp(
        `^${escapeRegExp(path.basename(input)).replaceAll("\\*", ".*").replaceAll("\\?", ".")}$`,
      );
      for (const name of readdirSync(dir)) {
        if (pattern.test(name)) files.add(path.join(dir, name));
      }
    } else if (existsSync(input) && statSync(input).isDirectory()) {
      for (const name of readdirSync(input)) files.add(path.join(input, name));
    } else if (existsSync(input)) {
      files.add(input);
    } else {
      throw new Error(`No such file or directory: ${input}`);
    }
  }
  return [...files]
    .filter((file) => IMAGE_EXTENSION.test(file))
    .filter((file) => !SHEET_FILE.test(path.basename(file)))
    .filter((file) => !stem || !isSheetOf(file, path.resolve(stem)))
    .sort((a, b) => NATURAL.compare(path.basename(a), path.basename(b)));
}

async function probe(file: string): Promise<SheetImage> {
  const { stdout } = await run("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "csv=p=0",
    file,
  ]);
  const [width, height] = stdout.trim().split(",").map(Number);
  if (!width || !height) throw new Error(`Cannot read the size of ${file}`);
  return { file, width, height };
}

async function probeAll(files: readonly string[]): Promise<SheetImage[]> {
  const images: SheetImage[] = [];
  for (let i = 0; i < files.length; i += INFO_PROBE_CHUNK) {
    images.push(
      ...(await Promise.all(files.slice(i, i + INFO_PROBE_CHUNK).map(probe))),
    );
  }
  return images;
}

export function ffmpegAvailable(): boolean {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    execFileSync("ffprobe", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function findFont(): string {
  const font = FONT_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!font) throw new Error("No font found for the tile labels");
  return font;
}

const escapeFilterPath = (file: string) => file.replaceAll(/[\\:']/g, "\\$&");

// Writes one filter script: every tile is scaled to fit, centred on a
// letterbox, labelled, then stacked at its planned place.
function filterScript(
  sheet: Sheet,
  plan: SheetPlan,
  font: string,
  workDir: string,
): string {
  const { tileWidth, tileHeight } = plan;
  const cellHeight = LABEL_HEIGHT + tileHeight;
  const chains = sheet.tiles.map((tile, i) => {
    const draws = labelLines(tile.file, tileWidth).map((line, n) => {
      const textFile = path.join(workDir, `label-${i}-${n}.txt`);
      writeFileSync(textFile, line);
      return `drawtext=fontfile='${escapeFilterPath(font)}':textfile='${escapeFilterPath(textFile)}':expansion=none:fontsize=${FONT_SIZE}:fontcolor=white:x=6:y=${4 + n * (FONT_SIZE + 3)}`;
    });
    return [
      `[${i}:v]format=rgb24`,
      `scale=${tileWidth}:${tileHeight}:force_original_aspect_ratio=decrease:flags=lanczos`,
      `pad=${tileWidth}:${cellHeight}:(ow-iw)/2:${LABEL_HEIGHT}+(${tileHeight}-ih)/2:color=${LETTERBOX}`,
      ...draws,
    ].join(",");
  });
  const labelled = sheet.tiles.map((_, i) => `[t${i}]`).join("");
  const layout = sheet.tiles.map((t) => `${t.x}_${t.y}`).join("|");
  const [only] = sheet.tiles;
  // xstack needs two inputs; a lone tile is placed with pad.
  const stack =
    sheet.tiles.length === 1 && only
      ? `[t0]pad=${sheet.width}:${sheet.height}:${only.x}:${only.y}:color=${BACKGROUND}[sheet]`
      : `${labelled}xstack=inputs=${sheet.tiles.length}:layout=${layout}:fill=${BACKGROUND},pad=${sheet.width}:${sheet.height}:0:0:color=${BACKGROUND}[sheet]`;
  const script = [...chains.map((chain, i) => `${chain}[t${i}]`), stack].join(
    ";\n",
  );
  const scriptFile = path.join(workDir, "filter.txt");
  writeFileSync(scriptFile, script);
  return scriptFile;
}

async function renderSheet(
  sheet: Sheet,
  plan: SheetPlan,
  outFile: string,
  font: string,
) {
  const workDir = mkdtempSync(path.join(os.tmpdir(), "sheet-"));
  try {
    const script = filterScript(sheet, plan, font, workDir);
    await run("ffmpeg", [
      "-v",
      "error",
      "-y",
      ...sheet.tiles.flatMap((tile) => ["-i", tile.file]),
      "-/filter_complex",
      script,
      "-map",
      "[sheet]",
      "-frames:v",
      "1",
      outFile,
    ]);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

// Tiles `files` into `<stem>-01.png`, `<stem>-02.png`, … and returns those
// paths. Sheets left from an earlier run with the same stem are removed.
export async function writeSheets(
  files: readonly string[],
  stem: string,
  options: SheetOptions = DEFAULT_SHEET_OPTIONS,
): Promise<string[]> {
  const dir = path.dirname(stem);
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    if (isSheetOf(path.join(dir, name), path.resolve(stem))) {
      rmSync(path.join(dir, name));
    }
  }
  const plan = planSheets(await probeAll(files), options);
  const font = findFont();
  const written: string[] = [];
  for (const [i, sheet] of plan.sheets.entries()) {
    const out = sheetName(stem, i);
    await renderSheet(sheet, plan, out, font);
    written.push(out);
  }
  return written;
}

// `writeSheets` for the screenshot scripts: prints the sheet paths, and when
// sheets cannot be made says so instead of failing the run that took the shots.
export async function reportSheets(
  files: readonly string[],
  stem: string,
): Promise<void> {
  if (files.length === 0) return;
  if (!ffmpegAvailable()) {
    console.warn("sheets skipped: ffmpeg and ffprobe are not on PATH");
    return;
  }
  try {
    for (const sheet of await writeSheets(files, stem)) {
      console.log(`sheet ${path.relative(process.cwd(), sheet)}`);
    }
  } catch (error) {
    console.warn(`sheets skipped: ${(error as Error).message.split("\n")[0]}`);
  }
}
