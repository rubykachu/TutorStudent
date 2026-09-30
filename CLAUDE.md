@AGENTS.md

Self-study app for a Vietnamese grade 6 child (Next.js PWA, iPad first). Product and engineering spec: `docs/spec.md`; UI tokens and rules: `docs/design-system.md`; current work: `tasks/plan.md`, `tasks/todo.md`, `backlogs/`.

## Map

- `content/<subject>/<series>/<slug>/lesson.json` — authored lessons (plus `review.md`, `source-passage.txt` for literature). `content/ids.lock.json` locks published ids; `content/glossary/` holds standard terms and concept colours; `content/_fixture/` is the test lesson.
- `sources/<subject>/<slug>/p<page>.png` — textbook scans (primary source; `sbt-p<page>.png` for workbook pages), plus `p<page>.txt` from the PDF text layer when present (auxiliary); gitignored.
- `src/schema/content.ts` — zod schemas, the single source for content types, `content:check` and generator prompts.
- `src/content/` — loader and the automated content lint (`lint/`).
- `src/exercises/` — the eight exercise types, grading and 3-level hints. `src/learn/` — section and review players. `src/srs/` — FSRS memory estimates. `src/progress/` — Dexie progress, streak.
- `src/visuals/registry.ts` — `visualId` → component, with `interactive`, `regions`, validators; primitives in `src/visuals/shared/`, lesson visuals in `src/visuals/<subject>/<slug>/`.
- `src/app/(child)/` — child screens; `src/app/dev/` — visual, exercise and mascot galleries.
- `docs/learner.md` — the learner profile every lesson is written for.
- `docs/lessons-learned/` — recurring content errors from review history (index, counts, how each is prevented); `lesson-author` and `lesson-review` read `index.md` first and add or bump entries.
- `tests/` mirrors `src/`; `e2e/` runs on the `ipad` and `phone` targets in `e2e/targets.ts`.

## Commands

```bash
pnpm dev                          # content:emit, then dev server on :3000
pnpm format && pnpm lint && pnpm typecheck && pnpm test   # gate before every commit
pnpm test:e2e                     # Playwright, ipad + phone
pnpm content:check [--stats] [--root <dir>]
pnpm content:lock                 # add new lesson ids to ids.lock.json
pnpm content:hash <lesson> [--mark|--approve]  # review hash; --mark records it in review.md, --approve also publishes
pnpm content:diff <lesson>        # what changed since the last reviewed version
pnpm visual:shot <lesson|all|mascot>       # screenshots into .shots/<lesson>/
pnpm lesson:walk <lesson>         # walk every section on 3 screens in parallel; .shots/walk/<lesson>/
pnpm sources:import <pdf> --pages X-Y --subject <id> --series <id> --slug <slug> [--book sgk|sbt] [--offset <n>] [--force]  # PDF pages → sources/ PNG (+ text layer .txt); needs poppler
pnpm video:build <lesson> <name>  # lesson video → public/media/video/, videos[] in lesson.json
CONTENT_INCLUDE_DRAFT=1 pnpm dev  # also serve draft lessons (never in a build)
```

## Skills (`.claude/skills/`)

- `import-source` — owner-only (`/import-source <free text>`): reads `docs/learner.md`, asks only what is missing, confirms a plan, runs `sources:import`, hands off to `lesson-author`. Its `references/intake.md` is the one intake checklist.
- `lesson-author` — sources to published `lesson.json` (several lessons in parallel worktrees), then video and narration; also content edits to an existing lesson.
- `lesson-visual` — build, register and screenshot a lesson's visuals.
- `lesson-video` — lesson videos with local TTS narration, attached to `lesson.json`.
- `lesson-review` — independent review before publishing; always in a fresh subagent, never by the session that wrote the lesson.
- Models: authoring (`import-source`, `lesson-author`, `lesson-visual`, `lesson-video`, and their helper subagents) = Sonnet; review = Opus for full rounds 1–2, Sonnet from round 3 (diff-only rounds, video/narration reviews); set per spawn via the Agent `model` parameter.

## Boundaries

- Ask before any write outside this machine: `git push`, deploys, R2 writes, external APIs.
- Never commit `sources/`, `.env*` or secrets. Never copy textbook text or pictures, except literature reading passages with their source.
- Published ids never change; retire them in `content/ids.lock.json`.
- Commit only your own paths when other agents share the tree; never `git add -A`.
