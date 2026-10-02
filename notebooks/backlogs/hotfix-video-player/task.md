# Hotfix: video player (owner feedback 02/10/2026)

Code-only fixes in the app's video player. Do not re-render any video and do not touch audio.

## 1. Remove the automatic pauses at checkpoints
- Owner decision: videos play straight through. They never stop by themselves to wait for "Xem tiếp". When the player paused, its overlay also covered the play button.
- Affected videos: every video whose `videos[].checkpoints` is non-empty, which is the videos built with the pacing rules. Known: Bài 12 `boi-chung-boi-chung-nho-nhat`, `on-tap-chuong-2`, Bài 2 `cach-ghi-so-tu-nhien`, Bài 3 `thu-tu-trong-tap-hop-cac-so-tu-nhien`, Bài 13 `tap-hop-cac-so-nguyen`, Bài 14 `phep-cong-phep-tru-so-nguyen`. Find the full list with a grep for `checkpoints`.
- Fix in the player (`src/components/blocks/video-player.tsx` and the checkpoint overlay): never auto-pause and never show the checkpoint overlay. Remove the checkpoint UI code instead of hiding it behind a flag, so no dead code remains.
- Keep the short think and ask pauses inside the video (1–1.5 s of silence). The owner accepted those.
- Skill and rules: in `lesson-video` (and its references), `video:check` and the build, stop requiring 1–4 `checkpoint`s. Drop the `checkpoint` marker from the script rules, or make it ignored, and drop `videos[].checkpoints` generation if nothing else uses it. If the schema changes, keep content valid and do not re-render videos.
- Tests: the player plays through with no pause. Update or remove the e2e `video-checkpoint.spec.ts`.

## 2. Subtitles cover the video on a phone in portrait
- Screenshot from an iPhone in portrait, Bài 12 video `xe-buyt`: the karaoke caption sits over the middle of the picture, on top of the content and the native controls.
- Fix with CSS or layout in the player: on narrow screens, place captions outside the picture, in a caption strip below the video inside the video card, or at least pinned to the very bottom with a smaller font. Wider screens keep the current look. Check that the native controls and the play button stay fully visible.
- Verify with contact sheets on phone portrait (390 px), iPad portrait and iPad landscape.

## Then
- Gate, then a verified deploy with `pnpm deploy:prod --ref <verified sha>`. The owner pre-approved deploys for finished work.
- Archive this folder when done.
