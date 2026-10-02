# Tasks: progress sync across devices

Spec: `spec.md`. Plan and dependency graph: `plan.md`. Status: not started, waiting for the owner's review of the spec and its open questions (Q1 to Q8).

## Rules for every task

- One Sonnet subagent per task (or per pair of S tasks), started from this file; the security review runs on Opus in a fresh agent.
- Gate before each commit: `pnpm format && pnpm lint && pnpm typecheck && pnpm test` (plus `pnpm content:check` only if content or schema of lessons changed, which no task here does). Small commits, own paths only, never `git add -A`, never push.
- No external call (Cloudflare, Vercel, R2) unless the task says "owner approval" and the owner said yes for that run.
- Do not touch the owner's dev server; stop only processes you started, by PID.
- Before any task that edits files under `src/components/` or `src/learn/`, run `git status` and check no other agent has uncommitted changes in those files; if one does, stop and report.
- Out of scope for every task: the public media bucket and `pnpm media:upload`, video and narration files under `public/media/`, lesson content, brand files (`src/lib/brand.ts`, `src/app/layout.tsx`, `public/brand/`), media players, bottom bar.
- Scope sizes: S = 1 to 2 files plus tests, M = 3 to 5 files plus tests.

## Slice 1: merge core

### Task 1: doc schemas, versions and migration (S)

Zod schemas for the family profile doc and the child progress doc (`spec.md`, "Doc shapes"), `migrateDoc` (version 1 only for now, structure ready for steps), constants in `src/lib/config.ts`: `SYNC_DOC_MAX_BYTES` (1 MB), `SYNC_ATTEMPTS_KEPT` (500), `SYNC_WRITING_MAX_CHARS` (5 000), `SYNC_INTERVAL_MINUTES` (5), `SYNC_MAX_RETRIES` (3), `SYNC_FUTURE_SKEW_MINUTES` (10).

Acceptance:
- [ ] Schemas are strict (unknown keys rejected), ids validated by regex, string lengths bounded.
- [ ] A doc whose `version` is newer than the code knows is reported as `too-new`, not parsed as current.
- [ ] Stored sample files `tests/sync/fixtures/child-v1.json`, `profile-v1.json` parse.
- [ ] `src/sync/**` added to the coverage `include` in `vitest.config.ts`.

Verify: `pnpm test tests/sync/schema.test.ts && pnpm typecheck`

Files: `src/sync/schema.ts`, `src/lib/config.ts`, `vitest.config.ts`, `tests/sync/schema.test.ts`, `tests/sync/fixtures/*`.

### Task 2: merge functions and size trimming (M)

`mergeChildDocs`, `mergeProfileDocs`, `trimToSize` exactly as the rule table in `spec.md`, "Merge rules and edge cases".

Acceptance:
- [ ] Every row of the rule table has its own unit test, including reset tombstone drops for attempts, cards, sections, writings, `overviewSeen`, and stickers and activity days kept.
- [ ] Property tests (generated docs, fixed seed): commutative, associative, idempotent, for both doc kinds.
- [ ] Card tie-break: equal `lastReviewAt` resolves by `reps`, then JSON text; the result is the same in both argument orders.
- [ ] `trimToSize` keeps the newest 500 attempts, then drops oldest writings, and returns `too-large` when it still does not fit.
- [ ] Line coverage of `src/sync/merge.ts` ≥ 90%.

Verify: `pnpm test tests/sync/merge.test.ts && pnpm test --coverage`

Files: `src/sync/merge.ts`, `src/sync/trim.ts`, `tests/sync/merge.test.ts`, `tests/sync/trim.test.ts`. If a property-test library is added (e.g. `fast-check`), it is a dev dependency and the task says why in the commit.

### Checkpoint 1

- [ ] Gate green; merge rules reviewed against `spec.md` by the main session before slice 2.

## Slice 2: local side

### Task 3: Dexie upgrade and sync policy (M)

New Dexie version: tables `lessonResets` (`[familyId+childId+lessonId]`) and `syncState` (`[familyId+childId]`, holding `localRev`, `syncedRev`, `etag`, `lastSyncAt`, `lastError`); `profiles.updatedAt` (upgrade sets it to `createdAt`); `overviewSeen:*` settings turn from `true` into the upgrade time (readers in `db.ts` accept both). `updateProfile` and `buildProfile` set `updatedAt`. `SYNC_POLICY: Record<TableName, …>` classifies every table as synced or local-only, so a new table fails typecheck. `lessonResets` is classified in `LESSON_RESET_POLICY` as kept (it is the marker itself).

Acceptance:
- [ ] A database created at version 2 with fixture records opens at the new version with every old record intact (test with `fake-indexeddb`).
- [ ] `tests/progress/reset.test.ts` still passes, and its rule about tables with a `lessonId` index covers `lessonResets`.
- [ ] `listOverviewsSeen` returns the same lessons before and after the upgrade.

Verify: `pnpm test tests/progress && pnpm typecheck`

Files: `src/progress/db.ts`, `src/progress/hooks.ts` (profile `updatedAt` only), `src/progress/reset.ts` (policy entry only), `src/sync/policy.ts`, `tests/progress/db.test.ts`, `tests/sync/policy.test.ts`.

### Task 4: reset tombstone and dirty counter (M)

`resetLessonProgress` writes `lessonResets` in the same transaction as the erase, using the corrected clock (a `syncClock()` that adds the stored offset; offset 0 until the first sync). Dexie `creating`/`updating`/`deleting` hooks on every synced table bump `syncState.localRev` of that child, except inside a transaction marked as a sync write.

Acceptance:
- [ ] Reset test: tombstone exists with the reset time; erase and tombstone are one transaction (a forced failure leaves neither).
- [ ] Each write function in `src/progress/record.ts`, `db.ts` and `hooks.ts` bumps `localRev` (one test per write path, driven from `SYNC_POLICY` so a new table is covered automatically).
- [ ] A sync-marked transaction does not bump it.
- [ ] Device-scope settings (`_device` child id) never bump a child's counter.

Verify: `pnpm test tests/progress tests/sync`

Files: `src/progress/reset.ts`, `src/sync/dirty.ts`, `src/sync/clock.ts`, `src/progress/db.ts` (hook registration), tests beside them.

### Task 5: Dexie to doc conversion and apply-back (M)

`readChildDoc(db, childId, familyId)`, `readProfileDoc(db, familyId)`, `applyChildDoc(db, doc)`, `applyProfileDoc(db, doc)`. Records stay under `familyId: "local"` locally (`spec.md`, "Design choices", item 2). Apply-back runs in one sync-marked transaction and deletes local records the tombstones drop.

Acceptance:
- [ ] Round trip: Dexie records to doc to an empty Dexie gives the same records (minus attempts beyond 500, which stay only on the source).
- [ ] Apply-back never deletes a local attempt that is not dropped by a tombstone.
- [ ] Applying a doc with a reset removes the lesson's older local records and keeps the sticker.

Verify: `pnpm test tests/sync/local.test.ts`

Files: `src/sync/local.ts`, `tests/sync/local.test.ts`.

### Checkpoint 2

- [ ] Gate green, coverage held; app still runs with no sync code reachable from screens (`pnpm build` in a separate worktree, not the owner's `.next`, per `docs/operations.md`).

## Slice 3: server

### Task 6: family id from `FAMILY_CODES` and the origin helper (S)

Parse entries `<familyId>:<code>` (slug `^[a-z0-9-]{3,32}$`), bare codes still accepted for the gate. `resolveFamily(config, token)` returns the family id of the matching entry or `null`. Move `sameOrigin` from `src/app/api/session/route.ts` to `src/access/origin.ts`, reused by both routes. Depends on Q1.

Acceptance:
- [ ] Existing gate tests pass unchanged; a cookie issued before the change resolves to the named family after it.
- [ ] Duplicate family ids or a bad slug close the gate with a clear reason (same style as `readAccessConfig`).
- [ ] `.env.example` documents the named form.

Verify: `pnpm test tests/access`

Files: `src/access/env.ts`, `src/access/session.ts` (resolve helper), `src/access/origin.ts`, `src/app/api/session/route.ts` (import only), `.env.example`, `tests/access/*`.

### Task 7: `BlobStore` with memory and folder adapters (M)

Interface from `spec.md`, "Storage adapter"; `syncKey` as the only key builder; `memory` and `fs` adapters; `readSyncStoreConfig(env)` that refuses `fs`/`memory` in production. One shared contract test suite run against every adapter (later also R2).

Acceptance:
- [ ] Contract: create with `ifNoneMatch: "*"` fails when the key exists; `ifMatch` with a stale etag returns `conflict`; conditional GET returns `unchanged`.
- [ ] `syncKey` cannot produce a key outside `progress/<familyId>/` or `snapshots/<familyId>/` for any input that passed validation (test with hostile strings).
- [ ] The fs adapter writes under the given folder only; the folder is gitignored (`.sync-store/`).

Verify: `pnpm test tests/sync/store`

Files: `src/sync/store/{types,keys,memory,fs,config}.ts`, `tests/sync/store/*`, `.gitignore`.

### Task 8: `/api/sync` GET (S)

Route skeleton: auth via cookie and `resolveFamily`, `sync-unavailable` / `no-gate` answers, query validation, GET with `known`, `serverTime`, `Cache-Control: no-store`, `Sec-Fetch-Site` check, a stored doc failing the schema answers `stored-invalid`.

Acceptance:
- [ ] API tests with the memory store: no cookie (401 from the proxy decision), other family's child (403 or 404, never data), unknown child, `unchanged`, `doc: null`.
- [ ] No doc content in logs (test spies on `console`).

Verify: `pnpm test tests/api/sync-get.test.ts`

Files: `src/app/api/sync/route.ts`, `src/sync/server.ts`, `tests/api/sync-get.test.ts`.

### Task 9: `/api/sync` PUT (M)

Origin check, body size cap before parsing, zod, header ids match, child listed in the profile doc (60-second per-instance cache), future timestamps clamped, conditional write, 412 with current `{doc, etag}`, 409 `upgrade-required`, 413, per-family rate limit (30 per minute per instance).

Acceptance:
- [ ] Two interleaved clients on the memory store: the second gets 412 with the first one's doc; after merge and retry both writes are in the stored doc.
- [ ] Wrong origin 403; oversized body 413 without parsing; lower version 409; child not in profile 403 `child`; 31st request in a minute 429 with `retry-after`.
- [ ] A doc with a timestamp a day in the future is stored with server time.

Verify: `pnpm test tests/api/sync-put.test.ts`

Files: `src/app/api/sync/route.ts`, `src/sync/server.ts`, `src/access/rate-limit.ts` (reuse or generalise, no behaviour change for unlock), `tests/api/sync-put.test.ts`.

### Task 10: daily snapshot (S)

Before the first child-doc PUT of a Vietnam day, copy the stored doc to `snapshots/<familyId>/<childId>/<yyyy-mm-dd>.json` with `If-None-Match: *`. Failure is logged and never blocks. Depends on Q5 (default yes).

Acceptance:
- [ ] First PUT of a day creates the snapshot of the state before it; later PUTs that day do not change it; a failing snapshot write still returns 200 for the main write.
- [ ] Day key from server time in `Asia/Ho_Chi_Minh` (test with a fake clock across midnight VN).

Verify: `pnpm test tests/api/sync-snapshot.test.ts`

Files: `src/sync/server.ts`, `tests/api/sync-snapshot.test.ts`.

### Checkpoint 3

- [ ] Gate green. Main session runs a local gate server on a free port with `FAMILY_CODES=test-family:<code>`, `SESSION_SECRET=<32 chars>`, `SYNC_STORE=fs:.sync-store` and checks GET/PUT/412 with `curl` and a cookie from `/api/session`; stops that server by its PID.

## Slice 4: client engine and triggers

### Task 11: sync engine (M)

`syncNow()`: skip when sync is unavailable; profile doc first, then each local child: GET (with `known` when not dirty), migrate, merge with the local doc, trim, PUT with `ifMatch` or `ifNoneMatch`, up to 3 rounds on 412, apply the merge back, update `syncState` (`syncedRev`, `etag`, `lastSyncAt`, `lastError`), store the clock offset, record `syncFamilyId` on first success, stop on family mismatch (`spec.md`, "Offline, family switch, first sync"). No PUT when the merged doc equals the stored one.

Acceptance:
- [ ] Unit tests with a fake fetch backed by the memory store: first sync from a device with local data; second device pulls; conflict path; offline (fetch throws) keeps dirty; `too-new` stops without writing; 401 stops; `sync-unavailable` disables silently.
- [ ] Writes made during a sync stay dirty afterwards.

Verify: `pnpm test tests/sync/engine.test.ts`

Files: `src/sync/engine.ts`, `src/sync/client.ts` (fetch wrapper), `tests/sync/engine.test.ts`.

### Task 12: triggers and mount (M)

`requestSync(reason)` with a short debounce; a client `SyncRunner` that starts the 5-minute timer, listens to `online` and `visibilitychange` (hidden: sync with `keepalive` fetch), and holds a Web Locks lock `tutor-sync` (falls back to no lock). Call sites: after `completeSection` succeeds (in `src/learn/section-player.tsx`) and when a review session finishes (`src/learn/review-player.tsx`), one line each. Mounted once in `src/app/(child)/layout.tsx` and on the parent screen. Nothing visible to the child.

Acceptance:
- [ ] Component test with fake timers: timer, online, hidden and the two call sites each trigger one sync; repeated triggers inside the debounce give one sync.
- [ ] No child screen renders any sync text (test renders home and players and finds none).
- [ ] `git status` checked before editing `src/learn/*` and the layout (see rules above).

Verify: `pnpm test tests/sync/runner.test.tsx tests/learn`

Files: `src/sync/runner.tsx`, `src/sync/request.ts`, `src/learn/section-player.tsx`, `src/learn/review-player.tsx`, `src/app/(child)/layout.tsx`, `src/components/parent/parent-screen.tsx`, tests.

### Checkpoint A

- [ ] Owner can open two browsers (normal and private window) on a local gate server with the fs store and see progress move between them. Main session writes the exact commands into this file when it gets here.

## Slice 5: parent page

### Task 13: last sync line, stuck message, family switch guard (M)

On the parent page: "Đồng bộ lần cuối: <thời gian>" per device; plain messages for: not sent for more than 1 day while dirty, doc too large, app too old, cookie rejected; the family switch guard with export buttons and "Dùng máy này cho gia đình mới" (two-step confirmation, `Sheet`, like the reset dialog). Vietnamese text, tokens from `docs/design-system.md`, touch targets ≥ 48px.

Acceptance:
- [ ] Component tests for each message state and for both guard branches (dirty: only export offered; clean: clear and pull after two confirmations; cancel at any step deletes nothing).
- [ ] `pnpm test:e2e e2e/parent.spec.ts` still passes on `ipad` and `phone`.

Verify: `pnpm test tests/components/parent && pnpm test:e2e e2e/parent.spec.ts`

Files: `src/components/parent/sync-status.tsx`, `src/components/parent/family-switch-dialog.tsx`, `src/components/parent/parent-dashboard.tsx`, tests.

### Task 14: import backup JSON (M)

Button "Nhập bản sao lưu" next to the existing export on the parent page (behind the PIN like the rest of the page). Accepts the export file (versions 1 and 2) and a child progress doc (a restored snapshot). Shows child name, export date and record counts before merging; merges with `mergeChildDocs` (never overwrites); creates the profile if its id is not on the device; summary line with how many records were added and how many were skipped because of a later reset. Export moves to version 2 (adds `resets` and `overviewSeen` times). File size limit 5 MB.

Acceptance:
- [ ] Importing the same file twice changes nothing the second time.
- [ ] A malformed file, a wrong `format`, a newer version or an oversized file shows a plain error and writes nothing.
- [ ] Import bumps the dirty counter, so the next sync sends it.
- [ ] Unit tests for the parser and the import function; component test for the preview and summary.

Verify: `pnpm test tests/progress/parent-data.test.ts tests/sync/import.test.ts tests/components/parent`

Files: `src/progress/parent-data.ts`, `src/sync/import.ts`, `src/components/parent/import-backup.tsx`, `src/components/parent/child-report.tsx` (button placement only), tests.

## Slice 6: verification

### Task 15: two-device E2E (M)

A second gate dev server with the fs store (new `SYNC_*` entries in `e2e/targets.ts`, like `GATE_*`), two browser contexts as two devices. Scenarios: (1) create profile and finish a section on A, B shows it after reload; (2) B offline (`context.setOffline(true)`), study, back online, A sees it; (3) reset a lesson on A from the parent page, B had progress on it before the reset, both show it reset after syncing while B's later study is kept; (4) import a backup on A, B receives it; (5) a context with a cookie of another family sees none of it. Run on `ipad` and `phone`. The fs store folder is created fresh per run and deleted after.

Acceptance:
- [ ] All five scenarios pass on both targets, three runs in a row (no flake).
- [ ] No request leaves localhost (Playwright route guard fails the test on any other host).

Verify: `pnpm test:e2e e2e/sync.spec.ts`

Files: `e2e/sync.spec.ts`, `e2e/targets.ts`, `playwright.config.ts` (second server entry).

### Task 16: security review (fresh agent, Opus) (S)

A new agent that did not write the code reviews the whole sync diff against `spec.md` section "Security" and its threat model: auth and family resolution, key building, origin, size caps, schema strictness, rate limit, logging, env handling, client bundle (no `R2_*` names: build in a separate worktree and grep `.next/static`), dependency audit of new packages. Writes findings with severity into this file under "Security review"; fixes go back to new tasks, not into the review session.

Acceptance:
- [ ] Review recorded with each finding's severity, file and line.
- [ ] No Critical or High finding left open before Task 17.

Verify: the review section exists; re-run of the tests named by any fix.

Files: this file only (review), fixes in follow-up tasks.

### Checkpoint B

- [ ] Owner reviews E2E evidence and the security review. Nothing has touched the cloud yet.

## Slice 7: R2 and rollout

### Task 17: R2 adapter and real-R2 integration test (M, owner approval for the external parts)

`r2` adapter with `aws4fetch` (new dependency) over the S3 API, conditional GET and PUT, reading `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`. Unit tests with a mocked fetch. `pnpm test:r2` runs the shared contract suite against a real bucket from `.env.local`.

External, each needs the owner's yes (Q7): owner creates bucket `tutor-progress-dev` and a token with Object Read & Write on that bucket only, puts the four variables in `.env.local`; then, on approval, the agent runs `pnpm test:r2` once. The test writes and deletes only keys under `progress/test-<random>/` in the dev bucket.

Acceptance:
- [ ] Contract suite passes on memory, fs and (approved run) R2, including 412 on stale `If-Match` and on `If-None-Match: *`.
- [ ] Missing variables make `test:r2` skip with a message, never fail the normal gate.

Verify: `pnpm test tests/sync/store` (always); `pnpm test:r2` (only with approval).

Files: `src/sync/store/r2.ts`, `tests/integration/r2-store.test.ts`, `package.json` (`test:r2`, `aws4fetch`).

### Task 18: docs and smoke check (S)

Update `docs/spec.md` ("Tiến độ và đồng bộ", "Truy cập và bảo mật": named family codes, PIN per device, synced settings), `docs/architecture.md` (new `src/sync/` module, checks table rows), `docs/operations.md` (env table rows, how to create the bucket, token and lifecycle rule, token rotation, restore a child from a snapshot via the import button, billing notification), `README.md` if commands changed. Add a smoke check to `scripts/lib/deploy-prod.ts`: `GET /api/sync?doc=profile` without cookie answers 401.

Acceptance:
- [ ] Docs name no task numbers or planning jargon; grep for `Task `, `Slice`, `Checkpoint` in `docs/` finds none from this work.
- [ ] `tests/scripts/deploy-prod.test.ts` covers the new smoke check.

Verify: `pnpm test tests/scripts/deploy-prod.test.ts && pnpm lint`

Files: `docs/spec.md`, `docs/architecture.md`, `docs/operations.md`, `scripts/lib/deploy-prod.ts`, `tests/scripts/deploy-prod.test.ts`.

### Task 19: production rollout (owner runs or approves each step)

In this order, each step approved by the owner for this release:

1. Owner creates the private bucket `tutor-progress` (public access off, no custom domain), lifecycle rule deleting `snapshots/` after 180 days, and a Cloudflare usage notification (Q6).
2. Owner creates an R2 token with Object Read & Write on `tutor-progress` only.
3. Owner sets on Vercel, Production, Sensitive: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`, and rewrites `FAMILY_CODES` as named entries (Q1). The codes themselves stay the same, so no device re-enters a code.
4. On approval: `pnpm deploy:prod` from the verified commit, per `docs/operations.md`; smoke checks pass, including the new 401 check.
5. Owner smoke on two real devices (iPad Safari and the Home Screen app): study one section on one, see it on the other; the parent page shows the last sync time.

Acceptance:
- [ ] Steps 1 to 5 done, results written here with dates and the deployed commit.
- [ ] One week later: R2 and Vercel usage read from the dashboards, inside free tiers.

### Checkpoint C

- [ ] Backlog index updated; leftovers listed here; folder archived with `git mv` to `notebooks/backlogs/archive/progress-sync/` with an "Archived: …" line; offline precache and `/install` opened as their own backlog if the owner wants it (Q8).

## Security review

Empty until Task 16.
