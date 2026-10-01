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
| Toán | Bài 8 `quan-he-chia-het-va-tinh-chat` | published (reviewed in 6 rounds, the last for the explanations of all 68 exercises, 02/10/2026; handover [`lesson-quan-he-chia-het-va-tinh-chat/task.md`](lesson-quan-he-chia-het-va-tinh-chat/task.md)) | done (voice Mỹ Duyên, overview narration and 3 videos, reviewed in round 5, ids locked; leftovers in the handover: no videos yet for the difference and later sections, `hieu-*` colour and `nhom-so-hang` example notes, caption wording of `tong-12-18-6`) |
| Toán | Bài 9 `dau-hieu-chia-het` (SBT print pages 33–34, solutions 105–106) | published (reviewed in 4 rounds, 01/10/2026, ids locked; handover [`lesson-dau-hieu-chia-het/task.md`](lesson-dau-hieu-chia-het/task.md)) | done (voice Hải Đăng, overview narration and 3 videos, reviewed in round 5, ids locked; leftovers in the handover: 5 non-blocking Góp ý in `review.md`, owner to listen to one `tim-chu-so` sentence); `explain` for all 82 exercises, reviewed in rounds 6 and 7, re-approved and ids locked (02/10/2026) |
| Toán | Bài 10 `so-nguyen-to` (SBT print pages 35–37, solutions 106–107) | published (reviewed in 6 rounds, the last for the explanations of all 65 exercises, 02/10/2026, ids locked; handover [`lesson-so-nguyen-to/task.md`](lesson-so-nguyen-to/task.md)) | done (voice Mỹ Duyên, overview narration by Gemini Vindemiatrix, 3 videos, diff-only round 4 on 01/10/2026 approved, 3 video ids locked; leftovers in the handover: 1 Nên sửa and 5 Góp ý of `review.md`, app items) |
| Toán | Bài 11 `uoc-chung-uoc-chung-lon-nhat` (SBT print pages 38–40, solutions 107–108) | published (reviewed in 4 rounds, section 5 aligned with Bài 10 on 01/10/2026, ids locked; handover [`lesson-uoc-chung-uoc-chung-lon-nhat/task.md`](lesson-uoc-chung-uoc-chung-lon-nhat/task.md)) narration and 3 videos done 01/10/2026 (voice Hải Đăng, overview narration by Gemini Achird), video and narration review round passed, approved, video ids locked, `lesson:walk` 0 failures; explanations (`explain`) for all 65 gradable items done 02/10/2026, review round 5 passed, removed from `legacy-lessons.json`; leftovers: owner listens to `cat-dai-bang` and decides on the optional extras in the handover |
| Toán | Bài 12 `boi-chung-boi-chung-nho-nhat` (SBT print pages 41–43, solutions 108–109) | draft (authored 02/10/2026: 13 sections, 67 exercises with `explain`, 6 tips, `content:check`, `visual:shot` and `lesson:walk` clean; awaiting review; handover [`lesson-boi-chung-boi-chung-nho-nhat/task.md`](lesson-boi-chung-boi-chung-nho-nhat/task.md)) | not done |
| Toán | Chương II review `on-tap-chuong-2` (SBT print pages 44–46, solutions 110; `kind: "review"`, no number, order 12.5) | draft (being authored 02/10/2026; handover [`lesson-on-tap-chuong-2/task.md`](lesson-on-tap-chuong-2/task.md)); its BCNN items must be re-checked against Bài 12 once published | not done |
| Ngữ văn | `neu-cau-muon-co-mot-nguoi-ban` | published | done |
| Địa lí | none | waiting for the first textbook pages | not done |

Bài 2 (SBT print pages 7–10, solutions 94–96), Bài 3 (11–13, solutions 96) and Bài 5 (17–20, solutions 98–100) use the same source.

## Work queue (in order)

1. Bài 11 (print page 38): align its section 5 (`nhac-thua-so`) with the published Bài 10 (definitions, wording, colours; diff-only round, see its handover) before its narration and videos. Bài 11 narration and 3 videos are built: next is its diff-only review round (greeting in `overview.hook`, 3 video blocks), then `pnpm content:hash --approve` and `pnpm content:lock`. Bài 10 narration and videos are done and reviewed (round 4).
2. Opening lines for the nine videos built before the opening-line rule: [`video-opening-retrofit/task.md`](video-opening-retrofit/task.md).
3. Bài 3, then Bài 2 (on hold until the owner resumes them; add easy-to-hard guiding steps where the workbook is hard).
4. Remove the remaining `[guides]` warnings of `content:check` (9, in `tap-hop` and `luy-thua`) by adding guide screens; see [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md).
5. First Địa lí lesson once the owner supplies pages: TopoJSON boundaries from Vietnam's point of view, `tapRegion` on maps.
6. First deploy ("usable now"): prepared locally, waiting for the owner. Family-code gate (`src/proxy.ts`, `/unlock`, `/api/session`, codes from `FAMILY_CODES`), media through `NEXT_PUBLIC_MEDIA_BASE_URL`, `vercel.json`, production build without `public/media` and with drafts left out, all verified. The owner approves and runs the external steps of [`docs/operations.md`](../../docs/operations.md): R2 bucket and CORS, upload of `public/media/`, Vercel project and env vars, push, smoke test on iPad Safari. Progress stays per device (IndexedDB) for now.
6b. Full Go-live, after the first deploy: two R2 buckets (private, public), app and admin tokens, `snapshots/` lifecycle 180 days; `BlobStore` with R2 and in-memory adapters; `/api/parent-session`, `/api/sync`, family/epoch/isAdmin checks from `families.json`, PIN lock; Dexie to R2 sync engine (If-Match, snapshots, 1 MB limit, queue, `merge`, progress migration by `retired`); performance measurement (Lighthouse, iPad trace); `/install`, PWA with `@serwist/turbopack`, precache of all content; `pnpm admin` and skill `tutor-admin`; back up the narration caches (README, "Dọn dẹp và Go-live"). Each write outside this machine needs the owner's go-ahead.
7. Later: AI feedback for open-ended writing (`AiReviewer` with a Gemini adapter, `/api/feedback`, per-family quota, self-tick fallback); quick-update channel for content (JSON schema to prompt, admin paste page, `/api/content`, overlays from R2).

## Open follow-ups

- Reset one lesson's progress from the parent page ("Học lại bài này"): [`reset-lesson-progress/task.md`](reset-lesson-progress/task.md).
- Owner feedback of 01/10/2026 (explanation after every answer, tips, overview tied to daily life, video pacing): [`feedback-2026-10-01-explain-tips-pacing/task.md`](feedback-2026-10-01-explain-tips-pacing/task.md). Next: `explain` for the four chapter II lessons, `tips.json` for Bài 8 to 11.
- Owner feedback of 01/10/2026 (new sounds, avatars, section cards; the music box was dropped): [`feedback-2026-10-01-music-avatars/task.md`](feedback-2026-10-01-music-avatars/task.md).
- Owner feedback of 01/10/2026 (sounds, stickers, background): [`feedback-2026-10-01-sounds-stickers-background/task.md`](feedback-2026-10-01-sounds-stickers-background/task.md).
- Owner feedback of 01/10/2026 (sections A and B): [`archive/feedback-2026-10-01/task.md`](archive/feedback-2026-10-01/task.md). All of it is done and archived ([`archive/feedback-2026-10-01/task.md`](archive/feedback-2026-10-01/task.md)); the voice rule and the opening-line rule live in skill `lesson-video`.
- Non-blocking leftovers per published lesson: [`lesson-dau-hieu-chia-het/task.md`](lesson-dau-hieu-chia-het/task.md), [`lesson-luy-thua/task.md`](lesson-luy-thua/task.md), [`lesson-neu-cau-muon-co-mot-nguoi-ban/task.md`](lesson-neu-cau-muon-co-mot-nguoi-ban/task.md), [`lesson-tap-hop/task.md`](lesson-tap-hop/task.md), [`lesson-thu-tu-thuc-hien-phep-tinh/task.md`](lesson-thu-tu-thuc-hien-phep-tinh/task.md).
- Owner: listen to and approve the voices of the existing videos and the Mỹ Duyên narration and videos of Bài 4; check seeking and subtitles on a real iPad Safari; decide the media bucket domain (Cloudflare domain or temporary `r2.dev`).
- Idea, not decided: supplementary exercises outside the textbook, because the child still makes mistakes on primary-school multiplication and division. Options raised: a per-subject "foundations" strand reusing the lesson system, auto-generated arithmetic drills, an entry test that finds gaps.
