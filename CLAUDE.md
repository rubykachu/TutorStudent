@AGENTS.md

# Tutor

Self-study app for a Vietnamese grade 6 child (Next.js PWA, iPad first). Read `docs/architecture.md` first: data flow, modules, automated checks, media and authoring pipelines.

- Product and engineering spec: `docs/spec.md`. UI tokens: `docs/design-system.md`. Commands and setup: `README.md`.
- Work queue, lesson status, planning docs: `notebooks/backlogs/index.md`; each backlog is a folder `notebooks/backlogs/<name>/{spec,plan,task}.md` (rule in `.claude/rules/agents.md`).
- The learner every lesson is written for: `docs/learner.md`. Recurring content errors: `docs/lessons-learned/index.md`.
- Skills: `.claude/skills/` (`import-source`, `lesson-author`, `lesson-visual`, `lesson-review`, `lesson-video`, `feedback-triage`: turn the app's "Góp ý" issues into fixes).
- Rules, loaded from `.claude/rules/`: `agents.md` (always), `content.md` (content, schema, lint, visuals), `video.md` (video, media, sounds), `subagent-briefs.md` (always): what a subagent brief must state.
