import { type ChildProcess, spawn } from "node:child_process";
import {
  TEST_BASE_URL,
  TEST_SERVER_COMMAND,
  TEST_SERVER_ENV,
} from "../../e2e/targets";

// The dev server the screenshot scripts drive: reused when one already
// answers on the test port (e.g. from an E2E run), otherwise started and
// stopped by the script.

const SERVER_START_TIMEOUT_MS = 120_000;
// Output lines kept from a started server, printed when it fails to start
// (e.g. Turbopack refusing a node_modules symlink outside the project).
const SERVER_LOG_TAIL_LINES = 40;

export async function isServing(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

// Last `limit` lines written to the stream, stdout and stderr interleaved.
function tailLines(server: ChildProcess, limit: number): () => string {
  const lines: string[] = [];
  let partial = "";
  const collect = (chunk: Buffer) => {
    const parts = (partial + chunk.toString("utf8")).split("\n");
    partial = parts.pop() ?? "";
    lines.push(...parts);
    lines.splice(0, Math.max(0, lines.length - limit));
  };
  server.stdout?.on("data", collect);
  server.stderr?.on("data", collect);
  return () => [...lines, partial].filter(Boolean).slice(-limit).join("\n");
}

// Returns the started server so it can be stopped afterwards, or undefined
// when a server was already running. `env` adds to TEST_SERVER_ENV.
export async function ensureServer(
  probePath: string,
  env: Record<string, string> = {},
): Promise<ChildProcess | undefined> {
  const probe = `${TEST_BASE_URL}${probePath}`;
  if (await isServing(probe)) return undefined;
  const server = spawn(TEST_SERVER_COMMAND, {
    shell: true,
    // Own process group, so stopping it also stops the processes Next forks.
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...TEST_SERVER_ENV, ...env },
  });
  const log = tailLines(server, SERVER_LOG_TAIL_LINES);
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isServing(probe)) {
      // Stop reading once it serves, so a long run keeps no log in memory;
      // resume() keeps the pipes drained so the server never blocks on them.
      server.stdout?.removeAllListeners("data").resume();
      server.stderr?.removeAllListeners("data").resume();
      return server;
    }
    if (server.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  stopServer(server);
  const output = log();
  throw new Error(
    `Dev server did not start: ${TEST_SERVER_COMMAND}\n${output ? `--- last server output ---\n${output}` : "(no server output)"}`,
  );
}

export function stopServer(server: ChildProcess | undefined) {
  if (server?.pid === undefined || server.exitCode !== null) return;
  process.kill(-server.pid, "SIGTERM");
}
