import { runDeploy } from "./lib/deploy-prod";
import { exec } from "./lib/run";

// Usage: deploy:prod [--dry-run]
// Deploys the committed HEAD to Vercel production from a clean temporary git
// worktree (uncommitted work in this tree never ships), then runs the smoke
// checks. This writes outside the machine: run it only when the owner approved
// the release.
process.exitCode = await runDeploy(process.argv.slice(2), {
  root: process.cwd(),
  exec,
  fetch,
  log: console.log,
});
