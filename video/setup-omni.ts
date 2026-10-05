import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import {
  HF_HOME,
  OMNI_PYTHON_BIN,
  OMNIVOICE_MODEL,
  OMNIVOICE_REVISION,
  VIDEO_DIR,
} from "./config";

// Usage: pnpm video:setup-omni
// Creates the OmniVoice environment (video/.venv-omni) from the arm64 Python
// in video/.python with the pinned packages of video/requirements-omni.txt,
// then downloads the pinned model revision into HF_HOME (about 3.3 GB, once;
// a model already there is not downloaded again). Safe to run again.

const pythonDir = path.join(VIDEO_DIR, ".python");
const build = readdirSync(pythonDir).find((d) => d.startsWith("cpython-3.12"));
if (!build) {
  throw new Error(
    `No arm64 Python 3.12 in ${pythonDir}; install it first as in video/requirements.txt`,
  );
}
const venv = path.dirname(path.dirname(OMNI_PYTHON_BIN));
const run = (cmd: string, args: string[], env = process.env) =>
  execFileSync(cmd, args, { stdio: "inherit", env });

run("uv", [
  "venv",
  "--allow-existing",
  "--python",
  path.join(pythonDir, build, "bin", "python3"),
  venv,
]);
run("uv", [
  "pip",
  "install",
  "--python",
  OMNI_PYTHON_BIN,
  "-r",
  path.join(VIDEO_DIR, "requirements-omni.txt"),
]);
run(
  OMNI_PYTHON_BIN,
  [
    "-c",
    "import sys; from huggingface_hub import snapshot_download; print(snapshot_download(sys.argv[1], revision=sys.argv[2]))",
    OMNIVOICE_MODEL,
    OMNIVOICE_REVISION,
  ],
  { ...process.env, HF_HOME },
);
console.log(`video: OmniVoice ready in ${path.relative(process.cwd(), venv)}`);
