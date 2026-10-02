# Tasks: offline support (service worker precache)

Spec: `spec.md`. Plan and dependency graph: `plan.md`. Status: in build (overnight run). The owner approved building without a review of this plan; every decision follows `spec.md` section 10 ("theo đề xuất"). The plan was critiqued by a fresh reviewer; findings and fixes are in "Plan review" at the end.

## Handover

Next: Task 3. Run tasks one at a time, each in a fresh subagent (Sonnet for build tasks per `.claude/rules/agents.md`), starting from this file. Record each commit under "Done" and update "Next".

Decisions of the overnight run: Q18 answered theo đề xuất, no test-only exception in `src/sync/store/config.ts`. A kill switch (a self-unregistering worker deployable in place) is added as Task 4c and documented in `docs/operations.md` in Task 9. `pnpm content:check` currently fails on another agent's lesson in progress (`phep-cong-phep-tru-so-nguyen` review hash); not caused by this backlog.

### Done (commits, oldest first)

- Task 1: `src/offline/routes.ts` (param functions shared with the five pages, `appPagePaths()`, `NOT_PRECACHED_ROUTES`), `tests/offline/routes.test.ts`.
- Task 2: `src/offline/precache.ts` (pure list, deny-list, budget), `src/offline/precache-node.ts`, `scripts/lib/offline-manifest.ts` and `scripts/offline-manifest.ts` (writes `src/offline/precache-list.generated.json`, gitignored, run by `pnpm build`), `FAVICON_ICO_PATH` in `src/lib/brand.ts`. The build id is a timestamp per build. The budget counts only what is known before `next build` (content, sounds, public files); pages and build files are measured by the worker build (Task 4b).

### Rules for every task

- Targets: only the files a task names, plus their tests. Commit only your own paths (`git add <paths>`, never `git add -A`); other agents share the tree.
- Gate before each commit: `pnpm format && pnpm lint && pnpm typecheck && pnpm test`; add `pnpm content:check` if a page file or content code changed.
- Out of scope for every task: `src/sync/**` logic, the Dexie schema, lesson content (`content/**`), `public/media/**`, `public/sounds/**` files, brand images, `scripts/lib/release-config.ts` targets, video and narration pipelines, the `/install` page.
- Side effects: no `pnpm deploy:prod`, no `pnpm media:upload`, no R2 call, no request to the media bucket, no `git push`. Adding npm packages (`pnpm add`) downloads from the registry, which is allowed; record the packages in the commit.
- Production builds for checks never run in the main working tree: `content:emit` deletes and rewrites `public/content/` (the owner's dev server on 3001 would lose its drafts), and `next build` with another build folder edits the tracked `tsconfig.json`. They run in a clean git worktree of the committed `HEAD` in the system temp folder, created and removed by one script (`scripts/offline-lab.ts`, written in Task 4a, modelled on the worktree handling of `scripts/lib/deploy-prod.ts`): `pnpm install --frozen-lockfile --prefer-offline`, `public/media` linked read-only from the main tree, `CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit`, the precache step, `next build`, `next start` on a free port, all with `OFFLINE_SERVER_ENV` (below). The script removes only the worktree it created (`git worktree remove`, in a `finally`), as `deploy:prod` does. Commit before a production check, since the worktree builds `HEAD`.
- `OFFLINE_SERVER_ENV` (one constant in `e2e/targets.ts`, passed to emit, build and start): `NODE_ENV=production`, `NEXT_PUBLIC_MEDIA_BASE_URL=""` (media from the local `/media`, never the bucket), test `FAMILY_CODES` and `SESSION_SECRET`, `CONTENT_INCLUDE_FIXTURE=1`, no `R2_*`, no `SYNC_STORE`. Explicit values override `.env.production.local`, which holds the owner's real values; the script stops if the built client bundle names an `https://` media origin.
- Processes: stop only the PID you started (keep it from the start command). Never `pkill`/`killall`/pattern kills; never stop the dev server on port 3001 or any server you did not start. Outside the lab script's own worktree removal, no `rm` in any form.
- Stop point: a case outside these tasks (a needed change in sync, content, media or the gate's rules beyond the one public path) is reported in this file, not done.

## Task 1 (S): page paths in one place

Files: `src/offline/routes.ts` (new), the `generateStaticParams` of `src/app/(child)/subjects/[subject]/page.tsx`, `lessons/[lessonId]/page.tsx`, `lessons/[lessonId]/review/page.tsx`, `lessons/[lessonId]/tips/page.tsx`, `lessons/[lessonId]/sections/[sectionId]/page.tsx`; tests in `tests/offline/routes.test.ts`.

- `appPagePaths()` returns every statically generated child and parent path, built from the same param functions the pages now import (no second list). Server and build code only; the worker never imports it.
- `NOT_PRECACHED_ROUTES` lists route patterns left out, each with its reason: `/unlock`, `/dev/**`.

Acceptance:
- [x] Each page's `generateStaticParams` returns what it returned before (test compares with `servedLessons()` and `loadSubjects()`).
- [x] A test walks `src/app/**/page.tsx` and fails when a route is neither produced by `appPagePaths()` nor listed in `NOT_PRECACHED_ROUTES`.
- [x] Gate green; `pnpm content:check` fails only on another agent's lesson in progress (review hash), none of this task's files.

## Task 2 (S): precache list builder and its build step

Files: `src/offline/precache.ts` (new, pure, no Node imports), `src/offline/precache-node.ts` (new, the Node adapter), `scripts/offline-manifest.ts` (new, the one build step), `package.json` (`build` runs it after the production content emit and before `next build`), tests `tests/offline/precache.test.ts`, `tests/scripts/offline-manifest.test.ts`.

- Pure `buildPrecacheEntries(input)` from: page paths, served lessons with their emitted file hashes and tips presence, `allSoundUrls()`, the list of `public/` files with hashes, `MANIFEST_PATH` and the favicon path from `src/lib/brand.ts`, a build id. Returns `{ url, revision }[]` per `spec.md` section 4.
- `precache-node.ts`: `readPrecacheInput(rootDir, buildId)` walks `public/` (skips every dotfile, such as `.DS_Store`), hashes files (sha256, first 12 hex), applies `PRECACHE_DENY` (one constant, a reason per entry: `media/`, `sounds/`, `content/`, `brand/share.png`).
- `scripts/offline-manifest.ts` is the only producer of the generated list: it writes it to one generated, gitignored file the worker build reads, prints the entry count and total bytes, and fails above `PRECACHE_BUDGET_BYTES` (50 MB). Vercel's `pnpm build` and the lab script both call it, so the two builds cannot differ.
- A filter for build files that drops `.ttf` and `.woff`, in the pure module so the worker build can use it.

Acceptance:
- [x] Tests: every served lesson and its tips file present; every page path present with the build id as revision; every `allSoundUrls()` URL present with no revision; no song; no URL under `/api/`, `/media/`, `/unlock`, `/dev/`; no `share.png`; no dotfile; a file under a `maps/` folder of the test fixture's public dir is included (generic rule); revisions equal the sha256 prefix.
- [x] A served lesson whose emitted file is missing fails with the lesson id; a budget breach fails with the total.
- [x] `precache.ts` imports nothing from `node:*` (test reads its imports).
- [x] Gate green.

## Task 3 (S): request strategy

Files: `src/offline/strategy.ts` (new, pure), `tests/offline/strategy.test.ts`.

- `routeFor({ url, mode, headers, origin, mediaBaseUrl })` returns `"network-first"`, `"precache-first"` or `"passthrough"` per the table in `spec.md` section 5. Any request with a `Range` header is `"passthrough"`.
- `fetchInit(kind)`: network-first fetches use `cache: "no-cache"` (the browser revalidates, so `/content/*`'s 60 s HTTP cache cannot hide a new lesson); install fetches use `cache: "reload"`.
- `storable(response, requestedUrl)` true only for status 200, not `redirected`, not opaque, final URL equal to the requested one.
- `PAGE_TIMEOUT_SECONDS = 3` for navigations only; `/content` falls back only on a network error (no timeout).

Acceptance:
- [ ] One test per table row: cross-origin media URL, same-origin `/media/x.mp4`, any `.vtt`, `/api/sync`, `/api/session`, `/unlock?next=%2F`, RSC by header and by `_rsc` query, a navigation with a query, `/content/x.json`, a `/_next/static/` chunk, a short sound, a song (not in the precache, so passthrough in effect), a `Range` request for a sound, an unknown path.
- [ ] `fetchInit` cases; `storable` rejects 301/302/307, `redirected: true`, 401, 404, 500, opaque, and a final URL of `/unlock`.
- [ ] Gate green.

### Checkpoint 1

- [ ] Gate green; `git diff --stat` since the start of Task 1 touches only `src/offline/`, the five page files, `scripts/offline-manifest.ts`, the `build` script and tests. The generated list is produced but nothing reads it yet; no app behaviour changed. Record in "Done".

## Task 4a (S): Serwist spike, findings only

Files: `scripts/offline-lab.ts` (new, the worktree lab of the rules above, kept), `e2e/targets.ts` (`OFFLINE_SERVER_ENV`, `OFFLINE_PORT` = `TEST_PORT + 3000`), this file (findings). Spike code for the worker stays uncommitted in the lab worktree; only the lab script, the env constant and the findings are committed.

Read first: `node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md` (securing the worker script), `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`, the `@serwist/turbopack` README (install it inside the lab worktree only).

Record each criterion with evidence:
1. A Turbopack `next build` of Next 16.3.7 produces the worker and serves it at a fixed path.
2. The precache list can take the generated entries and every `/_next/static` file except ttf and woff.
3. The default precache route can be left unregistered, and the worker can look a URL up in the precache itself (`matchPrecache` / cache key for URL), so pages and `/content` stay network first. Lookups never use a bare `caches.match(request)`: precache keys carry a revision parameter and Next pages answer with `Vary` on the RSC headers.
4. Install fails (no entry written) when one precache fetch is redirected or 401.
5. Registered by hand in the lab production run (Chromium), the worker controls the page with scope `/`, and an offline reload of a lesson never opened before renders it.
6. Same in Playwright WebKit: works or not (decides the E2E projects).
7. Whether `context.setOffline(true)` cuts the worker's own fetches in Chromium; whether `context.route` can serve a changed worker script; whether `response.fromServiceWorker()` tells a passed-through `/api/sync` answer from a worker answer.

Acceptance:
- [ ] Criteria 1 to 7 recorded here with evidence; decision written: Serwist (1 to 5 pass) or the hand-written fallback (a worker bundled by esbuild in the build step, a versioned cache per build, unchanged revisions copied from the previous cache, same modules and messages).
- [ ] The lab script creates and removes its worktree, leaves the main tree's `public/content`, `tsconfig.json` and `next-env.d.ts` unchanged (`git status` before and after), and never contacts the media bucket.
- [ ] Gate green.

## Task 4b (M): the service worker

Files: `package.json` and `pnpm-lock.yaml` (Serwist packages, if kept), `src/offline/sw.ts` (new), the script route or build step 4a chose, `src/offline/config.ts` (worker script path and scope, one place), `src/access/gate.ts` (public file list = `BRAND_PUBLIC_PATHS` plus the worker path), `tests/access/gate.test.ts`, `next.config.ts` (worker script headers), `tsconfig.json` (type includes for the worker, and the lab build folder's types like the `.next-gate` lines), `scripts/bundle-check.ts` and its test (scan the worker script too), `.gitignore` (the generated list), tests for the worker wiring.

- The worker imports only pure modules (`strategy.ts`, the build-file filter, `config.ts`) and the generated list; never `routes.ts` or `precache-node.ts`.
- `routeFor` for every fetch; no default precache route, no `defaultCache`, no runtime cache; precache lookups by precache key; `storable` as the install-time check; install fetches with `cache: "reload"`.
- Navigations: network first (`no-cache`), fallback after `PAGE_TIMEOUT_SECONDS` or a network error to the precached page of the same path, query ignored, else a network error. `/content/*.json`: network first (`no-cache`), fallback only on a network error. The network answer is returned untouched and never stored.
- `clients.claim()` on activation; `skipWaiting()` only on a `SKIP_WAITING` message; `PRECACHE_STATUS` answers `{ state, cached, total }` from whichever worker receives it (the installing one reports progress, the active one reports ready).
- Script served with `Cache-Control: no-cache` and, if not at `/`, `Service-Worker-Allowed: /`.

Acceptance:
- [ ] Lab run (Chromium): manual registration, offline reload of a never-opened lesson renders; online, a page path whose server copy changed (second lab build) comes back new, not from the precache.
- [ ] Gate test: the public file list is exactly `BRAND_PUBLIC_PATHS` plus the worker path (`/unlock` and `/api/session` keep their own rules).
- [ ] Bundle check scans the worker script; its test proves a secret placed in the worker fails it.
- [ ] Nothing registers the worker in the app yet (`grep` for `serviceWorker.register` finds only test code).
- [ ] Gate green; dev server on 3001 untouched.

## Task 4c (S): kill switch for a bad worker

A broken worker on the child's iPad is the worst failure here, so there is a documented way to undo it without touching the device.

Files: the worker build step 4b chose (a build flag), `src/offline/kill-switch.ts` or the equivalent script source, `next.config.ts` (the `Clear-Site-Data` header on the same script path), tests; the runbook goes into `docs/operations.md` in Task 9.

- One flag (`OFFLINE_KILL_SWITCH=1` at build time, so a deploy can carry it) makes the worker script at the same public path a self-unregistering one: it takes over at once (`skipWaiting`), deletes every Cache Storage entry, calls `registration.unregister()` and reloads the open windows. Browsers fetch the script at that path on every update check (`no-cache`, `updateViaCache: "none"`), so a deploy with the flag reaches every device that opens or resumes the app.
- Registration code stays unchanged; with no worker left, the app runs as before offline support existed.
- `Clear-Site-Data: "cache", "storage"` is rejected: `"storage"` would also wipe IndexedDB, which holds the child's unsynced progress. If used at all it would be `"cache"` only (Cache Storage), on the worker script response; Chromium honours it, Safari does not, so the self-unregistering script is the real mechanism.

Acceptance:
- [ ] With the flag, the built script is the self-unregistering one; a lab run (Chromium) with a worker installed from the normal build, then the flag build served: the worker is gone, Cache Storage is empty, Dexie is intact, the app still loads online.
- [ ] Unit test of the script's steps; the flag is off by default and a normal build never contains it.
- [ ] Gate green.

### Checkpoint 2

- [ ] Decision and evidence of 4a, the lab results of 4b and 4c written here. If the fallback was taken, `spec.md` Q1 gets a one-line note.

## Task 5 (S): registration and update banner

Files: `src/offline/register.tsx` (new), `src/app/(child)/layout.tsx`, `src/components/parent/parent-screen.tsx` (mount only), `src/components/update-banner.tsx` (new), tests in `tests/offline/register.test.tsx`.

- Production only (`process.env.NODE_ENV === "production"`); in dev, unregister every registration found on the origin.
- Register on mount with `updateViaCache: "none"`; `registration.update()` at start, on `visibilitychange` to visible, every 60 minutes while visible.
- Boot apply: when the page has just loaded, a worker is already waiting and the page is not a section or review player, post `SKIP_WAITING` at once (no lazy chunk is in use yet) and reload on `controllerchange`.
- Waiting worker found later: banner "Có bài mới, tải lại" on screens outside the players; inside a player, nothing until the child leaves it.
- Tap: post `SKIP_WAITING`. Visible after hidden ≥ 15 minutes (`UPDATE_IDLE_MINUTES`) outside a player: post it automatically.
- `controllerchange`: reload at once outside a player; inside one, keep a pending flag and reload when the child leaves the player or taps the banner. A first install (no previous controller) does not reload.
- After the first activation, call `navigator.storage.persist?.()` once.
- Player detection from the pathname (`/lessons/<id>/sections/<id>`, `/lessons/<id>/review`), one helper.

Acceptance:
- [ ] Component tests with a fake `navigator.serviceWorker` cover every rule above, including boot apply, dev unregister and the first-install case.
- [ ] Banner copy and spacing follow `docs/design-system.md`; screenshot in a lab run at the iPad and phone sizes, read by the agent.
- [ ] Gate green.

## Task 6 (S): media offline states

Files: `src/lib/network-status.ts` (new), `src/components/blocks/video-player.tsx`, `src/learn/narration.tsx`, `src/components/blocks/video-preload.tsx`, the song button in `src/app/(child)/sticker-sheet.tsx` with `src/music/use-music-player.ts`, `src/components/media-loading.tsx` if the state belongs there; their tests.

- `useNetworkStatus()` per `spec.md` section 7; a download that throws a `TypeError` (network) marks offline.
- Video: "Cần mạng để xem video"; narration: "Cần mạng để nghe đọc bài"; song: "Cần mạng để nghe nhạc". No ring, no percentage. Recovery: on `online`, when the page becomes visible again, or on a tap of the state (wifi without internet never fires `online`). The video restarts its download; the narration keeps the tap rule (`play-from-tap.ts`); the song button becomes usable.
- Preload skips while offline.
- Nothing about storage changes: media stays in memory only.

Acceptance:
- [ ] Tests: each player with `navigator.onLine` false, and with a download that rejects with `TypeError` while `onLine` stays true, shows its line and no percentage; `online`, visible and tap each recover; preload does not fetch offline; existing media tests (`tests/components/video-player.test.tsx`, `tests/lib/media-download.test.ts`, `tests/lib/play-from-tap.test.ts`, `tests/learn/lesson-overview.test.tsx`) still green.
- [ ] Gate green.

## Task 7 (S): parent readiness line

Files: `src/offline/status.ts` (new), `src/components/parent/offline-status.tsx` (new), mounted next to `sync-status.tsx` in the parent dashboard; tests.

- Asks `PRECACHE_STATUS` of the installing worker if there is one, else the active one; shows "Dùng khi không có mạng: sẵn sàng" when the active worker is ready, "đang tải (cached/total)" while one installs, "chưa sẵn sàng" with no worker (dev, or not installed yet). Refreshes on `controllerchange`, on `updatefound` and every few seconds while not ready.

Acceptance:
- [ ] Component tests for the three states and the refresh.
- [ ] Gate green.

### Checkpoint 3

- [ ] Lab run: banner appears after a second lab build with a changed lesson (second build folder, the first server stopped by its own PID first), tap reloads; parent line goes from "đang tải" to "sẵn sàng". Screenshots read and listed here.

## Task 8 (M): offline E2E on a production build

Files: `e2e/targets.ts` (`OFFLINE_*` beside `OFFLINE_SERVER_ENV`), `playwright.offline.config.ts` (new, Chromium with the iPad viewport; WebKit too if 4a criterion 6 passed), `e2e/offline.spec.ts` (new), `package.json` script `test:e2e:offline` (runs the lab script, which builds `HEAD` in its worktree and starts the server, then this config against it).

Scenarios (details in `spec.md` section 11): 1 offline cold start (navigation offline by tapping links in the app, not `page.goto`; parent PIN set first to read the readiness line), 2 offline study kept and `/api/sync` passed through, 3 media offline states, 4 nothing stored that must not be (walk every Cache Storage entry; IndexedDB names), 5 gate (cleared cookie online goes to `/unlock`; a never-unlocked context has no worker), 6 update flow (as 4a criterion 7 decided).

Acceptance:
- [ ] `pnpm test:e2e:offline` green; run twice in a row to show it is stable.
- [ ] The everyday `pnpm test:e2e` still green; `e2e/unlock.spec.ts` test renamed to say the dev server registers no worker.
- [ ] No request leaves localhost: a guard that also sees worker-initiated requests (`context.on("request")` plus a check of every response URL, not only `context.route`), and the bundle check of the lab script for a media origin.
- [ ] Gate green; main tree's `public/content`, `tsconfig.json` unchanged by the run; dev server untouched.

### Checkpoint 4

- [ ] Both E2E commands green; evidence (test list output) pasted here.

## Task 9 (S): docs and deploy smoke

Files: `docs/spec.md` section 5.9 and the test strategy row, `docs/architecture.md` (module `offline/`, the media loading line, the manifest line, the checks table rows), `docs/operations.md` ("Kiểm trên iPad Safari" offline steps, step 9 no longer says offline is missing, deploy smoke expectations), `src/app/manifest.ts` comment, `README.md` (the new command), `scripts/lib/deploy-prod.ts` and its test (smoke: the worker script answers 200 without the cookie with `Cache-Control: no-cache`).

Acceptance:
- [ ] Every doc statement checked against the code (grep for "no service worker", "chưa có offline", "không có service worker" leaves only true statements).
- [ ] Durable files hold no task numbers, checkpoint names or other planning jargon (grep `Task [0-9]`, `Checkpoint`, `§`).
- [ ] Gate plus `pnpm content:check` green.

### Final

- [ ] Backlog index row updated; leftovers listed here; folder archived with `git mv` to `notebooks/backlogs/archive/offline-pwa/` with an "Archived: ..." line once the owner has deployed and checked the iPad.

## Open for the owner (non-blocking)

- A production server refuses the folder sync store (`src/sync/store/config.ts`, "SYNC_STORE is not allowed on a production server"), so the offline E2E cannot show offline answers arriving in a store. It checks that they stay in Dexie and that `/api/sync` passes the worker untouched; the existing dev-server `e2e/sync.spec.ts` keeps covering "offline, then online, the cloud has it". If the owner wants the full path on a production build, it needs a test-only exception in `src/sync/store/config.ts`, which this backlog does not touch.

## Plan review

A fresh Opus reviewer read the three files against the code (2 Critical, 10 Should-fix, 8 Nit). Each finding was checked in code before acting. What changed:

- Critical, sync store refused on a production server: confirmed (`src/sync/store/config.ts`). E2E 2 now checks Dexie and the `/api/sync` pass-through instead of the store; the full path stays with the dev sync E2E; the exception is listed for the owner above (theo đề xuất, no change to `src/sync/**`).
- Critical, `.env.production.local` holds real values a test build would read: confirmed (the file exists). `OFFLINE_SERVER_ENV` overrides them, media comes from local `/media`, the lab script fails on a bundled `https://` media origin, the localhost guard also sees worker requests.
- Precache route answering pages cache first, and bare `caches.match`: the default precache route is not registered and lookups go by precache key (4a criterion 3, 4b).
- Cold-start update hole on iOS: boot apply added (Task 5, `spec.md` section 6).
- HTTP cache defeating network first: `cache: "no-cache"` for network-first, `cache: "reload"` at install (Task 3).
- Mixed builds from a per-request timeout: `/content` falls back only on a network error; Q3 reworded.
- No single build step for the list, Node code reaching the worker: `scripts/offline-manifest.ts` used by `pnpm build` and the lab; pure module and Node adapter split.
- Builds disturbing the owner's tree (`content:emit` deletes `public/content`; `next build` edits `tsconfig.json`; `next-env.d.ts` is gitignored, so the old restore line was wrong): production checks run in a temporary worktree (`scripts/offline-lab.ts`).
- E2E details: offline navigation by tapping links; sound checked by fetch instead of audio; PIN set before the parent line.
- Task 4 too big: split into 4a (spike, findings only) and 4b.
- Backlog not linked from the index: linked in the same commit as this review.
- Wifi without internet leaves "Cần mạng" stuck: recovery also on visible and tap.
- Nits taken: public file list wording, dotfiles skipped, `Range` requests passed through, `updateViaCache: "none"`, which worker answers the status, rebuild while serving, `musicUrls` dropped, draft lessons in the size table.
