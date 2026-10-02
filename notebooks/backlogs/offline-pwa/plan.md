# Plan: offline support (service worker precache)

Spec: `spec.md` in this folder. Outcome of the build: the Serwist trial failed one criterion, so the worker is hand-written (`src/offline/sw-core.ts`, bundled by `scripts/offline-worker.ts`); where this plan or the spec say Serwist, read that module; evidence in `task.md`, "Findings of the Serwist trial". Tasks with acceptance criteria and commands: `task.md`.

## Overview

Build from the inside out: three pure modules first (which pages exist, what goes into the precache, how each request is answered), each fully unit-tested and with no effect on the running app. Then the service worker itself on a production build, checked against fixed criteria before anything else depends on it. Then the client side (registration, update banner, media offline states, parent readiness line), then the offline E2E on a production build, then docs. Until the registration task lands, nothing registers a worker, so every commit before it leaves the app exactly as today.

## Architecture decisions

- New module `src/offline/`: `routes.ts` (page paths, shared with the pages' `generateStaticParams`; build side only), `precache.ts` (pure list builder, no Node imports) and `precache-node.ts` (reads emitted files and hashes them), `scripts/offline-manifest.ts` (the one build step that writes the generated list, run by `pnpm build` and by the test lab), `strategy.ts` (`routeFor(request)` and `storable(response)`), `sw.ts` (the worker: wires the three modules into Serwist), `register.tsx` (client registration and update manager), `status.ts` (readiness messages between page and worker).
- One precache, no runtime cache (`spec.md` section 5). Pages and lesson JSON network first with precache fallback; build files and short sounds precache first; media, songs, `/api`, `/unlock`, RSC and cross-origin untouched.
- Activation by message only (`SKIP_WAITING`), never at install; `clients.claim()` on activation (`spec.md` section 6).
- The worker script passes the gate as an exact public path; the gate's public list becomes `BRAND_PUBLIC_PATHS` plus the worker path, composed in `src/access/gate.ts`.
- Registration only in production and only from the child layout and the parent screen.
- One network-status hook for every media player (`src/lib/network-status.ts`).
- Offline E2E has its own Playwright config and command; the everyday `pnpm test:e2e` stays on dev servers and does not build.
- Every production build for checks runs in a temporary worktree of `HEAD` (`scripts/offline-lab.ts`) with explicit test env that overrides `.env.production.local`, so the owner's tree, `public/content` and dev server are never touched and no request reaches the media bucket.

## Dependency graph

```
 routes.ts (page paths)          strategy.ts (routeFor, storable)
        |                                 |
        v                                 |
 precache.ts (list, hashes, budget)       |
        |                                 |
        +---------------+-----------------+
                        v
        Spike in the worktree lab (findings)
                        |
        Service worker on a production build
        (Serwist wiring, script route, headers,
         gate public path, bundle check)        <- Checkpoint 2: go / fallback
                        |
          +-------------+--------------+
          v             v              v
   registration +   media offline   parent readiness
   update banner    states          line (status.ts)
          |             |              |
          +-------------+--------------+
                        v
        Offline E2E (production build, gate, folder store)
                        |
                        v
        Docs (spec, architecture, operations, comments)
```

The three client tasks are independent of each other; they run one after another (one subagent at a time) in the order listed.

## Slices

1. Page paths shared with `generateStaticParams`, plus the route coverage test. No behaviour change.
2. Precache list builder and its rules (deny-list, budget, missing-file error), plus the build step that writes the list. Nothing reads it yet.
3. Request strategy table and `storable`. Not wired yet.
4a. Spike, findings only: the worktree lab script and test env, then Serwist checked against seven criteria; decision recorded.
4b. Service worker: Serwist (or the fallback), script route and headers, gate public path, bundle check over the script. Registration stays off: the worker is checked by registering it by hand in the lab production run only.
5. Registration and update manager (banner "Có bài mới, tải lại", safe-moment activation, `storage.persist()`, dev unregister).
6. Media offline states (video, narration, songs, preload).
7. Parent readiness line.
8. Offline E2E: cold start, study then sync, media, nothing stored that must not be, gate, update flow.
9. Docs and the deploy smoke step for the worker script.

## Checkpoints

- **Checkpoint 1** (after slices 1 to 3): `pnpm format && pnpm lint && pnpm typecheck && pnpm test` green; the three modules cover every row of `spec.md` sections 4 and 5 in tests. No app behaviour changed (`git diff --stat` touches only `src/offline/`, the page files' `generateStaticParams` and tests).
- **Checkpoint 2** (after slices 4a and 4b): decision recorded in `task.md`: Serwist kept or fallback taken, with the evidence for each criterion. A lab production run installs the worker from a manual registration, an offline reload of a lesson page works in Chromium, and online a changed page comes from the network.
- **Checkpoint 3** (after slices 5 to 7): gate green; local production run shows the banner flow and the parent line by hand.
- **Checkpoint 4** (after slice 8): `pnpm test:e2e:offline` green on Chromium (and WebKit if slice 4 proved it), plus the everyday `pnpm test:e2e` still green.
- **Final** (after slice 9): full gate, `pnpm content:check`, the docs say what the code does, backlog index updated, leftovers listed in `task.md`. Deploy and the iPad check are the owner's (`docs/operations.md`).

## Risks and mitigations

See `spec.md` section 12. The two that shape the order: the Serwist fit (hence slice 4 before any client work, with a stated fallback), and the production build needed by checks and the E2E (temporary worktree, explicit test env, never the owner's dev server).

## Review findings

Recorded in `task.md`, section "Plan review".
