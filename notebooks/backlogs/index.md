# Current state and queue

Only what is true now and what comes next. History lives in git and `notebooks/backlogs/archive/`. Acceptance criteria of each milestone: `docs/spec.md`, "Tiêu chí thành công".

## Lessons

Source for Toán 6 tập 1 is the workbook (SBT) `/Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf`, printed page = PDF page − 1.

| Subject | Lesson (slug) | Status | Narration and video |
|---|---|---|---|
| Toán | Bài 1 `tap-hop` | published | done |
| Toán | Bài 4 `phep-cong-phep-tru` | published | done (voice Mỹ Duyên; reviewed, archived in [`archive/lesson-phep-cong-phep-tru/task.md`](archive/lesson-phep-cong-phep-tru/task.md)) |
| Toán | Bài 5 `phep-nhan-phep-chia` | published (5 review rounds, ids locked) | done (voice Hải Đăng, overview narration and 3 videos, reviewed; leftovers in [`lesson-phep-nhan-phep-chia/task.md`](lesson-phep-nhan-phep-chia/task.md): distractor d of `chon-tich-rieng-2` wording, unsplit-by-design items) |
| Toán | Bài 6 `luy-thua` | published | done |
| Toán | Bài 7 `thu-tu-thuc-hien-phep-tinh` | published | done |
| Toán | Bài 2, Bài 3 | on hold (owner, 01/10/2026: Bài 8 and later come first because the child's class is there) | not done |
| Toán | Bài 8 `quan-he-chia-het-va-tinh-chat` | published (reviewed in 4 rounds, 02/10/2026; handover [`lesson-quan-he-chia-het-va-tinh-chat/task.md`](lesson-quan-he-chia-het-va-tinh-chat/task.md)) | built, awaiting review (voice Mỹ Duyên, overview narration and 3 videos; `content:check` fails `[review-hash]` and ids of the 3 videos are not locked until the changed-parts review) |
| Toán | Bài 9 (SBT print page 33), Bài 10 (35), Bài 11 (38) | not started | not done |
| Ngữ văn | `neu-cau-muon-co-mot-nguoi-ban` | published | done |
| Địa lí | none | waiting for the first textbook pages | not done |

Bài 2 (SBT print pages 7–10, solutions 94–96), Bài 3 (11–13, solutions 96) and Bài 5 (17–20, solutions 98–100) use the same source.

## Work queue (in order)

1. Opening lines for the nine videos built before the opening-line rule: [`video-opening-retrofit/task.md`](video-opening-retrofit/task.md).
2. Bài 8 ([`lesson-quan-he-chia-het-va-tinh-chat/task.md`](lesson-quan-he-chia-het-va-tinh-chat/task.md): published; narration and videos built, next is their changed-parts review, `pnpm content:lock` and `lesson:walk`), then Bài 9 (print page 33), one subagent at a time.
3. Bài 10 (print page 35), then Bài 11 (print page 38).
4. Bài 3, then Bài 2 (on hold until the owner resumes them; add easy-to-hard guiding steps where the workbook is hard).
5. Remove the remaining `[guides]` warnings of `content:check` (9, in `tap-hop` and `luy-thua`) by adding guide screens; see [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md).
6. First Địa lí lesson once the owner supplies pages: TopoJSON boundaries from Vietnam's point of view, `tapRegion` on maps.
7. Go-live: two R2 buckets (private, public), app and admin tokens, `snapshots/` lifecycle 180 days, CORS on the public bucket (`docs/operations.md`, to be written); `BlobStore` with R2 and in-memory adapters; `/api/session`, `/api/parent-session`, `/api/sync`, `proxy.ts`, family/epoch/isAdmin checks, PIN lock; Dexie to R2 sync engine (If-Match, snapshots, 1 MB limit, queue, `merge`, progress migration by `retired`); performance measurement (Lighthouse, iPad trace); `/unlock`, `/install`, PWA with `@serwist/turbopack`, precache of all content; `pnpm admin` and skill `tutor-admin`; Vercel project (account `rubykachu`), env vars, deploy; upload `public/media/` and back up the narration caches (README, "Dọn dẹp và Go-live"). Each write outside this machine needs the owner's go-ahead.
8. Later: AI feedback for open-ended writing (`AiReviewer` with a Gemini adapter, `/api/feedback`, per-family quota, self-tick fallback); quick-update channel for content (JSON schema to prompt, admin paste page, `/api/content`, overlays from R2).

## Open follow-ups

- Owner feedback of 01/10/2026 (sections A and B): [`archive/feedback-2026-10-01/task.md`](archive/feedback-2026-10-01/task.md). All of it is done and archived ([`archive/feedback-2026-10-01/task.md`](archive/feedback-2026-10-01/task.md)); the voice rule and the opening-line rule live in skill `lesson-video`.
- Non-blocking leftovers per published lesson: [`lesson-luy-thua/task.md`](lesson-luy-thua/task.md), [`lesson-neu-cau-muon-co-mot-nguoi-ban/task.md`](lesson-neu-cau-muon-co-mot-nguoi-ban/task.md), [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md), [`lesson-thu-tu-thuc-hien-phep-tinh/task.md`](lesson-thu-tu-thuc-hien-phep-tinh/task.md).
- Owner: listen to and approve the voices of the existing videos and the Mỹ Duyên narration and videos of Bài 4; check seeking and subtitles on a real iPad Safari; decide the media bucket domain (Cloudflare domain or temporary `r2.dev`).
- Idea, not decided: supplementary exercises outside the textbook, because the child still makes mistakes on primary-school multiplication and division. Options raised: a per-subject "foundations" strand reusing the lesson system, auto-generated arithmetic drills, an entry test that finds gaps.
