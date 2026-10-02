# Plan: progress sync across devices

Spec: `spec.md` in this folder. Tasks with acceptance criteria and commands: `task.md`.

## Overview

Build sync from the inside out: pure schema and merge first (no I/O, fully unit-tested), then the server route over a swappable storage adapter (memory, folder, R2), then the client engine that reads Dexie, calls the route and writes the merge back, then the parent page pieces (import button, last-sync line), then the real-R2 rollout steps the owner approves. Every slice leaves the app working: with no R2 variables set, sync stays silently off and the app behaves as today, so code can be committed and even deployed before any bucket exists.

## Architecture decisions

- Full-state docs plus a dirty counter, no operation log (`spec.md`, "Design choices", item 3).
- Local records keep `familyId: "local"`; the device remembers which family it belongs to (item 2). No hook or query changes in child screens.
- One pure merge used by sync, 412 retry and import (item 4).
- Storage behind `BlobStore` with `memory`, `fs` (dev and E2E only) and `r2` adapters.
- Family id from named `FAMILY_CODES` entries (item 1; open question Q1).
- New module `src/sync/` for everything sync-specific; `src/progress/` only gains the Dexie upgrade, the reset tombstone and the dirty hook.

## Dependency graph

```
 schema + migrate (src/sync/schema.ts)
        |
        +-----------------------------+
        v                             v
 merge (src/sync/merge.ts)     Dexie upgrade: lessonResets, syncState,
        |                      profiles.updatedAt, overviewSeen times
        |                             |
        |                             v
        |                      reset writes tombstone; dirty hook
        |                             |
        |                             v
        |                      Dexie <-> doc conversion (src/sync/local.ts)
        |                             |
 family id from FAMILY_CODES          |
 + origin helper (src/access)         |
        |                             |
        v                             |
 BlobStore memory + fs                |
        |                             |
        v                             |
 /api/sync route (GET, PUT,           |
 412, snapshot, limits)               |
        |                             |
        +--------------+--------------+
                       v
              client sync engine (src/sync/engine.ts)
                       |
                       v
              triggers + mount (timers, online, hidden,
              section end, review end, Web Locks)
                       |
          +------------+-------------+
          v                          v
  parent page: last sync,     import backup JSON
  family switch guard         (merge + summary)
          |                          |
          +------------+-------------+
                       v
            two-device E2E (fs store)
                       |
                       v
            security review (fresh agent)
                       |
                       v
            R2 adapter + test:r2 (dev bucket, owner approves)
                       |
                       v
            docs: spec, architecture, operations
                       |
                       v
 [owner] bucket + token + env vars + FAMILY_CODES names -> deploy -> smoke on 2 devices
                       |
                       v
       later, own backlog: offline precache + /install
```

## Slices

Each slice is a vertical, demoable step. Tasks in `task.md` carry the same order.

### Slice 1: merge core (pure)

Schema with versions, `migrateDoc`, `mergeChildDocs`, `mergeProfileDocs`, size trimming. Property tests for commutative, associative, idempotent merge; reset tombstone cases; clock tie-breaks. Demo: `pnpm test tests/sync`.

### Slice 2: local side

Dexie upgrade, tombstone written by `resetLessonProgress`, dirty counter by table hooks (with a `SYNC_POLICY` table classifying every Dexie table, so a new table fails typecheck like `LESSON_RESET_POLICY` does), Dexie to doc conversion and back. Demo: unit tests with `fake-indexeddb` show a reset produces a tombstone and a doc round-trip loses nothing.

### Slice 3: server

Family id resolution, origin helper extracted from the session route, `BlobStore` memory and fs adapters, `/api/sync` GET and PUT with conditional writes, 412 body, size cap, rate limit, snapshot, `sync-unavailable` without env. Demo: API tests with the memory store (two interleaved clients, cross-family, origin, too large); `curl` against a local gate server with `SYNC_STORE=fs:…`.

### Slice 4: client engine and triggers

Engine: profile doc first, then each child; GET with `known`, merge, PUT, 412 retry up to 3, apply merge back to Dexie in one transaction, `syncState` bookkeeping, clock offset. Triggers: 5-minute timer, `online`, `visibilitychange` hidden, section end (`completeSection` call site), review end, one tab at a time via Web Locks. Demo: two browser windows on a local gate server with the fs store.

### Checkpoint A (after slices 1 to 4)

Owner can try sync locally on two browsers against the fs store, no cloud involved. Gate green, coverage held.

### Slice 5: parent page

Import backup JSON button next to the export (file picker, validation, preview, merge, summary), last sync time and stuck message, family switch guard. UI files: `src/components/parent/*`; coordinate with the agent working on media players, brand and bottom bar (no overlap expected, but check `git status` first).

### Slice 6: verification

Two-device E2E on a second gate dev server with the fs store (like the unlock E2E server in `e2e/targets.ts`): progress, offline, reset, import. Then a fresh-agent security review of the whole diff.

### Checkpoint B

Owner reviews the E2E evidence and the security review result before any cloud step.

### Slice 7: R2 adapter and rollout

R2 adapter with aws4fetch, `pnpm test:r2` against the dev bucket, docs updates (`docs/spec.md`, `docs/architecture.md`, `docs/operations.md` env table, token runbook, restore procedure). Then the owner-approved external steps and a production smoke on two real devices.

### Slice 8 (later, separate backlog): offline precache and `/install`

Serwist service worker, precache of app shell, published lesson JSON, visual chunks, fonts; the `/install` flow for iOS Home Screen. Large and independent of sync correctness, so it gets its own backlog (`offline-pwa`) once sync has run for a week.

## External writes (owner approval each time, never run by an agent on its own)

| Step | What | Where in `task.md` |
|---|---|---|
| Dev bucket and dev token for `pnpm test:r2` | create `tutor-progress-dev`, Object R/W token on it only, keep in `.env.local` | Task 17 |
| Run `pnpm test:r2` | real R2 calls against the dev bucket | Task 17 |
| Production private bucket | create `tutor-progress`, public access off, lifecycle rule `snapshots/` 180 days, billing notification | Task 19 |
| Production R2 token | Object R/W on `tutor-progress` only | Task 19 |
| Vercel env vars | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET` (Production, Sensitive); `FAMILY_CODES` rewritten as named entries | Task 19 |
| Deploy | `pnpm deploy:prod` per `docs/operations.md` | Task 19 |

Committing code with sync off is not an external write and can happen at every task.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| R2 conditional PUT behaves differently from the memory adapter | lost update | `pnpm test:r2` checks `If-Match` and `If-None-Match` on real R2 before rollout; memory adapter written to the same contract test |
| Merge bug wipes progress on every device | high | property tests; attempts only removed by tombstones; daily snapshots; local Dexie keeps all attempts; rollout watched on two devices first |
| Dexie upgrade fails on an existing iPad | app unusable on that device | upgrade only adds tables and fields; test opens a version-2 database built from a fixture and upgrades it |
| Applying the merge while the child is mid-section moves them | confusing jump | player keeps its in-memory position; merged position applies on next open (E2E checks) |
| Rate limit per instance is weak | cost | size cap, PUT only when dirty, conditional GET, billing alert |
| Another agent editing UI at the same time | merge conflicts | sync touches only `src/components/parent/*` and one call site each in `section-player.tsx` / `review-player.tsx`; check `git status` before those tasks; commit only own paths |
| Duplicate profiles from before sync | parent confusion | shown as two; merge tool only if it happens (Q3) |

## Open questions

Listed with recommendations in `spec.md`, "Open questions for the owner" (Q1 to Q8). Tasks that depend on an answer say so; defaults follow the recommendations.
