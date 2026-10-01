# Architecture map

Read this first in a new session. Product rules and content model: `docs/spec.md`; UI tokens: `docs/design-system.md`; the learner every lesson is written for: `docs/learner.md`; working rules for agents: `.claude/rules/`. Commands: `README.md`.

## Data flow

```
content/**/lesson.json  (+ subjects.json, glossary/, ids.lock.json)
   | pnpm content:check   zod schema + lint (src/content/lint) + ids + review-hash gate
   | pnpm content:emit    only published lessons (CONTENT_INCLUDE_DRAFT=1 adds drafts,
   v                      CONTENT_INCLUDE_FIXTURE=1 the test lesson)
public/content/index.json + <lessonId>.json   (gitignored, rebuilt by dev and build)
   | fetched by the client
   v
src/app (child screens) -> src/learn players -> src/exercises -> src/progress (Dexie)
```

`pnpm build` runs `content:check` then a production `content:emit` then `next build`; `pnpm dev` runs `content:emit` first. Schemas in `src/schema/content.ts` are the single source for types, `content:check` and generator prompts. Per-subject settings (colour, icon, language `vi|en`, rule flags) live only in `content/subjects.json`.

## App modules (`src/`)

- `app/(child)/` home, subjects, lessons, profiles; `app/parent/` PIN-gated report; `app/dev/` galleries of visuals, exercises and mascot.
- `schema/` zod schemas. `content/` loader, index, `check.ts`, `stats.ts`, `lint/` rules.
- `exercises/` the eight basic exercise types (`choice`, `numeric`, `fill-blank`, `match`, `order`, `tap-region`, `tap-text`, `manipulate`) and `open-ended` (a sequence of steps), `grade/`, 3-level hints, feedback.
- `visuals/` `registry.ts` maps `visualId` to a component with `interactive`, `regions` and validators; shared primitives in `shared/`; lesson visuals in `<subject>/<lesson>/`.
- `learn/` section player, review player, overview, next-step logic. `srs/` FSRS scheduling and review selection.
- `progress/` Dexie store (IndexedDB, per browser), streak, parent report and PIN. `mascot/` owl and its lines. `music/` the music box: song list and unlock rule (`songs.ts`), player hook, sheet, chip and reward card. `lib/` config, shared sounds (`sound.ts`, `sound-manifest.ts`), media URLs, formatting.
- `components/` shared UI; `subject-style.ts` maps a subject's colour token and icon name to classes and components.

## Automated checks and where they live

| Check | Run | Guards |
|---|---|---|
| Content lint | `pnpm content:check` (`src/content/lint/*.ts`) | Findings end in `[rule]` and `(lessons-learned LL-nn)`; ids and the rule-to-entry table are in `docs/lessons-learned/index.md` |
| Size and variety | `content:check --stats` | lesson minimums from `docs/spec.md` |
| Layout walk | `pnpm lesson:walk <lesson>` | visits every screen on 3 devices, reports overlapping or clipped text; `e2e/overlap.ts` holds the overlap test, `tests/overlap.test.ts` proves it; writes a contact sheet series per device next to its shots |
| Visual shots | `pnpm visual:shot <lesson>` | every visual and hint at each device into `.shots/`, plus a contact sheet series per device |
| Contact sheets | `pnpm shots:sheet <dir\|file\|pattern>… [--cols N] [--out <stem>]` (`scripts/lib/contact-sheet.ts`, `tests/scripts/contact-sheet.test.ts`) | tiles screenshots or video frames into `<stem>-NN.png` sheets (ffmpeg), file name on each tile, split to keep each sheet near 1600px; reviewers read sheets, not single files |
| Silent browsers | `e2e/silence.ts`, used by `e2e/test.ts`, `lesson:walk`, `visual:shot` | every media element is really muted with volume 0 on first play, while `muted` still reads back what the app set |
| Video | `pnpm video:check`, `tests/video/voices.test.ts` | subtitles contain every scripted sentence; on-screen rule text equals the lesson's rule sentence; the first sentence is the flagged opening line and captions start after the lead-in; one known voice per lesson |
| Shared sounds | `tests/lib/sound-manifest.test.ts` | `public/sounds/manifest.json` hashes match the tones, voice lines and imported source files in `assets/sounds/` |
| Unit, component | `pnpm test` (Vitest; `tests/` mirrors `src/`) | coverage thresholds in `vitest.config.ts` |
| E2E | `pnpm test:e2e` (`e2e/`) | `ipad` and `phone` targets in `e2e/targets.ts` |
| Gate | `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check` | run before every commit |

Adding a lint rule: create `src/content/lint/<rule>.ts`, register it in `lint/index.ts` and `LintRule`, point its message at a lessons-learned id (`learned()` in `lint/types.ts`), add the rule to the index table. Text fields the walker does not know fail `[fields]` until classified in `lint/walk.ts`.

## Media pipeline

- `video/`: `pnpm video:build <lesson> <name>` reads `video/projects/<lesson>/<name>/script.json` and `index.html` (HyperFrames), narrates each sentence (local VieNeu voice, checked against Whisper, slowed), lays karaoke subtitles, renders H.264, writes `public/media/video/<lesson>/` and `videos[]` in `lesson.json`. `pnpm narration:build <lesson>` does the same for the lesson overview into `public/media/narration/`, but reads it with Gemini TTS: the whole overview in one request, cut into sentences at the pauses of Whisper's word times, each sentence still checked against the text (re-spoken one by one, same voice, when it fails).
- One voice per lesson: `video/projects/<lesson>/media.json` names it. `video/voices.ts` is the single catalog: each lesson voice maps to a `video` voice (local VieNeu preset) and a `narration` voice (Gemini preset of the same gender, from `GEMINI_NARRATORS`, one line per gender). Videos use the first, the overview narration the second; `script.json` has no voice. A narration or a video is read by one engine from start to end: if every Gemini key is out of quota, `narration:build` discards the Gemini sentences and reads the whole narration with the `video` voice, warns, and records the voice that read it in `overview.narration.voice` (`video:check` accepts only the lesson's two voices).
- Gemini keys: every `~/.config/gemini/api_key*` file (or `GEMINI_API_KEY`), used in turn per request by the one client `video/tts/gemini.ts` (also used by `pnpm sounds:build`); a rate-limited key rests while the others serve. Keys are never in the repo. Rules for choosing it and for the opening line of each video: skill `lesson-video`.
- TTS and Whisper run in the arm64 Python env `video/.venv` with models in `video/.hf` (setup: `video/requirements.txt`; paths in `video/config.ts`).
- Caches: sentence takes in `video/projects/**/audio/` and `video/.cache/`, intermediates in `renders/`; none is in git. `pnpm clean` removes the regenerable parts.
- `public/media/` (video, narration) is gitignored and uploaded to the media bucket at go-live (`NEXT_PUBLIC_MEDIA_BASE_URL` switches the client to it). `public/sounds/` (shared app sounds, `pnpm sounds:build`) is committed; clips imported from other files (`file` entries: wrong answer, finish, leaving, music box songs) are made from `assets/sounds/`, also committed.

## Content authoring pipeline

`import-source` (PDF pages to `sources/`) then `lesson-author` (lesson.json; calls `lesson-visual` for figures, runs `lesson:walk`) then `lesson-review` (fresh subagent; writes `review.md`, sets `reviewedHash`, publishes) then `lesson-author` again for `lesson-video` and narration. Skills live in `.claude/skills/`; which model runs each step is in `.claude/rules/agents.md`. Recurring review errors go to `docs/lessons-learned/`, which author and reviewer read first.

## Conventions

Kept in `.claude/rules/` so each is stated once: `content.md` (ids, rule and guide markers, review hash, textbook copying), `video.md` (verbatim quotes, caches, shared sounds), `agents.md` (model choice, handovers, external writes, commit hygiene).

## Where state lives

- `notebooks/backlogs/index.md`: lesson status table, ordered queue, open follow-ups; each item links to its backlog folder. `notebooks/backlogs/<name>/{spec,plan,task}.md`: planning docs of one feature, bug or lesson (only the files it needs); for a lesson, `task.md` is the handover while in progress and the non-blocking leftovers after publishing. `notebooks/backlogs/archive/`: finished backlog folders.
- `docs/learner.md`: the learner profile. `content/ids.lock.json`: published ids. Child progress: IndexedDB in the browser only.
- Secrets: none in the repo; `.env*` is gitignored, `.env.example` documents names.
