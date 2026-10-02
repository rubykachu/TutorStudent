# Tasks: progress sync across devices

Spec: `spec.md`. Plan and dependency graph: `plan.md`. Status: not started; the owner's decisions are in `spec.md` section 10, no question is open.

## Handover

Slices 1 to 6 are built, and the R2 adapter (Task 17), the security review (Task 18) and the docs (Task 19) are done. Next: Checkpoint B (owner reads the E2E evidence and the "Security review" section), then Task 20 (rollout, owner approvals). Working tree was clean after the last commit unless the list below says otherwise.

### Done (commits, oldest first)

- `e85bdc1`, `5791b5b` Task 11: the engine. `src/sync/cycle.ts` (one doc), `docs.ts` (adapters), `state.ts`, `client.ts`, `overwrite.ts`, `engine.ts` (`createSyncEngine(...).run({ full? })`). Tests `tests/sync/cycle.test.ts`, `engine.test.ts`, helpers `tests/sync/network.ts` (fake fetch answered by the real service over the memory store) and `devices.ts`.
- `bd2bc6c` Task 12: `src/sync/scheduler.ts` (pure: one run at a time, a debounce of `SYNC_DEBOUNCE_MS`, a request during a run answered by one more run, nothing acts before a runner calls `start`), `src/sync/request.ts` (the app's engine and scheduler, `requestSync`, `syncNow`, `startSync`, Web Locks lock `tutor-sync` with `ifAvailable`, no lock when the API is missing), `src/sync/runner.tsx` (`SyncRunner`: full sync at start after `restoreClockOffset`, timer, `online`, `visibilitychange` hidden; draws nothing). Mounted in `src/app/(child)/layout.tsx` and `src/components/parent/parent-screen.tsx`. Call sites: `section-player.tsx` `advance` after `completeSection`, `review-player.tsx` effect when the session is over. Tests `tests/sync/scheduler.test.ts`, `runner.test.tsx`, `lock.test.ts`, `tests/learn/sync-triggers.test.tsx`.
- `d05ce63` Task 13: `src/sync/history-pull.ts` (`pullHistory`, `pendingMonths`; newest first, one request at a time, `SYNC_HISTORY_PULL_PER_MINUTE` pacing, one lock per request, stops on `ENDS_RUN` failures, a missing month stays pending), started from `request.ts` after every run that ended `synced` or `partial` (own background job, never holds the scheduler). `src/components/parent/history-loading.tsx` placed after `StudyTime` in `child-report.tsx`. Tests `tests/sync/history-pull.test.ts`, `tests/components/parent/history-loading.test.tsx`.
- `18e66bd` Task 14: `src/sync/status.ts` (`readSyncStatus`, `syncMessages`, `isFamilyMismatch`, `hasUnsentWork`), `src/sync/family-switch.ts` (`clearLocalFamilyData`: every table cleared except `settings`, which loses child rows and the family and active-profile device keys; the PIN and clock offset stay), `src/components/parent/sync-status.tsx` (placed under the header note of `parent-dashboard.tsx`; hidden until a server with sync on has answered), `family-switch-dialog.tsx`, `export-backup-button.tsx` and `panel.tsx` (pulled out of `child-report.tsx` so the guard shares them). Tests `tests/sync/status.test.ts`, `tests/components/parent/sync-status.test.tsx`; `e2e/parent.spec.ts` passes on both targets.
- `b7883e7` flaky unlock E2E fix (test-only).
- `16dbb41` fix found while testing the import: `HistoryDocSchema` threw `RangeError` on a record whose time does not parse (a hostile PUT would have answered 500 instead of 400); the month check now skips such a record, which its own time check already reports. Tests `tests/sync/schema-bad-time.test.ts`, `tests/api/sync-put.test.ts`.
- `e9662ce` Task 15: `src/sync/import.ts` (`readBackup`: size limit, JSON, export versions 1 and 2, snapshot of a child doc, strict validation through the doc schemas, nothing written; `importBackup`: profile when missing, state through `mergeChildDocs` and `applyChildDoc`, months through `applyHistoryDoc`, which now returns how many records it added), `src/components/parent/import-backup.tsx` (button, file input, preview sheet, summary; starts a full sync after an import), export moved to version 2 in `src/progress/parent-data.ts` (`resets`), `BACKUP_IMPORT_MAX_BYTES` in config. Tests `tests/sync/import.test.ts`, `tests/components/parent/import-backup.test.tsx`, `tests/progress/parent-data.test.ts`.
- `cff121d` creating or editing a profile, choosing a grade and resetting a lesson now also call `requestSync()` (found by the E2E: without it a profile or reset waited for the 5-minute timer). Tests in `tests/app/(child)/profiles-screen.test.tsx`, `grades-screen.test.tsx`, `tests/components/parent/reset-lesson.test.tsx`.
- `d95b099` Task 16: `e2e/sync.spec.ts` (eight scenarios, `ipad` and `phone`), `e2e/sync-lab.ts` (devices, store reader, steps, backup builder), `SYNC_*` and `syncStoreDir()` in `e2e/targets.ts`, third server in `playwright.config.ts` (`.next-sync`, named `FAMILY_CODES`, 18 families: one per scenario and target plus one stranger per target). Run: `pnpm test:e2e e2e/sync.spec.ts`. 42 of 42 passed with learn, review, parent, unlock and sync together at `--workers=2`.
- `e0984af` fix for the known flake: `withSyncLock` took the lock with `ifAvailable` for every caller, so an engine run asked for while this tab's history pull held it (or another tab synced) was skipped and not retried. The engine run now waits for the lock (`withSyncLock(task, { wait: true })`); the history pull keeps `ifAvailable` and skips a request while a sync holds it. One run at a time is unchanged (the lock is still exclusive). Tests `tests/sync/request-lock.test.ts` (fails on the old code: the second run finished without running), `lock.test.ts`.
- `8eabfc0` Task 17: `src/sync/store/r2.ts` (`createR2Store`, `R2Error`, `bareEtag`), `readSyncStoreConfig` reads the four `R2_*` variables (`R2_ENV_NAMES`; none set: off with no reason; some missing or malformed: off, the reason names variables only; `SYNC_STORE` outside production still wins so a test server never reaches the bucket), `SYNC_STORE_TIMEOUT_MS`, `.env.example`. Dependency `aws4fetch` 1.0.20 (MIT, no dependencies; the full AWS SDK would add dozens of packages for four calls). Requests are signed with `AwsClient.sign` and sent with `fetch` in the adapter, because `AwsClient.fetch` retries on its own and a retried write could land twice. Mapping: 304 `unchanged`, 404 `null`, 412 and 409 `conflict` (409 is S3's concurrent conditional write), 404 under `If-Match` `conflict`, anything else `R2Error(status, code)` with no body or credentials. The contract suite (`tests/sync/store/contract.ts`, now with `root` and `scoped` options) runs on a fake bucket (`fake-s3.ts`, signed requests answered like S3). `pnpm test:r2` runs `tests/integration/r2-store.test.ts`: flag `TUTOR_R2_SMOKE=1` set by the script, loads `.env.local`, skips with a message when the variables are missing, every key under `test/<run-id>/` through `createTestStore`, deletes only keys it wrote. It has not been run.
- `430890a` parent page copy about where progress lives (`src/components/parent/progress-location.tsx`), `7abb3a0` deploy smoke check `sync 401 without cookie`, `802ce76` Task 19 docs (`docs/spec.md` 5.7 to 5.9 and the test table, `docs/architecture.md`, `docs/operations.md` with the rollout runbook, `README.md`).
- Task 18 security review (fresh Opus agent): findings in "Security review" below, no Critical or High. Fixes made in the same session, at the owner's request in the brief (Task 18 had said "fixes go to new tasks"): `77b63ef` store exceptions answer JSON 500 `server` and log status and code only (`tests/api/sync-store-failure.test.ts`); `0aadf35` ids that are names of `Object.prototype` refused (`tests/sync/schema.test.ts`); `e6a8f20` future times of an imported backup clamped to now (`tests/sync/import.test.ts`); `8a8bf91` `scripts/bundle-check.ts` as the last step of `pnpm build` (`tests/scripts/bundle-check.test.ts`, row in `docs/architecture.md`, line in `docs/spec.md`).
- Gate green for each commit (`pnpm format && pnpm lint && pnpm typecheck && pnpm test`; `tests/scripts/sources-import.test.ts` can time out under load, passes alone).

### Next steps, in order

1. Checkpoint B: owner reviews the E2E evidence and the security review. Open Low findings are listed there; none blocks the rollout.
2. Task 20: rollout, each step approved by the owner. The runbook is in `docs/operations.md`, "Bật đồng bộ lần đầu". `pnpm test:r2` only on the owner's yes.

### Deviations from the spec

- The cycle lives in `src/sync/cycle.ts` and the adapters in `src/sync/docs.ts`, `state.ts`, `overwrite.ts`; `engine.ts` holds only the orchestration.
- Routine syncs always do a conditional GET of the current and previous month, so a device sees the other device's answers of the current month; each is a cheap `unchanged` answer.
- The server answers a stored doc of a newer version with 500 `stored-invalid` when read by an older server; the client's `too-new` case only arises when a newer server answers an older client.
- A month empty on both sides records nothing in `syncState`.
- A snapshot import takes the state only (a snapshot has no answers); an export's child joins the device's records of the same id, and the device's own profile is kept when it already exists.
- E2E store folder: it lies in the system temp folder (the dev server reloads pages when a file inside the project changes) and is not deleted after the run: the owner forbade deleting files for that session, so each run leaves one `tutor-sync-e2e-*` folder. Add the deletion in `e2e/sync-lab.ts` or a global teardown when allowed. "Offline" for device B is the sync API refused by a route (`context.setOffline` would also stop lazy-loaded visuals), and the section B studies is the first one: the fixture's second section has exercises the E2E helpers cannot answer, so scenario 3 keeps a saved position there as B's later study. History of scenario 7 and 8 is seeded by importing a backup file (the page clock cannot backdate once a sync has measured the clock offset).
- `requestSync()` takes no reason argument (nothing would read it).
- The history pull is not part of `engine.run`: it runs as its own background job so its pacing never holds back a sync.
- A month the cloud lists but does not hold (its push failed) stays pending, so the parent page's loading line stays until it appears.

### Known flakes

- `e2e/sync.spec.ts`: fixed in `e0984af` (see Done): a run skipped because this tab's history pull held the lock. Pass rate after the fix: `e2e/sync.spec.ts` at `--workers=2` (16 tests, `ipad` and `phone`), 15 runs in a temporary worktree on port 3560: 14 runs fully green (239 of 240 tests). The one failing run was a page that never showed the section step after the tap (`[data-section-step]` missing for 5 s, before any sync), during a full `pnpm test` on the same machine; it is a load failure of a lazy page, not a lost sync. No run lost a sync after the fix.
- `tests/scripts/sources-import.test.ts` can time out (5 s) when the whole suite runs under load; it passes alone.

## Rules for every task

- One Sonnet subagent per task (or per pair of S tasks), started from this file; the security review runs on Opus in a fresh agent.
- Gate before each commit: `pnpm format && pnpm lint && pnpm typecheck && pnpm test` (plus `pnpm content:check` only if content or schema of lessons changed, which no task here does). Small commits, own paths only, never `git add -A`, never push.
- No external call (Cloudflare, Vercel, R2) unless the task says "owner approval" and the owner said yes for that run. Every automated test uses the in-memory or folder store, never R2.
- Do not touch the owner's dev server; stop only processes you started, by PID.
- Before any task that edits files under `src/components/` or `src/learn/`, run `git status` and check no other agent has uncommitted changes in those files; if one does, stop and report.
- Out of scope for every task: the public media bucket and `pnpm media:upload`, video and narration files under `public/media/`, lesson content, brand files (`src/lib/brand.ts`, `src/app/layout.tsx`, `public/brand/`), media players, bottom bar, offline precache and service worker, the parent PIN mechanism.
- Scope sizes: S = 1 to 2 files plus tests, M = 3 to 5 files plus tests.

## Slice 1: merge core

### Task 1: doc schemas, versions and migration (S)

Zod schemas for the family profile doc, the main child doc and the history doc of one month (`spec.md`, "Doc shapes"), `migrateDoc` (version 1 only for now, structure ready for steps), a canonical form (arrays sorted by key, fixed key order) used for equality and hashing, constants in `src/lib/config.ts`: `SYNC_DOC_MAX_BYTES` (1 MB), `SYNC_HISTORY_MAX_BYTES` (512 KB), `SYNC_DOC_WARN_RATIO` (0.7), `SYNC_MAX_PROFILES` (12), `SYNC_WRITING_MAX_CHARS` (5 000), `SYNC_INTERVAL_MINUTES` (5), `SYNC_MAX_RETRIES` (3), `SYNC_FUTURE_SKEW_MINUTES` (10).

Acceptance:
- [x] Schemas are strict (unknown keys rejected), ids validated by regex, string and array lengths bounded (profiles ≤ 12).
- [x] A doc whose `version` is newer than the code knows is reported as `too-new`, not parsed as current.
- [x] A history record whose Vietnam-time month differs from the doc's `month` fails the schema.
- [x] Stored sample files `tests/sync/fixtures/child-v1.json`, `history-v1.json`, `profile-v1.json` parse.
- [x] The canonical form of a doc is the same whatever the order of its arrays.
- [x] `src/sync/**` added to the coverage `include` in `vitest.config.ts`.

Verify: `pnpm test tests/sync/schema.test.ts && pnpm typecheck`

Files: `src/sync/schema.ts`, `src/lib/config.ts`, `vitest.config.ts`, `tests/sync/schema.test.ts`, `tests/sync/fixtures/*`.

### Task 2: merge functions and history filter (M)

`mergeChildDocs`, `mergeProfileDocs`, `mergeHistoryDocs` and `visibleHistory` exactly as `spec.md` section 6.1 (main doc: tombstones applied to each side first, then the rule table; history: plain union, tombstones only when read). Nothing is trimmed.

Acceptance:
- [x] Every row of the rule table has its own unit test, including reset tombstone drops for cards, section `doneAt` and `position` separately, `overviewSeen`, and stickers, activity days and `historyMonths` kept; a record whose time equals the reset is dropped.
- [x] `mergeHistoryDocs` never drops a record, whatever the resets; `visibleHistory` hides attempts and writings of a reset lesson at or before the reset and keeps later ones.
- [x] The three-doc counterexample of section 6.1 (done at 5, in progress at 8, reset at 6) gives the same result in every merge order.
- [x] Property tests (generated docs with resets, equal timestamps and records on both sides of a reset; fixed seed): commutative, associative, idempotent, for all three doc kinds; and `visibleHistory(merge(a, b), r) == merge(visibleHistory(a, r), visibleHistory(b, r))`.
- [x] Card tie-break: equal `lastReviewAt` resolves by `reps`, then canonical JSON; same result in both argument orders.
- [x] Line coverage of `src/sync/merge.ts` ≥ 90%.

Verify: `pnpm test tests/sync/merge.test.ts && pnpm test --coverage`

Files: `src/sync/merge.ts`, `src/sync/history.ts`, `tests/sync/merge.test.ts`, `tests/sync/history.test.ts`. If a property-test library is added (e.g. `fast-check`), it is a dev dependency and the task says why in the commit.

### Checkpoint 1

- [ ] Gate green; merge rules reviewed against `spec.md` by the main session before slice 2.

## Slice 2: local side

### Task 3: Dexie upgrade and sync policy (M)

New Dexie version 3: tables `lessonResets` (`[familyId+childId+lessonId]`) and `syncState` (`[familyId+childId]`, holding `syncedHash`, `etag`, `lastSyncAt`, `lastError`, `docBytes`, and per month `{ hash, etag, applied }` in `months`); an index `[familyId+childId+at]` on `attempts` and `writings` so one month is read by range; `profiles.updatedAt` (upgrade sets it to `createdAt`); `sectionProgress.doneAt` (upgrade sets it to `updatedAt` for `done` records; `completeSection` sets it, `saveSectionPosition` keeps it); `overviewSeen:*` settings turn from `true` into `1970-01-01T00:00:00.000Z`, new marks store the time (readers in `db.ts` accept both). `buildProfile`, `updateProfile` and `setProfileGrade` set `updatedAt`. `SYNC_POLICY: Record<TableName, …>` classifies every table as synced or local-only, so a new table fails typecheck. `lessonResets` is classified in `LESSON_RESET_POLICY` as kept (it is the marker itself), `syncState` as unrelated.

Acceptance:
- [x] A database created at version 2 with fixture records (done and in-progress sections, `overviewSeen` true) opens at version 3 with every old record intact and the new fields set as above (test with `fake-indexeddb`).
- [x] `tests/progress/reset.test.ts` still passes, and its rule about tables with a `lessonId` index covers `lessonResets`.
- [x] `listOverviewsSeen` returns the same lessons before and after the upgrade.
- [x] Going through a done section again keeps `state` done and `doneAt` unchanged.

Verify: `pnpm test tests/progress && pnpm typecheck`

Files: `src/progress/db.ts`, `src/progress/record.ts` (`doneAt` only), `src/progress/hooks.ts` (profile `updatedAt` only), `src/progress/reset.ts` (policy entries only), `src/sync/policy.ts`, tests beside them.

### Task 4: reset tombstone, corrected clock, dirty by hash (M)

`resetLessonProgress` writes `lessonResets` in the same transaction as the erase. `now()` in `src/lib/time.ts` adds the stored clock offset (0 until the first sync; `setNowForTesting` still wins). `dirtyDocs(db, childId, months)` builds the child's main doc and the month docs asked for (Task 5's readers, or minimal ones if Task 5 is not merged yet), takes their canonical form and compares a non-cryptographic hash (e.g. `cyrb53`; no `crypto.subtle`, which is missing over plain http on the LAN) with the hashes in `syncState`. It checks the current and previous month by default and every local month when asked (app start, after an import). No Dexie hooks.

Acceptance:
- [x] Reset test: tombstone exists with the reset time; erase and tombstone are one transaction (a forced failure leaves neither).
- [x] With an offset set, `recordAttempt`, `saveSectionPosition`, `completeSection`, `resetLessonProgress` and `saveOpenEndedWriting` all store the corrected time.
- [x] Each write function in `src/progress/record.ts`, `db.ts`, `hooks.ts`, `writing.ts` and `reset.ts` makes the right doc dirty (an answer: the main doc and its month; a reset: the main doc only, never an old month); the sound switch and device-scope settings (`_device`) do not.
- [x] Hash of the same doc is stable across runs and argument orders.

Verify: `pnpm test tests/progress tests/sync tests/lib`

Files: `src/progress/reset.ts`, `src/lib/time.ts`, `src/sync/dirty.ts`, `src/sync/hash.ts`, tests beside them.

### Task 5: Dexie to doc conversion and apply-back (M)

`readChildDoc(db, childId, familyId)`, `readHistoryDoc(db, childId, familyId, month)`, `readProfileDoc(db, familyId)`, `applyChildDoc(db, doc)`, `applyHistoryDoc(db, doc, resets)`, `applyProfileDoc(db, doc)`. Records stay under `familyId: "local"` locally (`spec.md`, "Design choices", item 2). Apply-back runs in one transaction per child: re-reads the local records, merges them with the given doc, writes the result, deletes local records the tombstones drop, sets section `state` from `doneAt`. `applyHistoryDoc` adds the records `visibleHistory` keeps and never deletes one.

Acceptance:
- [x] Round trip: Dexie records to main doc and month docs to an empty Dexie gives the same records.
- [x] Apply-back never deletes a local attempt that is not dropped by a tombstone.
- [x] Applying a main doc with a reset removes the lesson's older local records and keeps the sticker; applying an old month afterwards does not bring the lesson's earlier answers back.
- [x] An answer recorded between reading the doc and applying the merge (card state and section position) is still there after apply-back.

Verify: `pnpm test tests/sync/local.test.ts`

Files: `src/sync/local.ts`, `src/sync/local-history.ts`, `tests/sync/local.test.ts`.

### Checkpoint 2

- [x] Gate green, coverage held; app still runs with no sync code reachable from screens (`pnpm build` in a separate worktree, not the owner's `.next`, per `docs/operations.md`).

## Slice 3: server

### Task 6: family id from `FAMILY_CODES` and the origin helper (S)

Parse entries `<familyId>:<code>` (slug `^[a-z0-9-]{3,32}$`), splitting at the first `:` before normalising the code; bare codes still accepted for the gate. A family may have several entries; the same normalised code under two family ids, or a bad slug, closes the gate with a clear reason (same style as `readAccessConfig`). `resolveFamily(config, token)` returns the family id of the matching entry or `null`. Move `sameOrigin` from `src/app/api/session/route.ts` to `src/access/origin.ts`, reused by both routes. The deploy smoke check (`scripts/lib/deploy-prod.ts`, which today takes `FAMILY_CODES.split(",")[0]`) reads the first code through the same parser.

Acceptance:
- [x] Existing gate tests pass unchanged; a cookie issued for a bare code before the change resolves to the named family after the entry gains a name.
- [x] Two entries with the same family id both resolve to it; one code under two ids closes the gate.
- [x] `tests/scripts/deploy-prod.test.ts` logs in with the code part of a named entry.
- [x] `.env.example` documents the named form.

Verify: `pnpm test tests/access tests/scripts/deploy-prod.test.ts`

Files: `src/access/env.ts`, `src/access/session.ts` (resolve helper), `src/access/origin.ts`, `src/app/api/session/route.ts` (import only), `scripts/lib/deploy-prod.ts`, `.env.example`, `tests/access/*`, `tests/scripts/deploy-prod.test.ts`.

### Task 7: `BlobStore`, key builder, memory and folder adapters (M)

Interface from `spec.md`, "Storage adapter"; `syncEnvPrefix(env)` (`prod` only when `VERCEL_ENV === "production"`, `dev` otherwise) and `syncKey` as the only key builder; a separate test-store constructor that takes a `test/<run-id>/` prefix and refuses anything else; `memory` and `fs` adapters; `readSyncStoreConfig(env)` that refuses `fs`/`memory` in production. One shared contract test suite run against every adapter (later also R2).

Acceptance:
- [x] Contract: create with `ifNoneMatch: "*"` fails when the key exists; `ifMatch` with a stale etag returns `conflict`; conditional GET returns `unchanged`; `delete` refuses a key outside the store's `test/` prefix.
- [x] `syncKey` builds the four key kinds of `spec.md` section 4 (profile, main, `<childId>/history/<yyyy-mm>.json`, snapshot) and cannot produce a key outside `<env>/progress/<familyId>/` or `<env>/snapshots/<familyId>/` for any input that passed validation (test with hostile strings, including a month like `../x`).
- [x] For every combination of `NODE_ENV` (unset, development, test, production) and `VERCEL_ENV` (unset, development, preview), no key starts with `prod/`; only `VERCEL_ENV=production` gives `prod/`. The test-store constructor refuses `prod/…`, `dev/…`, `` and `../`.
- [x] The fs adapter writes under the given folder only; the folder is gitignored (`.sync-store/`).

Verify: `pnpm test tests/sync/store`

Files: `src/sync/store/{types,keys,memory,fs,config}.ts`, `tests/sync/store/*`, `.gitignore`.

### Task 8: `/api/sync` GET (S)

Route skeleton: auth via cookie and `resolveFamily`, `sync-unavailable` / `no-gate` answers, query validation (`doc=profile`, `child`, `child` + `month`; a month after the current Vietnam month is refused), GET with `known`, `serverTime`, `Cache-Control: no-store`, `Sec-Fetch-Site` check, a stored doc failing the schema answers `stored-invalid`.

Acceptance:
- [x] API tests with the memory store: no cookie (401 from the proxy decision), a cookie whose code was removed (401), other family's child (403 or 404, never data), unknown child, `unchanged`, `doc: null` for a missing month, a future month (400), cross-site `Sec-Fetch-Site` (403).
- [x] No doc content in logs (test spies on `console`).

Verify: `pnpm test tests/api/sync-get.test.ts`

Files: `src/app/api/sync/route.ts`, `src/sync/server.ts`, `tests/api/sync-get.test.ts`.

### Task 9: `/api/sync` PUT (M)

Origin and content-type check, body size cap while reading (by doc kind), zod, header ids match, child listed in the profile doc (60-second per-instance cache, re-read from the store on a miss before refusing), future timestamps clamped and the stored doc returned when clamped, conditional write, 412 with current `{doc, etag}`, 409 `upgrade-required`, 409 `shrink` for a history doc missing a stored record id, 413, per-family rate limit (30 PUTs and 120 GETs per minute per instance).

Acceptance:
- [x] Two interleaved clients on the memory store, for the main doc and for one month doc: the second gets 412 with the first one's doc; after merge and retry both writes are in the stored doc.
- [x] A history PUT that drops a stored attempt gets 409 `shrink`; a record outside its doc's month gets 400 (a clamp never moves a record out of the month: the target month is at most the current one, so the clamped time is in it).
- [x] Wrong origin 403; `text/plain` body 400; oversized body 413 without parsing; lower version 409; child not in profile 403 `child`; 31st request in a minute 429 with `retry-after`.
- [x] A child PUT right after its profile was added through another server instance (stale cache) succeeds.
- [x] A doc with a timestamp a day in the future is stored with server time and the 200 body carries the stored doc.

Verify: `pnpm test tests/api/sync-put.test.ts`

Files: `src/app/api/sync/route.ts`, `src/sync/server.ts`, `src/access/rate-limit.ts` (reuse or generalise, no behaviour change for unlock), `tests/api/sync-put.test.ts`.

### Task 10: daily snapshot (S)

Main doc only (history docs are append-only, `spec.md` section 5 step 7). Before the first main-doc PUT of a Vietnam day, copy the stored doc to `<env>/snapshots/<familyId>/<childId>/<yyyy-mm-dd>.json` with `If-None-Match: *`; each instance remembers the days already done. Failure is logged and never blocks.

Acceptance:
- [x] A history PUT never creates a snapshot.
- [x] First main-doc PUT of a day creates the snapshot of the state before it; later PUTs that day do not change it; a failing snapshot write still returns 200 for the main write.
- [x] Day key from server time in `Asia/Ho_Chi_Minh` (test with a fake clock across midnight VN).

Verify: `pnpm test tests/api/sync-snapshot.test.ts`

Files: `src/sync/server.ts`, `tests/api/sync-snapshot.test.ts`.

### Checkpoint 3

- [x] Gate green. Main session runs a local gate server on a free port with `FAMILY_CODES=test-family:<code>`, `SESSION_SECRET=<32 chars>`, `SYNC_STORE=fs:.sync-store` and checks GET/PUT/412 with `curl` and a cookie from `/api/session`; stops that server by its PID.

## Slice 4: client engine and triggers

### Task 11: sync engine (M, two commits)

`syncNow()`, built in two commits:

1. One doc's cycle, the same for profile, main and month docs: GET with `known` when an etag is stored, migrate, merge with the local doc, PUT with `ifMatch` or `ifNoneMatch` (none when the merged doc equals the stored one), up to 3 rounds on 412 with a random wait of 100 to 500 ms, apply-back (Task 5), apply the stored doc instead when the PUT answer carries one.
2. Orchestration: skip when sync is unavailable; profile doc first, then for each local child the dirty month docs (oldest first, so a month exists before it is listed) and then the main doc with `historyMonths` updated; update `syncState` (`syncedHash`, `etag`, `lastSyncAt`, `lastError`, `docBytes`), store the clock offset, record `syncFamilyId` on first success, stop on family mismatch (`spec.md`, "Offline, family switch, first sync").

Acceptance:
- [x] Unit tests with a fake fetch backed by the memory store: first sync from a device with local data; second device pulls; conflict path; three conflicts in a row leave the child dirty; offline (fetch throws) keeps dirty; `too-new` stops without writing; 401 stops; `sync-unavailable` disables silently; a lost PUT response (stored but answer dropped) settles without duplicates on the next sync; only months with unsent records are pushed; a reset pushes the main doc and no old month.
- [x] Writes made during a sync stay dirty afterwards.

Verify: `pnpm test tests/sync/engine.test.ts`

Files: `src/sync/engine.ts`, `src/sync/client.ts` (fetch wrapper), `tests/sync/engine.test.ts`.

### Task 12: triggers and mount (M)

`requestSync(reason)` with a short debounce; a client `SyncRunner` that starts the 5-minute timer, listens to `online` and `visibilitychange` (hidden: a normal sync, no `keepalive`, whose 64 KB body limit a doc exceeds), and holds a Web Locks lock `tutor-sync` (falls back to no lock). Call sites: after `completeSection` succeeds (in `src/learn/section-player.tsx`) and when a review session finishes (`src/learn/review-player.tsx`), one line each. Mounted once in `src/app/(child)/layout.tsx` and on the parent screen. Nothing visible to the child.

Acceptance:
- [x] Component test with fake timers: timer, online, hidden and the two call sites each trigger one sync; repeated triggers inside the debounce give one sync.
- [x] No child screen renders any sync text (test renders home and players and finds none).
- [x] An apply-back that changes the open section's position does not move the section player (component test).
- [x] `git status` checked before editing `src/learn/*` and the layout (see rules above).

Verify: `pnpm test tests/sync/runner.test.tsx tests/learn`

Files: `src/sync/runner.tsx`, `src/sync/request.ts`, `src/learn/section-player.tsx`, `src/learn/review-player.tsx`, `src/app/(child)/layout.tsx`, `src/components/parent/parent-screen.tsx`, tests.

### Task 13: history pull on a new device, parent loading line (M)

After the main docs are applied, a background job pulls the months of `historyMonths` that `syncState.months` has not applied yet, newest first, one request at a time, paced to stay under the GET limit, and applies each through `applyHistoryDoc`. It stops on leaving the app and resumes on the next start. The child can study meanwhile. On the parent page, under the totals: "Đang tải lịch sử học… (đã có từ tháng <tháng>)" while listed months are missing (`spec.md` section 6.6); "Thẻ hay quên" (card states) and the 14-day lists need nothing more than the main doc and the two newest months.

Acceptance:
- [x] Unit test with a fake fetch: a device with no local data applies the main doc first (sections, cards, stickers readable before any month arrives), then months newest first; an interrupted pull resumes without refetching applied months; a listed month that is missing counts as empty and is retried later.
- [x] Component test: the loading line shows while months are missing and disappears when all are applied; parent totals after the pull equal those computed on the source device.
- [x] No child screen waits for the history (the lesson and review screens open while months are pending).

Verify: `pnpm test tests/sync/history-pull.test.ts tests/components/parent`

Files: `src/sync/history-pull.ts`, `src/sync/runner.tsx` (start the pull), `src/components/parent/history-loading.tsx`, `src/components/parent/child-report.tsx` (placement only), tests.

### Checkpoint A

- [x] Owner can open two browsers (normal and private window) on a local gate server with the fs store and see progress move between them.

Result (gate green, `pnpm build` passed in a temporary worktree, e2e learn, review and parent passed with `--workers=2` on `ipad` and `phone`, a scripted two-browser-context run passed: a section finished on A, its profile, main doc and month doc appeared in the store, B showed the profile and the section as done).

By hand, in a temporary worktree so the owner's dev server keeps `.next`:

```bash
git worktree add --detach ../tutor-sync-check HEAD
cd ../tutor-sync-check && pnpm install --frozen-lockfile
CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit
CONTENT_INCLUDE_FIXTURE=1 SYNC_STORE=fs:/tmp/tutor-sync-store \
  FAMILY_CODES=test-family:Sao-Bien-4k7m \
  SESSION_SECRET=any-text-of-at-least-32-characters-here \
  pnpm exec next dev --port 3520
```

Open `http://localhost:3520` in a normal window and in a private window, enter the code `Sao-Bien-4k7m` in each (a made-up code for this local run), create a profile and finish a section in the first, then open the second: the profile and the section appear within seconds. The folder `/tmp/tutor-sync-store/dev/progress/test-family/` holds the docs. Stop the server with Ctrl-C and run `git worktree remove --force ../tutor-sync-check`.

The unlock E2E was flaky on iPad WebKit under `--workers=2`: text typed before the page hydrates stays in the field while React keeps an empty value, and typing the same text again fires no change event. The helper now empties the field before each retype; `e2e/unlock.spec.ts` passed 84 of 84 runs (six repeats on both targets).

## Slice 5: parent page

### Task 14: last sync line, stuck messages, family switch guard (M)

On the parent page: "Đồng bộ lần cuối: <thời gian>" per device; plain messages for: not sent for more than 1 day while dirty, main doc above 70% of the cap, a doc too large, app too old, cookie rejected; the family switch guard with export buttons and "Dùng máy này cho gia đình mới" (two-step confirmation, `Sheet`, like the reset dialog). Vietnamese text, tokens from `docs/design-system.md`, touch targets ≥ 48px.

Acceptance:
- [x] Component tests for each message state and for both guard branches (dirty: only export offered; clean: clear and pull after two confirmations; cancel at any step deletes nothing).
- [x] `pnpm test:e2e e2e/parent.spec.ts` still passes on `ipad` and `phone`.

Verify: `pnpm test tests/components/parent && pnpm test:e2e e2e/parent.spec.ts`

Files: `src/components/parent/sync-status.tsx`, `src/components/parent/family-switch-dialog.tsx`, `src/components/parent/parent-dashboard.tsx`, tests.

### Task 15: import backup JSON (M)

Button "Nhập bản sao lưu" next to the existing export on the parent page (behind the PIN like the rest of the page). Accepts the export file (versions 1 and 2) and a main child doc (a restored snapshot; its child must already have a profile on the device or in the family's profile doc, otherwise a plain error). Shows child name, export date and record counts before merging; merges state with `mergeChildDocs` and writes answers and writings to Dexie (never overwrites), marking every affected month for the next sync; creates the profile if its id is not on the device; summary line with how many records were added and how many were skipped because of a later reset. Export moves to version 2 (adds `resets`, `overviewSeen` times and section `doneAt`). File size limit 5 MB.

Acceptance:
- [x] Importing the same file twice changes nothing the second time.
- [x] A malformed file, a wrong `format`, a newer version or an oversized file shows a plain error and writes nothing.
- [x] Import makes the main doc and each affected month dirty, so the next sync sends them.
- [x] Unit tests for the parser and the import function; component test for the preview and summary.

Verify: `pnpm test tests/progress/parent-data.test.ts tests/sync/import.test.ts tests/components/parent`

Files: `src/progress/parent-data.ts`, `src/sync/import.ts`, `src/components/parent/import-backup.tsx`, `src/components/parent/child-report.tsx` (button placement only), tests.

## Slice 6: verification

### Task 16: multi-device E2E (M)

A second gate dev server with the fs store (new `SYNC_*` entries in `e2e/targets.ts`, like `GATE_*`; its `FAMILY_CODES` uses the named form), two browser contexts as two devices. Scenarios: (1) create profile and finish a section on A, B shows it after reload; (2) B offline (`context.setOffline(true)`), study, back online, A sees it; (3) reset a lesson on A from the parent page, B had progress on it before the reset, both show it reset after syncing while B's later study is kept; (4) import a backup on A, B receives it; (5) a context with a cookie of another family sees none of it; (6) B mid-section while A's progress on the same section arrives: B stays on its item; (7) a fresh context C (new device) with A's history spread over at least three months (seeded with the page clock): C shows sections and stickers and can open a section before history has loaded, then the parent page on C shows the same totals as on A and the loading line is gone; (8) reset a lesson on A, then C pulls: the lesson's earlier answers do not appear on C, and the old month doc in the fs store still holds them. Run on `ipad` and `phone`. The fs store folder is created fresh per run and deleted after.

Acceptance:
- [x] All eight scenarios pass on both targets, three runs in a row (no flake). Residual: in about 30 full runs, 3 runs had one or two failures (a lost sync after a parent-page action, once a lost page load); the last 8 runs in a row were clean after the store moved out of the project folder. See the handover.
- [x] No request leaves localhost (Playwright route guard fails the test on any other host).

Verify: `pnpm test:e2e e2e/sync.spec.ts`

Files: `e2e/sync.spec.ts`, `e2e/targets.ts`, `playwright.config.ts` (second server entry).

## Slice 7: R2 adapter and security review

### Task 17: R2 adapter and optional real-R2 smoke test (M, owner approval for the smoke run)

`r2` adapter with `aws4fetch` (new dependency) over the S3 API, conditional GET and PUT, quoted ETags normalised in one place, reading `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`. Unit tests with a mocked fetch run the shared contract suite. Optional `pnpm test:r2`: the contract suite against the real bucket `tutor-progress` from `.env.local`, through the test-store constructor (Task 7), so every key is under `test/<run-id>/`; it deletes only keys it wrote under that prefix and never lists or touches `prod/` or `dev/`.

External: the bucket and token come from Task 20 step 1 and 2. Running `pnpm test:r2` is a real R2 call; the agent runs it once only after the owner says yes for that run.

Acceptance:
- [x] Contract suite passes on memory, fs and the mocked R2 fetch, including 412 on stale `If-Match` and on `If-None-Match: *`; on an approved run, also on real R2. Real R2 not run: no approval yet.
- [x] Missing variables make `test:r2` skip with a message, never fail the normal gate; `pnpm test` never reaches the network.
- [x] A unit test shows `test:r2` refuses to start with a prefix outside `test/`.

Verify: `pnpm test tests/sync/store` (always); `pnpm test:r2` (only with approval).

Files: `src/sync/store/r2.ts`, `tests/sync/store/r2.test.ts`, `tests/integration/r2-store.test.ts`, `package.json` (`test:r2`, `aws4fetch`).

### Task 18: security review (fresh agent, Opus) (S)

A new agent that did not write the code reviews the whole sync diff against `spec.md` section "Security" and its threat model: auth and family resolution, one code to one family, key building and the environment prefix guard, origin, size caps, schema strictness, rate limit, logging, env handling, the R2 adapter and the smoke test's prefix guard, client bundle (no `R2_*` names: build in a separate worktree and grep `.next/static`), dependency audit of new packages. Writes findings with severity into this file under "Security review"; fixes go back to new tasks, not into the review session.

Acceptance:
- [x] Review recorded with each finding's severity, file and line.
- [x] No Critical or High finding left open before Task 19. (None found; the two Medium and two Low findings that were small are fixed, see "Security review".)

Verify: the review section exists; re-run of the tests named by any fix.

Files: this file only (review), fixes in follow-up tasks.

### Checkpoint B

- [ ] Owner reviews E2E evidence and the security review. Nothing has touched production yet.

## Slice 8: docs and rollout

### Task 19: docs and smoke check (S)

Update `docs/spec.md`: "Tiến độ và đồng bộ" (main doc plus monthly history docs instead of the 500-entry log, merge rules as in `spec.md` section 6.1, one bucket with `prod/`, `dev/`, `test/` prefixes in the bucket layout, restore through the import button instead of `pnpm admin restore`), "Truy cập và bảo mật" (named family codes, PIN per device, synced settings, one bucket-scoped token instead of "2 bucket"), "Offline và PWA" (offline and `/install` are a separate later backlog, `/install` no longer says sync is required), "Chiến lược kiểm thử" (real-R2 test is the optional smoke under `test/`). Update `docs/architecture.md` (new `src/sync/` module, checks table rows, "Child progress" line in "Where state lives"), `docs/operations.md` (env table rows and the named `FAMILY_CODES` form, how to create the bucket, token and lifecycle rules, never pull the production environment into a local file, token rotation, restore a child from a snapshot via the import button, usage notification, deleting `dev/` test profiles), `README.md` if commands changed. Add a smoke check to `scripts/lib/deploy-prod.ts`: `GET /api/sync?doc=profile` without cookie answers 401.

Acceptance:
- [x] Docs name no task numbers or planning jargon; grep for `Task `, `Slice`, `Checkpoint`, `Q[0-9]` in `docs/` finds none from this work. (Grep of `docs/`, `README.md`, `.env.example` clean.)
- [x] `tests/scripts/deploy-prod.test.ts` covers the new smoke check.

Verify: `pnpm test tests/scripts/deploy-prod.test.ts && pnpm lint`

Files: `docs/spec.md`, `docs/architecture.md`, `docs/operations.md`, `scripts/lib/deploy-prod.ts`, `tests/scripts/deploy-prod.test.ts`.

### Task 20: production rollout (owner runs or approves each step)

In this order, each step approved by the owner for this release:

1. Owner creates the private bucket `tutor-progress` (public access off, no custom domain), lifecycle rules deleting `prod/snapshots/` and `dev/snapshots/` after 180 days (history docs have no lifecycle rule) and `test/` after 1 day, and a Cloudflare usage notification at a low amount.
2. Owner creates the one R2 token with Object Read & Write on `tutor-progress` only, and puts the four `R2_*` variables in `.env.local` (no `VERCEL_ENV` there).
3. Owner tries it by hand: a local gate server with `.env.local` (named `FAMILY_CODES` entry for a test family), a test profile, one section on two browsers; objects appear under `dev/` only. Optional, on approval: `pnpm test:r2` once.
4. Owner sets on Vercel, Production, Sensitive: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`, and rewrites `FAMILY_CODES` as named entries. The codes themselves stay the same, so no device re-enters a code. `.env.production.local` (read by the deploy smoke check) gets the same named form.
5. On approval: `pnpm deploy:prod` from the verified commit, per `docs/operations.md`; smoke checks pass, including the new 401 check.
6. Owner smoke on two real devices (iPad Safari and the Home Screen app): study one section on one, see it on the other; the parent page shows the last sync time; objects appear under `prod/` only.

Acceptance:
- [ ] Steps 1 to 6 done, results written here with dates and the deployed commit.
- [ ] One week later: R2 and Vercel usage read from the dashboards, inside free tiers.

### Checkpoint C

- [ ] Backlog index updated; leftovers listed here ; folder archived with `git mv` to `notebooks/backlogs/archive/progress-sync/` with an "Archived: …" line; offline precache and `/install` opened as their own backlog when the owner wants it.

## Security review

Done 2026-10-02 by a fresh Opus agent that did not write the code, on `2bd481e`. Read: `spec.md` section 7, `docs/operations.md` sync runbook, `src/proxy.ts`, `src/access/**`, `src/app/api/session/route.ts`, `src/app/api/sync/route.ts`, `src/sync/**` (server, store adapters, keys, config, schema, clamp, merge, import, cycle, engine, client, family switch), `scripts/lib/deploy-prod.ts`, `tests/integration/r2-store.test.ts`, `e2e/targets.ts`. No external call was made; `pnpm test:r2` was not run; env files were read for variable names only.

Bundle: production build in a separate worktree with canary values for every `R2_*`, `SESSION_SECRET` and `FAMILY_CODES`: `.next/static` (385 files) holds none of the names `R2_`, `SESSION_SECRET`, `FAMILY_CODES`, `SYNC_STORE`, `VERCEL_ENV`, `aws4fetch`, `r2.cloudflarestorage`, and no canary value appears anywhere under `.next` (server output reads them at run time, nothing is inlined). That check now runs on every build (`scripts/bundle-check.ts`).

Dependency: `aws4fetch` 1.0.20, MIT, no dependencies; its built-in retry (`AwsClient.fetch`, 10 retries) is bypassed by signing with `sign` and sending with `fetch`. `pnpm audit` not run (network call).

### Findings

| # | Severity | Where (lines at `2bd481e`) | Failure scenario | Status |
|---|---|---|---|---|
| 1 | Medium | `src/sync/import.ts:263-274`, `:327-353`; erase in `src/sync/local.ts:167` | A crafted or corrupt backup with `resets: { "<lesson>": "2099-..." }` is imported on the parent page: the merge runs on the device before any server clamp, `eraseHistoryBeforeResets` deletes every local answer of that lesson, and the 2099 reset hides every answer given later. The server clamps the reset to its time on the next PUT, but the local erase and the reset at that time remain. | Fixed `e6a8f20`: `readBackup` clamps the state and the months with `clampFutureTimes` (now + 10 min), regrouping moved records into the current month. |
| 2 | Medium | spec 7.3 and `docs/spec.md` promised "a test fails if any `R2_*` name appears in client bundles"; no such test existed | A future client component reads `process.env.R2_SECRET_ACCESS_KEY` (or a `NEXT_PUBLIC_` rename) and nothing stops the build from shipping it to every browser. | Fixed `8a8bf91`: `scripts/bundle-check.ts` runs after `next build` (laptop and Vercel), fails on a server-only name or a secret or family-code value in `<distDir>/static`, prints file and variable only. |
| 3 | Low | `src/sync/server.ts:328-338` | R2 down, a refused credential or the 10 s timeout throws out of the route: Next answers its default 500 without `no-store`, no sync log line is written, and Next prints the raw error (for a fetch failure its cause names the account's R2 host). | Fixed `77b63ef`: JSON 500 `server` with `no-store`; log line `event: "exception"` with `R2 <status> <code>` or the error's name, never the message. The client already maps 500 to `server`. |
| 4 | Low | `src/sync/schema.ts:45`; lookups `src/sync/merge.ts:65`, `:146`, `src/sync/history.ts:14` | A family device (or a buggy client) PUTs a main doc with `resets: { "constructor": "..." }`; the schema accepted it, and every device's merge then read `Object.prototype.constructor`, put a function into the merged `resets` (Dexie refuses to store it, that run fails) and silently dropped records whose lesson id is such a name. Needs the family code. | Fixed `0aadf35`: ids that are names of `Object.prototype` are refused by the schema on client and server. |
| 5 | Low | `src/sync/schema.ts:37`, `src/sync/server.ts:109` | Months have no lower bound (`0000-01` passes). A code holder can create about 24 000 month docs per child at up to 512 KB each; only the per-instance limit of 30 PUTs a minute slows it. Spec 7.5 accepts cost abuse by a code holder as residual (usage notification). | Open. Option: refuse months before the app's first year (for example `2024-01`); a backup cannot hold older records. |
| 6 | Low | `src/access/rate-limit.ts:75`, `src/sync/server.ts:227-236` | The limits are per serverless instance; parallel requests across instances multiply them. | Accepted residual (spec 7.2). |
| 7 | Low | `src/sync/store/keys.ts:22-24` | `prod/` depends on `VERCEL_ENV` alone and the token is bucket-wide: a local file that sets `VERCEL_ENV=production` next to the `R2_*` variables makes a laptop server write production data. Today `.env.production.local` holds only `FAMILY_CODES`, `SESSION_SECRET`, `NEXT_PUBLIC_MEDIA_BASE_URL` (names checked, no values read). The reverse, a production deploy without `VERCEL_ENV`, would write `dev/` silently; rollout step 6 checks objects land under `prod/`. Preview gets `dev/`; `SYNC_STORE` is refused in production and wins over `R2_*` elsewhere. | Accepted residual (spec 7.3), runbook forbids `VERCEL_ENV` in local files. |
| 8 | Low | `src/sync/import.ts:149`, `src/components/parent/import-backup.tsx` | A file's past-dated reset still acts as a parent's lesson reset on import (local records of that lesson before it are erased), and the preview sheet shows counts but not resets. Behind the parent PIN; the parent can reset a lesson anyway. | Open. Option: show "N bài sẽ được đặt lại" in the preview when the file carries resets newer than the device's. |
| 9 | Low | `src/sync/store/r2.ts:83` | aws4fetch signs S3 requests with `UNSIGNED-PAYLOAD`, so the body is not covered by the signature; TLS protects it in transit. | Accepted (informational). |
| 10 | Low | `src/app/api/session/route.ts:50` | `request.json()` reads the whole unlock body before the length check; the route is reachable without a cookie. Bounded by Vercel's 4.5 MB request limit. | Open, small: read capped like `readCapped` in `server.ts`. |
| 11 | Low | `docs/operations.md` "Bật đồng bộ lần đầu" step 1 | Snapshot retention (180 days) lives only in bucket lifecycle rules set by hand; nothing checks they exist, so a forgotten rule keeps every daily snapshot (with names and state) for good. | Open: add "lifecycle rules present" to the checks of rollout step 6. |
| 12 | Info | `src/access/env.ts:42-44` | A legacy bare code containing `:` would now be read as `<name>:<code>`; the name fails the pattern and the gate closes (fails closed, reason logged without values). | No action. |

### Checked, no finding

- Auth: every `/api/*` path without a valid cookie gets 401 from `src/proxy.ts`, and the sync service verifies the cookie again itself (defence if the proxy were bypassed). The family comes only from the cookie (`resolveFamily`); `doc.familyId`, `childId` and `month` must equal the cookie family and the query; keys are built per family; a cookie of a removed code fails `matchSessionCode` against the current list (test in `tests/api/sync-get.test.ts`). One code under two family names closes the gate. Inside a family any device reads every child, as the spec intends.
- Comparison: `matchCode` compares against every code in constant time; the cookie's HMAC is checked with `crypto.subtle.verify` before its fingerprint is compared.
- CSRF: PUT needs `Origin` host equal to `Host` and `content-type: application/json` (checked before the cookie); GET refuses any `Sec-Fetch-Site` but `same-origin`; cookie `httpOnly`, `SameSite=Lax`, `Secure` in production; no CORS headers.
- Input: unknown query parameters, repeated parameters and bad etags refused; body capped while streaming (cap + 4 KB) and by `content-length`; strict zod schemas, 12 profiles, 10 000 records per list, 5 000-character writings, ids by regex; a stored doc that fails the schema is never overwritten; future times clamped; history append-only (`shrink`).
- Keys: `syncKey` validates every segment (family, child, month, day) and the prefix; no traversal is possible, and the folder store checks segments and the root again. `delete` exists only under a `test/<run-id>/` prefix; the smoke test wraps every key in `createTestStore`.
- R2 adapter: no retries, only conditional writes from the service (the snapshot uses `If-None-Match: *`), 10 s timeout on every request, errors carry status and S3 code only, account id and bucket validated before going into the URL. A timed-out write that did land is caught by the next conditional PUT (412, merge).
- Clients: a failed request ends the run; 412 retries at most 3 times with 100 to 500 ms jitter; 429 and errors wait for the next trigger (2 s debounce, 5-minute timer); the history pull is paced at 30 requests a minute and stops on run-ending failures.
- Logging: server lines carry route, family id, doc kind, status, byte size; config and gate reasons name variables, never values; no `console` call in client sync code; the deploy smoke check prints statuses, never the code.
- Import: file size checked before the text is read (5 MB), JSON and schema validated, merge only, nothing written before the preview is confirmed.
- Family switch: a device whose cookie names another family stops at the first GET (`family-mismatch`) before any PUT; clearing needs no unsent work and the parent page.
- Privacy: what leaves the device is exactly the three doc schemas (profile name, avatar, grade, series, times; card, section, sticker, day, overview and reset state; answers and writings), all of which Dexie already holds. No device id, user agent or PIN is sent; settings other than `overviewSeen` stay local.
