---
description: How agents work on this repo (always loaded)
---

# Working rules for agents

- Gate before every commit: `pnpm format && pnpm lint && pnpm typecheck && pnpm test`, plus `pnpm content:check` when content or schema changed. Small commits; never push.
- Commit only your own paths when other agents share the tree; never `git add -A` then.
- Ask before any write outside this machine: `git push`, deploys, R2 writes, external APIs. Never commit `.env*` or secrets.
- Production deploy (`pnpm deploy:prod`) and R2 uploads (`pnpm media:upload`) are external writes: run them only when the owner asks or approves for that release, then follow `docs/operations.md` "Đưa bài mới lên production" (media first, deploy second).
- Never kill processes by pattern (`pkill`, `killall`, `kill $(pgrep ...)`): another agent's server or build can match. Stop only PIDs you started yourself (keep the PID from the start command), and never the owner's dev server.
- Do not stop or restart the owner's dev server. After `pnpm build`, run `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` so it keeps serving drafts.
- Lesson work runs one subagent at a time, started from `notebooks/backlogs/lesson-<slug>/task.md` (the handover); archive the folder once the lesson is merged and its leftovers are done. A lesson's review always runs in a fresh subagent, never in the session that wrote it.
- Models: authoring (`import-source`, `lesson-author`, `lesson-visual`, `lesson-video` and their helpers) uses Sonnet; review uses Opus for full rounds 1 and 2, Sonnet from round 3 (diff-only rounds, video and narration reviews). Set it per spawn with the Agent `model` parameter.

## Planning docs

- Any planning work, including agent-skills commands and skills (`/spec`, `/plan`, `/build`, `spec-driven-development`, `planning-and-task-breakdown`) whose defaults write `SPEC.md`, `tasks/plan.md` or `tasks/todo.md`, writes to `notebooks/backlogs/<backlog_name>/spec.md`, `plan.md` and `task.md` instead (only the files the backlog needs). `<backlog_name>` is kebab-case, one per feature, bug or lesson (`lesson-<slug>` for a lesson). Never create `tasks/`, `backlogs/` or `SPEC.md` at the repo root.
- Link each backlog from `notebooks/backlogs/index.md` (lesson status table and ordered queue) and update it when work finishes.
- When the work is done, move the folder to `notebooks/backlogs/archive/<backlog_name>/` with `git mv` and add a one-line "Archived: ..." header to its first file. A lesson's handover (`task.md`) follows the same rule: archive, do not delete.
