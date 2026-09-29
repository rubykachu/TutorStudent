# Todo: mốc "Học được"

Làm tuần tự theo `tasks/plan.md`. Lệnh verify chung ("gate"): `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`.

## 1. Scaffold dự án + design tokens
`create-next-app@16` (`--biome --app --src-dir --use-pnpm --ts --tailwind`) vào repo hiện có. Giữ `AGENTS.md` do Next sinh; `CLAUDE.md` giữ dòng `@AGENTS.md`. `@types/node` 22; Biome bản mới nhất, bật `css.parser.tailwindDirectives`. shadcn init (Radix): gán hex design-system vào biến của shadcn, xoá block `.dark`. Font Baloo 2 + Be Vietnam Pro (`latin`, `vietnamese`). Token màu/khoảng cách/bo góc/bóng vào `globals.css`. `src/lib/config.ts`, `src/lib/time.ts` (`now()`), `src/lib/id.ts` (dùng `crypto.getRandomValues`). `next.config.ts`: `allowedDevOrigins` cho LAN. Vitest 5 (`vite`, `@vitejs/plugin-react`, `jsdom`, setup stub `matchMedia`, `@vitest/coverage-v8` với threshold 90% cho `src/{schema,srs,progress,exercises/grade}`). Playwright (`ipad` WebKit 820×1180 touch, `phone` 390×844; `playwright install webkit`). Script `dev` `--hostname 0.0.0.0`.
- Acceptance:
  - `pnpm build` xanh; `/` hiển thị tiêu đề tiếng Việt bằng 2 font, nền `--color-background`.
  - 1 unit test (`config`/`id`), 1 E2E mở `/` ở 2 project.
  - Grep: không hex trong `src/` ngoài `globals.css`; không `randomUUID`.
- Verify: gate (trừ content:check) + `pnpm build` + `pnpm test:e2e`.
- Files: `package.json`, `next.config.ts`, `src/app/{layout,page}.tsx`, `src/app/globals.css`, `src/lib/{config,time,id}.ts`, `biome.json`, `vitest.config.ts`, `playwright.config.ts`, `components.json`.
- Size: M

## 2. Content schema, loader, `content:check`, `ids.lock`, nội dung tĩnh
Zod schema theo spec "Mô hình nội dung" (gồm `status` + `reviewedHash`, `sourceRef`, `RecapBlock`, block `image`, card ↔ exercise một chiều, `check.expr`). Loader + index card → exercises. Script build sinh `/content/index.json` + `/content/<lessonId>.json` (chỉ bài `published`; fixture chỉ khi `CONTENT_INCLUDE_FIXTURE=1`, Playwright `webServer` bật biến này). `content:check` (schema, tham chiếu, card ≥ 2 exercise và ≥ 1 trong `practiceIds`, section ≥ 1 check, `visualId` trong registry — stub ở task này, ids.lock với chuỗi retired, `--stats`, `--root <dir>` để kiểm thư mục tạm), `content:lock`. `content/subjects.json`. Fixture đủ 8 dạng + openEnded.
- Acceptance:
  - Unit test: fixture hợp lệ; mỗi lỗi (tham chiếu gãy, id biến mất, vòng retired, card không có câu luyện tập) báo đúng vị trí.
  - `z.toJSONSchema` trên schema lesson/exercise không throw.
  - `pnpm build` chạy `content:check` trước.
- Verify: gate + `pnpm build`.
- Files: `src/schema/content.ts`, `src/content/{load,index}.ts`, `scripts/{content-check,content-lock,content-emit}.ts`, `content/subjects.json`, `content/_fixture/**`, `tests/schema/*.test.ts`.
- Size: M

## 3. Visual registry, primitive dùng chung, `visual:shot`
Registry (id → dynamic import + `interactive`). Primitive: `DotGrid`, `BeadGroup`, `Highlight`, `ConceptMark`, `StepPlayer` (phát/tạm dừng/tua lại; từng bước khi reduced-motion). `/dev/visuals/[id]` (`notFound()` ở production). `visual:shot <lesson|all>` chụp 2 viewport vào `.shots/`, kiểm phần tử con không tràn khung.
- Acceptance: `content:check` fail khi `visualId` thiếu; ảnh fixture đã xem; test `StepPlayer` reduced-motion.
- Verify: gate + `pnpm visual:shot fixture`.
- Files: `src/visuals/registry.ts`, `src/visuals/shared/*.tsx`, `src/app/dev/visuals/[id]/page.tsx`, `scripts/visual-shot.ts`, `tests/visuals/*.test.tsx`.
- Size: M

## 4. Engine chấm + máy trạng thái 3 nấc + `ExerciseFrame`
`grade()` cho 8 dạng + bước con openEnded (NFC, input rỗng, dấu phẩy thập phân, luỹ thừa từng phần). Máy trạng thái `idle → answered → correct | wrong1 → wrong2 → wrong3 → retype → done`, xuất `firstTryCorrect`. `ExerciseFrame`: slot vùng trả lời, "Kiểm tra", highlight theo `TargetRef`, nấc 2/3 phát visual hoặc fallback (highlight đậm / `revealAnswer` của từng dạng).
- Acceptance: unit test grade mỗi dạng (đúng, sai, biên); máy trạng thái (nhập lại mới `done`; `firstTryCorrect` chỉ khi đúng ngay).
- Verify: gate.
- Files: `src/exercises/grade/*.ts`, `src/exercises/machine.ts`, `src/exercises/exercise-frame.tsx`, `tests/exercises/{grade,machine}.test.ts`.
- Size: M

## 5. UI: `choice`, `numeric`, `fillBlank`, `order`
Cắm vào `ExerciseFrame`, mỗi dạng có `revealAnswer`. `NumberPad` 3×4 phím 64px + phím "mũ". `order` dùng dnd-kit + chạm thay kéo. `/dev/exercises` (`notFound()` ở production).
- Acceptance: test component mỗi dạng: đúng; 3 nấc sai ở nhánh có visual và nhánh fallback.
- Verify: gate + xem `/dev/exercises` viewport iPad.
- Files: `src/exercises/{choice,numeric,fill-blank,order}/*.tsx`, `src/exercises/number-pad.tsx`, `src/app/dev/exercises/page.tsx`, `tests/exercises/*.test.tsx`.
- Size: M

## 6. UI: `match`, `tapText`, `tapRegion`, `manipulate`
`match` (dnd-kit + chạm thay kéo), `tapText` (chọn cả câu; line-height ≥ 2.3 ở chế độ chạm), `tapRegion` (SVG có id vùng), `manipulate` (visual nhận `onChange` + `validatorId`; fixture "xếp chấm thành hình vuông n²").
- Acceptance: như task 5.
- Verify: gate + chạm thử iPad qua LAN.
- Files: `src/exercises/{match,tap-text,tap-region,manipulate}/*.tsx`, `src/visuals/_fixture/*.tsx`, `tests/exercises/*.test.tsx`.
- Size: M

## 7. `PassageReader` + UI `openEnded`
`PassageReader`: văn bản đọc hiểu, chạm theo câu, thẻ "Theo dõi" bên lề (iPad) / dưới đoạn (điện thoại), nguồn trích. `openEnded`: chuỗi bước con → bước viết có câu mở đầu gợi ý, ô viết lớn → checklist rubric tự tick; bài viết lưu qua callback (ghi Dexie ở task 10).
- Acceptance: test component chuỗi bước + tự tick; ảnh `visual:shot` của fixture passage ở 2 viewport đã xem.
- Verify: gate.
- Files: `src/components/passage-reader.tsx`, `src/exercises/open-ended/*.tsx`, `tests/exercises/open-ended.test.tsx`.
- Size: M

**Checkpoint B**

## 8. Dexie + SRS
Dexie: `profiles`, `cardStates`, `attempts`, `sectionProgress`, `activityDays`, `stickers`, `writings` (khoá gồm `familyId` + `childId`). `src/srs`: `rate(firstTryCorrect)`; bọc ts-fsrs (`enable_short_term: false`, retention 0.9); `selectReview(now, lessonId, states, index)` (card đã mở của bài, sắp theo `retrievability` tăng dần, bỏ id mồ côi, ≤ 10, tránh exercise dùng lần trước); `countForgetting(now, lessonId)` theo `FORGETTING_THRESHOLD`.
- Acceptance: unit test: card `Again` có mức nhớ thấp hơn card `Good` nên được chọn trước; card chưa mở không vào; id mồ côi bị bỏ; mức nhớ giảm theo thời gian (dùng `now()` giả). Dexie test với `fake-indexeddb/auto`, reset DB giữa test.
- Verify: gate.
- Files: `src/progress/db.ts`, `src/srs/{rate,schedule,select}.ts`, `tests/srs/*.test.ts`, `tests/progress/db.test.ts`.
- Size: M

## 9. Hồ sơ + trang chủ + trang môn
Tạo/chọn hồ sơ (tên + avatar; bộ sách mặc định từ `subjects.json`; nhớ lựa chọn cuối). Trang chủ (lưới `SubjectTile`), trang môn (danh sách bài `published` + trạng thái).
- Acceptance: E2E: tạo hồ sơ → reload → vẫn chọn hồ sơ đó; bài `draft` không hiện.
- Verify: gate + `pnpm test:e2e`.
- Files: `src/app/(child)/{page,profiles,subjects/[subject]}/**`, `src/components/{subject-tile,big-button,profile-picker}.tsx`, `src/progress/hooks.ts`, `e2e/profile.spec.ts`.
- Size: M

## 10. Trang bài + player phần + block renderer + sticker
Renderer cho block `visual`, `formula` (KaTeX + CSS/font), `passage`, `note`, `image`, `video` (placeholder khi chưa có URL). Trang bài (danh sách phần). Player: block tuần tự → check (không rating) → luyện tập (rating mọi `cardIds`) → `Section.recap`. Ghi attempts/cardStates/sectionProgress/writings; nhớ block đang dừng; sticker khi xong mọi phần.
- Acceptance: học hết phần fixture → card có state, phần = xong; hết bài → sticker; thoát giữa chừng → mở lại đúng block. Test component player + E2E `e2e/learn.spec.ts`.
- Verify: gate + `pnpm test:e2e`.
- Files: `src/app/(child)/lessons/[lessonId]/**`, `src/components/blocks/*.tsx`, `src/components/{section-stepper,sticker-book}.tsx`, `src/progress/record.ts`, `e2e/learn.spec.ts`.
- Size: M

## 11. Ôn bài theo yêu cầu
Nút `ReviewButton` "Ôn bài này" trong trang bài (hiện khi bài có card đã mở, kèm "n thẻ sắp quên"). Phiên ôn từ `selectReview`; sau `done` hiện `Card.recap` 3 giây (chạm để qua); card `Again` hỏi lại cuối phiên bằng exercise khác (không rating). Bấm lại bao nhiêu lần cũng được.
- Acceptance:
  - Unit `tests/srs/session.test.ts`: hỏi lại cuối phiên với exercise khác; pool 1 exercise thì dùng lại; hỏi lại không rating.
  - E2E: học một phần → bấm "Ôn bài này" → sai 1 câu → câu đó hỏi lại cuối phiên; bấm ôn lần hai ngay sau vẫn được.
- Verify: gate + `pnpm test:e2e`.
- Files: `src/app/(child)/lessons/[lessonId]/review/**`, `src/components/review-button.tsx`, `src/srs/session.ts`, `tests/srs/session.test.ts`, `e2e/review.spec.ts`.
- Size: M

## 12. Linh vật + chuỗi ngày + nhắc môn + âm "ting"
Cú SVG (`happy`, `hint`, `cheer`, `welcome`, `idle`) với Motion, gắn vào `ExerciseFrame` và trang chủ. `StreakFlame` (ngày VN, tuần thứ Hai–Chủ nhật, 1 ngày nghỉ/tuần). Nhắc môn > 3 ngày. Âm "ting" khi đúng + nút tắt (lưu Dexie).
- Acceptance: unit test streak (ngày nghỉ, qua tuần, qua nửa đêm VN); ảnh 5 biểu cảm đã xem.
- Verify: gate + `pnpm visual:shot mascot`.
- Files: `src/mascot/*.tsx`, `src/progress/streak.ts`, `src/components/streak-flame.tsx`, `src/lib/sound.ts`, `tests/progress/streak.test.ts`.
- Size: M

**Checkpoint C** — xin tài liệu nguồn.

## 13. Lint nội dung tự động + glossary + cổng `status`
Luật theo spec "Kiểm duyệt nội dung" (lớp tự động): NFC; miễn `passage`; ký hiệu SGK trong phạm vi công thức; phân cách hàng nghìn U+202F; glossary + màu; allowlist âm tiết tiếng Việt; độ dài theo âm tiết; parser `check.expr`; so khớp `source-passage.txt`; `reviewedHash`; `REQUIRE_OWNER_APPROVAL`. Có thể làm ngay sau task 2 nếu muốn fixture qua lint sớm.
- Acceptance: unit test mỗi luật có ca đúng/sai, gồm ca dễ báo nhầm ("Ví dụ:", `km/h`, năm 2024, âm tiết "con", "ban"); fixture vẫn qua.
- Verify: gate.
- Files: `src/content/lint/*.ts`, `scripts/content-check.ts`, `content/glossary/{math,literature,geography}.json`, `tests/content/lint.test.ts`.
- Size: M

## 14a. Skill `lesson-review`
Chuẩn skill. Luôn chạy trong subagent mới; checklist khớp nguồn / đúng kiến thức / ngôn từ lớp 6 (Hán Việt chỉ Góp ý) / nhất quán; trích vị trí + trang (ảnh `sources/…/p<trang>.jpg`); ghi `review.md`; hết lỗi Nghiêm trọng thì ghi `reviewedHash` và đặt `published` (trừ khi `REQUIRE_OWNER_APPROVAL`).
- Acceptance: bản sao fixture trong thư mục tạm cài 4 lỗi lint không bắt được (đáp án đọc hiểu không căn cứ, gợi ý nấc 1 lộ đáp án, nội dung ngoài bài, phủ định kép) → chạy 3 lần, lần nào cũng bắt đủ.
- Verify: `pnpm content:check --root <tmp>` + 3 lần chạy skill.
- Files: `.claude/skills/lesson-review/**`.
- Size: M

## 14. Skill `lesson-author` + `lesson-visual` + `CLAUDE.md`
Chuẩn skill (frontmatter `name`, `description` có câu kích hoạt tiếng Việt; `references/`, `templates/`, `scripts/`). `lesson-author`: đọc `sources/`, biên soạn lại (không chép SGK trừ văn bản đọc hiểu), chia phần ~8 phút, số lượng tối thiểu, chia nhỏ câu hỏi mở, `sourceRef`, id bất biến, `content:check --stats` + `content:lock`. `lesson-visual`: primitive, màu khái niệm (tô cả ký hiệu trong công thức, vd cơ số cũng xanh như chú thích ● Cơ số — không chỉ số mũ), reduced-motion, `interactive`, `visual:shot` và tự xem ảnh. Trỏ tới schema, không chép. `CLAUDE.md` (giữ `@AGENTS.md`): kiến trúc, lệnh, ranh giới.
- Acceptance: không bản sao schema; mọi đường dẫn tồn tại; grep sạch tham chiếu tạm (`§`, mã task, "Phase", emoji trạng thái).
- Verify: đọc lại; dùng thật ở task 15.
- Files: `.claude/skills/{lesson-author,lesson-visual}/**`, `CLAUDE.md`.
- Size: M

## 15. Bài Toán — Luỹ thừa với số mũ tự nhiên
Dùng 3 skill với `sources/math/luy-thua/`. Phần gợi ý: khái niệm (bàn cờ + thóc, aⁿ); nhân hai luỹ thừa cùng cơ số; chia hai luỹ thừa cùng cơ số + quy ước a⁰. Màu: cơ số `blue`, số mũ `violet`.
- Acceptance: `content:check --stats` đạt tiêu chí; `review.md` sạch Nghiêm trọng; `published`; ảnh đã xem.
- Verify: gate + `pnpm visual:shot luy-thua`.
- Files: `content/math/kntt/luy-thua/{lesson.json,review.md}`, `src/visuals/math/luy-thua/*.tsx`, `content/ids.lock.json`.
- Size: M

## 16. Bài Ngữ văn — Nếu cậu muốn có một người bạn
Như task 15 với `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`: chép văn bản gốc vào `source-passage.txt`, **người dùng duyệt với ảnh** trước khi soạn; `passage` nguyên văn + nguồn; `tapText` trên văn bản thật; ≥ 1 `openEnded`.
- Acceptance: như task 15.
- Verify: gate + `pnpm visual:shot neu-cau-muon-co-mot-nguoi-ban`.
- Files: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/{lesson.json,review.md,source-passage.txt}`, `src/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/*.tsx`, `content/ids.lock.json`.
- Size: M

**Checkpoint D**

## 17. E2E + bố cục + kiểm skill
`e2e/layout.spec.ts` trên mọi route trừ `/dev/*` (`scrollWidth <= clientWidth`; phần tử tương tác ngoài dòng chữ ≥ 48×48; line-height ≥ 2.3 cho vùng chạm trong dòng chữ). Một case `reducedMotion: "reduce"`. Trong **git worktree riêng, bỏ đi sau khi kiểm**: soạn bài mẫu từ `sources/` bằng skill, qua `content:check` không sửa tay.
- Acceptance: mọi tiêu chí mốc "Học được" trong spec.
- Verify: gate + `pnpm build` + `pnpm test:e2e`.
- Files: `e2e/layout.spec.ts`, `e2e/*.spec.ts`.
- Size: M–L
