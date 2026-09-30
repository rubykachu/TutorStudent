# Current state and queue

Only what is true now and what comes next. History lives in git and `notebooks/backlogs/archive/`. Acceptance criteria of each milestone: `docs/spec.md`, "Tiêu chí thành công".

## Lessons

Source for Toán 6 tập 1 is the workbook (SBT) `/Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf`, printed page = PDF page − 1.

| Subject | Lesson (slug) | Status | Narration and video |
|---|---|---|---|
| Toán | Bài 1 `tap-hop` | published | done |
| Toán | Bài 4 `phep-cong-phep-tru` | published | not done |
| Toán | Bài 5 `phep-nhan-phep-chia` | draft, only in worktree branch `worktree-agent-a36c64bad7802c3d9` (`.claude/worktrees/agent-a36c64bad7802c3d9`) | not done |
| Toán | Bài 6 `luy-thua` | published | done |
| Toán | Bài 7 `thu-tu-thuc-hien-phep-tinh` | published | done |
| Toán | Bài 2, Bài 3 | not started | not done |
| Ngữ văn | `neu-cau-muon-co-mot-nguoi-ban` | published | done |
| Địa lí | none | waiting for the first textbook pages | not done |

Bài 2 (SBT print pages 7–10, solutions 94–96), Bài 3 (11–13, solutions 96) and Bài 5 (17–20, solutions 98–100) use the same source.

## Work queue (in order)

1. Narration and video for Bài 4 `phep-cong-phep-tru` (`pnpm narration:build`, `pnpm video:build`; skill `lesson-video`).
2. Bài 5 `phep-nhan-phep-chia`: continue from [`lesson-phep-nhan-phep-chia/task.md`](lesson-phep-nhan-phep-chia/task.md).
3. Bài 3, then Bài 2 (`lesson-author`, one subagent at a time; add easy-to-hard guiding steps where the workbook is hard).
4. Remove the remaining `[guides]` warnings of `content:check` (9, in `tap-hop` and `luy-thua`) by adding guide screens; see [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md).
5. First Địa lí lesson once the owner supplies pages: TopoJSON boundaries from Vietnam's point of view, `tapRegion` on maps.
6. Go-live: two R2 buckets (private, public), app and admin tokens, `snapshots/` lifecycle 180 days, CORS on the public bucket (`docs/operations.md`, to be written); `BlobStore` with R2 and in-memory adapters; `/api/session`, `/api/parent-session`, `/api/sync`, `proxy.ts`, family/epoch/isAdmin checks, PIN lock; Dexie to R2 sync engine (If-Match, snapshots, 1 MB limit, queue, `merge`, progress migration by `retired`); performance measurement (Lighthouse, iPad trace); `/unlock`, `/install`, PWA with `@serwist/turbopack`, precache of all content; `pnpm admin` and skill `tutor-admin`; Vercel project (account `rubykachu`), env vars, deploy; upload `public/media/` and back up the narration caches (README, "Dọn dẹp và Go-live"). Each write outside this machine needs the owner's go-ahead.
7. Later: AI feedback for open-ended writing (`AiReviewer` with a Gemini adapter, `/api/feedback`, per-family quota, self-tick fallback); quick-update channel for content (JSON schema to prompt, admin paste page, `/api/content`, overlays from R2).

## Open follow-ups

- Owner feedback of 01/10/2026: [`feedback-2026-10-01/task.md`](feedback-2026-10-01/task.md). Section A (screens and experience, items 1–12) is done ([`plan.md`](feedback-2026-10-01/plan.md)); section B (video and voice, items 13–15) is open and is the same work as queue item 1 plus the voice and opening-line rules.
- Non-blocking leftovers per published lesson: [`lesson-luy-thua/task.md`](lesson-luy-thua/task.md), [`lesson-neu-cau-muon-co-mot-nguoi-ban/task.md`](lesson-neu-cau-muon-co-mot-nguoi-ban/task.md), [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md), [`lesson-thu-tu-thuc-hien-phep-tinh/task.md`](lesson-thu-tu-thuc-hien-phep-tinh/task.md).
- Owner: listen to and approve the voices of the existing videos; check seeking and subtitles on a real iPad Safari; decide the media bucket domain (Cloudflare domain or temporary `r2.dev`).
- Idea, not decided: supplementary exercises outside the textbook, because the child still makes mistakes on primary-school multiplication and division. Options raised: a per-subject "foundations" strand reusing the lesson system, auto-generated arithmetic drills, an entry test that finds gaps.
