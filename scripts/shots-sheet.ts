import path from "node:path";
import {
  DEFAULT_SHEET_OPTIONS,
  ffmpegAvailable,
  listImages,
  writeSheets,
} from "./lib/contact-sheet";

// Usage: shots-sheet <dir|file|pattern>... [--cols N] [--out <stem>]
//   [--width PX] [--height PX]
// Tiles screenshots into contact sheets `<stem>-01.png`, `-02.png`, …, each
// tile labelled with its file name, so one image read shows many shots.
// Default stem: `sheet` inside the first input's directory.

function usage(): never {
  console.error(
    "Usage: pnpm shots:sheet <dir|file|pattern>... [--cols N] [--out <stem>] [--width PX] [--height PX]",
  );
  process.exit(2);
}

function numberFlag(value: string | undefined, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    console.error(`${name} needs a whole number of at least 1`);
    process.exit(2);
  }
  return n;
}

async function main() {
  const inputs: string[] = [];
  let out: string | undefined;
  const options = { ...DEFAULT_SHEET_OPTIONS };
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    if (arg === "--cols") options.cols = numberFlag(args[++i], arg);
    else if (arg === "--width") options.maxWidth = numberFlag(args[++i], arg);
    else if (arg === "--height") options.maxHeight = numberFlag(args[++i], arg);
    else if (arg === "--out") out = args[++i];
    else if (arg.startsWith("--") || arg === "-h") usage();
    else inputs.push(arg);
  }
  if (inputs.length === 0 || (args.includes("--out") && !out)) usage();
  if (!ffmpegAvailable()) {
    console.error("ffmpeg and ffprobe are needed on PATH");
    process.exit(2);
  }
  const first = inputs[0] as string;
  const defaultDir = /[*?]/.test(path.basename(first))
    ? path.dirname(first)
    : path.extname(first)
      ? path.dirname(first)
      : first;
  const stem = out
    ? out.replace(/\.png$/i, "")
    : path.join(defaultDir, "sheet");
  const files = listImages(inputs, stem);
  if (files.length === 0) {
    console.error("No images found");
    process.exit(1);
  }
  const sheets = await writeSheets(files, stem, options);
  console.log(`${files.length} images in ${sheets.length} sheets`);
  for (const sheet of sheets) console.log(path.relative(process.cwd(), sheet));
}

await main();
