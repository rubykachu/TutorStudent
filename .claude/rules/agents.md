---
description: How agents work on this repo (always loaded)
---

# Working rules for agents

- Gate before every commit: `pnpm format && pnpm lint && pnpm typecheck && pnpm test`, plus `pnpm content:check` when content or schema changed. Small commits; never push.
- Commit only your own paths when other agents share the tree; never `git add -A` then.
- Ask before any write outside this machine: `git push`, deploys, R2 writes, external APIs. Never commit `.env*` or secrets.
- Do not stop or restart the owner's dev server. After `pnpm build`, run `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` so it keeps serving drafts.
- Lesson work runs one subagent at a time, started from `backlogs/handover-<lesson>.md`; delete the handover once the lesson is merged. A lesson's review always runs in a fresh subagent, never in the session that wrote it.
- Models: authoring (`import-source`, `lesson-author`, `lesson-visual`, `lesson-video` and their helpers) uses Sonnet; review uses Opus for full rounds 1 and 2, Sonnet from round 3 (diff-only rounds, video and narration reviews). Set it per spawn with the Agent `model` parameter.
- Queue and status live in `backlogs/milestones.md`; update it when work finishes.
