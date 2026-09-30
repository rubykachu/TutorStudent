import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { HF_HOME, PYTHON_BIN } from "../config";

// Runs one of the pipeline's Python workers in the arm64 venv: the job goes
// in as JSON on stdin, each result comes back as one JSON line on stdout.
// The workers' own logging (model loading, progress bars) is kept out of the
// way and printed only if the worker fails.
export async function runPython<T>(script: string, job: unknown): Promise<T[]> {
  if (!existsSync(PYTHON_BIN)) {
    throw new Error(
      `No pipeline Python at ${PYTHON_BIN}; set it up as in video/spikes/vieneu/requirements.txt or set VIDEO_PYTHON`,
    );
  }
  const child = spawn(PYTHON_BIN, [script], {
    env: {
      ...process.env,
      HF_HOME,
      HF_HUB_OFFLINE: "1",
      TOKENIZERS_PARALLELISM: "false",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  child.stdin.end(JSON.stringify(job));
  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  if (code !== 0) {
    throw new Error(`${script} exited with ${code}:\n${stderr.slice(-4000)}`);
  }
  return stdout
    .split("\n")
    .filter((line) => line.startsWith("{"))
    .map((line) => JSON.parse(line) as T);
}
