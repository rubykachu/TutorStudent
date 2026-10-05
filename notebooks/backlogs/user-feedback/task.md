# Tasks: in-app feedback ("Góp ý")

Spec: `spec.md`. Plan, dependency graph and checkpoints: `plan.md`. Status: not started. The private repo `rubykachu/owlyeah-feedback` is set up (labels, issue form, README); no app code exists.

Rules for every task: one fresh subagent per task or small group (Sonnet for build tasks, Opus for the security review), the gate before each commit (`pnpm format && pnpm lint && pnpm typecheck && pnpm test`), commit only your own paths, never push, no request leaves localhost in tests. Another agent may be authoring a lesson in the same tree: do not touch `content/`, `src/visuals/`, `video/` or `public/media/`.

Sizes: S is up to about 2 files of code plus tests; M is up to about 5.

## Slice 1: pure core

### T1. Schema, constants, key kinds (S)

- Files: `src/user-feedback/schema.ts` (new), `src/lib/config.ts`, `src/sync/store/keys.ts`, `tests/user-feedback/schema.test.ts`, `tests/sync/store/keys.test.ts`.
- Do: the strict request schema of `spec.md` section 4 (subjects from `content/subjects.json`, grades from `GRADES`, phases from `SECTION_PHASES`, scoped ids from `src/schema/content.ts`); the record and pending schemas of section 5; constants `FEEDBACK_REPO`, `FEEDBACK_BODY_MAX_BYTES`, `FEEDBACK_NOTE_MAX_CHARS`, the limits of section 10, `FEEDBACK_RETRY_PER_REQUEST`, `FEEDBACK_PENDING_MAX`, `FEEDBACK_OUTBOX_MAX`, `FEEDBACK_OUTBOX_MAX_AGE_DAYS`, `FEEDBACK_GITHUB_TIMEOUT_MS`; `syncKey` kinds `feedback` (`<prefix>feedback/<yyyy-mm>/<id>.json`) and `feedback-pending`.
- Acceptance: unknown keys, a note with `source: "be"`, a section id of another lesson, an item of another lesson, `sectionNumber` without `section`, an id that is not 32 hex, a 501-character note are each refused; a full valid example parses. Keys refuse a bad id or month and are under the right prefix.
- Verify: `pnpm test tests/user-feedback/schema.test.ts tests/sync/store/keys.test.ts && pnpm typecheck`.

### T2. Sanitizer, title, labels, body (M)

- Files: `src/user-feedback/sanitize.ts`, `src/user-feedback/issue.ts` (new), `tests/user-feedback/sanitize.test.ts`, `tests/user-feedback/issue.test.ts`.
- Do: `plainText`, `noteText`, escaped hidden JSON (`spec.md` section 6.3); `issueTitle`, `issueLabels`, `lessonLabel` (50-character rule with the 6-hex SHA-256 suffix), `issueBody` with the exact template of section 6.2, screen and reason labels in one map each.
- Acceptance: body snapshot for a parent report with section, item and note and for a child report on the lesson page; hostile inputs (markdown link and image, `<script>`, `-->` in a title, `@user`, triple backticks, 10 000 characters, control characters, RTL override) leave nothing outside the fence and the hidden block parses back to the same values; `lessonLabel` of the 53-character slug is exactly 50 characters and stable; title at most 256 characters.
- Verify: `pnpm test tests/user-feedback/`.

### T3. Family pseudonym, app SHA, device class (S)

- Files: `src/user-feedback/identity.ts` (new), `src/install/platform.ts` (add `deviceClass`, reusing `isIos`), `tests/user-feedback/identity.test.ts`, `tests/install/platform.test.ts`.
- Do: `familyPseudonym(sessionSecret, familyId)` = first 12 hex of HMAC-SHA256 with the `feedback-family:` prefix via `hmacSign`; `appVersion(env)` = first 7 of `APP_COMMIT_SHA` or `dev`; `deviceClass(facts)` → `{ kind, os }`.
- Acceptance: same input, same pseudonym; a different family or secret, a different one; the raw id never appears in the output; iPad reporting as Mac with touch points is `ipad/ios`.
- Verify: `pnpm test tests/user-feedback/identity.test.ts tests/install/`.

## Slice 2: server

### T4. GitHub client (M)

- Files: `src/user-feedback/github.ts` (new), `tests/user-feedback/github.test.ts`.
- Do: `createGithubIssues({ token, repo, fetch, now })` with `ensureLabels(names)` (201 and 422 `already_exists` both fine, per-instance memory of ensured names, prefix colours of `spec.md` section 6.2) and `createIssue({ title, body, labels })` with the headers and timeout of section 6.1; results are `{ ok, number, url }` or `{ ok: false, code }` with codes `no-token`, `github-401`, `github-403`, `github-5xx`, `github-other`, `timeout`, `labels`. Never throws on HTTP errors; never puts the token in an error or a log.
- Acceptance: tests over a fake `fetch` for success, 401, 422 label exists, 502, abort on timeout, missing token (no request at all); a test asserts the token string appears in no returned value.
- Verify: `pnpm test tests/user-feedback/github.test.ts`.

### T5. Feedback service: admit, store, limits, logging (M)

- Files: `src/user-feedback/server.ts` (new), `src/access/client-key.ts` (moved from `src/app/api/session/route.ts`), `src/lib/read-capped.ts` or a shared spot for the capped reader (moved from `src/sync/server.ts`), `src/app/api/session/route.ts`, `src/sync/server.ts`, `tests/api/feedback-post.test.ts`, `tests/api/feedback-helpers.ts`.
- Do: `createFeedbackService({ store, prefix, github, readAccess, now, log, after })` with the check order of `spec.md` section 4, family, IP and day limits (section 10), record write with `ifNoneMatch: "*"` (duplicate → 200), 202 on a new report, the log entry of section 6.4.
- Acceptance: 403 without or with a foreign Origin; 400 wrong media type or schema; 401 without cookie and for a revoked family; 404 `no-gate` with the gate open; 503 without a store; 413 over 4096 bytes; 429 with `retry-after` past each limit; a duplicate id stores once; the stored record has the pseudonym and no family id, cookie, IP or user agent; a log spy sees no note, title, family id or pseudonym. Existing `tests/api/sync-*.test.ts` and `tests/access/` still pass after the two moves.
- Verify: `pnpm test tests/api/ tests/access/`.

### T6. Forwarding, pending list, retry (M)

- Files: `src/user-feedback/forward.ts` (new), `src/user-feedback/server.ts`, `tests/user-feedback/forward.test.ts`, `tests/api/feedback-forward.test.ts`.
- Do: `forwardReport(store, prefix, github, id, month)` (read record, skip if `sent`, ensure labels, create issue, update the record with `ifMatch`), pending add and remove with conditional writes and 3 rounds, the after-answer flow of `spec.md` section 9.1 through the injected `after`, the per-instance hourly cap on created issues.
- Acceptance: no token → record `pending` with `no-token`, id in the list, one log line per instance; next report with a working fake GitHub forwards both, oldest first, and empties the list; a 502 stops the retry loop at once; a conflict on `pending.json` is retried and no id is lost (two concurrent adds); the list stops at 500 with `pending-full`; a record already `sent` is never sent again.
- Verify: `pnpm test tests/user-feedback/ tests/api/feedback-forward.test.ts`.

### T7. Route, bundle check, env example (S)

- Files: `src/app/api/feedback/route.ts` (new), `scripts/bundle-check.ts`, `tests/scripts/bundle-check.test.ts`, `.env.example`.
- Do: the route wires the service to `readSyncStoreConfig`, `syncEnvPrefix`, `GITHUB_FEEDBACK_TOKEN`, `after` from `next/server` (read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md` first); `GITHUB_FEEDBACK_TOKEN` joins the server-only names; `.env.example` documents the name and its scope (Issues read and write on `rubykachu/owlyeah-feedback` only).
- Acceptance: bundle-check test fails a fake bundle that names the variable or holds its value; `pnpm build` passes (run in a separate dist dir so the owner's dev server is not touched, then `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`).
- Verify: `pnpm test tests/scripts/bundle-check.test.ts && NEXT_DIST_DIR=.next-feedback pnpm build && CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.

**Checkpoint A:** paste one rendered body from the T2 snapshot into the handover below and ask the owner to confirm the issue format.

## Slice 3: child UI

### T8. Client sender, outbox, runner (M)

- Files: `src/user-feedback/client.ts`, `src/user-feedback/outbox.ts`, `src/user-feedback/outbox-runner.tsx` (new), `src/app/(child)/layout.tsx`, `tests/user-feedback/outbox.test.ts`, `tests/user-feedback/outbox-runner.test.tsx`.
- Do: `sendFeedback(report)` puts the report in the outbox (`settings`, `DEVICE_SCOPE`, key `feedbackOutbox`) then flushes; `flushOutbox()` one at a time, oldest first, with the answer rules of `spec.md` section 3.5; the runner flushes on mount and on `online`; the caps (20 reports, 7 days).
- Acceptance: offline (fetch throws `TypeError`) keeps the report; 202, 200 duplicate and 400 remove it; 429 and 503 keep it; the 21st report drops the oldest; a report of 8 days ago is dropped without a request; two flushes at once send each report once; `SYNC_POLICY` and `LESSON_RESET_POLICY` tests still pass unchanged.
- Verify: `pnpm test tests/user-feedback/ tests/sync/ tests/progress/`.

### T9. Button, sheet and thank-you on every lesson screen (M)

- Files: `src/user-feedback/feedback-button.tsx`, `src/user-feedback/feedback-sheet.tsx`, `src/user-feedback/context.ts` (new: builds the report context from lesson, section, step, screen), `src/learn/player-header.tsx`, `src/components/page-top-bar.tsx`, `src/learn/lesson-overview.tsx`, `src/learn/section-player.tsx`, `src/learn/review-player.tsx`, `src/app/(child)/lessons/[lessonId]/lesson-screen.tsx`, `src/app/(child)/lessons/[lessonId]/tips/tips-screen.tsx`, `tests/user-feedback/feedback-sheet.test.tsx`, `tests/user-feedback/context.test.ts`.
- Do: `spec.md` sections 3.1, 3.2, 3.4: icon button with `aria-label`, label text from `md`, sheet with five chips, one tap sends, thank-you with `role="status"`, auto-close after 3 s except under reduced motion, "Đã gửi" per reason and item while the screen is open; context follows the screen shown when looking back.
- Acceptance: component tests for each screen kind produce the right `screen`, `section`, `sectionNumber`, `item`, `step`; the thank-you shows for success, 4xx, 5xx and offline; the exercise keeps its input and wrong count after the sheet closes; grades, subject and home screens render no button; `pnpm lesson:walk` on the fixture lesson or one published lesson reports no overlap on the phone and iPad targets.
- Verify: `pnpm test tests/user-feedback/ tests/learn/ && pnpm lesson:walk <one published lesson>`.

## Slice 4: parent form

### T10. Parent form behind the PIN (M)

- Files: `src/components/parent/pin-gate.tsx` (extract `PinPrompt`), `src/components/parent/pin-prompt.tsx` (new), `src/user-feedback/parent-form.tsx` (new), `src/user-feedback/feedback-sheet.tsx`, `src/components/parent/progress-location.tsx` (privacy sentence of `spec.md` section 7.2), `tests/user-feedback/parent-form.test.tsx`, `tests/components/parent/pin-gate.test.tsx` (existing tests keep passing).
- Do: `spec.md` section 3.3: the link "Phụ huynh góp ý kèm ghi chú", PIN step (skipped while the parent session is open; a right PIN opens the session), "Đặt PIN ở trang phụ huynh…" when no PIN, radio reasons, note with counter and 500 cap, "Gửi góp ý", thank-you.
- Acceptance: wrong PIN five times locks like `/parent`; with an open session no PIN is asked; without a PIN no note field is reachable; the note is sent with `source: "phu-huynh"`, the child chips always with `source: "be"` and no note; the counter is announced only at 450 and 500.
- Verify: `pnpm test tests/user-feedback/ tests/components/parent/`.

**Checkpoint B:** screenshots (iPad and phone) of the child sheet, thank-you, PIN step and parent form for the owner.

## Slice 5: E2E, deploy SHA, docs

### T11. E2E (M)

- Files: `e2e/user-feedback.spec.ts` (new), `e2e/targets.ts`, `playwright.config.ts` (reuse the gated sync server and its folder store; no `GITHUB_FEEDBACK_TOKEN` there, so no request can reach GitHub. The GitHub request itself is covered by the T4 and T6 tests over a fake `fetch`; no test-only GitHub URL variable is added).
- Do: on `ipad` and `phone`: open a lesson, tap "Góp ý" on an exercise, tap "Sai nội dung hoặc đáp án", see the thank-you; the folder store holds one record under `dev/feedback/<yyyy-mm>/` with the right context and `forward.state: "pending"` (`no-token`), and its id is in `dev/feedback/pending.json`; offline (`/api/feedback` routed to fail), a report is queued, then sent after going back online; the parent path with a PIN set sends a note; the header has no overlap (`e2e/overlap.ts`).
- Acceptance: the spec passes on both targets with the existing suites at `--workers=2`; no request leaves localhost (`context.on("request")`, as in `e2e/sync.spec.ts`).
- Verify: `pnpm test:e2e e2e/user-feedback.spec.ts`.

### T12. Deploy SHA (S)

- Files: `scripts/lib/deploy-prod.ts`, `tests/scripts/deploy-prod.test.ts`.
- Do: the deploy step becomes `vercel deploy --prod --env APP_COMMIT_SHA=<sha>` with the SHA it already resolves.
- Acceptance: the dry run prints the flag with the full SHA; the test checks it. No deploy is run.
- Verify: `pnpm test tests/scripts/deploy-prod.test.ts && pnpm deploy:prod --dry-run`.

### T13. Docs (M)

- Files: `docs/spec.md` (new subsection under "Thiết kế chức năng" and the secrets line of "Truy cập và bảo mật"), `docs/architecture.md` (module line for `user-feedback/`, `/api/feedback`, a row in "Automated checks"), `docs/operations.md` (env table row `GITHUB_FEEDBACK_TOKEN`, section "Góp ý từ app": the triage loop of `spec.md` section 11, the token's expiry date and rotation, the R2 lifecycle rules, how to read `pending.json`), `notebooks/backlogs/index.md` (rename the later AI writing route to `/api/writing-review`).
- Acceptance: the durable docs name no task numbers, slices or checkpoints; they point to files that exist; the repo README's pointer (`docs/operations.md`, "Góp ý từ app") resolves.
- Verify: `grep -nE "§|T[0-9]+\b|Slice |Checkpoint " docs/spec.md docs/architecture.md docs/operations.md` shows nothing new; `pnpm format`.

## Slice 6: security review

### T14. Security review (M, fresh Opus subagent, read-only)

- Scope: the diff of T1 to T13 only (`git diff <base>..HEAD -- src/user-feedback src/app/api/feedback src/access src/sync/store/keys.ts src/lib/config.ts scripts/bundle-check.ts scripts/lib/deploy-prod.ts src/components/parent src/learn src/components/page-top-bar.tsx`). No external calls, no edits.
- Checklist: Origin and cookie order; family id only from the cookie; schema strictness and size caps before parsing; every sanitizer path against markdown, HTML, mentions, links, `-->`, Unicode tricks; labels only from enums and slugs; token never logged, returned, thrown or bundled; logs free of note, titles, family id, pseudonym; rate limits keyed right (family and IP) and memory bounded; R2 keys only from `syncKey`; duplicate and retry paths cannot create unbounded issues; `after()` failures do not lose a stored report; the PIN step cannot be bypassed to reach the note; privacy sentence present; Nghị định 13 notes of `spec.md` section 7.2 still true of the code.
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
3. Deploy (**external write**): `pnpm deploy:prod --ref <the verified sha>`, smoke 7/7, per `docs/operations.md` "Đưa bài mới lên production".
4. Live check (**external write: a real issue**): with a throwaway family, send one child report and one parent report on production; the issues appear in `rubykachu/owlyeah-feedback` with the right labels, `app` equals the deployed short SHA, `family` is 12 hex; R2 has `prod/feedback/<yyyy-mm>/<id>.json` with `forward.state: "sent"`; `pending.json` is empty or absent. Close both issues with `trang-thai:khong-sua` and the comment "Kiểm tra khi triển khai"; revoke the throwaway family through `FAMILY_CODES_REVOKED`.
5. Update `notebooks/backlogs/index.md` and `docs/operations.md` "Bản đang chạy"; archive this folder with `git mv` to `notebooks/backlogs/archive/user-feedback/` once the leftovers are done.

## Handover

Nothing built yet. Start with T1 in a fresh Sonnet subagent, from this file.

## Security review

Not run yet (T14).
