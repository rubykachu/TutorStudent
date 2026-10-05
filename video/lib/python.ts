import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { HF_HOME, PYTHON_BIN } from "../config";

// Runs the pipeline's Python workers in their arm64 venv (PYTHON_BIN, or
// another venv such as OMNI_PYTHON_BIN): the job goes in as JSON on stdin,
// each result comes back as one JSON line on stdout. The workers' own
// logging (model loading, progress bars) is kept out of the way and printed
// only if the worker fails.
function spawnWorker(
  script: string,
  python: string,
): ChildProcessWithoutNullStreams {
  if (!existsSync(python)) {
    throw new Error(
      `No pipeline Python at ${python}; set it up as in video/requirements.txt (VieNeu, Whisper) or with \`pnpm video:setup-omni\` (OmniVoice)`,
    );
  }
  return spawn(python, [script], {
    env: {
      ...process.env,
      HF_HOME,
      HF_HUB_OFFLINE: "1",
      TOKENIZERS_PARALLELISM: "false",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function collectStderr(child: ChildProcessWithoutNullStreams): () => string {
  let stderr = "";
  child.stderr.on("data", (chunk: Buffer) => {
    stderr = (stderr + chunk.toString()).slice(-4000);
  });
  return () => stderr;
}

// One job, one process: the worker reads the whole job and exits.
export async function runPython<T>(
  script: string,
  job: unknown,
  python: string = PYTHON_BIN,
): Promise<T[]> {
  const child = spawnWorker(script, python);
  const stderr = collectStderr(child);
  let stdout = "";
  child.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString();
  });
  child.stdin.end(JSON.stringify(job));
  const code = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  if (code !== 0) {
    throw new Error(`${script} exited with ${code}:\n${stderr()}`);
  }
  return stdout
    .split("\n")
    .filter((line) => line.startsWith("{"))
    .map((line) => JSON.parse(line) as T);
}

export type PythonWorker = {
  // Sends one job; resolves with its result lines once the worker prints
  // {"done": true}.
  run<T>(job: unknown): Promise<T[]>;
  // Closes stdin, so the worker exits, and waits for it.
  close(): Promise<void>;
};

// A worker that stays up across jobs, one JSON job per stdin line, so a model
// that is slow to load loads once per build. Jobs run one at a time.
export function startPythonWorker(
  script: string,
  python: string,
): PythonWorker {
  const child = spawnWorker(script, python);
  const stderr = collectStderr(child);
  const exited = new Promise<number | null>((resolve) => {
    child.on("error", () => resolve(null));
    child.on("close", resolve);
  });
  const lines = createInterface({ input: child.stdout })[
    Symbol.asyncIterator
  ]();
  return {
    async run<T>(job: unknown) {
      child.stdin.write(`${JSON.stringify(job)}\n`);
      const results: T[] = [];
      for (;;) {
        const next = await lines.next();
        if (next.done) {
          throw new Error(
            `${script} exited with ${await exited}:\n${stderr()}`,
          );
        }
        if (!next.value.startsWith("{")) continue;
        const parsed = JSON.parse(next.value) as T & { done?: true };
        if (parsed.done === true) return results;
        results.push(parsed);
      }
    },
    async close() {
      child.stdin.end();
      await exited;
    },
  };
}
