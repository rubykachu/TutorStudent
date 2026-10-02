# Tasks: progress sync across devices

Spec: `spec.md`. Plan and dependency graph: `plan.md`. Status: not started; the owner's decisions are in `spec.md` section 10, no question is open.

## Handover

Slice 4 (client engine and triggers) is partly built. Working tree was clean after the last commit; nothing half-done.

### Done (commits, oldest first)

- `e85bdc1` Task 11, commit 1: one doc's cycle. `src/sync/client.ts` (fetch wrapper, answers reduced to `GetResult`/`PutResult`, network error = `offline`), `src/sync/state.ts` (`syncState` access, `syncFamilyId` device setting, `PENDING_MONTH`), `src/sync/docs.ts` (one adapter each for profile, main and month doc), `src/sync/cycle.ts` (`syncDoc`: conditional GET, migrate, merge, PUT, up to `SYNC_MAX_RETRIES` rounds on 412 with a 100 to 500 ms wait, one retry on 409 `shrink`, apply-back, empty docs never created), `src/sync/overwrite.ts` (writes the server's clamped doc over the local records it changed, because the merge cannot lower a time). `src/sync/local.ts` only gained `export` on `listResets`. Tests: `tests/sync/cycle.test.ts`, helpers `tests/sync/network.ts` (fake fetch answered by the real service over the memory store) and `tests/sync/devices.ts`.
- `5791b5b` Task 11, commit 2: `src/sync/engine.ts`, `createSyncEngine({ db, api, deviceNow?, sleep?, random? }).run({ full? })`. Order: profile doc, then per local child the months (current and previous; with `full` also every dirty local month, oldest first), then the main doc. Failures that end the run: unavailable (turns sync off for the session, silent), unauthorized, offline, rate, origin, server, family-mismatch. Per-doc failures (conflict, too-new, upgrade-required, too-large, invalid, stored-invalid, shrink) leave the doc dirty and the run goes on; too-new and upgrade-required block that doc until reload. 403 `child` sends the profile doc and retries once. Clock offset measured from the first answer of a run, stored at the end. Tests: `tests/sync/engine.test.ts` (18 cases: first sync, new device, two-device interleaving, 412 race, three lost races, writes during a sync, offline then online, lost PUT answer, 401, 503 and no-gate, family mismatch, 403 child, too-new, reset on one device, clamp, clock offset).
- Task 11 is ticked below. Gate was green for both commits (`pnpm format && pnpm lint && pnpm typecheck && pnpm test`).

### Not started

Tasks 12 and 13, Checkpoint A. `git status` was clean, so `src/learn/*` and `src/app/(child)/layout.tsx` had no foreign uncommitted changes at the time; re-check before editing.

### Next steps, in order

1. Task 12. Create `src/sync/request.ts`: the default engine (`createSyncEngine({ db: appDb(), api: createSyncApi() })`; keep it out of `engine.ts` so the engine does not import `src/progress/hooks.ts`), `syncNow(options?)`, and `requestSync(reason)` with a short debounce and one sync in flight at a time. Create `src/sync/runner.tsx` (`SyncRunner`: first run with `full: true` after `restoreClockOffset(db)`, a `SYNC_INTERVAL_MINUTES` timer, `online`, `visibilitychange` hidden, no `keepalive`; Web Locks lock `tutor-sync`, no lock when `navigator.locks` is missing). Mount once in `src/app/(child)/layout.tsx` and in `src/components/parent/parent-screen.tsx`. Call sites: in `src/learn/section-player.tsx` `advance`, one line after `completeSection` resolves; in `src/learn/review-player.tsx`, a small effect (placed before `if (!session) return null`) that calls `requestSync` once when the session ends (`session !== null && !item && !session.recap`). Tests `tests/sync/runner.test.tsx` with fake timers; no child screen renders sync text; an apply-back changing the open section's position does not move the player.
2. Task 13. `src/sync/history-pull.ts`: after the main doc is applied, pull months whose `syncState.months[m].applied` is false (the engine records every month the cloud lists as `PENDING_MONTH`), newest first, one request at a time, paced under `SYNC_GET_LIMIT_PER_MINUTE`, through `syncDoc` with `monthAdapter` (which applies with `applyHistoryDoc` and marks the month applied). A listed month that does not exist counts as empty and stays pending. Start it from the runner; stop on leaving the app and resume at the next start. `src/components/parent/history-loading.tsx` ("Đang tải lịch sử học… (đã có từ tháng …)") placed in `child-report.tsx` under the totals. Tests `tests/sync/history-pull.test.ts`, `tests/components/parent`.
3. Checkpoint A: `pnpm build` in a temp `git worktree`; local gate server on port 3520 with `SYNC_STORE=fs:<temp dir>` and a fake `FAMILY_CODES=test-family:<code>` plus `SESSION_SECRET` (32 characters); two browser contexts: learn on A, open B, progress arrives; run e2e learn, review and parent once with `--workers=2`; remove the worktree; stop only own PIDs (never the dev server on 3001, never `pkill`). No push, no deploy, no R2.
4. Look at the flaky `e2e/unlock.spec.ts` on iPad WebKit ("Vào học" button not enabled in time under `--workers=2`). If the fix is test-only (wait for the enabled state, no fixed sleeps), commit it alone as `test(e2e): ...`; otherwise leave it and note it here.
5. Write the exact two-browser commands into Checkpoint A, tick Tasks 12 and 13, update this handover.

### Deviations from the spec

- The cycle lives in `src/sync/cycle.ts` and the adapters in `src/sync/docs.ts`, `src/sync/state.ts`, `src/sync/overwrite.ts`; `engine.ts` holds only the orchestration. The task listed `engine.ts` and `client.ts` only.
- Routine syncs always do a conditional GET of the current and previous month (not only when a month is dirty), so a device sees the other device's answers of the current month; each is a cheap `unchanged` answer. The cost note in section 8 assumed one poll per sync.
- The server answers a stored doc of a newer version with 500 `stored-invalid` when read by an older server; the client's `too-new` case only arises when a newer server answers an older client (tested with a canned answer).
- A month empty on both sides records nothing in `syncState` (otherwise the main doc would list months that do not exist).

### Known flakes

- `tests/scripts/sources-import.test.ts` can time out (5 s) when the whole suite runs under load; it passes alone (`pnpm vitest run tests/scripts/sources-import.test.ts`).
- `e2e/unlock.spec.ts` on iPad WebKit with `--workers=2`: "Vào học" not enabled in time (not investigated yet).

### Commands to verify

- `pnpm vitest run tests/sync/cycle.test.ts tests/sync/engine.test.ts`
- `pnpm format && pnpm lint && pnpm typecheck && pnpm test`
- `git log --oneline -3` shows `5791b5b` and `e85bdc1` below the handover commit.

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
- [ ] Component test with fake timers: timer, online, hidden and the two call sites each trigger one sync; repeated triggers inside the debounce give one sync.
- [ ] No child screen renders any sync text (test renders home and players and finds none).
- [ ] An apply-back that changes the open section's position does not move the section player (component test).
- [ ] `git status` checked before editing `src/learn/*` and the layout (see rules above).

Verify: `pnpm test tests/sync/runner.test.tsx tests/learn`

Files: `src/sync/runner.tsx`, `src/sync/request.ts`, `src/learn/section-player.tsx`, `src/learn/review-player.tsx`, `src/app/(child)/layout.tsx`, `src/components/parent/parent-screen.tsx`, tests.

### Task 13: history pull on a new device, parent loading line (M)

After the main docs are applied, a background job pulls the months of `historyMonths` that `syncState.months` has not applied yet, newest first, one request at a time, paced to stay under the GET limit, and applies each through `applyHistoryDoc`. It stops on leaving the app and resumes on the next start. The child can study meanwhile. On the parent page, under the totals: "Đang tải lịch sử học… (đã có từ tháng <tháng>)" while listed months are missing (`spec.md` section 6.6); "Thẻ hay quên" (card states) and the 14-day lists need nothing more than the main doc and the two newest months.

Acceptance:
- [ ] Unit test with a fake fetch: a device with no local data applies the main doc first (sections, cards, stickers readable before any month arrives), then months newest first; an interrupted pull resumes without refetching applied months; a listed month that is missing counts as empty and is retried later.
- [ ] Component test: the loading line shows while months are missing and disappears when all are applied; parent totals after the pull equal those computed on the source device.
- [ ] No child screen waits for the history (the lesson and review screens open while months are pending).

Verify: `pnpm test tests/sync/history-pull.test.ts tests/components/parent`

Files: `src/sync/history-pull.ts`, `src/sync/runner.tsx` (start the pull), `src/components/parent/history-loading.tsx`, `src/components/parent/child-report.tsx` (placement only), tests.

### Checkpoint A

- [ ] Owner can open two browsers (normal and private window) on a local gate server with the fs store and see progress move between them. Main session writes the exact commands into this file when it gets here.

## Slice 5: parent page

### Task 14: last sync line, stuck messages, family switch guard (M)

On the parent page: "Đồng bộ lần cuối: <thời gian>" per device; plain messages for: not sent for more than 1 day while dirty, main doc above 70% of the cap, a doc too large, app too old, cookie rejected; the family switch guard with export buttons and "Dùng máy này cho gia đình mới" (two-step confirmation, `Sheet`, like the reset dialog). Vietnamese text, tokens from `docs/design-system.md`, touch targets ≥ 48px.

Acceptance:
- [ ] Component tests for each message state and for both guard branches (dirty: only export offered; clean: clear and pull after two confirmations; cancel at any step deletes nothing).
- [ ] `pnpm test:e2e e2e/parent.spec.ts` still passes on `ipad` and `phone`.

Verify: `pnpm test tests/components/parent && pnpm test:e2e e2e/parent.spec.ts`

Files: `src/components/parent/sync-status.tsx`, `src/components/parent/family-switch-dialog.tsx`, `src/components/parent/parent-dashboard.tsx`, tests.

### Task 15: import backup JSON (M)

Button "Nhập bản sao lưu" next to the existing export on the parent page (behind the PIN like the rest of the page). Accepts the export file (versions 1 and 2) and a main child doc (a restored snapshot; its child must already have a profile on the device or in the family's profile doc, otherwise a plain error). Shows child name, export date and record counts before merging; merges state with `mergeChildDocs` and writes answers and writings to Dexie (never overwrites), marking every affected month for the next sync; creates the profile if its id is not on the device; summary line with how many records were added and how many were skipped because of a later reset. Export moves to version 2 (adds `resets`, `overviewSeen` times and section `doneAt`). File size limit 5 MB.

Acceptance:
- [ ] Importing the same file twice changes nothing the second time.
- [ ] A malformed file, a wrong `format`, a newer version or an oversized file shows a plain error and writes nothing.
- [ ] Import makes the main doc and each affected month dirty, so the next sync sends them.
- [ ] Unit tests for the parser and the import function; component test for the preview and summary.

Verify: `pnpm test tests/progress/parent-data.test.ts tests/sync/import.test.ts tests/components/parent`

Files: `src/progress/parent-data.ts`, `src/sync/import.ts`, `src/components/parent/import-backup.tsx`, `src/components/parent/child-report.tsx` (button placement only), tests.

## Slice 6: verification

### Task 16: multi-device E2E (M)

A second gate dev server with the fs store (new `SYNC_*` entries in `e2e/targets.ts`, like `GATE_*`; its `FAMILY_CODES` uses the named form), two browser contexts as two devices. Scenarios: (1) create profile and finish a section on A, B shows it after reload; (2) B offline (`context.setOffline(true)`), study, back online, A sees it; (3) reset a lesson on A from the parent page, B had progress on it before the reset, both show it reset after syncing while B's later study is kept; (4) import a backup on A, B receives it; (5) a context with a cookie of another family sees none of it; (6) B mid-section while A's progress on the same section arrives: B stays on its item; (7) a fresh context C (new device) with A's history spread over at least three months (seeded with the page clock): C shows sections and stickers and can open a section before history has loaded, then the parent page on C shows the same totals as on A and the loading line is gone; (8) reset a lesson on A, then C pulls: the lesson's earlier answers do not appear on C, and the old month doc in the fs store still holds them. Run on `ipad` and `phone`. The fs store folder is created fresh per run and deleted after.

Acceptance:
- [ ] All eight scenarios pass on both targets, three runs in a row (no flake).
- [ ] No request leaves localhost (Playwright route guard fails the test on any other host).

Verify: `pnpm test:e2e e2e/sync.spec.ts`

Files: `e2e/sync.spec.ts`, `e2e/targets.ts`, `playwright.config.ts` (second server entry).

## Slice 7: R2 adapter and security review

### Task 17: R2 adapter and optional real-R2 smoke test (M, owner approval for the smoke run)

`r2` adapter with `aws4fetch` (new dependency) over the S3 API, conditional GET and PUT, quoted ETags normalised in one place, reading `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`. Unit tests with a mocked fetch run the shared contract suite. Optional `pnpm test:r2`: the contract suite against the real bucket `tutor-progress` from `.env.local`, through the test-store constructor (Task 7), so every key is under `test/<run-id>/`; it deletes only keys it wrote under that prefix and never lists or touches `prod/` or `dev/`.

External: the bucket and token come from Task 20 step 1 and 2. Running `pnpm test:r2` is a real R2 call; the agent runs it once only after the owner says yes for that run.

Acceptance:
- [ ] Contract suite passes on memory, fs and the mocked R2 fetch, including 412 on stale `If-Match` and on `If-None-Match: *`; on an approved run, also on real R2.
- [ ] Missing variables make `test:r2` skip with a message, never fail the normal gate; `pnpm test` never reaches the network.
- [ ] A unit test shows `test:r2` refuses to start with a prefix outside `test/`.

Verify: `pnpm test tests/sync/store` (always); `pnpm test:r2` (only with approval).

Files: `src/sync/store/r2.ts`, `tests/sync/store/r2.test.ts`, `tests/integration/r2-store.test.ts`, `package.json` (`test:r2`, `aws4fetch`).

### Task 18: security review (fresh agent, Opus) (S)

A new agent that did not write the code reviews the whole sync diff against `spec.md` section "Security" and its threat model: auth and family resolution, one code to one family, key building and the environment prefix guard, origin, size caps, schema strictness, rate limit, logging, env handling, the R2 adapter and the smoke test's prefix guard, client bundle (no `R2_*` names: build in a separate worktree and grep `.next/static`), dependency audit of new packages. Writes findings with severity into this file under "Security review"; fixes go back to new tasks, not into the review session.

Acceptance:
- [ ] Review recorded with each finding's severity, file and line.
- [ ] No Critical or High finding left open before Task 19.

Verify: the review section exists; re-run of the tests named by any fix.

Files: this file only (review), fixes in follow-up tasks.

### Checkpoint B

- [ ] Owner reviews E2E evidence and the security review. Nothing has touched production yet.

## Slice 8: docs and rollout

### Task 19: docs and smoke check (S)

Update `docs/spec.md`: "Tiến độ và đồng bộ" (main doc plus monthly history docs instead of the 500-entry log, merge rules as in `spec.md` section 6.1, one bucket with `prod/`, `dev/`, `test/` prefixes in the bucket layout, restore through the import button instead of `pnpm admin restore`), "Truy cập và bảo mật" (named family codes, PIN per device, synced settings, one bucket-scoped token instead of "2 bucket"), "Offline và PWA" (offline and `/install` are a separate later backlog, `/install` no longer says sync is required), "Chiến lược kiểm thử" (real-R2 test is the optional smoke under `test/`). Update `docs/architecture.md` (new `src/sync/` module, checks table rows, "Child progress" line in "Where state lives"), `docs/operations.md` (env table rows and the named `FAMILY_CODES` form, how to create the bucket, token and lifecycle rules, never pull the production environment into a local file, token rotation, restore a child from a snapshot via the import button, usage notification, deleting `dev/` test profiles), `README.md` if commands changed. Add a smoke check to `scripts/lib/deploy-prod.ts`: `GET /api/sync?doc=profile` without cookie answers 401.

Acceptance:
- [ ] Docs name no task numbers or planning jargon; grep for `Task `, `Slice`, `Checkpoint`, `Q[0-9]` in `docs/` finds none from this work.
- [ ] `tests/scripts/deploy-prod.test.ts` covers the new smoke check.

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

Empty until Task 18.
