@AGENTS.md

# Tutor

Self-study app for a Vietnamese grade 6 child (Next.js PWA, iPad first). Read `docs/architecture.md` first: data flow, modules, automated checks, media and authoring pipelines.

- Product and engineering spec: `docs/spec.md`. UI tokens: `docs/design-system.md`. Commands and setup: `README.md`.
- Work queue, lesson status, handovers: `backlogs/milestones.md`. The one active plan, if any: `tasks/`.
- The learner every lesson is written for: `docs/learner.md`. Recurring content errors: `docs/lessons-learned/index.md`.
- Skills: `.claude/skills/` (`import-source`, `lesson-author`, `lesson-visual`, `lesson-review`, `lesson-video`).
- Rules, loaded from `.claude/rules/`: `agents.md` (always), `content.md` (content, schema, lint, visuals), `video.md` (video, media, sounds).
