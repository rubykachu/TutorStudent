Archived: 01/10/2026, "Học lại bài này" is done (progress layer, parent page with two-step sheet, component test, e2e in `e2e/parent.spec.ts`, docs); the cross-device reset marker waits for the sync work (`docs/spec.md`, merge rules).

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

- [x] `src/progress/reset.ts` (`resetLessonProgress`, `LESSON_RESET_POLICY` typed by table name) and `tests/progress/reset.test.ts` (only that lesson and child, sticker and activity days kept, review queue and FSRS cleared, parent report counts drop, every table classified, a table without policy makes the reset throw). 140 tests pass in `tests/progress` and `tests/learn/next-step.test.ts`.
- [x] The sticker no longer implies "done": `lessonState` (two arguments now), `subjectProgress`, `continueTarget`, `subjectStatus`, the subject screen and `lessonSections` read section records only; tests updated. `StudyProgress` lost its `stickers` field.
- [x] `lessonHasProgress` in `src/progress/parent-report.ts` (true when there is something a reset would erase).
- [x] Parent page: in `src/components/parent/child-report.tsx` (`LessonsProgress` rows) add the "Học lại bài này" button only where `lessonHasProgress` is true, and pass `done={sticker ? total : done}` to the row's `Sticker` so the kept title still shows in colour. Dialog in a new `src/components/parent/reset-lesson-dialog.tsx` built on `Sheet`: step 1 says what is erased (progress, memory cards, all answers including skipped ones, writings, the overview mark) and that the sticker stays; step 2 asks again with lesson and child names; destructive colour (`--color-destructive`); then call `resetLessonProgress(appDb(), childScope(profile.id), lessonId, now())`.
- [x] Component test for the flow (`tests/components/parent/`, pattern of `parent-screen.test.tsx`): button hidden without progress, cancel at each step erases nothing, confirm erases and the sticker stays.
- [x] e2e in a temporary worktree (`git worktree add`, `pnpm install --offline`, port 3180, stop only your own PIDs, remove the worktree after): parent page, reset, lesson shows "Bắt đầu học" and section 1. Screenshots of the action and the dialog on phone and iPad as contact sheets (`pnpm shots:sheet`), look at them.
- [x] `docs/spec.md` (parent features: the reset; the sticker is no longer read as "done"; sync needs a reset marker) and `docs/architecture.md` (`progress/` line: `reset.ts`). Re-read both before editing; other agents have uncommitted edits in `docs/`, stage only your hunks.
- [x] Gate: `pnpm format && pnpm lint && pnpm typecheck && pnpm test`; failures from other agents' lesson files go in the report.

## Next steps for a fresh agent

Start at the first unchecked item. Do not touch `content/**`, `video/**`, `public/media/**`. Never push or stop the dev server on port 3001. Stage only your own paths (`git add <paths>`, never `-A`); `content/math/kntt/boi-chung-boi-chung-nho-nhat/review.md` and `docs/lessons-learned/` belong to other agents.
