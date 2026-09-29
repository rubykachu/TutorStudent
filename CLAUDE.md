@AGENTS.md

Self-study app for a Vietnamese grade 6 child (Next.js PWA, iPad first). Product and engineering spec: `docs/spec.md`; UI tokens and rules: `docs/design-system.md`; current work: `tasks/plan.md`, `tasks/todo.md`, `backlogs/`.

## Map

- `content/<subject>/<series>/<slug>/lesson.json` — authored lessons (plus `review.md`, `source-passage.txt` for literature). `content/ids.lock.json` locks published ids; `content/glossary/` holds standard terms and concept colours; `content/_fixture/` is the test lesson.
- `sources/<subject>/<slug>/p<page>.png` — textbook scans, gitignored.
- `src/schema/content.ts` — zod schemas, the single source for content types, `content:check` and generator prompts.
- `src/content/` — loader and the automated content lint (`lint/`).
- `src/exercises/` — the eight exercise types, grading and 3-level hints. `src/learn/` — section and review players. `src/srs/` — FSRS memory estimates. `src/progress/` — Dexie progress, streak.
- `src/visuals/registry.ts` — `visualId` → component, with `interactive`, `regions`, validators; primitives in `src/visuals/shared/`, lesson visuals in `src/visuals/<subject>/<slug>/`.
- `src/app/(child)/` — child screens; `src/app/dev/` — visual, exercise and mascot galleries.
- `tests/` mirrors `src/`; `e2e/` runs on the `ipad` and `phone` targets in `e2e/targets.ts`.

## Commands

```bash
pnpm dev                          # content:emit, then dev server on :3000
pnpm lint && pnpm typecheck && pnpm test   # gate before every commit
pnpm test:e2e                     # Playwright, ipad + phone
pnpm content:check [--stats] [--root <dir>]
pnpm content:lock                 # add new lesson ids to ids.lock.json
pnpm content:hash <lesson> [--approve]     # review hash; --approve publishes
pnpm visual:shot <lesson|all|mascot>       # screenshots into .shots/<lesson>/
pnpm lesson:walk <lesson>         # walk every section on 3 screens; .shots/walk/<lesson>/
CONTENT_INCLUDE_DRAFT=1 pnpm dev  # also serve draft lessons (never in a build)
```

## Skills (`.claude/skills/`)

- `lesson-author` — new lesson from `sources/` to published `lesson.json`, or content edits to an existing one.
- `lesson-visual` — build, register and screenshot a lesson's visuals.
- `lesson-review` — independent review before publishing; always in a fresh subagent, never by the session that wrote the lesson.

## Boundaries

- Ask before any write outside this machine: `git push`, deploys, R2 writes, external APIs.
- Never commit `sources/`, `.env*` or secrets. Never copy textbook text or pictures, except literature reading passages with their source.
- Published ids never change; retire them in `content/ids.lock.json`.
- Commit only your own paths when other agents share the tree; never `git add -A`.
