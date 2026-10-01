import { readFileSync } from "node:fs";
import path from "node:path";
import { headThroughPublicUrl, runMediaUpload } from "./lib/media-upload";
import { ENV_FILE } from "./lib/release-config";
import { exec, parseEnvFile } from "./lib/run";

// Usage: media:upload <lesson>... | --all  [--dry-run]
// Uploads the lessons' files under public/media/ to the R2 bucket (names and
// Content-Types in scripts/lib/release-config.ts). Files whose MD5 already
// matches the object served at NEXT_PUBLIC_MEDIA_BASE_URL are skipped. This
// writes outside the machine: run it only when the owner approved the release.
const root = process.cwd();
let baseUrl: string | undefined;
try {
  baseUrl = parseEnvFile(
    readFileSync(path.join(root, ENV_FILE), "utf8"),
  ).NEXT_PUBLIC_MEDIA_BASE_URL;
} catch {
  baseUrl = undefined;
}

process.exitCode = await runMediaUpload(process.argv.slice(2), {
  root,
  exec,
  head: baseUrl ? headThroughPublicUrl(baseUrl) : undefined,
  log: console.log,
});
