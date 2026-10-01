# Reset a lesson's progress ("Học lại bài này")

Owner request: let the child relearn an old lesson from scratch. A parent resets ONE lesson of ONE child profile from the parent page; nothing else changes.

## Decisions

- Erased for that lesson and child: section progress (done, in progress, paused position), FSRS card states, all attempts (including `skipped`), open-ended writings, the `overviewSeen:<lessonId>` setting. No history is kept.
- Kept: the lesson's sticker, other lessons, other profiles, activity days (streak), the profile and its other settings.
- Where: parent page only, per lesson row of "Tiến độ bài học", behind a two-step confirmation in the app's `Sheet` (destructive colour, no `confirm()`). Not on child screens; a lesson-page entry waits for a parent mode on the child side.
- One function `resetLessonProgress(db, childId scope, lessonId)` in `src/progress/reset.ts`, one Dexie transaction. Every table of the schema has a declared policy (erase, keep, unrelated) typed against the table names, so a new table fails typecheck and a test until classified.
- The sticker used to mean "lesson done" in `lessonState`, `subjectProgress`, `continueTarget` and `subjectStatus`. With the sticker kept, the lesson would still look finished after a reset, so those four read section records only. The sticker still colours fully where it is shown (shelf, lesson page).
- Sync hook: the function returns what it erased and when; the planned R2 sync must write a per-lesson reset marker from it, because the planned merge rules (union of attempts, highest section state wins) would otherwise bring the old progress back from another device. No sync code now.

## Progress

- [ ] `src/progress/reset.ts` and unit tests (`tests/progress/reset.test.ts`)
- [ ] sticker no longer implies "done" in `summary.ts` / `next-step.ts` (+ tests)
- [ ] parent page button and two-step dialog, component test
- [ ] e2e in a temporary worktree (port 3180), screenshots on phone and iPad, contact sheets
- [ ] `docs/spec.md` (parent features), `docs/architecture.md`
- [ ] gate: `pnpm lint && pnpm typecheck && pnpm test`

## Next steps for a fresh agent

Start at the first unchecked item. Do not touch `content/**`, `video/**`, `public/media/**`. Never push or stop the dev server on port 3001. Stage only your own paths (other agents have uncommitted edits in `docs/`).
