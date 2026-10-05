# Tasks: in-app feedback ("Góp ý")

Spec: `spec.md`. Plan, dependency graph and checkpoints: `plan.md`. Status: not started. The private repo `rubykachu/owlyeah-feedback` is set up (labels, issue form, README); no app code exists.

Rules for every task: one fresh subagent per task or small group (Sonnet for build tasks, Opus for the security review), the gate before each commit (`pnpm format && pnpm lint && pnpm typecheck && pnpm test`), commit only your own paths, never push, no request leaves localhost in tests. Another agent may be authoring a lesson in the same tree: do not touch `content/`, `src/visuals/`, `video/` or `public/media/`.

Sizes: S is up to about 2 files of code plus tests; M is up to about 5. A task that grows past M is split before it starts, not during it.

## Slice 1: pure core

### T1. Schema, constants, key kinds (S) [x]

- Files: `src/user-feedback/schema.ts` (new), `src/lib/config.ts`, `src/sync/store/keys.ts`, `tests/user-feedback/schema.test.ts`, `tests/sync/store/keys.test.ts`.
- Do: the strict request schema of `spec.md` section 4 (subjects from `content/subjects.json`, grades from `GRADES`, phases from `SECTION_PHASES`, scoped ids from `src/schema/content.ts`); the record (states `pending`, `sending`, `sent`, `failed`, `claimedAt`) and pending schemas of section 5; constants `FEEDBACK_REPO`, `FEEDBACK_BODY_MAX_BYTES`, `FEEDBACK_NOTE_MAX_CHARS`, the limits of section 10, `FEEDBACK_RETRY_PER_REQUEST`, `FEEDBACK_PENDING_MAX`, `FEEDBACK_OUTBOX_MAX`, `FEEDBACK_OUTBOX_MAX_AGE_DAYS`, `FEEDBACK_SEND_TIMEOUT_MS`, `FEEDBACK_GITHUB_TIMEOUT_MS`, `FEEDBACK_GITHUB_WRITE_GAP_MS`, `FEEDBACK_FORWARD_BUDGET_MS`, `FEEDBACK_CLAIM_SECONDS`, `FEEDBACK_MAX_ATTEMPTS`; `syncKey` kinds `feedback` (`<prefix>feedback/<yyyy-mm>/<id>.json`, month from `createdAt`) and `feedback-pending`.
- Acceptance: unknown keys, a note with `source: "be"`, a section id of another lesson, an item of another lesson, `sectionNumber` without `section`, an id that is not 32 hex, a 501-character note, a `createdAt` 9 days old or 10 minutes ahead are each refused; a full valid example parses. Keys refuse a bad id or month and are under the right prefix.
- Verify: `pnpm test tests/user-feedback/schema.test.ts tests/sync/store/keys.test.ts && pnpm typecheck`.

### T2. Sanitizer, title, labels, body (M) [x]

- Files: `src/user-feedback/sanitize.ts`, `src/user-feedback/issue.ts` (new), `tests/user-feedback/sanitize.test.ts`, `tests/user-feedback/issue.test.ts`.
- Do: `plainText` (including the broken `://` and `www.`), `noteText`, escaped hidden JSON (`\u003c`, `\u003e`, `\u0026`; `spec.md` section 6.3); `issueTitle`, `issueLabels`, `lessonLabel` (50-character rule with the 6-hex SHA-256 suffix), `issueBody` with the exact template of section 6.2, screen and reason labels in one map each. Print one rendered body (parent report with section, item and note) into the handover below for Checkpoint A.
- Acceptance: body snapshot for a parent report with section, item and note and for a child report on the lesson page; hostile inputs (markdown link and image, a bare `https://` or `www.` URL, `<script>`, `-->` in a title, `@user`, triple backticks, 10 000 characters, control characters, RTL override) leave nothing outside the fence and no autolink and the hidden block parses back to the same values; `lessonLabel` of the 53-character slug is exactly 50 characters and stable; title at most 256 characters.
- Verify: `pnpm test tests/user-feedback/`.

**Checkpoint A:** ask the owner to confirm the issue format from the body printed in the handover and the label list of `spec.md` section 6.2, before T4.

### T3. Family pseudonym, app SHA, device class (S) [x]

- Files: `src/user-feedback/identity.ts` (new), `src/install/platform.ts` (add `deviceClass`, reusing `isIos`), `tests/user-feedback/identity.test.ts`, `tests/install/platform.test.ts`.
- Do: `familyPseudonym(sessionSecret, familyId)` = first 12 hex of HMAC-SHA256 with the `feedback-family:` prefix via `hmacSign`; `appVersion(env)` = first 7 of `APP_COMMIT_SHA` or `dev`; `deviceClass(facts)` → `{ kind, os }`.
- Acceptance: same input, same pseudonym; a different family or secret, a different one; the raw id never appears in the output; iPad reporting as Mac with touch points is `ipad/ios`.
- Verify: `pnpm test tests/user-feedback/identity.test.ts tests/install/`.

## Slice 2: server

### T4. GitHub client (M) [x]

- Files: `src/user-feedback/github.ts` (new), `tests/user-feedback/github.test.ts`.
- Do: `createGithubIssues({ token, repo, fetch, now })` with `ensureLabels(names)` (201 and 422 `already_exists` both fine, per-instance memory of ensured names, prefix colours of `spec.md` section 6.2) and `createIssue({ title, body, labels })` with the headers and timeout of section 6.1; results are `{ ok, number, url }` or `{ ok: false, code }` with codes `no-token`, `github-401`, `github-403`, `github-rate`, `github-422`, `github-5xx`, `github-other`, `timeout`, `labels` (`spec.md` section 6.1). Never throws on HTTP errors; never puts the token in an error or a log.
- Acceptance: tests over a fake `fetch` for success (exact request: URL, method, headers, `{ title, body, labels }`), 401, 403 without and with `retry-after` (`github-403` vs `github-rate`), 429, 422 on the issue, 422 `already_exists` on a label (done) and another 422 on a label (`labels`, issue still created without it), 502, abort on timeout, missing token (no request at all); a test asserts the token string appears in no returned value.
- Verify: `pnpm test tests/user-feedback/github.test.ts`.

### T5a. Shared request helpers (S, refactor only) [x]

- Files: `src/access/client-key.ts` (new, `clientKey` moved from `src/app/api/session/route.ts`), `src/lib/read-capped.ts` (new, `readCapped` moved from `src/sync/server.ts`), `src/app/api/session/route.ts`, `src/sync/server.ts`, `tests/access/client-key.test.ts`, `tests/lib/read-capped.test.ts`.
- Do: move, do not change behaviour; the two callers import the shared copies.
- Acceptance: existing `tests/api/sync-*.test.ts` and `tests/access/` pass unchanged; the new unit tests cover `x-forwarded-for` with several entries, `x-real-ip`, none, and a body over the cap with and without `content-length`.
- Verify: `pnpm test tests/api/ tests/access/ tests/lib/`.

### T5b. Feedback service: admit, store, pending add, limits, logging (M) [x]

- Files: `src/user-feedback/server.ts` (new), `src/user-feedback/pending.ts` (new: idempotent add and remove with conditional writes, 3 rounds), `tests/api/feedback-post.test.ts`, `tests/api/feedback-helpers.ts`, `tests/user-feedback/pending.test.ts`.
- Do: `createFeedbackService({ store, prefix, github, readAccess, now, log, after })` with the check order of `spec.md` section 4, family, IP and 24-hour limits (section 10), record write with `ifNoneMatch: "*"`, the pending add before the answer (step 8: 202 new, 200 duplicate with the add repeated while `pending`, 503 `busy` when the add loses 3 rounds), the log entry of section 6.4.
- Acceptance: 403 without or with a foreign Origin; 400 wrong media type or schema; 401 without cookie and for a revoked family; 404 `no-gate` with the gate open; 503 without a store; 413 over 4096 bytes; 429 with `retry-after` past each limit; a duplicate id stores once; a new report's id is in `pending.json` before the answer; a store whose `pending.json` write always conflicts answers 503 `busy` and the retry of the same id adds it; two concurrent adds keep both ids; a full list answers 202 and logs `pending-full`; the stored record has the pseudonym and no family id, cookie, IP or user agent; a log spy sees no note, title, family id or pseudonym.
- Verify: `pnpm test tests/api/ tests/user-feedback/`.

### T6. Forwarding, pending list, retry (M) [x]

- Files: `src/user-feedback/forward.ts` (new), `src/user-feedback/server.ts`, `tests/user-feedback/forward.test.ts`, `tests/api/feedback-forward.test.ts`.
- Do: the pass of `spec.md` section 9.1 through the injected `after`: `forwardReport(store, prefix, github, id, month)` with the claim, `sent`, `failed` and `pending` writes, the write gap, the 30 s budget and the per-instance hourly cap; the gap and the clock are injected so tests do not wait.
- Acceptance: no token → record `lastError: "no-token"`, id still in the list, no GitHub request, one log line per instance; next report with a working fake GitHub forwards both, oldest first, and empties the list; a 502 or `github-rate` stops the pass at once; two passes started together over the same list create one issue per report (claim); a stale `sending` claim is taken again, a fresh one is skipped; a 422 report ends `failed`, leaves the list, and the report behind it is sent in the same pass; the 10th attempt ends `failed`; a pending id whose record is missing is removed; a record already `sent` is never sent again and its id is removed; the budget stops the pass before the 11th id.
- Verify: `pnpm test tests/user-feedback/ tests/api/feedback-forward.test.ts`.

### T7. Route, bundle check, env example (S) [x]

- Files: `src/app/api/feedback/route.ts` (new), `scripts/lib/bundle-check.ts` (`SERVER_ONLY_ENV_NAMES`), `tests/scripts/bundle-check.test.ts`, `.env.example`.
- Do: the route wires the service to `readSyncStoreConfig`, `syncEnvPrefix`, `GITHUB_FEEDBACK_TOKEN`, `after` from `next/server` (read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md` and `.../03-file-conventions/02-route-segment-config/maxDuration.md` first), `export const maxDuration = 60`; `GITHUB_FEEDBACK_TOKEN` joins the server-only names; `.env.example` documents the name and its scope (Issues read and write on `rubykachu/owlyeah-feedback` only).
- Acceptance: bundle-check test fails a fake bundle that names the variable or holds its value; `pnpm build` passes (run in a separate dist dir so the owner's dev server is not touched, then `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`).
- Verify: `pnpm test tests/scripts/bundle-check.test.ts && NEXT_DIST_DIR=.next-feedback pnpm build && CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.


## Slice 3: child UI

### T8. Client sender, outbox, runner (M) [x]

- Files: `src/user-feedback/client.ts`, `src/user-feedback/outbox.ts`, `src/user-feedback/outbox-runner.tsx` (new), `src/app/(child)/layout.tsx`, `src/sync/family-switch.ts` (delete `feedbackOutbox` too), `tests/user-feedback/outbox.test.ts`, `tests/user-feedback/outbox-runner.test.tsx`, `tests/sync/status.test.ts` (where `clearLocalFamilyData` is tested today).
- Do: `sendFeedback(report)` puts the report in the outbox (`settings`, `DEVICE_SCOPE`, key `feedbackOutbox`, JSON text validated on read) and resolves; the flush runs after it without being awaited by the UI; `flushOutbox()` one at a time, oldest first, with the answer rules of `spec.md` section 3.5; the runner flushes on mount and on `online`; the caps (20 reports, 7 days).
- Acceptance: offline (fetch throws `TypeError`) and a timeout keep the report; 202, 200 duplicate, 400, 403, 404 and 413 remove it; 401, 429 and 503 keep it and end the flush (no request for the next report); a damaged outbox value reads as empty; a family switch empties the outbox; the 21st report drops the oldest; a report of 8 days ago is dropped without a request; two flushes at once send each report once; `SYNC_POLICY` and `LESSON_RESET_POLICY` tests still pass unchanged.
- Verify: `pnpm test tests/user-feedback/ tests/sync/ tests/progress/`.

### T9a. Button, sheet, thank-you and context, as components (M) [x]

- Files: `src/user-feedback/feedback-button.tsx`, `src/user-feedback/feedback-sheet.tsx`, `src/user-feedback/context.ts` (new: builds the report context from lesson, section, step, screen), `tests/user-feedback/feedback-sheet.test.tsx`, `tests/user-feedback/context.test.ts`.
- Do: `spec.md` sections 3.2, 3.4: icon button with `aria-label`, label text from `md`, sheet with five chips in one column, one tap sends, thank-you with `role="status"` as soon as the outbox write resolves, auto-close after 5 s except under reduced motion, "Đã gửi" per reason and item while the screen is open.
- Acceptance: `context` produces the right `screen`, `section`, `sectionNumber`, `item`, `step` for each screen kind of section 3.1, including a step reached through "Quay lại"; the thank-you shows with a `sendFeedback` that never resolves its network part (offline, slow) as well as after success; a sent reason is disabled for the same item and open for another.
- Verify: `pnpm test tests/user-feedback/`.

### T9b. Wire the button into the lesson screens (M) [x]

- Files: `src/learn/player-header.tsx`, `src/components/page-top-bar.tsx`, `src/learn/lesson-overview.tsx`, `src/learn/section-player.tsx`, `src/learn/review-player.tsx`, `src/app/(child)/lessons/[lessonId]/lesson-screen.tsx`, `src/app/(child)/lessons/[lessonId]/tips/tips-screen.tsx`, existing tests under `tests/learn/` and `tests/components/`.
- Do: `spec.md` section 3.1: the optional `feedback` prop on `PlayerHeader` and `PageTopBar`, passed by the five screens.
- Acceptance: the exercise keeps its input and wrong count after the sheet closes; grades, subject and home screens render no button; `pnpm lesson:walk` on one published lesson reports no overlap on the phone and iPad targets.
- Verify: `pnpm test tests/learn/ tests/components/ && pnpm lesson:walk <one published lesson>`.

## Slice 4: parent form

### T10. Parent form behind the PIN (M) [x]

- Files: `src/components/parent/pin-gate.tsx` (extract `PinPrompt`), `src/components/parent/pin-prompt.tsx` (new), `src/user-feedback/parent-form.tsx` (new), `src/user-feedback/feedback-sheet.tsx`, `src/components/parent/progress-location.tsx` (privacy sentence of `spec.md` section 7.2), `tests/user-feedback/parent-form.test.tsx`, `tests/components/parent/pin-gate.test.tsx` (existing tests keep passing).
- Do: `spec.md` section 3.3: the link "Phụ huynh góp ý kèm ghi chú", PIN step every time (the parent session is neither read nor opened), "Đặt PIN ở trang phụ huynh…" when no PIN, radio reasons, note with counter and 500 cap, "Gửi góp ý", thank-you.
- Acceptance: wrong PIN five times locks like `/parent`; with the parent session open the PIN is still asked; a right PIN here neither opens nor extends the parent session (`parentSessionSnapshot()` unchanged); without a PIN no note field is reachable; the note is sent with `source: "phu-huynh"`, the child chips always with `source: "be"` and no note; the counter is announced only at 450 and 500.
- Verify: `pnpm test tests/user-feedback/ tests/components/parent/`.

**Checkpoint B:** screenshots (iPad and phone) of the child sheet, thank-you, PIN step and parent form for the owner.

## Slice 5: E2E, deploy SHA, docs

### T11. E2E (M) [x]

- Files: `e2e/user-feedback.spec.ts` (new), `e2e/targets.ts`, `playwright.config.ts` (reuse the gated sync server and its folder store; no `GITHUB_FEEDBACK_TOKEN` there, so no request can reach GitHub. The GitHub request itself is covered by the T4 and T6 tests over a fake `fetch`; no test-only GitHub URL variable is added).
- Do: on `ipad` and `phone`: open a lesson, tap "Góp ý" on an exercise, tap "Sai nội dung hoặc đáp án", see the thank-you; the folder store holds one record under `dev/feedback/<yyyy-mm>/` with the right context and `forward.state: "pending"`, and its id is in `dev/feedback/pending.json`; poll the record until `lastError` is `no-token`, which proves `after()` ran in the real server; offline (`/api/feedback` routed to fail), a report is queued, then sent after going back online; the parent path with a PIN set sends a note; the header has no overlap (`e2e/overlap.ts`).
- Acceptance: the spec passes on both targets with the existing suites at `--workers=2`; no request leaves localhost (`context.on("request")`, as in `e2e/sync.spec.ts`).
- Verify: `pnpm test:e2e e2e/user-feedback.spec.ts`.

### T12. Deploy SHA (S) [x]

- Files: `scripts/lib/deploy-prod.ts`, `tests/scripts/deploy-prod.test.ts`.
- Do: the deploy step becomes `vercel deploy --prod --env APP_COMMIT_SHA=<sha>` with the SHA it already resolves (`deploySteps` takes the SHA); one more smoke check, `POST /api/feedback` without a cookie answers 401 (the gate stops it before the bucket), with `docs/operations.md` updated from seven checks to eight in T13.
- Acceptance: the dry run prints the flag with the full SHA; the tests check it and the new smoke check over a fake `fetch`. No deploy is run.
- Verify: `pnpm test tests/scripts/deploy-prod.test.ts && pnpm deploy:prod --dry-run`.

### T13. Docs (M) [x]

- Files: `docs/spec.md` (new subsection under "Thiết kế chức năng" and the secrets line of "Truy cập và bảo mật"), `docs/architecture.md` (module line for `user-feedback/`, `/api/feedback`, a row in "Automated checks"), `docs/operations.md` (env table row `GITHUB_FEEDBACK_TOKEN`, section "Góp ý từ app": the triage loop of `spec.md` section 11, the token's expiry date and rotation, the R2 lifecycle rules, how to read `pending.json`), `notebooks/backlogs/index.md` and `docs/spec.md` section "Câu hỏi mở và AI nhận xét" (rename the later AI writing route to `/api/writing-review`), the smoke-check count in `docs/operations.md`.
- Acceptance: the durable docs name no task numbers, slices or checkpoints; they point to files that exist; the repo README's pointer (`docs/operations.md`, "Góp ý từ app") resolves.
- Verify: `grep -nE "§|T[0-9]+\b|Slice |Checkpoint " docs/spec.md docs/architecture.md docs/operations.md` shows nothing new; `pnpm format`.

## Slice 6: security review

### T14. Security review (M, fresh Opus subagent, read-only) [x]

- Scope: every commit of T1 to T13 (`git diff <base>..HEAD -- . ':!content' ':!src/visuals' ':!video' ':!public/media'`, `<base>` being the commit before T1, written into the handover when T1 starts), so a file outside a guessed path list is never missed. No external calls, no edits.
- Checklist: Origin and cookie order; family id only from the cookie; schema strictness and size caps before parsing; every sanitizer path against markdown, HTML, mentions, links, `-->`, Unicode tricks; labels only from enums and slugs; token never logged, returned, thrown or bundled; logs free of note, titles, family id, pseudonym; rate limits keyed right (family and IP) and memory bounded; R2 keys only from `syncKey`; duplicate, claim and retry paths cannot create unbounded or doubled issues; GitHub secondary-limit answers stop the pass; `after()` failures do not lose a stored report; the PIN step cannot be bypassed to reach the note; privacy sentence present; Nghị định 13 notes of `spec.md` section 7.2 still true of the code.
- Output: findings by severity (Critical, High, Medium, Low) with file and line, written into "Security review" below. Critical and High get fix tasks before rollout, each fix with a test that fails on the old code.

**Checkpoint C:** owner approves the rollout after reading the review.

## Slice 7: rollout

### T15. Fine-grained token (owner, by hand; no agent step)

The owner creates the token; no agent sees its value. Click steps:

1. Sign in to GitHub as **rubykachu**.
2. Avatar (top right) → **Settings** → **Developer settings** (bottom of the left menu) → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
3. **Token name:** `owlyeah-feedback-app`. **Description:** `Owl Yeah server: create feedback issues`.
4. **Resource owner:** `rubykachu`.
5. **Expiration:** Custom, one year from today; write the date into `docs/operations.md`, "Góp ý từ app" (or tell the agent the date only).
6. **Repository access:** **Only select repositories** → pick `rubykachu/owlyeah-feedback` and nothing else.
7. **Permissions** → **Repository permissions** → **Issues: Read and write**. Leave everything else at No access (**Metadata: Read-only** is added by GitHub on its own and is required).
8. **Generate token**, then copy it (it is shown once).
9. Open `.env.production.local` at the repo root in an editor and add one line `GITHUB_FEEDBACK_TOKEN=<the token>`; save; `chmod 600 .env.production.local`.
10. Never paste the token in a chat, an issue, a commit or a log.

Check without printing the value:

```bash
grep -c '^GITHUB_FEEDBACK_TOKEN=github_pat_' .env.production.local   # prints 1
curl -s -o /dev/null -w '%{http_code}\n' \
  -H "Authorization: Bearer $(sed -n 's/^GITHUB_FEEDBACK_TOKEN=//p' .env.production.local)" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/rubykachu/owlyeah-feedback/labels   # prints 200
```

The second command calls GitHub (read only); the owner runs it, or an agent runs it after the owner says so.

### T16. Rollout (external writes; each step only after the owner's go-ahead for it)

1. Owner, Cloudflare dashboard: lifecycle rules on `tutor-progress`: delete `prod/feedback/` after 365 days, `dev/feedback/` after 30 days.
2. Vercel env (**external write**): `sed -n 's/^GITHUB_FEEDBACK_TOKEN=//p' .env.production.local | tr -d '\n' | npx vercel env add GITHUB_FEEDBACK_TOKEN production --sensitive` (`npx vercel whoami` is `rubykachu`). Production only, not Preview.
3. Deploy (**external write**): `pnpm deploy:prod --ref <the verified sha>`, smoke 8/8, per `docs/operations.md` "Đưa bài mới lên production".
4. Live check (**external write: a real issue**): with the smoke family `OWLTEST0` (its code comes from `FAMILY_CODE_SECRET`, as in the deploy smoke checks; it never syncs, so no progress is touched), send one child report and one parent report on production; the issues appear in `rubykachu/owlyeah-feedback` with the right labels, `app` equals the deployed short SHA, `family` is 12 hex; R2 has `prod/feedback/<yyyy-mm>/<id>.json` with `forward.state: "sent"`; `pending.json` is empty or absent. Close both issues with `trang-thai:khong-sua` and the comment "Kiểm tra khi triển khai". No family is created or revoked, so no further env change or deploy follows.
5. Update `notebooks/backlogs/index.md` and `docs/operations.md` "Bản đang chạy"; archive this folder with `git mv` to `notebooks/backlogs/archive/user-feedback/` once the leftovers are done.

## Handover

Base commit (the commit before T1, for the security review diff): `e706002`.

Coordinator decisions on the reviewer's open questions (recorded in `spec.md`): chip label "Hay, mình thích"; PIN asked for every note; thank-you closes after 5 s and has a close button; opening the sheet pauses narration and video (no auto-resume); the repo README's hidden-block example updated to match section 6.2.

Done: T1 to T14 (build of the route passes in a temp worktree; `lesson:walk luy-thua` shows no overlap on phone, iPad, iPad landscape, its only failures being the gitignored media missing in the worktree). The overview's button sits in the `PageTopBar` above the overview (the same top row as the lesson page), not inside the overview's own header.
README of `rubykachu/owlyeah-feedback` updated through the contents API (commit `584e6f9`, by `rubykachu`): the hidden-block example has `id` and `step`.
Next: T16 rollout (T15 token done by the owner). Checkpoint B screenshots (iPad and phone: child sheet, thank-you, PIN step, parent form) are written by `e2e/user-feedback.spec.ts` into `test-results/` of the run.

Deploy coordination (another agent deploys Bài 21 `hinh-co-truc-doi-xung` tonight): right before `deploy:prod`, read the production SHA (last "Bản đang chạy" line of `docs/operations.md`, or `npx vercel ls --prod`); the pinned SHA must contain it (`git merge-base --is-ancestor <prod> <ours>`), else re-pin to a commit with both and re-run lint, typecheck, `content:check`, build. Never deploy while the other deploy runs; if "Bản đang chạy" changed in the last 10 minutes by another deploy, re-check. Every published lesson at the SHA must have its media (`pnpm media:upload --all --dry-run` reports 0).

Checkpoint A (issue format; the owner approved building and deploying without waiting, so it is recorded here for the morning review). A parent report with section, item and note renders as (labels `feedback`, `nguon:phu-huynh`, `ly-do:sai-noi-dung`, `bai:luy-thua`, `mon:math`, `lop:6`, `trang-thai:moi`; title `[Góp ý] Sai nội dung hoặc đáp án · Bài 6. Lũy thừa với số mũ tự nhiên · Phần 3`):

````markdown
**Lý do:** Sai nội dung hoặc đáp án
**Người gửi:** Phụ huynh
**Bài:** Bài 6. Lũy thừa với số mũ tự nhiên (`luy-thua`)
**Phần:** 3. Nhân hai lũy thừa cùng cơ số (`luy-thua.section.nhan-hai-luy-thua`)
**Câu / màn:** Câu hỏi · `luy-thua.ex.tinh-nhanh`
**Ghi chú:**
```text
Đáp án câu b in sai dấu
```

<sub>Gửi từ app bản `5fc3656` · iPad (iOS) · 05/10/2026 20:15</sub>

<!-- feedback-data {"v":1,"id":"9f0c2a7be1d04c58a6b7f0e2c4d91a35","lesson":"luy-thua","section":"luy-thua.section.nhan-hai-luy-thua","item":"luy-thua.ex.tinh-nhanh","step":"check-2","screen":"exercise","reason":"sai-noi-dung","source":"phu-huynh","app":"5fc3656","device":{"kind":"ipad","os":"ios"},"family":"a1b2c3d4e5f6","at":"2026-10-05T20:15:03+07:00"} -->
````

## Security review

Run on 06/10/2026 by a fresh Opus subagent over `git diff e706002..<T13 commit>` (read only). No Critical, no High.

- Medium M1, fixed: `plainText` removed `://` and `www.` in one pass, so `http:://x` and `www..x` became links again; it now repeats until nothing changes and also breaks `GH-<n>` references. Tests: `tests/user-feedback/sanitize.test.ts` ("drops markdown, HTML, mentions and links", "breaks GitHub issue references").
- Low L2, fixed: a token or rate failure (`no-token`, `github-401`, `github-403`, `github-rate`) no longer uses up an attempt, so a token outage cannot push waiting reports to `failed`. Test: `tests/api/feedback-forward.test.ts` ("does not count a token or rate failure as an attempt").
- Low L1, leftover: a GitHub timeout after the issue was created, or a failed record update, can make a second issue (bounded by the attempt cap and the hourly cap; triage marks `trang-thai:trung` by the hidden `id`). Upgrade: search the repo for the report id before resending a report whose last error was `timeout` or `github-other`.
- Low L3, leftover: `lesson` is checked only as a slug, so a family with a valid code can create stray `bai:*` labels (bounded by the rate limits). Upgrade: a build-time lesson catalog for the route.
- Low L4, accepted: the PIN step is a UI gate only; `source` is a device claim (as `spec.md` section 3.3 says) and a note is sanitized and fenced either way.
