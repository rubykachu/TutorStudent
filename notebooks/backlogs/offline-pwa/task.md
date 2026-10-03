# Tasks: offline support (service worker precache)

Spec: `spec.md`. Plan and dependency graph: `plan.md`. Status: reviewed and merged into `main`, off by default until the owner's iPad check (see Handover). The owner approved building without a review of this plan; every decision follows `spec.md` section 10 ("theo đề xuất"). The plan was critiqued by a fresh reviewer; findings and fixes are in "Plan review" at the end.

## Handover

Production (03/10/2026): `NEXT_PUBLIC_OFFLINE_ENABLED=1` set in Vercel Production and `38c726d` deployed (smoke 7/7; `media:upload --all --dry-run` showed nothing to upload). Desktop Chromium on production: `/sw.js` is the real worker (200, `no-cache`), the parent line went from "đang tải (3/767)" to "sẵn sàng", the cache holds 767 entries and no lesson media (only the app's `/sounds/*.m4a`), and a reload offline opened the app. Still open: the iPad check (`docs/operations.md`, "Bật offline", step 3). Rollback if it fails: remove the variable and redeploy, or use the kill switch.

Known flake: `e2e/unlock.spec.ts:143` (iPad project, "a Home Screen launch opens the unlock page once...") sometimes fails at code entry -> `/profiles` on a cold dev compile or a full disk, before any worker logic; it failed once in the release run at `38c726d` (disk at 361 MB) and the owner accepted it.

Status after the independent review: merged into `main` with the worker OFF by default. Next: the owner turns it on (`NEXT_PUBLIC_OFFLINE_ENABLED=1` in Vercel Production, deploy) and runs the iPad check (`docs/operations.md`, "Bật offline", then "Kiểm trên iPad Safari" steps 9 and 10). Archive this folder once that check passes.

### Independent review (fresh Opus session)

No Critical. Fixed on the branch, each with unit tests:
- High: Next adds `?dpl=<deployment id>` to build file URLs when the build has a deployment id (Vercel with Skew Protection). The precache lookup used path plus query, so offline every chunk and CSS file missed and the page could not start. `precacheLookupPath` drops the parameter; the lab now builds with `NEXT_DEPLOYMENT_ID` so the offline E2E covers it (78 `?dpl=` asset URLs on the home page, scenario 1 green).
- High (rollout): WebKit is untested, so `src/offline/flags.ts` adds `NEXT_PUBLIC_OFFLINE_ENABLED`. Unset: no registration, any registration removed, `/sw.js` is the retiring worker, the parent line says "chưa bật". The kill switch wins over it.
- Medium, fixed: a navigation copied with the `no-cache` init by an engine that refuses the copy would fail every network-first page fetch and serve every page from the precache; the init is now used only when the copy works.
- Medium, fixed: an install racing the activation of a newer build could finish into a deleted cache and run with nothing stored; the install now fails when its cache is gone.

Measured: 756 entries, 20.9 MB in the precache (pages 1.75 MB, build files 8.5 MB, the rest content, short sounds and public files), well under the 50 MB budget.

Leftovers from the review (none blocks the merge, all matter only once the flag is on):
- [x] `/content/*.json` has no timeout: on wifi without internet the page comes from the precache after 3 s, but the lesson file waits for the browser's own network timeout. Fixed: `CONTENT_TIMEOUT_SECONDS = 10` in `strategy.ts`, used by `sw-core.ts` (falls back on a network error or timeout); `spec.md` section 5 and Q3 amended; tests in `sw-core.test.ts` and `strategy.test.ts`.
- [x] A failed install has no backoff: every update check (and every page load before the first install) downloads entries again until the failing one. Fixed: `update-controller.ts` stores the failure count and next attempt in `localStorage` (1 h, 6 h, 24 h; cleared on `installed`); `spec.md` section 6 step 5; tests in `update-controller.test.ts`.
- After the 3 s timeout the precached page of the old build runs with the network's newer lesson file.

### Before the review

Next (then): an independent review of the branch `offline-pwa` (worktree `scratchpad/offline/wt` of the overnight run), then the merge into `main`, then the owner's deploy and iPad check (`docs/operations.md`, "Kiểm trên iPad Safari" steps 9 and 10). Nothing is deployed or pushed. Review focus: `src/offline/sw-core.ts` (the worker's behaviour), `src/offline/update-controller.ts` (when a new build takes over), `src/access/gate.ts` (the one public path added), `scripts/offline-worker.ts` and the `pnpm build` order, the kill switch.

Where the work lives: Tasks 1 to 3 and the lab were committed on `main` before the branch rule (listed under "Done"); everything from Task 4a on is on `offline-pwa`. `main` keeps only inert build-time modules and the lab; the `pnpm build` hook for the precache list was reverted on `main` and is part of the branch. When merging, `notebooks/backlogs/index.md` (touched on both sides) needs a hand merge.

Decisions of the overnight run: Q18 answered theo đề xuất, no test-only exception in `src/sync/store/config.ts`. Ports: the lab serves on 3600 (`OFFLINE_PORT` = `TEST_PORT + 500`), inside the range the owner allowed, instead of `TEST_PORT + 3000`. The kill switch is Task 4c, documented in `docs/operations.md` ("Gỡ service worker lỗi"). `pnpm content:check` on the main tree can fail on another agent's lesson in progress; the branch worktree holds only committed content.

### Done (commits, oldest first)

- On `main` (before the branch rule): 3df7eb5 (Task 1), d954fb5 (Task 2), 29c4fda (Task 3), cfafc94 and e06817c (lab, `OFFLINE_*` in `e2e/targets.ts`, an `env` option in `scripts/lib/run.ts`). All are build-time or test modules that nothing in the running app imports, except the five pages' `generateStaticParams`, which return the same lists as before. The one runtime-adjacent change, the `pnpm build` hook for the precache list in d954fb5, was reverted on `main` by e37cb03 and re-applied on the branch by 30b0043.
- Task 1: `src/offline/routes.ts` (param functions shared with the five pages, `appPagePaths()`, `NOT_PRECACHED_ROUTES`), `tests/offline/routes.test.ts`.
- Task 2: `src/offline/precache.ts` (pure list, deny-list, budget), `src/offline/precache-node.ts`, `scripts/lib/offline-manifest.ts` and `scripts/offline-manifest.ts` (writes `src/offline/precache-list.generated.json`, gitignored, run by `pnpm build`), `FAVICON_ICO_PATH` in `src/lib/brand.ts`. The build id is a timestamp per build. The budget counts only what is known before `next build` (content, sounds, public files); pages and build files are measured by the worker build (Task 4b).
- Task 3: `src/offline/strategy.ts` (`routeFor`, `fetchInit`, `storable`, `navigationFallbackPath`, `PAGE_TIMEOUT_SECONDS`), `tests/offline/strategy.test.ts`. `routeFor` also takes `method` and `isPrecached(url)` (the worker passes a lookup in its precache): precache-first is decided by the list, so a song, a Range request or an unknown path is passthrough without a path-prefix table that could drift from the list.
- Checkpoint 1 (on main): gate green (196 files, 4080 tests); changed files are `src/offline/`, the five page files, the manifest script and lib, `build` script, `.gitignore`, one constant in `src/lib/brand.ts`, tests; nothing reads the generated list; no app behaviour changed.

- Branch `offline-pwa`: 30b0043 (precache list step back in `pnpm build`, lab finds media in the main tree), 5ff747c (Serwist findings, this file).
- Task 4b: e105145. Hand-written worker: `src/offline/sw-core.ts` (all behaviour, injected deps, unit-tested on a fake cache and network), `sw.ts` (wiring), `config.ts` (path, cache prefix, messages), `scripts/lib/offline-worker.ts` and `scripts/offline-worker.ts` (esbuild bundle of the worker with the list injected, written to gitignored `public/sw.js` after `next build`; fails above the budget now counting build files and page HTML), `PUBLIC_FILE_PATHS` in `src/access/gate.ts`, `no-cache` header for `/sw.js` in `next.config.ts`, the bundle check reads `public/sw.js` too (`readClientFiles`), `esbuild` as a dev dependency.
- Task 4c: 705c89c and 208b70c. `src/offline/sw-kill.ts` and `kill-switch.ts` (the retiring worker), `kill-switch-flag.ts` (`NEXT_PUBLIC_OFFLINE_KILL_SWITCH`), a build guard that fails when the worker bundle reads `process.env`.

- Task 5: bff7a9b. `src/offline/update-controller.ts` (registration and update rules, framework-free), `src/offline/register.tsx` (`OfflineManager`, mounted in the child layout and the parent screen), `src/components/update-banner.tsx`, `UPDATE_*_MINUTES` in `config.ts`.
- Task 6: 78da211. `src/lib/network-status.ts` (`useNetworkStatus`, one store for every player), `MediaOffline` in `media-loading.tsx`, offline states in the video player, narration, preload and the song button. Five existing tests that simulated a failed download with a `TypeError` now use a 500 answer, because a network error is the offline state by design (`tests/setup.ts` also resets the shared network state after each test).
- Task 7: df2fe88. `src/offline/status.ts`, `src/components/parent/offline-status.tsx`, mounted in `parent-dashboard.tsx`.

- Task 8: fc49286. `playwright.offline.config.ts`, `e2e/offline.spec.ts` (six scenarios on one Chromium device), `test:e2e:offline` in `package.json`, `testIgnore` in `playwright.config.ts`, the unlock test renamed.
- Task 9: a7ae673. Docs (`docs/spec.md` 5.9, `docs/architecture.md`, `docs/operations.md`, `README.md`, `.env.example`), a seventh deploy smoke check (`/sw.js` 200 with `no-cache`), the manifest comment, the backlog index.
- Final fixes found by the everyday E2E: the parent line is `aria-live`, not `role="status"` (it made `getByRole("status")` ambiguous on the parent page).

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
- [x] One test per table row: cross-origin media URL, same-origin `/media/x.mp4`, any `.vtt`, `/api/sync`, `/api/session`, `/unlock?next=%2F`, RSC by header and by `_rsc` query, a navigation with a query, `/content/x.json`, a `/_next/static/` chunk, a short sound, a song (not in the precache, so passthrough in effect), a `Range` request for a sound, an unknown path.
- [x] `fetchInit` cases; `storable` rejects 301/302/307, `redirected: true`, 401, 404, 500, opaque, and a final URL of `/unlock`.
- [x] Gate green.

### Checkpoint 1

- [x] Gate green; `git diff --stat` since the start of Task 1 touches only `src/offline/`, the five page files, `scripts/offline-manifest.ts`, the `build` script and tests. The generated list is produced but nothing reads it yet; no app behaviour changed. Record in "Done".

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
- [x] Criteria 1 to 7 recorded here with evidence; decision written: Serwist (1 to 5 pass) or the hand-written fallback (a worker bundled by esbuild in the build step, a versioned cache per build, unchanged revisions copied from the previous cache, same modules and messages).
- [x] The lab script creates and removes its worktree, leaves the main tree's `public/content`, `tsconfig.json` and `next-env.d.ts` unchanged (`git status` before and after), and never contacts the media bucket.
- [x] Gate green.

### Findings of the Serwist trial (Task 4a)

Setup: `serwist` and `@serwist/turbopack` 9.5.12 plus `esbuild`, added inside the lab worktree only (`--setup`), with the route handler `/serwist/[path]` (`createSerwistRoute`: `swSrc`, native esbuild, `globPatterns` on `.next/static`, `globIgnores` for ttf, woff and maps, `additionalPrecacheEntries` from the generated list) and a worker wired by hand: one `fetch` listener calling `routeFor`, lookups with `serwist.matchPrecache`, `handleInstall` and `handleActivate`, a plugin whose `cacheWillUpdate` applies `storable`. The default precache route is registered by the Serwist constructor but never consulted, because `handleFetch` is not used. The probe scripts and the overlay live in the scratchpad, not in git. Chromium and Playwright WebKit, production build of `HEAD` in the lab worktree, gate on.

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | Turbopack `next build` produces the worker at a fixed path | pass, with a header to fix | built, served at `/serwist/sw.js`, 96,832 bytes, `Service-Worker-Allowed: /`; default `Cache-Control: s-maxage=31536000` would need an override |
| 2 | Precache takes our entries and every `/_next/static` file except ttf and woff | pass | 755 entries (8.7 MB) in the cache: 309 chunks, 30 woff2, 0 ttf or woff, 331 lesson pages, 34 lesson files, 0 under `/media/` or `/api/` |
| 3 | Default route left out, lookups by precache key, pages and `/content` network first | pass | offline reload of a lesson renders; online navigation answered by the worker's network-first path; lookups only through `matchPrecache` |
| 4 | Install fails and writes no entry when one fetch is redirected or 401 | **fail** | with `/profiles` answered 401, answered by a 302 to `/unlock`, or aborted, the entry is not written (the plugin works) but the install never settles: the worker stays "installing" for 30 s and more, never `redundant`, with the other 754 entries already in the live cache |
| 5 | Chromium: worker controls scope `/`, offline reload of a never-opened lesson renders | pass | controlled `true`, scope `http://localhost:3600/`; `/lessons/thu-tu-trong-tap-hop-cac-so-tu-nhien` rendered offline from the precache |
| 6 | Playwright WebKit | partial, not usable for the E2E | registers, controls, precaches 755 entries, `fromServiceWorker()` true; but `page.goto` while `setOffline(true)` fails with "WebKit encountered an internal error", and `context.route` does not see the worker's requests (the 401 case installed 755 entries), `context.on("request")` saw none. The gate cookie is `Secure` in production, which WebKit drops on `http://localhost`, so the probe added it by hand |
| 7 | Offline tooling | pass (Chromium) | `setOffline(true)` cuts the worker's own fetches (a not-precached sound and an unknown `/content` file both fail); `context.route` serves a changed worker script and `registration.update()` then finds a waiting worker; `response.fromServiceWorker()` is `false` for `/api/sync` and `true` for a navigation; `context.on("request")` sees worker requests (`request.serviceWorker()` set, 767 in the run) |

Root cause of criterion 4: `parallel` in `@serwist/utils` builds its queues with `new Promise(async (resolve) => ...)`. When one task throws, the async executor's rejection is dropped, that queue never settles, `Promise.all` waits forever and `handleInstall` neither resolves nor rejects. A stuck install shows "đang tải" on the parent line forever and is not retried by the browser until the worker is replaced. Fixing it means replacing `handleInstall` with our own loop, after which Serwist would only supply key mapping and cleanup. Other costs seen: entries are written one by one into the live cache (not atomic per build), the script carries the whole Serwist runtime, and the integration pulls `@swc/core`, `esbuild`, `browserslist` and `zod` and reads `next/dist/server/config.js`.

**Decision: the hand-written worker.** Criterion 4 fails, the plan's fallback applies: a worker bundled by esbuild in the build step from `src/offline/sw.ts`, written to `public/sw.js` after `next build` (so Vercel ships it and it sits at the root, no `Service-Worker-Allowed` needed), a versioned cache per build (`offline-<buildId>`) written all or nothing, unchanged revisions copied from the previous cache, the same modules (`strategy.ts`, `precache.ts` filters) and messages. The offline E2E runs on Chromium only. `spec.md` Q1 and Q11 get a one-line note at Checkpoint 2.


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

- One flag (`NEXT_PUBLIC_OFFLINE_KILL_SWITCH=1` at build time (set in the Vercel production environment, then redeploy), so a deploy can carry it) makes the worker script at the same public path a self-unregistering one: it takes over at once (`skipWaiting`), deletes every Cache Storage entry, calls `registration.unregister()` and reloads the open windows. Browsers fetch the script at that path on every update check (`no-cache`, `updateViaCache: "none"`), so a deploy with the flag reaches every device that opens or resumes the app.
- The page code (Task 5) reads the same flag and stops registering, so the retiring worker is not registered again; with no worker left, the app runs as before offline support existed.
- `Clear-Site-Data: "cache", "storage"` is rejected: `"storage"` would also wipe IndexedDB, which holds the child's unsynced progress. If used at all it would be `"cache"` only (Cache Storage), on the worker script response; Chromium honours it, Safari does not, so the self-unregistering script is the real mechanism.

Acceptance:
- [x] With the flag, the built script is the self-unregistering one; a lab run (Chromium) with a worker installed from the normal build, then the flag build served: the worker is gone, Cache Storage is empty, Dexie is intact, the app still loads online.
- [x] Unit test of the script's steps; the flag is off by default and a normal build never contains it.
- [x] Gate green.

Results (lab, Chromium): a worker installed from the normal build (756 entries), then the flag build served on the same origin and profile: `/sw.js` is the retiring script (no precache list, `no-cache`); after one update check the registration list is empty, `caches.keys()` is empty, the `tutor` IndexedDB database is still there, the home screen shows the profile created before, a lesson loads online. Unit tests: the retiring steps, the flag off by default in a normal worker, the `process.env` guard. `Clear-Site-Data` is not used: `"storage"` would wipe IndexedDB with unsynced progress, `"cache"` does not touch Cache Storage, and Safari ignores the header, so the retiring worker is the only mechanism.


### Checkpoint 2

- [x] Decision and evidence of 4a, the lab results of 4b and 4c written here. If the fallback was taken, `spec.md` Q1 gets a one-line note.

Checkpoint 2 evidence: decision and criteria table under "Findings of the Serwist trial" (Serwist fails criterion 4, hand-written worker taken); lab results under Task 4b and Task 4c. `spec.md` Q1 and Q11 carry a one-line note.

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
- [x] Component tests with a fake `navigator.serviceWorker` cover every rule above, including boot apply, dev unregister and the first-install case.
- [x] Banner copy and spacing follow `docs/design-system.md`; screenshot in a lab run at the iPad and phone sizes, read by the agent.
- [x] Gate green.

## Task 6 (S): media offline states

Files: `src/lib/network-status.ts` (new), `src/components/blocks/video-player.tsx`, `src/learn/narration.tsx`, `src/components/blocks/video-preload.tsx`, the song button in `src/app/(child)/sticker-sheet.tsx` with `src/music/use-music-player.ts`, `src/components/media-loading.tsx` if the state belongs there; their tests.

- `useNetworkStatus()` per `spec.md` section 7; a download that throws a `TypeError` (network) marks offline.
- Video: "Cần mạng để xem video"; narration: "Cần mạng để nghe đọc bài"; song: "Cần mạng để nghe nhạc". No ring, no percentage. Recovery: on `online`, when the page becomes visible again, or on a tap of the state (wifi without internet never fires `online`). The video restarts its download; the narration keeps the tap rule (`play-from-tap.ts`); the song button becomes usable.
- Preload skips while offline.
- Nothing about storage changes: media stays in memory only.

Acceptance:
- [x] Tests: each player with `navigator.onLine` false, and with a download that rejects with `TypeError` while `onLine` stays true, shows its line and no percentage; `online`, visible and tap each recover; preload does not fetch offline; existing media tests (`tests/components/video-player.test.tsx`, `tests/lib/media-download.test.ts`, `tests/lib/play-from-tap.test.ts`, `tests/learn/lesson-overview.test.tsx`) still green.
- [x] Gate green.

## Task 7 (S): parent readiness line

Files: `src/offline/status.ts` (new), `src/components/parent/offline-status.tsx` (new), mounted next to `sync-status.tsx` in the parent dashboard; tests.

- Asks `PRECACHE_STATUS` of the installing worker if there is one, else the active one; shows "Dùng khi không có mạng: sẵn sàng" when the active worker is ready, "đang tải (cached/total)" while one installs, "chưa sẵn sàng" with no worker (dev, or not installed yet). Refreshes on `controllerchange`, on `updatefound` and every few seconds while not ready.

Acceptance:
- [x] Component tests for the three states and the refresh.
- [x] Gate green.

### Checkpoint 3

- [x] Lab run: banner appears after a second lab build with a changed lesson (second build folder, the first server stopped by its own PID first), tap reloads; parent line goes from "đang tải" to "sẵn sàng". Screenshots read and listed here.



Checkpoint 3 evidence (lab, Chromium, production build of the branch, gate on; scripts and screenshots in the scratchpad `offline/cp3*`): the app registers the worker by itself after the profile is created; with the build files slowed by 120 ms each, the parent line went from "Dùng khi không có mạng: đang tải (n/756)" to "sẵn sàng". A second lab build of the same origin with one page changed: the home screen shows the banner "Có bài mới, tải lại" while the old worker still controls the page, tapping it reloads once, the banner is gone, only the new build's cache is left, the parent line says "sẵn sàng" and the lesson page is the new one. Screenshots read: `banner-ipad.png` (820 wide) and `banner-phone.png` (390 wide), the banner sits above the greeting, aligned with the cards' margins, 48 px tall, no overlap; `parent-ready-ipad.png` and `parent-ready-phone.png`, the readiness card sits under the source note. The banner inside a lesson player is covered by the component tests, not by this run (a player is reached by a full navigation here, which applies a waiting worker at boot by design).

## Task 8 (M): offline E2E on a production build

Files: `e2e/targets.ts` (`OFFLINE_*` beside `OFFLINE_SERVER_ENV`), `playwright.offline.config.ts` (new, Chromium with the iPad viewport; WebKit too if 4a criterion 6 passed), `e2e/offline.spec.ts` (new), `package.json` script `test:e2e:offline` (runs the lab script, which builds `HEAD` in its worktree and starts the server, then this config against it).

Scenarios (details in `spec.md` section 11): 1 offline cold start (navigation offline by tapping links in the app, not `page.goto`; parent PIN set first to read the readiness line), 2 offline study kept and `/api/sync` passed through, 3 media offline states, 4 nothing stored that must not be (walk every Cache Storage entry; IndexedDB names), 5 gate (cleared cookie online goes to `/unlock`; a never-unlocked context has no worker), 6 update flow (as 4a criterion 7 decided).

Acceptance:
- [x] `pnpm test:e2e:offline` green; run twice in a row to show it is stable.
- [x] The everyday `pnpm test:e2e` still green; `e2e/unlock.spec.ts` test renamed to say the dev server registers no worker.
- [x] No request leaves localhost: a guard that also sees worker-initiated requests (`context.on("request")` plus a check of every response URL, not only `context.route`), and the bundle check of the lab script for a media origin.
- [x] Gate green; main tree's `public/content`, `tsconfig.json` unchanged by the run; dev server untouched.

### Checkpoint 4

- [x] Both E2E commands green; evidence (test list output) pasted here.

Checkpoint 4 evidence: `pnpm test:e2e:offline`, run four times in a row on three different builds of the branch, each time the lab built `HEAD` in a temporary worktree and removed it:

```
  ✓  1 [ipad-chromium] › e2e/offline.spec.ts › 1 opens home, a subject, lessons, sections, tips and review offline from a cold start
  ✓  2 [ipad-chromium] › e2e/offline.spec.ts › 2 keeps answers given offline and leaves /api/sync alone
  ✓  3 [ipad-chromium] › e2e/offline.spec.ts › 3 video and narration say they need the network offline, and load again online
  ✓  4 [ipad-chromium] › e2e/offline.spec.ts › 4 stores no media, no caption, no song and nothing that must not be kept
  ✓  5 [ipad-chromium] › e2e/offline.spec.ts › 5 online, a device without the cookie goes to the unlock page; a device never unlocked has no worker
  ✓  6 [ipad-chromium] › e2e/offline.spec.ts › 6 a changed worker waits, the banner offers it outside a lesson, and a tap puts the new one in charge
  6 passed (11.3s)
```

Everyday `TEST_PORT=3610 pnpm test:e2e` (ports 3610, 4610, 5610 instead of 3100, 4100, 5100, to stay clear of other agents' servers): 105 passed, 7 skipped as before, exit 0. A first run found two things: the parent page's `getByRole("status")` became ambiguous (fixed, see Done) and one unlock test timed out waiting for the dev server under load (it passes alone and in the second full run).

How the E2E meets its rules: no request leaves localhost (every test ends by checking the requests and responses seen by `context.on`, which include the worker's, and the lab refuses a bundle that names the owner's real media origin); WebKit is not used (4a); the update test registers another script URL for the same scope because Playwright cannot serve a changed script to Chromium's update check; the gate cookie is created through `/api/session` because the production cookie is `Secure`; scenario 3 needs a lesson with a narration and a section-opening video whose files exist in the main tree's `public/media` (the lab links it) and skips itself otherwise.


## Task 9 (S): docs and deploy smoke

Files: `docs/spec.md` section 5.9 and the test strategy row, `docs/architecture.md` (module `offline/`, the media loading line, the manifest line, the checks table rows), `docs/operations.md` ("Kiểm trên iPad Safari" offline steps, step 9 no longer says offline is missing, deploy smoke expectations), `src/app/manifest.ts` comment, `README.md` (the new command), `scripts/lib/deploy-prod.ts` and its test (smoke: the worker script answers 200 without the cookie with `Cache-Control: no-cache`).

Acceptance:
- [x] Every doc statement checked against the code (grep for "no service worker", "chưa có offline", "không có service worker" leaves only true statements).
- [x] Durable files hold no task numbers, checkpoint names or other planning jargon (grep `Task [0-9]`, `Checkpoint`, `§`).
- [x] Gate plus `pnpm content:check` green.

### Final

- [x] Backlog index row updated; leftovers listed here; folder archived with `git mv` to `notebooks/backlogs/archive/offline-pwa/` with an "Archived: ..." line once the owner has deployed and checked the iPad.

Leftovers (none blocks the merge):
- The tab icon `/favicon.ico?favicon.<hash>.ico` that Next adds is not a precache hit, so it is a network error offline (the SVG icon is precached).
- A song cannot be told offline from a failed start when `navigator.onLine` stays true (wifi without internet): the button says "Cần mạng để nghe nhạc" only when the browser says offline or a video or narration download just failed with a network error.
- A superseded waiting worker leaves its cache until the next activation, which deletes every other build's cache.
- The offline lab and E2E need `public/media` of the main tree for scenario 3; on a machine without media the scenario skips.
- `docs/design-system.md` has no entry for the update banner or the offline lines; they use existing tokens.
- On `main`: commits 3df7eb5 to e06817c and e37cb03 (listed under "Done"); `main` was not rewritten.


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
