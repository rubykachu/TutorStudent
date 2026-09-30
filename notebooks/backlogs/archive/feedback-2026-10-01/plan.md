# Plan: owner feedback, section A (screens and experience)

Items 1–12 of `task.md`, in one pass. Decisions and where each lives:

- Numbering (1, 2, 6): optional `number` and `chapter { numeral, name }` on a lesson (`src/schema/content.ts`, copied into `LessonSummary`); all wording built in `src/lib/lesson-label.ts`. Filled for the four published Toán lessons (Chương I); the Ngữ văn lesson stays empty because its pages print no lesson number.
- Screen kind badge (3): `src/learn/screen-badge.tsx`, used by the section and review players.
- Try-it (4): `visuals/math/thu-tu-thuc-hien-phep-tinh/try-it.tsx` holds a right tap until "Tiếp theo".
- Sounds (5): tone `tap` in `scripts/lib/sound-spec.ts`; reach it through `src/lib/feedback-sounds.tsx` (context + `useTapSound`), provided by both players.
- Back to the introduction (7): first screen's "Quay lại" opens `lessonPath?intro=1`.
- Dots (8): `SectionStepper` buttons for screens already reached, names from `stepLabels`.
- Skip (9): `ExerciseFrame` `skippable` reports `outcome.skipped`; recorded with attempt context `skipped` (never rated, never a miss); parent page lists them in "Câu đã bỏ qua".
- Guide demos (10): `GuideDemo` in `block-view.tsx` wraps every visual of a group with `guide`: labelled "Hình mẫu, chưa cần chạm", inert.
- Fill blank (11): every bank word sits invisibly in the blank's grid cell, so its width is the widest word's.
- Stickers (12): `sticker-strip.tsx` tiles are buttons (bounce, sparkle, sound) opening `sticker-sheet.tsx`.
