import { runLab } from "./lib/offline-lab";
import { exec } from "./lib/run";

// Usage: offline-lab [--ref <commit>] [--port <n>] [--overlay <dir>]
//                    [--setup "<command>"]... [-- <command> [args]]
// Builds the committed ref (default HEAD) with `pnpm build` in a temporary git
// worktree under the lab environment (`OFFLINE_SERVER_ENV`), serves it with
// `next start` and, after `--`, runs the command against it with
// OFFLINE_LAB_URL set; without a command it serves until interrupted. The
// worktree and the server are removed when it ends. Nothing leaves this
// machine and the main tree is not touched.
process.exitCode = await runLab(process.argv.slice(2), {
  root: process.cwd(),
  exec,
  log: console.log,
});
